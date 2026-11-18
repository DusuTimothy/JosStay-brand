"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { PolicyTemplateSchema } from "@josstay/shared";
import type { PolicyTemplate } from "@josstay/shared";
import type { PartnerHotel, PartnerRoomStatus } from "@/lib/partner-contract";
import {
  initialPartnerSnapshot,
  loadPartnerSnapshot,
  resetPartnerSnapshot,
  savePartnerSnapshot,
  type PartnerSnapshot,
} from "@/lib/partner-data";
import { overlaps } from "@/lib/partner-view";

const INITIAL = initialPartnerSnapshot();

export type MutationResult = { ok: true } | { ok: false; reason: string };

export type PartnerBlockInput = {
  roomId: string;
  from: string;
  to: string;
  reason: string;
};

type HotelUpdate =
  | { ok: true; hotel: PartnerHotel }
  | { ok: false; reason: string };

type PartnerDataContextValue = {
  snapshot: PartnerSnapshot;
  selectedHotel: PartnerHotel | null;
  selectedHotelId: string;
  selectHotel: (hotelId: string) => void;
  loading: boolean;
  error: string | null;
  savedAt: string | null;
  isSample: boolean;
  resetSampleData: () => Promise<MutationResult>;
  setRoomStatus: (
    hotelId: string,
    roomId: string,
    status: PartnerRoomStatus,
  ) => Promise<MutationResult>;
  updateRoomPrice: (
    hotelId: string,
    roomId: string,
    nightlyNaira: number,
  ) => Promise<MutationResult>;
  addBlock: (hotelId: string, input: PartnerBlockInput) => Promise<MutationResult>;
  removeBlock: (hotelId: string, blockId: string) => Promise<MutationResult>;
  updatePolicy: (hotelId: string, template: PolicyTemplate) => Promise<MutationResult>;
  updateHouseRules: (hotelId: string, rules: string[]) => Promise<MutationResult>;
};

const PartnerDataContext = createContext<PartnerDataContextValue | null>(null);

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;
const fail = (reason: string): HotelUpdate => ({ ok: false, reason });
const ok = (hotel: PartnerHotel): HotelUpdate => ({ ok: true, hotel });

