// server/middleware/auth.js
const { verify } = require("../utils/jwt");

function requireAuth(req, res, next) {
  const token = req.cookies?.access_token;
  if (!token) return res.status(401).json({ error: "No access token" });

  const payload = verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!payload) return res.status(401).json({ error: "Invalid or expired token" });

  req.user = { id: payload.sub, username: payload.u };
  next();
}

module.exports = { requireAuth };
