"use client";

import { useState } from "react";
import {
  CalendarDays,
  Clock3,
  MapPin,
  Search,
  Heart,
  BarChart3,
  Headphones,
  Star,
  ChevronRight,
  X,
  CheckCircle2,
  CircleX,
  Camera,
} from "lucide-react";
import Link from "next/link";
import { BookingsData } from "@/types/apidata";
import { useRouter } from "next/navigation";

type BookingStatus = "Upcoming" | "Confirmed" | "Completed" | "Cancelled";

const filters = ["All Bookings", "Upcoming", "Completed", "Cancelled"] as const;

type FilterType = (typeof filters)[number];

const statusStyles: Record<BookingStatus, string> = {
  Upcoming: "bg-green-100 text-green-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Completed: "bg-purple-100 text-purple-700",
  Cancelled: "bg-rose-100 text-rose-600",
};

export default function CustomerBookings({
  bookings,
}: {
  bookings: BookingsData[];
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All Bookings");
  const router = useRouter()
  const params = new URLSearchParams();
  const [search, setSearch] = useState("");
  const hendleFilter = (filter : FilterType) => {
    if(filter === 'All Bookings'){
      router.push('/dashboard/customer/bookings')
      return
    }
    params.set("status", filter);
    router.push(`?${params.toString()}`)
  };
  const upcomingCount = bookings.filter(
    (b) => b.bookingStatus === "Upcoming" || b.bookingStatus === "Confirmed",
  ).length;

  const completedCount = bookings.filter(
    (b) => b.bookingStatus === "Completed",
  ).length;

  const cancelledCount = bookings.filter(
    (b) => b.bookingStatus === "Cancelled",
  ).length;

  const filterCounts: Record<FilterType, number> = {
    "All Bookings": bookings.length,
    Upcoming: upcomingCount,
    Completed: completedCount,
    Cancelled: cancelledCount,
  };

  return (
    <main className="min-h-screen bg-[#fff9f8] text-[#38172a]">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,235,232,.96), rgba(255,235,232,.45)), url('https://images.unsplash.com/photo-1519741497674-611481863552?w=1600')",
        }}
      >
        <div className="mx-auto max-w-[1440px] px-5 py-10 md:px-8 md:py-12">
          <div className="max-w-xl">
            <div className="mb-4 flex items-center gap-2 text-xs font-medium text-[#873a59]">
              <Link href="/">Home</Link>
              <ChevronRight size={13} />
              <span>My Bookings</span>
            </div>

            <h1 className="font-serif text-4xl font-bold tracking-tight text-[#6e183c] md:text-5xl">
              My Bookings
            </h1>

            <p className="mt-3 text-sm text-[#624351]">
              Track and manage all your bookings in one place.
            </p>

            <div className="mt-4 flex items-center gap-2 pl-12 text-[#a32b5a]">
              <span className="h-px w-9 bg-[#d77b9c]" />
              <Heart size={15} />
              <span className="h-px w-9 bg-[#d77b9c]" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-[1440px] px-4 py-6 md:px-8">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_300px]">
          {/* Left Content */}
          <div className="min-w-0">
            {/* Filters and Search */}
            <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
              <div className="flex flex-wrap items-center gap-2">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => {
                      setActiveFilter(filter)
                      hendleFilter(filter)
                    }}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition ${
                      activeFilter === filter
                        ? "bg-[#861b46] text-white shadow-md shadow-pink-200"
                        : "border border-[#f3dce3] bg-white text-[#87405b] hover:bg-[#fff0f4]"
                    }`}
                  >
                    {filter === "Upcoming" && <Clock3 size={13} />}
                    {filter === "Completed" && <CheckCircle2 size={13} />}
                    {filter === "Cancelled" && <CircleX size={13} />}
                    {filter === "All Bookings" && <CalendarDays size={13} />}
                    {filter} ({filterCounts[filter]})
                  </button>
                ))}
              </div>

              <div className="relative w-full xl:max-w-[260px]">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a77c8d]"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your bookings..."
                  className="w-full rounded-xl border border-[#f0dce3] bg-white py-2.5 pl-9 pr-4 text-xs outline-none transition placeholder:text-[#b89aa7] focus:border-[#b94d78] focus:ring-2 focus:ring-pink-100"
                />
              </div>
            </div>

            {/* Booking Cards */}
            <div className="space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="group grid grid-cols-1 gap-3 rounded-2xl border border-[#f4e4e7] bg-white p-3 shadow-[0_3px_15px_rgba(105,30,61,0.04)] transition hover:border-[#e8b5c8] hover:shadow-md sm:grid-cols-[105px_1fr] md:grid-cols-[115px_1fr_125px_105px] md:items-center"
                  >
                    {/* Image */}
                    <div className="h-36 overflow-hidden rounded-xl sm:h-[105px]">
                      <img
                        src={booking.bookingsImage}
                        alt={booking.bookingTitle}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* Booking Information */}
                    <div className="min-w-0">
                      <h3 className="font-serif text-lg font-bold text-[#852747]">
                        {booking.bookingTitle}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#826b77]">
                        <Camera size={12} />
                        {booking.bookingsCategory}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-xs text-[#826b77]">
                        <MapPin size={12} />
                        {booking.bookingsLocation}
                      </p>

                      <p className="mt-2 flex items-center gap-1 text-xs text-[#816b78]">
                        <Star
                          size={13}
                          fill="#f4aa23"
                          className="text-[#f4aa23]"
                        />
                        <span className="font-semibold text-[#5b3a4b]">
                          {booking.bookingsRating}
                        </span>
                        {/* ({booking.reviews} reviews) */}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="border-t border-[#f5e9ec] pt-3 md:border-l md:border-t-0 md:pl-3 md:pt-0">
                      <p className="flex items-center gap-1.5 text-[11px] text-[#977b88]">
                        <CalendarDays size={13} className="text-[#a62e60]" />
                        Booking Date
                      </p>
                      <p className="mt-1 text-xs font-semibold text-[#563246]">
                        {booking.bookingsDate}
                      </p>
                      <p className="mt-1 text-xs text-[#856e7b]">
                        {booking.bookingsTime}
                      </p>
                    </div>

                    {/* Price and Status */}
                    <div className="flex items-center justify-between border-t border-[#f5e9ec] pt-3 md:flex-col md:items-start md:border-0 md:pt-0">
                      <div>
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold ${statusStyles[booking.bookingStatus]}`}
                        >
                          {booking.bookingStatus}
                        </span>

                        <p className="mt-2 font-serif text-xl font-bold text-[#551b38]">
                          ৳{booking.bookingsPrice}
                        </p>
                      </div>

                      <button
                        // onClick={() => setSelectedBooking(booking)}
                        className="flex items-center gap-1 rounded-full border border-[#c34c79] px-3 py-1.5 text-[11px] font-semibold text-[#9a2855] transition hover:bg-[#8b1e49] hover:text-white md:mt-1"
                      >
                        View Details
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#e8b8c9] bg-white py-16 text-center">
                  <CalendarDays size={35} className="mx-auto text-[#d28ba7]" />
                  <h3 className="mt-3 font-serif text-lg font-bold text-[#792b4b]">
                    No bookings found
                  </h3>
                  <p className="mt-1 text-xs text-[#987888]">
                    Try changing your search or filter.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-4">
            {/* Booking Summary */}
            <div className="rounded-2xl border border-[#f2dfe5] bg-white p-5 shadow-[0_4px_20px_rgba(105,30,61,0.04)]">
              <h3 className="flex items-center gap-2 font-serif text-lg font-bold text-[#742441]">
                <BarChart3 size={19} className="text-[#9d2855]" />
                Booking Summary
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-y-5">
                <SummaryItem value={bookings.length} label="Total Bookings" />
                <SummaryItem value={upcomingCount} label="Upcoming" />
                <SummaryItem value={completedCount} label="Completed" />
                <SummaryItem value={cancelledCount} label="Cancelled" />
              </div>
            </div>

            {/* Help Card */}
            <div className="relative min-h-[270px] overflow-hidden rounded-2xl border border-[#f4dce3] bg-gradient-to-b from-[#fff0f0] via-[#ffe9eb] to-[#f8d9de] p-5 text-center">
              <Heart size={23} className="mx-auto text-[#8f204d]" />

              <h3 className="mt-3 font-serif text-xl font-bold text-[#76213f]">
                Need Help?
              </h3>

              <p className="mx-auto mt-2 max-w-[190px] text-xs leading-5 text-[#826271]">
                Our support team is here to assist you anytime.
              </p>

              <button className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#851d48] px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-[#a52e5e]">
                <Headphones size={14} />
                Contact Support
                <ChevronRight size={13} />
              </button>

              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=600"
                alt="Beautiful pink flowers"
                className="absolute bottom-0 left-0 h-[105px] w-full object-cover object-center opacity-90"
              />
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function SummaryItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="font-serif text-2xl font-bold text-[#54213b]">{value}</p>
      <p className="mt-1 text-[11px] text-[#947a87]">{label}</p>
    </div>
  );
}
