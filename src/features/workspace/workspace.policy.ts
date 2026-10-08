import type { WorkspaceRole } from "../../../generated/prisma/enums.ts";
import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { WORKSPACE_FORBIDDEN_MESSAGE } from "@/features/workspace/workspace.constant.ts";

type WorkspacePolicyContext = {
  role: WorkspaceRole;
}

export const WorkspacePolicy = {
  canUpdate(context: WorkspacePolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(WORKSPACE_FORBIDDEN_MESSAGE.UPDATE);
    }
  },

  canDelete(context: WorkspacePolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(WORKSPACE_FORBIDDEN_MESSAGE.DELETE);
    }
  }
}