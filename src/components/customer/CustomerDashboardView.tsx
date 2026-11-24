"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Camera,
  ChartColumn,
  CircleCheckBig,
  Clock,
  Heart,
  LifeBuoy,
  PenLine,
  Star,
  TrendingDown,
  TrendingUp,
  User,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BookingsData, ServiceData } from "@/types/apidata";

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

/** Trends compare the last 30 days with the 30 days before that. */
const WINDOW_DAYS = 30;

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

const bookingTime = (booking: BookingsData): number | null =>
  oidTime(booking._id) ?? parseTime(booking.bookingsDate);

/** "৳5,000" / "5000" -> 5000 (0 when the value isn't a number). */
const priceToNumber = (value: string) => {
  const digits = (value || "").replace(/[^\d.]/g, "");
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

/** "5000" -> "৳5,000" */
const formatPrice = (value: string) => {
  const amount = priceToNumber(value);
  return amount > 0 ? `৳${amount.toLocaleString("en-US")}` : value || "—";
};

const UNIT_LABEL: Record<string, string> = {
  parhour: "hour",
  parday: "day",
  parweek: "week",
  parmonth: "month",
  perhour: "hour",
  perday: "day",
  perweek: "week",
  permonth: "month",
};

const unitLabel = (unit?: string) => {
  if (!unit) return "";
  const key = unit.toLowerCase();
  if (UNIT_LABEL[key]) return UNIT_LABEL[key];
  return unit.replace(/^par|^per/i, "");
};

const isPaid = (booking: BookingsData) =>
  (booking.paymentStatus || "").toLowerCase() === "paid";

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
  upcoming: "bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 dark:text-[#fbbf24]",
  confirmed: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1d4ed8]/25 dark:text-[#93c5fd]",
  completed: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  cancelled: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#fee2e2]/10 dark:text-[#ff8fa3]",
};

const PAYMENT_STYLE: Record<string, string> = {
  paid: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  unpaid: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#fee2e2]/20 dark:text-[#ff8fa3]",
  pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#fef3c7]/10 dark:text-[#fbbf24]",
};

/* ------------------------------------------------------------------ */
/*  Booking overview chart                                             */
/* ------------------------------------------------------------------ */

const CHART_HEIGHT = 260;
const PAD = { top: 18, right: 14, bottom: 30, left: 42 };

