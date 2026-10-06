import { z } from "zod";
import { ProjectStatus } from "../../../generated/prisma/enums.ts";

export const createProjectDto = z.object({
  name: z.string().min(1, { error: "Name is required" }).min(3, { error: "Name at least 3 characters long" }),
  description: z.string().min(1, { error: "Description is required" }).min(3, { error: "Description at least 3 characters long" }),
  workspaceId: z.string().min(1, { error: "Workspace is required" }),
  status: z.enum(ProjectStatus).default("ACTIVE"),
  startDate: z.date().min(new Date(), { error: "Start date must be in the future" }),
  dueDate: z.date().min(new Date(), { error: "Due date must be in the future" }),
});
export const updateProjectDto = createProjectDto.partial();
export const getProjectDto = z.uuid({ error: "Invalid project id format" });

export type CreateProjectDto = z.infer<typeof createProjectDto>;
export type UpdateProjectDto = z.infer<typeof updateProjectDto>;
export type GetProjectDto = z.infer<typeof getProjectDto>;
