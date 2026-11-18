import {
  HotelSchema,
  toPublicHotel,
  type Area,
  type Hotel,
  type PolicyTemplate,
  type PublicHotel,
  type VerificationStatus,
} from "@josstay/shared";

export type RoomTag =
  | "Living Room"
  | "Bedrooms"
  | "Kitchen"
  | "Bathrooms"
  | "Exterior";

export type Photo = {
  id: string;
  src: string;
  tag: RoomTag;
  alt: string;
};

export type Room = {
  name: string;
  bed: string;
  mattress: string;
  sleeps: number;
  ensuite: boolean;
  note?: string;
};

export type PolicyView = {
  template: PolicyTemplate;
  label: string;
  summary: string;
};

export type VerificationView = {
  status: VerificationStatus | null;
  label: string;
  note: string;
};

/**
 * Guest-facing view model. Every canonical field comes from the shared `Hotel`
 * schema; the extra fields are presentation copy for the existing components.
 * There is deliberately no phone field here — public data cannot carry one.
 */
export type Stay = PublicHotel & {
  nightly: number;
  tagline: string;
  description: string;
  cleaningFee: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  power: string;
  security: string;
  photos: Photo[];
  rooms: Room[];
  amenities: { group: string; items: string[] }[];
  unavailable: { from: string; to: string }[];
  policy: PolicyView;
  verification: VerificationView;
};

export type AreaView = Area & {
  count: number;
  demo: true;
  feature?: boolean;
};

const IMG = "/images/stays";

const POLICY_VIEWS: Record<PolicyTemplate, PolicyView> = {
  flexible: {
    template: "flexible",
    label: "Flexible",
    summary:
      "Free cancellation until 24 hours before check-in. After that, the first night is non-refundable.",
  },
  moderate: {
    template: "moderate",
    label: "Moderate",
    summary:
      "Free until 72 hours before check-in. Between 72 and 24 hours, 50% is refunded. Inside 24 hours, no refund.",
  },
  strict: {
    template: "strict",
    label: "Strict",
    summary:
      "Free cancellation until 24 hours after booking. After that, no refund.",
  },
};

function verificationView(status?: VerificationStatus): VerificationView {
  if (!status) {
    return {
      status: null,
      label: "Not inspected — demo",
      note: "No agent report exists for this demo listing. No verification badge is claimed.",
    };
  }

  return {
    status,
    label: status,
    note: "Based on a dated agent report.",
  };
}

/**
 * Canonical demo hotels. Validated with the same Zod schema the API will use,
 * so a bad shape fails at build time rather than appearing in a page.
 * Addresses and pins are demo placeholders; no guest phone number is stored.
 */
const HOTEL_INPUTS = [
  {
    slug: "rayfield-garden-apartment",
    name: "The Rayfield Garden Apartment",
    area: "Rayfield",
    address: "Demo address — exact address shared after a confirmed booking",
    lat: 9.9282,
    lng: 8.8911,
    nightlyKobo: 8_500_000,
    policyTemplate: "flexible",
    demo: true,
  },
  {
    slug: "lamingo-skyline-suite",
    name: "Lamingo Skyline Suite",
    area: "Lamingo",
    address: "Demo address — exact address shared after a confirmed booking",
    lat: 9.9156,
    lng: 8.8642,
    nightlyKobo: 6_200_000,
    policyTemplate: "moderate",
    demo: true,
  },
  {
    slug: "little-rayfield-courtyard",
    name: "Little Rayfield Courtyard",
    area: "Little Rayfield",
    address: "Demo address — exact address shared after a confirmed booking",
    lat: 9.9335,
    lng: 8.8768,
    nightlyKobo: 12_000_000,
    policyTemplate: "strict",
    demo: true,
  },
  {
    slug: "bukuru-hillside-hotel",
    name: "Bukuru Hillside Hotel",
    area: "Bukuru",
    address: "Demo address — exact address shared after a confirmed booking",
    lat: 9.7894,
    lng: 8.8723,
    nightlyKobo: 4_800_000,
    policyTemplate: "moderate",
    demo: true,
  },
] satisfies Hotel[];

const HOTELS: Hotel[] = HOTEL_INPUTS.map((hotel) => HotelSchema.parse(hotel));

