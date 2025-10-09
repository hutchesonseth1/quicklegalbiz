import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { answers } = req.body;

    if (!answers || typeof answers !== "string") {
      return res.status(400).json({ error: "Missing or invalid answers" });
    }

    const record = await prisma.payment.create({
      data: {
        sessionId: `intake_${Date.now()}`,
        customerEmail: "pending@quicklegalbiz.com",
        amount: 0,
        status: "intake_saved",
        currency: "usd",
        receiptUrl: answers,
      },
    });

    console.log("✅ Intake saved:", record);
    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("❌ Prisma intake error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    await prisma.$disconnect();
  }
}