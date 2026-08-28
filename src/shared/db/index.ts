import postgres from "@prisma/orm-postgres/runtime";
import type { Contract } from "../../../generated/prisma/contract";
import contractJson from "../../../generated/prisma/contract.json" with { type: "json" };
import pg from "pg";
import { env } from "@/shared/config/env";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = postgres<Contract>({
  contractJson,
  url: env.DATABASE_URL,
});

export const prisma = db;

export type { Contract };
export type Role = "admin" | "user";
