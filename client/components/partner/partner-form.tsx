"use client";

import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const AREAS = ["Rayfield", "Lamingo", "Little Rayfield", "Bukuru", "Bodija", "Other"];

/**
 * Partner intake.
 *
 * Deliberately short. Every extra field on a supplier form reduces completion,
 * and we can qualify on the call. In production this posts to the partner API
 * and creates a lead in the CRM; here it confirms locally.
 */
export function PartnerForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 sm:p-8">
        <span className="inline-flex size-10 items-center justify-center rounded-full bg-emerald-500 text-obsidian">
          <Check className="size-5" aria-hidden="true" />
        </span>
        <h3 className="mt-4 font-display text-xl font-bold text-pine-900">
          Application received.
        </h3>
        <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-pine-900/80">
          A member of the JosStay partnerships team will call the number you gave
          within one business day. We'll ask about the property, power and
          security, then book an inspection if it's a fit.
        </p>
        <p className="mt-3 text-[0.8125rem] text-pine-900/60">
          Nothing is published and no contract is signed until after the
          inspection.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-raised sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name">
          <input
            required
            name="name"
            autoComplete="name"
            placeholder="e.g. Grace Danjuma"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-[0.875rem] text-obsidian outline-none placeholder:text-zinc-400 focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
          />
        </Field>

        <Field label="Phone (WhatsApp)">
          <input
            required
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0803 000 0000"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-[0.875rem] text-obsidian outline-none placeholder:text-zinc-400 focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
          />
        </Field>

        <Field label="Area">
          <select
            name="area"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-[0.875rem] text-obsidian outline-none focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
          >
            {AREAS.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </Field>

        <Field label="Bedrooms">
          <select
            name="bedrooms"
            className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-[0.875rem] text-obsidian outline-none focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
          >
            {["1", "2", "3", "4", "5+"].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label="Power situation">
            <select
              name="power"
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-[0.875rem] text-obsidian outline-none focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
            >
              {[
                "Solar + inverter (24/7)",
                "Generator + inverter",
                "Generator only",
                "Grid only",
                "Not sure",
              ].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Anything we should know? (optional)">
            <textarea
              name="notes"
              rows={3}
              placeholder="Furnishing, current listing links, security, parking…"
              className="w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-[0.875rem] text-obsidian outline-none placeholder:text-zinc-400 focus:border-pine-600 focus:ring-2 focus:ring-emerald-500/30"
            />
          </Field>
        </div>
      </div>

      <Button type="submit" size="lg" full className="mt-5">
        Apply for inspection
        <ArrowRight className="size-4" aria-hidden="true" />
      </Button>
      <p className="mt-2.5 text-center text-[0.75rem] leading-snug text-zinc-500">
        No listing fees. We only earn when a guest books. Your name is never
        published.
      </p>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.75rem] font-semibold text-zinc-700">{label}</span>
      {children}
    </label>
  );
}
