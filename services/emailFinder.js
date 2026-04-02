const https = require('https');

const HUNTER_API_KEY = process.env.HUNTER_API_KEY || '';

function extractDomain(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    const url = websiteUrl.startsWith('http') ? websiteUrl : 'https://' + websiteUrl;
    return new URL(url).hostname.replace(/^www\./, '');
  } catch { return null; }
}

function cleanName(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]/g, '');
}

function generatePatterns(domain, ownerName) {
  const patterns = [];

  if (ownerName) {
    const parts = ownerName.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = cleanName(parts[0]);
      const last = cleanName(parts[parts.length - 1]);
      patterns.push(
        { email: `${first}.${last}@${domain}`, pattern: 'prenom.nom', confidence: 85 },
        { email: `${first}${last}@${domain}`, pattern: 'prenomnom', confidence: 70 },
        { email: `${first[0]}${last}@${domain}`, pattern: 'pnom', confidence: 65 },
        { email: `${first[0]}.${last}@${domain}`, pattern: 'p.nom', confidence: 65 },
        { email: `${first}@${domain}`, pattern: 'prenom', confidence: 50 },
        { email: `${last}@${domain}`, pattern: 'nom', confidence: 45 },
        { email: `${first}-${last}@${domain}`, pattern: 'prenom-nom', confidence: 60 },
        { email: `${last}.${first}@${domain}`, pattern: 'nom.prenom', confidence: 55 }
      );
    } else if (parts.length === 1) {
      const name = cleanName(parts[0]);
      patterns.push(
        { email: `${name}@${domain}`, pattern: 'nom', confidence: 50 }
      );
    }
  }

  // Generic patterns
  patterns.push(
    { email: `contact@${domain}`, pattern: 'generic', confidence: 75 },
    { email: `info@${domain}`, pattern: 'generic', confidence: 70 },
    { email: `hello@${domain}`, pattern: 'generic', confidence: 40 },
    { email: `bonjour@${domain}`, pattern: 'generic', confidence: 35 },
    { email: `direction@${domain}`, pattern: 'generic', confidence: 30 },
    { email: `commercial@${domain}`, pattern: 'generic', confidence: 30 }
  );

  return patterns;
}

function httpsGet(url, timeout = 8000) {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
      const req = https.request({
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
        },
      }, (res) => {
        // Follow redirects (up to 3)
        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
          const redir = res.headers.location.startsWith('http')
            ? res.headers.location
            : `https://${parsedUrl.hostname}${res.headers.location}`;
          res.resume();
          return httpsGet(redir, timeout).then(resolve);
        }
        let data = '';
        res.setEncoding('utf8');
        res.on('data', c => { if (data.length < 500000) data += c; });
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
      req.setTimeout(timeout, () => { req.destroy(); resolve(''); });
      req.end();
    } catch { resolve(''); }
  });
}

function scrapeEmailsFromHtml(html) {
  if (!html) return [];
  // Extract emails via regex
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const found = html.match(emailRegex) || [];
  // Filter out image files, CSS files, common false positives
  const blacklist = /\.(png|jpg|jpeg|gif|svg|css|js|woff|ttf|ico)$/i;
  const seen = new Set();
  return found
    .map(e => e.toLowerCase())
    .filter(e => {
      if (blacklist.test(e)) return false;
      if (e.includes('example.com') || e.includes('sentry.io') || e.includes('webpack')) return false;
      if (seen.has(e)) return false;
      seen.add(e);
      return true;
    })
    .slice(0, 20);
}

function hunterSearch(domain) {
  return new Promise((resolve) => {
    if (!HUNTER_API_KEY) return resolve([]);
    const path = `/v2/domain-search?domain=${encodeURIComponent(domain)}&api_key=${encodeURIComponent(HUNTER_API_KEY)}&limit=5`;
    const req = https.request({ hostname: 'api.hunter.io', path, method: 'GET' }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const emails = (parsed?.data?.emails || []).map(e => ({
            email: e.value,
            confidence: e.confidence || 80,
            source: 'hunter.io',
            type: e.type || 'unknown',
            firstName: e.first_name || '',
            lastName: e.last_name || '',
          })).filter(e => e.email);
          resolve(emails);
        } catch { resolve([]); }
      });
    });
    req.on('error', () => resolve([]));
    req.setTimeout(8000, () => { req.destroy(); resolve([]); });
    req.end();
  });
}

