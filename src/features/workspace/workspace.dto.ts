import { z } from "zod";

export const createWorkspaceDto = z.object({
  name: z.string().min(3, { error: "Name must be at least 3 characters long" }).max(50, { error: "Name must be at most 50 characters long" }),
  description: z.string().min(3, { error: "Description must be at least 3 characters long" }),
});
export const updateWorkspaceDto = createWorkspaceDto.partial();
export const getWorkspaceDto = z.uuid({ error: "Invalid workspace id format" });

export type CreateWorkspaceDto = z.infer<typeof createWorkspaceDto>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceDto>;
export type GetWorkspaceDto = z.infer<typeof getWorkspaceDto>;