import type { Metadata } from "next";
import { PartnerBookings } from "@/components/partner/screens/partner-bookings";

export const metadata: Metadata = {
  title: "Partner bookings",
  description: "Sample partner booking ledger with guest names only.",
};

export default function PartnerBookingsPage() {
  return <PartnerBookings />;
}
