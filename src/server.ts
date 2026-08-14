import { toNodeHandler } from "better-auth/node";
import express from "express";
import { auth } from "@/shared/lib/auth";
import { errorHandler } from "@/shared/middlewares/error-handler";
import { httpLogger } from "@/shared/middlewares/http-logger";
import { logger } from "@/shared/utils/logger";
import { env } from "@/shared/config/env";
import apiRoute from "@/shared/routes";

const app = express();
const PORT = env.PORT;

app.use(httpLogger);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json());

app.use("/api", apiRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on http://localhost:${PORT}`);
});

export default app;
