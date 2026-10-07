import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateTaskDto, UpdateTaskDto } from "@/features/task/task.dto.ts";

export class TaskService {
  async getTasksByProjectId(projectId: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: {
        id: projectId
      },
      select: {
        id: true
      }
    });

    return prisma.task.findMany({
      where: {
        projectId: project.id,
      },
    });
  }

  async getTask(id: string) {
    return prisma.task.findUniqueOrThrow({
      where: {
        id,
      },
    });
  }

  async createTask(data: CreateTaskDto, createdById: string) {
    return prisma.task.create({
      data: {
        ...data,
        createdById
      }
    });
  }

  async updateTask(data: UpdateTaskDto, id: string) {
    return prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteTask(id: string) {
    return prisma.task.delete({
      where: {
        id
      }
    });
  }
}