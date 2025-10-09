import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION || "2025-09-30.clover",
});

export async function verifyStripeEvent(req: any) {
  const sig = req.headers["stripe-signature"];
  try {
    return stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("❌ Stripe webhook signature verification failed:", err);
    throw new Error("Invalid signature");
  }
}
