import { Router } from "express";
import type { PaymentClient } from "../payment/client.js";
import { createPaymentRouter } from "../payment/routes.js";
import { getAvailability } from "./availability-route.js";
import { postBooking } from "./booking-route.js";
import { getHotel, listAreas, listHotels } from "./catalog.js";

export const readRouter = Router();

readRouter.get("/hotels", listHotels);
readRouter.get("/hotels/:slug", getHotel);
readRouter.get("/areas", listAreas);
readRouter.get("/availability/:roomId", getAvailability);

export const writeRouter = Router();

writeRouter.post("/bookings", postBooking);

export function createApiRouter(paymentClient?: PaymentClient): Router {
  const router = Router();
  router.use(readRouter);
  router.use(writeRouter);
  router.use(createPaymentRouter(paymentClient));
  return router;
}

export const apiRouter = createApiRouter();
