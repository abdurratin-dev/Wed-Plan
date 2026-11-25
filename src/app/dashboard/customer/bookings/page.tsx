import CustomerBookings from "@/components/bookings/CustomerBookings";
import { getBookings } from "@/lib/actions/api/booking";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Bookings | WedPlan",
  description: "Track and manage all your bookings in one place.",
};
export default async function CustomerBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  const data = await getBookings(`role=${user?.role}&userId=${user?.id}`);
  if (data.status) {
    return redirect("/unauthorized");
  }
  return <CustomerBookings bookings={data} />;
}
