import type { ProjectService } from "@/features/project/project.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { AuthenticatedRequest } from "@/shared/types";
import type { Response } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { getWorkspaceDto } from "@/features/workspace/workspace.dto.ts";
import { sendSuccess } from "@/shared/utils/response.ts";
import { createProjectDto, getProjectDto, updateProjectDto } from "@/features/project/project.dto.ts";

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  getProjectsByWorkspaceId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const workspaceId = validate(getWorkspaceDto, req.params.workspaceId);
    const projects = await this.projectService.getProjectsByWorkspaceId(workspaceId);

    return sendSuccess(res, "Projects fetched", projects);
  });

  getProjectById = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const projectId = validate(getProjectDto, req.params.id);
    const project = await this.projectService.getProjectById(projectId);

    return sendSuccess(res, "Project fetched", project);
  });

  createProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const workspaceId = validate(getWorkspaceDto, req.params.workspaceId);
    const input = validate(createProjectDto, req.body);
    const project = await this.projectService.createProject(input, req.auth.user.id, workspaceId);

    return sendSuccess(res, "Project created", project, 201);
  });

  updateProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const projectId = validate(getProjectDto, req.params.id);
    const input = validate(updateProjectDto, req.body);
    const project = await this.projectService.updateProject(input, projectId);

    return sendSuccess(res, "Project updated", project);
  });

  deleteProject = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const projectId = validate(getProjectDto, req.params.id);
    await this.projectService.deleteProject(projectId);

    return sendSuccess(res, "", null, 204);
  });
}