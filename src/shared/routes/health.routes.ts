import { Router } from "express";
import { prisma } from "@/shared/db";
import { asyncHandler } from "@/shared/utils/async-handler";

const router = Router();

router.get(
  "/health",
  asyncHandler(async (_req, res) => {
    let dbStatus = "up";
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      dbStatus = "down";
    }

    const isHealthy = dbStatus === "up";

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? "ok" : "error",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: dbStatus,
      },
    });
  })
);

export default router;
