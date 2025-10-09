// pages/api/schema.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { spooler } from "@/lib/spooler"; // wherever your schema logic is

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      const data = await spooler.fetch(); // 👈 fetch from schema
      return res.status(200).json({ data });
    }

    if (req.method === "POST") {
      const body = req.body;
      await spooler.push(body); // 👈 write to schema
      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (err) {
    console.error("Schema error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}