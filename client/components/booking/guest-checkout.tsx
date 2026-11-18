"use client";

import { useEffect, useState } from "react";
import type { PublicRoom } from "@josstay/shared";
import { ApiError, createBooking, getHotelDetail, initializePayment } from "@/lib/api";
import { naira, toDateOnly } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ChatFallback } from "@/components/booking/chat-fallback";

type Props = {
  staySlug: string;
  guests: number;
  checkIn: Date;
  checkOut: Date;
  totalKobo: number;
  onCancel: () => void;
};

const FIELD =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.875rem] text-obsidian placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";

function message(error: unknown): string {
  if (error instanceof ApiError || error instanceof Error) return error.message;
  return "We could not start checkout. Try again or book by chat.";
}

/**
 * Guest checkout asks for the minimum: name, email and phone. Card, bank and
 * USSD details are collected by Paystack's hosted page, never by this form.
 */
export function GuestCheckout({
  staySlug,
  guests,
  checkIn,
  checkOut,
  totalKobo,
  onCancel,
}: Props) {
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [reference, setReference] = useState("");
  const [holdExpiresAt, setHoldExpiresAt] = useState<Date | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoadingRooms(true);
    getHotelDetail(staySlug)
      .then((detail) => {
        if (!active) return;
        const suitable = detail.rooms.filter((room) => room.sleeps >= guests);
        setRooms(suitable);
        setRoomId(suitable[0]?.id ?? "");
        setError(
          suitable.length === 0
            ? "No live room matches this guest count. Book by chat and we will find one."
            : "",
        );
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setRooms([]);
        setError(
          `${message(cause)} This demo listing has no live hotel record yet — book by chat instead.`,
        );
      })
      .finally(() => {
        if (active) setLoadingRooms(false);
      });
    return () => {
      active = false;
    };
  }, [staySlug, guests]);

  async function continueToPayment() {
    let bookingReference = reference;
    setSubmitting(true);
    setError("");

    try {
      if (!bookingReference) {
        if (!roomId) throw new Error("Choose a room to continue");
        if (!termsAccepted) throw new Error("Accept the booking terms to continue");
        const booking = await createBooking({
          guestName: name,
          guestEmail: email,
          guestPhone: phone,
          hotelSlug: staySlug,
          roomId,
          checkIn: toDateOnly(checkIn),
          checkOut: toDateOnly(checkOut),
          guests,
          termsAccepted: true,
          whatsappOptIn,
        });
        bookingReference = booking.reference;
        setReference(bookingReference);
        setHoldExpiresAt(booking.holdExpiresAt);
      }

      const payment = await initializePayment(bookingReference);
      // Hosted checkout: no card field ever renders in this app.
      window.location.assign(payment.authorizationUrl);
    } catch (cause: unknown) {
      setError(message(cause));
      setSubmitting(false);
    }
  }

  return (
    <form
      className="mt-3 rounded-xl border border-pine-200 bg-pine-50/60 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        void continueToPayment();
      }}
    >
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[0.9375rem] font-bold text-obsidian">Guest checkout</p>
        <button
          type="button"
          onClick={onCancel}
          className="text-[0.75rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          Back to dates
        </button>
      </div>
      <p className="mt-1 text-[0.75rem] leading-snug text-zinc-600">
        Total {naira(totalKobo / 100)} · all-in. Card, bank transfer or USSD are
        collected on Paystack's hosted page.
      </p>

      {loadingRooms ? (
        <p className="mt-3 text-[0.8125rem] text-zinc-600">Checking live rooms…</p>
      ) : rooms.length > 0 ? (
        <label className="mt-3 block text-[0.75rem] font-semibold text-zinc-700">
          Room
          <select
            value={roomId}
            onChange={(event) => setRoomId(event.target.value)}
            className={FIELD}
            disabled={Boolean(reference)}
          >
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} · sleeps {room.sleeps}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <div className="mt-3 space-y-3">
        <label className="block text-[0.75rem] font-semibold text-zinc-700">
          Full name
          <input
            className={FIELD}
            type="text"
            required
            minLength={2}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="As on your ID"
            disabled={Boolean(reference)}
          />
        </label>
        <label className="block text-[0.75rem] font-semibold text-zinc-700">
          Email for your confirmation
          <input
            className={FIELD}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            disabled={Boolean(reference)}
          />
        </label>
        <label className="block text-[0.75rem] font-semibold text-zinc-700">
          Phone
          <input
            className={FIELD}
            type="tel"
            required
            pattern="^\+?[0-9][0-9\s-]{6,19}$"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234 800 000 0000"
            disabled={Boolean(reference)}
          />
        </label>
      </div>

      <label className="mt-3 flex items-start gap-2 text-[0.75rem] leading-snug text-zinc-700">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-pine-800"
          checked={whatsappOptIn}
          onChange={(event) => setWhatsappOptIn(event.target.checked)}
          disabled={Boolean(reference)}
        />
        Also send my booking details on WhatsApp (no hotel phone number).
      </label>
      <label className="mt-2 flex items-start gap-2 text-[0.75rem] leading-snug text-zinc-700">
        <input
          type="checkbox"
          className="mt-0.5 size-4 accent-pine-800"
          required
          checked={termsAccepted}
          onChange={(event) => setTermsAccepted(event.target.checked)}
          disabled={Boolean(reference)}
        />
        I accept the booking terms and the chosen cancellation policy.
      </label>

      {reference ? (
        <p className="mt-3 rounded-md bg-white px-3 py-2 text-[0.75rem] leading-snug text-zinc-700">
          Booking <span className="font-bold tabular">{reference}</span> is held.
          Complete hosted checkout to confirm it
          {holdExpiresAt ? ` before ${holdExpiresAt.toLocaleTimeString("en-NG")}` : ""}.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-3 text-[0.75rem] leading-snug text-danger">
          {error}
        </p>
      ) : null}

      <Button
        size="lg"
        full
        type="submit"
        className="mt-3"
        disabled={submitting || loadingRooms || (!reference && (!roomId || !termsAccepted))}
      >
        {submitting
          ? "Opening hosted checkout…"
          : reference
            ? "Continue to payment"
            : "Continue to payment"}
      </Button>

      <div className="mt-2">
        <ChatFallback compact />
      </div>
      <p className="mt-2 text-center text-[0.6875rem] leading-snug text-zinc-500">
        No card details on this site. The hotel phone is emailed after confirmation.
      </p>
    </form>
  );
}
