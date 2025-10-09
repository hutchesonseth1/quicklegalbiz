import { prisma } from "@/lib/prisma";
import { logEvent } from "../memory/logEvent";

export async function checkDatabase() {
  const docCount = await prisma.document.count();
  const logCount = await prisma.log.count();
  const report = \`DB check: \${docCount} documents, \${logCount} logs.\`;
  await logEvent(report);
  return report;
}
