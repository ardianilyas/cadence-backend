import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../../tests/helpers/auth.helper.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import { addUserToWorkspace } from "@/features/workspace/__tests__/helpers/add-user-to-workspace.ts";
import app from "@/server.ts";
import { WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { MEMBER_FORBIDDEN_MESSAGE } from "@/features/workspace/member/member.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Remove Member to Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let memberId: string;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    const { agent: agent2, userId: userId2 } = await authenticate();

    workspaceId = await createTestWorkspace(userId);
    await addUserToWorkspace(userId2, workspaceId);

    user = agent;
    user2 = agent2;
    memberId = userId2;
  });

  it('should return 401 when user us unauthorized', async () => {
    const res = await request(app).delete(WORKSPACE_TEST_ROUTE.REMOVE_MEMBER_TO_WORKSPACE(workspaceId, memberId));

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 403 when user is not owner', async () => {
    const res = await user2.delete(WORKSPACE_TEST_ROUTE.REMOVE_MEMBER_TO_WORKSPACE(workspaceId, memberId));

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(MEMBER_FORBIDDEN_MESSAGE.REMOVE);
  });

  it('should return 404 when data is invalid', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.REMOVE_MEMBER_TO_WORKSPACE(INVALID_UUID, INVALID_UUID));

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("WorkspaceMember not found");
  });

  it('should return 204 when member removed successfully', async () => {
    const res = await user.delete(WORKSPACE_TEST_ROUTE.REMOVE_MEMBER_TO_WORKSPACE(workspaceId, memberId));

    expect(res.status).toBe(204);
  });
})