/** Public shape only. The private phone field is removed by `toPublicHotel`. */
export const PUBLIC_HOTELS: PublicHotel[] = HOTELS.map(toPublicHotel);

/**
 * Photo slots. On a real listing these are the twelve approved images from
 * the JosStay shoot. Each is tagged by room so the full photo tour can group
 * them and the 5-photo bento can pick the canonical hero + four rooms.
 */
function gallery(prefix: string, area: string): Photo[] {
  return [
    {
      id: `${prefix}-living-1`,
      src: `${IMG}/1560448204-e02f11c3d0e2.jpg`,
      tag: "Living Room",
      alt: `Living room with natural light at a sample ${area} shortlet`,
    },
    {
      id: `${prefix}-living-2`,
      src: `${IMG}/1522708323590-d24dbb6b0267.jpg`,
      tag: "Living Room",
      alt: `Seating area and TV console in the sample ${area} apartment`,
    },
    {
      id: `${prefix}-bed-1`,
      src: `${IMG}/1500530855697-b586d89ba3ee.jpg`,
      tag: "Bedrooms",
      alt: `Primary bedroom with a queen bed in ${area}`,
    },
    {
      id: `${prefix}-bed-2`,
      src: `${IMG}/1566073771259-6a8506099945.jpg`,
      tag: "Bedrooms",
      alt: `Second bedroom with a double bed in ${area}`,
    },
    {
      id: `${prefix}-bed-3`,
      src: `${IMG}/1618773928121-c32242e63f39.jpg`,
      tag: "Bedrooms",
      alt: "Guest bedroom with wardrobe and reading lamp",
    },
    {
      id: `${prefix}-kitchen-1`,
      src: `${IMG}/1551882547-ff40c63fe5fa.jpg`,
      tag: "Kitchen",
      alt: "Fitted kitchen with cooker, sink and worktop",
    },
    {
      id: `${prefix}-kitchen-2`,
      src: `${IMG}/1564501049412-61c2a3083791.jpg`,
      tag: "Kitchen",
      alt: "Kitchen island and dining counter",
    },
    {
      id: `${prefix}-bath-1`,
      src: `${IMG}/1582719508461-905c673771fd.jpg`,
      tag: "Bathrooms",
      alt: "Ensuite bathroom with walk-in shower",
    },
    {
      id: `${prefix}-bath-2`,
      src: `${IMG}/1542314831-068cd1dbfeeb.jpg`,
      tag: "Bathrooms",
      alt: "Guest bathroom with vanity and mirror",
    },
    {
      id: `${prefix}-balcony`,
      src: `${IMG}/1590490360182-c33d57733427.jpg`,
      tag: "Exterior",
      alt: `Balcony overlooking the compound in ${area}`,
    },
    {
      id: `${prefix}-compound`,
      src: `${IMG}/1571896349842-33c89424de2d.jpg`,
      tag: "Exterior",
      alt: `Gated compound and parking area in ${area}`,
    },
    {
      id: `${prefix}-exterior`,
      src: `${IMG}/1445019980597-93fa8acb246c.jpg`,
      tag: "Exterior",
      alt: `Building entrance at the sample ${area} property`,
    },
  ];
}

type ListingCopy = Omit<
  Stay,
  keyof PublicHotel | "nightly" | "policy" | "verification"
>;

