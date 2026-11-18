"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CalendarDays, Users } from "lucide-react";
import { AREAS } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Sticky search pill.
 *
 * In the demo, the fields are real filters: submitting navigates to /search
 * with the query in the URL, and the results read the same query. The condensed
 * state shows the guest's actual choices, never an invented sample query.
 */
export function SearchPill() {
  const router = useRouter();
  const [condensed, setCondensed] = useState(false);
  const [area, setArea] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [guests, setGuests] = useState(2);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "-72px 0px 0px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const places = AREAS.filter((item) => !item.feature).map((item) => item.name);
  const summary = [
    area === "All" ? "All areas" : area,
    from && to && to > from ? `${from} – ${to}` : from ? `from ${from}` : "Any dates",
    `${guests} guest${guests > 1 ? "s" : ""}`,
  ].join(" · ");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (area !== "All") params.set("area", area);
    if (from) params.set("from", from);
    if (to && from && to > from) params.set("to", to);
    if (guests !== 2) params.set("guests", String(guests));
    const query = params.toString();
    router.push(query ? `/search?${query}` : "/search");
  }

  return (
    <>
      <div ref={sentinel} aria-hidden="true" className="h-px w-full" />

      <div
        className={cn(
          "sticky top-[4.5rem] z-40 mx-auto w-full px-4 transition-[padding,top] duration-200 ease-[var(--ease-out-expo)] sm:px-6 motion-reduce:transition-none",
          condensed ? "pt-2" : "pt-0",
        )}
      >
        <form
          role="search"
          onSubmit={submit}
          className={cn(
            "mx-auto flex items-center rounded-full border border-zinc-200 bg-white shadow-float transition-all duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
            condensed ? "max-w-2xl gap-1 p-1.5" : "max-w-4xl gap-0 p-2",
          )}
        >
          {condensed ? (
            <>
              <span className="inline-flex min-w-0 flex-1 items-center gap-2 rounded-full px-3 py-1.5">
                <Search className="size-4 shrink-0 text-pine-800" aria-hidden="true" />
                <span className="truncate text-[0.8125rem] font-semibold text-obsidian">
                  {summary}
                </span>
              </span>
              <button
                type="submit"
                className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-pine-800 px-4 text-[0.8125rem] font-semibold text-white transition-colors hover:bg-pine-900"
              >
                <Search className="size-3.5" aria-hidden="true" />
                Search
              </button>
            </>
          ) : (
            <>
              <FieldShell icon={<MapPin />} label="Where" grow>
                <select
                  aria-label="Area"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                  className="w-full min-w-0 cursor-pointer truncate bg-transparent pl-0.5 text-[0.8125rem] font-semibold text-obsidian outline-none"
                >
                  <option value="All">All areas</option>
                  {places.map((place) => (
                    <option key={place} value={place}>
                      {place}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <Divider />
              <FieldShell icon={<CalendarDays />} label="Check-in">
                <input
                  type="date"
                  aria-label="Check-in"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className="w-full min-w-0 bg-transparent pl-0.5 text-[0.8125rem] font-semibold text-obsidian outline-none"
                />
              </FieldShell>
              <Divider />
              <FieldShell icon={<CalendarDays />} label="Check-out">
                <input
                  type="date"
                  aria-label="Check-out"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className="w-full min-w-0 bg-transparent pl-0.5 text-[0.8125rem] font-semibold text-obsidian outline-none"
                />
              </FieldShell>
              <Divider />
              <FieldShell icon={<Users />} label="Guests">
                <select
                  aria-label="Guests"
                  value={guests}
                  onChange={(event) => setGuests(Number(event.target.value))}
                  className="w-full min-w-0 cursor-pointer bg-transparent pl-0.5 text-[0.8125rem] font-semibold text-obsidian outline-none"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((count) => (
                    <option key={count} value={count}>
                      {count} guest{count > 1 ? "s" : ""}
                    </option>
                  ))}
                </select>
              </FieldShell>
              <button
                type="submit"
                aria-label="Search stays"
                className="ml-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-pine-800 text-white transition-colors hover:bg-pine-900 active:scale-95 motion-reduce:active:scale-100"
              >
                <Search className="size-4" aria-hidden="true" />
              </button>
            </>
          )}
        </form>

        {!condensed ? (
          <p className="mx-auto mt-2 max-w-4xl text-center text-[0.75rem] text-zinc-500">
            Demo search — filters apply to the four preview stays. Ask JosStay is
            a preview; Book by chat works today.
          </p>
        ) : null}
      </div>
    </>
  );
}

function FieldShell({
  icon,
  label,
  children,
  grow,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  grow?: boolean;
}) {
  return (
    <label
      className={cn(
        "flex min-w-0 flex-col items-start gap-0.5 rounded-full px-4 py-1.5 text-left transition-colors hover:bg-zinc-100",
        grow ? "flex-[1.4]" : "flex-1",
      )}
    >
      <span className="flex items-center gap-1.5 pl-0.5 text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-zinc-500">
        <span className="[&>svg]:size-3 [&>svg]:stroke-[2.5]" aria-hidden="true">
          {icon}
        </span>
        {label}
      </span>
      {children}
    </label>
  );
}

function Divider() {
  return <span aria-hidden="true" className="h-8 w-px shrink-0 bg-zinc-200" />;
}
