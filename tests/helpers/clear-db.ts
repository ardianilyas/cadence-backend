import { prisma } from "@/shared/db";

export async function clearDb() {
  await prisma.$executeRawUnsafe(`
    DELETE FROM "session";
    DELETE FROM "account";
    DELETE FROM "user";
    DELETE FROM "verification";
  `);
}