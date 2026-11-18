import { z } from "zod";

/** Configuration shared by the whole platform. Per-hotel values live in the database. */
export const EnvSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "staging", "production"])
      .default("development"),
    PORT: z.coerce.number().int().min(1).max(65535).default(10000),
    API_BASE_URL: z.url().default("http://localhost:10000"),
    FRONTEND_URL: z.url().default("http://localhost:4300"),
    ALLOWED_ORIGINS: z.string().min(1).default("http://localhost:4300"),
    LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug"),
    DATABASE_URL: z.string().min(1).optional(),
    REDIS_URL: z.string().min(1).optional(),
    PAYSTACK_SECRET_KEY: z.string().min(1).optional(),
    PAYSTACK_ENV: z.enum(["test", "live"]).default("test"),
  })
  .superRefine((value, ctx) => {
    const key = value.PAYSTACK_SECRET_KEY;
    if (!key) return;

    const expected = value.PAYSTACK_ENV === "live" ? "sk_live_" : "sk_test_";
    const wrong = value.PAYSTACK_ENV === "live" ? "sk_test_" : "sk_live_";

    if (key.startsWith(wrong)) {
      ctx.addIssue({
        code: "custom",
        path: ["PAYSTACK_SECRET_KEY"],
        message: `PAYSTACK_SECRET_KEY starts with ${wrong} but PAYSTACK_ENV is ${value.PAYSTACK_ENV}`,
      });
    } else if (!key.startsWith(expected)) {
      ctx.addIssue({
        code: "custom",
        path: ["PAYSTACK_SECRET_KEY"],
        message: `PAYSTACK_SECRET_KEY must start with ${expected}`,
      });
    }
  });

export type Env = z.infer<typeof EnvSchema>;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const result = EnvSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid API environment configuration:\n${details}`);
  }
  return result.data;
}

export const env = loadEnv();

export function allowedOrigins(value: Env = env): string[] {
  return value.ALLOWED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}
