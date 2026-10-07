import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import app from "@/server.ts";
import { PROJECT_SUCCESS_MESSAGE, PROJECT_TEST_ROUTE } from "@/features/project/project.constant.ts";
import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";

describe("Get Project by Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    const { workspaceId: testWorkspaceId } = await createTestProject(userId);
    workspaceId = testWorkspaceId;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(PROJECT_TEST_ROUTE.GET_PROJECTS_BY_WORKSPACE_ID(workspaceId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 200 when user is authorized and return projects data', async () => {
    const res = await user.get(PROJECT_TEST_ROUTE.GET_PROJECTS_BY_WORKSPACE_ID(workspaceId));

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.message).toBe(PROJECT_SUCCESS_MESSAGE.GET_PROJECT_BY_WORKSPACE_ID);
  });
});