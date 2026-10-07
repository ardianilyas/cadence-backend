import { createTestProject } from "@/features/project/__tests__/helpers/create-test-project.ts";
import { seedTask } from "@/shared/seeder/task.seeder.ts";

export async function createTestTask(createdById: string) {
  const { projectId } = await createTestProject(createdById);
  const task = await seedTask(createdById, projectId, 1);

  if(!task[0]?.id) throw new Error("Failed to create task");
  const taskId = task[0].id;

  return { taskId, projectId };
}