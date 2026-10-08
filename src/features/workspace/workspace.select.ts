import type { WorkspaceInclude } from "../../../generated/prisma/models/Workspace.ts";

export const workspaceWithMemberArgs = {
  workspaceMembers: {
    select: {
      userId: true,
      role: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  }
} satisfies WorkspaceInclude