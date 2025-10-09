import { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { name, email, message } = req.body;
  if (!email || !message) return res.status(400).json({ error: "Missing fields" });

  try {
    await resend.emails.send({
      from: "QuickLegalBiz Support <support@quicklegalbiz.com>",
      to: "support@quicklegalbiz.com",
      subject: `Support message from ${name}`,
      html: `<p><b>From:</b> ${name} (${email})</p><p>${message}</p>`,
    });
    res.status(200).json({ success: true });
  } catch {
    res.status(500).json({ error: "Failed to send email" });
  }
}