export function PartnerDataProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState<PartnerSnapshot>(INITIAL);
  const [selectedHotelId, setSelectedHotelId] = useState(INITIAL.hotels[0]?.id ?? "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadPartnerSnapshot()
      .then((loaded) => {
        if (!active) return;
        setSnapshot(loaded);
        setSelectedHotelId((current) =>
          loaded.hotels.some((hotel) => hotel.id === current)
            ? current
            : (loaded.hotels[0]?.id ?? ""),
        );
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setError("The sample snapshot could not be loaded. Showing the untouched sample.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const commit = useCallback(
    async (hotelId: string, update: (hotel: PartnerHotel) => HotelUpdate): Promise<MutationResult> => {
      const hotel = snapshot.hotels.find((candidate) => candidate.id === hotelId);
      if (!hotel) return { ok: false, reason: "That property is not in this snapshot." };

      const outcome = update(hotel);
      if (!outcome.ok) return { ok: false, reason: outcome.reason };

      const next: PartnerSnapshot = {
        ...snapshot,
        hotels: snapshot.hotels.map((candidate) =>
          candidate.id === hotelId ? outcome.hotel : candidate,
        ),
      };
      setSnapshot(next);
      try {
        const saved = await savePartnerSnapshot(next);
        setSnapshot(saved);
        setSavedAt(new Date().toISOString());
        return { ok: true };
      } catch {
        return { ok: false, reason: "Saved in this tab only — browser storage is unavailable." };
      }
    },
    [snapshot],
  );

  const setRoomStatus = useCallback(
    (hotelId: string, roomId: string, status: PartnerRoomStatus) =>
      commit(hotelId, (hotel) => {
        if (!hotel.rooms.some((room) => room.id === roomId)) {
          return fail("That room is not in this property.");
        }
        return ok({
          ...hotel,
          rooms: hotel.rooms.map((room) => (room.id === roomId ? { ...room, status } : room)),
        });
      }),
    [commit],
  );

  const updateRoomPrice = useCallback(
    (hotelId: string, roomId: string, nightlyNaira: number) =>
      commit(hotelId, (hotel) => {
        if (!Number.isFinite(nightlyNaira) || nightlyNaira <= 0) {
          return fail("Enter a nightly price greater than zero.");
        }
        if (!hotel.rooms.some((room) => room.id === roomId)) {
          return fail("That room is not in this property.");
        }
        return ok({
          ...hotel,
          rooms: hotel.rooms.map((room) =>
            room.id === roomId ? { ...room, nightlyKobo: Math.round(nightlyNaira * 100) } : room,
          ),
        });
      }),
    [commit],
  );

  const addBlock = useCallback(
    (hotelId: string, input: PartnerBlockInput) =>
      commit(hotelId, (hotel) => {
        if (!hotel.rooms.some((room) => room.id === input.roomId)) {
          return fail("Choose a room in this property.");
        }
        if (!DATE_ONLY.test(input.from) || !DATE_ONLY.test(input.to)) {
          return fail("Choose both a start and an end date.");
        }
        if (input.from >= input.to) {
          return fail("The end date must be after the start date.");
        }
        if (!input.reason.trim()) {
          return fail("Give the block a short reason.");
        }
        const liveBookingOverlap = hotel.bookings.some(
          (booking) =>
            booking.status !== "cancelled" &&
            booking.status !== "refunded" &&
            booking.roomId === input.roomId &&
            overlaps(input.from, input.to, booking.checkIn, booking.checkOut),
        );
        if (liveBookingOverlap) {
          return fail("That range overlaps a live booking. Choose different dates.");
        }
        const blockOverlap = hotel.blocks.some(
          (block) =>
            block.roomId === input.roomId &&
            overlaps(input.from, input.to, block.from, block.to),
        );
        if (blockOverlap) {
          return fail("That range overlaps an existing block.");
        }
        const block = {
          id: `sample-block-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
          roomId: input.roomId,
          from: input.from,
          to: input.to,
          reason: input.reason.trim().slice(0, 80),
          createdAt: new Date().toISOString(),
        };
        return ok({ ...hotel, blocks: [...hotel.blocks, block] });
      }),
    [commit],
  );

  const removeBlock = useCallback(
    (hotelId: string, blockId: string) =>
      commit(hotelId, (hotel) => {
        if (!hotel.blocks.some((block) => block.id === blockId)) {
          return fail("That block has already been removed.");
        }
        return ok({
          ...hotel,
          blocks: hotel.blocks.filter((block) => block.id !== blockId),
        });
      }),
    [commit],
  );

  const updatePolicy = useCallback(
    (hotelId: string, template: PolicyTemplate) =>
      commit(hotelId, (hotel) => {
        const parsed = PolicyTemplateSchema.safeParse(template);
        if (!parsed.success) return fail("Choose one of the three agreed policy templates.");
        return ok({ ...hotel, policyTemplate: parsed.data });
      }),
    [commit],
  );

  const updateHouseRules = useCallback(
    (hotelId: string, rules: string[]) =>
      commit(hotelId, (hotel) => {
        const cleaned = rules.map((rule) => rule.trim()).filter(Boolean);
        if (cleaned.length === 0 || cleaned.length > 8) {
          return fail("Add between one and eight house rules.");
        }
        return ok({ ...hotel, houseRules: cleaned });
      }),
    [commit],
  );

  const resetSampleData = useCallback(async (): Promise<MutationResult> => {
    try {
      const fresh = await resetPartnerSnapshot();
      setSnapshot(fresh);
      setSelectedHotelId(fresh.hotels[0]?.id ?? "");
      setSavedAt(new Date().toISOString());
      setError(null);
      return { ok: true };
    } catch {
      return { ok: false, reason: "The sample snapshot could not be reset." };
    }
  }, []);

  const selectedHotel = useMemo(
    () =>
      snapshot.hotels.find((hotel) => hotel.id === selectedHotelId) ??
      snapshot.hotels[0] ??
      null,
    [snapshot.hotels, selectedHotelId],
  );

  const value = useMemo<PartnerDataContextValue>(
    () => ({
      snapshot,
      selectedHotel,
      selectedHotelId: selectedHotel?.id ?? "",
      selectHotel: setSelectedHotelId,
      loading,
      error,
      savedAt,
      isSample: snapshot.source === "sample",
      resetSampleData,
      setRoomStatus,
      updateRoomPrice,
      addBlock,
      removeBlock,
      updatePolicy,
      updateHouseRules,
    }),
    [
      snapshot,
      selectedHotel,
      loading,
      error,
      savedAt,
      resetSampleData,
      setRoomStatus,
      updateRoomPrice,
      addBlock,
      removeBlock,
      updatePolicy,
      updateHouseRules,
    ],
  );

  return <PartnerDataContext.Provider value={value}>{children}</PartnerDataContext.Provider>;
}

export function usePartnerData(): PartnerDataContextValue {
  const context = useContext(PartnerDataContext);
  if (!context) throw new Error("usePartnerData must be used inside PartnerDataProvider");
  return context;
}
