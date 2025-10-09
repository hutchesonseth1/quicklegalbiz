// pages/api/forms/save.ts

import type { NextApiRequest, NextApiResponse } from "next";

// Simple in-memory store (replace with DB later)
const formEntries: any[] = [];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { fullName, email, message, userEmail } = req.body;

    const entry = {
      user: userEmail,
      fullName,
      email,
      message,
      submittedAt: new Date().toISOString(),
    };

    formEntries.push(entry);
    console.log("Stored form entry:", entry);

    return res.status(200).json({ success: true });
  }

  res.status(405).end("Method Not Allowed");
}
