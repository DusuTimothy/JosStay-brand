import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChatFallback } from "@/components/booking/chat-fallback";
import { ReceiptPoller } from "@/components/booking/receipt-poller";

export const metadata: Metadata = {
  title: "Booking confirmation",
  description: "Your JosStay booking receipt, address and map pin.",
};

export default async function ConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string | string[] }>;
}) {
  const { reference } = await searchParams;
  const bookingReference = Array.isArray(reference) ? reference[0] : reference;

  return (
    <div className="mx-auto max-w-[720px] px-4 pb-24 pt-10 sm:px-6">
      <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
        JosStay booking
      </p>
      <div className="mt-6">
        {bookingReference ? (
          <ReceiptPoller reference={bookingReference} />
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-float">
            <h1 className="text-title text-obsidian">No booking reference</h1>
            <p className="mt-3 text-[0.9375rem] text-zinc-600">
              Open this page from the link in your checkout confirmation. If you
              paid and lost the link, message us and we will find the booking.
            </p>
          </div>
        )}
      </div>
      <div className="mt-4 rounded-xl border border-whatsapp-ink/20 bg-whatsapp-soft p-4">
        <p className="text-[0.875rem] font-semibold text-whatsapp-ink">
          Need help with this booking?
        </p>
        <p className="mt-1 text-[0.8125rem] text-zinc-700">
          One JosStay team handles payment, arrival and any problem during the stay.
        </p>
        <div className="mt-3">
          <ChatFallback compact detail="I need help with my JosStay booking." />
        </div>
      </div>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-1.5 text-[0.875rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to JosStay
      </Link>
    </div>
  );
}
