import type { Metadata } from "next";
import { PartnerPayouts } from "@/components/partner/screens/partner-payouts";

export const metadata: Metadata = {
  title: "Partner payouts",
  description: "Sample partner payout records with the fixed 10% commission shown.",
};

export default function PartnerPayoutsPage() {
  return <PartnerPayouts />;
}
