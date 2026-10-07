import { prisma } from "@/shared/db";

export async function clearDb() {
  await prisma.$executeRawUnsafe(`
    DELETE FROM "tasks",
    DELETE FROM "projects";
    DELETE FROM "workspaces";
    DELETE FROM "workspace_member";
    DELETE FROM "sessions";
    DELETE FROM "accounts";
    DELETE FROM "verifications";
    DELETE FROM "users";
  `);
}