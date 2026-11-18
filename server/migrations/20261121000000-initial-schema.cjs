'use strict';

const HOTEL_STATUSES = ['draft', 'pending', 'published'];
const POLICIES = ['flexible', 'moderate', 'strict'];
const BOOKING_STATUSES = [
  'draft',
  'held',
  'payment_pending',
  'confirmed',
  'completed',
  'expired',
  'failed',
  'cancelled',
  'refund_pending',
  'refunded',
  'no_show',
];
const REFUND_STATUSES = ['initiated', 'processing', 'completed', 'failed'];
const RECOVERY_STATUSES = ['none', 'open', 'recovering', 'recovered', 'written_off'];

const uuid = (Sequelize) => ({
  type: Sequelize.UUID,
  allowNull: false,
  primaryKey: true,
  defaultValue: Sequelize.literal('gen_random_uuid()'),
});

const createdAt = (Sequelize) => ({
  created_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('now()'),
  },
});

const createdAndUpdatedAt = (Sequelize) => ({
  ...createdAt(Sequelize),
  updated_at: {
    type: Sequelize.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('now()'),
  },
});

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      'CREATE EXTENSION IF NOT EXISTS pgcrypto',
    );

    await queryInterface.createTable(
      'areas',
      {
        id: uuid(Sequelize),
        slug: { type: Sequelize.TEXT, allowNull: false, unique: true },
        name: { type: Sequelize.TEXT, allowNull: false, unique: true },
        centre_lat: { type: Sequelize.DOUBLE, allowNull: false },
        centre_lng: { type: Sequelize.DOUBLE, allowNull: false },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'hotels',
      {
        id: uuid(Sequelize),
        slug: { type: Sequelize.TEXT, allowNull: false, unique: true },
        name: { type: Sequelize.TEXT, allowNull: false },
        area_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'areas', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        address: { type: Sequelize.TEXT, allowNull: false },
        lat: { type: Sequelize.DOUBLE, allowNull: false },
        lng: { type: Sequelize.DOUBLE, allowNull: false },
        phone_encrypted: { type: Sequelize.TEXT },
        nightly_kobo: { type: Sequelize.BIGINT, allowNull: false },
        policy_template: {
          type: Sequelize.ENUM(...POLICIES),
          allowNull: false,
        },
        house_rules: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: [],
        },
        status: {
          type: Sequelize.ENUM(...HOTEL_STATUSES),
          allowNull: false,
          defaultValue: 'draft',
        },
        demo: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
        commission_bps: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1000,
        },
        paystack_subaccount_code: { type: Sequelize.TEXT },
        subaccount_verified_at: { type: Sequelize.DATE },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'rooms',
      {
        id: uuid(Sequelize),
        hotel_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'hotels', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        name: { type: Sequelize.TEXT, allowNull: false },
        total_inventory: { type: Sequelize.INTEGER, allowNull: false },
        sleeps: { type: Sequelize.INTEGER, allowNull: false },
        bed: { type: Sequelize.TEXT, allowNull: false },
        ensuite: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        ...createdAndUpdatedAt(Sequelize),
      },
      {
        timestamps: false,
        uniqueKeys: {
          rooms_hotel_name_key: { fields: ['hotel_id', 'name'] },
        },
      },
    );

    await queryInterface.createTable(
      'verifications',
      {
        id: uuid(Sequelize),
        hotel_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'hotels', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        agent_ref: { type: Sequelize.TEXT, allowNull: false },
        inspected_at: { type: Sequelize.DATE, allowNull: false },
        status: { type: Sequelize.TEXT, allowNull: false },
        checks_json: {
          type: Sequelize.JSONB,
          allowNull: false,
          defaultValue: {},
        },
        report_url: { type: Sequelize.TEXT, allowNull: false },
        notes: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'bookings',
      {
        id: uuid(Sequelize),
        reference: { type: Sequelize.TEXT, allowNull: false, unique: true },
        hotel_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'hotels', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        room_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'rooms', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        guest_name: { type: Sequelize.TEXT, allowNull: false },
        guest_email: { type: Sequelize.TEXT, allowNull: false },
        guest_phone: { type: Sequelize.TEXT, allowNull: false },
        check_in: { type: Sequelize.DATEONLY, allowNull: false },
        check_out: { type: Sequelize.DATEONLY, allowNull: false },
        guests: { type: Sequelize.INTEGER, allowNull: false },
        status: {
          type: Sequelize.ENUM(...BOOKING_STATUSES),
          allowNull: false,
          defaultValue: 'draft',
        },
        total_kobo: { type: Sequelize.BIGINT },
        commission_kobo: { type: Sequelize.BIGINT },
        hotel_share_kobo: { type: Sequelize.BIGINT },
        policy_template_snapshot: {
          type: Sequelize.ENUM(...POLICIES),
          allowNull: false,
        },
        policy_deadline_at: { type: Sequelize.DATE },
        paystack_reference: { type: Sequelize.TEXT, unique: true },
        expires_at: { type: Sequelize.DATE },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'holds',
      {
        booking_id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
          references: { model: 'bookings', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        room_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'rooms', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        nights: { type: Sequelize.INTEGER, allowNull: false },
        expires_at: { type: Sequelize.DATE, allowNull: false },
        ...createdAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'blocks',
      {
        id: uuid(Sequelize),
        hotel_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'hotels', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        room_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'rooms', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        dates: {
          type: Sequelize.RANGE(Sequelize.DATEONLY),
          allowNull: false,
        },
        reason: { type: Sequelize.TEXT, allowNull: false },
        created_by: { type: Sequelize.TEXT, allowNull: false },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'refunds',
      {
        id: uuid(Sequelize),
        booking_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'bookings', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        amount_kobo: { type: Sequelize.BIGINT, allowNull: false },
        commission_reversed_kobo: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        hotel_share_kobo: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        paystack_refund_id: { type: Sequelize.TEXT, unique: true },
        status: {
          type: Sequelize.ENUM(...REFUND_STATUSES),
          allowNull: false,
          defaultValue: 'initiated',
        },
        initiated_by: { type: Sequelize.TEXT, allowNull: false },
        reason: { type: Sequelize.TEXT, allowNull: false, defaultValue: '' },
        recovery_status: {
          type: Sequelize.ENUM(...RECOVERY_STATUSES),
          allowNull: false,
          defaultValue: 'none',
        },
        recovery_due_at: { type: Sequelize.DATE },
        recovery_notified_at: { type: Sequelize.DATE },
        recovered_kobo: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        fee_lost_kobo: {
          type: Sequelize.BIGINT,
          allowNull: false,
          defaultValue: 0,
        },
        ...createdAndUpdatedAt(Sequelize),
      },
      { timestamps: false },
    );

    await queryInterface.createTable(
      'audit_logs',
      {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        actor: { type: Sequelize.TEXT, allowNull: false },
        action: { type: Sequelize.TEXT, allowNull: false },
        entity: { type: Sequelize.TEXT, allowNull: false },
        entity_id: { type: Sequelize.UUID },
        before: { type: Sequelize.JSONB },
        after: { type: Sequelize.JSONB },
        at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('now()'),
        },
      },
      { timestamps: false },
    );

    const sql = queryInterface.sequelize.query.bind(queryInterface.sequelize);

    await sql(`
      ALTER TABLE "areas"
        ADD CONSTRAINT "areas_coordinates_valid"
        CHECK ("centre_lat" BETWEEN -90 AND 90 AND "centre_lng" BETWEEN -180 AND 180)
    `);
    await sql(`
      ALTER TABLE "hotels"
        ADD CONSTRAINT "hotels_coordinates_valid"
        CHECK ("lat" BETWEEN -90 AND 90 AND "lng" BETWEEN -180 AND 180)
    `);
    await sql(`
      ALTER TABLE "hotels"
        ADD CONSTRAINT "hotels_nightly_positive" CHECK ("nightly_kobo" > 0)
    `);
    await sql(`
      ALTER TABLE "hotels"
        ADD CONSTRAINT "hotels_commission_bps_valid"
        CHECK ("commission_bps" BETWEEN 0 AND 10000)
    `);
    await sql(`
      ALTER TABLE "rooms"
        ADD CONSTRAINT "rooms_inventory_positive" CHECK ("total_inventory" > 0),
        ADD CONSTRAINT "rooms_sleeps_positive" CHECK ("sleeps" > 0)
    `);
    await sql(`
      ALTER TABLE "verifications"
        ADD CONSTRAINT "verifications_status_valid"
        CHECK ("status" IN ('Pass', 'Pass with notes', 'Fail'))
    `);
    await sql(`
      ALTER TABLE "bookings"
        ADD CONSTRAINT "bookings_dates_valid" CHECK ("check_out" > "check_in"),
        ADD CONSTRAINT "bookings_guests_positive" CHECK ("guests" > 0),
        ADD CONSTRAINT "bookings_amounts_nonnegative"
        CHECK (
          ("total_kobo" IS NULL OR "total_kobo" > 0)
          AND ("commission_kobo" IS NULL OR "commission_kobo" >= 0)
          AND ("hotel_share_kobo" IS NULL OR "hotel_share_kobo" >= 0)
        ),
        ADD CONSTRAINT "bookings_split_adds_up"
        CHECK (
          ("total_kobo" IS NULL AND "commission_kobo" IS NULL AND "hotel_share_kobo" IS NULL)
          OR ("total_kobo" = "commission_kobo" + "hotel_share_kobo")
        )
    `);
    await sql(`
      ALTER TABLE "holds"
        ADD CONSTRAINT "holds_nights_positive" CHECK ("nights" > 0)
    `);
    await sql(`
      ALTER TABLE "blocks"
        ADD CONSTRAINT "blocks_dates_valid"
        CHECK (
          NOT isempty("dates")
          AND lower("dates") IS NOT NULL
          AND upper("dates") IS NOT NULL
        )
    `);
    await sql(`
      ALTER TABLE "refunds"
        ADD CONSTRAINT "refunds_amount_positive" CHECK ("amount_kobo" > 0),
        ADD CONSTRAINT "refunds_amounts_nonnegative"
        CHECK (
          "commission_reversed_kobo" >= 0
          AND "hotel_share_kobo" >= 0
          AND "recovered_kobo" >= 0
          AND "fee_lost_kobo" >= 0
        )
    `);

    await sql(`
      CREATE UNIQUE INDEX "hotels_paystack_subaccount_code_key"
        ON "hotels" ("paystack_subaccount_code")
        WHERE "paystack_subaccount_code" IS NOT NULL
    `);
    await sql(`CREATE INDEX "hotels_area_id_idx" ON "hotels" ("area_id")`);
    await sql(`CREATE INDEX "hotels_status_demo_idx" ON "hotels" ("status", "demo")`);
    await sql(`
      CREATE INDEX "verifications_hotel_inspected_idx"
        ON "verifications" ("hotel_id", "inspected_at" DESC)
    `);
    await sql(`CREATE INDEX "rooms_hotel_id_idx" ON "rooms" ("hotel_id")`);
    await sql(`
      CREATE INDEX "bookings_hotel_status_idx" ON "bookings" ("hotel_id", "status")
    `);
    await sql(`
      CREATE INDEX "bookings_room_dates_idx" ON "bookings" ("room_id", "check_in", "check_out")
    `);
    await sql(`
      CREATE INDEX "bookings_expires_at_idx" ON "bookings" ("expires_at")
        WHERE "expires_at" IS NOT NULL
    `);
    await sql(`CREATE INDEX "holds_room_expires_idx" ON "holds" ("room_id", "expires_at")`);
    await sql(`CREATE INDEX "blocks_hotel_idx" ON "blocks" ("hotel_id")`);
    await sql(`CREATE INDEX "blocks_room_dates_idx" ON "blocks" ("room_id", "dates")`);
    await sql(`CREATE INDEX "refunds_booking_idx" ON "refunds" ("booking_id")`);
    await sql(`CREATE INDEX "refunds_status_idx" ON "refunds" ("status")`);
    await sql(`
      CREATE INDEX "refunds_recovery_idx" ON "refunds" ("recovery_status", "recovery_due_at")
        WHERE "recovery_status" IN ('open', 'recovering')
    `);
    await sql(`CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" ("entity", "entity_id", "at" DESC)`);
    await sql(`CREATE INDEX "audit_logs_actor_at_idx" ON "audit_logs" ("actor", "at" DESC)`);

    await sql(`
      COMMENT ON COLUMN "hotels"."phone_encrypted" IS
        'Internal only. Never select into a public API response; reveal only after a confirmed booking.'
    `);
    await sql(`
      COMMENT ON COLUMN "hotels"."commission_bps" IS
        'Fixed 10% default (1000 bps). Per-hotel overrides require an explicit decision.'
    `);
    await sql(`
      COMMENT ON COLUMN "hotels"."subaccount_verified_at" IS
        'Set only after the hotel Paystack subaccount is verified in the dashboard.'
    `);
    await sql(`
      COMMENT ON TABLE "verifications" IS
        'Internal only. Public pages may show inspected_at, status and check labels, never agent identity or full report.'
    `);
    await sql(`
      COMMENT ON COLUMN "bookings"."policy_template_snapshot" IS
        'Snapshot of the hotel rule at booking time. Later hotel changes must not rewrite past bookings.'
    `);
    await sql(`
      COMMENT ON COLUMN "bookings"."policy_deadline_at" IS
        'Resolved cancellation deadline for this booking, derived from the snapshot and check-in.'
    `);
    await sql(`
      COMMENT ON TABLE "holds" IS
        'Durable mirror of short-lived Redis holds. Availability always re-checks this table.'
    `);
    await sql(`
      COMMENT ON COLUMN "refunds"."recovery_status" IS
        'open means the hotel share was already paid out and must be collected contractually.'
    `);
    await sql(`
      COMMENT ON COLUMN "refunds"."recovered_kobo" IS
        'Amount actually collected from the hotel or offset against future settlements.'
    `);
    await sql(`
      COMMENT ON COLUMN "refunds"."fee_lost_kobo" IS
        'Non-refundable Paystack fee absorbed by JosStay. Never promised back to the guest.'
    `);

    await sql(`
      CREATE OR REPLACE FUNCTION josstay_set_updated_at()
      RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        NEW.updated_at = now();
        RETURN NEW;
      END;
      $$
    `);

    for (const table of [
      'areas',
      'hotels',
      'rooms',
      'verifications',
      'bookings',
      'blocks',
      'refunds',
    ]) {
      await sql(`
        CREATE TRIGGER "${table}_set_updated_at"
        BEFORE UPDATE ON "${table}"
        FOR EACH ROW EXECUTE FUNCTION josstay_set_updated_at()
      `);
    }
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DROP FUNCTION IF EXISTS josstay_set_updated_at() CASCADE',
    );

    for (const table of [
      'audit_logs',
      'refunds',
      'blocks',
      'holds',
      'bookings',
      'verifications',
      'rooms',
      'hotels',
      'areas',
    ]) {
      await queryInterface.dropTable(table);
    }

    for (const type of [
      'enum_refunds_recovery_status',
      'enum_refunds_status',
      'enum_bookings_policy_template_snapshot',
      'enum_bookings_status',
      'enum_hotels_policy_template',
      'enum_hotels_status',
    ]) {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS "${type}"`);
    }
  },
};
