import { prisma } from "@/shared/lib/prisma.ts";
import type { WorkspaceRole } from "../../../../../generated/prisma/enums.ts";


export async function addUserToWorkspace(userId: string, workspaceId: string, role: WorkspaceRole = "Developer") {
  return prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId,
      role,
    }
  });
}
