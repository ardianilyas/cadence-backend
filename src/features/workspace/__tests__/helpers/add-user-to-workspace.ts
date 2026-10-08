import { prisma } from "@/shared/lib/prisma.ts";

export async function addUserToWorkspace(userId: string, workspaceId: string) {
  return prisma.workspaceMember.create({
    data: {
      userId,
      workspaceId,
      role: "Developer",
    }
  });
}
