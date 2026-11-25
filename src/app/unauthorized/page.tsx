
import Link from "next/link";
import {
  LockKeyhole,
  ShieldAlert,
  Home,
  LogIn,
  Heart,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

export default function Unauthorized() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f6] px-4 py-16 transition-colors duration-300 dark:bg-[#160d11]">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#800d35]/15" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#800d35]/15" />

      <div className="pointer-events-none absolute left-[15%] top-[20%] text-[#dba2a9]/40 dark:text-[#dba2a9]/20">
        <Sparkles size={50} strokeWidth={1} />
      </div>

      <div className="pointer-events-none absolute bottom-[20%] right-[15%] text-[#dba2a9]/40 dark:text-[#dba2a9]/20">
        <Heart size={55} strokeWidth={1} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">

        {/* Security Icon */}
        <div className="relative mb-9 flex justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-[#efd2d3] bg-white shadow-xl shadow-[#800d35]/5 dark:border-white/10 dark:bg-[#25151c]">
            <LockKeyhole
              size={42}
              strokeWidth={1.5}
              className="text-[#800d35] dark:text-[#f08ba8]"
            />

            <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-[#fff8f6] bg-[#800d35] text-white dark:border-[#160d11]">
              <ShieldAlert size={15} />
            </span>
          </div>
        </div>

        {/* Error Code */}
        <div className="relative mb-5">
          <h1 className="font-serif text-[110px] font-bold leading-none tracking-tight text-[#800d35]/10 dark:text-[#f08ba8]/10 sm:text-[170px]">
            401
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-serif text-4xl font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-6xl">
              Access Denied
            </p>
          </div>
        </div>

        {/* Heading */}
        <div className="mx-auto max-w-lg">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#dba2a9]" />

            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#800d35] dark:text-[#f08ba8]">
              Restricted Area
            </span>

            <span className="h-px w-10 bg-[#dba2a9]" />
          </div>

          <h2 className="font-serif text-2xl font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-3xl">
            You Don't Have Permission
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#725b62] dark:text-[#c5aeb6] sm:text-base">
            Sorry! You are not authorized to access this page.
            This area is restricted to users with the required
            permissions. Please sign in with an authorized account
            to continue.
          </p>
        </div>

        {/* Permission Info */}
        <div className="mx-auto mt-8 flex max-w-md items-center gap-3 rounded-2xl border border-[#f0d5d2] bg-white/70 p-4 text-left dark:border-white/10 dark:bg-[#25151c]/80">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbe9e9] dark:bg-[#800d35]/20">
            <ShieldCheck
              size={23}
              className="text-[#800d35] dark:text-[#f08ba8]"
            />
          </div>

          <div>
            <p className="text-sm font-bold text-[#590d26] dark:text-[#ffe2e9]">
              Protected Area
            </p>
            <p className="mt-1 text-xs leading-5 text-[#987b83] dark:text-[#aa929b]">
              Your account may not have the required access level.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8c5c8] bg-white px-7 py-3.5 text-sm font-bold text-[#800d35] transition-all duration-300 hover:-translate-y-1 hover:border-[#800d35] hover:bg-[#fdf0f0] dark:border-white/15 dark:bg-[#25151c] dark:text-[#f5a2b7] dark:hover:border-[#f08ba8] dark:hover:bg-[#351d27] sm:w-auto"
          >
            <Home size={17} />
            Back to Home
          </Link>

        </div>

        {/* Bottom Note */}
        <div className="mt-14 flex items-center justify-center gap-2 text-xs text-[#987b83] dark:text-[#aa929b]">
          <Heart size={14} className="fill-[#dba2a9] text-[#dba2a9]" />
          <span>WedPlan — Your Perfect Wedding Journey.</span>
        </div>

      </div>
    </main>
  );
}
