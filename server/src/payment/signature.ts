import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "../env.js";

/** Paystack signs the exact raw request bytes with the secret key (HMAC-SHA512 hex). */
export function verifyPaystackSignature(
  rawBody: Buffer,
  signatureHeader: string | undefined,
): boolean {
  if (!env.PAYSTACK_SECRET_KEY || !signatureHeader) return false;

  const expected = createHmac("sha512", env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  const expectedBytes = Buffer.from(expected, "utf8");
  const receivedBytes = Buffer.from(signatureHeader, "utf8");
  if (expectedBytes.length !== receivedBytes.length) return false;

  return timingSafeEqual(expectedBytes, receivedBytes);
}
