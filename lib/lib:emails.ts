import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  if (process.env.NOTIFY_MODE === "off") {
    console.log(`📭 Email notifications disabled. Would have sent to: ${to}`);
    return;
  }

  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to,
      subject,
      html,
    });

    console.log(`✅ Email sent to ${to} (${response.id || "no ID"})`);
    return response;
  } catch (err: any) {
    console.error(`❌ Failed to send email to ${to}:`, err.message);
  }
}