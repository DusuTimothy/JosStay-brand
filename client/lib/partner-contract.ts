import { PolicyTemplateSchema, VerificationStatusSchema } from "@josstay/shared";
import { z } from "zod";

/**
 * One shape for partner data, whether it comes from the sample snapshot or a
 * verified API. Screens depend on these types, never on a data source.
 */

export const PartnerSourceSchema = z.enum(["sample", "verified"]);

export const PartnerRoomStatusSchema = z.enum(["active", "paused"]);
export const PartnerBookingStatusSchema = z.enum([
  "confirmed",
  "completed",
  "cancelled",
  "refund_pending",
  "refunded",
]);
export const PartnerPayoutStatusSchema = z.enum(["paid", "scheduled"]);

export const PartnerRoomSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sleeps: z.number().int().positive(),
  totalInventory: z.number().int().positive(),
  nightlyKobo: z.number().int().positive(),
  status: PartnerRoomStatusSchema,
});

export const PartnerBlockSchema = z.object({
  id: z.string().min(1),
  roomId: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1),
  createdAt: z.string().min(1),
});

export const PartnerBookingSchema = z.object({
  reference: z.string().min(1),
  guestName: z.string().min(1),
  roomId: z.string().min(1),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.number().int().positive(),
  nights: z.number().int().positive(),
  totalKobo: z.number().int().positive(),
  commissionKobo: z.number().int().nonnegative(),
  hotelShareKobo: z.number().int().nonnegative(),
  status: PartnerBookingStatusSchema,
  policyTemplate: PolicyTemplateSchema,
  policyDeadlineAt: z.string().min(1),
  createdAt: z.string().min(1),
});

export const PartnerPayoutSchema = z.object({
  id: z.string().min(1),
  period: z.string().min(1),
  grossKobo: z.number().int().positive(),
  commissionKobo: z.number().int().nonnegative(),
  paystackFeeKobo: z.number().int().nonnegative(),
  netKobo: z.number().int().nonnegative(),
  status: PartnerPayoutStatusSchema,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const PartnerVerificationSchema = z.object({
  status: VerificationStatusSchema,
  inspectedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().min(1),
  powerTested: z.boolean(),
  pinConfirmed: z.boolean(),
  photosMatch: z.boolean(),
});

export const PartnerHotelSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  area: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  policyTemplate: PolicyTemplateSchema,
  houseRules: z.array(z.string().min(1)),
  verification: PartnerVerificationSchema,
  rooms: z.array(PartnerRoomSchema),
  blocks: z.array(PartnerBlockSchema),
  bookings: z.array(PartnerBookingSchema),
  payouts: z.array(PartnerPayoutSchema),
  subaccount: z.object({
    code: z.string().min(1),
    verifiedAt: z.string().nullable(),
    note: z.string().min(1),
  }),
});

export const PartnerSnapshotSchema = z.object({
  source: PartnerSourceSchema,
  generatedAt: z.string().min(1),
  hotels: z.array(PartnerHotelSchema),
});

export type PartnerRoom = z.infer<typeof PartnerRoomSchema>;
export type PartnerRoomStatus = z.infer<typeof PartnerRoomStatusSchema>;
export type PartnerBlock = z.infer<typeof PartnerBlockSchema>;
export type PartnerBooking = z.infer<typeof PartnerBookingSchema>;
export type PartnerBookingStatus = z.infer<typeof PartnerBookingStatusSchema>;
export type PartnerPayout = z.infer<typeof PartnerPayoutSchema>;
export type PartnerVerification = z.infer<typeof PartnerVerificationSchema>;
export type PartnerHotel = z.infer<typeof PartnerHotelSchema>;
export type PartnerSnapshot = z.infer<typeof PartnerSnapshotSchema>;
