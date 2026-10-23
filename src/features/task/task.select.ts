import type { TaskInclude } from "../../../generated/prisma/models/Task.ts";

export const taskWithRelationsArgs = {
  project: {
    select: {
      id: true,
      name: true
    }
  },
  assignee: {
    select: {
      id: true,
      name: true,
      email: true
    }
  },
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true
    }
  }
} satisfies TaskInclude;
