"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { usePartnerData } from "@/components/partner/partner-data-provider";
import {
  EmptyState,
  Notice,
  PartnerCard,
  PartnerHeading,
} from "@/components/partner/partner-ui";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  addDaysToDateOnly,
  formatDate,
  includesNight,
  monthDates,
  monthFromDateOnly,
  monthLabel,
  shiftMonth,
} from "@/lib/partner-view";

type FormMessage = { tone: "info" | "error" | "success"; text: string } | null;

export function PartnerCalendar() {
  const { snapshot, selectedHotel, addBlock, removeBlock, isSample } = usePartnerData();
  const generatedDate = snapshot.generatedAt.slice(0, 10);
  const [month, setMonth] = useState(() => monthFromDateOnly(generatedDate));
  const [roomFilter, setRoomFilter] = useState("all");
  const [formRoom, setFormRoom] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState<FormMessage>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setMonth(monthFromDateOnly(generatedDate));
  }, [generatedDate]);

  useEffect(() => {
    setRoomFilter("all");
    setFormRoom(selectedHotel?.rooms[0]?.id ?? "");
    setMessage(null);
  }, [selectedHotel?.id, selectedHotel?.rooms]);

  const dates = useMemo(() => monthDates(month.year, month.month), [month]);
  const visibleRooms =
    roomFilter === "all"
      ? (selectedHotel?.rooms ?? [])
      : (selectedHotel?.rooms.filter((room) => room.id === roomFilter) ?? []);
  const visibleRoomIds = new Set(visibleRooms.map((room) => room.id));

  if (!selectedHotel) {
    return <EmptyState title="No property in this snapshot" body="Reset the sample data to continue." />;
  }

  const blockRoomId = formRoom || selectedHotel.rooms[0]?.id || "";
  const blocks = [...selectedHotel.blocks].sort((a, b) => a.from.localeCompare(b.from));

  async function handleAddBlock(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const result = await addBlock(selectedHotel!.id, {
      roomId: blockRoomId,
      from,
      to,
      reason,
    });
    setBusy(false);
    if (!result.ok) {
      setMessage({ tone: "error", text: result.reason });
      return;
    }
    setFrom("");
    setTo("");
    setReason("");
    setMessage({ tone: "success", text: "Block added to this browser's sample snapshot." });
  }

  async function handleRemoveBlock(blockId: string) {
    const result = await removeBlock(selectedHotel!.id, blockId);
    setMessage(
      result.ok
        ? { tone: "success", text: "Block removed from the sample snapshot." }
        : { tone: "error", text: result.reason },
    );
  }

  function dayInfo(day: string) {
    const bookings = selectedHotel!.bookings.filter(
      (booking) =>
        (booking.status === "confirmed" || booking.status === "completed") &&
        visibleRoomIds.has(booking.roomId) &&
        includesNight(day, booking.checkIn, booking.checkOut),
    );
    const dayBlocks = selectedHotel!.blocks.filter(
      (block) => visibleRoomIds.has(block.roomId) && includesNight(day, block.from, block.to),
    );
    const activeRooms = visibleRooms.filter((room) => room.status === "active").length;
    return { bookings, dayBlocks, activeRooms };
  }

  return (
    <>
      <PartnerHeading
        eyebrow="Calendar"
        title="Availability and blocks"
        description="Nights are shown check-in inclusive, check-out exclusive. Blocks are a local sample action and never overwrite a live booking."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="icon"
              aria-label="Previous month"
              onClick={() => setMonth((current) => shiftMonth(current, -1))}
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </Button>
            <span className="min-w-[9.5rem] text-center font-display text-[0.9375rem] font-bold text-obsidian">
              {monthLabel(month.year, month.month)}
            </span>
            <Button
              variant="secondary"
              size="icon"
              aria-label="Next month"
              onClick={() => setMonth((current) => shiftMonth(current, 1))}
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        }
      />

      {isSample ? (
        <Notice tone="info">
          Sample calendar. Changing rooms or blocks saves only in this browser and can be undone with
          “Reset sample” in the top bar.
        </Notice>
      ) : null}

      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-[0.75rem] text-zinc-600">
        <span className="font-semibold text-obsidian">Filter</span>
        <label className="flex items-center gap-2">
          Room
          <select
            value={roomFilter}
            onChange={(event) => setRoomFilter(event.target.value)}
            className="rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-[0.8125rem] text-obsidian"
          >
            <option value="all">All rooms</option>
            {selectedHotel.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </label>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-pine-800" /> Booked night
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-[#F5D9B0]" /> Blocked night
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-zinc-200" /> Open
        </span>
      </div>

      <PartnerCard title="Month view" description="Six fixed weeks keep the layout stable across months.">
        <div className="overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-7 gap-1.5">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="pb-1 text-center text-[0.6875rem] font-bold uppercase tracking-[0.08em] text-zinc-500"
                >
                  {day}
                </div>
              ))}
              {dates.map((day) => {
                const { bookings, dayBlocks, activeRooms } = dayInfo(day);
                const inMonth = day.slice(0, 7) === `${month.year}-${String(month.month + 1).padStart(2, "0")}`;
                const title = [
                  formatDate(day),
                  bookings.length > 0 ? `${bookings.length} booked night(s)` : "No bookings",
                  dayBlocks.length > 0 ? `${dayBlocks.length} block(s)` : "No blocks",
                ].join(" · ");
                return (
                  <div
                    key={day}
                    title={title}
                    className={cn(
                      "min-h-[84px] rounded-lg border p-2",
                      inMonth ? "border-zinc-200 bg-white" : "border-zinc-100 bg-zinc-50/70",
                      dayBlocks.length > 0 && "border-[#F5D9B0] bg-[#FFFCF7]",
                      bookings.length > 0 && dayBlocks.length === 0 && "border-pine-200 bg-pine-50/60",
                    )}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          "text-[0.75rem] font-bold",
                          inMonth ? "text-obsidian" : "text-zinc-400",
                        )}
                      >
                        {Number(day.slice(8, 10))}
                      </span>
                      {bookings.length > 0 ? (
                        <span className="size-2 rounded-full bg-pine-800" aria-hidden="true" />
                      ) : dayBlocks.length > 0 ? (
                        <span className="size-2 rounded-full bg-[#F5D9B0]" aria-hidden="true" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[0.6875rem] font-semibold text-zinc-700">
                      {bookings.length > 0
                        ? `${bookings.length} booked`
                        : dayBlocks.length > 0
                          ? "Blocked"
                          : activeRooms > 0
                            ? "Open"
                            : "No active rooms"}
                    </p>
                    {dayBlocks.length > 0 ? (
                      <p className="mt-0.5 truncate text-[0.6875rem] text-warning">
                        {dayBlocks[0]?.reason}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PartnerCard>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
        <PartnerCard
          title="Add a block"
          description="Owner use or front-desk holds. Overlaps with live bookings are refused."
        >
          <form onSubmit={handleAddBlock} className="space-y-3">
            {message ? <Notice tone={message.tone}>{message.text}</Notice> : null}
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-[0.75rem] font-semibold text-zinc-600">
                Room
                <select
                  value={blockRoomId}
                  onChange={(event) => setFormRoom(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal text-obsidian"
                >
                  {selectedHotel.rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-[0.75rem] font-semibold text-zinc-600">
                Reason
                <input
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={80}
                  placeholder="Owner use"
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal text-obsidian"
                />
              </label>
              <label className="text-[0.75rem] font-semibold text-zinc-600">
                From
                <input
                  type="date"
                  value={from}
                  min={generatedDate}
                  onChange={(event) => setFrom(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal text-obsidian"
                />
              </label>
              <label className="text-[0.75rem] font-semibold text-zinc-600">
                To (check-out)
                <input
                  type="date"
                  value={to}
                  min={from ? addDaysToDateOnly(from, 1) : addDaysToDateOnly(generatedDate, 1)}
                  onChange={(event) => setTo(event.target.value)}
                  className="mt-1.5 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-[0.8125rem] font-normal text-obsidian"
                />
              </label>
            </div>
            <Button type="submit" disabled={busy || !blockRoomId}>
              <CalendarDays className="size-4" aria-hidden="true" />
              {busy ? "Adding…" : "Add block"}
            </Button>
          </form>
        </PartnerCard>

        <PartnerCard title="Current blocks" description="Sample blocks can be removed here.">
          {blocks.length === 0 ? (
            <EmptyState title="No blocks yet" body="Add an owner-use or front-desk hold to see it here." />
          ) : (
            <ul className="divide-y divide-zinc-100">
              {blocks.map((block) => (
                <li key={block.id} className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-[0.8125rem] font-semibold text-obsidian">{block.reason}</p>
                    <p className="mt-0.5 text-[0.75rem] text-zinc-500">
                      {selectedHotel.rooms.find((room) => room.id === block.roomId)?.name ?? block.roomId}
                      {" · "}
                      {formatDate(block.from)} – {formatDate(block.to)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${block.reason} block`}
                    onClick={() => handleRemoveBlock(block.id)}
                    className="size-8 text-zinc-500 hover:text-danger"
                  >
                    <Trash2 className="size-4" aria-hidden="true" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </PartnerCard>
      </div>
    </>
  );
}
