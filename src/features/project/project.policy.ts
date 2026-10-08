import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { PROJECT_FORBIDDEN_MESSAGE } from "@/features/project/project.constant.ts";

type ProjectPolicyContext = {
  authorId: string;
  userId: string;
};

export const ProjectPolicy = {
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