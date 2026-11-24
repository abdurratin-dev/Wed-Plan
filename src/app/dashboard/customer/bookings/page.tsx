import CustomerBookings from "@/components/bookings/CustomerBookings";
import { getBookings } from "@/lib/actions/api/booking";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "My Bookings | WedPlan",
  description: "Track and manage all your bookings in one place.",
};
export default async function CustomerBookingsPage() {
  const session = await auth.api.getSession({
    headers : await headers()
  })
  const user = session?.user
  const data = await getBookings(`role=${user?.role}&userId=${user?.id}`);
  return <CustomerBookings bookings={data} />;
}
