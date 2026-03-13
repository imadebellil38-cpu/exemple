const { Router } = require('express');
const db = require('../db');

const router = Router();

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

// Only init Stripe if key exists
let stripe = null;
if (STRIPE_SECRET) {
  stripe = require('stripe')(STRIPE_SECRET);
} else {
  console.warn('\x1b[33m[WARN] STRIPE_SECRET_KEY not set — payments disabled\x1b[0m');
}

const PLAN_PRICES = {
  pro: process.env.STRIPE_PRICE_PRO || '',
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE || '',
};

const PLAN_CREDITS = { free: 5, pro: 100, enterprise: 500 };

// POST /api/stripe/checkout — create Stripe Checkout session
router.post('/checkout', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Paiement non configuré.' });

  const { plan } = req.body;
  if (!plan || !PLAN_PRICES[plan]) {
    return res.status(400).json({ error: 'Plan invalide.' });
  }
  if (!PLAN_PRICES[plan]) {
    return res.status(400).json({ error: 'Prix Stripe non configuré pour ce plan.' });
  }

  const user = db.prepare('SELECT id, email, stripe_customer_id FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable.' });

  try {
    // Create or reuse Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, metadata: { user_id: String(user.id) } });
      customerId = customer.id;
      db.prepare('UPDATE users SET stripe_customer_id = ? WHERE id = ?').run(customerId, user.id);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PLAN_PRICES[plan], quantity: 1 }],
      success_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?success=1`,
      cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing?cancelled=1`,
      metadata: { user_id: String(user.id), plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[STRIPE] Checkout error:', err.message);
    res.status(500).json({ error: 'Erreur lors de la création du paiement.' });
  }
});

// POST /api/stripe/portal — customer portal (manage subscription)
router.post('/portal', async (req, res) => {
  if (!stripe) return res.status(503).json({ error: 'Paiement non configuré.' });

  const user = db.prepare('SELECT stripe_customer_id FROM users WHERE id = ?').get(req.user.id);
  if (!user?.stripe_customer_id) {
    return res.status(400).json({ error: 'Aucun abonnement actif.' });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripe_customer_id,
      return_url: `${process.env.APP_URL || 'http://localhost:3000'}/pricing`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('[STRIPE] Portal error:', err.message);
    res.status(500).json({ error: 'Erreur portail Stripe.' });
  }
});

// GET /api/stripe/status — check if Stripe is configured
router.get('/status', (req, res) => {
  res.json({
    enabled: !!stripe,
    plans: {
      pro: { price: 29, configured: !!PLAN_PRICES.pro },
      enterprise: { price: 79, configured: !!PLAN_PRICES.enterprise },
    }
  });
});

module.exports = { router, stripe, STRIPE_WEBHOOK_SECRET, PLAN_CREDITS };
