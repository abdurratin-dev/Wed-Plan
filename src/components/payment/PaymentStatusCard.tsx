import Link from "next/link";
import { Check, X } from "lucide-react";
import { creatBookings } from "@/lib/actions/api/booking";

type Action = {
  href: string;
  label: string;
  variant: "primary" | "secondary";
};

type PaymentStatusCardProps = {
  status: "success" | "cancel";
  eyebrow?: string;
  title: string;
  message: string;
  note?: string;
  actions: Action[];
};

export default function PaymentStatusCard({
  status,
  eyebrow,
  title,
  message,
  note,
  actions,
}: PaymentStatusCardProps) {
  const isSuccess = status === "success";
  const Icon = isSuccess ? Check : X;

  return (
    <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-[#f3dae3] bg-white px-6 py-10 text-center shadow-[0_24px_60px_-30px_rgba(43,7,19,0.35)] sm:px-10 dark:border-[#3a2430] dark:bg-[#22161d]">
      {/* soft blush accents */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-[#fce7ef] blur-2xl dark:bg-[#8e2249]/25"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#fce7ef] blur-2xl dark:bg-[#8e2249]/25"
      />

      <div className="relative flex flex-col items-center">
        <span
          className={
            isSuccess
              ? "flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f7ee] ring-4 ring-[#e7f7ee]/70 dark:bg-[#123524]/60 dark:ring-[#123524]/40"
              : "flex h-20 w-20 items-center justify-center rounded-full bg-[#fce7ef] ring-4 ring-[#fce7ef]/70 dark:bg-[#3a2430] dark:ring-[#3a2430]/50"
          }
        >
          <Icon
            size={34}
            strokeWidth={2.5}
            className={
              isSuccess
                ? "text-[#16a34a] dark:text-[#4ade80]"
                : "text-[#a52b50] dark:text-[#ff9bb9]"
            }
          />
        </span>

        {eyebrow && (
          <p className="mt-6 text-[0.68rem] font-bold tracking-[0.22em] text-[#a52b50] uppercase dark:text-[#ff9bb9]">
            {eyebrow}
          </p>
        )}

        <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
          {title}
        </h1>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#6b5a61] sm:text-[0.95rem] dark:text-[#c8b3bd]">
          {message}
        </p>

        {note && (
          <p className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#fdeef3] px-4 py-2.5 text-xs leading-relaxed text-[#8a7480] dark:bg-[#2c1c25] dark:text-[#a9909c]">
            {note}
          </p>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          {actions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={
                action.variant === "primary"
                  ? "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#8e2249] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#5c0f28] sm:w-auto dark:bg-[#ff9bb9] dark:text-[#2b0713] dark:hover:bg-[#ffb9cd]"
                  : "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#e7c9d5] px-6 py-3 text-sm font-semibold text-[#8e2249] transition-colors hover:bg-[#fce7ef] sm:w-auto dark:border-[#3a2430] dark:text-[#ff9bb9] dark:hover:bg-[#2c1c25]"
              }
            >
              {action.label}
            </Link>
          ))}
        </div>

        <p className="mt-6 text-xs text-[#a18c96] dark:text-[#8a7480]">
          Need help?{" "}
          <Link
            href="/contact"
            className="font-medium text-[#8e2249] underline-offset-2 hover:underline dark:text-[#ff9bb9]"
          >
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
