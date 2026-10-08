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
import type { UpdateWorkspaceDto } from "@/features/workspace/workspace.dto.ts";
import { ERROR_MESSAGE, ERROR_STATUS_CODE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";
import { addUserToWorkspace } from "@/features/workspace/__tests__/helpers/add-user-to-workspace.ts";

describe("Update Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let user2: ReturnType<typeof request.agent>;
  let workspaceId: string;
  let payload: UpdateWorkspaceDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    const { agent: agent2, userId: userId2 } = await authenticate();

    workspaceId = await createTestWorkspace(userId);
    await addUserToWorkspace(userId2, workspaceId);

    user = agent;
    user2 = agent2;

    payload = {
      name: "Updated Workspace",
      description: "Updated workspace"
    }
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).patch(WORKSPACE_TEST_ROUTE.UPDATE_WORKSPACE(workspaceId)).send(payload);

    expect(res.status).toBe(ERROR_STATUS_CODE.UNAUTHORIZED);
    expect(res.body.message).toBe(ERROR_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when id is invalid format uuid', async () => {
    const res = await user.patch(WORKSPACE_TEST_ROUTE.UPDATE_WORKSPACE("invalid-uuid")).send({});

    expect(res.status).toBe(ERROR_STATUS_CODE.BAD_REQUEST);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors[0].message).toBe(WORKSPACE_ERROR_VALIDATION.ID);
  });

  it('should return 404 when id not found', async () => {
    const res = await user.patch(WORKSPACE_TEST_ROUTE.UPDATE_WORKSPACE(INVALID_UUID)).send({});

    expect(res.status).toBe(ERROR_STATUS_CODE.NOT_FOUND);
    expect(res.body.message).toBe(WORKSPACE_NOT_FOUND);
  });

  it('should return 403 when user is not Project Manager', async () => {
    const res = await user2.patch(WORKSPACE_TEST_ROUTE.UPDATE_WORKSPACE(workspaceId)).send(payload);

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(WORKSPACE_FORBIDDEN_MESSAGE.UPDATE);
  });

  it('should return 200 when data is valid and updated', async () => {
    const res = await user.patch(WORKSPACE_TEST_ROUTE.UPDATE_WORKSPACE(workspaceId)).send(payload);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.id).toBe(workspaceId);
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.data.description).toBe(payload.description);
  });
})