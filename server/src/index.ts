import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./api/errors.js";
import { apiRouter } from "./api/routes.js";
import { allowedOrigins, env } from "./env.js";

export function createApp(): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: allowedOrigins() }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_request, response) => {
    response.status(200).json({
      status: "ok",
      service: "josstay-api",
      environment: env.NODE_ENV,
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      integrations: {
        database: Boolean(env.DATABASE_URL),
        redis: Boolean(env.REDIS_URL),
        paystack: Boolean(env.PAYSTACK_SECRET_KEY),
      },
    });
  });

  app.use("/api", apiRouter);
  app.use("/api", (_request, response) => {
    response.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);

  return app;
}
