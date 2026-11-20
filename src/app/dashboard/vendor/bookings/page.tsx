import Image from "next/image";
import {
  CalendarDays,
  Check,
  Clock,
  Eye,
  MessageCircle,
  Star,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Booking Requests | WedPlan",
  description: "View and manage all booking requests from clients.",
};

type Status = "pending" | "confirmed" | "completed" | "cancelled";

type Action = "respond" | "message" | "review" | "cancelled";

type Request = {
  id: string;
  name: string;
  avatar: string;
  isNew?: boolean;
  service: string;
  duration: string;
  serviceImage: string;
  date: string;
  time: string;
  amount: string;
  status: Status;
  action: Action;
};

const TABS: { label: string; count: number; active?: boolean }[] = [
  { label: "All Requests", count: 5, active: true },
  { label: "Pending", count: 3 },
  { label: "Confirmed", count: 1 },
  { label: "Completed", count: 1 },
  { label: "Cancelled", count: 0 },
];

const REQUESTS: Request[] = [
  {
    id: "req-1",
    name: "Tania Islam",
    avatar: "/avatar-12.jpg",
    isNew: true,
    service: "Wedding Photography",
    duration: "1 Hour",
    serviceImage: "/service-photography.jpg",
    date: "Dec 20, 2026",
    time: "10:00 AM",
    amount: "৳ 8,000",
    status: "pending",
    action: "respond",
  },
  {
    id: "req-2",
    name: "Rakib Hasan",
    avatar: "/avatar-26.jpg",
    isNew: true,
    service: "Decoration & Styling",
    duration: "3 Hours",
    serviceImage: "/service-decoration.jpg",
    date: "Dec 21, 2026",
    time: "02:00 PM",
    amount: "৳ 15,000",
    status: "pending",
    action: "respond",
  },
  {
    id: "req-3",
    name: "Meherun Nisa",
    avatar: "/avatar-44.jpg",
    service: "Bridal Makeup",
    duration: "2 Hours",
    serviceImage: "/service-bridal-makeup.jpg",
    date: "Dec 22, 2026",
    time: "11:00 AM",
    amount: "৳ 10,000",
    status: "confirmed",
    action: "message",
  },
  {
    id: "req-4",
    name: "Fahim Ahmed",
    avatar: "/avatar-68.jpg",
    service: "Catering Services",
    duration: "5 Hours",
    serviceImage: "/service-catering.jpg",
    date: "Dec 23, 2026",
    time: "07:00 PM",
    amount: "৳ 25,000",
    status: "completed",
    action: "review",
  },
  {
    id: "req-5",
    name: "Nusrat Jahan",
    avatar: "/avatar-12.jpg",
    service: "Event Planning",
    duration: "Full Day",
    serviceImage: "/service-planning.jpg",
    date: "Dec 23, 2026",
    time: "09:00 AM",
    amount: "৳ 30,000",
    status: "cancelled",
    action: "cancelled",
  },
];

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLE: Record<Status, string> = {
  pending:
    "bg-[#fff7ed] text-[#c2410c] border border-[#fed7aa] dark:bg-[#c2410c]/15 dark:text-[#fdba74] dark:border-[#c2410c]/40",
  confirmed:
    "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0] dark:bg-[#15803d]/20 dark:text-[#4ade80] dark:border-[#15803d]/40",
  completed:
    "bg-[#ede9fe] text-[#6d28d9] border border-[#ddd6fe] dark:bg-[#6d28d9]/25 dark:text-[#c4b5fd] dark:border-[#6d28d9]/40",
  cancelled:
    "bg-[#fee2e2] text-[#d6455f] border border-[#fecaca] dark:bg-[#d6455f]/20 dark:text-[#ff8fa3] dark:border-[#d6455f]/40",
};

const STATUS_ICON: Record<Status, typeof Clock> = {
  pending: Clock,
  confirmed: Check,
  completed: Check,
  cancelled: Clock,
};

const ACTION_STYLE =
  "inline-flex items-center gap-1.5 rounded-lg border border-[#e3c3bd] bg-white px-3.5 py-2 text-[0.72rem] font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30";

function RequestAction({ action, hendleActionButton }: { action: Action , hendleActionButton : ()=>{}}) {
  if (action === "cancelled") {
    return (
     <button type="button" disabled className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3c3bd] bg-gray-100 px-3.5 py-2 text-[0.72rem] font-bold text-gray-400 opacity-60 cursor-not-allowed transition dark:border-white/10 dark:bg-white/5 dark:text-gray-500">
      <X size={13} />
      Cancelled
    </button>
    );
  }

  const config = {
    respond: { label: "Respond", icon: Check },
    message: { label: "Message", icon: MessageCircle },
    review: { label: "View Review", icon: Star },
  }[action];

  const Icon = config.icon;

  return (
    <button type="button" className={ACTION_STYLE} onClick={hendleActionButton}>
      <Icon size={13} />
      {config.label}
    </button>
  );
}

