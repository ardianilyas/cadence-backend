import { faker } from "@faker-js/faker";
import { TaskPriority, TaskStatus } from "../../../generated/prisma/enums.ts";
import { prisma } from "@/shared/lib/prisma.ts";

type CreateTask = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date;
  projectId: string;
  createdById: string;
}

export async function seedTask(createdById: string, projectId: string, length: number = 1) {
  const data: CreateTask[] = Array.from({ length }).map(() => ({
    title: faker.commerce.department(),
    description: faker.lorem.sentence(),
    status: faker.helpers.enumValue(TaskStatus),
    priority: faker.helpers.enumValue(TaskPriority),
    dueDate: faker.date.future(),
    projectId,
    createdById
  }));

  return prisma.task.createManyAndReturn({
    data
  });
}
