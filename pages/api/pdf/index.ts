import { NextApiRequest, NextApiResponse } from "next";
import { PDFDocument, rgb } from "pdf-lib";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { text = "Hello PDF!" } = req.body;

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);
  const { width, height } = page.getSize();

  page.drawText(text, {
    x: 50,
    y: height / 2,
    size: 30,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=form.pdf");
  res.send(Buffer.from(pdfBytes));
}
