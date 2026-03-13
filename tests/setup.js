// Test setup — creates an in-memory SQLite database mimicking the real schema
process.env.JWT_SECRET = 'test-secret-key-for-testing';
process.env.NODE_ENV = 'test';

const Database = require('better-sqlite3');

function createTestDb() {
  const db = new Database(':memory:');
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      plan TEXT DEFAULT 'free',
      credits INTEGER DEFAULT 5,
      google_key TEXT DEFAULT '',
      anthropic_key TEXT DEFAULT '',
      is_admin INTEGER DEFAULT 0,
      referral_code TEXT,
      referred_by INTEGER,
      reset_token TEXT,
      reset_token_expires DATETIME,
      stripe_customer_id TEXT,
      stripe_subscription_id TEXT,
      trial_ends_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS prospects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT,
      phone TEXT,
      address TEXT,
      rating REAL,
      reviews INTEGER DEFAULT 0,
      city TEXT,
      status TEXT DEFAULT 'todo',
      notes TEXT DEFAULT '',
      rappel TEXT DEFAULT '',
      niche TEXT DEFAULT '',
      search_id INTEGER,
      website_url TEXT DEFAULT '',
      has_facebook INTEGER DEFAULT -1,
      has_instagram INTEGER DEFAULT -1,
      has_tiktok INTEGER DEFAULT -1,
      search_mode TEXT DEFAULT 'site',
      owner_name TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      niche TEXT,
      country TEXT,
      results_count INTEGER DEFAULT 0,
      search_mode TEXT DEFAULT 'site',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS search_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cache_key TEXT UNIQUE NOT NULL,
      results_json TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_search_cache_key ON search_cache(cache_key);
  `);

  return db;
}

module.exports = { createTestDb };
