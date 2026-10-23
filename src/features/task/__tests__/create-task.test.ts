import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import { addUserToWorkspace } from "@/features/workspace/__tests__/helpers/add-user-to-workspace.ts";
import app from "@/server.ts";
import { TASK_SUCCESS_MESSAGE, TASK_TEST_ROUTE, TASK_FORBIDDEN_MESSAGE } from "@/features/task/task.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import type { CreateTaskDto } from "@/features/task/task.dto.ts";
import { addDays } from "date-fns";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";

describe("Create Task", () => {
  let user: ReturnType<typeof request.agent>;
  let developerUser: ReturnType<typeof request.agent>;
  let projectId: string;
  let workspaceId: string;
  let payload: CreateTaskDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    const { projectId: testProjectId, workspaceId: testWorkspaceId } = await createTestProject(userId);
    projectId = testProjectId;
    workspaceId = testWorkspaceId;
    
    // Create a developer user and add to workspace
    const { agent: devAgent, userId: devUserId } = await authenticate();
    developerUser = devAgent;
    await addUserToWorkspace(devUserId, workspaceId, "Developer");
    
    payload = {
      title: "Authentication Feature",
      description: "Add authentication feature",
      status: "TODO",
      priority: "HIGH",
      dueDate: addDays(new Date(), 1),
      projectId,
    }
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).post(TASK_TEST_ROUTE.CREATE_TASK(projectId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when data is invalid', async () => {
    const res = await user.post(TASK_TEST_ROUTE.CREATE_TASK(projectId)).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 201 when data is valid and task created', async () => {
    const res = await user.post(TASK_TEST_ROUTE.CREATE_TASK(projectId)).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe(TASK_SUCCESS_MESSAGE.CREATE_TASK);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.projectId).toBe(projectId);
    expect(res.body.data.title).toBe(payload.title);
    expect(res.body.data.description).toBe(payload.description);
    expect(res.body.data.status).toBe(payload.status);
    expect(res.body.data.priority).toBe(payload.priority);
    expect(res.body.data.dueDate).toBe(payload.dueDate.toISOString());
  });

  it('should return 403 when user is not Project Manager', async () => {
    const res = await developerUser.post(TASK_TEST_ROUTE.CREATE_TASK(projectId)).send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(TASK_FORBIDDEN_MESSAGE.CREATE);
  });
});
