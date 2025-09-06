// pages/api/stripe/create-checkout-session.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export const config = { runtime: "nodejs" };

const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error("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_SECRET_KEY env var");

const stripe = new Stripe(key); // v12 OK with single arg

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "LegalPad form" },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Stripe error" });
  }
}
