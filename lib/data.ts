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

export type Stay = {
  slug: string;
  name: string;
  area: string;
  tagline: string;
  description: string;
  nightly: number;
  cleaningFee: number;
  serviceFeeRate: number;
  rating: number;
  reviews: number;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  badge: "Verified" | "Instant Book";
  power: string;
  security: string;
  photos: Photo[];
  rooms: Room[];
  amenities: { group: string; items: string[] }[];
  unavailable: { from: string; to: string }[];
};

const IMG = "/images/stays";

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
      alt: `Living room with natural light at a ${area} shortlet`,
    },
    {
      id: `${prefix}-living-2`,
      src: `${IMG}/1522708323590-d24dbb6b0267.jpg`,
      tag: "Living Room",
      alt: `Seating area and TV console in the ${area} apartment`,
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
      alt: `Guest bedroom with wardrobe and reading lamp`,
    },
    {
      id: `${prefix}-kitchen-1`,
      src: `${IMG}/1551882547-ff40c63fe5fa.jpg`,
      tag: "Kitchen",
      alt: `Fitted kitchen with cooker, sink and worktop`,
    },
    {
      id: `${prefix}-kitchen-2`,
      src: `${IMG}/1564501049412-61c2a3083791.jpg`,
      tag: "Kitchen",
      alt: `Kitchen island and dining counter`,
    },
    {
      id: `${prefix}-bath-1`,
      src: `${IMG}/1582719508461-905c673771fd.jpg`,
      tag: "Bathrooms",
      alt: `Ensuite bathroom with walk-in shower`,
    },
    {
      id: `${prefix}-bath-2`,
      src: `${IMG}/1542314831-068cd1dbfeeb.jpg`,
      tag: "Bathrooms",
      alt: `Guest bathroom with vanity and mirror`,
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
      alt: `Building entrance at the ${area} property`,
    },
  ];
}

export const STAYS: Stay[] = [
  {
    slug: "rayfield-garden-apartment",
    name: "The Rayfield Garden Apartment",
    area: "Rayfield",
    tagline: "Two-bedroom shortlet with 24/7 solar power",
    description:
      "A quiet, fully furnished two-bedroom in the heart of Rayfield, five minutes from the Rayfield Resort roundabout. Solar and inverter keep the lights, fans and Wi-Fi on through any outage. JosStay checks every room before it goes live, and the photos you see are the photos from the most recent inspection.",
    nightly: 85000,
    cleaningFee: 12000,
    serviceFeeRate: 0.07,
    rating: 4.92,
    reviews: 38,
    guests: 4,
    bedrooms: 2,
    beds: 2,
    baths: 2.5,
    badge: "Instant Book",
    power: "24/7 solar + inverter backup",
    security: "Gated estate, guard on duty",
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
        items: [
          "24/7 solar power",
          "Inverter backup",
          "Air conditioning",
          "Ceiling fans",
          "Hot water",
        ],
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
  {
    slug: "lamingo-skyline-suite",
    name: "Lamingo Skyline Suite",
    area: "Lamingo",
    tagline: "One-bedroom suite with hill views",
    description:
      "A bright one-bedroom suite on the Lamingo ridge, with views across the plateau. Built for solo travellers and couples who want a calm base with dependable power and fast Wi-Fi.",
    nightly: 62000,
    cleaningFee: 9000,
    serviceFeeRate: 0.07,
    rating: 4.87,
    reviews: 24,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    badge: "Verified",
    power: "24/7 solar + inverter backup",
    security: "Gated compound, CCTV",
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
  {
    slug: "little-rayfield-courtyard",
    name: "Little Rayfield Courtyard",
    area: "Little Rayfield",
    tagline: "Three-bedroom family shortlet with courtyard",
    description:
      "A three-bedroom home built around a private courtyard — the one guests book for family visits, weddings and Christmas. Full kitchen, two bathrooms, and parking inside the gate.",
    nightly: 120000,
    cleaningFee: 18000,
    serviceFeeRate: 0.07,
    rating: 4.95,
    reviews: 51,
    guests: 6,
    bedrooms: 3,
    beds: 4,
    baths: 2,
    badge: "Instant Book",
    power: "24/7 solar + generator",
    security: "Gated compound, guard on duty",
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
  {
    slug: "bukuru-hillside-hotel",
    name: "Bukuru Hillside Hotel",
    area: "Bukuru",
    tagline: "Serviced hotel rooms with breakfast",
    description:
      "Serviced rooms on the Bukuru hillside with breakfast included and a restaurant downstairs. A reliable choice for business travellers who want hotel service rather than a self-catered apartment.",
    nightly: 48000,
    cleaningFee: 0,
    serviceFeeRate: 0.07,
    rating: 4.71,
    reviews: 66,
    guests: 2,
    bedrooms: 1,
    beds: 1,
    baths: 1,
    badge: "Verified",
    power: "24/7 generator + inverter",
    security: "Hotel security, 24/7",
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
];

export const AREAS = [
  { name: "Rayfield", count: 24 },
  { name: "Lamingo", count: 18 },
  { name: "Little Rayfield", count: 11 },
  { name: "Bukuru", count: 15 },
  { name: "Bodija", count: 9 },
  { name: "24/7 Power", count: 31, feature: true },
] as const;

export function getStay(slug: string): Stay | undefined {
  return STAYS.find((s) => s.slug === slug);
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
    .filter((g) => g.photos.length > 0);
}
