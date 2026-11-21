"use client";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock,
  Eye,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BookingsData } from "@/types/apidata";
import { useState } from "react";
import { Button } from "../ui/button";
import { getBookings, updateBookingsAction } from "@/lib/actions/api/booking";

const STATUS = [
  {
    label: "Upcoming",
    icon: Clock,
    style:
      "bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa] dark:bg-[#c2410c]/15 dark:text-[#fdba74] dark:border-[#c2410c]/40",
  },
  {
    label: "Confirmed",
    icon: Check,
    style:
      "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] dark:bg-[#15803d]/20 dark:text-[#4ade80] dark:border-[#15803d]/40",
  },
  {
    label: "Completed",
    icon: Check,
    style:
      "bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe] dark:bg-[#6d28d9]/25 dark:text-[#c4b5fd] dark:border-[#6d28d9]/40",
  },
  {
    label: "Cancelled",
    icon: X,
    style:
      "bg-[#fee2e2] text-[#d6455f] border border-[#fecaca] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3] dark:border-[#d6455f]/40",
  },
];

const ACTION_STYLE =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#e3c3bd] bg-white px-3.5 py-2 text-[0.72rem] font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30";

export default function VendorBookingsCard({
  request,
}: {
  request: BookingsData[];
}) {
  const [bookingsData, setBookingsData] = useState<BookingsData[]>(request);
  const [activeTabs,setActiveTabs] = useState('All Requests');
  const upcomingFilter = request.filter(
    (response) => response.bookingStatus === "Upcoming",
  );
  const confirmeFilter = request.filter(
    (response) => response.bookingStatus === "Confirmed",
  );
  const completedFilter = request.filter(
    (response) => response.bookingStatus === "Completed",
  );
  const cancelledFilter = request.filter(
    (response) => response.bookingStatus === "Cancelled",
  );

  const TABS: { label: string; count: number; active?: boolean }[] = [
    { label: "All Requests", count: request.length, active: true },
    { label: "Upcoming", count: upcomingFilter.length },
    { label: "Confirmed", count: confirmeFilter.length },
    { label: "Completed", count: completedFilter.length },
    { label: "Cancelled", count: cancelledFilter.length },
  ];
  const hendleTabs = (action: string) => {
    if (action === "All Requests") {
      setBookingsData(request);
      return;
    }
    const tabs = request.filter((filter) => filter.bookingStatus === action);
    setBookingsData(tabs);
  };
  const hendleActionButton = async(data : {}) =>{
    // setStatusBar(data)
    const res = await updateBookingsAction(data)
    if(res.modifiedCount > 0){
      const res: BookingsData[] = await getBookings();
      setBookingsData(res)
    }
  }
  return (
    <>
      {/* ---------- Status tabs ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div
          role="tablist"
          aria-label="Filter booking requests"
          className="flex flex-wrap gap-2 sm:gap-2.5"
        >
          {TABS.map((tab) => (
            <Button
              key={tab.label}
              type="button"
              role="tab"
              onClick={() => {
                hendleTabs(tab.label)
                setActiveTabs(tab.label)
              }}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.78rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                tab.label === activeTabs
                  ? "bg-[#720e32] text-white shadow-md focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                  : "border border-[#f1ded7] bg-white text-[#6b5a61] hover:border-[#e3c3bd] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 dark:border-white/10 dark:bg-[#1e131a] dark:text-[#c8b3bd] dark:hover:border-white/20 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums",
                  tab.label === activeTabs
                    ? "bg-white/20 text-white"
                    : "bg-[#fdeef2] text-[#a52b50] dark:bg-[#a52b50]/20 dark:text-[#ff9bb9]",
                )}
              >
                {tab.count}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* ---------- Request rows ---------- */}
      <div className="mx-auto mt-5 w-full max-w-7xl space-y-4 px-4 sm:px-6 lg:px-10">
        {bookingsData.length > 0 ? (
          bookingsData.map((reques) => {
            //   const StatusIcon = STATUS_ICON[request.bookingStatus];
            return (
              <article
                key={reques._id}
                className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] transition hover:border-[#e3c3bd] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-5">
                  {/* Client */}
                  <div className="flex shrink-0 items-center gap-3 xl:w-44">
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#f6ece8] dark:bg-[#241720]">
                      {/* <Image
                      src={request.avatar}
                      alt={request.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    /> */}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                        {reques.customerName}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[0.7rem] font-medium text-[#8a7a80] dark:text-[#9b8792]">
                          Client
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Service */}
                  <div className="flex min-w-0 flex-1 items-center gap-3 xl:w-auto">
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f6ece8] dark:bg-[#241720]">
                      <Image
                        src={reques.bookingsImage || "/"}
                        alt={reques.bookingTitle}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                        {reques.bookingTitle}
                      </p>
                      <p className="mt-1 truncate text-xs text-[#8a7a80] dark:text-[#9b8792]">
                        {reques.bookingsDuration}
                      </p>
                    </div>
                  </div>

                  {/* Date & time */}
                  <div className="shrink-0 xl:w-32">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-[#4a3a41] dark:text-[#d5c1ca]">
                      <CalendarDays
                        size={13}
                        className="text-[#a52b50] dark:text-[#ff9bb9]"
                      />
                      {reques.bookingsDate}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                      <Clock
                        size={13}
                        className="text-[#a52b50] dark:text-[#ff9bb9]"
                      />
                      {reques.bookingsTime}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="shrink-0 xl:w-24">
                    <p className="text-base font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                      ৳ {reques.bookingsPrice}
                    </p>
                    <p className="mt-0.5 text-[0.68rem] text-[#8a7a80] dark:text-[#9b8792]">
                      Total Amount
                    </p>
                  </div>

                  {/* Status + actions */}
                  <div className="flex flex-wrap items-center gap-3 xl:ml-auto xl:shrink-0">
                    {STATUS.map((stat) => (
                      <div key={stat.label}>
                        {stat.label === reques.bookingStatus ? (
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] font-bold",
                              stat.style,
                            )}
                          >
                            <stat.icon size={15} />
                            {stat.label}
                          </span>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#720e32] px-3.5 py-2 text-[0.72rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                    >
                      <Eye size={13} />
                      View Details
                    </button>

                    
                      <div>
                        
                          <select className={ACTION_STYLE} value={reques.bookingStatus} onChange={(e)=> {hendleActionButton({
                            id : reques._id,
                            bookingStatus : e.target.value})}}>
                            <option value="">Select Action</option>
                            <option value="Confirmed">Confirm</option>
                            <option value="Completed">Complete</option>
                            <option value="Cancelled">Cancel</option>
                          </select>
                       
                      </div>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-[#1e131a]">
            <CalendarDays
              size={30}
              aria-hidden="true"
              className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
            />
            <h2 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
              {bookingsData.length === 0 ? "No bookings yet" : "No bookings found"}
            </h2>
            <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
              {bookingsData.length === 0
                ? "Once you book a service, it will show up here."
                : "Try a different search term or switch tabs."}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