const LISTING_COPY: Record<string, ListingCopy> = {
  "rayfield-garden-apartment": {
    tagline: "Two-bedroom shortlet with 24/7 solar power",
    description:
      "A sample two-bedroom shortlet in the heart of Rayfield, five minutes from the Rayfield Resort roundabout. The power note shows how a tested backup would be described on a real listing. This is demo content: no inspection has taken place and the photos are illustrative.",
    cleaningFee: 12_000,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2.5,
    power: "24/7 solar + inverter backup (demo note)",
    security: "Gated estate, guard on duty (demo note)",
    photos: gallery("rayfield", "Rayfield"),
    rooms: [
      {
        name: "Bedroom 1 — Primary",
        bed: "Queen bed",
        mattress: "Orthopedic queen, 6ft",
        sleeps: 2,
        ensuite: true,
        note: "Blackout curtains, ensuite shower, reading lamps both sides.",
      },
      {
        name: "Bedroom 2 — Guest",
        bed: "Double bed",
        mattress: "Double, 4.5ft",
        sleeps: 2,
        ensuite: false,
        note: "Faces the garden; shares the main bathroom across the hall.",
      },
    ],
    amenities: [
      {
        group: "Power & comfort",
        items: ["24/7 solar power", "Inverter backup", "Air conditioning", "Ceiling fans", "Hot water"],
      },
      {
        group: "Kitchen",
        items: ["Gas cooker", "Microwave", "Fridge/freezer", "Kettle", "Cookware & plates"],
      },
      {
        group: "Connectivity & work",
        items: ["Fibre Wi-Fi (50 Mbps)", "Dedicated workspace", "Smart TV", "DSTV"],
      },
      {
        group: "Safety & access",
        items: ["Gated estate", "Security guard", "CCTV at gate", "Private parking", "First-aid kit"],
      },
    ],
    unavailable: [
      { from: "2026-11-20", to: "2026-11-22" },
      { from: "2026-11-27", to: "2026-11-29" },
      { from: "2026-12-04", to: "2026-12-06" },
      { from: "2026-12-20", to: "2026-12-28" },
    ],
  },
  "lamingo-skyline-suite": {
    tagline: "One-bedroom suite with hill views",
    description:
      "A sample one-bedroom suite on the Lamingo ridge, with views across the plateau. Built to show how a calm base for solo travellers and couples would read on a listing. Demo content only — no inspection has taken place.",
    cleaningFee: 9_000,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    power: "24/7 solar + inverter backup (demo note)",
    security: "Gated compound, CCTV (demo note)",
    photos: gallery("lamingo", "Lamingo"),
    rooms: [
      {
        name: "Bedroom 1 — Primary",
        bed: "King bed",
        mattress: "King, 6.5ft",
        sleeps: 2,
        ensuite: true,
        note: "Hill-facing window, ensuite shower, work desk.",
      },
    ],
    amenities: [
      { group: "Power & comfort", items: ["24/7 solar power", "Inverter backup", "Air conditioning", "Hot water"] },
      { group: "Kitchen", items: ["Electric cooker", "Microwave", "Fridge", "Kettle", "Cookware & plates"] },
      { group: "Connectivity & work", items: ["Fibre Wi-Fi (50 Mbps)", "Dedicated workspace", "Smart TV"] },
      { group: "Safety & access", items: ["Gated compound", "CCTV", "Private parking"] },
    ],
    unavailable: [
      { from: "2026-11-18", to: "2026-11-19" },
      { from: "2026-11-25", to: "2026-11-30" },
    ],
  },
  "little-rayfield-courtyard": {
    tagline: "Three-bedroom family shortlet with courtyard",
    description:
      "A sample three-bedroom home built around a private courtyard — the kind of layout families book for visits and Christmas. The demo record shows how house rules and a policy template would appear. No inspection has taken place.",
    cleaningFee: 18_000,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    power: "24/7 solar + generator (demo note)",
    security: "Gated compound, guard on duty (demo note)",
    photos: gallery("littlerayfield", "Little Rayfield"),
    rooms: [
      {
        name: "Bedroom 1 — Primary",
        bed: "King bed",
        mattress: "King, 6.5ft",
        sleeps: 2,
        ensuite: true,
        note: "Ensuite bath, walk-in wardrobe.",
      },
      {
        name: "Bedroom 2",
        bed: "Queen bed",
        mattress: "Queen, 6ft",
        sleeps: 2,
        ensuite: false,
        note: "Shares the family bathroom.",
      },
      {
        name: "Bedroom 3",
        bed: "Two singles",
        mattress: "Single, 3.5ft each",
        sleeps: 2,
        ensuite: false,
        note: "Best for children or colleagues.",
      },
    ],
    amenities: [
      { group: "Power & comfort", items: ["24/7 solar power", "Generator backup", "Air conditioning", "Ceiling fans", "Hot water"] },
      { group: "Kitchen", items: ["Gas cooker", "Microwave", "Fridge/freezer", "Washing machine", "Cookware & plates"] },
      { group: "Connectivity & work", items: ["Fibre Wi-Fi (50 Mbps)", "Smart TV", "DSTV"] },
      { group: "Safety & access", items: ["Gated compound", "Security guard", "CCTV", "Private parking", "Fire extinguisher"] },
    ],
    unavailable: [
      { from: "2026-11-21", to: "2026-11-24" },
      { from: "2026-12-12", to: "2026-12-18" },
    ],
  },
  "bukuru-hillside-hotel": {
    tagline: "Serviced hotel rooms with breakfast",
    description:
      "Sample serviced rooms on the Bukuru hillside with breakfast included and a restaurant downstairs. Demo content used to show a hotel-style listing next to shortlets. No inspection has taken place.",
    cleaningFee: 0,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    power: "24/7 generator + inverter (demo note)",
    security: "Hotel security, 24/7 (demo note)",
    photos: gallery("bukuru", "Bukuru"),
    rooms: [
      {
        name: "Deluxe Room",
        bed: "Queen bed",
        mattress: "Queen, 6ft",
        sleeps: 2,
        ensuite: true,
        note: "Ensuite bathroom, breakfast included, daily housekeeping.",
      },
    ],
    amenities: [
      { group: "Power & comfort", items: ["24/7 power", "Air conditioning", "Hot water", "Daily housekeeping"] },
      { group: "Food", items: ["Breakfast included", "Restaurant", "Room service"] },
      { group: "Connectivity & work", items: ["Wi-Fi", "Smart TV", "Work desk"] },
      { group: "Safety & access", items: ["24/7 security", "CCTV", "Secure parking"] },
    ],
    unavailable: [
      { from: "2026-11-19", to: "2026-11-20" },
      { from: "2026-11-26", to: "2026-11-27" },
    ],
  },
};

