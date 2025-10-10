import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { title, fileUrl, formType, caseNumber, county, date } = req.body;

    if (!title || !fileUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase.from("vault_documents").insert([
      {
        title,
        file_url: fileUrl,
        form_type: formType,
        case_number: caseNumber,
        county,
        date,
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (err: any) {
    console.error("Vault ingest error:", err);
    return res.status(500).json({ error: err.message || "Failed to insert document" });
  }
}