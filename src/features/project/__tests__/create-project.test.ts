import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import app from "@/server.ts";
import { PROJECT_TEST_ROUTE } from "@/features/project/project.constant.ts";
import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import type { CreateProjectDto } from "@/features/project/project.dto.ts";
import { addDays, addMonths } from "date-fns";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { ERROR_MESSAGE } from "@/shared/constants/error.constant.ts";
import { INVALID_UUID } from "@/shared/constants/test.constant.ts";

describe("Create Project", () => {
  let user: ReturnType<typeof request.agent>;
  let workspaceId: string;
  let payload: CreateProjectDto;

  beforeAll(async () => {
    const { agent, userId } = await authenticate();
    user = agent;
    workspaceId = await createTestWorkspace(userId);

    const startDate: Date = addDays(new Date(), 1);
    const dueDate: Date = addMonths(new Date(), 1);

    payload = {
      name: "Cadence",
      description: "A Project management platform",
      status: "ACTIVE",
      startDate,
      dueDate,
    }
  });

  it('should return 401 when user is unauthorized', async () => {
    const res = await request(app).post(PROJECT_TEST_ROUTE.CREATE_PROJECT(workspaceId)).send(payload);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when data is invalid', async () => {
    const res = await user.post(PROJECT_TEST_ROUTE.CREATE_PROJECT(workspaceId)).send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.VALIDATOIN_FAILED);
    expect(res.body.errors).toBeInstanceOf(Object);
    expect(res.body.errors[0]).toBeDefined();
  });

  it('should return 400 when workspace id is not found', async () => {
    const res = await user.post(PROJECT_TEST_ROUTE.CREATE_PROJECT(INVALID_UUID)).send(payload);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(ERROR_MESSAGE.FOREIGN_KEY_CONSTRAINED);
  });

  it('should return 200 when data is valid and project created', async () => {
    const res = await user.post(PROJECT_TEST_ROUTE.CREATE_PROJECT(workspaceId)).send(payload);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Project created");
    expect(res.body.data).toBeDefined();
    expect(res.body.data.name).toBe(payload.name);
    expect(res.body.data.workspaceId).toBe(workspaceId);
    expect(res.body.data.description).toBe(payload.description);
    expect(res.body.data.status).toBe(payload.status);
    expect(res.body.data.startDate).toBe(payload.startDate.toISOString());
    expect(res.body.data.dueDate).toBe(payload.dueDate.toISOString());
  });
})