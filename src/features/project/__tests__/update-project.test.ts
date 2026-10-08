import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import type { UpdateProjectDto } from "@/features/project/project.dto.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import app from "@/server.ts";
import {
  PROJECT_FORBIDDEN_MESSAGE,
  PROJECT_NOT_FOUND,
  PROJECT_SUCCESS_MESSAGE,
  PROJECT_TEST_ROUTE
} from "@/features/project/project.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Update Project", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let workspaceId: string;
  let projectId: string;
  let payload: UpdateProjectDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    const { agent: agent2 } = await authenticate();
    user = agent;
    user2 = agent2;
    const { workspaceId: testWorkspaceId, projectId: testProjectId } = await createTestProject(userId);

    workspaceId = testWorkspaceId;
    projectId = testProjectId;

    payload = {
      name: "Cadence - Update"
    }
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).patch(PROJECT_TEST_ROUTE.UPDATE_PROJECT(workspaceId, projectId)).send(payload);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not author', async () => {
    const res = await user2.patch(PROJECT_TEST_ROUTE.UPDATE_PROJECT(workspaceId, projectId)).send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(PROJECT_FORBIDDEN_MESSAGE.UPDATE);
  });

  it('should return 404 when project id is not found', async () => {
    const res = await user.patch(PROJECT_TEST_ROUTE.UPDATE_PROJECT(workspaceId, INVALID_UUID)).send(payload);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(PROJECT_NOT_FOUND);
  });

  it('should return 200 when data is valid', async () => {
    const res = await user.patch(PROJECT_TEST_ROUTE.UPDATE_PROJECT(workspaceId, projectId)).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe(PROJECT_SUCCESS_MESSAGE.UPDATE_PROJECT);
    expect(res.body.data).toBeDefined();
    expect(res.body.data.id).toBe(projectId);
  });
});
