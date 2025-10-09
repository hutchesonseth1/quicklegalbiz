import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/email";
import { adminAlertTemplate } from "@/lib/email-templates";
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { to, subject, html, text } = req.body;
    if (!to || !subject || (!html && !text))
      return res.status(400).json({ error: "Missing fields" });
    await sendEmail({ to, subject, html, text });
    res.status(200).json({ ok: true });
  } catch (e: any) {
    await sendEmail({
      to: process.env.ADMIN_EMAIL!,
      subject: "Email failure",
      html: adminAlertTemplate("Email failure", e.message || String(e)),
    });
    res.status(500).json({ error: "Failed to send email" });
  }
}
