import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestTask } from "@/features/task/__tests__/helpers/create-test-task.ts";
import app from "@/server.ts";
import { TASK_ERROR_VALIDATION, TASK_SUCCESS_MESSAGE, TASK_TEST_ROUTE } from "@/features/task/task.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";
import { PROJECT_NOT_FOUND } from "@/features/project/project.constant.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";

describe("Get Tasks by Project ID", () => {
  let user: ReturnType<typeof request.agent>;
  let projectId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    const { projectId: testProjectId } = await createTestTask(userId);
    projectId = testProjectId;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(TASK_TEST_ROUTE.GET_TASKS_BY_PROJECT_ID(projectId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when project id is invalid format', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASKS_BY_PROJECT_ID("invalid-uuid"));

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors[0].message).toBe(TASK_ERROR_VALIDATION.PROJECT_ID.UUID);
  });

  it('should return 404 when project id is not found', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASKS_BY_PROJECT_ID(INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(PROJECT_NOT_FOUND);
  });

  it('should return 200 when data valid and show tasks', async () => {
    const res = await user.get(TASK_TEST_ROUTE.GET_TASKS_BY_PROJECT_ID(projectId));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(TASK_SUCCESS_MESSAGE.GET_TASKS_BY_PROJECT_ID);
    expect(res.body.data).toBeDefined();
  });
})