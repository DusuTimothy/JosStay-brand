import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from "pg";
import { env } from "../env.js";

let pool: Pool | undefined;

/**
 * Lazy pool: the API can start without a database configured, but any route
 * that touches data must fail with a clear message rather than a vague error.
 */
export function getPool(): Pool {
  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Configure the PostgreSQL connection first.");
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    });
  }

  return pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<T>> {
  return getPool().query<T>(text, values as unknown[]);
}

export async function withTransaction<T>(
  work: (client: PoolClient) => Promise<T>,
): Promise<T> {
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // The original error is the useful one if the connection died mid-rollback.
    }
    throw error;
  } finally {
    client.release();
  }
}

export async function closePool(): Promise<void> {
  if (!pool) return;
  await pool.end();
  pool = undefined;
}
