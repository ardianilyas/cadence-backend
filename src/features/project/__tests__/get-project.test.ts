import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import app from "@/server.ts";
import { PROJECT_NOT_FOUND, PROJECT_SUCCESS_MESSAGE, PROJECT_TEST_ROUTE } from "@/features/project/project.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Get Project", () => {
  let user: ReturnType<typeof request.agent>;
  let projectId: string;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    const { workspaceId: testWorkspaceId, projectId: testProjectId } = await createTestProject(userId);
    workspaceId = testWorkspaceId;
    projectId = testProjectId;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res =  await request(app).get(PROJECT_TEST_ROUTE.GET_PROJECT_BY_ID(workspaceId, projectId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when project id not found', async () => {
    const res = await user.get(PROJECT_TEST_ROUTE.GET_PROJECT_BY_ID(workspaceId, INVALID_UUID));

    console.log(res.body);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(PROJECT_NOT_FOUND);
  });

  it('should return 200 when project is found', async () => {
    const res = await user.get(PROJECT_TEST_ROUTE.GET_PROJECT_BY_ID(workspaceId, projectId));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(PROJECT_SUCCESS_MESSAGE.GET_PROJECT_BY_ID);
    expect(res.body.data).toBeDefined();
  });
})