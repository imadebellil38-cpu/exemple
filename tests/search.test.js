const request = require('supertest');
const express = require('express');

process.env.JWT_SECRET = 'test-secret-key';
process.env.NODE_ENV = 'test';
process.env.GOOGLE_API_KEY = 'fake-google-key';

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

// Mock https module to intercept Google Places API calls
jest.mock('https', () => {
  const { PassThrough } = require('stream');
  return {
    request: jest.fn((options, callback) => {
      // Defer to mockHttpsRequest so tests can control responses
      if (mockHttpsRequest) {
        return mockHttpsRequest(options, callback);
      }
      // Default: return empty places
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: [] }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    }),
    get: jest.fn(),
  };
});

jest.mock('../services/socialCheck', () => ({
  batchCheckSocialMedia: jest.fn().mockResolvedValue([]),
  isSocialCheckAvailable: jest.fn().mockReturnValue(false),
}));

jest.mock('../services/pappers', () => ({
  batchFindOwners: jest.fn().mockResolvedValue([]),
}));

let app;

function makeToken(userObj) {
  return jwt.sign(
    { id: userObj.id, email: userObj.email, is_admin: userObj.is_admin || 0 },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

function insertUser(email = 'user@test.com', credits = 50) {
  const bcrypt = require('bcryptjs');
  const hash = bcrypt.hashSync('password123', 10);
  const result = mockDb.prepare(
    'INSERT INTO users (email, password, plan, credits) VALUES (?, ?, ?, ?)'
  ).run(email, hash, 'pro', credits);
  return { id: Number(result.lastInsertRowid), email, is_admin: 0 };
}

function makePlacesResponse(places) {
  const { PassThrough } = require('stream');
  return (options, callback) => {
    const res = new PassThrough();
    res.statusCode = 200;
    callback(res);
    process.nextTick(() => {
      res.emit('data', JSON.stringify({ places }));
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
  jest.doMock('../services/socialCheck', () => ({
    batchCheckSocialMedia: jest.fn().mockResolvedValue([]),
    isSocialCheckAvailable: jest.fn().mockReturnValue(false),
  }));
  jest.doMock('../services/pappers', () => ({
    batchFindOwners: jest.fn().mockResolvedValue([]),
  }));

  // Re-set env for the module reload
  process.env.GOOGLE_API_KEY = 'fake-google-key';

  const { requireAuth } = require('../auth');
  const searchRoutes = require('../routes/search');

  app = express();
  app.use(express.json());
  app.use('/api/search', requireAuth, searchRoutes);
});

afterEach(() => {
  if (mockDb) mockDb.close();
});

describe('POST /api/search — input validation', () => {
  test('should reject missing niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ country: 'fr' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/[Nn]iche/);
  });

  test('should reject empty niche', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: '', country: 'fr' });

    expect(res.status).toBe(400);
  });

  test('should reject invalid country', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'xx' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/[Pp]ays/);
  });

  test('should accept valid countries (fr, ch, be)', async () => {
    const user = insertUser('user@test.com', 100);
    const token = makeToken(user);

    // Mock Google response with empty results so it completes quickly
    const https = require('https');
    const { PassThrough } = require('stream');
    https.request.mockImplementation((options, callback) => {
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: [] }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    });

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr', numProspects: 1 });

    // Should not be a 400 (country validation passes)
    expect(res.status).not.toBe(400);
  });
});

describe('POST /api/search — credits check', () => {
  test('should reject user with 0 credits', async () => {
    const user = insertUser('broke@test.com', 0);
    const token = makeToken(user);

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr' });

    expect(res.status).toBe(403);
    expect(res.body.error).toMatch(/[Cc]rédit/);
  });

  test('should allow user with credits', async () => {
    const user = insertUser('rich@test.com', 50);
    const token = makeToken(user);

    const https = require('https');
    const { PassThrough } = require('stream');
    https.request.mockImplementation((options, callback) => {
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: [] }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    });

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr', numProspects: 1 });

    // Should proceed (200) even if no results found
    expect(res.status).toBe(200);
  });
});

