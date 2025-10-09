import type { NextApiRequest, NextApiResponse } from "next";
import { runAgent } from "@/ai/agent";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const result = await runAgent("generateDoc", {
      topic: "Contract Agreement",
      userData: { name: "John Doe", date: new Date().toDateString() },
    });

    res.status(200).json({ success: true, result });
  } catch (error: any) {
    console.error("Agent test failed:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}