import { pool } from "@/shared/db";

export async function clearDb() {
  try {
    await pool.query(`
      DELETE FROM "session";
      DELETE FROM "account";
      DELETE FROM "user";
      DELETE FROM "verification";
    `);
  } catch (error: any) {
    // Ignore when PostgreSQL is not reachable in local test environment
    if (
      error?.code === "28000" ||
      error?.code === "ECONNREFUSED" ||
      error?.message?.includes("does not exist") ||
      error?.message?.includes("connect")
    ) {
      return;
    }
    throw error;
  }
}