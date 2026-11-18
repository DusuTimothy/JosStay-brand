import type { ErrorRequestHandler } from "express";
import { ZodError, type ZodTypeAny, type z } from "zod";

export class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: unknown[],
  ) {
    super(message);
  }
}

/** Parse untrusted query or params and turn failures into a clean 400. */
export function parseWith<T extends ZodTypeAny>(
  schema: T,
  value: unknown,
): z.infer<T> {
  const result = schema.safeParse(value);
  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      path: issue.path.join(".") || "(root)",
      message: issue.message,
    }));
    throw new HttpError(400, "Invalid request", details);
  }
  return result.data;
}

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof HttpError) {
    response.status(error.status).json({
      error: error.message,
      ...(error.details ? { details: error.details } : {}),
    });
    return;
  }

  if (error instanceof ZodError) {
    response.status(400).json({
      error: "Invalid request",
      details: error.issues.map((issue) => ({
        path: issue.path.join(".") || "(root)",
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof SyntaxError && (error as { status?: number }).status === 400) {
    response.status(400).json({ error: "Invalid JSON" });
    return;
  }

  if (error instanceof Error && error.message.includes("DATABASE_URL is not set")) {
    response.status(503).json({ error: "Database is not configured" });
    return;
  }

  console.error(error instanceof Error ? error.message : "Unexpected API error");
  response.status(500).json({ error: "Internal server error" });
};
