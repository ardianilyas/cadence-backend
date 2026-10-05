import request from "supertest";
import app from "@/server";
import { prisma } from "@/shared/db";
import type { UserRole } from "@/shared/types/express";
import { faker } from "@faker-js/faker";

export async function authenticate(role: UserRole = "user") {
  const agent = request.agent(app);

  const user = {
    name: faker.internet.displayName(),
    email: faker.internet.email(),
    password: "developer"
  };

  const auth = await agent
    .post("/api/auth/sign-up/email")
    .send(user);

  const id = auth.body.user.id;

  const userData = await prisma.user.update({
    where: { id },
    data: { role }
  });

  const userId = userData.id;

  await agent
    .post("/api/auth/sign-in/email")
    .send({
      email: user.email,
      password: user.password
    });

  return {
    user,
    userId,
    agent
  };
}