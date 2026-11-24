"use client";

import Link from "next/link";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Camera,
  Pencil,
  Heart,
  BriefcaseBusiness,
  Clock,
  BadgeCheck,
  ArrowRight,
  Settings,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { getBookings } from "@/lib/actions/api/booking";
import { BookingsData } from "@/types/apidata";

const ProfilePage = () => {
  const [booking, setBookings] = useState<BookingsData[]>([]);
  const [complitedBookings, setComlitedBookings] = useState<BookingsData[]>([]);
  const [pendigBookings, setPendingBookings] = useState<BookingsData[]>([]);
  const { data: session, error } = authClient.useSession();
  const user = session?.user;
  useEffect(() => {
    const getData = async () => {
      const res : BookingsData[] = await getBookings(`role=${user?.role}&userId=${user?.id}`);
      setBookings(res);
    };
    getData();
    setComlitedBookings(
        booking.filter((u) => u.bookingStatus === "Upcoming"),
      );
      setPendingBookings(
        booking.filter((u) => u.bookingStatus === "Completed"),
      );
  }, [user]);
  const bookings: BookingsData[] = !Array.isArray(booking) ? [] : booking;
  const profileStatus = [
    {
      title: "Total Bookings",
      value: bookings.length,
      icon: BriefcaseBusiness,
      color: "bg-[#fce7ef] text-[#9b1748]",
    },
    {
      title: "Completed",
      value: complitedBookings?.length,
      icon: BadgeCheck,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Pending",
      value: pendigBookings?.length,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
    },
  ];
  return (
    <main className="min-h-screen bg-[#fff9f6] px-4 py-6 transition-colors duration-300 sm:px-6 lg:px-8 dark:bg-[#110a0e]">
      <div className="mx-auto max-w-6xl">
        {/* Page Heading */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#4c1028] dark:text-white">
              My Profile
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage your personal information and account settings.
            </p>
          </div>

          <Link
            href="/profile/edit"
            className="inline-flex items-center gap-2 rounded-xl bg-[#720e32] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#941443] dark:bg-[#e52d82] dark:hover:bg-[#c91d6b]"
          >
            <Pencil size={16} />
            Edit Profile
          </Link>
        </div>

        {/* Profile Cover */}
        <section className="overflow-hidden rounded-2xl border border-[#f0dedc] bg-white shadow-sm dark:border-white/10 dark:bg-[#1d111a]">
          <div className="relative h-44 overflow-hidden bg-gradient-to-r from-[#500d28] via-[#81143c] to-[#bd4774] sm:h-56">
            {/* Decorative Background */}
            <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />
            <div className="absolute -bottom-32 right-1/3 h-64 w-64 rounded-full border-[35px] border-white/5" />

            <div className="absolute left-6 top-6 flex items-center gap-2 text-white/90">
              <Heart size={20} fill="currentColor" />
              <span className="text-sm font-bold tracking-wide">WedPlan</span>
            </div>
          </div>

          {/* Profile Information */}
          <div className="relative px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* Avatar */}
                <div className="relative h-28 w-28 shrink-0 rounded-2xl border-4 border-white bg-[#f7e5e8] dark:border-[#1d111a] dark:bg-[#38202e] sm:h-32 sm:w-32">
                  {user?.image ? (
                    <></>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-xl text-4xl font-bold text-[#720e32] dark:text-[#ff8db8]">
                      {user?.name[0]}
                    </div>
                  )}

                  <button
                    type="button"
                    className="absolute -bottom-2 -right-2 rounded-full border-2 border-white bg-[#720e32] p-2 text-white dark:border-[#1d111a] dark:bg-[#e52d82]"
                    aria-label="Change profile picture"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div className="pb-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold text-white dark:text-white sm:text-2xl">
                      {user?.name}
                    </h2>
                    <BadgeCheck size={19} className="text-[#d52c75]" />
                  </div>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#fce8ef] px-3 py-1 text-xs font-bold text-[#86143d] dark:bg-[#65122f]/40 dark:text-[#ff9cbe]">
                      {user?.role}
                    </span>
                    {user?.premium && (
                      <span className="rounded-full bg-[#fcf8c7] px-3 py-1 text-xs font-bold text-[#866214] dark:bg-[#6c5911]/40 dark:text-[#ffeb9c]">
                        premium
                      </span>
                    )}

                    <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      {user?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 sm:pb-2">
                <CalendarDays size={16} className="text-[#a32b56]" />
                Joined {user?.createdAt.toDateString()}
              </div>
            </div>
          </div>
        </section>

        {/* Booking Statistics */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {profileStatus.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-white/10 dark:bg-[#1d111a]"
              >
                <div className={`rounded-xl p-3 dark:bg-white/5 ${item.color}`}>
                  <Icon size={23} />
                </div>

                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-[#451127] dark:text-white">
                    {item.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main Profile Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Personal Information */}
          <section className="rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d111a] sm:p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#451127] dark:text-white">
                  Personal Information
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your basic personal details
                </p>
              </div>

              <Link
                href="/profile/edit"
                className="rounded-lg p-2 text-[#8b2146] transition hover:bg-[#fce8ef] dark:text-[#ff8db8] dark:hover:bg-white/5"
                aria-label="Edit personal information"
              >
                <Pencil size={17} />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {[
                {
                  label: "Full Name",
                  value: user?.name,
                  icon: UserRound,
                },
                {
                  label: "Email Address",
                  value: user?.email,
                  icon: Mail,
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0f4] text-[#8b2146] dark:bg-[#65122f]/30 dark:text-[#ff91b7]">
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-[#451127] dark:text-gray-100">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* About */}
            <div className="mt-8 border-t border-[#f2e5e5] pt-6 dark:border-white/10">
              <h4 className="mb-2 text-sm font-bold text-[#451127] dark:text-white">
                About Me
              </h4>
              <p className="text-sm leading-7 text-gray-500 dark:text-gray-400">
                I am planning my dream wedding with WedPlan. Looking forward to
                making every moment special and memorable.
              </p>
            </div>
          </section>

          {/* Account Settings */}
          <section className="flex flex-col rounded-2xl border border-[#f0dedc] bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#1d111a] sm:p-6">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-[#451127] dark:text-white">
                Account Settings
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Manage your account preferences
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/profile/edit"
                className="group flex items-center justify-between rounded-xl border border-[#f1e3e3] p-3 transition hover:border-[#b52a5c] hover:bg-[#fff6f8] dark:border-white/10 dark:hover:border-[#e52d82] dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fce8ef] p-2 text-[#8b2146] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
                    <UserRound size={18} />
                  </div>
                  <span className="text-sm font-semibold text-[#451127] dark:text-gray-200">
                    Edit Profile
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-400 transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/profile/security"
                className="group flex items-center justify-between rounded-xl border border-[#f1e3e3] p-3 transition hover:border-[#b52a5c] hover:bg-[#fff6f8] dark:border-white/10 dark:hover:border-[#e52d82] dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fce8ef] p-2 text-[#8b2146] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
                    <ShieldCheck size={18} />
                  </div>
                  <span className="text-sm font-semibold text-[#451127] dark:text-gray-200">
                    Security
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-400 transition group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/settings"
                className="group flex items-center justify-between rounded-xl border border-[#f1e3e3] p-3 transition hover:border-[#b52a5c] hover:bg-[#fff6f8] dark:border-white/10 dark:hover:border-[#e52d82] dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-[#fce8ef] p-2 text-[#8b2146] dark:bg-[#65122f]/40 dark:text-[#ff91b7]">
                    <Settings size={18} />
                  </div>
                  <span className="text-sm font-semibold text-[#451127] dark:text-gray-200">
                    Preferences
                  </span>
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-400 transition group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Account Created */}
            <div className="mt-auto pt-6">
              <div className="rounded-xl bg-gradient-to-br from-[#68102f] to-[#a51e51] p-5 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <Heart size={19} fill="currentColor" />
                  <span className="text-sm font-bold">WedPlan Member</span>
                </div>

                <p className="text-xs leading-5 text-white/80">
                  Your perfect wedding journey starts with the right planning.
                </p>

                <Link
                  href="/services"
                  className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-white transition hover:gap-3"
                >
                  Explore Services
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;
