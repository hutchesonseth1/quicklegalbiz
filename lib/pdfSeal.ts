import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

/**
 * Seal a PDF file with a cryptographic hash, timestamp, and metadata.
 * Produces a .json file with the seal data next to the PDF.
 */
export async function sealPdf(filePath: string) {
  const fileBuffer = fs.readFileSync(filePath)
  const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex')
  const timestamp = new Date().toISOString()
  const fileName = path.basename(filePath)

  const sealData = {
    fileName,
    timestamp,
    hash,
    verified: true,
    version: 1,
  }

  const sealPath = `${filePath}.seal.json`
  fs.writeFileSync(sealPath, JSON.stringify(sealData, null, 2))

  console.log(`✅ PDF sealed: ${fileName}`)
  return { sealPath, ...sealData }
}