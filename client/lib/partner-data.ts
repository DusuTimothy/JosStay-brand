import { PartnerSnapshotSchema, type PartnerSnapshot } from "./partner-contract";
import { SAMPLE_PARTNER_SNAPSHOT } from "./partner-sample-data";

export type { PartnerSnapshot } from "./partner-contract";

/**
 * The only data boundary for the partner dashboard.
 *
 * To connect verified data, replace `partnerDataSource` at the bottom of this
 * file with an API-backed implementation of `PartnerDataSource`. No screen or
 * dashboard component imports the sample snapshot directly.
 */

const STORAGE_KEY = "josstay.partner.snapshot.v1";

export interface PartnerStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface PartnerDataSource {
  readonly id: string;
  readonly label: string;
  load(): Promise<PartnerSnapshot>;
  save(snapshot: PartnerSnapshot): Promise<PartnerSnapshot>;
  reset(): Promise<PartnerSnapshot>;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function parsePartnerSnapshot(value: unknown): PartnerSnapshot {
  return PartnerSnapshotSchema.parse(value);
}

/** A fresh copy of the sample snapshot. Safe to use during server rendering. */
export function initialPartnerSnapshot(): PartnerSnapshot {
  return clone(SAMPLE_PARTNER_SNAPSHOT);
}

export function createLocalPartnerDataSource(storage?: PartnerStorage): PartnerDataSource {
  const memory = new Map<string, string>();

  const fallback: PartnerStorage = {
    getItem: (key) => memory.get(key) ?? null,
    setItem: (key, value) => {
      memory.set(key, value);
    },
    removeItem: (key) => {
      memory.delete(key);
    },
  };

  const resolveStorage = (): PartnerStorage => {
    if (storage) return storage;
    if (typeof window !== "undefined") return window.localStorage;
    return fallback;
  };

  return {
    id: "local-sample",
    label: "Sample snapshot in this browser",
    async load() {
      const raw = resolveStorage().getItem(STORAGE_KEY);
      if (!raw) return initialPartnerSnapshot();
      try {
        return parsePartnerSnapshot(JSON.parse(raw));
      } catch {
        resolveStorage().removeItem(STORAGE_KEY);
        return initialPartnerSnapshot();
      }
    },
    async save(snapshot) {
      const parsed = parsePartnerSnapshot(snapshot);
      resolveStorage().setItem(STORAGE_KEY, JSON.stringify(parsed));
      return clone(parsed);
    },
    async reset() {
      resolveStorage().removeItem(STORAGE_KEY);
      return initialPartnerSnapshot();
    },
  };
}

/** Single swap point. Everything above stays the same when the source changes. */
export const partnerDataSource: PartnerDataSource = createLocalPartnerDataSource();

export function loadPartnerSnapshot(): Promise<PartnerSnapshot> {
  return partnerDataSource.load();
}

export function savePartnerSnapshot(snapshot: PartnerSnapshot): Promise<PartnerSnapshot> {
  return partnerDataSource.save(snapshot);
}

export function resetPartnerSnapshot(): Promise<PartnerSnapshot> {
  return partnerDataSource.reset();
}
