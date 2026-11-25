"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChartColumn,
  ChevronRight,
  CircleCheckBig,
  Clock,
  CreditCard,
  Hash,
  Heart,
  LifeBuoy,
  Mail,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ITransactions } from "@/types/apidata";

type TabKey = "all" | "paid" | "unpaid";

const TABS: { key: TabKey; label: string; icon: typeof CreditCard }[] = [
  { key: "all", label: "All Transactions", icon: CreditCard },
  { key: "paid", label: "Paid", icon: CircleCheckBig },
  { key: "unpaid", label: "Unpaid", icon: X },
];

const STATUS_STYLE: Record<string, string> = {
  success:
    "bg-[#dbeafe] text-[#1d4ed8] dark:bg-[#1d4ed8]/25 dark:text-[#93c5fd]",
  pending:
    "bg-[#fef3c7] text-[#b45309] dark:bg-[#b45309]/20 dark:text-[#fbbf24]",
};

const PAYMENT_STYLE: Record<string, string> = {
  paid: "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]",
  unpaid: "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
};

const FALLBACK_STYLE =
  "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#c8b3bd]";

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const isPaid = (transaction: ITransactions) =>
  (transaction.paymentStatus || "").toLowerCase() === "paid";

/** "৳5,000" / "5000" -> 5000 (0 when the value isn't a number). */
const priceToNumber = (value: string) => {
  const digits = (value || "").replace(/[^\d.]/g, "");
  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : 0;
};

const STATUS_ICON: Record<string, typeof Clock> = {
  success: CircleCheckBig,
  pending: Clock,
  paid: CircleCheckBig,
  unpaid: X,
};

function StatusPill({
  label,
  style,
  type,
}: {
  label: string;
  style: string | undefined;
  type: string;
}) {
  const Icon = STATUS_ICON[type] || CircleCheckBig;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-bold",
        style ?? FALLBACK_STYLE,
      )}
    >
      <Icon size={12} aria-hidden="true" />
      {label}
    </span>
  );
}

