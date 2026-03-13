const express = require('express');
const db = require('../db');

const router = express.Router();

const PLAN_CREDITS = { free: 5, pro: 100, enterprise: 500 };

// Map Stripe price IDs to plan names
function getPlanFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return 'enterprise';
  return null;
}

// POST /api/stripe/webhook — raw body required
router.post('/', express.raw({ type: 'application/json' }), (req, res) => {
  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY;
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!STRIPE_SECRET) return res.status(503).send('Stripe not configured');

  const stripe = require('stripe')(STRIPE_SECRET);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    if (STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      event = JSON.parse(req.body);
    }
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Signature error:', err.message);
    return res.status(400).send('Webhook signature verification failed');
  }

  console.log(`[STRIPE WEBHOOK] ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = parseInt(session.metadata?.user_id);
      const plan = session.metadata?.plan;
      if (userId && plan && PLAN_CREDITS[plan]) {
        db.prepare('UPDATE users SET plan = ?, credits = ?, stripe_subscription_id = ? WHERE id = ?')
          .run(plan, PLAN_CREDITS[plan], session.subscription || '', userId);
        console.log(`[STRIPE] User ${userId} upgraded to ${plan}`);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const customerId = sub.customer;
      const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').get(customerId);
      if (user) {
        const priceId = sub.items?.data?.[0]?.price?.id;
        const plan = getPlanFromPriceId(priceId);
        if (plan) {
          db.prepare('UPDATE users SET plan = ?, credits = ?, stripe_subscription_id = ? WHERE id = ?')
            .run(plan, PLAN_CREDITS[plan], sub.id, user.id);
          console.log(`[STRIPE] Subscription updated: user ${user.id} → ${plan}`);
        }
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const customerId = sub.customer;
      const user = db.prepare('SELECT id FROM users WHERE stripe_customer_id = ?').get(customerId);
      if (user) {
        db.prepare('UPDATE users SET plan = ?, credits = ?, stripe_subscription_id = NULL WHERE id = ?')
          .run('free', PLAN_CREDITS.free, user.id);
        console.log(`[STRIPE] Subscription cancelled: user ${user.id} → free`);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      // Monthly credit renewal
      const invoice = event.data.object;
      const customerId = invoice.customer;
      const user = db.prepare('SELECT id, plan FROM users WHERE stripe_customer_id = ?').get(customerId);
      if (user && user.plan !== 'free') {
        db.prepare('UPDATE users SET credits = ? WHERE id = ?')
          .run(PLAN_CREDITS[user.plan] || 0, user.id);
        console.log(`[STRIPE] Credits renewed: user ${user.id} (${user.plan})`);
      }
      break;
    }
  }

  res.json({ received: true });
});

module.exports = router;
