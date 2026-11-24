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
  CircleCheckBig,
  Clock,
  CreditCard,
  Heart,
  LifeBuoy,
  Plus,
  Store,
  TrendingDown,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  BookingsData,
  ITransactions,
  IUsers,
  ServiceData,
} from "@/types/apidata";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const DAY = 86_400_000;

type RangeKey = "7D" | "30D" | "90D" | "1Y";

const RANGE_CFG: Record<RangeKey, { days: number; points: number }> = {
  "7D": { days: 7, points: 7 },
  "30D": { days: 30, points: 5 },
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

const formatAxis = (value: number) =>
  value >= 1000 ? `${+(value / 1000).toFixed(1)}k` : `${value}`;

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

/* ------------------------------------------------------------------ */
/*  Stat cards                                                         */
/* ------------------------------------------------------------------ */

type Stat = {
  label: string;
  value: number;
  trend: number;
  card: string;
  icon: string;
  spark: string;
  Icon: typeof Users;
  times: number[];
};

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

/* ------------------------------------------------------------------ */
/*  Platform analytics chart                                           */
/* ------------------------------------------------------------------ */

const SERIES = [
  { key: "users", label: "Users", color: "#720e32" },
  { key: "bookings", label: "Bookings", color: "#ec4899" },
  { key: "revenue", label: "Revenue", color: "#a855f7" },
] as const;

type SeriesKey = (typeof SERIES)[number]["key"];
type ChartPoint = { label: string } & Record<SeriesKey, number>;

const CHART_HEIGHT = 280;
const PAD = { top: 18, right: 14, bottom: 30, left: 46 };

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

function PlatformAnalytics({
  users,
  bookings,
  transactions,
  now,
}: {
  users: IUsers[];
  bookings: BookingsData[];
  transactions: ITransactions[];
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

  // Cumulative totals at the end of each bucket across the chosen range.
  const data = useMemo<ChartPoint[]>(() => {
    const cfg = RANGE_CFG[range];
    const end = now;
    const start = end - cfg.days * DAY;
    const step = (end - start) / cfg.points;

    const userTimes = users.map((u) => createdAt(u)).filter((t): t is number => t !== null);
    const bookingTimes = bookings
      .map((b) => bookingTime(b))
      .filter((t): t is number => t !== null);
    const bookingTimeById = new Map(
      bookings.map((b) => [b._id, bookingTime(b)] as const),
    );
    const revenueEvents = transactions
      .filter((t) => isPaid(t))
      .map((t) => ({
        time: bookingTimeById.get(t.bookingId) ?? oidTime(t._id),
        amount: priceToNumber(t.price),
      }))
      .filter((e): e is { time: number; amount: number } => e.time !== null);

    return Array.from({ length: cfg.points }, (_, index) => {
      const bucketEnd = start + step * (index + 1);
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
        users: countBelow(userTimes, bucketEnd),
        bookings: countBelow(bookingTimes, bucketEnd),
        revenue: revenueEvents
          .filter((event) => event.time < bucketEnd)
          .reduce((sum, event) => sum + event.amount, 0),
      };
    });
  }, [range, users, bookings, transactions, now]);

  const geometry = useMemo(() => {
    const plotW = Math.max(width - PAD.left - PAD.right, 10);
    const plotH = CHART_HEIGHT - PAD.top - PAD.bottom;

    // The axis describes the Users series; the other two are normalised
    // to their own peaks so all three stay readable on one canvas.
    const usersMax = Math.max(...data.map((d) => d.users), 100);
    const tickStep = niceCeil(usersMax / 4);
    const yMax = tickStep * 4;
    const ticks = [0, 1, 2, 3, 4].map((i) => i * tickStep);

    const xAt = (index: number) =>
      PAD.left + (data.length === 1 ? plotW / 2 : (index / (data.length - 1)) * plotW);

    const pointsFor = (key: SeriesKey) => {
      const ownMax = Math.max(...data.map((d) => d[key]), 1);
      const scale = key === "users" ? Math.max(ownMax, yMax) : ownMax;
      return data.map((point, index) => ({
        x: xAt(index),
        y: PAD.top + (1 - point[key] / scale) * plotH,
      }));
    };

    const series = SERIES.map((s) => ({ ...s, points: pointsFor(s.key) }));
    return { plotW, plotH, ticks, series };
  }, [data, width]);

  const last = data[data.length - 1];
  const baseY = PAD.top + geometry.plotH;

  return (
    <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a] lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
          <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
            <ChartColumn size={16} />
          </span>
          Platform Analytics
        </h2>

        <div
          role="tablist"
          aria-label="Analytics range"
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

      {/* Legend with live totals */}
      <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
        {SERIES.map((s) => (
          <span
            key={s.key}
            className="flex items-center gap-2 text-xs font-bold text-[#4a3a41] dark:text-[#c8b3bd]"
          >
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full"
              style={{ backgroundColor: s.color }}
            />
            {s.label}
            <span className="font-medium text-[#8a7a80] dark:text-[#9b8792]">
              {s.key === "revenue"
                ? `৳ ${Math.round(last?.revenue ?? 0).toLocaleString("en-US")}`
                : (last?.[s.key] ?? 0).toLocaleString("en-US")}
            </span>
          </span>
        ))}
      </div>

      {/* Chart */}
      <div ref={wrapRef} className="mt-3 w-full">
        <svg
          width={width}
          height={CHART_HEIGHT}
          viewBox={`0 0 ${width} ${CHART_HEIGHT}`}
          role="img"
          aria-label="Platform analytics over the selected range"
          className="block"
        >
          <defs>
            {SERIES.map((s) => (
              <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
                <stop offset="100%" stopColor={s.color} stopOpacity="0.02" />
              </linearGradient>
            ))}
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
                  fill="#a89a9f"
                >
                  {formatAxis(tick)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {data.map((point, index) => (
            <text
              key={`${point.label}-${index}`}
              x={geometry.series[0].points[index]?.x ?? PAD.left}
              y={CHART_HEIGHT - 8}
              textAnchor="middle"
              fontSize="11"
              fill="#a89a9f"
            >
              {point.label}
            </text>
          ))}

          {/* Series areas + lines + points */}
          {geometry.series.map((s) => {
            const line = smoothPath(s.points);
            const area = s.points.length
              ? `${line} L${s.points[s.points.length - 1].x},${baseY} L${s.points[0].x},${baseY} Z`
              : "";
            return (
              <g key={s.key}>
                <path d={area} fill={`url(#fill-${s.key})`} />
                <path
                  d={line}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.points.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r="3.5"
                    fill="#ffffff"
                    stroke={s.color}
                    strokeWidth="2"
                    className="dark:fill-[#1e131a]"
                  />
                ))}
              </g>
            );
          })}
        </svg>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Dashboard                                                          */
