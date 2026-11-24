"use client";
import AdminServicesCard from "@/components/admin/adminServicesCard";
import { Input } from "@/components/ui/input";
import { ServiceData } from "@/types/apidata";
import {
  Boxes,
  Briefcase,
  CalendarCheck,
  ChevronDown,
  CirclePause,
  CircleX,
  Funnel,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const selectClass =
  "h-11 appearance-none rounded-xl border border-[#e8e2e5] bg-white pr-9 pl-3 text-sm font-medium text-[#374151] outline-none focus:border-[#8e2249] focus:ring-2 focus:ring-[#8e2249]/20 dark:border-white/10 dark:bg-[#241820] dark:text-[#e8dfe3] dark:focus:border-[#ff9bb9]";

const tableHeads = [
  "#",
  "Service",
  "Category",
  "Price",
  "Location",
  "Status",
  "Bookings",
  "Actions",
];

const formatCount = (value: number) =>
  value >= 1000
    ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}K`
    : `${value}`;

interface IProps {
  services: ServiceData[];
}

export default function AdminServicesView({ services }: IProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Status");
  const [applied, setApplied] = useState({
    q: "",
    cat: "All Categories",
    st: "All Status",
  });

  const categories = useMemo(
    () => Array.from(new Set(services.map((s) => s.category).filter(Boolean))),
    [services],
  );

  const totalActive = services.filter((s) => s.status === "Active").length;
  const totalInactive = services.filter((s) => s.status === "Inactive").length;
  const totalPending = services.filter(
    (s) => s.status !== "Active" && s.status !== "Inactive",
  ).length;

  const stats = [
    {
      label: "Total Services",
      value: formatCount(services.length),
      Icon: Boxes,
      iconBox: "bg-[#fce7f3] text-[#be185d] dark:bg-[#be185d]/15 dark:text-[#ff9bb9]",
      wave: "text-[#f472b6]",
    },
    {
      label: "Active Services",
      value: formatCount(totalActive),
      Icon: CalendarCheck,
      iconBox:
        "bg-[#ede9fe] text-[#6d28d9] dark:bg-[#6d28d9]/20 dark:text-[#c4b5fd]",
      wave: "text-[#a78bfa]",
    },
    {
      label: "Pending Services",
      value: formatCount(totalPending),
      Icon: CirclePause,
      iconBox:
        "bg-[#fef3c7] text-[#b45309] dark:bg-[#f59e0b]/15 dark:text-[#fbbf24]",
      wave: "text-[#fbbf24]",
    },
    {
      label: "Inactive Services",
      value: formatCount(totalInactive),
      Icon: CircleX,
      iconBox:
        "bg-[#eef2f7] text-[#475569] dark:bg-white/10 dark:text-[#c8b3bd]",
      wave: "text-[#cbd5e1]",
    },
  ];

  const filtered = useMemo(() => {
    return services.filter((service) => {
      const query = applied.q;
      const matchQuery =
        !query ||
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        (service.location ?? "").toLowerCase().includes(query);
      const matchCategory =
        applied.cat === "All Categories" || service.category === applied.cat;
      const matchStatus =
        applied.st === "All Status" || service.status === applied.st;
      return matchQuery && matchCategory && matchStatus;
    });
  }, [services, applied]);

  const hasUnappliedChanges =
    search.trim().toLowerCase() !== applied.q ||
    category !== applied.cat ||
    status !== applied.st;

  const applyFilters = () =>
    setApplied({
      q: search.trim().toLowerCase(),
      cat: category,
      st: status,
    });

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#fdfbfa] pb-16 dark:bg-[#160e13]">
      {/* ---------- Hero header ---------- */}
      <div className="relative isolate overflow-hidden">
        <Image
          src="/services-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fff7f9] via-[#fff7f9]/92 to-[#fff7f9]/40 dark:from-[#160e13] dark:via-[#160e13]/92 dark:to-[#160e13]/50" />

        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div className="flex items-start gap-4">
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#720e32] text-white shadow-[0_16px_30px_-18px_rgba(114,14,50,0.9)] dark:bg-[#a52b50]">
              <Briefcase className="size-7" />
            </span>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
                Services
              </h1>
              <p className="mt-1.5 text-sm text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
                Manage all services offered on WedPlan platform
              </p>
            </div>
          </div>

          <Link
          href="/dashboard/admin/services/add-service"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-[#720e32] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
          >
            <Plus size={17} strokeWidth={2.5} />
            Add Service
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        {/* ---------- Stat cards ---------- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.Icon;
            return (
              <div
                key={stat.label}
                className="overflow-hidden rounded-2xl border border-[#f1e6ea] bg-white px-4 pt-4 pb-2 shadow-[0_18px_40px_-34px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBox}`}
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-[#6b7280] dark:text-[#c8b3bd]">
                      {stat.label}
                    </p>
                    <p className="mt-0.5 text-2xl font-extrabold tracking-tight text-[#111827] dark:text-[#ffeaf1]">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ---------- Toolbar ---------- */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
            <Input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              placeholder="Search services by name or category..."
              className="h-11 w-full rounded-xl border-[#e8e2e5] bg-white pr-4 pl-10 text-sm shadow-none placeholder:text-[#9ca3af] focus-visible:border-[#8e2249] focus-visible:ring-[#8e2249]/20 dark:border-white/10 dark:bg-white/5 dark:focus-visible:border-[#ff9bb9]"
            />
          </div>

          <div className="relative">
            <select
              aria-label="Filter by category"
              className={selectClass}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All Categories">All Categories</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          </div>

          <div className="relative">
            <select
              aria-label="Filter by status"
              className={selectClass}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#6b7280]" />
          </div>

          <button
            type="button"
            onClick={applyFilters}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition focus-visible:ring-2 focus-visible:outline-none ${
              hasUnappliedChanges
                ? "bg-[#8e2249] ring-2 ring-[#8e2249]/30 hover:bg-[#720e32]"
                : "bg-[#720e32] hover:bg-[#570a26]"
            } focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:hover:bg-[#c13b64]`}
          >
            <Funnel size={16} />
            Filter
          </button>
        </div>

        {/* ---------- Services table ---------- */}
        <section className="mt-4 rounded-2xl border border-[#efe8eb] bg-white p-4 shadow-sm sm:p-5 dark:border-white/10 dark:bg-[#1f1419]">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
            <h2 className="text-base font-bold text-[#111827] dark:text-[#ffeaf1]">
              All Services
            </h2>
            <p className="text-xs font-medium text-[#9ca3af]">
              Showing {filtered.length} of {services.length} services
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left">
              <thead>
                <tr>
                  {tableHeads.map((head, i) => (
                    <th
                      key={head}
                      className={`bg-[#faf8f9] px-4 py-3.5 text-sm font-semibold text-[#6b7280] dark:bg-white/5 dark:text-[#a998a1] ${
                        i === 0 ? "rounded-l-lg" : ""
                      } ${i === tableHeads.length - 1 ? "rounded-r-lg" : ""}`}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((service, i) => (
                    <AdminServicesCard
                      key={service._id}
                      service={service}
                      index={i + 1}
                    />
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={tableHeads.length}
                      className="px-4 py-14 text-center text-sm font-medium text-[#9ca3af]"
                    >
                      No services match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
