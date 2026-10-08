import { z } from "zod";
import { WorkspaceRole } from "../../../../generated/prisma/enums.ts";
import { MEMBER_ERROR_VALIDATION } from "@/features/workspace/member/member.constant.ts";

export const addMemberDto = z.object({
  userId: z.string({ error: MEMBER_ERROR_VALIDATION.USER_ID.REQUIRED }).min(1, { error: MEMBER_ERROR_VALIDATION.USER_ID.REQUIRED }),
  role: z.enum(WorkspaceRole, { error: MEMBER_ERROR_VALIDATION.ROLE.REQUIRED }).default("Developer").optional(),
});

export type AddMemberDto = z.infer<typeof addMemberDto>;
