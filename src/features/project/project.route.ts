import { Router } from "express";
import { ProjectService } from "@/features/project/project.service.ts";
import { ProjectController } from "@/features/project/project.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router({ mergeParams: true });

const projectService = new ProjectService();
const projectController = new ProjectController(projectService);

router.use(authMiddleware);
router.get("/", projectController.getProjectsByWorkspaceId);
router.get("/:id", projectController.getProjectById);
router.post("/", projectController.createProject);
router.put("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

export default router;
