import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import { sealPdf } from '@/lib/pdfSeal'

// Disable Next.js body parser (since formidable handles multipart form data)
export const config = {
  api: { bodyParser: false },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'temp')
    fs.mkdirSync(uploadDir, { recursive: true })

    // Initialize formidable form handler
    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
    })

    // Parse form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err)
        return res.status(400).json({ error: err.message })
      }

      // Grab uploaded file
      const file = files.file?.[0] || files.file
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No file uploaded' })
      }

      const filename = path.basename(file.filepath)
      const publicUrl = `/temp/${filename}`

      // Seal PDF (adds hash + timestamp metadata)
      try {
        await sealPdf(file.filepath)
        console.log(`Sealed and saved: ${filename}`)
      } catch (sealErr) {
        console.warn('Seal failed:', sealErr)
      }

      // Send response
      res.status(200).json({ key: filename, publicUrl })
    })
  } catch (err: any) {
    console.error('Upload error:', err)
    res.status(500).json({ error: err.message })
  }
}