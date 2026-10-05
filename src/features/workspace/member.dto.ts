import { z } from "zod";
import { WorkspaceRole } from "../../../generated/prisma/enums.ts";

export const addMemberDto = z.object({
  userId: z.string({ error: "User is required" }).min(1, { error: "User is required" }),
  role: z.enum(WorkspaceRole, { error: "Role is required" }),
});

export type AddMemberDto = z.infer<typeof addMemberDto>;
