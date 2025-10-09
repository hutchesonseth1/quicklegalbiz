import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Fetch all saved documents
      const docs = await prisma.document.findMany({
        orderBy: { createdAt: "desc" },
      });
      return res.status(200).json(docs);
    }

    if (req.method === "POST") {
      const { name, email, docType, filename } = req.body;

      if (!name || !email || !filename) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newDoc = await prisma.document.create({
        data: {
          name,
          email,
          docType: docType || "General",
          filename,
        },
      });

      return res.status(201).json(newDoc);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}