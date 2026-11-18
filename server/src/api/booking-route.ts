import type { Request, Response } from "express";
import { CreateBookingSchema } from "@josstay/shared";
import { createBooking } from "../booking/service.js";
import { parseWith } from "./errors.js";

export async function postBooking(request: Request, response: Response): Promise<void> {
  const input = parseWith(CreateBookingSchema, request.body);
  const booking = await createBooking(input);
  response.status(201).json(booking);
}
