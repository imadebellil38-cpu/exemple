const https = require('https');

// API key from environment
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('\x1b[31m[WARN] GOOGLE_API_KEY not set in .env — search will fail\x1b[0m');
}

// Country bounding boxes + grid config for full-territory coverage
// Each country: { bbox: [latMin, latMax, lngMin, lngMax], radius: meters, step: degrees }
// Step is ~70% of radius in degrees (overlap ensures no gaps)
const COUNTRY_BOUNDS = {
  fr: { bbox: [42.33, 51.09, -4.79, 8.23], radius: 25000, step: 0.32 },   // ~130 grid points
  ch: { bbox: [45.82, 47.81, 5.96, 10.49], radius: 20000, step: 0.26 },   // ~30 grid points
  be: { bbox: [49.50, 51.50, 2.55, 6.40], radius: 15000, step: 0.20 },    // ~50 grid points
};

// Generate grid points covering an entire country
function generateGrid(countryCode) {
  const bounds = COUNTRY_BOUNDS[countryCode];
  if (!bounds) return [];
  const { bbox, radius, step } = bounds;
  const [latMin, latMax, lngMin, lngMax] = bbox;
  const points = [];
  let row = 0;
  for (let lat = latMin; lat <= latMax; lat += step) {
    // Offset every other row by half-step for hexagonal packing (better coverage)
    const lngOffset = (row % 2 === 1) ? step / 2 : 0;
    for (let lng = lngMin + lngOffset; lng <= lngMax; lng += step) {
      points.push({ lat: Math.round(lat * 10000) / 10000, lng: Math.round(lng * 10000) / 10000, r: radius });
    }
    row++;
  }
  return points;
}

// Pre-generate grids at startup
const GRIDS = {};
for (const code of Object.keys(COUNTRY_BOUNDS)) {
  GRIDS[code] = generateGrid(code);
  console.log(`[GRID] ${code.toUpperCase()}: ${GRIDS[code].length} zones couvrant tout le territoire`);
}

function googlePlacesRequest(apiKey, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const options = {
      hostname: 'places.googleapis.com',
      path: '/v1/places:searchText',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount,nextPageToken',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            reject(new Error(parsed?.error?.message || `Google API HTTP ${res.statusCode}`));
          } else {
            resolve(parsed);
          }
        } catch (e) { reject(new Error('Réponse invalide Google Places')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('Google API timeout')); });
    req.write(payload);
    req.end();
  });
}

const delay = ms => new Promise(r => setTimeout(r, ms));

module.exports = { googlePlacesRequest, GOOGLE_API_KEY, COUNTRY_BOUNDS, generateGrid, GRIDS, delay };
