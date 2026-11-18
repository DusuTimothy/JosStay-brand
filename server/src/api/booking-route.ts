import type { Request, Response } from "express";
import { BookingReferenceSchema, CreateBookingSchema } from "@josstay/shared";
import { getBookingReceipt } from "../booking/receipt.js";
import { createBooking } from "../booking/service.js";
import { parseWith } from "./errors.js";

export async function postBooking(request: Request, response: Response): Promise<void> {
  const input = parseWith(CreateBookingSchema, request.body);
  const booking = await createBooking(input);
  response.status(201).json(booking);
}

export async function getReceipt(request: Request, response: Response): Promise<void> {
  const reference = parseWith(BookingReferenceSchema, request.params.reference);
  response.json(await getBookingReceipt(reference));
}
