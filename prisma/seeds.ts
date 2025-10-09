import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Clear existing docs
  await prisma.document.deleteMany();

  // Insert some fake docs
  await prisma.document.createMany({
    data: [
      {
        name: "Seth Hutcheson",
        email: "seth@example.com",
        docType: "Lien",
        filename: "lien-131E6th.pdf",
      },
      {
        name: "Clay Hutcheson",
        email: "clay@example.com",
        docType: "Affidavit",
        filename: "clay-affidavit.pdf",
      },
      {
        name: "Logic Solutions LLC",
        email: "legal@logicalpropertygroup.com",
        docType: "Invoice",
        filename: "invoice-277West.pdf",
      },
    ],
  });

  console.log("✅ Seeded documents!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });