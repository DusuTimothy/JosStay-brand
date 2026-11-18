import { createClient, type RedisClientType } from "redis";
import { env } from "../env.js";

type RedisClient = RedisClientType;

let client: RedisClient | undefined;
let connecting: Promise<RedisClient> | undefined;

export function redisConfigured(): boolean {
  return Boolean(env.REDIS_URL);
}

/**
 * Lazy Redis connection. Holds and rate limits are optional at boot so local
 * development still works, but callers get a clear error if they use Redis
 * without a URL.
 */
export async function getRedis(): Promise<RedisClient> {
  if (!env.REDIS_URL) {
    throw new Error("REDIS_URL is not set. Configure Redis before using holds or rate limits.");
  }

  if (client?.isOpen) return client;
  return connecting ?? startConnection();
}

function startConnection(): Promise<RedisClient> {
  const next: RedisClient = createClient({ url: env.REDIS_URL as string });

  next.on("error", (error) => {
    console.error(
      `Redis client error: ${error instanceof Error ? error.message : String(error)}`,
    );
  });

  const pending = next
    .connect()
    .then(() => {
      client = next;
      return next;
    })
    .catch((error: unknown) => {
      connecting = undefined;
      throw error;
    });

  connecting = pending;
  return pending;
}

export async function closeRedis(): Promise<void> {
  if (connecting) {
    await connecting.catch(() => undefined);
    connecting = undefined;
  }

  if (client?.isOpen) {
    await client.quit();
  }

  client = undefined;
}
