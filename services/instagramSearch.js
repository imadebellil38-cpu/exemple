'use strict';
/**
 * Instagram Search Service
 * Uses Google Custom Search API (site:instagram.com) to find Instagram profiles by niche
 * Then scrapes public profile data (bio, followers) from Instagram's public HTML
 */
const https = require('https');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Paths that are NOT user profiles
const NON_PROFILE_PATHS = ['p', 'explore', 'accounts', 'reel', 'reels', 'stories', 'tv', 'about', 'directory', 'legal', 'developer'];

/**
 * Extract Instagram username from a URL
 * Returns null if not a valid profile URL
 */
function extractUsername(url) {
  try {
    const u = new URL(url);
    if (!u.hostname.includes('instagram.com')) return null;
    const parts = u.pathname.split('/').filter(Boolean);
    if (parts.length === 0) return null;
    const first = parts[0].toLowerCase();
    if (NON_PROFILE_PATHS.includes(first)) return null;
    // Must look like a username: alphanumeric, dots, underscores
    if (!/^[a-zA-Z0-9_.]{1,30}$/.test(parts[0])) return null;
    return parts[0];
  } catch {
    return null;
  }
}

/**
 * Google Custom Search for Instagram profiles
 * @param {string} niche - Business type ("monteurs vidéo")
 * @param {string} city - City name ("Paris")
 * @param {string} apiKey - Google API key
 * @param {string} cseId - Google CSE ID
 * @returns {Promise<Array<{username, profileUrl, title, snippet}>>}
 */
function searchInstagramProfiles(niche, city, apiKey, cseId) {
  return new Promise((resolve, reject) => {
    const query = `site:instagram.com "${niche}" "${city}"`;
    const params = new URLSearchParams({
      key: apiKey,
      cx: cseId,
      q: query,
      num: '10',
    });

    const options = {
      hostname: 'customsearch.googleapis.com',
      path: `/customsearch/v1?${params.toString()}`,
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode !== 200) {
            console.error(`[INSTAGRAM] CSE error ${res.statusCode}:`, parsed?.error?.message || 'unknown');
            return resolve([]); // Graceful failure
          }

          const items = parsed.items || [];
          const results = [];
          const seen = new Set();

          for (const item of items) {
            const username = extractUsername(item.link || '');
            if (!username || seen.has(username.toLowerCase())) continue;
            seen.add(username.toLowerCase());

            results.push({
              username,
              profileUrl: `https://www.instagram.com/${username}/`,
              title: item.title || '',
              snippet: item.snippet || '',
            });
          }

          resolve(results);
        } catch (e) {
          console.error('[INSTAGRAM] CSE parse error:', e.message);
          resolve([]);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[INSTAGRAM] CSE request error:', err.message);
      resolve([]); // Graceful failure
    });
    req.setTimeout(5000, () => { req.destroy(); resolve([]); });
    req.end();
  });
}

/**
 * Fetch public Instagram profile data via HTML meta tags
 * Best-effort: returns partial data on failure
 * @param {string} username
 * @returns {Promise<{fullName, bio, followers, externalUrl} | null>}
 */
function fetchInstagramProfile(username) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'www.instagram.com',
      path: `/${username}/`,
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'text/html',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
    };

    const req = https.request(options, (res) => {
      // Follow redirect
      if (res.statusCode === 301 || res.statusCode === 302) {
        resolve(null);
        res.resume();
        return;
      }
      if (res.statusCode !== 200) {
        resolve(null);
        res.resume();
        return;
      }

      let html = '';
      res.on('data', chunk => {
        html += chunk;
        // Stop after first 50KB — we only need meta tags in <head>
        if (html.length > 50000) { res.destroy(); }
      });
      res.on('end', () => parseProfileHtml(html, resolve));
      res.on('error', () => resolve(null));
    });

    req.on('error', () => resolve(null));
    req.setTimeout(3000, () => { req.destroy(); resolve(null); });
    req.end();
  });
}

