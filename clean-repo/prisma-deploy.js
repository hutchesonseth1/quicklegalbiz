const { execSync } = require("child_process");

try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
} catch (err) {
  console.error("Prisma deploy failed:", err);
  process.exit(1);
}