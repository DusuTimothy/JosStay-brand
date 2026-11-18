/**
 * Explicit allow-list for guest-facing hotel responses.
 *
 * Read routes must select only these columns. `phone_encrypted`, payout data
 * and commission settings stay internal until a confirmed booking exists.
 */
export const PUBLIC_HOTEL_COLUMNS = [
  "id",
  "slug",
  "name",
  "area_id",
  "address",
  "lat",
  "lng",
  "nightly_kobo",
  "policy_template",
  "house_rules",
  "demo",
  "created_at",
  "updated_at",
] as const;

export const INTERNAL_HOTEL_COLUMNS = [
  "phone_encrypted",
  "commission_bps",
  "paystack_subaccount_code",
  "subaccount_verified_at",
] as const;

/** Sequelize attribute names corresponding to PUBLIC_HOTEL_COLUMNS. */
export const PUBLIC_HOTEL_ATTRIBUTES = [
  "id",
  "slug",
  "name",
  "areaId",
  "address",
  "lat",
  "lng",
  "nightlyKobo",
  "policyTemplate",
  "houseRules",
  "demo",
  "createdAt",
  "updatedAt",
] as const;

export function publicHotelColumns(): string[] {
  return [...PUBLIC_HOTEL_COLUMNS];
}

export function publicHotelAttributes(): string[] {
  return [...PUBLIC_HOTEL_ATTRIBUTES];
}
