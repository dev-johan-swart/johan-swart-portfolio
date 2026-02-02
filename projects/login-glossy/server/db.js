// server/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("DB open error:", err);
  else console.log("SQLite DB ready:", dbPath);
});

// users table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    password TEXT,
    totp_secret TEXT,
    totp_enabled INTEGER DEFAULT 0,
    reset_token TEXT,
    reset_expires INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    token TEXT UNIQUE,
    user_id INTEGER,
    expires INTEGER,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );`);
});

module.exports = db;
