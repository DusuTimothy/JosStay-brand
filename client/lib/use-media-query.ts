"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query. Returns false on the server so markup is stable, then
 * corrects on mount. Used only for layout decisions (months shown, sheet vs
 * popover) — never for content, so the flash is harmless.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
