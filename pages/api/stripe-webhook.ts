import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-01-27.acacia",
});

const resend = new Resend(process.env.RESEND_API_KEY!);

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  let event: Stripe.Event;

  try {
    const sig = req.headers["stripe-signature"];
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (err: any) {
    console.error("❌ Webhook signature error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    // Handle successful checkouts
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_email ?? "unknown";
      const amount = session.amount_total ?? 0;
      const product = session.metadata?.product ?? "unknown";
      const sessionId = session.id;
      const currency = session.currency ?? "usd";

      console.log(`💰 Payment received: ${email} - ${amount / 100} ${currency}`);

      // Log to Prisma
      await prisma.payment.create({
        data: {
          email,
          amount,
          currency,
          product,
          status: "completed",
          sessionId,
        },
      });

      // Send confirmation email
      await resend.emails.send({
        from: "QuickLegalBiz <support@quicklegalbiz.com>",
        to: email,
        subject: "Payment Confirmed — QuickLegalBiz",
        html: `
          <h2>Thank you for your payment!</h2>
          <p>Your ${product} is confirmed.</p>
          <p>You can access your next step here:</p>
          <a href="${process.env.SITE_URL}/upsell?email=${encodeURIComponent(email)}"
            style="color:#2563eb;">Continue to your documents</a>
          <br/><br/>
          <p style="font-size:0.9em;color:#666;">
            Receipt: ${sessionId} • ${amount / 100} ${currency.toUpperCase()}
          </p>
        `,
      });
    }

    // Handle failed payments
    if (event.type === "payment_intent.payment_failed") {
      const intent = event.data.object as Stripe.PaymentIntent;
      const email = (intent.receipt_email as string) || "unknown";

      await prisma.payment.create({
        data: {
          email,
          amount: intent.amount,
          currency: intent.currency ?? "usd",
          product: intent.metadata?.product ?? "unknown",
          status: "failed",
          sessionId: intent.id,
        },
      });

      console.warn(`⚠️ Payment failed for ${email}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error("💥 Webhook processing error:", err);
    res.status(500).send(`Webhook handler failed: ${err.message}`);
  }
}