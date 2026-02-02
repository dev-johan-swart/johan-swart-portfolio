// server/server.js
require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// simple session used to hold temp 2FA secret during setup
app.use(session({
  secret: process.env.SESSION_SECRET || "sess-secret",
  resave: false,
  saveUninitialized: true,
  cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" }
}));

// serve client static
app.use(express.static(path.join(__dirname, "..", "client")));

// mount routes
app.use("/api", authRoutes);       // endpoints: /api/register etc.
app.use("/api/user", userRoutes);  // endpoints: /api/user/me, /api/user/2fa/*

// helper to clear cookies on server root logout path if needed
app.get("/logout", (req, res) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.redirect("/");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
