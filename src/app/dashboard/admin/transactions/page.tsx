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
  const transactions = await getBookingTransactions();
   if(transactions.status){
    return redirect('/unauthorized')
  }
  const transaction : ITransactions[] = Array.isArray(transactions) ? transactions : []
  return <AdminTransactionsView transactions={transaction} />;
}
