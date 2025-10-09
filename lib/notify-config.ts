import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendNotification({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.DEFAULT_FROM_EMAIL!,
      to,
      subject,
      html,
    });

    if (error) throw error;
    console.log("✅ Email sent successfully:", data?.id || data);
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
}
