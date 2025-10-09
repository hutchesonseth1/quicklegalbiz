import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { name, email, docType, filename } = req.body;

      if (!name || !email || !docType || !filename) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const doc = await prisma.document.create({
        data: { name, email, docType, filename },
      });

      return res.status(201).json(doc);
    } catch (err) {
      console.error("Error creating document:", err);
      return res.status(500).json({ error: "Server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}