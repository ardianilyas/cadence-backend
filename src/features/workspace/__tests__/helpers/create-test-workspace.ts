import { seedWorkspace } from "@/shared/seeder/workspace.seeder.ts";

export async function createTestWorkspace(userId: string) {
  const workspace = await seedWorkspace(userId);

  if (!workspace[0]?.id) throw new Error("Failed to create workspace data");

  return workspace[0].id;
}
