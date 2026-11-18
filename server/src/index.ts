import cors from "cors";
import express, { type Express } from "express";
import { errorHandler } from "./api/errors.js";
import { createApiRouter } from "./api/routes.js";
import { allowedOrigins, env } from "./env.js";
import type { PaymentClient } from "./payment/client.js";

export function createApp(options: { paymentClient?: PaymentClient } = {}): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: allowedOrigins() }));
  // Paystack signs the raw bytes. Capture them before the JSON parser runs.
  app.use("/api/webhooks/paystack", express.raw({ type: "application/json", limit: "1mb" }));
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

  app.use("/api", createApiRouter(options.paymentClient));
  app.use("/api", (_request, response) => {
    response.status(404).json({ error: "Not found" });
  });
  app.use(errorHandler);

  return app;
}
