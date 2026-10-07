import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import app from "@/server.ts";
import {
  INVALID_WORKSPACE_ID,
  WORKSPACE_NOT_FOUND,
  WORKSPACE_TEST_ROUTE
} from "@/features/workspace/workspace.constant.ts";
import { ERROR_MESSAGE, ERROR_STATUS_CODE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Delete Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    workspaceId = await createTestWorkspace(userId);
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(workspaceId));

    expect(res.status).toBe(ERROR_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when data not found', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(INVALID_UUID));

    expect(res.status).toBe(ERROR_STATUS_CODE.NOT_FOUND);
    expect(res.body.message).toBe(WORKSPACE_NOT_FOUND);
  });

  it('should return 400 when id format is invalid', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE("invalid-uuid"));

    expect(res.status).toBe(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.body.errors[0].message).toBe(INVALID_WORKSPACE_ID);
  });

  it('should return 204 when data deleted', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.DELETE_WORKSPACE(workspaceId));

    expect(res.status).toBe(204);
  });
})