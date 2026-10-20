import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../../tests/helpers/auth.helper.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import app from "@/server.ts";
import { WORKSPACE_NOT_FOUND, WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Get Available Users", () => {
  let user: ReturnType<typeof request.agent>;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();

    for (let i = 0; i <= 4; i++) {
      await authenticate();
    }

    workspaceId = await createTestWorkspace(userId);

    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(WORKSPACE_TEST_ROUTE.GET_AVAILABLE_USERS(workspaceId));

    console.log(res.body);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when workspace is not found', async () => {
    const res = await user.get(WORKSPACE_TEST_ROUTE.GET_AVAILABLE_USERS(INVALID_UUID));

    console.log(res.body);

    expect(res.status).toBe(404);
    expect(res.body.message).toBe(WORKSPACE_NOT_FOUND);
  });

  it('should return 200 and return users data', async () => {
    const res = await user.get(WORKSPACE_TEST_ROUTE.GET_AVAILABLE_USERS(workspaceId));

    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.data).toHaveLength(5);
  });
})