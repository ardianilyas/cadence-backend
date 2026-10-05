import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateWorkspaceDto, UpdateWorkspaceDto } from "@/features/workspace/workspace.dto.ts";

export class WorkspaceService {
  async getWorkspacesByUserId(authorId: string) {
    return prisma.workspace.findMany({
      where: {
        authorId
      }
    });
  }

  async getWorkspace(id: string) {
    return prisma.workspace.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  async createWorkspace(input: CreateWorkspaceDto, authorId: string) {
    const data = { ...input, authorId };
    return prisma.workspace.create({
      data
    });
  }

  async updateWorkspace(data: UpdateWorkspaceDto, id: string) {
    return prisma.workspace.update({
      where: {
        id
      },
      data
    });
  }

  async deleteWorkspace(id: string) {
    return prisma.workspace.delete({
      where: {
        id
      }
    });
  }
}