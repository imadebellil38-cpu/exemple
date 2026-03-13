const db = require('../db');

// ── Persistent DB cache (TTL 7 days) ──
const CACHE_TTL_DAYS = 7;

function getCacheKey(niche, countryOrGeo, searchMode) {
  return `${niche.toLowerCase().trim()}|${countryOrGeo}|${searchMode}`;
}

function getCachedResults(key) {
  const row = db.prepare(
    `SELECT results_json FROM search_cache WHERE cache_key = ? AND created_at > datetime('now', '-' || ? || ' days')`
  ).get(key, CACHE_TTL_DAYS);
  if (!row) return null;
  try { return JSON.parse(row.results_json); } catch { return null; }
}

function setCachedResults(key, data) {
  // Upsert: replace if same key exists
  db.prepare(
    `INSERT INTO search_cache (cache_key, results_json, created_at) VALUES (?, ?, datetime('now'))
     ON CONFLICT(cache_key) DO UPDATE SET results_json = excluded.results_json, created_at = datetime('now')`
  ).run(key, JSON.stringify(data));
  // Clean expired entries periodically
  db.prepare(`DELETE FROM search_cache WHERE created_at < datetime('now', '-' || ? || ' days')`).run(CACHE_TTL_DAYS);
}

module.exports = { getCacheKey, getCachedResults, setCachedResults };
