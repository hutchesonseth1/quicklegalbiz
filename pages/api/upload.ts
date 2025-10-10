import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: { bodyParser: false },
};

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service key for file insert
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const form = formidable({ multiples: false, keepExtensions: true });
    const [fields, files] = await form.parse(req).then(
      (result) => result,
      (err) => {
        throw new Error("Failed to parse upload form: " + err.message);
      }
    );

    const file = files.file?.[0];
    if (!file) throw new Error("No file received");

    const fileData = await fs.promises.readFile(file.filepath);
    const fileName = `${Date.now()}-${path.basename(file.originalFilename || "upload")}`;

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from("documents") // Your bucket name
      .upload(fileName, fileData, {
        contentType: file.mimetype || "application/octet-stream",
        upsert: true,
      });

    if (error) {
      console.warn("Supabase upload failed, fallback triggered:", error.message);
      throw new Error("Supabase upload failed");
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from("documents")
      .getPublicUrl(fileName);

    return res.status(200).json({
      success: true,
      key: fileName,
      publicUrl: publicUrlData.publicUrl,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: err.message || "Upload failed" });
  }
}