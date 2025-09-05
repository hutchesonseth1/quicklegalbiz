import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

export const config = { runtime: "nodejs" }; // Stripe needs Node, not Edge

const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error("Missing STRIPE_SECRET_KEY");

const stripe = new Stripe(key /*, { apiVersion: "2023-08-16" }*/); // ← remove apiVersion

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: "price_123", quantity: 1 }], // placeholder
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
    });
    return res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? "Stripe error" });
  }
}
