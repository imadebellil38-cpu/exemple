const request = require('supertest');
const express = require('express');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';

const { createTestDb } = require('./setup');
const jwt = require('jsonwebtoken');

let mockDb;

jest.mock('../db', () => {
  return new Proxy({}, {
    get(_, prop) {
      return mockDb[prop];
    }
  });
});

jest.mock('../services/email', () => ({
  sendResetEmail: jest.fn().mockResolvedValue(false),
  isEmailConfigured: jest.fn().mockReturnValue(false),
}));

let app;

function makeToken(userObj) {
  return jwt.sign(
    { id: userObj.id, email: userObj.email, is_admin: userObj.is_admin },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function insertUser(email = 'user@test.com', isAdmin = 0) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('password123', 10);
  const result = mockDb.prepare(
    'INSERT INTO users (email, password, plan, credits, is_admin) VALUES (?, ?, ?, ?, ?)'
  ).run(email, hash, 'free', 5, isAdmin);
  return { id: Number(result.lastInsertRowid), email, is_admin: isAdmin };
}

beforeEach(() => {
  mockDb = createTestDb();
  jest.resetModules();

  jest.doMock('../db', () => mockDb);
  jest.doMock('../services/email', () => ({
    sendResetEmail: jest.fn().mockResolvedValue(false),
    isEmailConfigured: jest.fn().mockReturnValue(false),
  }));

  const { requireAuth } = require('../auth');
  const adminRoutes = require('../routes/admin');

  app = express();
  app.use(express.json());
  app.use('/api/admin', requireAuth, adminRoutes);
});

afterEach(() => {
  if (mockDb) mockDb.close();
});

describe('Admin middleware — access control', () => {
  test('should reject non-admin user with 403', async () => {
    const user = insertUser('regular@test.com', 0);
    const token = makeToken(user);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/[Aa]dministrateur/);
  });

  test('should reject unauthenticated requests with 401', async () => {
    const res = await request(app).get('/api/admin/users');
    expect(res.status).toBe(401);
  });

  test('should allow admin user', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

describe('GET /api/admin/users', () => {
  test('should return list of all users', async () => {
    const admin = insertUser('admin@test.com', 1);
    insertUser('user1@test.com', 0);
    insertUser('user2@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3); // admin + 2 users
    expect(res.body[0].email).toBeDefined();
    expect(res.body[0].plan).toBeDefined();
    expect(res.body[0].credits).toBeDefined();
    // Password should not be exposed
    expect(res.body[0].password).toBeUndefined();
  });
});

describe('GET /api/admin/stats', () => {
  test('should return global stats for admin', async () => {
    const admin = insertUser('admin@test.com', 1);
    insertUser('user1@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.totalUsers).toBeDefined();
    expect(res.body.totalSearches).toBeDefined();
    expect(res.body.totalProspects).toBeDefined();
    expect(res.body.planCounts).toBeDefined();
    expect(res.body.totalUsers).toBe(2);
  });

  test('should reject non-admin with 403', async () => {
    const user = insertUser('regular@test.com', 0);
    const token = makeToken(user);

    const res = await request(app)
      .get('/api/admin/stats')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/admin/users/:id/credits', () => {
  test('should set credits for a user', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/credits`)
      .set('Authorization', `Bearer ${token}`)
      .send({ credits: 100 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updated = mockDb.prepare('SELECT credits FROM users WHERE id = ?').get(user.id);
    expect(updated.credits).toBe(100);
  });

  test('should reject negative credits', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/credits`)
      .set('Authorization', `Bearer ${token}`)
      .send({ credits: -5 });

    expect(res.status).toBe(400);
  });

  test('should reject credits over 100000', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/credits`)
      .set('Authorization', `Bearer ${token}`)
      .send({ credits: 200000 });

    expect(res.status).toBe(400);
  });

  test('should return 404 for non-existent user', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .put('/api/admin/users/9999/credits')
      .set('Authorization', `Bearer ${token}`)
      .send({ credits: 50 });

    expect(res.status).toBe(404);
  });

  test('should reject non-admin', async () => {
    const user = insertUser('regular@test.com', 0);
    const token = makeToken(user);

    const res = await request(app)
      .put('/api/admin/users/1/credits')
      .set('Authorization', `Bearer ${token}`)
      .send({ credits: 100 });

    expect(res.status).toBe(403);
  });
});

describe('PUT /api/admin/users/:id/plan', () => {
  test('should change user plan', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/plan`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan: 'pro' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updated = mockDb.prepare('SELECT plan, credits FROM users WHERE id = ?').get(user.id);
    expect(updated.plan).toBe('pro');
    expect(updated.credits).toBe(100); // pro = 100 credits
  });

  test('should reject invalid plan', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/plan`)
      .set('Authorization', `Bearer ${token}`)
      .send({ plan: 'super_mega_plan' });

    expect(res.status).toBe(400);
  });

  test('should return 404 for non-existent user', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .put('/api/admin/users/9999/plan')
      .set('Authorization', `Bearer ${token}`)
      .send({ plan: 'pro' });

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/admin/users/:id/admin', () => {
  test('should toggle admin status', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .send({ is_admin: true });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updated = mockDb.prepare('SELECT is_admin FROM users WHERE id = ?').get(user.id);
    expect(updated.is_admin).toBe(1);
  });

  test('should remove admin status', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('admin2@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .put(`/api/admin/users/${user.id}/admin`)
      .set('Authorization', `Bearer ${token}`)
      .send({ is_admin: false });

    expect(res.status).toBe(200);
    const updated = mockDb.prepare('SELECT is_admin FROM users WHERE id = ?').get(user.id);
    expect(updated.is_admin).toBe(0);
  });
});

describe('GET /api/admin/searches', () => {
  test('should return recent searches', async () => {
    const admin = insertUser('admin@test.com', 1);
    const user = insertUser('user@test.com', 0);
    const token = makeToken(admin);

    mockDb.prepare(
      'INSERT INTO searches (user_id, niche, country, results_count, search_mode) VALUES (?, ?, ?, ?, ?)'
    ).run(user.id, 'boulangerie', 'fr', 10, 'site');

    const res = await request(app)
      .get('/api/admin/searches')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].niche).toBe('boulangerie');
    expect(res.body[0].email).toBe('user@test.com');
  });
});

describe('GET /api/admin/stats/revenue', () => {
  test('should return MRR calculation', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/stats/revenue')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.mrr).toBeDefined();
    expect(typeof res.body.mrr).toBe('number');
    expect(res.body.planCounts).toBeDefined();
  });
});

describe('GET /api/admin/stats/daily', () => {
  test('should return daily stats', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/stats/daily')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.registrations).toBeDefined();
    expect(res.body.searches).toBeDefined();
    expect(Array.isArray(res.body.registrations)).toBe(true);
  });
});

describe('GET /api/admin/stats/top-users', () => {
  test('should return top users', async () => {
    const admin = insertUser('admin@test.com', 1);
    const token = makeToken(admin);

    const res = await request(app)
      .get('/api/admin/stats/top-users')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.bySearches).toBeDefined();
    expect(res.body.byProspects).toBeDefined();
    expect(Array.isArray(res.body.bySearches)).toBe(true);
  });
});
