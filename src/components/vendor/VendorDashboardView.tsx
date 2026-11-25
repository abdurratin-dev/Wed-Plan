"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CalendarDays,
  Camera,
  ChartColumn,
  ChevronDown,
  ChevronRight,
  CircleCheckBig,
  Clock,
  LifeBuoy,
  MapPin,
  Star,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingsData, ITransactions, ServiceData } from "@/types/apidata";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DAY = 86_400_000;

type RangeKey = "7D" | "30D" | "90D" | "1Y";

const RANGE_CFG: Record<RangeKey, { days: number; points: number }> = {
  "7D": { days: 7, points: 7 },
  "30D": { days: 30, points: 6 },
  "90D": { days: 90, points: 6 },
  "1Y": { days: 365, points: 12 },
};

const RANGE_KEYS = Object.keys(RANGE_CFG) as RangeKey[];
const WINDOWS = [7, 30, 90, 365];

/** Mongo ObjectIds embed their creation time in the first 4 bytes. */
const oidTime = (id?: string): number | null => {
  if (!id || !/^[0-9a-f]{24}$/i.test(id)) return null;
  const seconds = parseInt(id.slice(0, 8), 16);
  return Number.isFinite(seconds) ? seconds * 1000 : null;
};

const parseTime = (value?: string): number | null => {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
};

/** When a record was created — `createdAt` when the API sends one. */
const createdAt = (doc: { createdAt?: string; _id: string }): number | null =>
  parseTime(doc.createdAt) ?? oidTime(doc._id);

const bookingTime = (booking: BookingsData): number | null =>
  oidTime(booking._id) ?? parseTime(booking.bookingsDate);

/** "৳5,000" / "5000" -> 5000 (0 when the value isn't a number). */
const priceToNumber = (value: string) => {
  const digits = (value || "").replace(/[^\d.]/g, "");
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isPaid = (transaction: ITransactions) =>
  (transaction.paymentStatus || "").toLowerCase() === "paid";

/** "2026-12-25" -> "Dec 25, 2026" */
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

/** Smallest "nice" number >= value, used for chart tick steps. */
const niceCeil = (value: number) => {
  if (value <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(value)));
  const candidates = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10];
  for (const candidate of candidates) {
    if (candidate * pow >= value) return candidate * pow;
  }
  return 10 * pow;
};

const countBelow = (times: number[], end: number) => {
  let count = 0;
  for (const time of times) if (time < end) count++;
  return count;
};

const average = (values: number[]) =>
  values.length
    ? values.reduce((sum, value) => sum + value, 0) / values.length
    : 0;

