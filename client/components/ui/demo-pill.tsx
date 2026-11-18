import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * One unmistakable marker for content that is not a real, inspected listing.
 * Uses the existing warning tone so it never reads as a trust signal.
 */
export function DemoPill({
  label = "Demo listing",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-[#FEF3E2] px-2 py-0.5 text-[0.6875rem] font-bold text-warning ring-1 ring-inset ring-[#F5D9B0]",
        className,
      )}
    >
      <Info className="size-3" aria-hidden="true" />
      {label}
    </span>
  );
}