/* ------------------------------------------------------------------ */

type Props = {
  users: IUsers[];
  bookings: BookingsData[];
  services: ServiceData[];
  transactions: ITransactions[];
  userName: string;
  now: number;
};

const QUICK_ACTIONS = [
  { label: "Add Service", href: "/dashboard/admin/services", Icon: Plus },
  { label: "Manage Users", href: "/dashboard/admin/users", Icon: Users },
  { label: "View Bookings", href: "/dashboard/admin/bookings", Icon: CalendarDays },
  { label: "View Transactions", href: "/dashboard/admin/transactions", Icon: CreditCard },
] as const;

const STATUS_STYLE: Record<string, string> = {
  upcoming: "bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 dark:text-[#fbbf24]",
  confirmed: "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1d4ed8]/25 dark:text-[#93c5fd]",
  completed: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  cancelled: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#fee2e2]/10 dark:text-[#ff8fa3]",
};

const PAYMENT_STYLE: Record<string, string> = {
  paid: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  unpaid: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
  pending: "bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 dark:text-[#fbbf24]",
};

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : "";

export default function AdminDashboardView({
  users,
  bookings,
  services,
  transactions,
  userName,
  now,
}: Props) {
  const [windowDays, setWindowDays] = useState(30);

  // The API answers with an error object when the session/token is invalid.
  const loadError = !(
    Array.isArray(users) &&
    Array.isArray(bookings) &&
    Array.isArray(services) &&
    Array.isArray(transactions)
  );

  const usersList = useMemo(
    () => (Array.isArray(users) ? users : []),
    [users],
  );
  const bookingsList = useMemo(
    () => (Array.isArray(bookings) ? bookings : []),
    [bookings],
  );
  const servicesList = useMemo(
    () => (Array.isArray(services) ? services : []),
    [services],
  );
  const transactionsList = useMemo(
    () => (Array.isArray(transactions) ? transactions : []),
    [transactions],
  );

  const stats = useMemo<Stat[]>(() => {
    const start = now - windowDays * DAY;
    const previousStart = now - 2 * windowDays * DAY;

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

    const vendorUsers = usersList.filter((u) => u.role === "vendor");
    const customerUsers = usersList.filter((u) => u.role === "customer");

    const allUserTimes = usersList
      .map((u) => createdAt(u))
      .filter((t): t is number => t !== null);
    const vendorTimes = vendorUsers
      .map((u) => createdAt(u))
      .filter((t): t is number => t !== null);
    const customerTimes = customerUsers
      .map((u) => createdAt(u))
      .filter((t): t is number => t !== null);
    const serviceTimes = servicesList
      .map((s) => createdAt(s))
      .filter((t): t is number => t !== null);

    return [
      {
        label: "Total Registered Users",
        value: usersList.length,
        trend: growth(allUserTimes),
        card: "border-[#f8dcec] bg-gradient-to-br from-[#fdf2f8] to-[#fce7f3] dark:border-[#8e2249]/40 dark:from-[#8e2249]/15 dark:to-[#8e2249]/5",
        icon: "bg-gradient-to-br from-[#f472b6] to-[#db2777]",
        spark: "#ec4899",
        Icon: Users,
        times: allUserTimes,
      },
      {
        label: "Total Vendors",
        value: vendorUsers.length,
        trend: growth(vendorTimes),
        card: "border-[#e4defb] bg-gradient-to-br from-[#f5f3ff] to-[#ede9fe] dark:border-[#7c3aed]/40 dark:from-[#7c3aed]/15 dark:to-[#7c3aed]/5",
        icon: "bg-gradient-to-br from-[#a78bfa] to-[#7c3aed]",
        spark: "#8b5cf6",
        Icon: Store,
        times: vendorTimes,
      },
      {
        label: "Total Customers",
        value: customerUsers.length,
        trend: growth(customerTimes),
        card: "border-[#d3f3dd] bg-gradient-to-br from-[#f0fdf4] to-[#dcfce7] dark:border-[#16a34a]/40 dark:from-[#16a34a]/15 dark:to-[#16a34a]/5",
        icon: "bg-gradient-to-br from-[#4ade80] to-[#16a34a]",
        spark: "#22c55e",
        Icon: Heart,
        times: customerTimes,
      },
      {
        label: "Total Services",
        value: servicesList.length,
        trend: growth(serviceTimes),
        card: "border-[#fde4c8] bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] dark:border-[#f97316]/40 dark:from-[#f97316]/15 dark:to-[#f97316]/5",
        icon: "bg-gradient-to-br from-[#fbbf24] to-[#f97316]",
        spark: "#f97316",
        Icon: Briefcase,
        times: serviceTimes,
      },
    ];
  }, [usersList, servicesList, windowDays, now]);

  const recentBookings = useMemo(
    () =>
      [...bookingsList]
        .filter((booking) => booking.bookingsDate)
        .sort((a, b) => (b.bookingsDate || "").localeCompare(a.bookingsDate || ""))
        .slice(0, 5),
    [bookingsList],
  );

  const topServices = useMemo(() => {
    const ranked = servicesList
      .filter((service) => typeof service.bookings === "number")
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, 4);
    const total = servicesList.reduce(
      (sum, service) => sum + (service.bookings || 0),
      0,
    );
    return { ranked, total: total || 1 };
  }, [servicesList]);

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
                <span aria-hidden="true">👋</span>
                Welcome back, {userName}!
              </h1>
              <p className="mt-2 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
                Here&apos;s what&apos;s happening with your WedPlan platform today.
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
            return (
              <div
                key={stat.label}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-5 shadow-sm dark:shadow-none",
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
                      {stat.value.toLocaleString("en-US")}
                    </p>
                    <p className="mt-2 text-[13px] font-medium whitespace-nowrap text-[#8a7a80] dark:text-[#c8b3bd]">
                      {stat.label}
                    </p>
                  </div>
                </div>

                <span
                  className={cn(
                    "absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[0.7rem] font-bold",
                    stat.trend >= 0
                      ? "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/25 dark:text-[#4ade80]"
                      : "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
                  )}
                >
                  {stat.trend >= 0 ? (
                    <TrendingUp size={12} aria-hidden="true" />
                  ) : (
                    <TrendingDown size={12} aria-hidden="true" />
                  )}
                  {Math.abs(stat.trend)}%
                </span>

                <svg
                  width={104}
                  height={38}
                  viewBox="0 0 104 38"
                  aria-hidden="true"
                  className="absolute right-2 bottom-2 opacity-55"
                >
                  <path
                    d={sparkPath(stat.times, windowDays, now)}
                    fill="none"
                    stroke={stat.spark}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            );
          })}
        </div>

        {/* ---------- Analytics + quick actions ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <PlatformAnalytics
            users={usersList}
            bookings={bookingsList}
            transactions={transactionsList}
            now={now}
          />

          <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
            <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/25 dark:text-[#fbbf24]">
                <Zap size={16} />
              </span>
              Quick Actions
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              {QUICK_ACTIONS.map(({ label, href, Icon }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-[#f6e3ea] bg-[#fef8fa] px-3 py-6 text-center transition hover:border-[#e9b7cb] hover:shadow-md focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:focus-visible:ring-[#ff9bb9]/30"
                >
                  <span className="flex size-11 items-center justify-center rounded-full bg-[#720e32] text-white shadow-sm transition group-hover:scale-105 dark:bg-[#a52b50]">
                    <Icon size={19} />
                  </span>
                  <span className="text-sm font-bold text-[#4a3a41] dark:text-[#e8dfe3]">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* ---------- Recent bookings + top services ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="min-w-0 rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a] lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] text-[#8e2249] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]">
                  <CalendarDays size={16} />
                </span>
                Recent Bookings
              </h2>
              <Link
                href="/dashboard/admin/bookings"
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
                    {["Service", "Customer", "Date & Time", "Status", "Payment"].map(
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
                  {recentBookings.length > 0 ? (
                    recentBookings.map((booking) => {
                      const status = (booking.bookingStatus || "upcoming").toLowerCase();
                      const payment = (booking.paymentStatus || "pending").toLowerCase();
                      const paymentKey = payment.includes("paid")
                        ? payment.includes("unpaid")
                          ? "unpaid"
                          : "paid"
                        : "pending";
                      const initial = (booking.customerName || "?").trim().charAt(0).toUpperCase();
                      return (
                        <tr
                          key={booking._id}
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
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                                  {booking.bookingTitle}
                                </p>
                                <p className="truncate text-xs text-[#8a7a80] dark:text-[#9b8792]">
                                  {capitalize(booking.bookingsCategory || "service")}
                                </p>
                              </div>
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
                                PAYMENT_STYLE[paymentKey],
                              )}
                            >
                              <CircleCheckBig size={12} aria-hidden="true" />
                              {capitalize(paymentKey)}
                            </span>
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
                        No bookings yet — once customers book a service, it will show
                        up here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-sm sm:p-6 dark:border-white/10 dark:bg-[#1e131a]">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2.5 font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/25 dark:text-[#fbbf24]">
                  <Trophy size={16} />
                </span>
                Top Services
              </h2>
              <Link
                href="/dashboard/admin/services"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8e2249] transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#f9a8c4]"
              >
                View All
                <ArrowRight size={13} />
              </Link>
            </div>

            {topServices.ranked.length > 0 ? (
              <div className="mt-5 space-y-5">
                {topServices.ranked.map((service) => {
                  const share = Math.max(
                    1,
                    Math.round((service.bookings / topServices.total) * 100),
                  );
                  return (
                    <div key={service._id} className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-[#f6ece8] dark:bg-[#241720]">
                        {service.imageUrl ? (
                          <Image
                            src={service.imageUrl}
                            alt={service.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[#c4b4ba] dark:text-[#6f5c66]">
                            <Camera size={16} />
                          </span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                            {service.name}
                          </p>
                          <span className="shrink-0 text-sm font-extrabold text-[#8e2249] dark:text-[#ff9bb9]">
                            {share}%
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                          {service.bookings.toLocaleString("en-US")} bookings
                        </p>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#f6ece8] dark:bg-white/10">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#f472b6] to-[#720e32]"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 text-center text-sm text-[#8a7a80] dark:text-[#9b8792]">
                No services to rank yet.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
