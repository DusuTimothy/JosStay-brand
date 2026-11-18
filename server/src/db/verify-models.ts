import { closePool, getModels, getSequelize } from "./client.js";
import { INTERNAL_HOTEL_COLUMNS, PUBLIC_HOTEL_ATTRIBUTES } from "./public-fields.js";

async function verify(): Promise<void> {
  const models = getModels();
  const transaction = await getSequelize().transaction();

  try {
    const area = await models.Area.create(
      { slug: "orm-rayfield", name: "ORM Rayfield", centreLat: 9.93, centreLng: 8.89 },
      { transaction },
    );
    const areaId = area.get("id") as string;
    const hotel = await models.Hotel.create(
      {
        slug: "orm-demo-hotel",
        name: "ORM Demo Hotel",
        areaId,
        address: "Demo address",
        lat: 9.9301,
        lng: 8.8901,
        phoneEncrypted: "internal-only-ciphertext",
        nightlyKobo: 5_000_000,
        policyTemplate: "flexible",
        commissionBps: 1000,
        status: "published",
        demo: true,
      },
      { transaction },
    );
    const hotelId = hotel.get("id") as string;
    const room = await models.Room.create(
      {
        hotelId,
        name: "Deluxe",
        totalInventory: 4,
        sleeps: 2,
        bed: "Queen",
        ensuite: true,
      },
      { transaction },
    );
    const roomId = room.get("id") as string;
    const booking = await models.Booking.create(
      {
        reference: "JS-ORM-1",
        hotelId,
        roomId,
        guestName: "Demo Guest",
        guestEmail: "guest@example.com",
        guestPhone: "+2348012345678",
        checkIn: "2026-12-01",
        checkOut: "2026-12-03",
        guests: 2,
        status: "confirmed",
        totalKobo: 10_000_000,
        commissionKobo: 1_000_000,
        hotelShareKobo: 9_000_000,
        policyTemplateSnapshot: "flexible",
        policyDeadlineAt: new Date("2026-11-30T13:00:00Z"),
      },
      { transaction },
    );
    const bookingId = booking.get("id") as string;
    await models.Refund.create(
      {
        bookingId,
        amountKobo: 5_000_000,
        commissionReversedKobo: 0,
        hotelShareKobo: 4_500_000,
        status: "initiated",
        initiatedBy: "day5b-model-check",
        recoveryStatus: "open",
        recoveryDueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        recoveredKobo: 0,
        feeLostKobo: 25_000,
      },
      { transaction },
    );

    const publicHotel = await models.Hotel.findByPk(hotelId, {
      attributes: [...PUBLIC_HOTEL_ATTRIBUTES],
      transaction,
    });
    const publicRow = publicHotel?.get({ plain: true }) as Record<string, unknown> | undefined;

    if (!publicRow) {
      throw new Error("Public hotel query returned no row.");
    }
    if ("phoneEncrypted" in publicRow || "phone_encrypted" in publicRow) {
      throw new Error("Public hotel attributes exposed phone data.");
    }
    for (const column of INTERNAL_HOTEL_COLUMNS) {
      if (column in publicRow) {
        throw new Error(`Public hotel attributes exposed ${column}.`);
      }
    }

    const internalHotel = await models.Hotel.findByPk(hotelId, { transaction });
    if (internalHotel?.get("phoneEncrypted") !== "internal-only-ciphertext") {
      throw new Error("Internal phone field could not be read after write.");
    }

    let badSplitRejected = false;
    try {
      await models.Booking.create(
        {
          reference: "JS-ORM-BAD-1",
          hotelId,
          roomId,
          guestName: "Constraint Guest",
          guestEmail: "constraint@example.com",
          guestPhone: "+2348012345679",
          checkIn: "2026-12-04",
          checkOut: "2026-12-05",
          guests: 1,
          status: "confirmed",
          totalKobo: 10_000_000,
          commissionKobo: 2_000_000,
          hotelShareKobo: 2_000_000,
          policyTemplateSnapshot: "flexible",
        },
        { transaction },
      );
    } catch {
      badSplitRejected = true;
    }
    if (!badSplitRejected) {
      throw new Error("bookings_split_adds_up did not reject a bad split.");
    }

    await transaction.rollback();
    console.log(
      "Sequelize models verified (write, internal read, public allow-list, bad-split constraint, rollback).",
    );
  } catch (error) {
    await transaction.rollback().catch(() => undefined);
    throw error;
  }
}

try {
  await verify();
  await closePool();
  process.exit(0);
} catch (error) {
  await closePool().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Model verification failed.");
  process.exit(1);
}
