import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import app from "@/server.ts";
import { WORKSPACE_TEST_ROUTE } from "@/features/workspace/workspace.constant.ts";
import { AUTH_MESSAGE, AUTH_STATUS_CODE } from "@/shared/constants/auth.constants.ts";
import type { CreateWorkspaceDto } from "@/features/workspace/workspace.dto.ts";

describe("Create Workspace", () => {
  let user: ReturnType<typeof request.agent>;
  let authorId: string;
  let payload: CreateWorkspaceDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    authorId = userId;
    user = agent;

    payload = {
      name: "Cadence",
      description: "A simple project management app"
    }
  });

  it('should return 401 when user is unauthorized', async () => {
    const response = await request(app).post(WORKSPACE_TEST_ROUTE.CREATE_WORKSPACE).send(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when data is invalid', async () => {
    const response = await user.post(WORKSPACE_TEST_ROUTE.CREATE_WORKSPACE).send({});

    expect(response.status).toBe(AUTH_STATUS_CODE.BAD_REQUEST);
    expect(response.body.message).toBe(AUTH_MESSAGE.VALIDATION_ERROR);
    expect(response.body.errors).toHaveLength(2);
    expect(response.body.errors[0].field).toBe("name");
    expect(response.body.errors[1].field).toBe("description");
  });

  it('should return 201 when data is valid and created', async () => {
    const response = await user.post(WORKSPACE_TEST_ROUTE.CREATE_WORKSPACE).send(payload);

    expect(response.status).toBe(201);
    expect(response.body.data.name).toBe(payload.name);
    expect(response.body.data.description).toBe(payload.description);
    expect(response.body.data.authorId).toBe(authorId);
  });
});
