import { z } from "zod";
import { TaskPriority, TaskStatus } from "../../../generated/prisma/enums.ts";
import { TASK_ERROR_VALIDATION } from "@/features/task/task.constant.ts";

export const createTaskDto = z.object({
  title: z.string().min(3, { error: TASK_ERROR_VALIDATION.TITLE.MIN }).max(30, { error: TASK_ERROR_VALIDATION.TITLE.MAX }),
  description: z.string().min(3, { error: TASK_ERROR_VALIDATION.DESCRIPTION.MIN }).max(200, { error: TASK_ERROR_VALIDATION.DESCRIPTION.MAX }),
  status: z.enum(TaskStatus),
  priority: z.enum(TaskPriority),
  dueDate: z.coerce.date().min(new Date(), { error: TASK_ERROR_VALIDATION.DUE_DATE.MIN }),
  projectId: z.uuid({ error: TASK_ERROR_VALIDATION.PROJECT_ID.UUID }),
  assigneeId: z.uuid({ error: TASK_ERROR_VALIDATION.ASSIGNEE_ID.UUID }).optional(),
});
export const updateTaskDto = createTaskDto.partial();
export const getTaskDto = z.uuid({ error: TASK_ERROR_VALIDATION.ID });

export type CreateTaskDto = z.infer<typeof createTaskDto>;
export type UpdateTaskDto = z.infer<typeof updateTaskDto>;
export type GetTaskDto = z.infer<typeof getTaskDto>;
