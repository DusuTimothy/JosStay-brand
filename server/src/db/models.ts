import { DataTypes, type Sequelize } from "sequelize";

/**
 * Sequelize models for the Stage 4 tables. Attributes use camelCase; the
 * underscored option maps them to the snake_case columns created by the CLI
 * migration. Phone and payout fields are modelled as internal attributes so
 * later read routes can use an explicit public column list.
 */
export function defineModels(sequelize: Sequelize) {
  const base = {
    underscored: true,
    freezeTableName: true,
  } as const;

  const withTimestamps = {
    ...base,
    timestamps: true,
  } as const;

  const Area = sequelize.define(
    "Area",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
      name: { type: DataTypes.TEXT, allowNull: false, unique: true },
      centreLat: { type: DataTypes.DOUBLE, field: "centre_lat", allowNull: false },
      centreLng: { type: DataTypes.DOUBLE, field: "centre_lng", allowNull: false },
    },
    { ...withTimestamps, tableName: "areas" },
  );

  const Hotel = sequelize.define(
    "Hotel",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      slug: { type: DataTypes.TEXT, allowNull: false, unique: true },
      name: { type: DataTypes.TEXT, allowNull: false },
      areaId: { type: DataTypes.UUID, field: "area_id", allowNull: false },
      address: { type: DataTypes.TEXT, allowNull: false },
      lat: { type: DataTypes.DOUBLE, allowNull: false },
      lng: { type: DataTypes.DOUBLE, allowNull: false },
      phoneEncrypted: { type: DataTypes.TEXT, field: "phone_encrypted" },
      nightlyKobo: { type: DataTypes.BIGINT, field: "nightly_kobo", allowNull: false },
      policyTemplate: {
        type: DataTypes.ENUM("flexible", "moderate", "strict"),
        field: "policy_template",
        allowNull: false,
      },
      houseRules: {
        type: DataTypes.JSONB,
        field: "house_rules",
        allowNull: false,
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM("draft", "pending", "published"),
        allowNull: false,
        defaultValue: "draft",
      },
      demo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
      commissionBps: {
        type: DataTypes.INTEGER,
        field: "commission_bps",
        allowNull: false,
        defaultValue: 1000,
      },
      paystackSubaccountCode: {
        type: DataTypes.TEXT,
        field: "paystack_subaccount_code",
      },
      subaccountVerifiedAt: {
        type: DataTypes.DATE,
        field: "subaccount_verified_at",
      },
    },
    { ...withTimestamps, tableName: "hotels" },
  );

  const Room = sequelize.define(
    "Room",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      hotelId: { type: DataTypes.UUID, field: "hotel_id", allowNull: false },
      name: { type: DataTypes.TEXT, allowNull: false },
      totalInventory: {
        type: DataTypes.INTEGER,
        field: "total_inventory",
        allowNull: false,
      },
      sleeps: { type: DataTypes.INTEGER, allowNull: false },
      bed: { type: DataTypes.TEXT, allowNull: false },
      ensuite: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { ...withTimestamps, tableName: "rooms" },
  );

  const Verification = sequelize.define(
    "Verification",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      hotelId: { type: DataTypes.UUID, field: "hotel_id", allowNull: false },
      agentRef: { type: DataTypes.TEXT, field: "agent_ref", allowNull: false },
      inspectedAt: { type: DataTypes.DATE, field: "inspected_at", allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false },
      checksJson: {
        type: DataTypes.JSONB,
        field: "checks_json",
        allowNull: false,
        defaultValue: {},
      },
      reportUrl: { type: DataTypes.TEXT, field: "report_url", allowNull: false },
      notes: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
    },
    { ...withTimestamps, tableName: "verifications" },
  );

  const Booking = sequelize.define(
    "Booking",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      reference: { type: DataTypes.TEXT, allowNull: false, unique: true },
      hotelId: { type: DataTypes.UUID, field: "hotel_id", allowNull: false },
      roomId: { type: DataTypes.UUID, field: "room_id", allowNull: false },
      guestName: { type: DataTypes.TEXT, field: "guest_name", allowNull: false },
      guestEmail: { type: DataTypes.TEXT, field: "guest_email", allowNull: false },
      guestPhone: { type: DataTypes.TEXT, field: "guest_phone", allowNull: false },
      checkIn: { type: DataTypes.DATEONLY, field: "check_in", allowNull: false },
      checkOut: { type: DataTypes.DATEONLY, field: "check_out", allowNull: false },
      guests: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM(
          "draft",
          "held",
          "payment_pending",
          "confirmed",
          "completed",
          "expired",
          "failed",
          "cancelled",
          "refund_pending",
          "refunded",
          "no_show",
        ),
        allowNull: false,
        defaultValue: "draft",
      },
      totalKobo: { type: DataTypes.BIGINT, field: "total_kobo" },
      commissionKobo: { type: DataTypes.BIGINT, field: "commission_kobo" },
      hotelShareKobo: { type: DataTypes.BIGINT, field: "hotel_share_kobo" },
      policyTemplateSnapshot: {
        type: DataTypes.ENUM("flexible", "moderate", "strict"),
        field: "policy_template_snapshot",
        allowNull: false,
      },
      policyDeadlineAt: { type: DataTypes.DATE, field: "policy_deadline_at" },
      paystackReference: { type: DataTypes.TEXT, field: "paystack_reference", unique: true },
      expiresAt: { type: DataTypes.DATE, field: "expires_at" },
    },
    { ...withTimestamps, tableName: "bookings" },
  );

  const Hold = sequelize.define(
    "Hold",
    {
      bookingId: { type: DataTypes.UUID, field: "booking_id", primaryKey: true },
      roomId: { type: DataTypes.UUID, field: "room_id", allowNull: false },
      nights: { type: DataTypes.INTEGER, allowNull: false },
      expiresAt: { type: DataTypes.DATE, field: "expires_at", allowNull: false },
    },
    {
      ...base,
      tableName: "holds",
      timestamps: true,
      updatedAt: false,
    },
  );

  const Block = sequelize.define(
    "Block",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      hotelId: { type: DataTypes.UUID, field: "hotel_id", allowNull: false },
      roomId: { type: DataTypes.UUID, field: "room_id", allowNull: false },
      dates: {
        type: DataTypes.RANGE(DataTypes.DATEONLY),
        allowNull: false,
      },
      reason: { type: DataTypes.TEXT, allowNull: false },
      createdBy: { type: DataTypes.TEXT, field: "created_by", allowNull: false },
    },
    { ...withTimestamps, tableName: "blocks" },
  );

  const Refund = sequelize.define(
    "Refund",
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      bookingId: { type: DataTypes.UUID, field: "booking_id", allowNull: false },
      amountKobo: { type: DataTypes.BIGINT, field: "amount_kobo", allowNull: false },
      commissionReversedKobo: {
        type: DataTypes.BIGINT,
        field: "commission_reversed_kobo",
        allowNull: false,
        defaultValue: 0,
      },
      hotelShareKobo: {
        type: DataTypes.BIGINT,
        field: "hotel_share_kobo",
        allowNull: false,
        defaultValue: 0,
      },
      paystackRefundId: { type: DataTypes.TEXT, field: "paystack_refund_id", unique: true },
      status: {
        type: DataTypes.ENUM("initiated", "processing", "completed", "failed"),
        allowNull: false,
        defaultValue: "initiated",
      },
      initiatedBy: { type: DataTypes.TEXT, field: "initiated_by", allowNull: false },
      reason: { type: DataTypes.TEXT, allowNull: false, defaultValue: "" },
      recoveryStatus: {
        type: DataTypes.ENUM("none", "open", "recovering", "recovered", "written_off"),
        field: "recovery_status",
        allowNull: false,
        defaultValue: "none",
      },
      recoveryDueAt: { type: DataTypes.DATE, field: "recovery_due_at" },
      recoveryNotifiedAt: { type: DataTypes.DATE, field: "recovery_notified_at" },
      recoveredKobo: {
        type: DataTypes.BIGINT,
        field: "recovered_kobo",
        allowNull: false,
        defaultValue: 0,
      },
      feeLostKobo: {
        type: DataTypes.BIGINT,
        field: "fee_lost_kobo",
        allowNull: false,
        defaultValue: 0,
      },
    },
    { ...withTimestamps, tableName: "refunds" },
  );

  const AuditLog = sequelize.define(
    "AuditLog",
    {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      actor: { type: DataTypes.TEXT, allowNull: false },
      action: { type: DataTypes.TEXT, allowNull: false },
      entity: { type: DataTypes.TEXT, allowNull: false },
      entityId: { type: DataTypes.UUID, field: "entity_id" },
      beforeState: { type: DataTypes.JSONB, field: "before" },
      afterState: { type: DataTypes.JSONB, field: "after" },
      at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { ...base, tableName: "audit_logs", timestamps: false },
  );

  Area.hasMany(Hotel, { foreignKey: "areaId", as: "hotels" });
  Hotel.belongsTo(Area, { foreignKey: "areaId", as: "area" });

  Hotel.hasMany(Room, { foreignKey: "hotelId", as: "rooms" });
  Room.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

  Hotel.hasMany(Verification, { foreignKey: "hotelId", as: "verifications" });
  Verification.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

  Hotel.hasMany(Booking, { foreignKey: "hotelId", as: "bookings" });
  Booking.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

  Room.hasMany(Booking, { foreignKey: "roomId", as: "bookings" });
  Booking.belongsTo(Room, { foreignKey: "roomId", as: "room" });

  Booking.hasOne(Hold, { foreignKey: "bookingId", as: "hold" });
  Hold.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

  Room.hasMany(Hold, { foreignKey: "roomId", as: "holds" });
  Hold.belongsTo(Room, { foreignKey: "roomId", as: "room" });

  Hotel.hasMany(Block, { foreignKey: "hotelId", as: "blocks" });
  Block.belongsTo(Hotel, { foreignKey: "hotelId", as: "hotel" });

  Room.hasMany(Block, { foreignKey: "roomId", as: "blocks" });
  Block.belongsTo(Room, { foreignKey: "roomId", as: "room" });

  Booking.hasMany(Refund, { foreignKey: "bookingId", as: "refunds" });
  Refund.belongsTo(Booking, { foreignKey: "bookingId", as: "booking" });

  return {
    Area,
    Hotel,
    Room,
    Verification,
    Booking,
    Hold,
    Block,
    Refund,
    AuditLog,
  };
}

export type Models = ReturnType<typeof defineModels>;
