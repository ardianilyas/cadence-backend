import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "@/shared/lib/auth";
import { errorHandler } from "@/shared/middlewares/error-handler";
import { httpLogger } from "@/shared/middlewares/http-logger";
import { logger } from "@/shared/utils/logger";
import { env } from "@/shared/config/env";
import { prisma } from "@/shared/db";
import { NotFoundError } from "@/shared/errors/not-found";
import apiRoute from "@/shared/routes";

const app = express();
const PORT = env.PORT;

app.use(httpLogger);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", apiRoute);

// 404 Route Not Found
app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      logger.info("Database disconnected. Server stopped.");
      process.exit(0);
    } catch (error) {
      logger.error(error, "Error during graceful shutdown");
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));

export default app;
