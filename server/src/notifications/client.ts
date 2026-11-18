import { env } from "../env.js";
import type { ConfirmationMessage, NotificationClient } from "./types.js";

function redactedSummary(message: ConfirmationMessage): Record<string, unknown> {
  return {
    kind: message.kind,
    bookingReference: message.bookingReference,
    hotelPhoneIncluded:
      message.kind === "guest-email" ? message.hotelPhoneIncluded : false,
    guestContactIncluded: message.kind === "hotel-email" ? false : undefined,
  };
}

async function sendEmail(message: Extract<ConfirmationMessage, { kind: "guest-email" | "hotel-email" }>) {
  await fetch("https://api.brevo.com/v3/send", {
    method: "POST",
    headers: {
      "api-key": env.BREVO_API_KEY as string,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      sender: {
        name: env.BREVO_SENDER_NAME,
        email: env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: message.to }],
      subject: message.subject,
      textContent: message.text,
    }),
  }).then((response) => {
    if (!response.ok) throw new Error(`Email provider rejected ${message.kind}`);
  });
}

async function sendWhatsApp(message: Extract<ConfirmationMessage, { kind: "guest-whatsapp" }>) {
  await fetch(
    `https://graph.facebook.com/${env.WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_ACCESS_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: message.to,
        type: "text",
        text: { body: message.text },
      }),
    },
  ).then((response) => {
    if (!response.ok) throw new Error("WhatsApp provider rejected the message");
  });
}

/**
 * Production adapter. With no credentials configured it records a redacted
 * line instead of sending, so a local or staging build cannot email a guest.
 * The demo checks use an injected in-memory client and inspect real payloads.
 */
export const notificationClient: NotificationClient = {
  async send(message) {
    if (message.kind === "guest-whatsapp") {
      if (!env.WHATSAPP_ACCESS_TOKEN || !env.WHATSAPP_PHONE_NUMBER_ID) {
        console.info("[notification:suppressed]", JSON.stringify(redactedSummary(message)));
        throw new Error("WhatsApp provider is not configured");
      }
      await sendWhatsApp(message);
      return;
    }

    if (!env.BREVO_API_KEY || !env.BREVO_SENDER_EMAIL) {
      console.info("[notification:suppressed]", JSON.stringify(redactedSummary(message)));
      throw new Error("Email provider is not configured");
    }
    await sendEmail(message);
  },
};
