import { prisma } from "@/lib/prisma";

export async function logEvent(message: string) {
  try {
    await prisma.log.create({
      data: { type: "agent", message },
    });
  } catch (err) {
    console.error("Failed to log event:", err);
  }
}