export default function VendorBookingsPage() {
    const hendleActionButton = ()=>{
        console.log('clicked');
    }
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
            Vendor Dashboard
            <span
              aria-hidden="true"
              className="h-px w-7 bg-[#a52b50]/50 dark:bg-[#ff9bb9]/50"
            />
          </p>
          <h1 className="font-heading mt-3 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
            Booking Requests
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
            View and manage all booking requests from clients.
          </p>
        </div>
      </div>

      {/* ---------- Status tabs ---------- */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-10">
        <div
          role="tablist"
          aria-label="Filter booking requests"
          className="flex flex-wrap gap-2 sm:gap-2.5"
        >
          {TABS.map((tab) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={Boolean(tab.active)}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[0.78rem] font-bold transition focus-visible:ring-2 focus-visible:outline-none",
                tab.active
                  ? "bg-[#720e32] text-white shadow-md focus-visible:ring-[#720e32]/40 dark:bg-[#a52b50] dark:focus-visible:ring-[#ff9bb9]/40"
                  : "border border-[#f1ded7] bg-white text-[#6b5a61] hover:border-[#e3c3bd] hover:text-[#720e32] focus-visible:ring-[#720e32]/30 dark:border-white/10 dark:bg-[#1e131a] dark:text-[#c8b3bd] dark:hover:border-white/20 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30",
              )}
            >
              {tab.label}
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[0.65rem] tabular-nums",
                  tab.active
                    ? "bg-white/20 text-white"
                    : "bg-[#fdeef2] text-[#a52b50] dark:bg-[#a52b50]/20 dark:text-[#ff9bb9]",
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------- Request rows ---------- */}
      <div className="mx-auto mt-5 w-full max-w-7xl space-y-4 px-4 sm:px-6 lg:px-10">
        {REQUESTS.map((request) => {
          const StatusIcon = STATUS_ICON[request.status];
          return (
            <article
              key={request.id}
              className="rounded-2xl border border-[#f1ded7] bg-white p-4 shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] transition hover:border-[#e3c3bd] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-5">
                {/* Client */}
                <div className="flex shrink-0 items-center gap-3 xl:w-44">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-[#f6ece8] dark:bg-[#241720]">
                    <Image
                      src={request.avatar}
                      alt={request.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                      {request.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-[0.7rem] font-medium text-[#8a7a80] dark:text-[#9b8792]">
                        Client
                      </span>
                      {request.isNew && (
                        <span className="rounded-full bg-[#fdeef2] px-2 py-0.5 text-[0.6rem] font-bold text-[#a52b50] dark:bg-[#a52b50]/20 dark:text-[#ff9bb9]">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div className="flex min-w-0 flex-1 items-center gap-3 xl:w-auto">
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-[#f6ece8] dark:bg-[#241720]">
                    <Image
                      src={request.serviceImage}
                      alt={request.service}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                      {request.service}
                    </p>
                    <p className="mt-1 truncate text-xs text-[#8a7a80] dark:text-[#9b8792]">
                      {request.duration}
                    </p>
                  </div>
                </div>

                {/* Date & time */}
                <div className="shrink-0 xl:w-32">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-[#4a3a41] dark:text-[#d5c1ca]">
                    <CalendarDays
                      size={13}
                      className="text-[#a52b50] dark:text-[#ff9bb9]"
                    />
                    {request.date}
                  </p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#9b8792]">
                    <Clock size={13} className="text-[#a52b50] dark:text-[#ff9bb9]" />
                    {request.time}
                  </p>
                </div>

                {/* Amount */}
                <div className="shrink-0 xl:w-24">
                  <p className="text-base font-extrabold text-[#720e32] dark:text-[#ff9bb9]">
                    {request.amount}
                  </p>
                  <p className="mt-0.5 text-[0.68rem] text-[#8a7a80] dark:text-[#9b8792]">
                    Total Amount
                  </p>
                </div>

                {/* Status + actions */}
                <div className="flex flex-wrap items-center gap-3 xl:ml-auto xl:shrink-0">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.7rem] font-bold",
                      STATUS_STYLE[request.status],
                    )}
                  >
                    <StatusIcon size={12} />
                    {STATUS_LABEL[request.status]}
                  </span>

                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#720e32] px-3.5 py-2 text-[0.72rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                  >
                    <Eye size={13} />
                    View Details
                  </button>

                  <RequestAction action={request.action} hendleActionButton={hendleActionButton}/>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
