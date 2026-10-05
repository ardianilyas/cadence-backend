import { Router } from "express";
import { WorkspaceService } from "@/features/workspace/workspace.service.ts";
import { WorkspaceController } from "@/features/workspace/workspace.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router();

const workspaceService = new WorkspaceService();
const workspaceController = new WorkspaceController(workspaceService);

router.use(authMiddleware);
router.get("/", workspaceController.getWorkspacesByUserId);
router.get("/:id", workspaceController.getWorkspace);
router.post("/", workspaceController.createWorkspace);
router.patch("/:id", workspaceController.updateWorkspace);
router.delete("/:id", workspaceController.deleteWorkspace);

export default router;
