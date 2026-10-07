import { Router } from "express";
import { TaskService } from "@/features/task/task.service.ts";
import { TaskController } from "@/features/task/task.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router({ mergeParams: true });

const taskService = new TaskService();
const taskController = new TaskController(taskService);

router.use(authMiddleware);
router.get("/", taskController.getTasksByProjectId);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.patch("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
