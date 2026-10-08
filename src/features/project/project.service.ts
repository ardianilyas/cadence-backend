import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateProjectDto, UpdateProjectDto } from "@/features/project/project.dto.ts";
import { ProjectPolicy } from "@/features/project/project.policy.ts";

export class ProjectService {
  async getProjectsByWorkspaceId(workspaceId: string) {
    return prisma.project.findMany({
      where: {
        workspaceId,
      },
    });
  }

  async getProjectById(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async createProject(input: CreateProjectDto, authorId: string, workspaceId: string) {
    return prisma.project.create({
      data: {
        ...input,
        authorId,
        workspaceId,
      }
    });
  }

  async updateProject(data: UpdateProjectDto, id: string, userId: string) {
    const project = await this.getProjectAndReturnAuthorId(id);

    ProjectPolicy.canUpdate({
      authorId: project.authorId,
      userId
    });

    return prisma.project.update({
      where: { id },
      data
    });
  }

  async deleteProject(id: string, userId: string) {
    const project = await this.getProjectAndReturnAuthorId(id);

    ProjectPolicy.canDelete({
      authorId: project.authorId,
      userId
    });

    return prisma.project.delete({
      where: { id }
    });
  }

  private async getProjectAndReturnAuthorId(id: string) {
    return prisma.project.findUniqueOrThrow({
      where: {
        id
      },
      select: {
        authorId: true
      }
    });
  }
}