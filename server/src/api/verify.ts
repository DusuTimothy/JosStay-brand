import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { closePool, getModels } from "../db/client.js";
import { createApp } from "../index.js";

const DENIED_KEYS = new Set([
  "phoneEncrypted",
  "phone_encrypted",
  "phone",
  "commissionBps",
  "commission_bps",
  "paystackSubaccountCode",
  "paystack_subaccount_code",
  "subaccountVerifiedAt",
  "subaccount_verified_at",
  "agentRef",
  "agent_ref",
  "reportUrl",
  "report_url",
  "checksJson",
  "checks_json",
  "guestName",
  "guestEmail",
  "guestPhone",
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
  const areaSlug = `api-verify-${suffix}`;
  const hotelSlug = `api-verify-hotel-${suffix}`;
  const today = new Date().toISOString().slice(0, 10);
  const from = addDays(today, 10);
  const to = addDays(from, 2);

  const created: {
    areaId?: string;
    hotelId?: string;
    roomId?: string;
    verificationId?: string;
    bookingIds: string[];
    holdCreated: boolean;
    blockId?: string;
  } = { bookingIds: [], holdCreated: false };

  let server: Server | undefined;

  try {
    const area = await models.Area.create({
      slug: areaSlug,
      name: `API Verify ${suffix}`,
      centreLat: 9.93,
      centreLng: 8.89,
    });
    created.areaId = area.get("id") as string;

    const hotel = await models.Hotel.create({
      slug: hotelSlug,
      name: `API Verify Hotel ${suffix}`,
      areaId: created.areaId,
      address: "Demo address — exact address shared after booking",
      lat: 9.9301,
      lng: 8.8901,
      phoneEncrypted: "internal-only-phone-value",
      nightlyKobo: 5_000_000,
      policyTemplate: "flexible",
      status: "published",
      demo: true,
      commissionBps: 1000,
      paystackSubaccountCode: "ACCT_VERIFY_SECRET",
    });
    created.hotelId = hotel.get("id") as string;

    const room = await models.Room.create({
      hotelId: created.hotelId,
      name: "Verify Room",
      totalInventory: 3,
      sleeps: 2,
      bed: "Queen",
      ensuite: true,
    });
    created.roomId = room.get("id") as string;

    const verification = await models.Verification.create({
      hotelId: created.hotelId,
      agentRef: "internal-agent-ref",
      inspectedAt: new Date(),
      status: "Pass",
      checksJson: {
        registration: true,
        visit: true,
        photoMatch: true,
        pin: true,
        power: true,
      },
      reportUrl: "internal://report",
      notes: "Internal inspection notes",
    });
    created.verificationId = verification.get("id") as string;

    const confirmed = await models.Booking.create({
      reference: `JS-API-C-${suffix}`,
      hotelId: created.hotelId,
      roomId: created.roomId,
      guestName: "Internal Guest",
      guestEmail: "guest@example.com",
      guestPhone: "+2348012345678",
      checkIn: from,
      checkOut: addDays(from, 1),
      guests: 2,
      status: "confirmed",
      totalKobo: 5_000_000,
      commissionKobo: 500_000,
      hotelShareKobo: 4_500_000,
      policyTemplateSnapshot: "flexible",
    });
    created.bookingIds.push(confirmed.get("id") as string);

    const held = await models.Booking.create({
      reference: `JS-API-H-${suffix}`,
      hotelId: created.hotelId,
      roomId: created.roomId,
      guestName: "Internal Guest",
      guestEmail: "guest@example.com",
      guestPhone: "+2348012345678",
      checkIn: addDays(from, 1),
      checkOut: to,
      guests: 2,
      status: "held",
      policyTemplateSnapshot: "flexible",
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    created.bookingIds.push(held.get("id") as string);

    await models.Hold.create({
      bookingId: held.get("id") as string,
      roomId: created.roomId,
      nights: 1,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    created.holdCreated = true;

    const block = await models.Block.create({
      hotelId: created.hotelId,
      roomId: created.roomId,
      dates: [addDays(from, -1), addDays(to, 1)],
      reason: "Demo front-desk block",
      createdBy: "api-verify",
    });
    created.blockId = block.get("id") as string;

    server = createApp().listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server?.once("listening", resolve));
    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;

    async function call(path: string): Promise<{ status: number; body: unknown }> {
      const response = await fetch(`${baseUrl}${path}`);
      const body = await response.json();
      return { status: response.status, body };
    }

    const clearRange = addDays(to, 20);

    const list = await call(
      `/api/hotels?area=${areaSlug}&guests=2&power=24-7&policy=flexible`,
    );
    assert.equal(list.status, 200);
    const hotels = list.body as Array<Record<string, unknown>>;
    assert.equal(hotels.length, 1);
    assert.equal(hotels[0]?.slug, hotelSlug);
    assert.equal(hotels[0]?.area, `API Verify ${suffix}`);
    assert.equal(hotels[0]?.verificationStatus, "Pass");
    assertNoPrivateKeys(list.body);
    assert.ok(!JSON.stringify(list.body).includes("internal-only-phone-value"));
    assert.ok(!JSON.stringify(list.body).includes("ACCT_VERIFY_SECRET"));

    const listedForClearRange = await call(
      `/api/hotels?area=${areaSlug}&dates=${clearRange}:${addDays(clearRange, 1)}&guests=2`,
    );
    assert.equal(listedForClearRange.status, 200);
    assert.equal((listedForClearRange.body as unknown[]).length, 1);

    const listedForSoldOutRange = await call(
      `/api/hotels?area=${areaSlug}&dates=${from}:${to}&guests=2`,
    );
    assert.equal(listedForSoldOutRange.status, 200);
    assert.deepEqual(listedForSoldOutRange.body, []);

    const detail = await call(`/api/hotels/${hotelSlug}`);
    assert.equal(detail.status, 200);
    const detailBody = detail.body as Record<string, unknown>;
    assert.equal(detailBody.rooms instanceof Array, true);
    assert.equal((detailBody.rooms as unknown[]).length, 1);
    assert.equal(
      ((detailBody.rooms as Array<Record<string, unknown>>)[0] ?? {}).id,
      created.roomId,
    );
    assertNoPrivateKeys(detail.body);

    const areas = await call("/api/areas");
    assert.equal(areas.status, 200);
    const areaRows = areas.body as Array<Record<string, unknown>>;
    assert.ok(
      areaRows.some(
        (row) =>
          row.slug === areaSlug && Number(row.count) >= 1 && row.demo === true,
      ),
    );
    assertNoPrivateKeys(areas.body);

    const availability = await call(
      `/api/availability/${created.roomId}?from=${from}&to=${to}`,
    );
    assert.equal(availability.status, 200);
    assert.deepEqual(availability.body, {
      roomId: created.roomId,
      from,
      to,
      nights: 2,
      totalInventory: 3,
      available: 0,
    });

    const clearAvailability = await call(
      `/api/availability/${created.roomId}?from=${clearRange}&to=${addDays(clearRange, 1)}`,
    );
    assert.equal(clearAvailability.status, 200);
    assert.equal((clearAvailability.body as { available: number }).available, 3);

    const badPolicy = await call("/api/hotels?policy=unknown");
    assert.equal(badPolicy.status, 400);

    const badRange = await call(
      `/api/availability/${created.roomId}?from=${to}&to=${from}`,
    );
    assert.equal(badRange.status, 400);

    const missing = await call("/api/hotels/does-not-exist");
    assert.equal(missing.status, 404);

    const health = await call("/health");
    assert.equal(health.status, 200);

    console.log(
      "Read API verified (filters, public allow-list, rooms, areas, availability, validation).",
    );
  } finally {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
      });
    }

    if (created.holdCreated) {
      await models.Hold.destroy({ where: { bookingId: created.bookingIds } });
    }
    if (created.bookingIds.length > 0) {
      await models.Booking.destroy({ where: { id: created.bookingIds } });
    }
    if (created.blockId) {
      await models.Block.destroy({ where: { id: created.blockId } });
    }
    if (created.verificationId) {
      await models.Verification.destroy({ where: { id: created.verificationId } });
    }
    if (created.roomId) {
      await models.Room.destroy({ where: { id: created.roomId } });
    }
    if (created.hotelId) {
      await models.Hotel.destroy({ where: { id: created.hotelId } });
    }
    if (created.areaId) {
      await models.Area.destroy({ where: { id: created.areaId } });
    }
    await closePool();
  }
}

try {
  await main();
  process.exit(0);
} catch (error) {
  await closePool().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "API verification failed.");
  process.exit(1);
}
