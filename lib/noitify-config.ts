import { sendEmail } from "@/lib/email";

export const notify = {
  // 👥 For users
  user: async (to: string, subject: string, html: string) =>
    sendEmail({ to, subject, html }),

  // ⚙️ For routine updates (ops)
  ops: async (subject: string, html: string) =>
    sendEmail({ to: process.env.OPERATIONS_EMAIL!, subject, html }),

  // 🚨 For errors and critical alerts
  admin: async (subject: string, html: string) =>
    sendEmail({ to: process.env.ADMIN_EMAIL!, subject, html }),

  // 🧪 For development/testing
  dev: async (subject: string, html: string) =>
    sendEmail({ to: process.env.DEV_EMAIL!, subject, html }),
};
