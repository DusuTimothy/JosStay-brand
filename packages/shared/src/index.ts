import { z } from "zod";

/** Canonical guest email: trimmed, lowercased, syntax-checked. Ownership is proven separately. */
export const EmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254)
  .pipe(z.email());

export const PolicyTemplateSchema = z.enum(["flexible", "moderate", "strict"]);
export type PolicyTemplate = z.infer<typeof PolicyTemplateSchema>;

export const VerificationStatusSchema = z.enum([
  "Pass",
  "Pass with notes",
  "Fail",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

/** Internal hotel record. Contains the encrypted phone — never send to a guest. */
export const HotelSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  area: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
  nightlyKobo: z.number().int().positive(),
  policyTemplate: PolicyTemplateSchema,
  demo: z.boolean().default(true),
  inspectedAt: z.coerce.date().optional(),
  verificationStatus: VerificationStatusSchema.optional(),
  phoneEncrypted: z.string().optional(),
});
export type Hotel = z.infer<typeof HotelSchema>;

/** The only hotel shape a public API may return. Phone is structurally excluded. */
export const PublicHotelSchema = HotelSchema.omit({ phoneEncrypted: true });
export type PublicHotel = z.infer<typeof PublicHotelSchema>;

/** Strip private fields before any guest-facing response. */
export function toPublicHotel(hotel: Hotel): PublicHotel {
  const { phoneEncrypted: _withheld, ...publicHotel } = hotel;
  return PublicHotelSchema.parse(publicHotel);
}

export const GuestCheckoutSchema = z
  .object({
    guestName: z.string().trim().min(2).max(120),
    guestEmail: EmailSchema,
    guestPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9\s-]{6,19}$/),
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    guests: z.coerce.number().int().min(1).max(8),
    hotelSlug: z.string().trim().min(1),
    termsAccepted: z.literal(true),
    whatsappOptIn: z.boolean().default(false),
  })
  .refine((value) => value.checkOut > value.checkIn, {
    path: ["checkOut"],
    error: "Check-out must be after check-in",
  });
export type GuestCheckout = z.infer<typeof GuestCheckoutSchema>;

export const BookingStatusSchema = z.enum([
  "draft",
  "held",
  "payment_pending",
  "confirmed",
  "completed",
  "expired",
  "failed",
  "cancelled",
  "refund_pending",
  "refunded",
  "no_show",
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

/** Paystack refund state. Guest copy stays "refund initiated" until completed. */
export const RefundStatusSchema = z.enum([
  "initiated",
  "processing",
  "completed",
  "failed",
]);
export type RefundStatus = z.infer<typeof RefundStatusSchema>;

/** open means the hotel share was paid out and must be collected separately. */
export const RecoveryStatusSchema = z.enum([
  "none",
  "open",
  "recovering",
  "recovered",
  "written_off",
]);
export type RecoveryStatus = z.infer<typeof RecoveryStatusSchema>;

/** Internal booking record. Guest-facing confirmation is a separate, reduced view. */
export const BookingSchema = z.object({
  reference: z.string().min(1),
  hotelSlug: z.string().min(1),
  guestName: z.string().min(1),
  guestEmail: EmailSchema,
  guestPhone: z.string().min(1),
  checkIn: z.coerce.date(),
  checkOut: z.coerce.date(),
  guests: z.number().int().positive(),
  totalKobo: z.number().int().positive(),
  commissionKobo: z.number().int().nonnegative(),
  policyTemplate: PolicyTemplateSchema,
  status: BookingStatusSchema,
  holdExpiresAt: z.coerce.date().optional(),
  paystackReference: z.string().optional(),
  createdAt: z.coerce.date(),
});
export type Booking = z.infer<typeof BookingSchema>;

export const AreaSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  centreLat: z.number(),
  centreLng: z.number(),
});
export type Area = z.infer<typeof AreaSchema>;

/** Calendar dates use YYYY-MM-DD everywhere in query strings. */
export const DateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
  }, "Use a real calendar date");

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function rejectPastDate(value: string, path: string[], ctx: z.RefinementCtx): void {
  if (value < todayISO()) {
    ctx.addIssue({
      code: "custom",
      path,
      message: "Dates cannot be in the past",
    });
  }
}