function BookingOverview({
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
        (data.length === 1
          ? plotW / 2
          : (index / (data.length - 1)) * plotW),
      y: PAD.top + (1 - point.count / yMax) * plotH,
    }));

    return { plotW, plotH, ticks, points, yMax };
  }, [data, width]);

  const baseY = PAD.top + geometry.plotH;
  const hasBookings = bookings.length > 0;

  return (
    <section className="min-w-0 rounded-2xl border border-[#f8dcec] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <ChartColumn size={16} />
          </span>
          Your Booking Overview
        </h2>

        <div
          role="tablist"
          aria-label="Booking range"
          className="flex gap-1 rounded-xl border border-[#f8dcec] bg-[#fdfbfa] p-1 dark:border-white/10 dark:bg-white/5"
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
            aria-label="Your bookings over the selected range"
            className="block"
          >
            <defs>
              <linearGradient
                id="customer-bookings-fill"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
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
                    stroke="#f8dcec"
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
                    fill="#a89a9f"
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
                fill="#a89a9f"
              >
                {point.label}
              </text>
            ))}

            {/* Area + line + points */}
            {geometry.points.length > 0 && (
              <g>
                <path
                  d={`${smoothPath(geometry.points)} L${geometry.points[geometry.points.length - 1].x},${baseY} L${geometry.points[0].x},${baseY} Z`}
                  fill="url(#customer-bookings-fill)"
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
          className="mt-4 flex h-[220px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-[#f3d5e2] text-center dark:border-white/15"
        >
          <CalendarDays
            size={26}
            aria-hidden="true"
            className="text-[#e6c3d3] dark:text-[#6f5c66]"
          />
          <p className="mt-2 text-sm font-semibold text-[#4a3a41] dark:text-[#e8dfe3]">
            No bookings yet
          </p>
          <p className="mt-1 text-xs text-[#8a7a80] dark:text-[#9b8792]">
            Your booking activity will appear here once you book a service.
          </p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Favorite services                                                  */
/* ------------------------------------------------------------------ */

type FavoriteRow = {
  serviceId: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: string;
  unit: string;
};

function FavoriteServices({ favorites }: { favorites: FavoriteRow[] }) {
  const visible = favorites.slice(0, 4);

  return (
    <section className="rounded-2xl border border-[#f8dcec] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <Heart size={16} />
          </span>
          Your Favorite Services
        </h2>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e2249] transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#f9a8c4]"
        >
          View All
          <ArrowRight size={13} />
        </Link>
      </div>

      {visible.length > 0 ? (
        <div className="mt-4 space-y-2">
          {visible.map((favorite) => (
            <Link
              key={favorite.serviceId || favorite.name}
              href={
                favorite.serviceId
                  ? `/services/${favorite.serviceId}`
                  : "/services"
              }
              className="flex items-center gap-3 rounded-xl border border-transparent p-2 transition hover:border-[#f6e3ea] hover:bg-[#fef8fa] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:hover:border-white/10 dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30"
            >
              <div className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-[#f6ece8] sm:w-[70px] dark:bg-[#241720]">
                {favorite.image ? (
                  <Image
                    src={favorite.image}
                    alt={favorite.name}
                    fill
                    sizes="70px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex size-full items-center justify-center text-[#e6c3d3] dark:text-[#6f5c66]">
                    <Camera size={16} />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                  {favorite.name}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                  <Star
                    size={12}
                    aria-hidden="true"
                    className="shrink-0 fill-[#f59e0b] text-[#f59e0b]"
                  />
                  {(favorite.rating || 0).toFixed(1)}
                  <span className="text-[#8a7a80] dark:text-[#9b8792]">
                    ({favorite.reviews} review{favorite.reviews === 1 ? "" : "s"})
                  </span>
                </p>
                <p className="mt-1 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                  {formatPrice(favorite.price)}
                  {favorite.unit ? ` / ${unitLabel(favorite.unit)}` : ""}
                </p>
              </div>

              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-[#f8dcec] bg-white text-[#f472b6] shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-[#ff9bb9]"
              >
                <Heart size={15} className="fill-current" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-[#f3d5e2] px-4 py-8 text-center dark:border-white/15">
          <Heart
            size={24}
            aria-hidden="true"
            className="text-[#e6c3d3] dark:text-[#6f5c66]"
          />
          <p className="mt-2 text-sm font-semibold text-[#4a3a41] dark:text-[#e8dfe3]">
            No favorites yet
          </p>
          <p className="mt-1 text-xs text-[#8a7a80] dark:text-[#9b8792]">
            Services you book will show up here.
          </p>
        </div>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Recent bookings                                                    */
/* ------------------------------------------------------------------ */

function RecentBookings({ bookings }: { bookings: BookingsData[] }) {
  const recent = useMemo(
    () =>
      [...bookings]
        .sort((a, b) =>
          (b.bookingsDate || "").localeCompare(a.bookingsDate || "") ||
          (bookingTime(b) ?? 0) - (bookingTime(a) ?? 0),
        )
        .slice(0, 5),
    [bookings],
  );

  return (
    <section className="min-w-0 rounded-2xl border border-[#f8dcec] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <CalendarDays size={16} />
          </span>
          Recent Bookings
        </h2>
        <Link
          href="/dashboard/customer/bookings"
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
              {["Service", "Date & Time", "Status", "Payment", "Action"].map(
                (head, index) => (
                  <th
                    key={head}
                    className={cn(
                      "bg-[#fdf6f9] px-4 py-3 text-sm font-semibold text-[#6b7280] dark:bg-white/5 dark:text-[#a998a1]",
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
                const payment = (booking.paymentStatus || "unpaid").toLowerCase();
                return (
                  <tr
                    key={booking._id}
                    className="border-b border-[#f8ecef] last:border-0 dark:border-white/10"
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
                            <span className="flex size-full items-center justify-center text-[#e6c3d3] dark:text-[#6f5c66]">
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
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold",
                          PAYMENT_STYLE[payment] ?? PAYMENT_STYLE.pending,
                        )}
                      >
                        <CircleCheckBig size={12} aria-hidden="true" />
                        {capitalize(payment)}
                      </span>
                    </td>

                    <td className="px-4 py-3.5">
                      <Link
                        href="/dashboard/customer/bookings"
                        className="inline-flex items-center gap-1.5 rounded-full border border-[#f3d5e2] bg-white px-3.5 py-1.5 text-xs font-bold text-[#8e2249] transition hover:bg-[#fef8fa] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-white/5 dark:text-[#ff9bb9] dark:hover:bg-white/10 dark:focus-visible:ring-[#ff9bb9]/30"
                      >
                        View Details
                        <ArrowRight size={12} aria-hidden="true" />
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
                  No bookings yet — services you book will show up here.
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
/*  Quick links                                                        */
/* ------------------------------------------------------------------ */

const QUICK_LINKS = [
  { label: "Browse Services", href: "/services", Icon: CalendarDays },
  { label: "My Favorites", href: "/services", Icon: Heart },
  { label: "Write a Review", href: "/services", Icon: PenLine },
  { label: "Update Profile", href: "/profile", Icon: User },
] as const;

function QuickLinks() {
  return (
    <section className="rounded-2xl border border-[#f8dcec] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
      <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/25 dark:text-[#fbbf24]">
          <Zap size={16} />
        </span>
        Quick Links
      </h2>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {QUICK_LINKS.map(({ label, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-center gap-2 rounded-xl border border-[#f8dcec] bg-[#fef8fa] px-3 py-5 text-center transition hover:border-[#f3d5e2] hover:bg-[#fef3f7] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:focus-visible:ring-[#ff9bb9]/30"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#a52b50] shadow-sm dark:bg-white/10 dark:text-[#ff9bb9]">
              <Icon size={16} aria-hidden="true" />
            </span>
            <span className="text-xs font-bold text-[#4a3a41] dark:text-[#e8dfe3]">
              {label}
            </span>
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
  userName: string;
  now: number;
};

export default function CustomerDashboardView({
  bookings,
  services,
  userName,
  now,
}: Props) {
  // The API answers with an error object when the session/token is invalid.
  const loadError = !(Array.isArray(bookings) && Array.isArray(services));

  const bookingsList = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings],
  );
  const servicesList = useMemo(
    () => (Array.isArray(services) ? services : []),
    [services],
  );

  // A service counts as a favorite once the customer has booked it.
  const favorites = useMemo<FavoriteRow[]>(() => {
    const byId = new Map<string, FavoriteRow>();
    for (const booking of bookingsList) {
      const key = booking.bookingsId || booking.bookingTitle;
      if (!key || byId.has(key)) continue;
      const service = servicesList.find(
        (item) => item._id === booking.bookingsId,
      );
      byId.set(key, {
        serviceId: booking.bookingsId || "",
        name: booking.bookingTitle,
        image: booking.bookingsImage || service?.imageUrl || "",
        rating: Number(service?.rating ?? booking.bookingsRating) || 0,
        reviews: service?.reviews?.length ?? 0,
        price: booking.bookingsPrice,
        unit: booking.bookingsUnit,
      });
    }
    return [...byId.values()].sort((a, b) => b.rating - a.rating);
  }, [bookingsList, servicesList]);

  // Reviews the customer left are stored on the services they reviewed.
  const myReviewCount = useMemo(() => {
    const name = userName.trim().toLowerCase();
    if (!name) return 0;
    return servicesList.reduce((total, service) => {
      const own = (service.reviews ?? []).filter(
        (review) => (review.userName || "").trim().toLowerCase() === name,
      ).length;
      return total + own;
    }, 0);
  }, [servicesList, userName]);

  const stats = useMemo(() => {
    const start = now - WINDOW_DAYS * DAY;
    const previousStart = now - 2 * WINDOW_DAYS * DAY;

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

    const bookingTimes = bookingsList
      .map((booking) => bookingTime(booking))
      .filter((time): time is number => time !== null);

    // The first booking of each distinct service — one event per favorite.
    const favoriteTimes = (() => {
      const seen = new Set<string>();
      const times: number[] = [];
      for (const booking of bookingsList) {
        const key = booking.bookingsId || booking.bookingTitle;
        if (!key || seen.has(key)) continue;
        seen.add(key);
        const time = bookingTime(booking);
        if (time !== null) times.push(time);
      }
      return times;
    })();

    const reviewTimes = bookingsList
      .filter((booking) => Number(booking.bookingsRating) > 0)
      .map((booking) => bookingTime(booking))
      .filter((time): time is number => time !== null);

    const spendEvents = bookingsList
      .filter((booking) => isPaid(booking))
      .map((booking) => ({
        time: bookingTime(booking),
        amount: priceToNumber(booking.bookingsPrice),
      }))
      .filter(
        (event): event is { time: number; amount: number } =>
          event.time !== null,
      );

    const spent = spendEvents.reduce((sum, event) => sum + event.amount, 0);
    const spentGrowth = (() => {
      let current = 0;
      let previous = 0;
      for (const event of spendEvents) {
        if (event.time >= start) current += event.amount;
        else if (event.time >= previousStart) previous += event.amount;
      }
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    })();

    const bookingTrend = growth(bookingTimes);

    return [
      {
        label: "Total Bookings",
        display: bookingsList.length.toLocaleString("en-US"),
        trend: bookingTrend,
        trendLabel: `${Math.abs(bookingTrend)}%`,
        icon: "bg-gradient-to-br from-[#f472b6] to-[#db2777]",
        Icon: CalendarDays,
      },
      {
        label: "Favorite Services",
        display: favorites.length.toLocaleString("en-US"),
        trend: growth(favoriteTimes),
        trendLabel: `${Math.abs(growth(favoriteTimes))}%`,
        icon: "bg-gradient-to-br from-[#ec4899] to-[#be185d]",
        Icon: Heart,
      },
      {
        label: "Your Reviews",
        display: myReviewCount.toLocaleString("en-US"),
        trend: growth(reviewTimes),
        trendLabel: `${Math.abs(growth(reviewTimes))}%`,
        icon: "bg-gradient-to-br from-[#fbbf24] to-[#f59e0b]",
        Icon: Star,
      },
      {
        label: "Total Spent",
        display: `৳${Math.round(spent).toLocaleString("en-US")}`,
        trend: spentGrowth,
        trendLabel: `${Math.abs(spentGrowth)}%`,
        icon: "bg-gradient-to-br from-[#fb7185] to-[#e11d48]",
        Icon: Wallet,
      },
    ];
  }, [bookingsList, favorites, myReviewCount, now]);

  if (loadError) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] px-4 py-16 dark:bg-[#160e13]">
        <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-[#f3d5e2] bg-white px-6 py-12 text-center dark:border-white/15 dark:bg-[#1e131a]">
          <LifeBuoy
            size={28}
            aria-hidden="true"
            className="mx-auto text-[#e6c3d3] dark:text-[#6f5c66]"
          />
          <h1 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
            We couldn&apos;t load your dashboard
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

          <div className="p-5 sm:p-7">
            <h1 className="font-heading flex items-center gap-2 text-2xl font-semibold tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
              <span aria-hidden="true">👋</span>
              Welcome back, {userName}!
            </h1>
            <p className="mt-2 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
              Here&apos;s a quick overview of your activity on WedPlan.
            </p>
          </div>
        </header>

        {/* ---------- Stat cards ---------- */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.Icon;
            const positive = (stat.trend ?? 0) >= 0;
            return (
              <div
                key={stat.label}
                className="relative overflow-hidden rounded-2xl border border-[#f8dcec] bg-white p-5 shadow-[0_16px_36px_-30px_rgba(114,14,50,0.55)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
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
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium whitespace-nowrap text-[#8a7a80] dark:text-[#c8b3bd]">
                      {stat.label}
                    </p>
                    <p className="mt-1.5 text-[1.65rem] leading-none font-extrabold tracking-tight text-[#2b0713] dark:text-[#ffeaf1]">
                      {stat.display}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold",
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
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Chart + favorite services ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BookingOverview bookings={bookingsList} now={now} />
          <FavoriteServices favorites={favorites} />
        </div>

        {/* ---------- Recent bookings + quick links ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <RecentBookings bookings={bookingsList} />
          <QuickLinks />
        </div>
      </div>
    </div>
  );
}
