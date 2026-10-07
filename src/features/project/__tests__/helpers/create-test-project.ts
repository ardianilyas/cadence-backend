import { createTestWorkspace } from "@/features/workspace/__tests__/helpers/create-test-workspace.ts";
import { seedProject } from "@/shared/seeder/project.seeder.ts";

export async function createTestProject(authorId: string) {
  const workspaceId = await createTestWorkspace(authorId);
  const project = await seedProject(authorId, workspaceId, 1);

  if (!project[0]?.id) throw new Error("Failed to create project");
  const projectId = project[0].id;

  return { projectId, workspaceId };
}
