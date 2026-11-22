"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  Check,
  Clock,
  Heart,
  MapPin,
  MessageSquare,
  Quote,
  ShieldCheck,
  Sparkles,
  SquaresUnite,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreatBookingsPayload, ServiceData } from "@/types/apidata";
import ServiceCard from "./ServiceCard";
import { creatBookings } from "@/lib/actions/api/booking";
import { authClient } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";

const FALLBACK_DESCRIPTION =
  "No description has been added for this service yet. Reach out to the vendor to learn more about what is included.";

const Units = [
  { label: "Par day", value: "parday" },
  { label: "Par week", value: "parweek" },
  { label: "Par Month", value: "parmonth" },
];

const Durations = [{ label: "1 Hr" }, { label: "5 Hr" }, { label: "10 Hr" }];
type TabKey = "about" | "reviews" | "location";

const TABS: { key: TabKey; label: string; icon: typeof Camera }[] = [
  { key: "about", label: "About Service", icon: Camera },
  { key: "reviews", label: "Reviews", icon: Quote },
];

const capitalize = (value: string) =>
  value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

const formatDate = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
};

const inputClass =
  "w-full rounded-xl border border-[#eee2dd] bg-[#fdfbfa] py-3 pl-10 pr-3 text-sm text-[#2b0713] outline-none transition focus:border-[#720e32] focus:ring-2 focus:ring-[#720e32]/15 dark:border-white/10 dark:bg-[#241720] dark:text-white dark:focus:border-[#ff9bb9] dark:focus:ring-[#ff9bb9]/15 dark:[color-scheme:dark]";

