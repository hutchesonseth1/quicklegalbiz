// ESM import; works in Next 15 Node runtime
import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  // Fail fast during build/runtime if not configured
  throw new Error('Missing STRIPE_SECRET_KEY');
}

// Pick the API version you’ve enabled in Stripe dashboard.
// Using a literal keeps TS happy across SDK versions.
export const stripe = new Stripe(key, {
  apiVersion: '2022-11-15',
  appInfo: { name: 'YourApp', version: '1.0.0' },
});
