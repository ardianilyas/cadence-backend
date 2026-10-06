import { faker } from "@faker-js/faker";
import { prisma } from "@/shared/lib/prisma.ts";

type InsertWorkspace = {
  name: string;
  description: string;
  authorId: string;
}

export async function seedWorkspace(userId: string, length: number = 1) {
  const data: InsertWorkspace[] = Array.from({ length }).map(() => ({
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    authorId: userId
  }));

  return prisma.workspace.createManyAndReturn({
    data
  });
}
