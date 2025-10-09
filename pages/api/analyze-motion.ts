import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import OpenAI from "openai";
import { sendNotification } from "@/lib/notify-config"; // ✅ notification helper
import { motionReadyTemplate, adminAlertTemplate } from "@/lib/email-templates";

// --- Initialize OpenAI ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload failed" });

    try {
      const desc = fields.desc as string;
      const file = (files.file as formidable.File[])[0];
      const text = fs.readFileSync(file.filepath, "utf8");

      const prompt = `
      You are a paralegal helping someone represent themselves.
      Review this motion, fix formatting and legal phrasing,
      and produce a checklist of missing parts (signatures, parties, exhibits).

      Text:
      ${desc}
      ${text}
      `;

      // --- Ask OpenAI to generate checklist ---
      const ai = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const content = ai.choices[0]?.message?.content || "";
      const checklist = content.split("\n").map((i) => ({ item: i }));

      // ✅ Send notification emails
      try {
        // User email
        await sendNotification({
          to: fields.email || "hutchesonseth1@gmail.com",
          subject: "✅ Your Motion Checklist Is Ready — QuickLegalBiz",
          html: motionReadyTemplate({
            userName: fields.name || "Friend",
            checklist: checklist.map((c) => c.item || ""),
            downloadUrl: "https://quicklegalbiz.com/dashboard",
          }),
        });

        // Ops email (you)
        await sendNotification({
          to: "seth@logicalsolutionsgroup.com",
          subject: "📥 New Motion Submission Received",
          html: `
            <h3>New motion submitted!</h3>
            <ul>
              <li><strong>Name:</strong> ${fields.name || "N/A"}</li>
              <li><strong>Email:</strong> ${fields.email || "N/A"}</li>
              <li><strong>Description:</strong> ${fields.desc || "None provided"}</li>
            </ul>
          `,
        });

        // Admin alert
        await sendNotification({
          to: "legal@logicalsolutionsgroup.com",
          subject: "🚨 Motion Submission Processed — Admin Alert",
          html: adminAlertTemplate(
            "Motion Submission Processed",
            JSON.stringify({ name: fields.name, email: fields.email, desc: fields.desc }, null, 2)
          ),
        });

        console.log("✅ Notification emails sent successfully.");
      } catch (error) {
        console.error("❌ Email sending failed:", error);
      }

      // Return response
      res.status(200).json({
        checklist,
        summary: "Motion analyzed successfully.",
      });
    } catch (error) {
      console.error("❌ Error in motion analysis:", error);
      res.status(500).json({ error: "Failed to process motion." });
    }
  });
}