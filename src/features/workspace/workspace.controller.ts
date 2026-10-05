import type { WorkspaceService } from "@/features/workspace/workspace.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Response } from "express";
import type { AuthenticatedRequest } from "@/shared/types";
import { sendSuccess } from "@/shared/utils/response.ts";
import { validate } from "@/shared/utils/validate.ts";
import { createWorkspaceDto, getWorkspaceDto, updateWorkspaceDto } from "@/features/workspace/workspace.dto.ts";

export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  getWorkspacesByUserId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const workspaces = await this.workspaceService.getWorkspacesByUserId(req.auth.user.id);
    return sendSuccess(res, "Workspaces fetched", workspaces);
  });

  getWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getWorkspaceDto, req.params.id);
    const workspace = await this.workspaceService.getWorkspace(id);
    return sendSuccess(res, "Workspace fetched", workspace);
  });

  createWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validate(createWorkspaceDto, req.body);
    const workspace = await this.workspaceService.createWorkspace(data, req.auth.user.id);
    return sendSuccess(res, "Workspace created", workspace, 201);
  });

  updateWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getWorkspaceDto, req.params.id);
    const data = validate(updateWorkspaceDto, req.body);
    const workspace = await this.workspaceService.updateWorkspace(data, id);
    return sendSuccess(res, "Workspace updated", workspace);
  });

  deleteWorkspace = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getWorkspaceDto, req.params.id);
    await this.workspaceService.deleteWorkspace(id);
    return sendSuccess(res, "", null, 204);
  });
}
