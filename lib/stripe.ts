// lib/stripe.ts

import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2022-11-15', // ✅ Use your target Stripe API version
});

export default stripe;