export default function AdminTransactionsView({
  transactions,
}: {
  transactions: ITransactions[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [query, setQuery] = useState("");

  // The API answers with an error object when the session/token is invalid.
  const loadError = !Array.isArray(transactions);

  const rows = useMemo<ITransactions[]>(() => {
    if (!Array.isArray(transactions)) return [];
    // ObjectIds are chronological — newest transaction first.
    return [...transactions].sort((a, b) =>
      (b._id || "").localeCompare(a._id || ""),
    );
  }, [transactions]);

  const counts = useMemo(
    () => ({
      all: rows.length,
      paid: rows.filter((row) => isPaid(row)).length,
      unpaid: rows.filter((row) => !isPaid(row)).length,
    }),
    [rows],
  );

  /** Revenue only counts transactions that were actually paid. */
  const revenue = useMemo(
    () =>
      rows
        .filter((row) => isPaid(row))
        .reduce((sum, row) => sum + priceToNumber(row.price), 0),
    [rows],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (activeTab === "paid" && !isPaid(row)) return false;
      if (activeTab === "unpaid" && isPaid(row)) return false;
      if (!needle) return true;
      const haystack = [row.bookingId, row.customerEmail, row._id]
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
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fffaf7] via-[#fffaf7]/85 to-[#fffaf7]/25 dark:from-[#160e13] dark:via-[#160e13]/85 dark:to-[#160e13]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fffaf7]/60 via-transparent to-[#fffaf7]/70 dark:from-[#160e13]/60 dark:via-transparent dark:to-[#160e13]/70" />

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
            <Link
              href="/dashboard/admin"
              className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
            >
              Admin
            </Link>
            <ChevronRight size={13} className="text-[#c4b4ba] dark:text-[#6f5c66]" />
            <span aria-current="page" className="text-[#4a3a41] dark:text-[#d5c1ca]">
              Transactions
            </span>
          </nav>

          <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            Transactions
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            Track and manage all transactions.
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
            aria-label="Filter transactions"
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
                      : "border border-[#f1ded7] bg-white text-[#6b5a61] hover:border-[#e3c3bd] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/10 dark:bg-[#1e131a] dark:text-[#c8b3bd] dark:hover:border-white/20 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
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
              placeholder="Search by booking ID, customer..."
              aria-label="Search transactions"
              className="w-full rounded-xl border border-[#eee2dd] bg-white py-3 pr-9 pl-10 text-sm text-[#2b0713] shadow-sm outline-none transition placeholder:text-[#a89a9f] focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:placeholder:text-[#8d7a84] dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 -translate-y-1/2 p-2.5 text-[#a89a9f] transition hover:text-[#720e32] dark:text-[#8d7a84] dark:hover:text-[#ff9bb9]"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Transactions + sidebar ---------- */}
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
                We couldn&apos;t load the transactions
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
            visible.map((transaction) => {
              const statusKey = (transaction.status || "").toLowerCase();
              const paymentKey = (transaction.paymentStatus || "").toLowerCase();
              const shortId = (transaction._id || "").slice(-6).toUpperCase();
              return (
                <article
                  key={transaction._id}
                  className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] transition hover:border-[#e3c3bd] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                    {/* Icon + transaction info */}
                    <div className="flex min-w-0 flex-1 items-center gap-4">
                      <span className="flex size-20 shrink-0 items-center justify-center rounded-xl bg-[#fdeef2] sm:size-24 dark:bg-[#a52b50]/15">
                        <CreditCard
                          size={30}
                          aria-hidden="true"
                          className="text-[#720e32] dark:text-[#ff9bb9]"
                        />
                      </span>

                      <div className="min-w-0">
                        <h2 className="font-heading truncate text-lg leading-snug font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                          Transaction #{shortId || "—"}
                        </h2>

                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                          <Hash
                            size={13}
                            className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
                          />
                          <span
                            className="truncate"
                            title={transaction.bookingId}
                          >
                            Booking: {transaction.bookingId}
                          </span>
                        </p>

                        <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                          <Mail
                            size={13}
                            className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
                          />
                          <span className="truncate">
                            {transaction.customerEmail}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Amount + status */}
                    <div className="flex flex-wrap items-center gap-x-7 gap-y-4 xl:justify-end">
                      <div className="text-right">
                        <p className="text-[0.66rem] font-bold tracking-wide text-[#a52b50] uppercase dark:text-[#ff9bb9]">
                          Amount
                        </p>
                        <p className="mt-1 text-lg font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                          ৳ {transaction.price}
                        </p>
                      </div>

                      <div className="flex flex-col items-start gap-2.5 xl:items-end">
                        <StatusPill
                          label={capitalize(statusKey) || "Unknown"}
                          style={STATUS_STYLE[statusKey]}
                          type={statusKey}
                        />
                        <StatusPill
                          label={capitalize(paymentKey) || "Unknown"}
                          style={PAYMENT_STYLE[paymentKey]}
                          type={paymentKey}
                        />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            !loadError && (
              <div className="rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-14 text-center dark:border-white/15 dark:bg-[#1e131a]">
                <CreditCard
                  size={30}
                  aria-hidden="true"
                  className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
                />
                <h2 className="font-heading mt-3 text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                  {rows.length === 0
                    ? "No transactions yet"
                    : "No transactions found"}
                </h2>
                <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
                  {rows.length === 0
                    ? "Once customers pay for bookings, transactions will show up here."
                    : "Try a different search term or switch tabs."}
                </p>
              </div>
            )
          )}
        </section>

        {/* ---------- Sidebar ---------- */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Transaction summary */}
          <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
            <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-[#2b0713] dark:text-[#ffeaf1]">
              <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] dark:bg-[#a52b50]/15">
                <ChartColumn
                  size={16}
                  className="text-[#a52b50] dark:text-[#ff9bb9]"
                />
              </span>
              Transaction Summary
            </h2>

            <dl className="mt-4 grid grid-cols-2 gap-3">
              {[
                { label: "Total Transactions", value: String(counts.all) },
                { label: "Paid", value: String(counts.paid) },
                { label: "Unpaid", value: String(counts.unpaid) },
                {
                  label: "Total Revenue",
                  value: `৳${revenue.toLocaleString("en-US")}`,
                  small: true,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-[#fdfbfa] px-3 py-3.5 text-center dark:bg-[#241720]"
                >
                  <dd
                    className={cn(
                      "font-extrabold tabular-nums text-[#720e32] dark:text-[#ff9bb9]",
                      item.small
                        ? "text-base leading-tight"
                        : "text-xl leading-none",
                    )}
                  >
                    {item.value}
                  </dd>
                  <dt className="mt-1.5 text-[0.68rem] font-medium text-[#8a7a80] dark:text-[#9b8792]">
                    {item.label}
                  </dt>
                </div>
              ))}
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
