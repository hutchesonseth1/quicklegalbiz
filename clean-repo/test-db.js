import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    console.log("✅ Connected! Server time:", now);
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();