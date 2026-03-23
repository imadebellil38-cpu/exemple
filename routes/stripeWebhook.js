'use strict';
const express = require('express');
const db = require('../db');

const router = express.Router();

const PLAN_CREDITS = { free: 5, pro: 100, enterprise: 500 };

function getPlanFromPriceId(priceId) {
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return 'enterprise';
  return null;
}

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
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

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = parseInt(session.metadata?.user_id);
        const pack = session.metadata?.pack;
        const credits = parseInt(session.metadata?.credits);
        if (userId && pack && credits > 0) {
          await db.run('UPDATE users SET credits = credits + ? WHERE id = ?', [credits, userId]);
          console.log(`[STRIPE] User ${userId} bought pack "${pack}" (+${credits} credits)`);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const customerId = sub.customer;
        const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = ?', [customerId]);
        if (user) {
          const priceId = sub.items?.data?.[0]?.price?.id;
          const plan = getPlanFromPriceId(priceId);
          if (plan) {
            await db.run('UPDATE users SET plan = ?, credits = ?, stripe_subscription_id = ? WHERE id = ?',
              [plan, PLAN_CREDITS[plan], sub.id, user.id]);
            console.log(`[STRIPE] Subscription updated: user ${user.id} → ${plan}`);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        const customerId = sub.customer;
        const user = await db.get('SELECT id FROM users WHERE stripe_customer_id = ?', [customerId]);
        if (user) {
          await db.run('UPDATE users SET plan = ?, credits = ?, stripe_subscription_id = NULL WHERE id = ?',
            ['free', PLAN_CREDITS.free, user.id]);
          console.log(`[STRIPE] Subscription cancelled: user ${user.id} → free`);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const user = await db.get('SELECT id, plan FROM users WHERE stripe_customer_id = ?', [customerId]);
        if (user && user.plan !== 'free') {
          await db.run('UPDATE users SET credits = ? WHERE id = ?',
            [PLAN_CREDITS[user.plan] || 0, user.id]);
          console.log(`[STRIPE] Credits renewed: user ${user.id} (${user.plan})`);
        }
        break;
      }
    }
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Processing error:', err.message);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  res.json({ received: true });
});

module.exports = router;
