import { HttpError } from "../api/errors.js";
import { env } from "../env.js";

export type PaymentChannel = "card" | "bank" | "ussd";

export type InitializePaymentInput = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  subaccountCode: string;
  bearer: "subaccount";
  percentageCharge: number;
  metadata: Record<string, unknown>;
  channels: PaymentChannel[];
};

export type InitializePaymentResult = {
  authorizationUrl: string;
  reference: string;
};

export interface PaymentClient {
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
}

function requireSecret(): string {
  if (!env.PAYSTACK_SECRET_KEY) {
    throw new HttpError(503, "Paystack is not configured");
  }
  return env.PAYSTACK_SECRET_KEY;
}

/**
 * Hosted checkout only. Card data never reaches this API.
 * The split fields follow the locked 17 November decision: the hotel bears the
 * Paystack fee and JosStay receives the fixed commission.
 */
async function initializeWithPaystack(
  input: InitializePaymentInput,
): Promise<InitializePaymentResult> {
  const response = await fetch(`${env.PAYSTACK_API_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: input.amountKobo,
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
      channels: input.channels,
      subaccount: input.subaccountCode,
      bearer: input.bearer,
      percentage_charge: input.percentageCharge,
    }),
  });

  if (!response.ok) {
    throw new HttpError(502, "Payment provider rejected the request");
  }

  const payload = (await response.json()) as {
    status?: boolean;
    data?: { authorization_url?: string; reference?: string };
  };
  const authorizationUrl = payload.data?.authorization_url;
  if (!payload.status || typeof authorizationUrl !== "string" || !authorizationUrl) {
    throw new HttpError(502, "Payment provider returned an invalid response");
  }

  return {
    authorizationUrl,
    reference: payload.data?.reference ?? input.reference,
  };
}

export const paystackClient: PaymentClient = {
  initialize: initializeWithPaystack,
};
