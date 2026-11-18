import Link from "next/link";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { LogoMark } from "@/components/brand/logo";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-[640px] flex-col items-start px-4 pb-24 pt-20 sm:px-6">
      <div className="flex items-center gap-3">
        <LogoMark className="h-8 w-8" />
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-pine-700">
          Error 404
        </p>
      </div>

      <h1 className="mt-5 text-display text-obsidian">
        This page has checked out.
      </h1>
      <p className="mt-3 text-body text-zinc-600">
        The link is broken or the page moved. Nothing was charged, and your
        booking is unaffected. Here is where to go next.
      </p>

      <div className="mt-6 flex flex-wrap gap-2.5">
        <Link href="/" className={buttonClasses("primary", "md")}>
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to JosStay
        </Link>
        <Link href="/#stays" className={buttonClasses("secondary", "md")}>
          <Search className="size-4" aria-hidden="true" />
          Browse demo stays
        </Link>
      </div>

      <div className="mt-10 w-full rounded-xl border border-zinc-200 bg-white p-5">
        <p className="text-[0.875rem] font-semibold text-obsidian">
          Looking for something specific?
        </p>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-zinc-600">
          Message the booking line with what you need — dates, area and guest
          count — and we will send the closest match. We often have rooms that
          are not listed yet.
        </p>
        <a
          href="https://wa.me/2348000000000?text=Hi%20JosStay%20%E2%80%94%20I%20couldn%27t%20find%20a%20page."
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-pine-800 underline-offset-4 hover:underline"
        >
          <MessageCircle className="size-4" aria-hidden="true" />
          Message the booking team
        </a>
      </div>
    </div>
  );
}