/**
 * Standalone email finder search — used by /api/prospects/email-finder/search
 * Accepts: { companyName, website, ownerName }
 * Returns: { results[], domain, scrapedCount, patternsCount }
 */
async function searchEmails({ companyName, website, ownerName }) {
  const domain = extractDomain(website);
  if (!domain) {
    return { results: [], domain: null, error: 'URL de site web invalide.' };
  }

  const results = [];
  const seen = new Set();

  const addResult = (email, confidence, source, extra = {}) => {
    const key = email.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    results.push({ email: key, confidence: Math.min(confidence, 99), source, ...extra });
  };

  // 1. Hunter.io API (if configured)
  const hunterResults = await hunterSearch(domain);
  for (const h of hunterResults) {
    addResult(h.email, h.confidence, 'hunter.io', {
      type: h.type,
      firstName: h.firstName,
      lastName: h.lastName,
    });
  }

  // 2. Scrape website pages for emails
  const pagesToScrape = [
    `https://${domain}`,
    `https://${domain}/contact`,
    `https://${domain}/contact.html`,
    `https://${domain}/contactez-nous`,
    `https://${domain}/mentions-legales`,
    `https://${domain}/legal`,
    `https://${domain}/about`,
    `https://${domain}/a-propos`,
    `https://${domain}/equipe`,
    `https://${domain}/team`,
    `https://${domain}/imprint`,
    `https://${domain}/impressum`,
  ];

  // Scrape pages in parallel (max 4 concurrent)
  const chunks = [];
  for (let i = 0; i < pagesToScrape.length; i += 4) {
    chunks.push(pagesToScrape.slice(i, i + 4));
  }

  let scrapedEmails = [];
  for (const chunk of chunks) {
    const htmlResults = await Promise.all(chunk.map(u => httpsGet(u, 6000)));
    for (const html of htmlResults) {
      const emails = scrapeEmailsFromHtml(html);
      scrapedEmails.push(...emails);
    }
  }

  // Dedupe scraped
  const scrapedUnique = [...new Set(scrapedEmails)];
  for (const email of scrapedUnique) {
    // Emails on the same domain get higher confidence
    const onDomain = email.endsWith('@' + domain);
    addResult(email, onDomain ? 90 : 60, 'scraping', { foundOnSite: true });
  }

  // 3. Pattern generation
  const patterns = generatePatterns(domain, ownerName);
  for (const p of patterns) {
    addResult(p.email, p.confidence, 'pattern', { pattern: p.pattern });
  }

  // Sort by confidence descending
  results.sort((a, b) => b.confidence - a.confidence);

  return {
    results: results.slice(0, 25),
    domain,
    scrapedCount: scrapedUnique.length,
    patternsCount: patterns.length,
    hunterCount: hunterResults.length,
  };
}

/**
 * Original function — find email for a single prospect (used by existing route)
 */
async function findEmailForProspect(prospect) {
  const domain = extractDomain(prospect.website_url);

  if (!domain) {
    return { found: false, suggestions: [], error: 'Aucun site web renseigne pour ce prospect.' };
  }

  // Try Hunter.io if key configured
  if (HUNTER_API_KEY) {
    const emails = await hunterSearch(domain);
    if (emails.length > 0) {
      return { found: true, email: emails[0].email, all: emails.map(e => e.email) };
    }
  }

  // Generate likely patterns
  const suggestions = [`contact@${domain}`, `info@${domain}`, `hello@${domain}`, `bonjour@${domain}`];

  if (prospect.owner_name) {
    const parts = prospect.owner_name.trim().split(/\s+/);
    if (parts.length >= 2) {
      const first = cleanName(parts[0]);
      const last = cleanName(parts[parts.length - 1]);
      suggestions.unshift(`${first}.${last}@${domain}`, `${first[0]}${last}@${domain}`);
    } else {
      suggestions.unshift(`${cleanName(parts[0])}@${domain}`);
    }
  }

  return { found: false, domain, suggestions: suggestions.slice(0, 5) };
}

module.exports = { findEmailForProspect, searchEmails, extractDomain };
