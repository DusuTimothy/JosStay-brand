import { Router } from "express";
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

export const apiRouter = Router();

apiRouter.use(readRouter);
apiRouter.use(writeRouter);
