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
  "hold_pending",
  "hold_expired",
  "payment_pending",
  "confirmed",
  "cancelled",
  "refunded",
]);
export type BookingStatus = z.infer<typeof BookingStatusSchema>;

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
