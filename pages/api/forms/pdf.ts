import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb } from "pdf-lib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { fullName, email, message } = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  const fontSize = 16;
  page.drawText(`Form Submission PDF`, {
    x: 50,
    y: height - 50,
    size: fontSize + 4,
    color: rgb(0, 0.53, 0.71),
  });

  page.drawText(`Name: ${fullName}`, { x: 50, y: height - 100, size: fontSize });
  page.drawText(`Email: ${email}`, { x: 50, y: height - 130, size: fontSize });
  page.drawText(`Message: ${message}`, { x: 50, y: height - 160, size: fontSize });

  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=form.pdf");
  res.send(Buffer.from(pdfBytes));
}
