import Stripe from 'stripe';
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

console.log(
  `[Stripe Initialized] Active API Version: ${stripe.getApiField("version")}`
);