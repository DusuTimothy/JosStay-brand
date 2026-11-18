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

export type RefundPaymentInput = {
  /** The original hosted-checkout reference. */
  transactionReference: string;
  /** Our unique provider reference for this refund attempt. */
  reference: string;
  amountKobo: number;
  reason: string;
};

export type RefundPaymentResult = {
  providerRefundId: string;
  status: "processing" | "completed";
  /**
   * Provider-reported non-refundable processing fee. Zero when the provider
   * does not expose a figure in the refund response; reconciliation must fill
   * the gap from the settlement report before launch.
   */
  feeLostKobo: number;
};

export interface PaymentClient {
  initialize(input: InitializePaymentInput): Promise<InitializePaymentResult>;
  refund(input: RefundPaymentInput): Promise<RefundPaymentResult>;
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

function parseRefundStatus(value: unknown): "processing" | "completed" {
  if (value === "processed" || value === "completed" || value === "success") {
    return "completed";
  }
  if (value === "pending" || value === "processing") return "processing";
  throw new HttpError(502, "Payment provider returned an unknown refund status");
}

/**
 * Paystack reverses both split shares while funds remain with Paystack. When
 * the hotel has already been paid out, its share is handled by JosStay's
 * recovery task rather than by this call. No card data reaches this API.
 */
async function refundWithPaystack(
  input: RefundPaymentInput,
): Promise<RefundPaymentResult> {
  const response = await fetch(`${env.PAYSTACK_API_BASE}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${requireSecret()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction: input.transactionReference,
      amount: input.amountKobo,
      currency: "NGN",
      reference: input.reference,
      reason: input.reason,
    }),
  });

  if (!response.ok) {
    throw new HttpError(502, "Payment provider rejected the refund");
  }

  const payload = (await response.json()) as {
    status?: boolean;
    data?: {
      id?: string | number;
      reference?: string;
      status?: string;
      fee_lost_kobo?: number | string;
    };
  };
  const data = payload.data;
  const providerRefundId = data?.reference ?? String(data?.id ?? "");
  if (!payload.status || !providerRefundId || providerRefundId === "undefined") {
    throw new HttpError(502, "Payment provider returned an invalid refund response");
  }

  const reportedFee = data?.fee_lost_kobo ?? 0;
  const feeLostKobo = Number(reportedFee);
  if (!Number.isInteger(feeLostKobo) || feeLostKobo < 0) {
    throw new HttpError(502, "Payment provider returned an invalid refund fee");
  }

  return {
    providerRefundId,
    status: parseRefundStatus(data?.status),
    feeLostKobo,
  };
}

export const paystackClient: PaymentClient = {
  initialize: initializeWithPaystack,
  refund: refundWithPaystack,
};
