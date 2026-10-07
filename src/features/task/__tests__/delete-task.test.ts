import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestTask } from "@/features/task/__tests__/helpers/create-test-task.ts";
import app from "@/server.ts";
import { TASK_ERROR_VALIDATION, TASK_NOT_FOUND, TASK_TEST_ROUTE } from "@/features/task/task.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Delete Task", () => {
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
    const res = await request(app).delete(TASK_TEST_ROUTE.DELETE_TASK(projectId, taskId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when task id is invalid format', async () => {
    const res = await user.delete(TASK_TEST_ROUTE.DELETE_TASK(projectId, "invalid-uuid"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors[0].message).toBe(TASK_ERROR_VALIDATION.ID);
  });

  it('should return 404 when task not found', async () => {
    const res = await user.delete(TASK_TEST_ROUTE.DELETE_TASK(projectId, INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(TASK_NOT_FOUND);
  });

  it('should return 204 when task deleted', async () => {
    const res = await user.delete(TASK_TEST_ROUTE.DELETE_TASK(projectId, taskId));

    expect(res.status).toBe(204);
  });
})