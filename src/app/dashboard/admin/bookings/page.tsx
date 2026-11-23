import AdminBookingsView from "@/components/admin/AdminBookingsView";
import { getBookings } from "@/lib/actions/api/booking";
import type { BookingsData } from "@/types/apidata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | WedPlan",
  description: "View and manage all bookings made by customers.",
};

export default async function AdminBookingsPage() {
  const bookings: BookingsData[] = await getBookings();
  return <AdminBookingsView bookings={bookings} />;
}
