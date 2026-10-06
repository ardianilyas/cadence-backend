import type { ProjectStatus } from "../../../generated/prisma/enums.ts";
import { ProjectStatus as ProjectStatusEnum } from "../../../generated/prisma/enums.ts";
import { faker } from "@faker-js/faker";
import { prisma } from "@/shared/lib/prisma.ts";

type CreateProject = {
  name: string;
  description: string;
  authorId: string;
  workspaceId: string;
  status: ProjectStatus;
  startDate: Date;
  dueDate: Date;
}

export async function seedProject(authorId: string, workspaceId: string, length: number = 1) {
  const data: CreateProject[] = Array.from({ length }).map(() => ({
    name: faker.company.buzzNoun(),
    description: faker.lorem.sentence(),
    authorId,
    workspaceId,
    status: faker.helpers.enumValue(ProjectStatusEnum),
    startDate: faker.date.past({ years: 1 }),
    dueDate: faker.date.future({ years: 1 }),
  }));

  return prisma.project.createManyAndReturn({
    data
  });
}
