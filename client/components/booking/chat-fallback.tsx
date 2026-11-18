import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

/** One chat door, with the same label at every step of the guest flow. */
export function chatHref(detail?: string): string {
  const text = ["Hi JosStay — I'd like to book or ask about a stay in Jos.", detail]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function ChatFallback({
  detail,
  compact = false,
}: {
  detail?: string;
  compact?: boolean;
}) {
  return (
    <a
      href={chatHref(detail)}
      target="_blank"
      rel="noopener noreferrer"
      className={
        compact
          ? "inline-flex items-center justify-center gap-1.5 text-[0.8125rem] font-semibold text-whatsapp-ink underline-offset-4 hover:underline"
          : "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md border border-whatsapp-ink/25 bg-whatsapp-soft text-[0.875rem] font-semibold text-whatsapp-ink transition-colors hover:bg-[#d7f3e4]"
      }
    >
      <MessageCircle className="size-4" aria-hidden="true" />
      Book by chat with JosStay
    </a>
  );
}
