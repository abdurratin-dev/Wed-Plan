import Image from "next/image";
import { getBookings } from "@/lib/actions/api/booking";
import { BookingsData } from "@/types/apidata";
import VendorBookingsCard from "@/components/vendor/VendorBookingsCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CustomerBookingEmpty from "@/components/bookings/customerBookingsEmpty";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Booking Requests | WedPlan",
  description: "View and manage all booking requests from clients.",
};

export default async function VendorBookingsPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user = session?.user;
  const res = await getBookings(
    `role=${user?.role}&userId=${user?.id}`,
  );
  if(res.status){
    return redirect("/unauthorizied");
  }
  const bookignsData: BookingsData[] = !Array.isArray(res) ? [] : res;
  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] pb-16 dark:bg-[#160e13]">
      {/* ---------- Hero banner ---------- */}
      <div className="relative isolate overflow-hidden">
        <Image
          src="/services-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fffaf7] via-[#fffaf7]/85 to-[#fffaf7]/25 dark:from-[#160e13] dark:via-[#160e13]/85 dark:to-[#160e13]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fffaf7]/60 via-transparent to-[#fffaf7]/70 dark:from-[#160e13]/60 dark:to-[#160e13]/70" />

        <div className="mx-auto w-full max-w-7xl px-4 pt-9 pb-8 sm:px-6 lg:px-10 lg:pt-14 lg:pb-12">
          <p className="flex items-center gap-3 text-[0.68rem] font-bold tracking-[0.22em] text-[#a52b50] uppercase dark:text-[#ff9bb9]">
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#a52b50]/50 dark:bg-[#ff9bb9]/50"
            />
            Vendor Dashboard
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#a52b50]/50 dark:bg-[#ff9bb9]/50"
            />
          </p>
          <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            Booking Requests
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            View and manage all booking requests from clients.
          </p>
        </div>
      </div>
      {res.status !== 401 ? <VendorBookingsCard request={bookignsData} /> : <CustomerBookingEmpty />}
    </div>
  );
}
