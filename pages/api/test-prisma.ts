import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // 🧠 Test record: creates a temporary user in your database
    const testUser = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "QuickLegal Test",
      },
    });

    // 🧾 Retrieve all users for confirmation
    const users = await prisma.user.findMany();

    res.status(200).json({
      message: "✅ Prisma test successful!",
      created: testUser,
      totalUsers: users.length,
    });
  } catch (error: any) {
    console.error("❌ Prisma test error:", error);
    res.status(500).json({ error: error.message });
  } finally {
    await prisma.$disconnect();
  }
}