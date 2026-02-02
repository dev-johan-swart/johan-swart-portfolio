// server.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const USERS_FILE = path.join(__dirname, 'users.json');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://127.0.0.1:5500';

// Helpers
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  try { return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')); }
  catch { return []; }
}
function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

// Health check
app.get('/', (req, res) => res.json({ msg: 'Server up' }));

// Register
app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ msg: 'Missing fields' });

  const users = readUsers();
  if (users.find(u => u.email === email)) return res.status(400).json({ msg: 'Email exists' });

  const hashed = bcrypt.hashSync(password, 12);
  users.push({ email, password: hashed });
  writeUsers(users);
  res.json({ msg: 'User registered' });
});

// Login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsers();
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });
  res.cookie('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  });
  res.json({ msg: 'Logged in' });
});

// Profile
app.get('/profile', (req, res) => {
  const token = req.cookies.session;
  if (!token) return res.status(401).json({ msg: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ email: decoded.email });
  } catch { res.status(401).json({ msg: 'Invalid token' }); }
});

// Logout
app.post('/logout', (req, res) => {
  res.clearCookie('session', { path: '/' });
  res.json({ msg: 'Logged out' });
});

// Start server
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