export default function ServiceDetails({
  service,
  related,
}: {
  service: ServiceData;
  related: ServiceData[];
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("about");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [units, setUnits] = useState("");
  const [duration, setDuration] = useState("");
  const [note, setNote] = useState<string | null>(null);

  const { data: session, error } = authClient.useSession();
  const user = session?.user;

  // const router = useRouter();

  const HIGHLIGHTS = [
    "Professional Team",
    "High-Quality Photos",
    "Timely Delivery",
  ];
  const description = service.description?.trim() || FALLBACK_DESCRIPTION;
  const status = service.status;
  const isActive = status === "Active";
  // The API doesn't always send every field, so fall back gracefully.
  const rating =
    typeof service.rating === "number" && service.rating > 0
      ? service.rating
      : null;
  // const reviews = service.reviews > 0 ? service.reviews : 0;
  const bookings =
    typeof service.bookings === "number" && service.bookings > 0
      ? service.bookings
      : 0;
  const filledStars = rating ? Math.round(rating) : 0;

  const confirmBooking = async () => {
    if (!date || !time) {
      toast.add({
        type: "error",
        description: "Pick a date and a time to reserve your slot first.",
      });
      return;
    }
    if (!units) {
      toast.add({
        type: "error",
        description: "Pick a unit to your slot first.",
      });
      return;
    }
    if (units === "parday") {
        if (!duration) {
          toast.add({
            type: "error",
            description: "Pick a duration to your slot first.",
          });
          return
        }
      }
    const submitdate = new Date(date).getTime();
    const newDate = new Date().getTime();
    const bookingsData: CreatBookingsPayload = {
      bookingTitle: service.name,
      bookingsId: service._id,
      bookingsCategory: service.category,
      bookingsLocation: service.location,
      bookingsPrice: service.price,
      bookingsRating: service.rating,
      bookingsImage: service.imageUrl,
      bookingStatus: "Upcoming",
      bookingsDate: date,
      bookingsTime: time,
      bookingsUnit: units,
      bookingsDuration: duration,
      customerName: user?.name,
      customerEmail: user?.email,
      customerImg: user?.image,
      customerId: user?.id,
      paymentStatus : 'unpaid'
    };
    if (submitdate < newDate) {
      if (date === new Date().toISOString().slice(0, 10)) {
        const res = await creatBookings(bookingsData);
        if (res.insertedId) {
          toast.add({
            type: "success",
            title: `${service.name} Booking succsfull`,
            description: "Sunday, December 3 at 9:00 AM",
          });
        }
        return;
      }
      toast.add({
        type: "error",
        description: "Your date to old please pick new date",
      });
      return;
    }
    const res = await creatBookings(bookingsData as CreatBookingsPayload);
    console.log(res);
    if(res.massage){
      toast.add({
        type: "error",
        description: res.massage,
      });
      return
    }
    window.location.href = res.data.redirectUrl
    return;
  };

  const contactVendor = () => {
    setNote(
      "Vendor contact details will appear here once vendor profiles are connected.",
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfbfa] pb-20 dark:bg-[#160e13]">
      <div className="mx-auto w-full max-w-[1500px] px-4 pt-7 sm:px-6 lg:px-10">
        {/* ---------------- Breadcrumb ---------------- */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#8a7a80] dark:text-[#9b8792]"
        >
          <Link
            href="/"
            className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
          >
            Home
          </Link>
          <span
            aria-hidden="true"
            className="text-[#c4b4ba] dark:text-[#6f5c66]"
          >
            /
          </span>
          <Link
            href="/services"
            className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
          >
            Services
          </Link>
          <span
            aria-hidden="true"
            className="text-[#c4b4ba] dark:text-[#6f5c66]"
          >
            /
          </span>
          <span
            aria-current="page"
            className="text-[#4a3a41] dark:text-[#d5c1ca]"
          >
            {service.name}
          </span>
        </nav>

        <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          {/* ================= Left column ================= */}
          <div className="min-w-0 space-y-6">
            {/* -------- Gallery + summary -------- */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
              <div className="grid gap-5 sm:grid-cols-2">
                {/* Gallery — a single image for now */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#f6ece8] dark:bg-[#241720]">
                  <Image
                    src={service.imageUrl}
                    alt={service.alt || service.name}
                    fill
                    priority
                    sizes="(max-width: 639px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <span className="absolute right-3 bottom-3 rounded-md bg-black/55 px-2 py-1 text-[0.7rem] font-semibold text-white backdrop-blur-sm">
                    1 / 1
                  </span>
                </div>

                {/* Summary */}
                <div className="flex flex-col">
                  {status && (
                    <span
                      className={cn(
                        "inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-bold",
                        isActive
                          ? "bg-[#dcfce7] text-[#15803d] dark:bg-[#15803d]/20 dark:text-[#4ade80]"
                          : "bg-[#fee2e2] text-[#d6455f] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3]",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full",
                          isActive
                            ? "bg-[#22c55e] dark:bg-[#4ade80]"
                            : "bg-[#ef4444] dark:bg-[#ff6b81]",
                        )}
                      />
                      {status}
                    </span>
                  )}

                  <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] dark:text-[#ffeaf1]">
                    {service.name}
                  </h1>

                  <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                    <Camera
                      size={15}
                      className="text-[#a52b50] dark:text-[#ff9bb9]"
                    />
                    {capitalize(service.category)}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6b5a61] dark:text-[#c8b3bd]">
                    {rating !== null ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Star
                          size={14}
                          className="fill-[#f5b301] text-[#f5b301]"
                        />
                        <span className="font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                          {rating.toFixed(1)}
                        </span>
                        <span className="text-[#8a7a80] dark:text-[#9b8792]">
                          {/* ({reviews} reviews) */}
                        </span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[#8a7a80] dark:text-[#9b8792]">
                        <Star
                          size={14}
                          className="text-[#d8c8cd] dark:text-[#6f5c66]"
                        />
                        No ratings yet
                      </span>
                    )}
                    {bookings > 0 && (
                      <span className="inline-flex items-center gap-1.5">
                        <Users
                          size={14}
                          className="text-[#a52b50] dark:text-[#ff9bb9]"
                        />
                        {bookings} bookings
                      </span>
                    )}
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
                    <MapPin
                      size={15}
                      className="text-[#a52b50] dark:text-[#ff9bb9]"
                    />
                    {service.location}
                  </p>

                  <p className="mt-3 flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                      ৳ {service.price}
                    </span>
                    <span className="text-sm font-semibold text-[#8a7a80] dark:text-[#9b8792]">
                      / Event
                    </span>
                  </p>

                  <p className="mt-3 text-sm leading-relaxed text-[#6b5a61] dark:text-[#c8b3bd]">
                    {description}
                  </p>

                  <ul className="mt-4 flex flex-wrap gap-2">
                    {HIGHLIGHTS.map((highlight) => (
                      <li
                        key={highlight}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#fdeef2] px-3 py-1.5 text-[0.72rem] font-semibold text-[#a52b50] dark:bg-[#a52b50]/15 dark:text-[#ff9bb9]"
                      >
                        <Check size={12} strokeWidth={3} />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* -------- Tabs -------- */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
              <div
                role="tablist"
                aria-label="Service information"
                className="flex flex-wrap gap-2 border-b border-[#f6ece8] pb-4 dark:border-white/10"
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
                        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.78rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                        active
                          ? "bg-[#720e32] text-white shadow-sm focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                          : "bg-[#fdf1eb] text-[#720e32] hover:bg-[#fde3d9] focus-visible:ring-[#720e32]/30 dark:bg-white/5 dark:text-[#ff9bb9] dark:hover:bg-white/10 dark:focus-visible:ring-[#ff9bb9]/30",
                      )}
                    >
                      <Icon size={13} />
                      {label}
                      {/* {key === "reviews" && reviews > 0 && ` (${reviews})`} */}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4">
                {activeTab === "about" && (
                  <div role="tabpanel">
                    <h2 className="font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                      About This Service
                    </h2>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#6b5a61] dark:text-[#c8b3bd]">
                      {description}
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div role="tabpanel">
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-baseline gap-2">
                        <span className="font-heading text-4xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                          {rating !== null ? rating.toFixed(1) : "—"}
                        </span>
                        <span className="text-sm text-[#8a7a80] dark:text-[#9b8792]">
                          / 5
                        </span>
                      </div>
                      <div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              className={cn(
                                star <= filledStars
                                  ? "fill-[#f5b301] text-[#f5b301]"
                                  : "text-[#d8c8cd] dark:text-[#6f5c66]",
                              )}
                            />
                          ))}
                        </div>
                        <p className="mt-1 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                          {/* {reviews > 0
                            ? `Based on ${reviews} reviews`
                            : "No reviews yet"} */}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-dashed border-[#e3c3bd] px-5 py-8 text-center dark:border-white/15">
                      <Quote
                        size={24}
                        aria-hidden="true"
                        className="mx-auto text-[#c4b4ba] dark:text-[#6f5c66]"
                      />
                      <p className="mt-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
                        No written reviews yet — reviews will show up here once
                        they are connected.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div role="tabpanel">
                    <h2 className="font-heading text-xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                      Service Location
                    </h2>
                    <div className="mt-3 flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#e3c3bd] bg-[#fdfbfa] px-5 py-10 text-center dark:border-white/15 dark:bg-[#241720]">
                      <span className="flex size-11 items-center justify-center rounded-full bg-[#fdeef2] dark:bg-[#a52b50]/15">
                        <MapPin
                          size={20}
                          className="text-[#a52b50] dark:text-[#ff9bb9]"
                        />
                      </span>
                      <p className="text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                        {service.location}
                      </p>
                      <p className="max-w-sm text-xs text-[#8a7a80] dark:text-[#9b8792]">
                        An interactive map will appear here once map integration
                        is added.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* ================= Right column ================= */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* -------- Booking card -------- */}
            <section className="rounded-2xl border border-[#f1ded7] bg-white p-5 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none">
              <h2 className="flex items-center gap-2 text-base font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#fdeef2] dark:bg-[#a52b50]/15">
                  <CalendarDays
                    size={16}
                    className="text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                </span>
                Book This Service
              </h2>
              <p className="mt-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                Choose a date and book your slot now
              </p>

              <div className="mt-4 space-y-3">
                <div className="relative">
                  <CalendarDays
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  <input
                    type="date"
                    value={date}
                    onChange={(event) => {
                      setDate(event.target.value);
                      setNote(null);
                    }}
                    aria-label="Select date"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <Clock
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(event) => {
                      setTime(event.target.value);
                      setNote(null);
                    }}
                    aria-label="Select time"
                    className={inputClass}
                  />
                </div>

                <div className="relative">
                  <SquaresUnite
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  <select
                    value={units}
                    onChange={(event) => {
                      setUnits(event.target.value);
                      setNote(null);
                    }}
                    aria-label="Select unit"
                    className={cn(inputClass)}
                  >
                    <option value="">Select unit</option>
                    {Units.map((unit) => (
                      <option key={unit.value} value={unit.value}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <SquaresUnite
                    size={15}
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-[#a52b50] dark:text-[#ff9bb9]"
                  />
                  <select
                    value={duration}
                    onChange={(event) => {
                      setDuration(event.target.value);
                      setNote(null);
                    }}
                    aria-label="Select unit"
                    className={cn(inputClass)}
                  >
                    <option value="">Select duration</option>
                    {Durations.map((unit) => (
                      <option key={unit.label} value={unit.label}>
                        {unit.label}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  onClick={confirmBooking}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#720e32] px-4 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                >
                  <BadgeCheck size={16} />
                  Confirm Booking
                </button>

                <p
                  role="status"
                  aria-live="polite"
                  className={cn(
                    "text-center text-[0.72rem] leading-relaxed",
                    note
                      ? "text-[#a52b50] dark:text-[#ff9bb9]"
                      : "text-transparent",
                  )}
                >
                  {note ?? "\u00A0"}
                </p>

                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-[#f1ded7] dark:bg-white/10" />
                  <span className="text-[0.7rem] font-semibold text-[#a89a9f] dark:text-[#8d7a84]">
                    or
                  </span>
                  <span className="h-px flex-1 bg-[#f1ded7] dark:bg-white/10" />
                </div>

                <a
                  href={`mailto:${service.email}`}
                  type="button"
                  onClick={contactVendor}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e3c3bd] bg-white px-4 py-3.5 text-sm font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30"
                >
                  <MessageSquare size={16} />
                  Contact Vendor
                </a>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#fdeef2] px-3 py-2.5 dark:bg-[#a52b50]/15">
                <ShieldCheck
                  size={15}
                  className="text-[#a52b50] dark:text-[#ff9bb9]"
                />
                <span className="text-[0.72rem] font-bold text-[#720e32] dark:text-[#ff9bb9]">
                  Secure &amp; Trusted
                </span>
                <span className="hidden text-[0.68rem] text-[#8a7a80] sm:inline dark:text-[#9b8792]">
                  Your payment info is safe with us
                </span>
              </div>
            </section>

            {/* -------- Promo banner -------- */}
            <section className="relative isolate overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffe4ec] via-[#fff4f7] to-[#ffd9e6] p-6 text-center dark:from-[#2a1620] dark:via-[#241720] dark:to-[#2f1a25]">
              <Heart
                aria-hidden="true"
                size={90}
                className="absolute -top-5 -right-5 rotate-12 text-white/50 dark:text-white/5"
              />
              <Sparkles
                aria-hidden="true"
                size={22}
                className="relative mx-auto text-[#d6455f] dark:text-[#ff9bb9]"
              />
              <h2 className="font-heading relative mt-2 text-2xl leading-tight font-semibold text-[#720e32] dark:text-[#ff9bb9]">
                Make Your Day Unforgettable
              </h2>
              <p className="relative mt-2 text-xs font-medium text-[#a52b50] dark:text-[#c8b3bd]">
                Book our professional services today!
              </p>
              <Link
                href="/services"
                className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#720e32] px-5 py-2.5 text-[0.75rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
              >
                Browse Services
                <ArrowRight size={13} />
              </Link>
            </section>
          </aside>
        </div>

        {/* ================= Related services ================= */}
        <section className="mt-10">
          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[#f1ded7] dark:bg-white/10"
            />
            <h2 className="font-heading flex items-center gap-2 text-2xl font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#a52b50] dark:bg-[#ff9bb9]"
              />
              Related Services
              <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-[#a52b50] dark:bg-[#ff9bb9]"
              />
            </h2>
            <span
              aria-hidden="true"
              className="h-px flex-1 bg-[#f1ded7] dark:bg-white/10"
            />
          </div>

          {related.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {related.map((item) => (
                <ServiceCard key={item._id} service={item} />
              ))}
            </div>
          ) : (
            <p className="mt-6 rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-10 text-center text-sm text-[#6b5a61] dark:border-white/15 dark:bg-[#1e131a] dark:text-[#c8b3bd]">
              No other services to show yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
