import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "@/server";

describe("Health Check API", () => {
  it("GET /api/health should return health status object", async () => {
    const res = await request(app).get("/api/health");
    expect([200, 503]).toContain(res.status);
    expect(res.body.status).toBeDefined();
    expect(res.body.uptime).toBeTypeOf("number");
    expect(res.body.services).toBeDefined();
    expect(res.body.services.database).toBeDefined();
  });
});
