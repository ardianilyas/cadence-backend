import type { MemberService } from "@/features/workspace/member.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Request, Response } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { addMemberDto } from "@/features/workspace/member.dto.ts";
import { sendSuccess } from "@/shared/utils/response.ts";
import { getWorkspaceDto } from "@/features/workspace/workspace.dto.ts";
import { MEMBER_SUCCESS_MESSAGE } from "@/features/workspace/workspace.constant.ts";

export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  addMemberToWorkspace = asyncHandler(async (req: Request, res: Response) => {
    const workspaceId = validate(getWorkspaceDto, req.params.id);
    const data = validate(addMemberDto, req.body);
    const workspaceMember = await this.memberService.addMemberToWorkspace(data, workspaceId);
    return sendSuccess(res, MEMBER_SUCCESS_MESSAGE.ADD_MEMBER_TO_WORKSPACE, workspaceMember, 201);
  });
}
