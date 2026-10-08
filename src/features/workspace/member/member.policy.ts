import type { WorkspaceRole } from "../../../../generated/prisma/enums.ts";
import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { MEMBER_FORBIDDEN_MESSAGE } from "@/features/workspace/member/member.constant.ts";

type MemberPolicyContext = {
  role: WorkspaceRole;
}

export const MemberPolicy = {
  canAddMember(context: MemberPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(MEMBER_FORBIDDEN_MESSAGE.ADD);
    }
  },

  canRemoveMember(context: MemberPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(MEMBER_FORBIDDEN_MESSAGE.REMOVE);
    }
  }
}