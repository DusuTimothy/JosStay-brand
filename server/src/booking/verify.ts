import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  calculateBookingMoney,
  calculatePolicyDeadline,
  nightsBetweenDates,
} from "@josstay/shared";
import { closePool, getModels } from "../db/client.js";
import { createApp } from "../index.js";
import {
  beginPayment,
  confirmBooking,
  expireStaleHolds,
  getBookingByReference,
} from "./service.js";

const DENIED_KEYS = new Set([
  "phoneEncrypted",
  "phone_encrypted",
  "phone",
  "commissionBps",
  "commission_bps",
  "commissionKobo",
  "commission_kobo",
  "hotelShareKobo",
  "hotel_share_kobo",
  "paystackSubaccountCode",
  "paystack_subaccount_code",
  "agentRef",
  "agent_ref",
  "reportUrl",
  "report_url",
  "checksJson",
  "checks_json",
]);

function assertNoPrivateKeys(value: unknown, path = "response"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoPrivateKeys(item, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!DENIED_KEYS.has(key), `${path} exposed ${key}`);
      assertNoPrivateKeys(child, `${path}.${key}`);
    }
  }
}

function addDays(iso: string, days: number): string {
  const date = new Date(`${iso}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  const models = getModels();
  const suffix = Date.now().toString(36);
  const areaSlug = `booking-verify-${suffix}`;
  const hotelSlug = `booking-verify-hotel-${suffix}`;
  const today = new Date().toISOString().slice(0, 10);
  const from = addDays(today, 10);
  const to = addDays(from, 2);
  const clearFrom = addDays(to, 20);
  const clearTo = addDays(clearFrom, 1);
  const nightlyKobo = 5_000_000;

  const created: {
    areaId?: string;
    hotelId?: string;
    roomId?: string;
    bookingIds: Set<string>;
  } = { bookingIds: new Set() };

  let server: Server | undefined;

  try {
    const area = await models.Area.create({
      slug: areaSlug,
      name: `Booking Verify ${suffix}`,
      centreLat: 9.93,
      centreLng: 8.89,
    });
    created.areaId = area.get("id") as string;

    const hotel = await models.Hotel.create({
      slug: hotelSlug,
      name: `Booking Verify Hotel ${suffix}`,
      areaId: created.areaId,
      address: "Demo address — exact address shared after booking",
      lat: 9.9301,
      lng: 8.8901,
      phoneEncrypted: "internal-only-phone-value",
      nightlyKobo,
      policyTemplate: "flexible",
      status: "published",
      demo: true,
      commissionBps: 1000,
      paystackSubaccountCode: "ACCT_BOOKING_SECRET",
    });
    created.hotelId = hotel.get("id") as string;

    const room = await models.Room.create({
      hotelId: created.hotelId,
      name: "Last Room",
      totalInventory: 1,
      sleeps: 2,
      bed: "Queen",
      ensuite: true,
    });
    created.roomId = room.get("id") as string;

    server = createApp().listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server?.once("listening", resolve));
    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;

    async function post(body: Record<string, unknown>): Promise<{
      status: number;
      body: unknown;
    }> {
      const response = await fetch(`${baseUrl}/api/bookings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return { status: response.status, body: await response.json() };
    }

    async function get(path: string): Promise<{ status: number; body: unknown }> {
      const response = await fetch(`${baseUrl}${path}`);
      return { status: response.status, body: await response.json() };
    }

    const baseBody = {
      guestName: "Race Guest",
      guestEmail: `race-${suffix}@example.com`,
      guestPhone: "+2348012345678",
      hotelSlug,
      roomId: created.roomId,
      checkIn: from,
      checkOut: to,
      guests: 2,
      termsAccepted: true,
      whatsappOptIn: false,
    };

    const [first, second] = await Promise.all([
      post({ ...baseBody, guestName: "Race Guest A", guestEmail: `race-a-${suffix}@example.com` }),
      post({ ...baseBody, guestName: "Race Guest B", guestEmail: `race-b-${suffix}@example.com` }),
    ]);
    assert.deepEqual([first.status, second.status].sort(), [201, 409]);

    const winner = first.status === 201 ? first : second;
    const loser = first.status === 201 ? second : first;
    assert.equal((loser.body as { error: string }).error, "This room is no longer available for those dates");

    const held = winner.body as Record<string, unknown>;
    assert.equal(held.status, "held");
    assert.equal(held.totalKobo, nightlyKobo * 2);
    assert.equal(held.nights, 2);
    assert.equal(held.hotelSlug, hotelSlug);
    assertNoPrivateKeys(winner.body);
    assert.ok(!JSON.stringify(winner.body).includes("internal-only-phone-value"));
    assert.ok(!JSON.stringify(winner.body).includes("ACCT_BOOKING_SECRET"));

    const expectedDeadline =
      Date.parse(`${from}T00:00:00+01:00`) - 24 * 60 * 60 * 1000;
    assert.ok(
      Math.abs(Date.parse(held.policyDeadlineAt as string) - expectedDeadline) < 5_000,
    );
    const ttlMs = Date.parse(held.holdExpiresAt as string) - Date.now();
    assert.ok(ttlMs > 9 * 60 * 1000 && ttlMs <= 10 * 60 * 1000);

    const winnerRef = held.reference as string;
    const winnerRecord = await getBookingByReference(winnerRef);
    created.bookingIds.add(winnerRecord.id);
    assert.equal(winnerRecord.status, "held");
    assert.equal(Number(winnerRecord.totalKobo), nightlyKobo * 2);
    assert.equal(Number(winnerRecord.commissionKobo), nightlyKobo * 2 * 0.1);
    assert.equal(Number(winnerRecord.hotelShareKobo), nightlyKobo * 2 * 0.9);
    assert.equal(winnerRecord.policyTemplateSnapshot, "flexible");

    const holds = await models.Hold.findAll({ where: { bookingId: winnerRecord.id } });
    assert.equal(holds.length, 1);
    assert.equal(Number(holds[0]?.get("nights")), 2);

    const createdAudits = await models.AuditLog.findAll({
      where: { entityId: winnerRecord.id },
      order: [["id", "ASC"]],
    });
    const createdActions = createdAudits.map((row) => row.get("action"));
    assert.ok(createdActions.includes("booking.created"));
    assert.ok(createdActions.includes("booking.held"));
    assert.ok(createdActions.includes("hold.created"));

    await beginPayment(winnerRef, "PAYSTACK_BOOKING_VERIFY");
    assert.equal((await getBookingByReference(winnerRef)).status, "payment_pending");

    const confirmed = await confirmBooking(winnerRef, "PAYSTACK_BOOKING_VERIFY");
    assert.equal(confirmed.status, "confirmed");
    assert.equal(confirmed.paystackReference, "PAYSTACK_BOOKING_VERIFY");
    assert.equal(confirmed.expiresAt, null);
    assert.equal(await models.Hold.count({ where: { bookingId: confirmed.id } }), 0);

    const confirmedAudits = await models.AuditLog.findAll({
      where: { entityId: confirmed.id },
      order: [["id", "ASC"]],
    });
    const confirmedActions = confirmedAudits.map((row) => row.get("action"));
    assert.ok(confirmedActions.includes("booking.payment_pending"));
    assert.ok(confirmedActions.includes("booking.confirmed"));

    const third = await post({
      ...baseBody,
      guestName: "Race Guest C",
      guestEmail: `race-c-${suffix}@example.com`,
    });
    assert.equal(third.status, 409);

    const clearAvailability = await get(
      `/api/availability/${created.roomId}?from=${clearFrom}&to=${clearTo}`,
    );
    assert.equal(clearAvailability.status, 200);
    assert.equal((clearAvailability.body as { available: number }).available, 1);

    const expiring = await post({
      ...baseBody,
      guestName: "Expiry Guest",
      guestEmail: `expire-${suffix}@example.com`,
      checkIn: clearFrom,
      checkOut: clearTo,
    });
    assert.equal(expiring.status, 201);
    const expiringRef = (expiring.body as { reference: string }).reference;
    const expiringRecord = await getBookingByReference(expiringRef);
    created.bookingIds.add(expiringRecord.id);
    assert.equal(await models.Hold.count({ where: { bookingId: expiringRecord.id } }), 1);

    const future = new Date(Date.now() + 11 * 60 * 1000);
    assert.ok((await expireStaleHolds(future)) >= 1);
    assert.equal((await getBookingByReference(expiringRef)).status, "expired");
    assert.equal(await models.Hold.count({ where: { bookingId: expiringRecord.id } }), 0);
    assert.equal(await expireStaleHolds(future), 0);

    const bookedAt = new Date("2026-11-22T10:00:00.000Z");
    const checkInMs = Date.parse(`${from}T00:00:00+01:00`);
    assert.equal(
      calculatePolicyDeadline("flexible", from, bookedAt).toISOString(),
      new Date(checkInMs - 24 * 60 * 60 * 1000).toISOString(),
    );
    assert.equal(
      calculatePolicyDeadline("moderate", from, bookedAt).toISOString(),
      new Date(checkInMs - 72 * 60 * 60 * 1000).toISOString(),
    );
    assert.equal(
      calculatePolicyDeadline("strict", from, bookedAt).toISOString(),
      new Date(bookedAt.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    );
    assert.equal(nightsBetweenDates(from, to), 2);
    assert.deepEqual(calculateBookingMoney(nightlyKobo, 2, 1000), {
      nights: 2,
      totalKobo: 10_000_000,
      commissionKobo: 1_000_000,
      hotelShareKobo: 9_000_000,
    });

    const badTerms = await post({ ...baseBody, termsAccepted: false });
    assert.equal(badTerms.status, 400);

    const extraKey = await post({ ...baseBody, unexpected: "value" });
    assert.equal(extraKey.status, 400);

    const badPhone = await post({ ...baseBody, guestPhone: "not-a-phone" });
    assert.equal(badPhone.status, 400);

    const pastDate = await post({
      ...baseBody,
      checkIn: "2020-01-01",
      checkOut: "2020-01-02",
    });
    assert.equal(pastDate.status, 400);

    const wrongRoom = await post({
      ...baseBody,
      roomId: randomUUID(),
      guestEmail: `wrong-room-${suffix}@example.com`,
    });
    assert.equal(wrongRoom.status, 404);

    assertNoPrivateKeys(loser.body);
    assertNoPrivateKeys(third.body);
    assertNoPrivateKeys(clearAvailability.body);

    console.log(
      "Booking core verified (race lock, hold, confirmation, expiry, deadlines, audit, validation).",
    );
  } finally {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
      });
    }

    const bookingIds = [...created.bookingIds];
    if (bookingIds.length > 0) {
      await models.AuditLog.destroy({ where: { entityId: bookingIds } });
      await models.Hold.destroy({ where: { bookingId: bookingIds } });
      await models.Booking.destroy({ where: { id: bookingIds } });
    }
    if (created.roomId) await models.Room.destroy({ where: { id: created.roomId } });
    if (created.hotelId) await models.Hotel.destroy({ where: { id: created.hotelId } });
    if (created.areaId) await models.Area.destroy({ where: { id: created.areaId } });
    await closePool();
  }
}

try {
  await main();
  process.exit(0);
} catch (error) {
  await closePool().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Booking verification failed.");
  process.exit(1);
}
