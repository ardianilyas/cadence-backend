import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import app from "@/server.ts";
import {
  PROJECT_FORBIDDEN_MESSAGE,
  PROJECT_NOT_FOUND,
  PROJECT_TEST_ROUTE
} from "@/features/project/project.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Delete Project", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let workspaceId: string;
  let projectId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    const { agent: agent2 } = await authenticate();
    user = agent;
    user2 = agent2;
    const { workspaceId: testWorkspaceId, projectId: testProjectId } = await createTestProject(userId);

    workspaceId = testWorkspaceId;
    projectId = testProjectId;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).delete(PROJECT_TEST_ROUTE.DELETE_PROJECT(workspaceId, projectId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not author', async () => {
    const res = await user2.delete(PROJECT_TEST_ROUTE.DELETE_PROJECT(workspaceId, projectId));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(PROJECT_FORBIDDEN_MESSAGE.DELETE);
  });

  it('should return 404 when project not found', async () => {
    const res = await user.delete(PROJECT_TEST_ROUTE.DELETE_PROJECT(workspaceId, INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(PROJECT_NOT_FOUND);
  });

  it('should return 204 when project deleted', async () => {
    const res = await user.delete(PROJECT_TEST_ROUTE.DELETE_PROJECT(workspaceId, projectId));

    expect(res.status).toBe(204);
  });
})