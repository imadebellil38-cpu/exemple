const request = require('supertest');
const express = require('express');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.ANTHROPIC_API_KEY = 'fake-anthropic-key';

const { createTestDb } = require('./setup');
const jwt = require('jsonwebtoken');

let mockDb;
let mockHttpsRequest;

jest.mock('../db', () => {
  return new Proxy({}, {
    get(_, prop) {
      return mockDb[prop];
    }
  });
});

// Mock https to intercept Anthropic API calls
jest.mock('https', () => {
  const { PassThrough } = require('stream');
  return {
    request: jest.fn((options, callback) => {
      if (mockHttpsRequest) {
        return mockHttpsRequest(options, callback);
      }
      // Default: successful Anthropic response
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({
          content: [{ type: 'text', text: 'Bonjour, je suis un pitch de test.' }],
        }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    }),
    get: jest.fn(),
  };
});

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
    'INSERT INTO users (email, password, plan, credits, anthropic_key) VALUES (?, ?, ?, ?, ?)'
  ).run(email, hash, 'pro', 50, '');
  return { id: Number(result.lastInsertRowid), email, is_admin: 0 };
}

function makeAnthropicResponse(text, statusCode = 200) {
  const { PassThrough } = require('stream');
  return (options, callback) => {
    const res = new PassThrough();
    res.statusCode = statusCode;
    callback(res);
    process.nextTick(() => {
      if (statusCode === 200) {
        res.emit('data', JSON.stringify({
          content: [{ type: 'text', text }],
        }));
      } else {
        res.emit('data', JSON.stringify({
          error: { message: 'API Error' },
        }));
      }
      res.emit('end');
    });
    const req = new PassThrough();
    req.setTimeout = jest.fn();
    return req;
  };
}

beforeEach(() => {
  mockDb = createTestDb();
  mockHttpsRequest = null;

  jest.resetModules();
  jest.doMock('../db', () => mockDb);

  process.env.ANTHROPIC_API_KEY = 'fake-anthropic-key';

  const { requireAuth } = require('../auth');
  const pitchRoutes = require('../routes/pitch');

  app = express();
  app.use(express.json());
  app.use('/api/pitch', requireAuth, pitchRoutes);
});

afterEach(() => {
  if (mockDb) mockDb.close();
});

const validProspect = {
  name: 'Boulangerie Martin',
  phone: '01 23 45 67 89',
  address: '10 rue du Pain, Paris',
  city: 'Paris',
  rating: 4.5,
  reviews: 120,
};

describe('POST /api/pitch — input validation', () => {
  test('should reject missing prospect', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', pitchType: 'appel' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/prospect/i);
  });

  test('should reject prospect without name', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: { phone: '0123456789' }, niche: 'boulangerie' });

    expect(res.status).toBe(400);
  });

  test('should reject missing niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: validProspect, pitchType: 'appel' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/[Nn]iche/);
  });

  test('should reject empty niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: validProspect, niche: '   ', pitchType: 'appel' });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/pitch — Anthropic API mock', () => {
  test('should generate a pitch successfully', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const https = require('https');
    https.request.mockImplementation(makeAnthropicResponse('Bonjour M. Martin, je vous contacte au sujet de votre boulangerie...'));

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: validProspect, niche: 'boulangerie', pitchType: 'appel' });

    expect(res.status).toBe(200);
    expect(res.body.content).toBeDefined();
    expect(res.body.content[0].text).toContain('Martin');
  });

  test('should forward Anthropic error status', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const https = require('https');
    https.request.mockImplementation(makeAnthropicResponse('', 429));

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: validProspect, niche: 'boulangerie', pitchType: 'appel' });

    expect(res.status).toBe(429);
  });
});

describe('POST /api/pitch — pitch types', () => {
  const pitchTypes = ['appel', 'email', 'sms', 'linkedin', 'fiche'];

  for (const pitchType of pitchTypes) {
    test(`should accept pitchType "${pitchType}"`, async () => {
      const user = insertUser(`user-${pitchType}@test.com`);
      const token = makeToken(user);

      const https = require('https');
      https.request.mockImplementation(makeAnthropicResponse(`Pitch de type ${pitchType}`));

      const res = await request(app)
        .post('/api/pitch')
        .set('Authorization', `Bearer ${token}`)
        .send({ prospect: validProspect, niche: 'boulangerie', pitchType });

      expect(res.status).toBe(200);
      expect(res.body.content).toBeDefined();
    });
  }

  test('should default to "appel" for unknown pitchType', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const https = require('https');
    https.request.mockImplementation(makeAnthropicResponse('Pitch par defaut'));

    const res = await request(app)
      .post('/api/pitch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospect: validProspect, niche: 'boulangerie', pitchType: 'unknown_type' });

    // Should not return 400 — falls back to 'appel'
    expect(res.status).toBe(200);
  });
});

describe('POST /api/pitch/keywords', () => {
  test('should return keywords for a niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const https = require('https');
    https.request.mockImplementation(makeAnthropicResponse('boulangerie, patisserie, pain, viennoiserie, bakery, bread'));

    const res = await request(app)
      .post('/api/pitch/keywords')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie' });

    expect(res.status).toBe(200);
    expect(res.body.keywords).toBeDefined();
    expect(Array.isArray(res.body.keywords)).toBe(true);
    expect(res.body.keywords.length).toBeGreaterThan(0);
  });

  test('should reject missing niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch/keywords')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/[Nn]iche/);
  });
});

describe('POST /api/pitch/batch', () => {
  test('should generate pitches for multiple prospects', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const https = require('https');
    https.request.mockImplementation(makeAnthropicResponse('Pitch batch'));

    const res = await request(app)
      .post('/api/pitch/batch')
      .set('Authorization', `Bearer ${token}`)
      .send({
        prospects: [
          { id: 1, name: 'Prospect A', city: 'Paris', rating: 4.0, reviews: 50 },
          { id: 2, name: 'Prospect B', city: 'Lyon', rating: 3.5, reviews: 30 },
        ],
        niche: 'boulangerie',
        pitchType: 'appel',
      });

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(2);
    expect(res.body.total).toBe(2);
  });

  test('should reject empty prospects array', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch/batch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospects: [], niche: 'boulangerie', pitchType: 'appel' });

    expect(res.status).toBe(400);
  });

  test('should reject more than 20 prospects', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const prospects = Array.from({ length: 21 }, (_, i) => ({
      id: i, name: `Prospect ${i}`, city: 'Paris',
    }));

    const res = await request(app)
      .post('/api/pitch/batch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospects, niche: 'boulangerie', pitchType: 'appel' });

    expect(res.status).toBe(400);
  });

  test('should reject missing niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/pitch/batch')
      .set('Authorization', `Bearer ${token}`)
      .send({ prospects: [{ id: 1, name: 'Test' }] });

    expect(res.status).toBe(400);
  });
});

describe('POST /api/pitch — authentication', () => {
  test('should reject without token', async () => {
    const res = await request(app)
      .post('/api/pitch')
      .send({ prospect: validProspect, niche: 'boulangerie' });

    expect(res.status).toBe(401);
  });
});
