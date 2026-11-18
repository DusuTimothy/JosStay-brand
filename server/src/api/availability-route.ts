import type { Request, Response } from "express";
import {
  AvailabilityQuerySchema,
  AvailabilityResponseSchema,
  RoomIdSchema,
} from "@josstay/shared";
import { getRoomAvailability } from "./availability.js";
import { HttpError, parseWith } from "./errors.js";

export async function getAvailability(
  request: Request,
  response: Response,
): Promise<void> {
  const roomId = parseWith(RoomIdSchema, request.params.roomId);
  const dates = parseWith(AvailabilityQuerySchema, request.query);

  const row = await getRoomAvailability(roomId, dates.from, dates.to);
  if (!row) throw new HttpError(404, "Room not found");

  const nights = Math.round(
    (Date.parse(`${dates.to}T00:00:00.000Z`) -
      Date.parse(`${dates.from}T00:00:00.000Z`)) /
      86_400_000,
  );

  response.json(
    AvailabilityResponseSchema.parse({
      roomId,
      from: dates.from,
      to: dates.to,
      nights,
      totalInventory: row.total_inventory,
      available: row.available,
    }),
  );
}
