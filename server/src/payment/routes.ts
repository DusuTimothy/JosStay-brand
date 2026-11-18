import { Router, type Request, type Response } from "express";
import {
  InitializePaymentSchema,
  PaystackChargeSuccessSchema,
  PaystackWebhookEnvelopeSchema,
} from "@josstay/shared";
import { HttpError, parseWith } from "../api/errors.js";
import { notificationClient } from "../notifications/client.js";
import type { NotificationClient } from "../notifications/types.js";
import { paystackClient, type PaymentClient } from "./client.js";
import { handleChargeSuccess, initializePayment } from "./service.js";
import { verifyPaystackSignature } from "./signature.js";

export function createPaymentRouter(
  client: PaymentClient = paystackClient,
  notifications: NotificationClient = notificationClient,
): Router {
  const router = Router();

  router.post("/payments/initialize", async (request: Request, response: Response) => {
    const input = parseWith(InitializePaymentSchema, request.body);
    response.json(await initializePayment(input.bookingReference, client));
  });

  router.post("/webhooks/paystack", async (request: Request, response: Response) => {
    const raw = request.body;
    if (!Buffer.isBuffer(raw)) {
      throw new HttpError(400, "Raw webhook body is required");
    }
    if (
      !verifyPaystackSignature(raw, request.header("x-paystack-signature") ?? undefined)
    ) {
      throw new HttpError(401, "Invalid webhook signature");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw.toString("utf8"));
    } catch {
      throw new HttpError(400, "Invalid webhook JSON");
    }

    const envelope = parseWith(PaystackWebhookEnvelopeSchema, parsed);
    if (envelope.event !== "charge.success" || envelope.data.status !== "success") {
      response.json({ received: true, ignored: true });
      return;
    }

    const charge = parseWith(PaystackChargeSuccessSchema, parsed);
    const result = await handleChargeSuccess(charge, notifications);
    response.json({ received: true, ...result });
  });

  return router;
}
