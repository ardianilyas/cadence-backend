import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  test: {
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    env: {
      PORT: "3000",
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/postgres",
      BETTER_AUTH_SECRET: "test-secret-key-1234567890",
      BETTER_AUTH_URL: "http://localhost:3000"
    }
  }
});