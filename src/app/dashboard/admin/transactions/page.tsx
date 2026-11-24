import AdminTransactionsView from "@/components/admin/AdminTransactionsView";
import { getBookingTransactions } from "@/lib/actions/api/booking";
import type { ITransactions } from "@/types/apidata";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | WedPlan",
  description: "Track and manage all transactions.",
};

export default async function AdminTransactionsPage() {
  const transactions: ITransactions[] = await getBookingTransactions();
  return <AdminTransactionsView transactions={transactions} />;
}
