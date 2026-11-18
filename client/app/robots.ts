import type { MetadataRoute } from "next";

/**
 * Allow everything except the private surfaces: search results (duplicate
 * content), the styleguide (internal documentation) and the API.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/search", "/styleguide", "/api/"],
    },
    sitemap: "https://josstay.ng/sitemap.xml",
    host: "https://josstay.ng",
  };
}
