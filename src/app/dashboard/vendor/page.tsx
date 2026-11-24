import VendorDashboardView from "@/components/vendor/VendorDashboardView";
import {
  getBookings,
  getBookingTransactions,
} from "@/lib/actions/api/booking";
import { getServiceData } from "@/lib/actions/api/service";
import { auth } from "@/lib/auth";
import type { BookingsData, ITransactions } from "@/types/apidata";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Overview | WedPlan",
  description:
    "Vendor overview for WedPlan — services, bookings, ratings and earnings at a glance.",
};

export default async function VendorDashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;

  const [bookings, services, transactions] = await Promise.all([
    getBookings(`role=${user?.role}&userId=${user?.id}`) as Promise<
      BookingsData[]
    >,
    getServiceData(`role=${user?.role}&userId=${user?.id}`),
    getBookingTransactions() as Promise<ITransactions[]>,
  ]);

  const userName = user?.name?.trim().split(/\s+/)[0] || "Vendor";

  return (
    <VendorDashboardView
      bookings={bookings}
      services={services}
      transactions={transactions}
      userName={userName}
      now={new Date().getTime()}
    />
  );
}
