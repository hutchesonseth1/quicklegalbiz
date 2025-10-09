import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { buffer } from "micro";
import { sendEmail } from "@/lib/email";
export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("Webhook signature failed.", err.message);
    return res.status(400).send(\`Webhook Error: \${err.message}\`);
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_email;
    if (email) {
      await sendEmail({
        to: email,
        subject: "Payment received – upload your motion",
        html: \`<p>Thanks! Upload your motion here:</p>
               <p><a href="\${process.env.NEXT_PUBLIC_BASE_URL || req.headers.origin}/">Start filing</a></p>\`,
      });
    }
  }
  res.json({ received: true });
}