export const DateRangePartsSchema = z
  .object({
    from: DateOnlySchema,
    to: DateOnlySchema,
  })
  .superRefine((value, ctx) => {
    if (value.to <= value.from) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "Check-out must be after check-in",
      });
    }
    rejectPastDate(value.from, ["from"], ctx);
  });

export const DatesParamSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}:\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD:YYYY-MM-DD")
  .transform((value) => {
    const [from, to] = value.split(":");
    return { from, to };
  })
  .pipe(DateRangePartsSchema);

export const SlugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase slug");

export const RoomIdSchema = z.string().uuid("Use a room UUID");

export const HotelQuerySchema = z
  .object({
    area: z.string().trim().min(1).optional(),
    dates: DatesParamSchema.optional(),
    guests: z.coerce.number().int().min(1).max(8).optional(),
    power: z.literal("24-7").optional(),
    policy: PolicyTemplateSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.dates) rejectPastDate(value.dates.from, ["dates"], ctx);
  });
export type HotelQuery = z.infer<typeof HotelQuerySchema>;

export const AvailabilityQuerySchema = z
  .object({
    from: DateOnlySchema,
    to: DateOnlySchema,
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.to <= value.from) {
      ctx.addIssue({
        code: "custom",
        path: ["to"],
        message: "Check-out must be after check-in",
      });
    }
    rejectPastDate(value.from, ["from"], ctx);
  });
export type AvailabilityQuery = z.infer<typeof AvailabilityQuerySchema>;

export const PublicRoomSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  bed: z.string().min(1),
  sleeps: z.number().int().positive(),
  ensuite: z.boolean(),
});
export type PublicRoom = z.infer<typeof PublicRoomSchema>;

export const HotelDetailSchema = PublicHotelSchema.extend({
  rooms: z.array(PublicRoomSchema),
});
export type HotelDetail = z.infer<typeof HotelDetailSchema>;

export const AreaSummarySchema = AreaSchema.extend({
  count: z.number().int().nonnegative(),
  demo: z.boolean(),
});
export type AreaSummary = z.infer<typeof AreaSummarySchema>;

export const AvailabilityResponseSchema = z.object({
  roomId: z.string().uuid(),
  from: DateOnlySchema,
  to: DateOnlySchema,
  nights: z.number().int().positive(),
  totalInventory: z.number().int().nonnegative(),
  available: z.number().int().nonnegative(),
});
export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;

const MS_PER_DAY = 86_400_000;
/** Nigeria local time is WAT (UTC+1). Deadline wording in the docs uses this zone. */
const WAT_OFFSET_MS = 60 * 60 * 1000;

function checkInInstant(checkIn: string): number {
  const value = Date.parse(`${checkIn}T00:00:00+01:00`);
  if (Number.isNaN(value)) throw new Error(`Invalid check-in date: ${checkIn}`);
  return value;
}

/** Half-open nights: [check-in, check-out). Both arguments are YYYY-MM-DD. */
export function nightsBetweenDates(checkIn: string, checkOut: string): number {
  const start = checkInInstant(checkIn);
  const end = checkInInstant(checkOut);
  const nights = Math.round((end - start) / MS_PER_DAY);
  if (nights <= 0) throw new Error("Check-out must be after check-in");
  return nights;
}

/**
 * The three locked cancellation templates. Flexible and moderate are anchored
 * to the check-in date in WAT; strict is anchored to the moment of booking.
 * A null result would mean "no fixed calendar date", which strict no longer
 * has once a booking exists.
 */
export function calculatePolicyDeadline(
  template: PolicyTemplate,
  checkIn: string,
  bookedAt: Date = new Date(),
): Date {
  switch (template) {
    case "flexible":
      return new Date(checkInInstant(checkIn) - 24 * 60 * 60 * 1000);
    case "moderate":
      return new Date(checkInInstant(checkIn) - 72 * 60 * 60 * 1000);
    case "strict":
      return new Date(bookedAt.getTime() + 24 * 60 * 60 * 1000);
  }
}

