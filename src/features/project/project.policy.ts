import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { PROJECT_FORBIDDEN_MESSAGE } from "@/features/project/project.constant.ts";
import type { WorkspaceRole } from "../../../generated/prisma/enums.ts";

type CreateProjectPolicyContext = {
  role: WorkspaceRole;
}

type ProjectPolicyContext = {
  authorId: string;
  userId: string;
};

export const ProjectPolicy = {
  canCreate(context: CreateProjectPolicyContext) {
    if (context.role !== "Project_Manager") {
      throw new ForbiddenError(PROJECT_FORBIDDEN_MESSAGE.CREATE);
    }
  },

  canUpdate(context: ProjectPolicyContext) {
    if (context.authorId !== context.userId) {
      throw new ForbiddenError(PROJECT_FORBIDDEN_MESSAGE.UPDATE);
    }
  },

  canDelete(context: ProjectPolicyContext) {
    if (context.authorId !== context.userId) {
      throw new ForbiddenError(PROJECT_FORBIDDEN_MESSAGE.DELETE);
    }
  }
}