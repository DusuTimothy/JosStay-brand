import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "pg";
import { env } from "../env.js";

const MIGRATION_LOCK = 814_702_026;
const DEFAULT_MIGRATIONS_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../..",
  "migrations",
);

export type MigrationResult = {
  applied: string[];
  skipped: string[];
};

export type MigrateOptions = {
  connectionString?: string;
  migrationsDir?: string;
  logger?: (message: string) => void;
};

/**
 * Applies versioned SQL files exactly once.
 *
 * DIRECT_URL is preferred so migrations can use a session connection while the
 * application uses the pooled DATABASE_URL. A changed checksum for an applied
 * file is an error: never silently rewrite history that a database already ran.
 */
export async function runMigrations(
  options: MigrateOptions = {},
): Promise<MigrationResult> {
  const connectionString =
    options.connectionString ?? env.DIRECT_URL ?? env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("Set DATABASE_URL or DIRECT_URL before running migrations.");
  }

  const migrationsDir = options.migrationsDir ?? DEFAULT_MIGRATIONS_DIR;
  const logger = options.logger ?? console.log;
  const files = (await readdir(migrationsDir))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    throw new Error(`No .sql migrations found in ${migrationsDir}`);
  }

  const pool = new Pool({ connectionString, max: 1 });
  const client = await pool.connect();
  const applied: string[] = [];
  const skipped: string[] = [];

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock($1)", [MIGRATION_LOCK]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        checksum text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const name of files) {
      const sql = await readFile(join(migrationsDir, name), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");

      const existing = await client.query<{ checksum: string }>(
        "SELECT checksum FROM schema_migrations WHERE name = $1",
        [name],
      );

      if (existing.rowCount) {
        if (existing.rows[0].checksum !== checksum) {
          throw new Error(
            `Migration ${name} changed after it was applied. Create a new migration instead of editing this one.`,
          );
        }
        skipped.push(name);
        continue;
      }

      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (name, checksum) VALUES ($1, $2)",
        [name, checksum],
      );
      applied.push(name);
    }

    await client.query("COMMIT");
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch {
      // Keep the original migration error.
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }

  for (const name of applied) logger(`applied  ${name}`);
  for (const name of skipped) logger(`skipped  ${name} (already applied)`);
  logger(`migrations complete: ${applied.length} applied, ${skipped.length} skipped`);

  return { applied, skipped };
}

const invokedDirectly =
  process.argv[1] !== undefined &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error: unknown) => {
      console.error(
        error instanceof Error ? error.message : "Migration failed unexpectedly.",
      );
      process.exit(1);
    });
}
