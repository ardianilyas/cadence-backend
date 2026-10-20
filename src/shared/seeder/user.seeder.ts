import { faker } from "@faker-js/faker";
import { auth } from "@/shared/lib/auth.ts";
import { prisma, pool } from "@/shared/db";
import type { Role } from "@/shared/db";

export interface CreateUserData {
  email: string;
  name: string;
  password?: string;
  role?: Role;
  emailVerified?: boolean;
}

export type SeedUserOptions = {
  length?: number;
  email?: string;
  name?: string;
  password?: string;
  role?: Role;
  emailVerified?: boolean;
};

export async function createSeedUser(data: CreateUserData) {
  const email = data.email.toLowerCase().trim();
  const password = data.password || "developer";
  const name = data.name.trim();
  const role = data.role || "user";
  const emailVerified = data.emailVerified ?? true;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    console.log(`ℹ️  User already exists: ${email} (ID: ${existingUser.id})`);
    return existingUser;
  }

  // Better-Auth pattern: auth.api.signUpEmail
  // This automatically hashes the password with Better-Auth's hasher,
  // creates the credential account, and creates the user record.
  const response = await auth.api.signUpEmail({
    body: {
      email,
      name,
      password,
    },
  });

  if (!response?.user) {
    throw new Error(`Failed to create user with email: ${email}`);
  }

  // Apply role and email verification status
  const user = await prisma.user.update({
    where: { id: response.user.id },
    data: {
      role,
      emailVerified,
    },
  });

  return user;
}

export async function seedUser(lengthOrOptions: number | SeedUserOptions = 1) {
  const options: SeedUserOptions =
    typeof lengthOrOptions === "number"
      ? { length: lengthOrOptions }
      : lengthOrOptions;

  const length = options.length ?? 1;
  const users = [];

  if (options.email) {
    const user = await createSeedUser({
      email: options.email,
      name: options.name || options.email.split("@")[0] || "User",
      password: options.password || "developer",
      role: options.role || "user",
      emailVerified: options.emailVerified ?? true,
    });
    users.push(user);
    console.log(`✅ Seeded user: ${user.email} (Role: ${user.role || "user"})`);
    return users;
  }

  for (let i = 0; i < length; i++) {
    const email = faker.internet.email().toLowerCase();
    const name = faker.internet.displayName();
    const password = options.password || "developer";
    const role = options.role || "user";

    const user = await createSeedUser({
      email,
      name,
      password,
      role,
      emailVerified: options.emailVerified ?? true,
    });
    users.push(user);
    console.log(`✅ Seeded user (${i + 1}/${length}): ${user.email} (Role: ${user.role || "user"})`);
  }

  console.log(`✨ Total user(s) processed: ${users.length}`);
  return users;
}

export function parseArgs(argv: string[]): SeedUserOptions {
  let count: number | undefined;
  let email: string | undefined;
  let password: string | undefined;
  let name: string | undefined;
  let role: Role | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg) continue;

    if (arg === "--count" || arg === "-c") {
      const next = argv[++i];
      if (next) count = parseInt(next, 10);
    } else if (arg.startsWith("--count=")) {
      count = parseInt(arg.split("=")[1] || "1", 10);
    } else if (arg === "--email" || arg === "-e") {
      email = argv[++i];
    } else if (arg.startsWith("--email=")) {
      email = arg.split("=")[1];
    } else if (arg === "--password" || arg === "-p") {
      password = argv[++i];
    } else if (arg.startsWith("--password=")) {
      password = arg.split("=")[1];
    } else if (arg === "--name" || arg === "-n") {
      name = argv[++i];
    } else if (arg.startsWith("--name=")) {
      name = arg.split("=")[1];
    } else if (arg === "--role" || arg === "-r") {
      const r = argv[++i];
      if (r === "admin" || r === "user") role = r;
    } else if (arg.startsWith("--role=")) {
      const r = arg.split("=")[1];
      if (r === "admin" || r === "user") role = r;
    } else if (!arg.startsWith("-") && !isNaN(Number(arg))) {
      count = parseInt(arg, 10);
    }
  }

  return {
    length: count ?? 1,
    email,
    password,
    name,
    role,
  };
}

async function runCli() {
  try {
    const args = parseArgs(process.argv.slice(2));
    console.log("🌱 Starting user seeder (Better-Auth pattern)...");
    const users = await seedUser(args);
    console.log(`\n🎉 User seeding completed! Total: ${users.length}`);
  } catch (error) {
    console.error("\n❌ Error running user seeder:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

const isDirectExecution =
  (typeof Bun !== "undefined" && import.meta.main) ||
  (Boolean(process.argv[1]) &&
    (process.argv[1].endsWith("user.seeder.ts") ||
      process.argv[1].endsWith("user.seeder.js")));

if (isDirectExecution) {
  runCli();
}
