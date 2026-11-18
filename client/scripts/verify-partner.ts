import { parsePartnerSnapshot, createLocalPartnerDataSource } from "../lib/partner-data";
import { SAMPLE_PARTNER_SNAPSHOT } from "../lib/partner-sample-data";
import { overlaps } from "../lib/partner-view";
import type { PartnerStorage } from "../lib/partner-data";

const failures: string[] = [];
const check = (condition: boolean, message: string) => {
  if (!condition) failures.push(message);
};

const snapshot = parsePartnerSnapshot(SAMPLE_PARTNER_SNAPSHOT);
check(snapshot.source === "sample", "Snapshot must be labelled as sample data.");

const forbiddenKeys = new Set([
  "phone",
  "phoneEncrypted",
  "guestPhone",
  "guestEmail",
  "email",
  "contactEmail",
  "contact_email",
]);

function inspectKeys(value: unknown, path = "snapshot"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectKeys(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    check(!forbiddenKeys.has(key), `Forbidden contact field at ${path}.${key}`);
    inspectKeys(nested, `${path}.${key}`);
  }
}
inspectKeys(snapshot);

for (const hotel of snapshot.hotels) {
  for (const booking of hotel.bookings) {
    check(
      booking.commissionKobo === Math.round(booking.totalKobo * 0.1),
      `${booking.reference}: commission must be exactly 10%.`,
    );
    check(
      booking.hotelShareKobo === booking.totalKobo - booking.commissionKobo,
      `${booking.reference}: hotel share must be the all-in total less commission.`,
    );
  }
  for (const payout of hotel.payouts) {
    check(
      payout.commissionKobo === Math.round(payout.grossKobo * 0.1),
      `${payout.id}: payout commission must be exactly 10%.`,
    );
    check(
      payout.netKobo ===
        payout.grossKobo - payout.commissionKobo - payout.paystackFeeKobo,
      `${payout.id}: payout net figure must reconcile.`,
    );
  }
  for (const block of hotel.blocks) {
    check(block.from < block.to, `${block.id}: block must span at least one night.`);
    check(
      hotel.bookings.every(
        (booking) =>
          booking.status === "cancelled" ||
          booking.status === "refunded" ||
          !overlaps(block.from, block.to, booking.checkIn, booking.checkOut),
      ),
      `${block.id}: block overlaps a live sample booking.`,
    );
  }
}

class FakeStorage implements PartnerStorage {
  private readonly values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }
}

async function main() {
  const storage = new FakeStorage();
  const source = createLocalPartnerDataSource(storage);
  const firstLoad = await source.load();
  check(firstLoad.hotels.length === snapshot.hotels.length, "Fresh load must return the sample snapshot.");

  const edited: typeof firstLoad = {
    ...firstLoad,
    hotels: firstLoad.hotels.map((hotel, index) =>
      index === 0
        ? {
            ...hotel,
            rooms: hotel.rooms.map((room, roomIndex) =>
              roomIndex === 0 ? { ...room, nightlyKobo: room.nightlyKobo + 100 } : room,
            ),
          }
        : hotel,
    ),
  };
  await source.save(edited);
  const reloaded = await source.load();
  check(
    reloaded.hotels[0]?.rooms[0]?.nightlyKobo === edited.hotels[0]?.rooms[0]?.nightlyKobo,
    "Saved snapshot must survive a reload.",
  );
  await source.reset();
  const reset = await source.load();
  check(
    reset.hotels[0]?.rooms[0]?.nightlyKobo === snapshot.hotels[0]?.rooms[0]?.nightlyKobo,
    "Reset must restore the original sample snapshot.",
  );

  if (failures.length > 0) {
    console.error(`Partner dashboard verification failed (${failures.length}):`);
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
  } else {
    console.log(
      `Partner dashboard verified (${snapshot.hotels.length} sample hotels, no contact fields, 10% maths, adapter save/reset).`,
    );
  }
}

void main();
