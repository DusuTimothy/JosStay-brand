import { cn } from "@/lib/utils";

/** Shimmer placeholder. `animate-pulse` is the fallback; the gradient is GPU-cheap. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-md bg-zinc-200/80 motion-reduce:animate-none",
        className,
      )}
    />
  );
}

export function StayCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3.5 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}
