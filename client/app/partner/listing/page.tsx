import type { Metadata } from "next";
import { PartnerListing } from "@/components/partner/screens/partner-listing";

export const metadata: Metadata = {
  title: "Partner listing",
  description: "Sample partner listing editor with public facts and internal verification fields.",
};

export default function PartnerListingPage() {
  return <PartnerListing />;
}
