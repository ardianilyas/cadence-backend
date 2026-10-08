import { faker } from "@faker-js/faker";
import { prisma } from "@/shared/lib/prisma.ts";

type InsertWorkspace = {
  name: string;
  description: string;
  authorId: string;
}

export async function seedWorkspace(userId: string) {
  const data: InsertWorkspace = {
    name: faker.lorem.word(),
    description: faker.lorem.sentence(),
    authorId: userId
  };

  return prisma.workspace.create({
    data: {
      ...data,
      workspaceMembers: {
        create: {
          userId,
          role: "Project_Manager"
        }
      }
    }
  });
}
