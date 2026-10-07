import type { TaskService } from "@/features/task/task.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { AuthenticatedRequest } from "@/shared/types";
import type { Response } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { getProjectDto } from "@/features/project/project.dto.ts";
import { sendSuccess } from "@/shared/utils/response.ts";
import { createTaskDto, getTaskDto, updateTaskDto } from "@/features/task/task.dto.ts";
import { TASK_SUCCESS_MESSAGE } from "@/features/task/task.constant.ts";

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getTasksByProjectId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const projectId = validate(getProjectDto, req.params.projectId);
    const tasks = await this.taskService.getTasksByProjectId(projectId);
    return sendSuccess(res, TASK_SUCCESS_MESSAGE.GET_TASKS_BY_PROJECT_ID, tasks);
  });

  getTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const taskId = validate(getTaskDto, req.params.id);
    const task = await this.taskService.getTask(taskId);
    return sendSuccess(res, TASK_SUCCESS_MESSAGE.GET_TASK, task);
  });

  createTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validate(createTaskDto, req.body);
    const task = await this.taskService.createTask(data, req.auth.user.id);
    return sendSuccess(res, TASK_SUCCESS_MESSAGE.CREATE_TASK, task, 201);
  });

  updateTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const taskId = validate(getTaskDto, req.params.id);
    const data = validate(updateTaskDto, req.body);
    const task = await this.taskService.updateTask(data, taskId);
    return sendSuccess(res, TASK_SUCCESS_MESSAGE.UPDATE_TASK, task);
  });

  deleteTask = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const taskId = validate(getTaskDto, req.params.id);
    await this.taskService.deleteTask(taskId);
    return sendSuccess(res, "", null, 204);
  });
}
