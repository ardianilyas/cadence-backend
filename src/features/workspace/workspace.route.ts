import { Router } from "express";
import { WorkspaceService } from "@/features/workspace/workspace.service.ts";
import { WorkspaceController } from "@/features/workspace/workspace.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";
import { MemberService } from "@/features/workspace/member/member.service.ts";
import { MemberController } from "@/features/workspace/member/member.controller.ts";

const router = Router();

const workspaceService = new WorkspaceService();
const workspaceController = new WorkspaceController(workspaceService);
const memberService = new MemberService();
const memberController = new MemberController(memberService);

router.use(authMiddleware);
router.get("/", workspaceController.getWorkspacesByUserId);
router.get("/:id", workspaceController.getWorkspace);
router.post("/", workspaceController.createWorkspace);
router.patch("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);

router.get("/:id/available-users", memberController.getUsersNotInWorkspace);
router.post("/:id/members", memberController.addMemberToWorkspace);
router.delete("/:id/members/:memberId", memberController.removeMemberToWorkspace);

export default router;
