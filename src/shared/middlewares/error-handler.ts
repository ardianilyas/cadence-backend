import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "@/shared/errors/app-error";
import { logger } from "@/shared/utils/logger";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  /**
   * Zod Validation Error
   */
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  /**
   * Database Errors (PostgreSQL / Prisma)
   */
  const dbErr = err as unknown as { code?: string; detail?: string; meta?: { target?: unknown; cause?: string } };
  if (dbErr.code) {
    switch (dbErr.code) {
      case "23505":
      case "P2002": {
        const target =
          dbErr.detail ||
          (Array.isArray(dbErr.meta?.target)
            ? (dbErr.meta.target as string[]).join(", ")
            : (dbErr.meta?.target as string | undefined));
        return res.status(409).json({
          success: false,
          message: target
            ? `Unique constraint violation: ${target}`
            : "A record with this value already exists",
        });
      }
      case "23503":
      case "P2003": {
        return res.status(400).json({
          success: false,
          message: "Foreign key constraint failed",
        });
      }
      case "P2025": {
        return res.status(404).json({
          success: false,
          message: dbErr.meta?.cause || "Record not found",
        });
      }
    }
  }

  /**
   * Custom App Error
   */
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { errors: err.details }),
    });
  }

  /**
   * Unknown Error
   */
  logger.error(err, "Unhandled application error");

  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};