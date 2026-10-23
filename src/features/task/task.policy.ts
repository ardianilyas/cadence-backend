import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { TASK_FORBIDDEN_MESSAGE } from "@/features/task/task.constant.ts";
import type { WorkspaceRole } from "../../../generated/prisma/enums.ts";

type CreateTaskPolicyContext = {
  role: WorkspaceRole;
}

type TaskPolicyContext = {
  role: WorkspaceRole;
}

export const TaskPolicy = {
  canCreate(context: CreateTaskPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(TASK_FORBIDDEN_MESSAGE.CREATE);
    }
  },

  canUpdate(context: TaskPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(TASK_FORBIDDEN_MESSAGE.UPDATE);
    }
  },

  canDelete(context: TaskPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(TASK_FORBIDDEN_MESSAGE.DELETE);
    }
  }
}
