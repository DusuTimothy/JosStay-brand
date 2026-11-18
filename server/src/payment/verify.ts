import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import { closePool, getModels } from "../db/client.js";
import { createApp } from "../index.js";
import { getBookingByReference } from "../booking/service.js";
import type { ConfirmationMessage, NotificationClient } from "../notifications/types.js";
import type {
  InitializePaymentInput,
  PaymentClient,
} from "./client.js";

const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) throw new Error("Set PAYSTACK_SECRET_KEY for payment verification");

const DENIED_KEYS = new Set([
  "PAYSTACK_SECRET_KEY",
  "paystackSecretKey",
  "secretKey",
  "subaccountCode",
  "paystackSubaccountCode",
  "paystack_subaccount_code",
  "commissionBps",
  "commissionKobo",
  "commission_kobo",
  "hotelShareKobo",
  "hotel_share_kobo",
  "phoneEncrypted",
  "phone_encrypted",
  "contactEmail",
  "contact_email",
  "phone",
  "guestPhone",
  "guestEmail",
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
  const areaSlug = `payment-verify-${suffix}`;
  const hotelSlug = `payment-verify-hotel-${suffix}`;
  const today = new Date().toISOString().slice(0, 10);
  const from = addDays(today, 10);
  const to = addDays(from, 2);
  const clearFrom = addDays(to, 20);
  const clearTo = addDays(clearFrom, 1);
  const nightlyKobo = 5_000_000;
  const verifiedAt = new Date();

  const captured: InitializePaymentInput[] = [];
  const capturedNotifications: ConfirmationMessage[] = [];
  const fakeNotifications: NotificationClient = {
    async send(message) {
      capturedNotifications.push(message);
    },
  };
  const fakeClient: PaymentClient = {
    async initialize(input) {
      captured.push(input);
      return {
        authorizationUrl: "https://checkout.paystack.test/mock/session",
        reference: input.reference,
      };
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
      name: `Payment Verify ${suffix}`,
      centreLat: 9.93,
      centreLng: 8.89,
    });
    created.areaId = area.get("id") as string;

    const hotel = await models.Hotel.create({
      slug: hotelSlug,
      name: `Payment Verify Hotel ${suffix}`,
      areaId: created.areaId,
      address: "Demo address — exact address shared after booking",
      lat: 9.9301,
      lng: 8.8901,
      phoneEncrypted: "internal-only-phone-value",
      contactEmail: "hotel-internal@example.test",
      nightlyKobo,
      policyTemplate: "flexible",
      status: "published",
      demo: true,
      commissionBps: 1000,
      paystackSubaccountCode: "ACCT_DAY8_VERIFY",
      subaccountVerifiedAt: verifiedAt,
    });
    created.hotelId = hotel.get("id") as string;

    const room = await models.Room.create({
      hotelId: created.hotelId,
      name: "Verify Room",
      totalInventory: 1,
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

    async function post(
      path: string,
      body: Record<string, unknown>,
    ): Promise<{ status: number; body: unknown }> {
      const response = await fetch(`${baseUrl}${path}`, {
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

    async function sendWebhook(
      body: string,
      signature: string | null = sign(body),
    ): Promise<{ status: number; body: unknown }> {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (signature !== null) headers["x-paystack-signature"] = signature;
      const response = await fetch(`${baseUrl}/api/webhooks/paystack`, {
        method: "POST",
        headers,
        body,
      });
      return { status: response.status, body: await response.json() };
    }

    async function bookBooking(
      checkIn: string,
      checkOut: string,
      email: string,
      whatsappOptIn = true,
    ): Promise<{ status: number; body: unknown }> {
      return post("/api/bookings", {
        guestName: "Payment Guest",
        guestEmail: email,
        guestPhone: "+2348012345678",
        hotelSlug,
        roomId: created.roomId,
        checkIn,
        checkOut,
        guests: 2,
        termsAccepted: true,
        whatsappOptIn,
      });
    }

    const firstBooking = await bookBooking(from, to, `pay-a-${suffix}@example.com`);
    assert.equal(firstBooking.status, 201);
    const firstReference = (firstBooking.body as { reference: string }).reference;
    const firstRecord = await getBookingByReference(firstReference);
    created.bookingIds.add(firstRecord.id);
    assert.equal(firstRecord.status, "held");

    await hotel.update({ subaccountVerifiedAt: null });
    const unverifiedGate = await post("/api/payments/initialize", {
      bookingReference: firstReference,
    });
    assert.equal(unverifiedGate.status, 409);
    assert.equal((await getBookingByReference(firstReference)).status, "held");
    await hotel.update({ subaccountVerifiedAt: verifiedAt });

    const initialize = await post("/api/payments/initialize", {
      bookingReference: firstReference,
    });
    assert.equal(initialize.status, 200);
    const initBody = initialize.body as Record<string, unknown>;
    assert.equal(initBody.provider, "paystack");
    assert.equal(initBody.amountKobo, nightlyKobo * 2);
    assert.equal(initBody.bookingReference, firstReference);
    assert.deepEqual(initBody.channels, ["card", "bank", "ussd"]);
    assertNoPrivateKeys(initialize.body);

    const providerInput = captured[0];
    assert.equal(providerInput.email, `pay-a-${suffix}@example.com`);
    assert.equal(providerInput.amountKobo, nightlyKobo * 2);
    assert.equal(providerInput.subaccountCode, "ACCT_DAY8_VERIFY");
    assert.equal(providerInput.bearer, "subaccount");
    assert.equal(providerInput.percentageCharge, 10);
    assert.deepEqual(providerInput.channels, ["card", "bank", "ussd"]);
    assert.ok(
      providerInput.callbackUrl.includes(encodeURIComponent(firstReference)),
    );
    assert.equal(providerInput.metadata.bookingReference, firstReference);
    assert.equal(JSON.stringify(providerInput).includes(secret as string), false);

    const paystackReference = initBody.paystackReference as string;
    assert.equal((await getBookingByReference(firstReference)).status, "payment_pending");

    const chargeBody = JSON.stringify({
      event: "charge.success",
      data: {
        reference: paystackReference,
        status: "success",
        amount: nightlyKobo * 2,
        currency: "NGN",
        metadata: { bookingReference: firstReference },
      },
    });

    const badSignature = await sendWebhook(chargeBody, "deadbeef");
    assert.equal(badSignature.status, 401);
    const missingSignature = await sendWebhook(chargeBody, null);
    assert.equal(missingSignature.status, 401);
    assert.equal((await getBookingByReference(firstReference)).status, "payment_pending");

    const ignoredBody = JSON.stringify({
      event: "charge.success",
      data: { status: "failed", reference: paystackReference },
    });
    const ignored = await sendWebhook(ignoredBody);
    assert.equal(ignored.status, 200);
    assert.equal((ignored.body as { ignored: boolean }).ignored, true);
    assert.equal((await getBookingByReference(firstReference)).status, "payment_pending");

    const confirmedWebhook = await sendWebhook(chargeBody);
    assert.equal(confirmedWebhook.status, 200);
    assert.equal((confirmedWebhook.body as { idempotent: boolean }).idempotent, false);
    const confirmedRecord = await getBookingByReference(firstReference);
    assert.equal(confirmedRecord.status, "confirmed");
    assert.equal(confirmedRecord.paystackReference, paystackReference);
    assert.equal(confirmedRecord.expiresAt, null);
    assert.equal(await models.Hold.count({ where: { bookingId: confirmedRecord.id } }), 0);

    assert.deepEqual(
      capturedNotifications.map((message) => message.kind),
      ["guest-email", "guest-whatsapp", "hotel-email"],
    );
    const guestEmail = capturedNotifications.find((m) => m.kind === "guest-email");
    const guestWhatsApp = capturedNotifications.find((m) => m.kind === "guest-whatsapp");
    const hotelEmail = capturedNotifications.find((m) => m.kind === "hotel-email");
    assert.equal(guestEmail?.hotelPhoneIncluded, true);
    assert.ok(guestEmail?.text.includes("internal-only-phone-value"));
    assert.ok(guestEmail?.text.includes(firstReference));
    assert.ok(guestEmail?.text.includes("9.9301,8.8901"));
    assert.equal(guestWhatsApp?.hotelPhoneIncluded, false);
    assert.equal(guestWhatsApp?.text.includes("internal-only-phone-value"), false);
    assert.equal(hotelEmail?.guestContactIncluded, false);
    assert.ok(hotelEmail?.text.includes("Payment Guest"));
    assert.equal(hotelEmail?.text.includes("pay-a-"), false);
    assert.equal(hotelEmail?.text.includes("+2348012345678"), false);
    assert.ok(hotelEmail?.text.includes("Verify Room"));

    const receipt = await get(`/api/bookings/${firstReference}/receipt`);
    assert.equal(receipt.status, 200);
    const receiptBody = receipt.body as Record<string, unknown>;
    assert.equal(receiptBody.hotelName, `Payment Verify Hotel ${suffix}`);
    assert.equal(receiptBody.address, "Demo address — exact address shared after booking");
    assert.equal(receiptBody.lat, 9.9301);
    assert.equal(receiptBody.lng, 8.8901);
    assertNoPrivateKeys(receipt.body);

    const actionsBeforeReplay = (
      await models.AuditLog.findAll({
        where: { entityId: confirmedRecord.id },
        order: [["id", "ASC"]],
      })
    ).map((row) => row.get("action"));
    assert.ok(actionsBeforeReplay.includes("payment.initialized"));
    assert.ok(actionsBeforeReplay.includes("payment.webhook.received"));
    assert.ok(actionsBeforeReplay.includes("booking.confirmed"));
    assert.equal(
      actionsBeforeReplay.filter((action) => action === "booking.confirmed").length,
      1,
    );

    const replay = await sendWebhook(chargeBody);
    assert.equal(replay.status, 200);
    assert.equal((replay.body as { idempotent: boolean }).idempotent, true);
    assert.equal((await getBookingByReference(firstReference)).status, "confirmed");
    const actionsAfterReplay = (
      await models.AuditLog.findAll({ where: { entityId: confirmedRecord.id } })
    ).map((row) => row.get("action"));
    assert.deepEqual(actionsAfterReplay, actionsBeforeReplay);
    assert.equal(capturedNotifications.length, 3);

    const secondBooking = await bookBooking(clearFrom, clearTo, `pay-b-${suffix}@example.com`);
    assert.equal(secondBooking.status, 201);
    const secondReference = (secondBooking.body as { reference: string }).reference;
    const secondRecord = await getBookingByReference(secondReference);
    created.bookingIds.add(secondRecord.id);

    const secondInit = await post("/api/payments/initialize", {
      bookingReference: secondReference,
    });
    assert.equal(secondInit.status, 200);
    const secondPaystackReference = (secondInit.body as { paystackReference: string })
      .paystackReference;

    const wrongAmount = JSON.stringify({
      event: "charge.success",
      data: {
        reference: secondPaystackReference,
        status: "success",
        amount: 1,
        currency: "NGN",
        metadata: { bookingReference: secondReference },
      },
    });
    const amountMismatch = await sendWebhook(wrongAmount);
    assert.equal(amountMismatch.status, 409);
    assert.equal((await getBookingByReference(secondReference)).status, "payment_pending");

    const correctSecond = JSON.stringify({
      event: "charge.success",
      data: {
        reference: secondPaystackReference,
        status: "success",
        amount: nightlyKobo,
        currency: "NGN",
        metadata: { bookingReference: secondReference },
      },
    });
    const secondWebhook = await sendWebhook(correctSecond);
    assert.equal(secondWebhook.status, 200);
    assert.equal((await getBookingByReference(secondReference)).status, "confirmed");

    const extraKey = await post("/api/payments/initialize", {
      bookingReference: firstReference,
      unexpected: true,
    });
    assert.equal(extraKey.status, 400);

    const unknownBooking = await post("/api/payments/initialize", {
      bookingReference: "JS-NOPE",
    });
    assert.equal(unknownBooking.status, 404);

    assertNoPrivateKeys(secondInit.body);
    assertNoPrivateKeys(confirmedWebhook.body);
    assertNoPrivateKeys(replay.body);
    assertNoPrivateKeys(amountMismatch.body);

    console.log(
      "Payments verified (hosted init, split fields, signature, amount check, idempotency, gate).",
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
  console.error(error instanceof Error ? error.message : "Payment verification failed.");
  process.exit(1);
}