function parseProfileHtml(html, resolve) {
  try {
    // Extract og:description: "X Followers, Y Following, Z Posts - See Instagram photos and videos from Name (@username)"
    const ogDesc = html.match(/<meta\s+(?:property|name)="og:description"\s+content="([^"]*?)"/i)?.[1] || '';
    const ogTitle = html.match(/<meta\s+(?:property|name)="og:title"\s+content="([^"]*?)"/i)?.[1] || '';

    let followers = 0;
    let fullName = '';
    let bio = '';

    // Parse followers from og:description
    const followMatch = ogDesc.match(/([\d,.]+[KMkm]?)\s*Followers/i);
    if (followMatch) {
      let val = followMatch[1].replace(/,/g, '');
      if (/[Kk]$/.test(val)) followers = Math.round(parseFloat(val) * 1000);
      else if (/[Mm]$/.test(val)) followers = Math.round(parseFloat(val) * 1000000);
      else followers = parseInt(val, 10) || 0;
    }

    // Parse name from og:title: "Name (@username) • Instagram photos and videos"
    const nameMatch = ogTitle.match(/^(.+?)\s*\(@/);
    if (nameMatch) fullName = nameMatch[1].trim();

    // Bio: whatever comes after the follower/post stats in og:description
    const bioMatch = ogDesc.match(/Posts\s*[-–—]\s*(.*)/i);
    if (bioMatch) bio = bioMatch[1].replace(/See Instagram.*$/i, '').trim();

    // Extract external URL from page
    const linkMatch = html.match(/"external_url"\s*:\s*"([^"]+)"/);
    const externalUrl = linkMatch ? linkMatch[1].replace(/\\u0026/g, '&').replace(/\\/g, '') : '';

    resolve({ fullName, bio, followers, externalUrl });
  } catch {
    resolve(null);
  }
}

/**
 * Batch search Instagram profiles across multiple cities
 * @param {string} niche
 * @param {string[]} cities - Array of city names
 * @param {string} apiKey
 * @param {string} cseId
 * @param {number} maxResults
 * @returns {Promise<Array<{name, instagram_handle, profile_url, city, bio, followers, has_instagram}>>}
 */
async function batchSearchInstagram(niche, cities, apiKey, cseId, maxResults = 50) {
  const results = [];
  const seenUsernames = new Set();

  // Limit cities to avoid burning CSE quota (100/day free)
  const citiesToSearch = cities.slice(0, Math.min(cities.length, 15));

  for (const city of citiesToSearch) {
    if (results.length >= maxResults) break;

    const profiles = await searchInstagramProfiles(niche, city, apiKey, cseId);

    for (const p of profiles) {
      if (results.length >= maxResults) break;
      if (seenUsernames.has(p.username.toLowerCase())) continue;
      seenUsernames.add(p.username.toLowerCase());

      // Best-effort profile enrichment
      let profileData = null;
      try {
        profileData = await fetchInstagramProfile(p.username);
      } catch { /* ignore */ }

      await delay(300);

      results.push({
        name: profileData?.fullName || p.title.split('(')[0].trim().split('•')[0].trim() || p.username,
        instagram_handle: p.username,
        profile_url: p.profileUrl,
        city,
        bio: profileData?.bio || p.snippet || '',
        followers: profileData?.followers || 0,
        external_url: profileData?.externalUrl || '',
        has_instagram: 1,
      });
    }

    await delay(200);
  }

  console.log(`[INSTAGRAM] Found ${results.length} profiles for "${niche}" across ${citiesToSearch.length} cities`);
  return results;
}

/**
 * Check if Instagram search is available (requires CSE config)
 */
function isInstagramSearchAvailable() {
  return !!(process.env.GOOGLE_CSE_ID && process.env.GOOGLE_API_KEY);
}

module.exports = { batchSearchInstagram, searchInstagramProfiles, fetchInstagramProfile, extractUsername, isInstagramSearchAvailable };
