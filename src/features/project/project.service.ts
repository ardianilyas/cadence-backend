import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateProjectDto, UpdateProjectDto } from "@/features/project/project.dto.ts";

export class ProjectService {
  async getProjectsByWorkspaceId(workspaceId: string) {
    return prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async getProjectById(id: string) {
    return prisma.project.findMany({
      where: {
        id
      }
    });
  }

  async createProject(input: CreateProjectDto, authorId: string) {
    return prisma.project.create({
      data: {
        ...input,
        authorId,
      }
    });
  }

  async updateProject(data: UpdateProjectDto, id: string) {
    return prisma.project.update({
      where: { id },
      data
    });
  }

  async deleteProject(id: string) {
    return prisma.project.delete({
      where: { id }
    });
  }
}