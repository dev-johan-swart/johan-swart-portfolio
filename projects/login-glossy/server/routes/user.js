// server/routes/user.js
const express = require("express");
const db = require("../db");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const { requireAuth } = require("../middleware/auth");
const { verify } = require("../utils/jwt");

const router = express.Router();

// GET profile
router.get("/me", requireAuth, (req, res) => {
  db.get(`SELECT id, username, email, totp_enabled FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  });
});

// 2FA Setup (returns secret and QR)
router.post("/2fa/setup", requireAuth, (req, res) => {
  const secret = speakeasy.generateSecret({ name: `GlossyLogin (${req.user.username})` });
  // store temp secret in session
  req.session.temp_totp_secret = secret.base32;
  // generate QR data URL
  qrcode.toDataURL(secret.otpauth_url).then((url) => {
    res.json({ secret: secret.base32, qr: url });
  }).catch(err => res.status(500).json({ error: "QR failed" }));
});

// 2FA Verify & enable
router.post("/2fa/verify", requireAuth, (req, res) => {
  const token = req.body.token;
  const secret = req.session.temp_totp_secret;
  if (!secret) return res.status(400).json({ error: "No setup in progress" });
  const ok = speakeasy.totp.verify({ secret, encoding: "base32", token, window: 1 });
  if (!ok) return res.status(400).json({ error: "Invalid token" });

  // save secret and enable
  db.run(`UPDATE users SET totp_secret = ?, totp_enabled = 1 WHERE id = ?`, [secret, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    delete req.session.temp_totp_secret;
    res.json({ ok: true });
  });
});

// disable 2FA
router.post("/2fa/disable", requireAuth, (req, res) => {
  db.run(`UPDATE users SET totp_secret = NULL, totp_enabled = 0 WHERE id = ?`, [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.json({ ok: true });
  });
});

module.exports = router;
