import Link from "next/link";
import { CalendarClock } from "lucide-react";
import type { PolicyView } from "@/lib/data";
import { cancellationView } from "@/lib/policy";
import { cn } from "@/lib/utils";

/**
 * Cancellation rule at the decision point. The hotel chose the template; this
 * component only restates it and, when dates are known, names the deadline.
 */
export function PolicyNote({
  policy,
  checkIn,
  compact = false,
}: {
  policy: PolicyView;
  checkIn?: Date;
  compact?: boolean;
}) {
  const view = cancellationView(policy, checkIn);

  return (
    <div className={cn("rounded-xl border border-zinc-200 bg-white", compact ? "p-3" : "p-4")}>
      <p className="flex items-center gap-1.5 text-[0.8125rem] font-bold text-obsidian">
        <CalendarClock className="size-4 text-pine-700" aria-hidden="true" />
        Cancellation · {view.label}
      </p>
      <p className="mt-2 text-[0.875rem] leading-snug text-zinc-700">{view.summary}</p>
      <p className="mt-2 text-[0.8125rem] leading-snug text-zinc-600">
        <span className="font-semibold text-obsidian">Deadline: </span>
        {view.deadline}
      </p>
      {compact ? null : (
        <p className="mt-2 text-[0.75rem] leading-snug text-zinc-500">
          The hotel sets this rule. JosStay shows it before you pay.{" "}
          <Link
            href="#ask-josstay"
            className="font-semibold text-pine-800 underline-offset-4 hover:underline"
          >
            Ask about this rule
          </Link>
        </p>
      )}
    </div>
  );
}
