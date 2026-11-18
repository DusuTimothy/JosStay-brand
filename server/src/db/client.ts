import { QueryTypes, Sequelize, type Transaction } from "sequelize";
import { env } from "../env.js";
import { defineModels, type Models } from "./models.js";

let sequelize: Sequelize | undefined;
let models: Models | undefined;

/**
 * Lazy Sequelize instance. The API can start without a database configured,
 * but any route that touches data must fail with a clear message.
 */
export function getSequelize(): Sequelize {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Configure the PostgreSQL connection first.");
  }

  if (!sequelize) {
    sequelize = new Sequelize(env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      define: {
        underscored: true,
        freezeTableName: true,
      },
    });
    models = defineModels(sequelize);
  }

  return sequelize;
}

export function getModels(): Models {
  getSequelize();
  if (!models) throw new Error("Sequelize models were not initialised.");
  return models;
}

export async function query<T>(
  sql: string,
  replacements: Record<string, unknown> | unknown[] = {},
): Promise<T[]> {
  const rows = await getSequelize().query(sql, {
    replacements,
    type: QueryTypes.SELECT,
  });
  return rows as T[];
}

/** Same query shape, but pinned to the caller's transaction for locks and atomicity. */
export async function queryInTransaction<T>(
  sql: string,
  replacements: Record<string, unknown>,
  transaction: Transaction,
): Promise<T[]> {
  const rows = await getSequelize().query(sql, {
    replacements,
    transaction,
    type: QueryTypes.SELECT,
  });
  return rows as T[];
}

export async function withTransaction<T>(
  work: (transaction: Transaction) => Promise<T>,
): Promise<T> {
  return getSequelize().transaction(work);
}

export async function closePool(): Promise<void> {
  if (!sequelize) return;
  await sequelize.close();
  sequelize = undefined;
  models = undefined;
}

export const closeDatabase = closePool;
