import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import app from "@/server.ts";
import { WORKSPACE_NOT_FOUND, WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";
import { ERROR_STATUS_CODE } from "@/shared/constants/error.constant.ts";

describe("Get Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    workspaceId = await createTestWorkspace(userId);
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(WORKSPACE_TEST_ROUTE.GET_WORKSPACE(workspaceId));

    expect(res.status).toBe(AUTH_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when data not found', async () => {
    const res = await user.get(WORKSPACE_TEST_ROUTE.GET_WORKSPACE(INVALID_UUID));

    console.log(res.body);

    expect(res.status).toBe(ERROR_STATUS_CODE.NOT_FOUND);
    expect(res.body.message).toBe(WORKSPACE_NOT_FOUND);
  });

  it('should return 200 when id is valid', async () => {
    const res = await user.get(WORKSPACE_TEST_ROUTE.GET_WORKSPACE(workspaceId));

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.id).toBe(workspaceId);
  })
})