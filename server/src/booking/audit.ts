import type { Transaction } from "sequelize";
import type { BookingStatus } from "@josstay/shared";
import { getModels } from "../db/client.js";

export type AuditEntry = {
  actor: string;
  action: string;
  entityId: string;
  entity?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
};

/** Every money or status change gets a row. Written inside the caller's transaction. */
export async function writeAudit(
  transaction: Transaction,
  entry: AuditEntry,
): Promise<void> {
  const { AuditLog } = getModels();
  await AuditLog.create(
    {
      actor: entry.actor,
      action: entry.action,
      entity: entry.entity ?? "booking",
      entityId: entry.entityId,
      beforeState: entry.before ?? null,
      afterState: entry.after ?? null,
    },
    { transaction },
  );
}

export function statusAudit(
  action: string,
  from: BookingStatus,
  to: BookingStatus,
): Pick<AuditEntry, "action" | "before" | "after"> {
  return {
    action,
    before: { status: from },
    after: { status: to },
  };
}
