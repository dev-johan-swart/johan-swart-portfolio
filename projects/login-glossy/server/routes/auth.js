// server/routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const db = require("../db");
const { signAccess, signRefresh, verify } = require("../utils/jwt");
const nodemailer = require("nodemailer");

const router = express.Router();

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || "access-secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh-secret";
const FRONTEND_BASE = process.env.FRONTEND_BASE || ""; // e.g., http://localhost:4000

// Nodemailer transporter (configure via .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.example.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || ""
  }
});

// helper to set cookies
function setTokens(res, user) {
  const access = signAccess(user, ACCESS_SECRET);
  const refresh = signRefresh(user, REFRESH_SECRET);

  // store refresh token in DB with expiry timestamp
  const decoded = verify(refresh, REFRESH_SECRET);
  const expTs = decoded ? decoded.exp * 1000 : Date.now() + 30 * 24 * 3600 * 1000;

  db.run(
    `INSERT INTO refresh_tokens (token, user_id, expires) VALUES (?, ?, ?)`,
    [refresh, user.id, expTs],
    (err) => {
      if (err) console.error("Failed to store refresh token", err);
    }
  );

  // set cookies (httpOnly)
  const cookieOpts = {
    httpOnly: true,
    sameSite: "lax",
    // secure: true in production (set via NODE_ENV)
    secure: process.env.NODE_ENV === "production",
    maxAge: 15 * 60 * 1000 // 15min for access cookie
  };
  res.cookie("access_token", access, cookieOpts);
  // refresh cookie lasts longer
  res.cookie("refresh_token", refresh, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 3600 * 1000
  });
}

// REGISTER
router.post(
  "/register",
  [
    body("username").isLength({ min: 3 }).trim().escape(),
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 })
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { username, email, password } = req.body;
    const hashed = bcrypt.hashSync(password, 12);

    const sql = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.run(sql, [username, email, hashed], function (err) {
      if (err) {
        console.error(err);
        return res.status(400).json({ error: "User exists or DB error" });
      }
      const user = { id: this.lastID, username, email };
      setTokens(res, user);
      res.json({ ok: true, user: { id: user.id, username: user.username, email } });
    });
  }
);

// LOGIN
router.post(
  "/login",
  [body("username").exists(), body("password").exists(), body("totp").optional()],
  (req, res) => {
    const { username, password, totp } = req.body;
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err) return res.status(500).json({ error: "DB error" });
      if (!user) return res.status(401).json({ error: "Invalid credentials" });
      if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: "Invalid credentials" });

      // if 2FA enabled, require totp
      if (user.totp_enabled) {
        if (!totp) return res.status(403).json({ error: "TOTP required" });
        const speakeasy = require("speakeasy");
        const ok = speakeasy.totp.verify({ secret: user.totp_secret, encoding: "base32", token: totp, window: 1 });
        if (!ok) return res.status(403).json({ error: "Invalid TOTP" });
      }

      const u = { id: user.id, username: user.username };
      setTokens(res, u);
      res.json({ ok: true, user: { id: user.id, username: user.username, email: user.email } });
    });
  }
);

// REFRESH
router.post("/refresh", (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  const payload = verify(token, REFRESH_SECRET);
  if (!payload) return res.status(401).json({ error: "Invalid refresh token" });

  // check DB for existence and expiry
  db.get(`SELECT * FROM refresh_tokens WHERE token = ?`, [token], (err, row) => {
    if (err || !row) return res.status(401).json({ error: "Invalid refresh token" });
    if (row.expires < Date.now()) return res.status(401).json({ error: "Refresh expired" });

    // get user and issue new access token
    db.get(`SELECT id, username, email FROM users WHERE id = ?`, [row.user_id], (err2, user) => {
      if (err2 || !user) return res.status(401).json({ error: "Invalid user" });

      // issue new access token only (keep refresh)
      const access = signAccess(user, ACCESS_SECRET);
      res.cookie("access_token", access, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
      });
      res.json({ ok: true });
    });
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  const rtoken = req.cookies?.refresh_token;
  if (rtoken) {
    db.run(`DELETE FROM refresh_tokens WHERE token = ?`, [rtoken], (e) => {
      if (e) console.error("Failed remove refresh token", e);
    });
  }
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ ok: true });
});

// REQUEST PASSWORD RESET
router.post("/reset-request", [body("email").isEmail().normalizeEmail()], (req, res) => {
  const { email } = req.body;
  db.get(`SELECT id, email, username FROM users WHERE email = ?`, [email], (err, user) => {
    if (err || !user) return res.json({ ok: true }); // don't reveal existence

    const token = crypto.randomBytes(24).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    db.run(`UPDATE users SET reset_token = ?, reset_expires = ? WHERE id = ?`, [token, expires, user.id], (e) => {
      if (e) console.error(e);
      // send email with link
      const resetUrl = `${FRONTEND_BASE}/reset-password.html?token=${token}&id=${user.id}`;
      const mail = {
        from: process.env.SMTP_FROM || "noreply@example.com",
        to: user.email,
        subject: "Password reset",
        text: `Reset your password: ${resetUrl}`,
        html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p>`
      };
      transporter.sendMail(mail, (errMail) => {
        if (errMail) console.error("Mail error:", errMail);
      });
      // always return ok to caller
      res.json({ ok: true });
    });
  });
});

// PERFORM PASSWORD RESET
router.post("/reset", [body("id").exists(), body("token").exists(), body("password").isLength({ min: 6 })], (req, res) => {
  const { id, token, password } = req.body;
  db.get(`SELECT reset_token, reset_expires FROM users WHERE id = ?`, [id], (err, row) => {
    if (err || !row) return res.status(400).json({ error: "Invalid request" });
    if (!row.reset_token || row.reset_token !== token || row.reset_expires < Date.now()) return res.status(400).json({ error: "Invalid or expired token" });
    const hashed = bcrypt.hashSync(password, 12);
    db.run(`UPDATE users SET password = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?`, [hashed, id], (e) => {
      if (e) return res.status(500).json({ error: "DB error" });
      res.json({ ok: true });
    });
  });
});

module.exports = router;
