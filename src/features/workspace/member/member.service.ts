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
