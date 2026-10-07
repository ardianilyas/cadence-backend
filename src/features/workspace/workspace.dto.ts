import { z } from "zod";
import { WORKSPACE_ERROR_VALIDATION } from "@/features/workspace/workspace.constant.ts";

export const createWorkspaceDto = z.object({
  name: z.string().min(3, { error: WORKSPACE_ERROR_VALIDATION.NAME.MIN }).max(50, { error: WORKSPACE_ERROR_VALIDATION.NAME.MAX }),
  description: z.string().min(3, { error: WORKSPACE_ERROR_VALIDATION.DESCRIPTION.MIN }),
});
export const updateWorkspaceDto = createWorkspaceDto.partial();
export const getWorkspaceDto = z.uuid({ error: WORKSPACE_ERROR_VALIDATION.ID });

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceDto>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceDto>;
export type GetWorkspaceDto = z.infer<typeof getWorkspaceDto>;