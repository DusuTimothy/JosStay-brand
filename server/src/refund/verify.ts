import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import {
  GUEST_REFUND_MESSAGE,
  type RecoveryAction,
} from "@josstay/shared";
import { HttpError } from "../api/errors.js";
import { getBookingByReference } from "../booking/service.js";
import { closePool, getModels } from "../db/client.js";
import { createApp } from "../index.js";
import type { NotificationClient, NotificationMessage } from "../notifications/types.js";
import type {
  PaymentClient,
  RefundPaymentInput,
} from "../payment/client.js";

const secret = process.env.PAYSTACK_SECRET_KEY;
if (!secret) throw new Error("Set PAYSTACK_SECRET_KEY for refund verification");

const GUEST_DENIED_KEYS = new Set([
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
  "commission_kobo",
  "hotelShareKobo",
  "hotel_share_kobo",
  "feeLostKobo",
  "fee_lost_kobo",
  "recoveryStatus",
  "recovery_status",
  "paystackSecretKey",
  "subaccountCode",
  "paystackRefundId",
  "paystack_refund_id",
]);

const ADMIN_DENIED_KEYS = new Set([
  "phone",
  "phoneEncrypted",
  "phone_encrypted",
  "contactEmail",
  "contact_email",
  "guestName",
  "guestEmail",
  "guestPhone",
  "paystackSecretKey",
  "subaccountCode",
  "paystackSubaccountCode",
  "paystack_subaccount_code",
]);

