import { z } from "zod";
import { ProjectStatus } from "../../../generated/prisma/enums.ts";
import { PROJECT_ERROR_VALIDATION } from "@/features/project/project.constant.ts";

export const createProjectDto = z.object({
  name: z.string().min(1, { error: PROJECT_ERROR_VALIDATION.NAME.REQUIRED }).min(3, { error: PROJECT_ERROR_VALIDATION.NAME.MIN }),
  description: z.string().min(1, { error: PROJECT_ERROR_VALIDATION.DESCRIPTION.REQUIRED }).min(3, { error: PROJECT_ERROR_VALIDATION.DESCRIPTION.MIN }),
  status: z.enum(ProjectStatus).default("ACTIVE"),
  startDate: z.coerce.date().min(new Date(), { error: PROJECT_ERROR_VALIDATION.START_DATE.MIN }),
  dueDate: z.coerce.date().min(new Date(), { error: PROJECT_ERROR_VALIDATION.DUE_DATE.MIN }),
});
export const updateProjectDto = createProjectDto.partial();
export const getProjectDto = z.uuid({ error: PROJECT_ERROR_VALIDATION.ID });

export type CreateProjectDto = z.infer<typeof createProjectDto>;
export type UpdateProjectDto = z.infer<typeof updateProjectDto>;
export type GetProjectDto = z.infer<typeof getProjectDto>;
