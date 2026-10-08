import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateWorkspaceDto, UpdateWorkspaceDto } from "@/features/workspace/workspace.dto.ts";
import type { WorkspaceRole } from "../../../generated/prisma/enums.ts";
import { WorkspacePolicy } from "@/features/workspace/workspace.policy.ts";
import { workspaceWithMemberArgs } from "@/features/workspace/workspace.select.ts";

export class WorkspaceService {
  async getWorkspacesByUserId(authorId: string) {
    return prisma.workspace.findMany({
      where: {
        authorId
      },
      include: {
        _count: {
          select: {
            workspaceMembers: true
          }
        }
      }
    });
  }

  async getWorkspace(id: string) {
    return prisma.workspace.findUniqueOrThrow({
      where: {
        id
      },
      include: workspaceWithMemberArgs
    });
  }

  async createWorkspace(input: CreateWorkspaceDto, authorId: string) {
    const data = { ...input, authorId };

    const role: WorkspaceRole = "Project_Manager";

    return prisma.workspace.create({
      data: {
        ...data,
        workspaceMembers: {
          create: {
            userId: authorId,
            role
          }
        }
      },
    });
  }

  async updateWorkspace(data: UpdateWorkspaceDto, workspaceId: string, userId: string) {
    await this.getWorkspace(workspaceId);
    const workspaceMember = await this.getWorkspaceMember(workspaceId, userId);

    WorkspacePolicy.canUpdate({
      role: workspaceMember.role
    });

    return prisma.workspace.update({
      where: {
        id: workspaceId
      },
      data
    });
  }

  async deleteWorkspace(workspaceId: string, userId: string) {
    await this.getWorkspace(workspaceId);
    const workspaceMember = await this.getWorkspaceMember(workspaceId, userId);

    WorkspacePolicy.canDelete({
      role: workspaceMember.role
    });

    return prisma.workspace.delete({
      where: {
        id: workspaceId
      }
    });
  }

  private async getWorkspaceMember(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUniqueOrThrow({
      where: {
        workspaceId_userId: {
          userId,
          workspaceId
        }
      },
      select: {
        role: true
      }
    });
  }
}