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
    const workspace = await this.getWorkspaceAndReturnRole(authorId, workspaceId);

    const role = workspace.workspaceMembers[0]?.role;

    if (!role) {
      throw new Error("User is not a member of this workspace");
    }

    ProjectPolicy.canCreate({
      role
    });

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

  private getWorkspaceAndReturnRole(userId: string, workspaceId: string) {
    return prisma.workspace.findUniqueOrThrow({
      where: {
        id: workspaceId
      },
      select: {
        workspaceMembers: {
          where: {
            userId,
          },
          select: {
            role: true
          }
        }
      }
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