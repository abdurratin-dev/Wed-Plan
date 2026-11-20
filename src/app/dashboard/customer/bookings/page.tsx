import CustomerBookings from "@/components/bookings/CustomerBookings";
import { getBookings } from "@/lib/actions/api/booking";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Bookings | WedPlan",
  description: "Track and manage all your bookings in one place.",
};
export default async function CustomerBookingsPage({searchParams} : {searchParams : Promise<Record<string,string>>}) {
  const params = await searchParams;
  const url = new URLSearchParams(params);
  const data = await getBookings(url.toString());
  return <CustomerBookings bookings={data} />;
}
