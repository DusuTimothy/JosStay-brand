import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Clock3, PauseCircle, XCircle } from "lucide-react";
import { Badge, type BadgeTone } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PartnerHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          {eyebrow}
        </p>
        <h1 className="mt-1.5 text-title text-obsidian">{title}</h1>
        <p className="mt-2 max-w-2xl text-[0.875rem] leading-relaxed text-zinc-600">
          {description}
        </p>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function PartnerCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-zinc-200 bg-white shadow-soft", className)}>
      {title || action ? (
        <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <h2 className="font-display text-[0.9375rem] font-bold text-obsidian">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[0.75rem] leading-relaxed text-zinc-500">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function PartnerStat({
  label,
  value,
  note,
  tint = "plain",
}: {
  label: string;
  value: string;
  note: string;
  tint?: "plain" | "pine" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        tint === "pine" && "border-pine-200 bg-pine-50",
        tint === "warning" && "border-[#F5D9B0] bg-[#FEF3E2]",
        tint === "plain" && "border-zinc-200 bg-white",
      )}
    >
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500">
        {label}
      </p>
      <p className="mt-2 font-display text-[1.375rem] font-bold tracking-[-0.02em] text-obsidian">
        {value}
      </p>
      <p className="mt-1 text-[0.75rem] leading-relaxed text-zinc-500">{note}</p>
    </div>
  );
}

const STATUS_STYLES: Record<string, { label: string; tone: BadgeTone; icon: ReactNode }> = {
  confirmed: {
    label: "Confirmed",
    tone: "verified",
    icon: <CheckCircle2 className="size-3" aria-hidden="true" />,
  },
  completed: {
    label: "Completed",
    tone: "neutral",
    icon: <CheckCircle2 className="size-3" aria-hidden="true" />,
  },
  cancelled: {
    label: "Cancelled",
    tone: "unavailable",
    icon: <XCircle className="size-3" aria-hidden="true" />,
  },
  refund_pending: {
    label: "Refund pending",
    tone: "warning",
    icon: <Clock3 className="size-3" aria-hidden="true" />,
  },
  refunded: {
    label: "Refunded",
    tone: "danger",
    icon: <XCircle className="size-3" aria-hidden="true" />,
  },
  paid: {
    label: "Paid",
    tone: "verified",
    icon: <CheckCircle2 className="size-3" aria-hidden="true" />,
  },
  scheduled: {
    label: "Scheduled",
    tone: "warning",
    icon: <Clock3 className="size-3" aria-hidden="true" />,
  },
  active: {
    label: "Active",
    tone: "verified",
    icon: <CheckCircle2 className="size-3" aria-hidden="true" />,
  },
  paused: {
    label: "Paused",
    tone: "unavailable",
    icon: <PauseCircle className="size-3" aria-hidden="true" />,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] ?? {
    label: status,
    tone: "neutral" as BadgeTone,
    icon: <AlertCircle className="size-3" aria-hidden="true" />,
  };
  return (
    <Badge tone={style.tone} size="sm">
      {style.icon}
      {style.label}
    </Badge>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "error" | "success" }) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-lg border px-3 py-2 text-[0.8125rem] leading-relaxed",
        tone === "info" && "border-pine-200 bg-pine-50 text-pine-900",
        tone === "error" && "border-[#F3C9C5] bg-[#FDF3F2] text-danger",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-pine-900",
      )}
    >
      {children}
    </p>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center">
      <p className="font-display text-[0.9375rem] font-bold text-obsidian">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-[0.8125rem] leading-relaxed text-zinc-500">{body}</p>
    </div>
  );
}
