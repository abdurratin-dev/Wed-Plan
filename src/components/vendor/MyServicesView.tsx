import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Camera,
  ChevronRight,
  Home,
  Plus,
  Star,
  TrendingUp,
} from "lucide-react";
import { BookingsData, ServiceData } from "@/types/apidata";
import { getServiceData } from "@/lib/actions/api/service";
import VendorServiceCard from "./VendorServiceCard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getBookings } from "@/lib/actions/api/booking";

export default async function MyServicesView() {
  const session = await auth.api.getSession({
      headers: await headers(), // you need to pass the headers object.
    });
    const user = session?.user;
    const bookings: BookingsData[] = await getBookings(
      `role=${user?.role}&userId=${user?.id}`,
    );
  const services: ServiceData[] = await getServiceData(`role=${user?.role}&userId=${user?.id}`);
  const stats = [
    { label: "Total Services", value: services.length , icon: Camera },
    { label: "Total Bookings", value: bookings.length, icon: CalendarDays },
    { label: "Average Rating", value: "4.8", icon: Star },
    { label: "Growth This Month", value: "+12%", icon: TrendingUp },
  ] as const;
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
            Vendor Portal
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#a52b50]/50 dark:bg-[#ff9bb9]/50"
            />
          </p>
          <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            My Services
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            Manage your services and showcase your expertise to more couples.
          </p>
        </div>
      </div>

      {/* ---------- Breadcrumb ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 border-b border-[#f1ded7] py-3 text-xs font-medium text-[#8a7a80] dark:border-white/10 dark:text-[#9b8792]"
        >
          <Link
            href="/"
            aria-label="Home"
            className="flex size-7 items-center justify-center rounded-lg text-[#a52b50] transition hover:bg-[#fdf1eb] dark:text-[#ff9bb9] dark:hover:bg-white/5"
          >
            <Home size={14} />
          </Link>
          <ChevronRight
            size={13}
            className="text-[#c4b4ba] dark:text-[#6f5c66]"
          />
          <span
            aria-current="page"
            className="text-[#4a3a41] dark:text-[#d5c1ca]"
          >
            My Services
          </span>
        </nav>
      </div>

      {/* ---------- Stats + primary action ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="grid flex-1 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="flex items-center gap-3 rounded-2xl border border-[#f1ded7] bg-white px-3.5 py-4 shadow-[0_16px_36px_-30px_rgba(114,14,50,0.55)] sm:px-4 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fdeef2] text-[#a52b50] sm:size-11 dark:bg-[#a52b50]/15 dark:text-[#ff9bb9]">
                    <Icon size={19} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xl leading-none font-bold tabular-nums text-[#2b0713] sm:text-2xl dark:text-[#ffeaf1]">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 truncate text-[0.7rem] font-medium text-[#6b5a61] sm:text-xs dark:text-[#c8b3bd]">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/dashboard/vendor/services/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#720e32] px-6 py-4 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none xl:py-4 dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
          >
            <Plus size={17} strokeWidth={2.5} />
            Add New Service
          </Link>
        </div>
      </div>

      {/* ---------- Service grid ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <VendorServiceCard
              key={service._id}
              service={service}
              isActive={service.status === "Active"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
