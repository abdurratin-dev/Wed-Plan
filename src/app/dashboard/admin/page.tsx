import AdminDashboardView from "@/components/admin/AdminDashboardView";
import {
  getBookingTransactions,
  getBookings,
} from "@/lib/actions/api/booking";
import { getServiceData } from "@/lib/actions/api/service";
import { getUsers } from "@/lib/actions/api/users";
import { auth } from "@/lib/auth";
import type { BookingsData, ITransactions, IUsers } from "@/types/apidata";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Overview | WedPlan",
  description:
    "Platform overview for WedPlan administrators — users, vendors, bookings and revenue at a glance.",
};

export default async function AdminDashboardPage() {
  const [users, bookings, services, transactions] = await Promise.all([
    getUsers() as Promise<IUsers[]>,
    getBookings() as Promise<BookingsData[]>,
    getServiceData(),
    getBookingTransactions() as Promise<ITransactions[]>,
  ]);

  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const userName = session?.user?.name?.trim().split(/\s+/)[0] || "Admin";

  return (
    <AdminDashboardView
      users={users}
      bookings={bookings}
      services={services}
      transactions={transactions}
      userName={userName}
      now={new Date().getTime()}
    />
  );
}
