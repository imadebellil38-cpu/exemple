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
    { id: userObj.id, email: userObj.email, is_admin: userObj.is_admin || 0 },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function insertUser(email = 'user@test.com') {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('password123', 10);
  const result = mockDb.prepare(
    'INSERT INTO users (email, password, plan, credits) VALUES (?, ?, ?, ?)'
  ).run(email, hash, 'free', 5);
  return { id: Number(result.lastInsertRowid), email, is_admin: 0 };
}

function insertProspect(userId, overrides = {}) {
  const data = {
    name: 'Boulangerie Test',
    phone: '0612345678',
    address: '1 rue de Paris',
    rating: 4.5,
    reviews: 20,
    city: 'Paris',
    status: 'todo',
    notes: '',
    rappel: '',
    niche: 'boulangerie',
    search_id: 1,
    ...overrides,
  };
  const result = mockDb.prepare(
    `INSERT INTO prospects (user_id, name, phone, address, rating, reviews, city, status, notes, rappel, niche, search_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(userId, data.name, data.phone, data.address, data.rating, data.reviews, data.city, data.status, data.notes, data.rappel, data.niche, data.search_id);
  return { id: Number(result.lastInsertRowid), user_id: userId, ...data };
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
  const prospectsRoutes = require('../routes/prospects');

  app = express();
  app.use(express.json());
  app.use('/api/prospects', requireAuth, prospectsRoutes);
});

afterEach(() => {
  if (mockDb) mockDb.close();
});

describe('GET /api/prospects', () => {
  test('should return prospects for authenticated user', async () => {
    const user = insertUser();
    const token = makeToken(user);
    insertProspect(user.id, { name: 'Prospect A', phone: '0600000001' });
    insertProspect(user.id, { name: 'Prospect B', phone: '0600000002' });

    const res = await request(app)
      .get('/api/prospects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].name).toBeDefined();
  });

  test('should return empty array for user with no prospects', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .get('/api/prospects')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('should reject without token', async () => {
    const res = await request(app).get('/api/prospects');
    expect(res.status).toBe(401);
  });

  test('should not return prospects of another user', async () => {
    const user1 = insertUser('user1@test.com');
    const user2 = insertUser('user2@test.com');
    insertProspect(user1.id, { name: 'Prospect de User1', phone: '0611111111' });
    insertProspect(user2.id, { name: 'Prospect de User2', phone: '0622222222' });

    const token2 = makeToken(user2);
    const res = await request(app)
      .get('/api/prospects')
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Prospect de User2');
  });
});

describe('PUT /api/prospects/:id/status', () => {
  test('should update status with valid value', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'called' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updated = mockDb.prepare('SELECT status FROM prospects WHERE id = ?').get(prospect.id);
    expect(updated.status).toBe('called');
  });

  test('should accept all valid statuses', async () => {
    const user = insertUser();
    const token = makeToken(user);

    for (const status of ['todo', 'called', 'nope', 'client']) {
      const prospect = insertProspect(user.id, { phone: `06000000${Math.random()}` });
      const res = await request(app)
        .put(`/api/prospects/${prospect.id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status });
      expect(res.status).toBe(200);
    }
  });

  test('should reject invalid status', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'invalid_status' });

    expect(res.status).toBe(400);
  });

  test('should reject invalid ID', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .put('/api/prospects/abc/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'called' });

    expect(res.status).toBe(400);
  });

  test('should return 404 for non-existent prospect', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .put('/api/prospects/9999/status')
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'called' });

    expect(res.status).toBe(404);
  });

  test('should not allow modifying another user prospect', async () => {
    const user1 = insertUser('user1@test.com');
    const user2 = insertUser('user2@test.com');
    const prospect = insertProspect(user1.id);

    const token2 = makeToken(user2);
    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/status`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ status: 'called' });

    expect(res.status).toBe(404);

    // Original status should remain unchanged
    const row = mockDb.prepare('SELECT status FROM prospects WHERE id = ?').get(prospect.id);
    expect(row.status).toBe('todo');
  });
});

describe('PUT /api/prospects/:id/notes', () => {
  test('should update notes, rappel and owner_name', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: 'Rappeler lundi', rappel: '2026-03-15', owner_name: 'Martin' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const updated = mockDb.prepare('SELECT notes, rappel, owner_name FROM prospects WHERE id = ?').get(prospect.id);
    expect(updated.notes).toBe('Rappeler lundi');
    expect(updated.rappel).toBe('2026-03-15');
    expect(updated.owner_name).toBe('Martin');
  });

  test('should return 404 for another user prospect', async () => {
    const user1 = insertUser('user1@test.com');
    const user2 = insertUser('user2@test.com');
    const prospect = insertProspect(user1.id);

    const token2 = makeToken(user2);
    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/notes`)
      .set('Authorization', `Bearer ${token2}`)
      .send({ notes: 'Tentative' });

    expect(res.status).toBe(404);
  });

  test('should handle missing fields gracefully (defaults to empty strings)', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(200);
    const updated = mockDb.prepare('SELECT notes, rappel, owner_name FROM prospects WHERE id = ?').get(prospect.id);
    expect(updated.notes).toBe('');
    expect(updated.rappel).toBe('');
    expect(updated.owner_name).toBe('');
  });

  test('should truncate long notes', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const longNotes = 'x'.repeat(3000);
    const res = await request(app)
      .put(`/api/prospects/${prospect.id}/notes`)
      .set('Authorization', `Bearer ${token}`)
      .send({ notes: longNotes });

    expect(res.status).toBe(200);
    const updated = mockDb.prepare('SELECT notes FROM prospects WHERE id = ?').get(prospect.id);
    expect(updated.notes.length).toBeLessThanOrEqual(2000);
  });
});

