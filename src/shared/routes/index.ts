import { Router } from "express";
import healthRouter from "./health.routes";
import workspaceRoute from "@/features/workspace/workspace.route.ts";
import projectRoute from "@/features/project/project.route.ts";
import taskRoute from "@/features/task/task.route.ts";

const router = Router();

router.use(healthRouter);
router.use("/workspaces", workspaceRoute);
router.use("/workspaces/:workspaceId/projects", projectRoute);
router.use("/projects/:projectId/tasks", taskRoute);

export default router;
