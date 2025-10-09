import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const docs = await prisma.document.findMany({
      where: { userId: String(userId) },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(docs);
  } catch (err) {
    console.error("Error fetching documents:", err);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
}