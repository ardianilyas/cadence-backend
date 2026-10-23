import { prisma } from "@/shared/lib/prisma.ts";
import type { CreateTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from "@/features/task/task.dto.ts";
import { TaskPolicy } from "@/features/task/task.policy.ts";
import { taskWithRelationsArgs } from "@/features/task/task.select.ts";

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
      include: taskWithRelationsArgs
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
    const project = await this.getProjectAndReturnWorkspace(data.projectId);
    const role = await this.getUserRoleInWorkspace(createdById, project.workspaceId);

    if (!role) {
      throw new Error("User is not a member of this workspace");
    }

    TaskPolicy.canCreate({ role });

    return prisma.task.create({
      data: {
        ...data,
        createdById
      }
    });
  }

  async updateTaskStatus(id: string, status: UpdateTaskStatusDto) {
    return prisma.task.update({
      where: {
        id
      },
      data: {
        status,
        completedAt: status === "DONE" ? new Date() : null,
      },
      include: taskWithRelationsArgs,
    });
  }

  async updateTask(data: UpdateTaskDto, id: string, userId: string) {
    const task = await this.getTaskAndReturnProjectId(id);
    const project = await this.getProjectAndReturnWorkspace(task.projectId);
    const role = await this.getUserRoleInWorkspace(userId, project.workspaceId);

    if (!role) {
      throw new Error("User is not a member of this workspace");
    }

    TaskPolicy.canUpdate({ role });

    return prisma.task.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskAndReturnProjectId(id);
    const project = await this.getProjectAndReturnWorkspace(task.projectId);
    const role = await this.getUserRoleInWorkspace(userId, project.workspaceId);

    if (!role) {
      throw new Error("User is not a member of this workspace");
    }

    TaskPolicy.canDelete({ role });

    return prisma.task.delete({
      where: {
        id
      }
    });
  }

  private async getTaskAndReturnProjectId(id: string) {
    return prisma.task.findUniqueOrThrow({
      where: { id },
      select: { projectId: true }
    });
  }

  private async getProjectAndReturnWorkspace(projectId: string) {
    return prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      select: { workspaceId: true }
    });
  }

  private async getUserRoleInWorkspace(userId: string, workspaceId: string) {
    const workspace = await prisma.workspace.findUniqueOrThrow({
      where: { id: workspaceId },
      select: {
        workspaceMembers: {
          where: { userId },
          select: { role: true }
        }
      }
    });

    return workspace.workspaceMembers[0]?.role;
  }
}