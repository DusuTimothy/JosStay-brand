import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { closePool, getModels } from "../db/client.js";
import { createApp } from "../index.js";
import type { NotificationClient, NotificationMessage } from "../notifications/types.js";
import type { InitializePaymentInput, PaymentClient } from "../payment/client.js";
import { getBookingByReference } from "./service.js";

const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) throw new Error("Set PAYSTACK_SECRET_KEY for guest-flow verification");

const DENIED_KEYS = new Set([
  "phone",
  "phoneEncrypted",
  "phone_encrypted",
  "contactEmail",
  "contact_email",
  "guestName",
  "guestEmail",
  "guestPhone",
  "commissionBps",
  "commissionKobo",
  "hotelShareKobo",
  "paystackSecretKey",
  "subaccountCode",
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

function sign(body: string): string {
  return createHmac("sha512", secret as string).update(body).digest("hex");
}

async function main(): Promise<void> {
  const models = getModels();
  const suffix = Date.now().toString(36);
  const areaSlug = `guest-verify-${suffix}`;
  const hotelSlug = `guest-verify-hotel-${suffix}`;
  const today = new Date().toISOString().slice(0, 10);
  const nightlyKobo = 4_000_000;
  const phone = "+2348098765432";
  const hotelPhone = "+2348076543210";

  const capturedNotifications: NotificationMessage[] = [];
  let failGuestEmail = false;
  const fakeNotifications: NotificationClient = {
    async send(message) {
      if (failGuestEmail && message.kind === "guest-email") {
        throw new Error("mail provider offline");
      }
      capturedNotifications.push(message);
    },
  };
  const fakeClient: PaymentClient = {
    async initialize(input: InitializePaymentInput) {
      return {
        authorizationUrl: "https://checkout.paystack.test/mock/session",
        reference: input.reference,
      };
    },
    async refund() {
      throw new Error("Refund provider must not be called in guest verification");
    },
  };

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
      name: `Guest Verify ${suffix}`,
      centreLat: 9.94,
      centreLng: 8.9,
    });
    created.areaId = area.get("id") as string;

    const hotel = await models.Hotel.create({
      slug: hotelSlug,
      name: `Guest Verify Hotel ${suffix}`,
      areaId: created.areaId,
      address: "12 Demo Close, Jos (demo address)",
      lat: 9.9401,
      lng: 8.9001,
      phoneEncrypted: hotelPhone,
      contactEmail: "hotel-internal@example.test",
      nightlyKobo,
      policyTemplate: "moderate",
      status: "published",
      demo: true,
      commissionBps: 1000,
      paystackSubaccountCode: "ACCT_GUEST_VERIFY",
      subaccountVerifiedAt: new Date(),
    });
    created.hotelId = hotel.get("id") as string;

    const room = await models.Room.create({
      hotelId: created.hotelId,
      name: "Guest Verify Room",
      totalInventory: 3,
      sleeps: 2,
      bed: "Queen",
      ensuite: true,
    });
    created.roomId = room.get("id") as string;

    server = createApp({
      paymentClient: fakeClient,
      notificationClient: fakeNotifications,
    }).listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server?.once("listening", resolve));
    const address = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${address.port}`;

    async function post(path: string, body: Record<string, unknown>) {
      const response = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      return { status: response.status, body: await response.json() };
    }

    async function get(path: string) {
      const response = await fetch(`${baseUrl}${path}`);
      return { status: response.status, body: await response.json() };
    }

    async function book(when: number, whatsappOptIn: boolean, email: string) {
      const from = addDays(today, when);
      const response = await post("/api/bookings", {
        guestName: "Guest Flow Tester",
        guestEmail: email,
        guestPhone: phone,
        hotelSlug,
        roomId: created.roomId,
        checkIn: from,
        checkOut: addDays(from, 2),
        guests: 2,
        termsAccepted: true,
        whatsappOptIn,
      });
      assert.equal(response.status, 201);
      const reference = (response.body as { reference: string }).reference;
      created.bookingIds.add((await getBookingByReference(reference)).id);
      return reference;
    }

    async function pay(reference: string, amount: number) {
      const init = await post("/api/payments/initialize", { bookingReference: reference });
      assert.equal(init.status, 200);
      const paystackReference = (init.body as { paystackReference: string }).paystackReference;
      const body = JSON.stringify({
        event: "charge.success",
        data: {
          reference: paystackReference,
          status: "success",
          amount,
          currency: "NGN",
          metadata: { bookingReference: reference },
        },
      });
      const response = await fetch(`${baseUrl}/api/webhooks/paystack`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-paystack-signature": sign(body),
        },
        body,
      });
      return { status: response.status, body: await response.json() };
    }

    // Pending receipt: public address and pin, no private fields.
    const firstReference = await book(10, true, `guest-flow-a-${suffix}@example.test`);
    const pending = await get(`/api/bookings/${firstReference}/receipt`);
    assert.equal(pending.status, 200);
    const pendingBody = pending.body as Record<string, unknown>;
    assert.equal(pendingBody.status, "held");
    assert.equal(pendingBody.address, "12 Demo Close, Jos (demo address)");
    assert.equal(pendingBody.lat, 9.9401);
    assert.equal(pendingBody.lng, 8.9001);
    assert.equal(JSON.stringify(pending.body).includes(hotelPhone), false);
    assertNoPrivateKeys(pending.body);

    const missing = await get("/api/bookings/JS-NOPE/receipt");
    assert.equal(missing.status, 404);
    const malformed = await get("/api/bookings/nope/receipt");
    assert.equal(malformed.status, 400);

    const firstWebhook = await pay(firstReference, nightlyKobo * 2);
    assert.equal(firstWebhook.status, 200);
    assert.equal((await getBookingByReference(firstReference)).status, "confirmed");

    assert.deepEqual(
      capturedNotifications.map((message) => message.kind),
      ["guest-email", "guest-whatsapp", "hotel-email"],
    );
    const guestEmail = capturedNotifications[0];
    const guestWhatsApp = capturedNotifications[1];
    const hotelEmail = capturedNotifications[2];
    assert.equal(guestEmail.kind, "guest-email");
    assert.equal(guestEmail.to, `guest-flow-a-${suffix}@example.test`);
    assert.equal(guestEmail.hotelPhoneIncluded, true);
    assert.ok(guestEmail.text.includes(hotelPhone));
    assert.ok(guestEmail.text.includes("12 Demo Close, Jos (demo address)"));
    assert.ok(guestEmail.text.includes("https://www.google.com/maps?q=9.9401,8.9001"));
    assert.equal(guestWhatsApp.kind, "guest-whatsapp");
    assert.equal(guestWhatsApp.to, phone);
    assert.equal(guestWhatsApp.hotelPhoneIncluded, false);
    assert.equal(guestWhatsApp.text.includes(hotelPhone), false);
    assert.equal(hotelEmail.kind, "hotel-email");
    assert.equal(hotelEmail.to, "hotel-internal@example.test");
    assert.equal(hotelEmail.guestContactIncluded, false);
    assert.ok(hotelEmail.text.includes("Guest Flow Tester"));
    assert.ok(hotelEmail.text.includes("Guest Verify Room"));
    assert.ok(hotelEmail.text.includes(firstReference));
    assert.equal(hotelEmail.text.includes(phone), false);
    assert.equal(hotelEmail.text.includes(`guest-flow-a-${suffix}@example.test`), false);

    const confirmedReceipt = await get(`/api/bookings/${firstReference}/receipt`);
    assert.equal(confirmedReceipt.status, 200);
    assert.equal((confirmedReceipt.body as { status: string }).status, "confirmed");
    assert.equal(JSON.stringify(confirmedReceipt.body).includes(hotelPhone), false);
    assertNoPrivateKeys(confirmedReceipt.body);

    const auditActions = (
      await models.AuditLog.findAll({
        where: { entityId: (await getBookingByReference(firstReference)).id },
        order: [["id", "ASC"]],
      })
    ).map((row) => row.get("action"));
    assert.ok(auditActions.includes("notification.guest-email.sent"));
    assert.ok(auditActions.includes("notification.guest-whatsapp.sent"));
    assert.ok(auditActions.includes("notification.hotel-email.sent"));

    // No opt-in and no hotel contact email: only the guest email is sent.
    await hotel.update({ contactEmail: null });
    const secondReference = await book(30, false, `guest-flow-b-${suffix}@example.test`);
    capturedNotifications.length = 0;
    const secondWebhook = await pay(secondReference, nightlyKobo * 2);
    assert.equal(secondWebhook.status, 200);
    assert.deepEqual(
      capturedNotifications.map((message) => message.kind),
      ["guest-email"],
    );

    // A provider failure is audited but never turns a paid booking into a 500.
    failGuestEmail = true;
    const thirdReference = await book(50, true, `guest-flow-c-${suffix}@example.test`);
    capturedNotifications.length = 0;
    const thirdWebhook = await pay(thirdReference, nightlyKobo * 2);
    assert.equal(thirdWebhook.status, 200);
    assert.equal((await getBookingByReference(thirdReference)).status, "confirmed");
    const thirdId = (await getBookingByReference(thirdReference)).id;
    const thirdActions = (
      await models.AuditLog.findAll({ where: { entityId: thirdId } })
    ).map((row) => row.get("action"));
    assert.ok(thirdActions.includes("notification.guest-email.failed"));
    assert.ok(thirdActions.includes("notification.guest-whatsapp.sent"));

    console.log(
      "Guest flow verified (receipt fields, email-only phone, hotel confirmation, opt-in, audit, failure isolation).",
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
  console.error(error instanceof Error ? error.message : "Guest-flow verification failed.");
  process.exit(1);
}
