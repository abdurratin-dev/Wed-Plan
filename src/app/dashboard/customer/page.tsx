import CustomerDashboardView from "@/components/customer/CustomerDashboardView";
import { getBookings } from "@/lib/actions/api/booking";
import { getServiceData } from "@/lib/actions/api/service";
import { auth } from "@/lib/auth";
import type { BookingsData } from "@/types/apidata";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Overview | WedPlan",
  description:
    "Customer overview for WedPlan — bookings, favorite services, reviews and spending at a glance.",
};

export default async function CustomerDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;

  const [bookings, services] = await Promise.all([
    getBookings(`role=${user?.role}&userId=${user?.id}`) as Promise<
      BookingsData[]
    >,
    getServiceData(),
  ]);

  console.log(bookings);
  const userName = user?.name?.trim().split(/\s+/)[0] || "there";
  if (!user) {
    return redirect("/unauthorized");
  }
  return (
    <CustomerDashboardView
      bookings={bookings}
      services={services}
      userName={userName}
      now={new Date().getTime()}
    />
  );
}
