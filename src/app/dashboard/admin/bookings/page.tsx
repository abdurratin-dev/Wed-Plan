import AdminBookingsView from "@/components/admin/AdminBookingsView";
import { getBookings } from "@/lib/actions/api/booking";
import { auth } from "@/lib/auth";
import type { BookingsData } from "@/types/apidata";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bookings | WedPlan",
  description: "View and manage all bookings made by customers.",
};

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  if(bookings.status){
    return redirect('/unauthorized')
  }
  const booking : BookingsData[] = !Array.isArray(bookings) ? [] : bookings
  return <AdminBookingsView bookings={booking} />;
}
