const { Router } = require('express');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const db = require('../db');
const { createToken, requireAuth } = require('../auth');

const router = Router();

// POST /api/register (public)
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  // ── Validate inputs ──
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email requis.' });
  }
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Mot de passe requis.' });
  }

  const cleanEmail = validator.normalizeEmail(validator.trim(email));
  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Mot de passe : 6 caractères minimum.' });
  }
  if (password.length > 128) {
    return res.status(400).json({ error: 'Mot de passe trop long (128 caractères max).' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
  if (existing) return res.status(409).json({ error: 'Cet email est déjà utilisé.' });

  const hash = bcrypt.hashSync(password, 12); // 12 rounds (stronger than 10)
  const result = db.prepare(
    'INSERT INTO users (email, password) VALUES (?, ?)'
  ).run(cleanEmail, hash);

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
  const token = createToken(user);

  console.log(`[AUTH] New user registered: ${cleanEmail}`);

  res.json({
    token,
    user: { id: user.id, email: user.email, plan: user.plan, credits: user.credits, is_admin: user.is_admin }
  });
});

// POST /api/login (public)
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  const cleanEmail = validator.normalizeEmail(validator.trim(email));
  if (!validator.isEmail(cleanEmail)) {
    return res.status(400).json({ error: 'Adresse email invalide.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
  if (!user) return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
  }

  const token = createToken(user);

  res.json({
    token,
    user: { id: user.id, email: user.email, plan: user.plan, credits: user.credits, is_admin: user.is_admin }
  });
});

// GET /api/me — current user info (protected)
router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT id, email, plan, credits, google_key, anthropic_key, is_admin, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });
  res.json({ user });
});

// PUT /api/me/keys — update API keys (protected)
router.put('/me/keys', requireAuth, (req, res) => {
  const { google_key, anthropic_key } = req.body;

  // Validate key formats (basic check)
  const gKey = typeof google_key === 'string' ? validator.trim(google_key).substring(0, 100) : '';
  const aKey = typeof anthropic_key === 'string' ? validator.trim(anthropic_key).substring(0, 200) : '';

  db.prepare('UPDATE users SET google_key = ?, anthropic_key = ? WHERE id = ?')
    .run(gKey, aKey, req.user.id);
  res.json({ ok: true });
});

module.exports = router;
