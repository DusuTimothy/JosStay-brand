import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "2348000000000";

/**
 * Phase-1 AI surface: the box and its disclosure, with no model behind it.
 *
 * Guardrails in 03-AI-FOR-EASE.md apply here: disclose the preview, promise no
 * answer the data cannot support, and keep a human path visible at all times.
 * Search and checkout do not depend on this component.
 */
export function AskJosStay({ className }: { className?: string }) {
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi JosStay — I have a question about a stay in Jos.",
  )}`;

  return (
    <section
      id="ask-josstay"
      aria-labelledby="ask-heading"
      className={cn(
        "scroll-mt-28 rounded-2xl border border-pine-200 bg-pine-50 p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-pine-800 text-white">
            <Sparkles className="size-4" aria-hidden="true" />
          </span>
          <div>
            <h2 id="ask-heading" className="font-display text-[0.9375rem] font-bold text-obsidian">
              Ask JosStay
            </h2>
            <p className="text-[0.75rem] text-zinc-600">Answer box · UI preview</p>
          </div>
        </div>
        <span className="rounded-full bg-[#FEF3E2] px-2 py-0.5 text-[0.6875rem] font-bold text-warning ring-1 ring-inset ring-[#F5D9B0]">
          Not connected yet
        </span>
      </div>

      <p className="mt-3 max-w-2xl text-[0.875rem] leading-relaxed text-zinc-700">
        Planned: ask about power, pricing or a cancellation rule and get an answer
        drawn only from that listing’s own fields. Nothing is answered
        automatically today, and no answer will ever invent a rating, a feature
        or a refund.
      </p>

      <div className="mt-4 max-w-xl">
        <label
          htmlFor="ask-preview"
          className="block text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500"
        >
          Your question — preview only
        </label>
        <input
          id="ask-preview"
          type="text"
          disabled
          placeholder="e.g. When can I cancel for free?"
          className="mt-1.5 h-11 w-full rounded-md border border-zinc-300 bg-zinc-100 px-3 text-[0.875rem] text-zinc-500"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("whatsapp", "sm")}
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Book by chat with JosStay
        </a>
        <span className="text-[0.75rem] leading-snug text-zinc-600">
          A JosStay person answers today. This box is a preview of a later stage.
        </span>
      </div>
    </section>
  );
}
