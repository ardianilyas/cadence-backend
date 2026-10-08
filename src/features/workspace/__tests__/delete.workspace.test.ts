import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import app from "@/server.ts";
import {
  WORKSPACE_ERROR_VALIDATION, WORKSPACE_FORBIDDEN_MESSAGE,
  WORKSPACE_NOT_FOUND,
  WORKSPACE_TEST_ROUTE
} from "@/features/workspace/workspace.constant.ts";
import { ERROR_MESSAGE, ERROR_STATUS_CODE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";
import { addUserToWorkspace } from "@/features/workspace/__tests__/helpers/add-user-to-workspace.ts";

describe("Delete Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    const { agent: agent2, userId: userId2 } = await authenticate();
    user = agent;
    user2 = agent2
    workspaceId = await createTestWorkspace(userId);
    await addUserToWorkspace(userId2, workspaceId);
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(workspaceId));

    expect(res.status).toBe(ERROR_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when data not found', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(INVALID_UUID));

    console.log(res.body, res.status);

    expect(res.status).toBe(ERROR_STATUS_CODE.NOT_FOUND);
    expect(res.body.message).toBe(WORKSPACE_NOT_FOUND);
  });

  it('should return 400 when id format is invalid', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE("invalid-uuid"));

    expect(res.status).toBe(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.body.errors[0].message).toBe(WORKSPACE_ERROR_VALIDATION.ID);
  });

  it('should return 403 when user is not Project Manager', async () => {
    const res = await user2.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(workspaceId));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(WORKSPACE_FORBIDDEN_MESSAGE.DELETE);
  });

  it('should return 204 when data deleted', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(workspaceId));

    expect(res.status).toBe(204);
  });
})