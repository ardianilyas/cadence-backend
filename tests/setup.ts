if (!process.env.PORT) process.env.PORT = "3000";
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
if (!process.env.BETTER_AUTH_SECRET) process.env.BETTER_AUTH_SECRET = "test-secret-key-1234567890";
if (!process.env.BETTER_AUTH_URL) process.env.BETTER_AUTH_URL = "http://localhost:3000";

import { beforeAll, afterEach } from "vitest";
import { clearDb } from "./helpers/clear-db";

beforeAll(async () => {
  await clearDb();
});

afterEach(async () => {
  await clearDb();
});
