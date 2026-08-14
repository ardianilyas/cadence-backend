import request from "supertest";
import app from "@/server";
import { prisma } from "@/shared/db";
import type { UserRole } from "@/shared/types/express";

export async function authenticate(role: UserRole = "user") {
  const agent = request.agent(app);

  const user = {
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  };

  await agent
    .post("/api/auth/sign-up/email")
    .send(user);

  await prisma.user.update({
    where: { email: user.email },
    data: { role }
  });

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    });

  return {
    user,
    agent
  };
}