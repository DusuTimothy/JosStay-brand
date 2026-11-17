"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { buttonClasses } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/#stays", label: "Stays" },
  { href: "/#areas", label: "Neighbourhoods" },
  { href: "/#promise", label: "The JosStay Promise" },
  { href: "/list-your-property", label: "List your property" },
];

/**
 * Sticky header with a two-state shrink.
 *
 * Only two states on purpose: a continuous scroll-linked height animation
 * forces layout work every frame. Two states = two GPU-friendly transitions.
 */
export function SiteHeader() {
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setCondensed(window.scrollY > 24);
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white/85 backdrop-blur-md transition-[height,box-shadow] duration-200 ease-[var(--ease-out-expo)] motion-reduce:transition-none",
        condensed ? "border-zinc-200 shadow-soft" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[1280px] items-center justify-between gap-4 px-4 transition-[height] duration-200 ease-[var(--ease-out-expo)] sm:px-6 lg:px-8 motion-reduce:transition-none",
          condensed ? "h-14" : "h-[4.5rem]",
        )}
      >
        <Link href="/" className="shrink-0 no-tap-highlight" aria-label="JosStay home">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-[0.875rem] font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-obsidian"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-full border border-zinc-300 px-3.5 py-2 text-[0.8125rem] font-semibold text-obsidian transition-colors hover:border-zinc-400 hover:bg-zinc-50 sm:inline-flex"
          >
            <Search className="size-4" aria-hidden="true" />
            Search
          </Link>
          <Link href="/search" className={buttonClasses("primary", "sm", "hidden sm:inline-flex")}>
            Reserve a stay
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex size-11 items-center justify-center rounded-md text-obsidian hover:bg-zinc-100 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-zinc-200 bg-white lg:hidden">
          <nav className="mx-auto max-w-[1280px] px-4 py-4" aria-label="Mobile">
            <ul className="flex flex-col gap-1">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-3 py-3 text-[0.9375rem] font-medium text-obsidian hover:bg-zinc-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
