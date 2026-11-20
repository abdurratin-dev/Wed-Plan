"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  ChartColumn,
  ChevronRight,
  Clock,
  Heart,
  LifeBuoy,
  MapPin,
  Search,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BookingsData } from "@/types/apidata";

type TabKey = "all" | "upcoming" | "completed" | "cancelled";
type StatusKey = "upcoming" | "confirmed" | "completed" | "cancelled";

const TABS: { key: TabKey; label: string; icon: typeof CalendarDays }[] = [
  { key: "all", label: "All Bookings", icon: CalendarDays },
  { key: "upcoming", label: "Upcoming", icon: Clock },
  { key: "completed", label: "Completed", icon: BadgeCheck },
  { key: "cancelled", label: "Cancelled", icon: X },
];

const STATUS_STYLE: Record<StatusKey, string> = {
  upcoming:
    "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  confirmed:
    "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1d4ed8]/25 dark:text-[#93c5fd]",
  completed:
    "bg-[#ede9fe] text-[#6d28d9] dark:bg-[#6d28d9]/25 dark:text-[#c4b5fd]",
  cancelled: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
};

const STATUS_LABEL: Record<StatusKey, string> = {
  upcoming: "Upcoming",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

/** "Upcoming" covers confirmed slots too — both are still in the future. */
const matchesTab = (status: StatusKey, tab: TabKey) =>
  tab === "all" ||
  status === tab ||
  (tab === "upcoming" && status === "confirmed");

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

/** "2026-11-28" -> "Nov 28, 2026" */
const formatDate = (value: string) => {
  const [y, m, d] = (value || "").split("-").map(Number);
  if (!y || !m || !d) return value || "Date to be confirmed";
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/** "15:08" -> "03:08 PM" */
const formatTime = (value: string) => {
  const [rawHours, rawMinutes] = (value || "").split(":").map(Number);
  if (Number.isNaN(rawHours) || Number.isNaN(rawMinutes)) {
    return value || "Time to be confirmed";
  }
  const period = rawHours >= 12 ? "PM" : "AM";
  const hours = rawHours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${String(rawMinutes).padStart(2, "0")} ${period}`;
};

/** The API sends `bookingStatus`; fall back to the date for older records. */
const resolveStatus = (booking: BookingsData): StatusKey => {
  const explicit = (booking.bookingStatus || "").toLowerCase();
  if (explicit === "upcoming" || explicit === "confirmed") return explicit;
  if (explicit === "completed" || explicit === "cancelled") return explicit;

  const [year, month, day] = (booking.bookingsDate || "").split("-").map(Number);
  if (!year || !month || !day) return "upcoming";
  const bookingDay = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return bookingDay < today ? "completed" : "upcoming";
};

type Row = { booking: BookingsData; status: StatusKey };

export default function CustomerBookings({
  bookings,
}: {
  bookings: BookingsData[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");

  // The API answers with an error object when the session/token is invalid.
  const loadError = !Array.isArray(bookings);

  const rows = useMemo<Row[]>(() => {
    if (!Array.isArray(bookings)) return [];
    return bookings
      .map((booking) => ({ booking, status: resolveStatus(booking) }))
      .sort((a, b) =>
        (b.booking.bookingsDate || "").localeCompare(
          a.booking.bookingsDate || "",
        ),
      );
  }, [bookings]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      upcoming: rows.filter((row) => matchesTab(row.status, "upcoming")).length,
      completed: rows.filter((row) => row.status === "completed").length,
      cancelled: rows.filter((row) => row.status === "cancelled").length,
    }),
    [rows],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (!matchesTab(row.status, activeTab)) return false;
      if (!needle) return true;
      const { booking } = row;
      const haystack = [
        booking.bookingTitle,
        booking.bookingsCategory,
        booking.bookingsLocation,
        booking.bookingsUnit,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [rows, activeTab, query]);

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

        <div className="mx-auto w-full max-w-7xl px-4 pt-9 pb-9 sm:px-6 lg:px-10 lg:pt-14 lg:pb-12">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-[#8a7a80] dark:text-[#9b8792]"
          >
            <Link
              href="/"
              className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
            >
              Home
            </Link>
            <ChevronRight size={13} className="text-[#c4b4ba] dark:text-[#6f5c66]" />
            <span aria-current="page" className="text-[#4a3a41] dark:text-[#d5c1ca]">
              My Bookings
            </span>
          </nav>

          <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            My Bookings
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            Track and manage all your bookings in one place.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-px w-16 bg-[#a52b50]/40 sm:w-24 dark:bg-[#ff9bb9]/40"
            />
            <Heart
              size={14}
              aria-hidden="true"
              className="text-[#a52b50] dark:text-[#ff9bb9]"
            />
            <span
              aria-hidden="true"
              className="h-px w-16 bg-[#a52b50]/40 sm:w-24 dark:bg-[#ff9bb9]/40"
            />
          </div>
        </div>
      </div>

      {/* ---------- Toolbar: tabs + search ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filter bookings"
            className="flex flex-wrap gap-2"
          >
            {TABS.map(({ key, label, icon: Icon }) => {
              const active = activeTab === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-[0.78rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                    active
                      ? "bg-[#720e32] text-white shadow-md focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                      : "border border-[#f1ded7] bg-white text-[#6b5a61] hover:border-[#e3c3bd] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 dark:border-white/10 dark:bg-[#1e131a] dark:text-[#c8b3bd] dark:hover:border-white/20 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
                  )}
                >
                  <Icon size={14} />
                  {label}
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums",
                      active
                        ? "bg-white/20 text-white"
                        : "bg-[#fdeef2] text-[#a52b50] dark:bg-[#a52b50]/20 dark:text-[#ff9bb9]",
                    )}
                  >
                    {counts[key]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full lg:w-72">
            <Search
              size={16}
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#a89a9f] dark:text-[#8d7a84]"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your bookings..."
              aria-label="Search your bookings"
              className="w-full rounded-xl border border-[#eee2dd] bg-white py-3 pr-9 pl-10 text-sm text-[#2b0713] shadow-sm outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 text-[#a89a9f] transition hover:text-[#720e32] dark:text-[#8d7a84] dark:hover:text-[#ff9bb9]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Bookings + sidebar ---------- */}
      <div className="mx-auto mt-5 grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10">
        <section className="min-w-0 space-y-4">
          {loadError && (
            <div className="rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-[#1e131a]">
              <LifeBuoy
                size={28}
                aria-hidden="true"
                className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
              />
              <h2 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                We couldn&apos;t load your bookings
              </h2>
              <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
                Please sign in again and refresh the page.
              </p>
              <Link
                href="/sign-in"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#720e32] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                Sign In
                <ArrowRight size={15} />
              </Link>
            </div>
          )}

          {!loadError && visible.length > 0 ? (
            visible.map(({ booking, status }) => {
              const rating =
                typeof booking.bookingsRating === "number" &&
                booking.bookingsRating > 0
                  ? booking.bookingsRating
                  : null;
              return (
                <article
                  key={booking._id}
                  className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] transition hover:border-[#e3c3bd] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                    {/* Image + service info */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#f6ece8] sm:size-24 dark:bg-[#241720]">
                        {booking.bookingsImage ? (
                          <Image
                            src={booking.bookingsImage}
                            alt={booking.bookingTitle}
                            fill
                            sizes="96px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[#c4b4ba] dark:text-[#6f5c66]">
                            <Camera size={22} />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <h2 className="font-heading truncate text-lg leading-snug font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                          {booking.bookingTitle}
                        </h2>

                        <p className="mt-1.5 flex items-center gap-1.5 truncate text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                          <Camera
                            size={13}
                            className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
                          />
                          {booking.bookingsCategory
                            ? capitalize(booking.bookingsCategory)
                            : "Service"}
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 truncate text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                          <MapPin
                            size={13}
                            className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
                          />
                          {booking.bookingsLocation || "Location to be confirmed"}
                        </p>

                        {rating !== null && (
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#6b5a61] dark:text-[#c8b3bd]">
                            <Star
                              size={13}
                              className="fill-[#f5b301] text-[#f5b301]"
                            />
                            <span className="font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                              {rating.toFixed(1)}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Date · price · status */}
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4 xl:justify-end">
                      <div>
                        <p className="flex items-center gap-1.5 text-[0.66rem] font-bold tracking-wide text-[#a52b50] uppercase dark:text-[#ff9bb9]">
                          <CalendarDays size={13} />
                          Booking Date
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                          {formatDate(booking.bookingsDate)}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                          <Clock size={12} />
                          {formatTime(booking.bookingsTime)}
                        </p>
                        {booking.bookingsUnit && (
                          <p className="mt-0.5 text-[0.68rem] text-[#a89a9f] dark:text-[#8d7a84]">
                            Unit: {booking.bookingsUnit}
                          </p>
                        )}
                      </div>

                      {booking.bookingsPrice && (
                        <p className="text-lg font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                          ৳ {booking.bookingsPrice}
                        </p>
                      )}

                      <div className="flex flex-col items-start gap-2.5 xl:items-end">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold",
                            STATUS_STYLE[status],
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className="size-1.5 rounded-full bg-current"
                          />
                          {STATUS_LABEL[status]}
                        </span>
                        <Link
                          href={`/services/${booking.bookingsId}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3c3bd] bg-white px-3.5 py-2 text-[0.72rem] font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30"
                        >
                          View Details
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            !loadError && (
              <div className="rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-[#1e131a]">
                <CalendarDays
                  size={30}
                  aria-hidden="true"
                  className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
                />
                <h2 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                  {rows.length === 0 ? "No bookings yet" : "No bookings found"}
                </h2>
                <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
                  {rows.length === 0
                    ? "Once you book a service, it will show up here."
                    : "Try a different search term or switch tabs."}
                </p>
                {rows.length === 0 && (
                  <Link
                    href="/services"
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#720e32] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#570a26] dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
                  >
                    Browse Services
                    <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            )
          )}
        </section>

        {/* ---------- Sidebar ---------- */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Booking summary */}
          <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
            <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-[#2b0713] dark:text-[#ffeaf1]">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] dark:bg-[#a52b50]/15">
                <ChartColumn
                  size={16}
                  className="text-[#a52b50] dark:text-[#ff9bb9]"
                />
              </span>
              Booking Summary
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Total Bookings", value: counts.all },
                { label: "Upcoming", value: counts.upcoming },
                { label: "Completed", value: counts.completed },
                { label: "Cancelled", value: counts.cancelled },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#fdfbfa] px-3 py-3.5 text-center dark:bg-[#241720]"
                >
                  <dd className="text-xl leading-none font-extrabold tabular-nums text-[#720e32] dark:text-[#ff9bb9]">
                    {item.value}
                  </dd>
                  <dt className="mt-1.5 text-[0.68rem] font-medium text-[#8a7a80] dark:text-[#9b8792]">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </section>

          {/* Need help */}
          <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffe4ec] via-[#fff4f7] to-[#ffd9e6] p-6 text-center dark:from-[#2a1620] dark:via-[#241720] dark:to-[#2f1a25]">
            <Heart
              aria-hidden="true"
              size={80}
              className="absolute -top-5 -right-5 rotate-12 text-white/50 dark:text-white/5"
            />
            <Heart
              size={26}
              aria-hidden="true"
              className="relative mx-auto fill-[#a52b50] text-[#a52b50] dark:fill-[#ff9bb9] dark:text-[#ff9bb9]"
            />
            <h2 className="font-heading relative mt-2 text-xl font-semibold text-[#720e32] dark:text-[#ff9bb9]">
              Need Help?
            </h2>
            <p className="relative mt-2 text-xs leading-relaxed font-medium text-[#a52b50] dark:text-[#c8b3bd]">
              Our support team is here to assist you anytime.
            </p>
            <Link
              href="/contact"
              className="relative mt-4 inline-flex items-center gap-2 rounded-full bg-[#720e32] px-5 py-2.5 text-[0.75rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
            >
              <LifeBuoy size={14} />
              Contact Support
              <ArrowRight size={13} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
