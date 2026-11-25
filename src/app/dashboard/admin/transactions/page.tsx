import AdminTransactionsView from "@/components/admin/AdminTransactionsView";
import { getBookingTransactions } from "@/lib/actions/api/booking";
import { auth } from "@/lib/auth";
import type { ITransactions } from "@/types/apidata";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Transactions | WedPlan",
  description: "Track and manage all transactions.",
};

export default async function AdminTransactionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  if (user?.role !== "admin" || !user) {
    return redirect("/unauthorized");
  }
  const transactions: ITransactions[] = await getBookingTransactions();
  return <AdminTransactionsView transactions={transactions} />;
}
