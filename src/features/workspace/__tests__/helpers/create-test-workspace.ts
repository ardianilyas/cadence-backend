import { seedWorkspace } from "@/shared/seeder/workspace.seeder.ts";

export async function createTestWorkspace(userId: string) {
  const workspace = await seedWorkspace(userId);

  if (!workspace?.id) throw new Error("Failed to create workspace data");

  return workspace.id;
}