export const STAYS: Stay[] = PUBLIC_HOTELS.map((hotel) => {
  const copy = LISTING_COPY[hotel.slug];
  if (!copy) throw new Error(`Missing demo copy for ${hotel.slug}`);

  return {
    ...hotel,
    nightly: Math.round(hotel.nightlyKobo / 100),
    ...copy,
    policy: POLICY_VIEWS[hotel.policyTemplate],
    verification: verificationView(hotel.verificationStatus),
  };
});

function slugFor(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function hasRoundTheClockPower(stay: Stay): boolean {
  return /24\/7|solar/i.test(stay.power);
}

/** Areas and their counts come from the hotel data — no invented inventory. */
function deriveAreas(stays: Stay[]): AreaView[] {
  const byName = new Map<string, Stay[]>();

  for (const stay of stays) {
    const group = byName.get(stay.area) ?? [];
    group.push(stay);
    byName.set(stay.area, group);
  }

  const areas: AreaView[] = [...byName.entries()].map(([name, group]) => ({
    slug: slugFor(name),
    name,
    centreLat: average(group.map((stay) => stay.lat)),
    centreLng: average(group.map((stay) => stay.lng)),
    count: group.length,
    demo: true,
  }));

  const powered = stays.filter(hasRoundTheClockPower);
  if (powered.length > 0) {
    areas.push({
      slug: slugFor("24/7 Power"),
      name: "24/7 Power",
      centreLat: average(powered.map((stay) => stay.lat)),
      centreLng: average(powered.map((stay) => stay.lng)),
      count: powered.length,
      demo: true,
      feature: true,
    });
  }

  return areas;
}

export const AREAS: AreaView[] = deriveAreas(STAYS);

export function getStay(slug: string): Stay | undefined {
  return STAYS.find((stay) => stay.slug === slug);
}

export function getArea(slug: string): AreaView | undefined {
  return AREAS.find((area) => area.slug === slug);
}

/** Canonical bento selection: 1 hero + 4 room tiles. */
export function bentoPhotos(stay: Stay): Photo[] {
  const hero = stay.photos.find((p) => p.tag === "Living Room") ?? stay.photos[0];
  const wanted: RoomTag[] = ["Bedrooms", "Kitchen", "Bathrooms", "Exterior"];
  const tiles = wanted.map(
    (tag) => stay.photos.find((p) => p.tag === tag && p.id !== hero.id) ?? stay.photos[0],
  );
  return [hero, ...tiles];
}

export function groupedPhotos(stay: Stay): { tag: RoomTag; photos: Photo[] }[] {
  const order: RoomTag[] = ["Living Room", "Bedrooms", "Kitchen", "Bathrooms", "Exterior"];
  return order
    .map((tag) => ({ tag, photos: stay.photos.filter((p) => p.tag === tag) }))
    .filter((group) => group.photos.length > 0);
}
