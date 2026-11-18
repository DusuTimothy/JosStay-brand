import { Router } from "express";
import type { NotificationClient } from "../notifications/types.js";
import type { PaymentClient } from "../payment/client.js";
import { createPaymentRouter } from "../payment/routes.js";
import { getAvailability } from "./availability-route.js";
import { getReceipt, postBooking } from "./booking-route.js";
import { getHotel, listAreas, listHotels } from "./catalog.js";

export const readRouter = Router();

readRouter.get("/hotels", listHotels);
readRouter.get("/hotels/:slug", getHotel);
readRouter.get("/areas", listAreas);
readRouter.get("/availability/:roomId", getAvailability);
readRouter.get("/bookings/:reference/receipt", getReceipt);

export const writeRouter = Router();

writeRouter.post("/bookings", postBooking);

export function createApiRouter(
  paymentClient?: PaymentClient,
  notificationClient?: NotificationClient,
): Router {
  const router = Router();
  router.use(readRouter);
  router.use(writeRouter);
  router.use(createPaymentRouter(paymentClient, notificationClient));
  return router;
}

export const apiRouter = createApiRouter();
