
import Link from "next/link";
import { 
  Heart, 
  Home, 
  Search, 
  ArrowLeft,
  Flower2,
  Sparkles
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f6] px-4 py-16 transition-colors duration-300 dark:bg-[#160d11]">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#800d35]/15" />

      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#f8dadd]/50 blur-3xl dark:bg-[#800d35]/15" />

      <div className="pointer-events-none absolute left-[15%] top-[20%] text-[#dba2a9]/40 dark:text-[#dba2a9]/20">
        <Flower2 size={55} strokeWidth={1} />
      </div>

      <div className="pointer-events-none absolute bottom-[20%] right-[15%] text-[#dba2a9]/40 dark:text-[#dba2a9]/20">
        <Sparkles size={50} strokeWidth={1} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">

        {/* Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-[#efd2d3] bg-white shadow-lg shadow-[#800d35]/5 dark:border-white/10 dark:bg-[#25151c]">
            <Heart
              size={38}
              strokeWidth={1.5}
              className="text-[#800d35] dark:text-[#f08ba8]"
            />

            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#800d35] text-white">
              <Sparkles size={14} />
            </span>
          </div>
        </div>

        {/* 404 */}
        <div className="relative mb-5">
          <h1 className="font-serif text-[120px] font-bold leading-none tracking-tight text-[#800d35]/10 dark:text-[#f08ba8]/10 sm:text-[180px]">
            404
          </h1>

          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-serif text-5xl font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-7xl">
              Oops!
            </p>
          </div>
        </div>

        {/* Text */}
        <div className="mx-auto max-w-lg">
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#dba2a9]" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-[#800d35] dark:text-[#f08ba8]">
              Lost in the Wedding?
            </span>
            <span className="h-px w-10 bg-[#dba2a9]" />
          </div>

          <h2 className="font-serif text-3xl font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-4xl">
            This Page Couldn't Be Found
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#725b62] dark:text-[#c5aeb6] sm:text-base">
            Looks like this page has gone missing! Don't worry,
            your perfect wedding journey is still waiting for you.
            Let's get you back on track.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">

          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#800d35] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#800d35]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#650a2a] sm:w-auto"
          >
            <Home size={17} />
            Back to Home
          </Link>

          <Link
            href="/services"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e8c5c8] bg-white px-7 py-3.5 text-sm font-bold text-[#800d35] transition-all duration-300 hover:-translate-y-1 hover:border-[#800d35] hover:bg-[#fdf0f0] dark:border-white/15 dark:bg-[#25151c] dark:text-[#f5a2b7] dark:hover:border-[#f08ba8] dark:hover:bg-[#351d27] sm:w-auto"
          >
            <Search size={17} />
            Browse Services
          </Link>
        </div>

        {/* Bottom Note */}
        <div className="mt-14 flex items-center justify-center gap-2 text-xs text-[#987b83] dark:text-[#aa929b]">
          <Heart size={14} className="fill-[#dba2a9] text-[#dba2a9]" />
          <span>Made with love for your perfect wedding.</span>
        </div>

      </div>
    </main>
  );
}
