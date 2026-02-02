// server/utils/jwt.js
const jwt = require("jsonwebtoken");

const ACCESS_EXP = "15m"; // short lived
const REFRESH_EXP = "30d"; // refresh token expiry text

function signAccess(user, secret) {
  // keep payload small
  return jwt.sign({ sub: user.id, u: user.username }, secret, { expiresIn: ACCESS_EXP });
}
function signRefresh(user, secret) {
  return jwt.sign({ sub: user.id }, secret, { expiresIn: REFRESH_EXP });
}
function verify(token, secret) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}

module.exports = { signAccess, signRefresh, verify, ACCESS_EXP, REFRESH_EXP };
