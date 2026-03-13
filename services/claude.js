const https = require('https');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

/**
 * Appel unifie a l'API Anthropic (Claude).
 *
 * @param {string}  prompt              Le message utilisateur
 * @param {Object}  [options]           Options facultatives
 * @param {string}  [options.apiKey]    Cle API (defaut: ANTHROPIC_API_KEY env)
 * @param {number}  [options.maxTokens] Max tokens (defaut: 2000)
 * @param {number}  [options.temperature] Temperature (defaut: undefined = API default)
 * @param {string}  [options.system]    System prompt (defaut: aucun)
 * @param {string}  [options.model]     Modele (defaut: claude-sonnet-4-6)
 * @param {number}  [options.timeout]   Timeout en ms (defaut: 30000)
 * @returns {Promise<{status: number, body: Object}>}
 */
function callClaudeRaw(prompt, options = {}) {
  const {
    apiKey = ANTHROPIC_API_KEY,
    maxTokens = 2000,
    temperature,
    system,
    model = 'claude-sonnet-4-6',
    timeout = 30000,
  } = options;

  return new Promise((resolve, reject) => {
    const payload = {
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: prompt }],
    };
    if (temperature !== undefined) payload.temperature = temperature;
    if (system) payload.system = system;

    const body = JSON.stringify(payload);

    const reqOptions = {
      hostname: 'api.anthropic.com',
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { reject(new Error('Reponse invalide de l\'API Anthropic')); }
      });
    });

    req.on('error', reject);
    req.setTimeout(timeout, () => { req.destroy(); reject(new Error('Anthropic API timeout')); });
    req.write(body);
    req.end();
  });
}

module.exports = { callClaudeRaw, ANTHROPIC_API_KEY };
