import type { Metadata } from "next";
import { PartnerCalendar } from "@/components/partner/screens/partner-calendar";

export const metadata: Metadata = {
  title: "Partner calendar",
  description: "Sample partner calendar with bookings and room blocks.",
};

export default function PartnerCalendarPage() {
  return <PartnerCalendar />;
}
