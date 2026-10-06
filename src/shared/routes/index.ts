import { Router } from "express";
import healthRouter from "./health.routes";
import workspaceRoute from "@/features/workspace/workspace.route.ts";

const router = Router();

router.use(healthRouter);
router.use("/workspaces", workspaceRoute);

export default router;