/** Cumulative totals over `days`, used for the card sparklines. */
const sparkPath = (
  times: number[],
  days: number,
  now: number,
  width = 104,
  height = 38,
) => {
  const end = now;
  const start = end - days * DAY;
  const step = (end - start) / 11;
  const values: number[] = [];
  for (let i = 0; i < 12; i++) {
    values.push(countBelow(times, start + step * (i + 1)));
  }
  const max = Math.max(...values, 1);
  return values
    .map((value, index) => {
      const x = (index / 11) * width;
      const y = height - 3 - (value / max) * (height - 9);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

/** Min/max normalised polyline for value series (e.g. average rating). */
const valuesPath = (values: number[], width = 104, height = 38) => {
  if (values.length === 0) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  return values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * width;
      const y = height - 3 - ((value - min) / span) * (height - 9);
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

/** Catmull-Rom -> cubic bezier, so the lines flow like the design. */
const smoothPath = (points: { x: number; y: number }[]) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M${points[0].x},${points[0].y}`;
  let path = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    path += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }
  return path;
};

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

const STATUS_STYLE: Record<string, string> = {
  upcoming:
    "bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 dark:text-[#fbbf24]",
  confirmed:
    "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1d4ed8]/25 dark:text-[#93c5fd]",
  completed:
    "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  cancelled:
    "bg-[#fee2e2] text-[#d6455f] dark:bg-[#fee2e2]/10 dark:text-[#ff8fa3]",
};

/* ------------------------------------------------------------------ */
/*  Bookings overview chart                                            */
/* ------------------------------------------------------------------ */

const CHART_HEIGHT = 260;
const PAD = { top: 18, right: 14, bottom: 30, left: 42 };

function BookingsOverview({
  bookings,
  now,
}: {
  bookings: BookingsData[];
  now: number;
}) {
  const [range, setRange] = useState<RangeKey>("30D");
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    const element = wrapRef.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver((entries) => {
      const next = entries[0]?.contentRect.width ?? 0;
      if (next > 0) setWidth(next);
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Bookings created inside each bucket of the chosen range.
  const data = useMemo(() => {
    const cfg = RANGE_CFG[range];
    const end = now;
    const start = end - cfg.days * DAY;
    const step = (end - start) / cfg.points;
    const times = bookings
      .map((booking) => bookingTime(booking))
      .filter((time): time is number => time !== null);

    return Array.from({ length: cfg.points }, (_, index) => {
      const bucketStart = start + step * index;
      const bucketEnd = bucketStart + step;
      const labelDate = new Date(bucketEnd);
      const label =
        cfg.days > 90
          ? labelDate.toLocaleDateString("en-US", { month: "short" })
          : labelDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
      return {
        label,
        count: times.filter((time) => time >= bucketStart && time < bucketEnd)
          .length,
      };
    });
  }, [range, bookings, now]);

  const geometry = useMemo(() => {
    const plotW = Math.max(width - PAD.left - PAD.right, 10);
    const plotH = CHART_HEIGHT - PAD.top - PAD.bottom;
    const max = Math.max(...data.map((point) => point.count), 4);
    const tickStep = niceCeil(max / 4);
    const yMax = tickStep * 4;
    const ticks = [0, 1, 2, 3, 4].map((index) => index * tickStep);

    const points = data.map((point, index) => ({
      x:
        PAD.left +
        (data.length === 1 ? plotW / 2 : (index / (data.length - 1)) * plotW),
      y: PAD.top + (1 - point.count / yMax) * plotH,
    }));

    return { plotW, plotH, ticks, points, yMax };
  }, [data, width]);

  const baseY = PAD.top + geometry.plotH;
  const hasBookings = bookings.length > 0;

  return (
    <section className="min-w-0 rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a] lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <ChartColumn size={16} />
          </span>
          Bookings Overview
        </h2>

        <div
          role="tablist"
          aria-label="Bookings range"
          className="flex gap-1 rounded-xl border border-[#f1ded7] bg-[#fdfbfa] p-1 dark:border-white/10 dark:bg-white/5"
        >
          {RANGE_KEYS.map((key) => {
            const active = range === key;
            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setRange(key)}
                className={cn(
                  "rounded-lg px-3.5 py-1.5 text-[0.72rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                  active
                    ? "bg-[#720e32] text-white shadow-sm focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                    : "text-[#8a7a80] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 dark:text-[#c8b3bd] dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
                )}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      {hasBookings ? (
        <div ref={wrapRef} className="mt-4 w-full">
          <svg
            width={width}
            height={CHART_HEIGHT}
            viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
            role="img"
            aria-label="Booking requests over the selected range"
            className="block"
          >
            <defs>
              <linearGradient id="bookings-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a52b50" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#a52b50" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Horizontal grid + y-axis labels */}
            {geometry.ticks.map((tick, index) => {
              const y = baseY - (index / 4) * geometry.plotH;
              return (
                <g key={tick}>
                  <line
                    x1={PAD.left}
                    x2={width - PAD.right}
                    y1={y}
                    y2={y}
                    stroke="#f1ded7"
                    strokeWidth="1"
                    strokeDasharray={index === 0 ? "0" : "4 5"}
                    className="dark:stroke-white/10"
                  />
                  <text
                    x={PAD.left - 9}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize="11"
                    className="fill-[#a89a9f] dark:fill-[#9b8792]"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {data.map((point, index) => (
              <text
                key={`${point.label}-${index}`}
                x={geometry.points[index]?.x ?? PAD.left}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                fontSize="11"
                className="fill-[#a89a9f] dark:fill-[#9b8792]"
              >
                {point.label}
              </text>
            ))}

            {/* Area + line + points */}
            {geometry.points.length > 0 && (
              <g>
                <path
                  d={`${smoothPath(geometry.points)} L${geometry.points[geometry.points.length - 1].x},${baseY} L${geometry.points[0].x},${baseY} Z`}
                  fill="url(#bookings-fill)"
                />
                <path
                  d={smoothPath(geometry.points)}
                  fill="none"
                  stroke="#a52b50"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="dark:stroke-[#ff9bb9]"
                />
                {geometry.points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#a52b50"
                    className="dark:fill-[#ff9bb9]"
                  />
                ))}
              </g>
            )}
          </svg>
        </div>
      ) : (
        <div
          ref={wrapRef}
          className="mt-4 flex h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#e3c3bd] text-center dark:border-white/15"
        >
          <CalendarDays
            size={26}
            aria-hidden="true"
            className="text-[#c4b4ba] dark:text-[#6f5c66]"
          />
          <p className="mt-2 text-sm font-semibold text-[#4a3a41] dark:text-[#e8dfe3]">
            No bookings yet
          </p>
          <p className="mt-1 text-xs text-[#8a7a80] dark:text-[#9b8792]">
            Booking activity will appear here once clients book your services.
          </p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  My services                                                        */
/* ------------------------------------------------------------------ */

function MyServices({ services }: { services: ServiceData[] }) {
  const topServices = services.slice(0, 4);

  return (
    <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <Briefcase size={16} />
          </span>
          My Services
        </h2>
        <Link
          href="/dashboard/vendor/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e2249] transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#f9a8c4]"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      {topServices.length > 0 ? (
        <div className="mt-4 space-y-3">
          {topServices.map((service) => {
            const active = service.status === "Active";
            const reviewCount = service.reviews?.length ?? 0;
            return (
              <Link
                key={service._id}
                href="/dashboard/vendor/services"
                className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition hover:border-[#f6e3ea] hover:bg-[#fef8fa] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:hover:border-white/10 dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30"
              >
                <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f6ece8] sm:w-[70px] dark:bg-[#241720]">
                  {service.imageUrl ? (
                    <Image
                      src={service.imageUrl}
                      alt={service.name}
                      fill
                      sizes="70px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center text-[#c4b4ba] dark:text-[#6f5c66]">
                      <Camera size={16} />
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                    {service.name}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                    <Star
                      size={12}
                      aria-hidden="true"
                      className="shrink-0 fill-[#f59e0b] text-[#f59e0b]"
                    />
                    {(service.rating || 0).toFixed(1)}
                    <span className="text-[#8a7a80] dark:text-[#9b8792]">
                      ({reviewCount} review{reviewCount === 1 ? "" : "s"})
                    </span>
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                    <MapPin size={12} aria-hidden="true" className="shrink-0" />
                    <span className="truncate">
                      {service.location || "Location TBA"}
                    </span>
                  </p>
                </div>

                <span
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[0.7rem] font-bold",
                    active
                      ? "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]"
                      : "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#c8b3bd]",
                  )}
                >
                  {service.status || "Inactive"}
                </span>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-[#8a7a80] dark:text-[#9b8792]">
          No services yet — add your first service to start receiving bookings.
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent booking requests                                            */
/* ------------------------------------------------------------------ */

function RecentBookingRequests({ bookings }: { bookings: BookingsData[] }) {
  const recent = useMemo(
    () =>
      [...bookings]
        .sort(
          (a, b) =>
            (bookingTime(b) ?? 0) - (bookingTime(a) ?? 0) ||
            (b.bookingsDate || "").localeCompare(a.bookingsDate || ""),
        )
        .slice(0, 5),
    [bookings],
  );

  return (
    <section className="min-w-0 rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a] lg:col-span-2">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <CalendarDays size={16} />
          </span>
          Recent Booking Requests
        </h2>
        <Link
          href="/dashboard/vendor/bookings"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e2249] transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#f9a8c4]"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr>
              {["Service", "Customer", "Date & Time", "Status", "Action"].map(
                (head, index) => (
                  <th
                    key={head}
                    className={cn(
                      "bg-[#faf8f9] px-4 py-3 text-sm font-semibold text-[#6b7280] dark:bg-white/5 dark:text-[#a998a1]",
                      index === 0 && "rounded-l-lg",
                      index === 4 && "rounded-r-lg",
                    )}
                  >
                    {head}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {recent.length > 0 ? (
              recent.map((booking) => {
                const status = (
                  booking.bookingStatus || "upcoming"
                ).toLowerCase();
                const initial = (booking.customerName || "?")
                  .trim()
                  .charAt(0)
                  .toUpperCase();
                return (
                  <tr
                    key={booking._id || 678}
                    className="border-b border-[#f1ecef] last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-[#f6ece8] dark:bg-[#241720]">
                          {booking.bookingsImage ? (
                            <Image
                              src={booking.bookingsImage}
                              alt={booking.bookingTitle}
                              fill
                              sizes="40px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-[#c4b4ba] dark:text-[#6f5c66]">
                              <Camera size={16} />
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                          {booking.bookingTitle}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="relative size-8 shrink-0 overflow-hidden rounded-full bg-[#fce7f3] dark:bg-[#8e2249]/30">
                          {booking.customerImg ? (
                            <Image
                              src={booking.customerImg}
                              alt={booking.customerName || "Customer"}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          ) : (
                            <span className="flex size-full items-center justify-center text-xs font-bold text-[#8e2249] dark:text-[#ff9bb9]">
                              {initial}
                            </span>
                          )}
                        </div>
                        <p className="truncate text-sm font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                          {booking.customerName || "Unknown customer"}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                        {formatDate(booking.bookingsDate)}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                        <Clock size={12} aria-hidden="true" />
                        {formatTime(booking.bookingsTime)}
                      </p>
                    </td>

                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold",
                          STATUS_STYLE[status] ??
                            "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#c8b3bd]",
                        )}
                      >
                        {status === "completed" || status === "confirmed" ? (
                          <CircleCheckBig size={12} aria-hidden="true" />
                        ) : status === "cancelled" ? (
                          <X size={12} aria-hidden="true" />
                        ) : (
                          <Clock size={12} aria-hidden="true" />
                        )}
                        {capitalize(booking.bookingStatus || "upcoming")}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <Link
                        href="/dashboard/vendor/bookings"
                        className="inline-flex items-center rounded-lg bg-[#720e32] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-sm text-[#8a7a80] dark:text-[#9b8792]"
                >
                  No booking requests yet — they will show up here as soon as
                  clients book.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Quick stats                                                        */
/* ------------------------------------------------------------------ */

function QuickStats({ bookings }: { bookings: BookingsData[] }) {
  const counts = useMemo(() => {
    const tally = { upcoming: 0, completed: 0, cancelled: 0 };
    for (const booking of bookings) {
      const status = (booking.bookingStatus || "").toLowerCase();
      if (status in tally) tally[status as keyof typeof tally]++;
    }
    return tally;
  }, [bookings]);

  const rows = [
    {
      label: "Upcoming Bookings",
      count: counts.upcoming,
      Icon: CalendarDays,
      icon: "bg-[#ede9fe] text-[#7c3aed] dark:bg-[#7c3aed]/20 dark:text-[#a78bfa]",
    },
    {
      label: "Completed Bookings",
      count: counts.completed,
      Icon: CircleCheckBig,
      icon: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
    },
    {
      label: "Cancelled Bookings",
      count: counts.cancelled,
      Icon: X,
      icon: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/15 dark:text-[#ff8fa3]",
    },
  ];

  return (
    <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/25 dark:text-[#fbbf24]">
          <Trophy size={16} />
        </span>
        Quick Stats
      </h2>

      <div className="mt-4 divide-y divide-[#f1ecef] dark:divide-white/10">
        {rows.map(({ label, count, Icon, icon }) => (
          <Link
            key={label}
            href="/dashboard/vendor/bookings"
            className="group flex items-center gap-3 py-3.5 transition hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:focus-visible:ring-[#ff9bb9]/30"
          >
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-lg",
                icon,
              )}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#4a3a41] dark:text-[#e8dfe3]">
              {label}
            </span>
            <span className="text-sm font-extrabold tabular-nums text-[#2b0713] dark:text-[#ffeaf1]">
              {count}
            </span>
            <ChevronRight
              size={16}
              aria-hidden="true"
              className="text-[#c4b4ba] transition group-hover:translate-x-0.5 dark:text-[#6f5c66]"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

type Props = {
  bookings: BookingsData[];
  services: ServiceData[];
  transactions: ITransactions[];
  userName: string;
  now: number;
};

export default function VendorDashboardView({
  bookings,
  services,
  transactions,
  userName,
  now,
}: Props) {
  const [windowDays, setWindowDays] = useState(30);

  const bookignsData = !Array.isArray(bookings) ? [] : bookings;
  const servicesData = !Array.isArray(services) ? [] : services;
  const transactionsData = !Array.isArray(transactions) ? [] : transactions;
  // The API answers with an error object when the session/token is invalid.
  const loadError = !(
    Array.isArray(bookignsData) &&
    Array.isArray(servicesData) &&
    Array.isArray(transactionsData)
  );

  const bookingsList = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings],
  );
  const servicesList = useMemo(
    () => (Array.isArray(services) ? services : []),
    [services],
  );

  // Earnings only count this vendor's bookings (the endpoint is platform-wide).
  const vendorTransactions = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    const bookingIds = new Set(
      bookingsList.map((booking) => booking._id).filter(Boolean),
    );
    return transactions.filter((transaction) =>
      bookingIds.has(transaction.bookingId),
    );
  }, [transactions, bookingsList]);

  const stats = useMemo(() => {
    const start = now - windowDays * DAY;
    const previousStart = now - 2 * windowDays * DAY;

    /** % change of events between the previous and the current window. */
    const growth = (times: number[]) => {
      let current = 0;
      let previous = 0;
      for (const time of times) {
        if (time >= start) current++;
        else if (time >= previousStart) previous++;
      }
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const serviceTimes = servicesList
      .map((service) => createdAt(service))
      .filter((time): time is number => time !== null);
    const bookingTimes = bookingsList
      .map((booking) => bookingTime(booking))
      .filter((time): time is number => time !== null);

    const bookingTimeById = new Map(
      bookingsList.map(
        (booking) => [booking._id, bookingTime(booking)] as const,
      ),
    );
    const earningEvents = vendorTransactions
      .filter((transaction) => isPaid(transaction))
      .map((transaction) => ({
        time:
          bookingTimeById.get(transaction.bookingId) ??
          oidTime(transaction._id),
        amount: priceToNumber(transaction.price),
      }))
      .filter(
        (event): event is { time: number; amount: number } =>
          event.time !== null,
      );

    const earningTimes = earningEvents.map((event) => event.time);
    const earnings = earningEvents.reduce(
      (sum, event) => sum + event.amount,
      0,
    );
    const earningsGrowth = (() => {
      let current = 0;
      let previous = 0;
      for (const event of earningEvents) {
        if (event.time >= start) current += event.amount;
        else if (event.time >= previousStart) previous += event.amount;
      }
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    })();

    // Average rating across the vendor's services.
    const ratings = servicesList
      .map((service) => Number(service.rating))
      .filter((rating) => Number.isFinite(rating) && rating > 0);
    const avgRating = average(ratings);

    // Rating trend: bookings made in each window, comparing their ratings.
    const windowRatings = (from: number, to: number) =>
      bookingsList
        .filter((booking) => {
          const time = bookingTime(booking);
          return time !== null && time >= from && time < to;
        })
        .map((booking) => Number(booking.bookingsRating))
        .filter((rating) => Number.isFinite(rating) && rating > 0);
    const currentRatings = windowRatings(start, now);
    const previousRatings = windowRatings(previousStart, start);
    const ratingDelta =
      currentRatings.length > 0 && previousRatings.length > 0
        ? Math.round(
            (average(currentRatings) - average(previousRatings)) * 10,
          ) / 10
        : null;

    // Per-bucket average rating sparkline for the rating card.
    const ratingSpark = (() => {
      if (ratings.length === 0) return [];
      const step = (windowDays * DAY) / 11;
      const values: number[] = [];
      let last = avgRating;
      for (let index = 0; index < 12; index++) {
        const bucketStart = start + step * index;
        const bucketEnd = bucketStart + step;
        const bucket = windowRatings(bucketStart, bucketEnd);
        if (bucket.length > 0) last = average(bucket);
        values.push(last);
      }
      return values;
    })();

    return [
      {
        label: "Total Services",
        value: servicesList.length,
        display: servicesList.length.toLocaleString("en-US"),
        trend: growth(serviceTimes),
        trendLabel: `${Math.abs(growth(serviceTimes))}%`,
        card: "border-[#f8dcec] bg-gradient-to-br from-[#fff7fa] to-[#fdeef4] dark:border-[#8e2249]/40 dark:from-[#8e2249]/15 dark:to-[#8e2249]/5",
        icon: "bg-gradient-to-br from-[#f472b6] to-[#db2777]",
        spark: "#ec4899",
        Icon: Briefcase,
        sparkLine: sparkPath(serviceTimes, windowDays, now),
      },
      {
        label: "Total Bookings",
        value: bookingsList.length,
        display: bookingsList.length.toLocaleString("en-US"),
        trend: growth(bookingTimes),
        trendLabel: `${Math.abs(growth(bookingTimes))}%`,
        card: "border-[#ece0fb] bg-gradient-to-br from-[#faf7ff] to-[#f3ecfe] dark:border-[#7c3aed]/40 dark:from-[#7c3aed]/15 dark:to-[#7c3aed]/5",
        icon: "bg-gradient-to-br from-[#a78bfa] to-[#7c3aed]",
        spark: "#8b5cf6",
        Icon: CalendarDays,
        sparkLine: sparkPath(bookingTimes, windowDays, now),
      },
      {
        label: "Average Rating",
        value: avgRating,
        display: ratings.length > 0 ? avgRating.toFixed(1) : "—",
        trend: ratingDelta,
        trendLabel:
          ratingDelta === null ? "" : Math.abs(ratingDelta).toFixed(1),
        card: "border-[#fde4c8] bg-gradient-to-br from-[#fffaf3] to-[#fff3e4] dark:border-[#f97316]/40 dark:from-[#f97316]/15 dark:to-[#f97316]/5",
        icon: "bg-gradient-to-br from-[#fbbf24] to-[#f97316]",
        spark: "#f97316",
        Icon: Star,
        sparkLine: ratingSpark.length > 0 ? valuesPath(ratingSpark) : "",
      },
      {
        label: "Total Earnings",
        value: earnings,
        display: `৳${Math.round(earnings).toLocaleString("en-US")}`,
        trend: earningsGrowth,
        trendLabel: `${Math.abs(earningsGrowth)}%`,
        card: "border-[#fddcd0] bg-gradient-to-br from-[#fff7f4] to-[#ffefe9] dark:border-[#e11d48]/40 dark:from-[#e11d48]/15 dark:to-[#e11d48]/5",
        icon: "bg-gradient-to-br from-[#fb7185] to-[#e11d48]",
        spark: "#f43f5e",
        Icon: Wallet,
        sparkLine: sparkPath(earningTimes, windowDays, now),
      },
    ];
  }, [servicesList, bookingsList, vendorTransactions, windowDays, now]);

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] px-4 py-16 dark:bg-[#160e13]">
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-[#1e131a]">
          <LifeBuoy
            size={28}
            aria-hidden="true"
            className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
          />
          <h1 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
            We couldn&apos;t load the dashboard
          </h1>
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
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] pb-16 dark:bg-[#160e13]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-10">
        {/* ---------- Welcome banner ---------- */}
        <header className="relative isolate overflow-hidden rounded-2xl border border-[#f8dcec] dark:border-[#8e2249]/40">
          <Image
            src="/services-banner.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fce7f3] via-[#fce7f3]/90 to-[#fce7f3]/45 dark:from-[#2a121c] dark:via-[#2a121c]/90 dark:to-[#2a121c]/55" />

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
                <span aria-hidden="true">🤝</span>
                Welcome back, {userName}!
              </h1>
              <p className="mt-2 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
                Manage your services, bookings and grow your business.
              </p>
            </div>

            <div className="relative inline-flex w-fit items-center gap-2 self-start rounded-xl border border-white/70 bg-white px-3.5 py-2.5 shadow-sm sm:self-auto dark:border-white/10 dark:bg-white/5">
              <CalendarDays
                size={15}
                aria-hidden="true"
                className="text-[#a52b50] dark:text-[#ff9bb9]"
              />
              <select
                aria-label="Select date range"
                value={windowDays}
                onChange={(event) => setWindowDays(Number(event.target.value))}
                className="appearance-none bg-transparent pr-6 text-sm font-bold text-[#4a3a41] outline-none dark:text-[#e8dfe3]"
              >
                {WINDOWS.map((days) => (
                  <option key={days} value={days} className="text-[#111827]">
                    {days === 365 ? "Last 12 Months" : `Last ${days} Days`}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                aria-hidden="true"
                className="pointer-events-none absolute right-3 text-[#8a7a80]"
              />
            </div>
          </div>
        </header>

        {/* ---------- Stat cards ---------- */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.Icon;
            const showTrend = stat.trend !== null && stat.trend !== undefined;
            const positive = (stat.trend ?? 0) >= 0;
            return (
              <div
                key={stat.label}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5 shadow-[0_16px_36px_-30px_rgba(114,14,50,0.55)] dark:shadow-none",
                  stat.card,
                )}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-md",
                      stat.icon,
                    )}
                  >
                    <Icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[1.65rem] leading-none font-extrabold tracking-tight text-[#2b0713] dark:text-[#ffeaf1]">
                      {stat.display}
                    </p>
                    <p className="mt-2 text-[13px] font-medium whitespace-nowrap text-[#8a7a80] dark:text-[#c8b3bd]">
                      {stat.label}
                    </p>
                  </div>
                </div>

                {showTrend && (
                  <span
                    className={cn(
                      "absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold",
                      positive
                        ? "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/25 dark:text-[#4ade80]"
                        : "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
                    )}
                  >
                    {positive ? (
                      <TrendingUp size={12} aria-hidden="true" />
                    ) : (
                      <TrendingDown size={12} aria-hidden="true" />
                    )}
                    {stat.trendLabel}
                  </span>
                )}

                {stat.sparkLine && (
                  <svg
                    width={104}
                    height={38}
                    viewBox="0 0 104 38"
                    aria-hidden="true"
                    className="absolute right-2 bottom-2 opacity-55"
                  >
                    <path
                      d={stat.sparkLine}
                      fill="none"
                      stroke={stat.spark}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            );
          })}
        </div>

        {/* ---------- Chart + my services ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <BookingsOverview bookings={bookingsList} now={now} />
          <MyServices services={servicesList} />
        </div>

        {/* ---------- Recent requests + quick stats ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <RecentBookingRequests bookings={bookingsList} />
          <QuickStats bookings={bookingsList} />
        </div>
      </div>
    </div>
  );
}
