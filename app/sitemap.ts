import type { MetadataRoute } from "next";
import { AREAS, STAYS } from "@/lib/data";

const BASE = "https://josstay.ng";

function slugFor(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Sitemap priority reflects commercial intent, not page count.
 * Stays and area pages are what people search for; legal pages exist to be
 * found when needed, not to compete for attention.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/jos`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/promise`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    {
      url: `${BASE}/list-your-property`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const stays: MetadataRoute.Sitemap = STAYS.map((stay) => ({
    url: `${BASE}/stays/${stay.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const areas: MetadataRoute.Sitemap = AREAS.map((area) => ({
    url: `${BASE}/jos/${slugFor(area.name)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: area.name === "24/7 Power" ? 0.8 : 0.7,
  }));

  const legal: MetadataRoute.Sitemap = [
    "terms",
    "privacy",
    "cancellation",
    "house-rules",
  ].map((slug) => ({
    url: `${BASE}/legal/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...core, ...stays, ...areas, ...legal];
}
