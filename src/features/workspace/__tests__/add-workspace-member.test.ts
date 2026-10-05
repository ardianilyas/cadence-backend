import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import type { AddMemberDto } from "@/features/workspace/member.dto.ts";

describe("Add Workspace Member", () => {
  let user: ReturnType<typeof request.agent>;
  let newMemberId: string;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId: ownerId } = await authenticate();
    const { userId } = await authenticate();

    workspaceId = await createTestWorkspace(ownerId);

    user = agent;
    newMemberId = userId;
  });

  it('should return 201 when data is valid and member added to workspace', async () => {
    const payload: AddMemberDto = {
      userId: newMemberId,
      role: "Quality_Assurance"
    }

    const res = await user.post(WORKSPACE_TEST_ROUTE.ADD_WORKSPACE_MEMBER(workspaceId)).send(payload);

    console.log(res.body.data);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Member added to workspace");
    expect(res.body.data.workspaceId).toBe(workspaceId);
    expect(res.body.data.userId).toBe(newMemberId);
    expect(res.body.data.role).toBe(payload.role);
  });
});
