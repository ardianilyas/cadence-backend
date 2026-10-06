import type { AddMemberDto } from "@/features/workspace/member.dto.ts";
import { prisma } from "@/shared/lib/prisma.ts";

export class MemberService {
  async addMemberToWorkspace(data: AddMemberDto, workspaceId: string) {
    return prisma.workspaceMember.create({
      data: {
        ...data,
        workspaceId
      }
    });
  }
}