describe('DELETE /api/prospects/:id', () => {
  test('should delete own prospect', async () => {
    const user = insertUser();
    const token = makeToken(user);
    const prospect = insertProspect(user.id);

    const res = await request(app)
      .delete(`/api/prospects/${prospect.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);

    const row = mockDb.prepare('SELECT id FROM prospects WHERE id = ?').get(prospect.id);
    expect(row).toBeUndefined();
  });

  test('should not delete another user prospect', async () => {
    const user1 = insertUser('user1@test.com');
    const user2 = insertUser('user2@test.com');
    const prospect = insertProspect(user1.id);

    const token2 = makeToken(user2);
    const res = await request(app)
      .delete(`/api/prospects/${prospect.id}`)
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(404);

    // Prospect should still exist
    const row = mockDb.prepare('SELECT id FROM prospects WHERE id = ?').get(prospect.id);
    expect(row).toBeDefined();
  });

  test('should reject invalid ID (zero)', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .delete('/api/prospects/0')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });

  test('should return 404 for non-existent prospect', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .delete('/api/prospects/99999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /api/prospects/searches', () => {
  test('should return search history for user', async () => {
    const user = insertUser();
    const token = makeToken(user);

    mockDb.prepare(
      'INSERT INTO searches (user_id, niche, country, results_count, search_mode) VALUES (?, ?, ?, ?, ?)'
    ).run(user.id, 'boulangerie', 'fr', 10, 'site');
    mockDb.prepare(
      'INSERT INTO searches (user_id, niche, country, results_count, search_mode) VALUES (?, ?, ?, ?, ?)'
    ).run(user.id, 'plombier', 'fr', 5, 'social');

    const res = await request(app)
      .get('/api/prospects/searches')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].niche).toBeDefined();
    expect(res.body[0].search_mode).toBeDefined();
  });

  test('should not return searches of another user', async () => {
    const user1 = insertUser('user1@test.com');
    const user2 = insertUser('user2@test.com');

    mockDb.prepare(
      'INSERT INTO searches (user_id, niche, country, results_count, search_mode) VALUES (?, ?, ?, ?, ?)'
    ).run(user1.id, 'boulangerie', 'fr', 10, 'site');

    const token2 = makeToken(user2);
    const res = await request(app)
      .get('/api/prospects/searches')
      .set('Authorization', `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});
