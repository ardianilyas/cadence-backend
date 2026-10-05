import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import app from "@/server.ts";
import { WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";

describe("Get Workspaces", () => {
  let user: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    await createTestWorkspace(userId);
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).get(WORKSPACE_TEST_ROUTE.GET_WORKSPACES);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 200 when user is authorized', async () => {
    const res = await user.get(WORKSPACE_TEST_ROUTE.GET_WORKSPACES);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Object);
  })
})