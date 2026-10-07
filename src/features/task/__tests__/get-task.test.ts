import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestTask } from "@/features/task/__tests__/helpers/create-test-task.ts";
import app from "@/server.ts";
import {
  TASK_ERROR_VALIDATION,
  TASK_NOT_FOUND,
  TASK_SUCCESS_MESSAGE,
  TASK_TEST_ROUTE
} from "@/features/task/task.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Get Task", () => {
  let user: ReturnType<typeof request.agent>;
  let projectId: string;
  let taskId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    const { projectId: testProjectId, taskId: testTaskId } = await createTestTask(userId);
    projectId = testProjectId;
    taskId = testTaskId;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(TASK_TEST_ROUTE.GET_TASK(projectId, taskId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when task id is invalid format', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASK(projectId, "invalid-id"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toBe(TASK_ERROR_VALIDATION.ID);
  });

  it('should return 404 when task not found', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASK(projectId, INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TASK_NOT_FOUND);
  });

  it('should return 200 when data valid and return task', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASK(projectId, taskId));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(TASK_SUCCESS_MESSAGE.GET_TASK);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toBeInstanceOf(Object);
    expect(res.body.data.id).toBe(taskId);
    expect(res.body.data.projectId).toBe(projectId);
  });
})