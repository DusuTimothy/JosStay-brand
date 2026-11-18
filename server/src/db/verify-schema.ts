import { closePool, query } from "./client.js";

const REQUIRED_COLUMNS: Record<string, string[]> = {
  areas: ["id", "slug", "name", "centre_lat", "centre_lng"],
  hotels: [
    "id",
    "slug",
    "name",
    "area_id",
    "address",
    "lat",
    "lng",
    "phone_encrypted",
    "nightly_kobo",
    "policy_template",
    "house_rules",
    "status",
    "demo",
    "commission_bps",
    "paystack_subaccount_code",
    "subaccount_verified_at",
  ],
  rooms: [
    "id",
    "hotel_id",
    "name",
    "total_inventory",
    "sleeps",
    "bed",
    "ensuite",
  ],
  verifications: [
    "id",
    "hotel_id",
    "agent_ref",
    "inspected_at",
    "status",
    "checks_json",
    "report_url",
    "notes",
    "created_at",
  ],
  bookings: [
    "id",
    "reference",
    "hotel_id",
    "room_id",
    "guest_name",
    "guest_email",
    "guest_phone",
    "check_in",
    "check_out",
    "guests",
    "status",
    "total_kobo",
    "commission_kobo",
    "hotel_share_kobo",
    "policy_template_snapshot",
    "policy_deadline_at",
    "paystack_reference",
    "expires_at",
  ],
  holds: ["booking_id", "room_id", "nights", "expires_at"],
  blocks: ["id", "hotel_id", "room_id", "dates", "reason", "created_by"],
  refunds: [
    "id",
    "booking_id",
    "amount_kobo",
    "commission_reversed_kobo",
    "hotel_share_kobo",
    "paystack_refund_id",
    "status",
    "initiated_by",
    "recovery_status",
    "recovered_kobo",
    "fee_lost_kobo",
    "recovery_due_at",
  ],
  audit_logs: ["actor", "action", "entity", "entity_id", "before", "after", "at"],
};

const REQUIRED_ENUM_SETS = [
  ["draft", "pending", "published"],
  ["flexible", "moderate", "strict"],
  [
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
  ],
  ["initiated", "processing", "completed", "failed"],
  ["none", "open", "recovering", "recovered", "written_off"],
];

function missing(expected: string[], actual: string[]): string[] {
  const found = new Set(actual);
  return expected.filter((item) => !found.has(item));
}

function sameSet(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const left = [...a].sort();
  const right = [...b].sort();
  return left.every((value, index) => value === right[index]);
}

async function verify(): Promise<void> {
  const tables = Object.keys(REQUIRED_COLUMNS);
  const columnRows = await query<{ table_name: string; column_name: string }>(
    `SELECT table_name, column_name
       FROM information_schema.columns
      WHERE table_schema = current_schema()
        AND table_name IN (:tables)`,
    { tables },
  );

  const problems: string[] = [];

  for (const table of tables) {
    const actual = columnRows
      .filter((row) => row.table_name === table)
      .map((row) => row.column_name);
    const absent = missing(REQUIRED_COLUMNS[table], actual);

    if (absent.length > 0) {
      problems.push(`${table}: missing ${absent.join(", ")}`);
    } else {
      console.log(`ok  ${table} (${actual.length} columns)`);
    }
  }

  const enumRows = await query<{ type_name: string; enumlabel: string }>(`
    SELECT t.typname AS type_name, e.enumlabel
      FROM pg_type t
      JOIN pg_enum e ON e.enumtypid = t.oid
      JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = current_schema()
     ORDER BY t.typname, e.enumsortorder
  `);

  const enumValues = new Map<string, string[]>();
  for (const row of enumRows) {
    const values = enumValues.get(row.type_name) ?? [];
    values.push(row.enumlabel);
    enumValues.set(row.type_name, values);
  }

  for (const expected of REQUIRED_ENUM_SETS) {
    const found = [...enumValues.values()].some((values) => sameSet(values, expected));
    if (found) {
      console.log(`ok  enum values: ${expected.join(", ")}`);
    } else {
      problems.push(`enum type with values ${expected.join(", ")} not found`);
    }
  }

  const migrationRows = await query<{ count: string }>(
    "SELECT count(*)::text AS count FROM schema_migrations",
  );
  const migrationCount = migrationRows[0]?.count ?? "0";
  console.log(`ok  schema_migrations (${migrationCount} applied)`);

  if (problems.length > 0) {
    throw new Error(`Schema verification failed:\n- ${problems.join("\n- ")}`);
  }

  console.log("Schema matches the Stage 4 table plan.");
}

try {
  await verify();
  await closePool();
  process.exit(0);
} catch (error) {
  await closePool().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Schema verification failed.");
  process.exit(1);
}
