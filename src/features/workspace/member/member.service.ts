import type { AddMemberDto } from "@/features/workspace/member/member.dto.ts";
import { prisma } from "@/shared/lib/prisma.ts";
import { MemberPolicy } from "@/features/workspace/member/member.policy.ts";

export class MemberService {
  async addMemberToWorkspace(data: AddMemberDto, workspaceId: string, userId: string) {
    const workspaceMember = await this.getMemberWorkspace(workspaceId, userId);

    MemberPolicy.canAddMember({
      role: workspaceMember.role
    });

    return prisma.workspaceMember.create({
      data: {
        ...data,
        workspaceId
      }
    });
  }

  async removeMemberToWorkspace(workspaceId: string, memberId: string, userId: string) {
    const workspaceMember = await this.getMemberWorkspace(workspaceId, userId);

    MemberPolicy.canRemoveMember({
      role: workspaceMember.role
    });

    return prisma.workspaceMember.delete({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId
        }
      }
    });
  }

  async getUsersNotInWorkspace(workspaceId: string) {
    const workspace = await this.getWorkspace(workspaceId);

    return prisma.user.findMany({
      where: {
        workspaceMembers: {
          none: {
            workspaceId: workspace.id
          }
        }
      },
      select: {
        id: true,
        name: true,
        email: true
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  private async getWorkspace(id: string) {
    return prisma.workspace.findUniqueOrThrow({
      where: {
        id
      }
    });
  }

  private async getMemberWorkspace(workspaceId: string, userId: string) {
    return prisma.workspaceMember.findUniqueOrThrow({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId
        }
      },
      select: {
        role: true
      }
    });
  }
}