/** All-in guest total, with the fixed platform commission calculated from basis points. */
export function calculateBookingMoney(
  nightlyKobo: number,
  nights: number,
  commissionBps = 1000,
): { nights: number; totalKobo: number; commissionKobo: number; hotelShareKobo: number } {
  const totalKobo = nightlyKobo * nights;
  const commissionKobo = Math.round((totalKobo * commissionBps) / 10_000);
  return {
    nights,
    totalKobo,
    commissionKobo,
    hotelShareKobo: totalKobo - commissionKobo,
  };
}

/** Guest checkout has no account: name, email, phone, dates, room and accepted terms. */
export const CreateBookingSchema = z
  .object({
    guestName: z.string().trim().min(2).max(120),
    guestEmail: EmailSchema,
    guestPhone: z
      .string()
      .trim()
      .regex(/^\+?[0-9][0-9\s-]{6,19}$/, "Use a valid phone number"),
    hotelSlug: SlugSchema,
    roomId: RoomIdSchema,
    checkIn: DateOnlySchema,
    checkOut: DateOnlySchema,
    guests: z.number().int().min(1).max(8),
    termsAccepted: z.literal(true, "Accept the terms to continue"),
    whatsappOptIn: z.boolean().default(false),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (value.checkOut <= value.checkIn) {
      ctx.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be after check-in",
      });
    }
    rejectPastDate(value.checkIn, ["checkIn"], ctx);
  });
export type CreateBooking = z.infer<typeof CreateBookingSchema>;

/** The only booking shape returned to a guest. No hotel phone, payout or commission data. */
export const GuestBookingSchema = z.object({
  reference: z.string().min(1),
  status: BookingStatusSchema,
  hotelSlug: SlugSchema,
  hotelName: z.string().min(1),
  roomId: RoomIdSchema,
  checkIn: DateOnlySchema,
  checkOut: DateOnlySchema,
  guests: z.number().int().positive(),
  nights: z.number().int().positive(),
  totalKobo: z.number().int().positive(),
  policyTemplate: PolicyTemplateSchema,
  policyDeadlineAt: z.coerce.date(),
  holdExpiresAt: z.coerce.date(),
  whatsappOptIn: z.boolean(),
});
export type GuestBooking = z.infer<typeof GuestBookingSchema>;

export const BookingReferenceSchema = z
  .string()
  .trim()
  .regex(/^JS-[A-Z0-9]+$/, "Use a JosStay booking reference");

export const InitializePaymentSchema = z
  .object({
    bookingReference: BookingReferenceSchema,
  })
  .strict();
export type InitializePayment = z.infer<typeof InitializePaymentSchema>;

export const PaymentChannelsSchema = z.array(z.enum(["card", "bank", "ussd"]));

/** The only payment shape returned to a guest. No provider secret or payout data. */
export const PaymentInitializationSchema = z.object({
  bookingReference: BookingReferenceSchema,
  paystackReference: z.string().min(1),
  provider: z.literal("paystack"),
  amountKobo: z.number().int().positive(),
  authorizationUrl: z.url(),
  channels: PaymentChannelsSchema,
});
export type PaymentInitialization = z.infer<typeof PaymentInitializationSchema>;

/** Paystack signs the raw bytes with HMAC-SHA512 using the secret key. */
export const PaystackWebhookEnvelopeSchema = z
  .object({
    event: z.string().min(1),
    data: z
      .object({
        status: z.string().min(1),
        reference: z.string().min(1).optional(),
      })
      .passthrough(),
  })
  .passthrough();

export const PaystackChargeSuccessSchema = z
  .object({
    event: z.literal("charge.success"),
    data: z
      .object({
        status: z.literal("success"),
        reference: z.string().min(1),
        amount: z.number().int().positive(),
        currency: z.string().min(3),
        metadata: z
          .object({
            bookingReference: BookingReferenceSchema,
          })
          .passthrough()
          .optional(),
      })
      .passthrough(),
  })
  .passthrough();
export type PaystackChargeSuccess = z.infer<typeof PaystackChargeSuccessSchema>;
