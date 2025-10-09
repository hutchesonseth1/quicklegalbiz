import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import Stripe from "stripe";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const report: Record<string, any> = {
    timestamp: new Date().toISOString(),
    node: process.version,
    next: process.env.NEXT_RUNTIME || "unknown",
    stripe: "checking...",
    resend: "checking...",
    status: "ok",
  };

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-01",
    });
    await stripe.customers.list({ limit: 1 });
    report.stripe = "✅ OK";
  } catch (err: any) {
    report.stripe = `❌ ${err.message}`;
    report.status = "degraded";
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY!);
    await resend.emails.send({
      from: "status@quicklegalbiz.com",
      to: process.env.ADMIN_EMAIL || "seth@logicalsolutionsgroup.com",
      subject: "QuickLegal Health Ping",
      html: `<p>System status check at ${new Date().toLocaleString()}</p>`,
    });
    report.resend = "✅ OK";
  } catch (err: any) {
    report.resend = `❌ ${err.message}`;
    report.status = "degraded";
  }

  res.status(200).json(report);
}
