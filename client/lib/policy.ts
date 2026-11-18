import type { PolicyTemplate } from "@josstay/shared";
import { addDays, formatDateShort } from "@/lib/format";

/**
 * Cancellation copy derived from the hotel's chosen template.
 *
 * This is presentation of a stored rule, never a promise: if the template does
 * not contain a deadline, no deadline is invented. A strict policy has no
 * calendar date until a booking actually exists, so it says so plainly.
 */
export type CancellationView = {
  template: PolicyTemplate;
  label: string;
  summary: string;
  deadline: string;
};

export function cancellationView(
  policy: { template: PolicyTemplate; label: string; summary: string },
  checkIn?: Date,
): CancellationView {
  const deadline = deadlineFor(policy.template, checkIn);
  return {
    template: policy.template,
    label: policy.label,
    summary: policy.summary,
    deadline,
  };
}

function deadlineFor(template: PolicyTemplate, checkIn?: Date): string {
  switch (template) {
    case "flexible":
      return checkIn
        ? `Free cancellation until 24 hours before check-in (${formatDateShort(addDays(checkIn, -1))}).`
        : "Free cancellation until 24 hours before check-in.";
    case "moderate":
      return checkIn
        ? `Free cancellation until 72 hours before check-in (${formatDateShort(addDays(checkIn, -3))}).`
        : "Free cancellation until 72 hours before check-in.";
    case "strict":
      return "Free cancellation until 24 hours after booking. There is no fixed calendar date until a booking exists.";
  }
}
