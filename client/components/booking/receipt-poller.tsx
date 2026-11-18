"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BookingReceipt, BookingStatus } from "@josstay/shared";
import { getBookingReceipt } from "@/lib/api";
import { naira } from "@/lib/format";
import { ChatFallback } from "@/components/booking/chat-fallback";
import { PolicyNote } from "@/components/stay/policy-note";
import { POLICY_VIEWS } from "@/lib/data";

const WAITING: BookingStatus[] = ["draft", "held", "payment_pending"];
const CONFIRMED: BookingStatus[] = ["confirmed", "completed"];
const POLL_MS = 2500;
const MAX_ATTEMPTS = 40;

function watDate(value: string | Date, withTime = false): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit", hour12: false } : {}),
    timeZone: "Africa/Lagos",
  }).format(new Date(value));
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-zinc-100 py-2.5 last:border-0">
      <dt className="text-[0.8125rem] text-zinc-500">{label}</dt>
      <dd className="text-right text-[0.875rem] font-semibold text-obsidian">{value}</dd>
    </div>
  );
}

/**
 * Paystack calls back before the webhook always lands, so the receipt polls by
 * reference. It renders only the reduced receipt contract: address and map pin
 * are public, the hotel phone is never fetched here.
 */
export function ReceiptPoller({ reference }: { reference: string }) {
  const [receipt, setReceipt] = useState<BookingReceipt | null>(null);
  const [error, setError] = useState("");
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;

    async function load() {
      try {
        const data = await getBookingReceipt(reference);
        if (!active) return;
        attempts = 0;
        setReceipt(data);
        setError("");
        if (WAITING.includes(data.status)) {
          timer = setTimeout(() => void load(), POLL_MS);
        }
      } catch (cause) {
        if (!active) return;
        attempts += 1;
        if (attempts >= MAX_ATTEMPTS) {
          setError(
            cause instanceof Error
              ? cause.message
              : "We could not load this booking. Message us and we will find it.",
          );
          setTimedOut(true);
        } else {
          timer = setTimeout(() => void load(), POLL_MS);
        }
      }
    }

    void load();
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
    };
  }, [reference]);

  if (!receipt) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-float">
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-pine-700">
          Booking {reference}
        </p>
        <h1 className="mt-2 text-title text-obsidian">Confirming your payment…</h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-zinc-600">
          Paystack has sent you back to JosStay. We are waiting for the signed
          payment notification before we call this booking confirmed. This page
          updates on its own.
        </p>
        {error ? (
          <p role="alert" className="mt-4 text-[0.875rem] text-danger">
            {error}
          </p>
        ) : null}
        <div className="mt-5">
          <ChatFallback detail={`Please check booking ${reference}.`} />
        </div>
        {timedOut ? (
          <p className="mt-2 text-center text-[0.75rem] text-zinc-500">
            Do not pay twice — message us first.
          </p>
        ) : null}
      </div>
    );
  }

  const confirmed = CONFIRMED.includes(receipt.status);
  const waiting = WAITING.includes(receipt.status);
  const policy = POLICY_VIEWS[receipt.policyTemplate];
  const mapUrl = `https://www.google.com/maps?q=${receipt.lat},${receipt.lng}`;

  return (
    <div className="space-y-4">
      <div
        className={`rounded-2xl border p-6 shadow-float ${
          confirmed
            ? "border-emerald-200 bg-emerald-50"
            : waiting
              ? "border-pine-200 bg-pine-50"
              : "border-amber-200 bg-amber-50"
        }`}
      >
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-pine-700">
          Booking {receipt.reference}
        </p>
        <h1 className="mt-2 text-title text-obsidian">
          {confirmed
            ? "You're booked."
            : waiting
              ? "Payment still confirming…"
              : "This booking is not active."}
        </h1>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-zinc-700">
          {confirmed
            ? "Your room is held and your confirmation email is on its way. The address and map pin are below."
            : waiting
              ? "We are still waiting for Paystack's signed notification. This page updates on its own — please do not pay again."
              : "If you were charged and see this message, message us before trying anything else."}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-float">
        <h2 className="text-section text-obsidian">{receipt.hotelName}</h2>
        <p className="mt-1 text-[0.875rem] text-zinc-600">{receipt.roomName}</p>
        <dl className="mt-4">
          <Detail
            label="Dates"
            value={`${watDate(receipt.checkIn)} – ${watDate(receipt.checkOut)}`}
          />
          <Detail label="Nights" value={receipt.nights} />
          <Detail label="Guests" value={receipt.guests} />
          <Detail label="Total paid (all-in)" value={naira(receipt.totalKobo / 100)} />
          <Detail
            label="Cancellation deadline"
            value={`${watDate(receipt.policyDeadlineAt, true)} WAT`}
          />
          <Detail label="Address" value={receipt.address} />
          <Detail
            label="Map pin"
            value={
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pine-800 underline-offset-4 hover:underline"
              >
                {receipt.lat}, {receipt.lng}
              </a>
            }
          />
        </dl>
        <div className="mt-4">
          <PolicyNote policy={policy} compact />
        </div>
        <p className="mt-4 text-[0.8125rem] leading-snug text-zinc-600">
          The hotel phone is sent only in your confirmation email. Need help
          before that arrives? Book by chat with JosStay.
        </p>
        <div className="mt-3">
          <ChatFallback detail={`I need help with booking ${receipt.reference}.`} />
        </div>
        <Link
          href={`/stays/${receipt.hotelSlug}`}
          className="mt-4 inline-block text-[0.8125rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          Back to the listing
        </Link>
      </div>
    </div>
  );
}
