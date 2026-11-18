import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://josstay.ng"),
  title: {
    default: "JosStay — Hotel stays in Jos (demo)",
    template: "%s · JosStay",
  },
  description:
    "A demo preview of a verifiable hotel marketplace for Jos. Real listings will carry dated inspection reports, power tests and all-in pricing.",
  keywords: [
    "Jos shortlets",
    "Jos apartments",
    "Rayfield shortlet",
    "Lamingo apartments",
    "Bukuru hotels",
    "24/7 power stays Jos",
  ],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://josstay.ng",
    siteName: "JosStay",
    title: "JosStay — Hotel stays in Jos (demo)",
    description:
      "Demo listings only. No hotel is live and no payment is connected yet.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0B3D33",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-NG">
      <body className="min-h-dvh bg-[var(--color-canvas)] text-obsidian antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-pine-800 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
