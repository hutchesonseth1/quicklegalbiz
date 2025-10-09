import Stripe from "stripe";
import { logEvent } from "../memory/logEvent";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function verifyPayment(event: any) {
  try {
    const verified = stripe.webhooks.constructEvent(
      event.body,
      event.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    await logEvent("Stripe event verified successfully.");
    return verified;
  } catch (err: any) {
    await logEvent(\`Stripe event verification failed: \${err.message}\`);
    throw err;
  }
}
