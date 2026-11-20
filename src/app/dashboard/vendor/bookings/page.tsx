import Image from "next/image";
import {
  CalendarDays,
  Check,
  Clock,
  Eye,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookings } from "@/lib/actions/api/booking";
import { BookingsData } from "@/types/apidata";
import VendorBookingsCard from "@/components/vendor/VendorBookingsCard";

export const metadata = {
  title: "Booking Requests | WedPlan",
  description: "View and manage all booking requests from clients.",
};

const TABS: { label: string; count: number; active?: boolean }[] = [
  { label: "All Requests", count: 5, active: true },
  { label: "Pending", count: 3 },
  { label: "Confirmed", count: 1 },
  { label: "Completed", count: 1 },
  { label: "Cancelled", count: 0 },
];

export default async function VendorBookingsPage() {
  const res: BookingsData[] = await getBookings();
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

      {/* ---------- Status tabs ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div
          role="tablist"
          aria-label="Filter booking requests"
          className="flex flex-wrap gap-2 sm:gap-2.5"
        >
          {TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={Boolean(tab.active)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.78rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                tab.active
                  ? "bg-[#720e32] text-white shadow-md focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                  : "border border-[#f1ded7] bg-white text-[#6b5a61] hover:border-[#e3c3bd] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 dark:border-white/10 dark:bg-[#1e131a] dark:text-[#c8b3bd] dark:hover:border-white/20 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums",
                  tab.active
                    ? "bg-white/20 text-white"
                    : "bg-[#fdeef2] text-[#a52b50] dark:bg-[#a52b50]/20 dark:text-[#ff9bb9]",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Request rows ---------- */}
      <div className="mx-auto mt-5 w-full max-w-7xl space-y-4 px-4 sm:px-6 lg:px-10">
        {res.map((request) => {
          //   const StatusIcon = STATUS_ICON[request.bookingStatus];
          return (
            <VendorBookingsCard key={request._id} request={request}/>
          );
        })}
      </div>
    </div>
  );
}