function assertNoKeys(value: unknown, denied: Set<string>, path = "response"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoKeys(item, denied, `${path}[${index}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      assert.ok(!denied.has(key), `${path} exposed ${key}`);
      assertNoKeys(child, denied, `${path}.${key}`);
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
  const today = new Date().toISOString().slice(0, 10);
  const hotelPhone = "+2348091112222";
  const feeLostKobo = 1_250;
  const nightlyModerate = 4_000_000;
  const nightlyFlexible = 5_000_000;

  const refundCalls: RefundPaymentInput[] = [];
  const capturedNotifications: NotificationMessage[] = [];
  let failNextRefund = false;

  const fakeClient: PaymentClient = {
    async initialize(input) {
      return {
        authorizationUrl: "https://checkout.paystack.test/mock/session",
        reference: input.reference,
      };
    },
    async refund(input) {
      refundCalls.push(input);
      if (failNextRefund) {
        throw new HttpError(502, "Refund provider declined");
      }
      return {
        providerRefundId: `PR-${input.reference}`,
        status: "completed",
        feeLostKobo,
      };
    },
  };

  const fakeNotifications: NotificationClient = {
    async send(message) {
      capturedNotifications.push(message);
    },
  };

  const created: {
    areaIds: string[];
    hotelIds: string[];
    roomIds: string[];
    bookingIds: Set<string>;
  } = { areaIds: [], hotelIds: [], roomIds: [], bookingIds: new Set() };

  let server: Server | undefined;

  try {
    async function makeHotel(
      name: string,
      policyTemplate: "moderate" | "flexible",
      nightlyKobo: number,
    ) {
      const area = await models.Area.create({
        slug: `refund-verify-${name}-${suffix}`,
        name: `Refund Verify ${name} ${suffix}`,
        centreLat: 9.94,
        centreLng: 8.9,
      });
      created.areaIds.push(area.get("id") as string);

      const hotel = await models.Hotel.create({
        slug: `refund-verify-hotel-${name}-${suffix}`,
        name: `Refund Verify Hotel ${name} ${suffix}`,
        areaId: area.get("id") as string,
        address: "12 Demo Close, Jos (demo address)",
        lat: 9.9401,
        lng: 8.9001,
        phoneEncrypted: hotelPhone,
        contactEmail: "hotel-internal@example.test",
        nightlyKobo,
        policyTemplate,
        status: "published",
        demo: true,
        commissionBps: 1000,
        paystackSubaccountCode: `ACCT_REFUND_${name.toUpperCase()}`,
        subaccountVerifiedAt: new Date(),
      });
      created.hotelIds.push(hotel.get("id") as string);

      const room = await models.Room.create({
        hotelId: hotel.get("id") as string,
        name: `Refund Verify ${name} Room`,
        totalInventory: 1,
        sleeps: 2,
        bed: "Queen",
        ensuite: true,
      });
      created.roomIds.push(room.get("id") as string);

      return { hotel, room };
    }

    const moderate = await makeHotel("moderate", "moderate", nightlyModerate);
    const flexible = await makeHotel("flexible", "flexible", nightlyFlexible);

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

    async function bookAndPay(
      roomId: string,
      hotelSlug: string,
      checkIn: string,
      email: string,
      amount: number,
    ): Promise<string> {
      const booking = await post("/api/bookings", {
        guestName: "Refund Flow Tester",
        guestEmail: email,
        guestPhone: "+2348088888888",
        hotelSlug,
        roomId,
        checkIn,
        checkOut: addDays(checkIn, 2),
        guests: 2,
        termsAccepted: true,
        whatsappOptIn: true,
      });
      assert.equal(booking.status, 201, JSON.stringify(booking.body));
      const reference = (booking.body as { reference: string }).reference;
      created.bookingIds.add((await getBookingByReference(reference)).id);

      const init = await post("/api/payments/initialize", { bookingReference: reference });
      assert.equal(init.status, 200, JSON.stringify(init.body));
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
      assert.equal(response.status, 200);
      assert.equal((await getBookingByReference(reference)).status, "confirmed");
      return reference;
    }

    function refundBody(
      bookingReference: string,
      reasonCode: string,
      hotelPayoutState: string,
      note?: string,
    ) {
      return {
        bookingReference,
        reasonCode,
        hotelPayoutState,
        initiatedBy: "refund-verifier",
        ...(note ? { note } : {}),
      };
    }

    const partialRef = await bookAndPay(
      moderate.room.get("id") as string,
      moderate.hotel.get("slug") as string,
      addDays(today, 2),
      `refund-partial-${suffix}@example.test`,
      nightlyModerate * 2,
    );
    const recoveryRef = await bookAndPay(
      moderate.room.get("id") as string,
      moderate.hotel.get("slug") as string,
      addDays(today, 30),
      `refund-recovery-${suffix}@example.test`,
      nightlyModerate * 2,
    );
    const lateRef = await bookAndPay(
      flexible.room.get("id") as string,
      flexible.hotel.get("slug") as string,
      addDays(today, 1),
      `refund-late-${suffix}@example.test`,
      nightlyFlexible * 2,
    );
    const retryRef = await bookAndPay(
      flexible.room.get("id") as string,
      flexible.hotel.get("slug") as string,
      addDays(today, 40),
      `refund-retry-${suffix}@example.test`,
      nightlyFlexible * 2,
    );

    capturedNotifications.length = 0;
    refundCalls.length = 0;

    // Moderate, 50% window: 4m refund on an 8m stay, with proportional split.
    const partialInput = refundBody(partialRef, "guest_cancellation", "held_by_paystack");
    const partial = await post("/api/refunds", partialInput);
    assert.equal(partial.status, 201, JSON.stringify(partial.body));
    const partialBody = partial.body as Record<string, unknown>;
    assert.deepEqual(Object.keys(partialBody).sort(), [
      "amountKobo",
      "bookingReference",
      "guestMessage",
      "id",
      "initiatedAt",
      "status",
    ]);
    assert.equal(partialBody.amountKobo, nightlyModerate * 2 * 0.5);
    assert.equal(partialBody.status, "completed");
    assert.equal(partialBody.guestMessage, GUEST_REFUND_MESSAGE);
    assertNoKeys(partial.body, GUEST_DENIED_KEYS);

    const partialRecord = await models.Refund.findByPk(partialBody.id as string);
    assert.ok(partialRecord);
    assert.equal(Number(partialRecord.get("amountKobo")), 4_000_000);
    assert.equal(Number(partialRecord.get("commissionReversedKobo")), 400_000);
    assert.equal(Number(partialRecord.get("hotelShareKobo")), 3_600_000);
    assert.equal(Number(partialRecord.get("feeLostKobo")), feeLostKobo);
    assert.equal(partialRecord.get("recoveryStatus"), "none");
    assert.equal(partialRecord.get("paystackRefundId"), `PR-${refundCalls[0].reference}`);
    assert.equal((await getBookingByReference(partialRef)).status, "refunded");
    assert.equal(refundCalls.length, 1);
    assert.equal(refundCalls[0].amountKobo, 4_000_000);
    assert.match(refundCalls[0].reason, /guest cancellation/);

    const partialRefundMessages = capturedNotifications.filter(
      (
        message,
      ): message is Extract<
        NotificationMessage,
        { kind: "guest-refund-email" | "guest-refund-whatsapp" }
      > =>
        message.bookingReference === partialRef &&
        (message.kind === "guest-refund-email" ||
          message.kind === "guest-refund-whatsapp"),
    );
    assert.deepEqual(
      partialRefundMessages.map((message) => message.kind),
      ["guest-refund-email", "guest-refund-whatsapp"],
    );
    for (const message of partialRefundMessages) {
      assert.equal(message.hotelPhoneIncluded, false);
      assert.ok(message.text.includes(GUEST_REFUND_MESSAGE));
      assert.equal(message.text.includes(hotelPhone), false);
      assert.equal(message.text.includes("hotel-internal@example.test"), false);
      assert.equal(message.text.includes("refund-partial-"), false);
    }

    const partialActions = (
      await models.AuditLog.findAll({
        where: { entityId: partialBody.id as string },
        order: [["id", "ASC"]],
      })
    ).map((row) => row.get("action"));
    assert.ok(partialActions.includes("refund.initiated"));
    assert.ok(partialActions.includes("refund.provider_accepted"));
    const partialBookingActions = (
      await models.AuditLog.findAll({
        where: { entityId: (await getBookingByReference(partialRef)).id },
      })
    ).map((row) => row.get("action"));
    assert.ok(partialBookingActions.includes("notification.guest-refund-email.sent"));

    // A retry with the same body returns the stored result without a second call.
    capturedNotifications.length = 0;
    const duplicate = await post("/api/refunds", partialInput);
    assert.equal(duplicate.status, 201);
    assert.equal((duplicate.body as { id: string }).id, partialBody.id);
    assert.equal(refundCalls.length, 1);
    assert.equal(capturedNotifications.length, 0);
    assert.equal(await models.Refund.count({ where: { bookingId: (await getBookingByReference(partialRef)).id } }), 1);

    // Full refund after hotel payout: no automatic split; open recovery task.
    const recoveryInput = refundBody(recoveryRef, "guest_cancellation", "paid_out");
    const recovery = await post("/api/refunds", recoveryInput);
    assert.equal(recovery.status, 201, JSON.stringify(recovery.body));
    const recoveryRecord = await models.Refund.findByPk(
      (recovery.body as { id: string }).id,
    );
    assert.ok(recoveryRecord);
    assert.equal(Number(recoveryRecord.get("amountKobo")), 8_000_000);
    assert.equal(Number(recoveryRecord.get("commissionReversedKobo")), 800_000);
    assert.equal(Number(recoveryRecord.get("hotelShareKobo")), 7_200_000);
    assert.equal(Number(recoveryRecord.get("feeLostKobo")), feeLostKobo);
    assert.equal(recoveryRecord.get("recoveryStatus"), "open");
    const recoveryDueAt = recoveryRecord.get("recoveryDueAt") as Date;
    const daysToDue = Math.round((recoveryDueAt.getTime() - Date.now()) / 86_400_000);
    assert.ok(daysToDue >= 6 && daysToDue <= 7);

    const recoveryAudit = (
      await models.AuditLog.findAll({
        where: { entityId: recoveryRecord.get("id") as string },
      })
    ).map((row) => row.get("action"));
    assert.ok(recoveryAudit.includes("recovery.task_created"));

    const openQueue = await get("/api/admin/refund-recovery?status=open");
    assert.equal(openQueue.status, 200);
    assert.ok(Array.isArray(openQueue.body));
    assertNoKeys(openQueue.body, ADMIN_DENIED_KEYS);
    let queueItem = (openQueue.body as Array<Record<string, unknown>>).find(
      (item) => item.bookingReference === recoveryRef,
    );
    assert.ok(queueItem);
    assert.equal(queueItem.hotelName, `Refund Verify Hotel moderate ${suffix}`);
    assert.equal(queueItem.hotelShareKobo, 7_200_000);
    assert.equal(queueItem.recoveredKobo, 0);
    assert.equal(queueItem.aged, false);

    await recoveryRecord.update({
      recoveryDueAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    });
    const agedQueue = await get("/api/admin/refund-recovery?status=open&aged=true");
    assert.equal(agedQueue.status, 200);
    queueItem = (agedQueue.body as Array<Record<string, unknown>>).find(
      (item) => item.bookingReference === recoveryRef,
    );
    assert.ok(queueItem);
    assert.equal(queueItem.aged, true);
    const freshQueue = await get("/api/admin/refund-recovery?status=open&aged=false");
    assert.equal(
      (freshQueue.body as Array<Record<string, unknown>>).some(
        (item) => item.bookingReference === recoveryRef,
      ),
      false,
    );

    const recoveryId = recoveryRecord.get("id") as string;
    async function recoveryAction(body: Partial<RecoveryAction>) {
      return post(`/api/admin/refund-recovery/${recoveryId}/actions`, {
        ...body,
        actor: "ops-verifier",
      });
    }

    const notify = await recoveryAction({
      action: "notify",
      note: "Written notice sent to the hotel",
    });
    assert.equal(notify.status, 200, JSON.stringify(notify.body));
    assert.equal((notify.body as { recoveryStatus: string }).recoveryStatus, "open");
    assert.ok((notify.body as { recoveryNotifiedAt: string }).recoveryNotifiedAt);

    const recovering = await recoveryAction({ action: "mark_recovering" });
    assert.equal(recovering.status, 200);
    assert.equal((recovering.body as { recoveryStatus: string }).recoveryStatus, "recovering");

    const recovered = await recoveryAction({
      action: "mark_recovered",
      amountKobo: 7_200_000,
    });
    assert.equal(recovered.status, 200);
    assert.equal((recovered.body as { recoveryStatus: string }).recoveryStatus, "recovered");
    assert.equal((recovered.body as { recoveredKobo: number }).recoveredKobo, 7_200_000);
    assertNoKeys(recovered.body, ADMIN_DENIED_KEYS);

    const terminal = await recoveryAction({ action: "write_off" });
    assert.equal(terminal.status, 409);
    const allQueue = await get("/api/admin/refund-recovery?status=all");
    assert.equal(allQueue.status, 200);
    assert.ok(
      (allQueue.body as Array<Record<string, unknown>>).some(
        (item) =>
          item.bookingReference === recoveryRef && item.recoveryStatus === "recovered",
      ),
    );

    // Flexible after its 24h deadline: first night is non-refundable.
    const late = await post(
      "/api/refunds",
      refundBody(lateRef, "guest_cancellation", "held_by_paystack"),
    );
    assert.equal(late.status, 201, JSON.stringify(late.body));
    assert.equal((late.body as { amountKobo: number }).amountKobo, 5_000_000);
    const lateRecord = await models.Refund.findByPk((late.body as { id: string }).id);
    assert.equal(Number(lateRecord?.get("commissionReversedKobo")), 500_000);
    assert.equal(Number(lateRecord?.get("hotelShareKobo")), 4_500_000);

    // Provider failure leaves an audited failed row; the same key retries it.
    failNextRefund = true;
    const retryInput = refundBody(retryRef, "hotel_cancellation", "held_by_paystack", "provider rehearsal");
    const failed = await post("/api/refunds", retryInput);
    assert.equal(failed.status, 502);
    const failedRecord = await models.Refund.findOne({
      where: { bookingId: (await getBookingByReference(retryRef)).id },
    });
    assert.ok(failedRecord);
    assert.equal(failedRecord.get("status"), "failed");
    assert.equal((await getBookingByReference(retryRef)).status, "refund_pending");
    const failedAudit = (
      await models.AuditLog.findAll({
        where: { entityId: failedRecord.get("id") as string },
      })
    ).map((row) => row.get("action"));
    assert.ok(failedAudit.includes("refund.provider_failed"));

    const callsAfterFailure = refundCalls.length;
    failNextRefund = false;
    const retried = await post("/api/refunds", retryInput);
    assert.equal(retried.status, 201, JSON.stringify(retried.body));
    assert.equal((retried.body as { id: string }).id, failedRecord.get("id"));
    assert.equal((retried.body as { amountKobo: number }).amountKobo, 10_000_000);
    assert.equal(refundCalls.length, callsAfterFailure + 1);
    assert.equal((await getBookingByReference(retryRef)).status, "refunded");
    await failedRecord.reload();
    assert.equal(failedRecord.get("status"), "completed");
    const retryAudit = (
      await models.AuditLog.findAll({
        where: { entityId: failedRecord.get("id") as string },
      })
    ).map((row) => row.get("action"));
    assert.ok(retryAudit.includes("refund.retried"));

    const malformed = await post("/api/refunds", {
      ...partialInput,
      unexpected: true,
    });
    assert.equal(malformed.status, 400);
    const unknown = await post("/api/refunds", refundBody("JS-NOPE", "guest_cancellation", "held_by_paystack"));
    assert.equal(unknown.status, 404);
    const badAction = await post("/api/admin/refund-recovery/not-a-uuid/actions", {
      action: "notify",
      actor: "ops-verifier",
    });
    assert.equal(badAction.status, 400);

    assertNoKeys(malformed.body, GUEST_DENIED_KEYS);
    assertNoKeys(unknown.body, GUEST_DENIED_KEYS);
    assertNoKeys(badAction.body, ADMIN_DENIED_KEYS);

    console.log(
      "Refunds verified (policy amounts, proportional reversal, fee loss, recovery queue, retry, privacy).",
    );
  } finally {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server?.close((error) => (error ? reject(error) : resolve()));
      });
    }

    const bookingIds = [...created.bookingIds];
    if (bookingIds.length > 0) {
      const refunds = await models.Refund.findAll({
        where: { bookingId: bookingIds },
        attributes: ["id"],
      });
      const refundIds = refunds.map((row) => row.get("id") as string);
      const auditEntityIds = [...bookingIds, ...refundIds];
      if (auditEntityIds.length > 0) {
        await models.AuditLog.destroy({ where: { entityId: auditEntityIds } });
      }
      await models.Refund.destroy({ where: { bookingId: bookingIds } });
      await models.Hold.destroy({ where: { bookingId: bookingIds } });
      await models.Booking.destroy({ where: { id: bookingIds } });
    }
    if (created.roomIds.length > 0) {
      await models.Room.destroy({ where: { id: created.roomIds } });
    }
    if (created.hotelIds.length > 0) {
      await models.Hotel.destroy({ where: { id: created.hotelIds } });
    }
    if (created.areaIds.length > 0) {
      await models.Area.destroy({ where: { id: created.areaIds } });
    }
    await closePool();
  }
}

try {
  await main();
  process.exit(0);
} catch (error) {
  await closePool().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Refund verification failed.");
  process.exit(1);
}
