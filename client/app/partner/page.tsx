import type { Metadata } from "next";
import { PartnerOverview } from "@/components/partner/screens/partner-overview";

export const metadata: Metadata = {
  title: "Partner overview",
  description: "Sample partner dashboard overview. No real hotel or payment is connected.",
};

export default function PartnerOverviewPage() {
  return <PartnerOverview />;
}
