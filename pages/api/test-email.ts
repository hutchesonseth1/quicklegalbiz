import type { NextApiRequest, NextApiResponse } from "next";
import { sendEmail } from "@/lib/email";
import { motionReadyTemplate } from "@/lib/email-templates";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("✅ /api/test-email route hit");

  try {
    // 👇 Replace this email with your actual address (like your Gmail)
    const testEmail = process.env.ADMIN_EMAIL || "youremail@gmail.com";

    // Generate a sample email template
    const html = motionReadyTemplate({
      userName: "Bob",
      checklist: ["Draft motion", "Attach exhibits", "Sign PDF", "E-file"],
      downloadUrl: "https://example.com/sample.pdf",
    });

    // Send via your Resend setup
    await sendEmail({
      to: testEmail,
      subject: "✅ Test Email from Quick Legal",
      html,
    });

    console.log("📤 Test email sent successfully!");
    res.status(200).json({ ok: true });
  } catch (err: any) {
    console.error("❌ Error sending test email:", err);
    res.status(500).json({ error: err.message });
  }
}