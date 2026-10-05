export const AUTH_MESSAGE = {
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  SESSION_NOT_FOUND: "Session not found",
  VALIDATION_ERROR: "Validation Error",
} as const;

export const AUTH_STATUS_CODE = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
} as const;
