import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "QuickLegalBiz Motion Filing Service",
              description: "Fast, AI-assisted motion or form preparation within 24 hours.",
            },
            unit_amount: 4900,
          },
          quantity: 1,
        },
      ],
      customer_email: req.body.customerEmail || "test@example.com",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    // Save payment session in DB
    await prisma.payment.create({
      data: {
        sessionId: session.id,
        customerEmail: session.customer_email || "unknown@quicklegalbiz.com",
        amount: 4900,
        currency: "usd",
        status: "created",
        receiptUrl: null,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    res.status(500).json({ error: error.message });
  }
}