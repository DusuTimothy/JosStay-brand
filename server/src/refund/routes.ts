import { Router, type Request, type Response } from "express";
import { z } from "zod";
import {
  RecoveryActionSchema,
  RecoveryQueueQuerySchema,
  RefundRequestSchema,
} from "@josstay/shared";
import { parseWith } from "../api/errors.js";
import { notificationClient } from "../notifications/client.js";
import type { NotificationClient } from "../notifications/types.js";
import { paystackClient, type PaymentClient } from "../payment/client.js";
import {
  applyRecoveryAction,
  initiateRefund,
  listRecoveryQueue,
} from "./service.js";

const RefundIdSchema = z.string().uuid("Use a refund UUID");

/**
 * Refund initiation is internal. The recovery endpoints carry the admin path
 * now; role checks and property scoping arrive with the Day 12 console.
 */
export function createRefundRouter(
  client: PaymentClient = paystackClient,
  notifications: NotificationClient = notificationClient,
): Router {
  const router = Router();

  router.post("/refunds", async (request: Request, response: Response) => {
    const input = parseWith(RefundRequestSchema, request.body);
    const result = await initiateRefund(input, client, notifications);
    response.status(201).json(result.refund);
  });

  router.get("/admin/refund-recovery", async (request: Request, response: Response) => {
    const query = parseWith(RecoveryQueueQuerySchema, request.query);
    response.json(await listRecoveryQueue(query));
  });

  router.post(
    "/admin/refund-recovery/:refundId/actions",
    async (request: Request, response: Response) => {
      const refundId = parseWith(RefundIdSchema, request.params.refundId);
      const input = parseWith(RecoveryActionSchema, request.body);
      response.json(await applyRecoveryAction(refundId, input));
    },
  );

  return router;
}
