import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../../tests/helpers/auth.helper.ts";
import { MEMBER_SUCCESS_MESSAGE, WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import type { AddMemberDto } from "@/features/workspace/member/member.dto.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { addUserToWorkspace } from "@/features/workspace/__tests__/helpers/add-user-to-workspace.ts";
import { MEMBER_FORBIDDEN_MESSAGE } from "@/features/workspace/member/member.constant.ts";

describe("Add Workspace Member", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let existsMemberId: string;
  let newMemberId: string;
  let workspaceId: string;

  beforeAll(async () => {
    const { agent, userId: ownerId } = await authenticate();
    const { agent: agent2, userId: memberId } = await authenticate();

    const { userId } = await authenticate();

    workspaceId = await createTestWorkspace(ownerId);
    await addUserToWorkspace(memberId, workspaceId);

    user = agent;
    user2 = agent2;

    existsMemberId = memberId;
    newMemberId = userId;
  });

  it('should return 400 when data is invalid', async () => {
    const res = await user.post(WORKSPACE_TEST_ROUTE.ADD_WORKSPACE_MEMBER(workspaceId)).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors).toBeDefined();
  });

  it('should return 409 when user already added', async () => {
    const payload: AddMemberDto = {
      userId: existsMemberId,
    }

    const res = await user.post(WORKSPACE_TEST_ROUTE.ADD_WORKSPACE_MEMBER(workspaceId)).send(payload);

    console.log(res.body, res.status);

    expect(res.status).toBe(409);
    expect(res.body.message).toBe(ERROR_MESSAGE.CONFLICT);
  });

  it('should return 403 when user is not Project Manager', async () => {
    const payload: AddMemberDto = {
      userId: newMemberId,
      role: "Quality_Assurance"
    }

    const res = await user2.post(WORKSPACE_TEST_ROUTE.ADD_WORKSPACE_MEMBER(workspaceId)).send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(MEMBER_FORBIDDEN_MESSAGE.ADD);
  });

  it('should return 201 when data is valid and member added to workspace', async () => {
    const payload: AddMemberDto = {
      userId: newMemberId,
      role: "Quality_Assurance"
    }

    const res = await user.post(WORKSPACE_TEST_ROUTE.ADD_WORKSPACE_MEMBER(workspaceId)).send(payload);

    console.log(res.body.data);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe(MEMBER_SUCCESS_MESSAGE.ADD_MEMBER_TO_WORKSPACE);
    expect(res.body.data.workspaceId).toBe(workspaceId);
    expect(res.body.data.userId).toBe(newMemberId);
    expect(res.body.data.role).toBe(payload.role);
  });
});
