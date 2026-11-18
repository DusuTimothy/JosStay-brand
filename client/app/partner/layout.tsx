import type { Metadata } from "next";
import { PartnerDataProvider } from "@/components/partner/partner-data-provider";
import { PartnerShell } from "@/components/partner/partner-shell";

export const metadata: Metadata = {
  title: "Partner dashboard",
  robots: { index: false, follow: false },
};

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <PartnerDataProvider>
      <PartnerShell>{children}</PartnerShell>
    </PartnerDataProvider>
  );
}
