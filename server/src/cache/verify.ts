import { closeRedis, getRedis } from "./redis.js";

const key = `josstay:verify:${process.pid}:${Date.now()}`;

try {
  const redis = await getRedis();
  await redis.set(key, "ok", { EX: 60 });
  const value = await redis.get(key);
  await redis.del(key);

  if (value !== "ok") {
    throw new Error("Redis round-trip returned an unexpected value.");
  }

  console.log("Redis client verified (set, get, delete).");
  await closeRedis();
  process.exit(0);
} catch (error) {
  await closeRedis().catch(() => undefined);
  console.error(error instanceof Error ? error.message : "Redis verification failed.");
  process.exit(1);
}
