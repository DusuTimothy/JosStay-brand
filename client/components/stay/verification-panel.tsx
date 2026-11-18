import type { Stay } from "@/lib/data";
import { DemoPill } from "@/components/ui/demo-pill";

/**
 * The record a guest reads before paying.
 *
 * Every field is either grounded in the listing data or explicitly marked as
 * missing. Demo listings have no agent report, so no date, name or pass result
 * is shown — the empty slots are the point, not a design flourish.
 */
export function VerificationPanel({ stay }: { stay: Stay }) {
  const rows: [string, string][] = [
    ["Last inspected", stay.verification.inspectedAt ?? "Not on file"],
    ["Agent report", stay.verification.status ?? "None — no report exists"],
    ["Photos", `${stay.photos.length} illustrative images`],
    ["Power", stay.power],
    ["Security", stay.security],
    ["Cancellation template", stay.policy.label],
  ];

  return (
    <section aria-labelledby="verification-heading">
      <h2 id="verification-heading" className="text-section text-obsidian">
        Verification record
      </h2>
      <p className="mt-1.5 text-[0.875rem] text-zinc-600">
        A real listing shows the signed agent report here with its date and any
        open issues. This demo has no agent report, so those fields stay empty.
      </p>

      <dl className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {rows.map(([key, value], index) => (
          <div
            key={key}
            className={`flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6 ${
              index > 0 ? "border-t border-zinc-100" : ""
            }`}
          >
            <dt className="text-[0.8125rem] text-zinc-500">{key}</dt>
            <dd className="text-[0.875rem] font-semibold text-obsidian sm:text-right">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <DemoPill />
        <span className="text-[0.75rem] leading-snug text-zinc-500">
          {stay.verification.note}
        </span>
      </div>
    </section>
  );
}