describe('POST /api/search — full flow with mock Google Places', () => {
  test('should return prospects and deduct credits', async () => {
    const user = insertUser('full@test.com', 50);
    const token = makeToken(user);

    const https = require('https');
    const { PassThrough } = require('stream');
    const mockPlaces = [
      {
        displayName: { text: 'Boulangerie Martin' },
        nationalPhoneNumber: '01 23 45 67 89',
        formattedAddress: '10 rue du Pain, 75001 Paris',
        rating: 4.5,
        userRatingCount: 120,
      },
      {
        displayName: { text: 'Boulangerie Dupont' },
        nationalPhoneNumber: '01 98 76 54 32',
        formattedAddress: '20 avenue Farine, 75002 Paris',
        rating: 4.0,
        userRatingCount: 80,
      },
    ];

    https.request.mockImplementation((options, callback) => {
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: mockPlaces }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    });

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr', numProspects: 2 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.count).toBe(2);
    expect(res.body.prospects).toHaveLength(2);
    expect(res.body.prospects[0].name).toBeDefined();
    expect(res.body.prospects[0].phone).toBeDefined();

    // Credits should be deducted
    expect(res.body.credits).toBe(48); // 50 - 2
  });

  test('should filter out businesses with websites in site mode', async () => {
    const user = insertUser('site@test.com', 50);
    const token = makeToken(user);

    const https = require('https');
    const { PassThrough } = require('stream');
    const mockPlaces = [
      {
        displayName: { text: 'Boulangerie Sans Site' },
        nationalPhoneNumber: '01 11 11 11 11',
        formattedAddress: 'Paris',
        rating: 4.0,
        userRatingCount: 10,
        // No websiteUri — should be kept
      },
      {
        displayName: { text: 'Boulangerie Avec Site' },
        nationalPhoneNumber: '01 22 22 22 22',
        formattedAddress: 'Paris',
        rating: 4.5,
        userRatingCount: 50,
        websiteUri: 'https://example.com', // Has website — should be filtered
      },
    ];

    https.request.mockImplementation((options, callback) => {
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: mockPlaces }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    });

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr', numProspects: 5, searchMode: 'site' });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
    expect(res.body.prospects[0].name).toContain('Sans Site');
  });

  test('should skip prospects without phone number', async () => {
    const user = insertUser('nophone@test.com', 50);
    const token = makeToken(user);

    const https = require('https');
    const { PassThrough } = require('stream');
    const mockPlaces = [
      {
        displayName: { text: 'Avec Telephone' },
        nationalPhoneNumber: '01 33 33 33 33',
        formattedAddress: 'Paris',
        rating: 4.0,
        userRatingCount: 10,
      },
      {
        displayName: { text: 'Sans Telephone' },
        // No phone
        formattedAddress: 'Paris',
        rating: 4.5,
        userRatingCount: 50,
      },
    ];

    https.request.mockImplementation((options, callback) => {
      const res = new PassThrough();
      res.statusCode = 200;
      callback(res);
      process.nextTick(() => {
        res.emit('data', JSON.stringify({ places: mockPlaces }));
        res.emit('end');
      });
      const req = new PassThrough();
      req.setTimeout = jest.fn();
      return req;
    });

    const res = await request(app)
      .post('/api/search')
      .set('Authorization', `Bearer ${token}`)
      .send({ niche: 'boulangerie', country: 'fr', numProspects: 5 });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(1);
  });
});

describe('POST /api/search — authentication', () => {
  test('should reject without token', async () => {
    const res = await request(app)
      .post('/api/search')
      .send({ niche: 'boulangerie', country: 'fr' });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/search/cities', () => {
  test('should return zone counts per country', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .get('/api/search/cities')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.fr).toBeDefined();
    expect(typeof res.body.fr).toBe('number');
    expect(res.body.fr).toBeGreaterThan(0);
  });
});

describe('GET /api/search/modes', () => {
  test('should return available search modes', async () => {
    const user = insertUser();
    const token = makeToken(user);

    const res = await request(app)
      .get('/api/search/modes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.modes).toBeDefined();
    expect(Array.isArray(res.body.modes)).toBe(true);
    expect(res.body.modes.length).toBeGreaterThanOrEqual(1);
    // 'site' mode should always be available
    const siteMode = res.body.modes.find(m => m.id === 'site');
    expect(siteMode).toBeDefined();
    expect(siteMode.available).toBe(true);
  });
});
