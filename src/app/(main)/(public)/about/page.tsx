import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Headphones,
  Heart,
  MapPin,
  PartyPopper,
  Search,
  ShieldCheck,
  Sparkles,
  Tag,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About | WedPlan",
  description:
    "WedPlan brings couples and trusted wedding vendors together — discover the story, mission and people behind WedPlan.",
};

const eyebrow = ["Plan", "Book", "Celebrate"];

const stats = [
  { value: "10K+", label: "Happy Couples" },
  { value: "500+", label: "Trusted Vendors" },
  { value: "7", label: "Service Categories" },
  { value: "5", label: "Cities Nationwide" },
];

const values = [
  {
    Icon: ShieldCheck,
    title: "Verified Vendors",
    description:
      "Every vendor on WedPlan is reviewed before going live, so you book with confidence — not guesswork.",
  },
  {
    Icon: CalendarCheck,
    title: "Effortless Booking",
    description:
      "Pick a date, choose your unit and confirm in minutes. No phone tag, no back-and-forth on social media.",
  },
  {
    Icon: Tag,
    title: "Transparent Prices",
    description:
      "See real prices in taka before you commit. What you see is what you pay, with no hidden surprises.",
  },
  {
    Icon: Headphones,
    title: "Here For You",
    description:
      "From your first search to your last dance, our support team is a message away whenever you need us.",
  },
];

const steps = [
  {
    Icon: Search,
    step: "01",
    title: "Discover",
    description:
      "Browse photography, venues, catering, makeup, decoration and more across Bangladesh.",
  },
  {
    Icon: CalendarCheck,
    step: "02",
    title: "Book",
    description:
      "Check availability, lock your date and pay securely — all in one place.",
  },
  {
    Icon: PartyPopper,
    step: "03",
    title: "Celebrate",
    description:
      "Show up to your big day knowing every detail is handled by pros you can trust.",
  },
];

const categories = [
  { label: "Photography", value: "photography" },
  { label: "Decoration & Styling", value: "decoration" },
  { label: "Catering", value: "catering" },
  { label: "Makeup & Beauty", value: "makeup" },
  { label: "Venue", value: "venue" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Others", value: "others" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfbfa] pb-20 dark:bg-[#160e13]">
      {/* ---------------- Hero banner ---------------- */}
      <div className="relative isolate overflow-hidden">
        <Image
          src="/services-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fffaf7] via-[#fffaf7]/90 to-[#fffaf7]/30 dark:from-[#160e13] dark:via-[#160e13]/90 dark:to-[#160e13]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#fffaf7]/70 via-transparent to-[#fffaf7]/60 dark:from-[#160e13]/70 dark:to-[#160e13]/60" />

        <div className="mx-auto w-full max-w-[1500px] px-4 pt-7 pb-14 sm:px-6 lg:px-10 lg:pt-9 lg:pb-20">
          {/* Breadcrumb */}
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
              About
            </span>
          </nav>

          <div className="mt-8 max-w-2xl lg:mt-12">
            <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.32em] text-[#720e32] uppercase sm:text-xs dark:text-[#ff9bb9]">
              {eyebrow.map((word, i) => (
                <span key={word} className="flex items-center gap-2">
                  {word}
                  {i < eyebrow.length - 1 && (
                    <span className="text-[#c13b64] dark:text-[#ff9bb9]">•</span>
                  )}
                </span>
              ))}
            </p>

            <h1 className="font-heading mt-4 text-4xl font-semibold tracking-tight text-[#2b0713] sm:text-5xl dark:text-[#ffeaf1]">
              About WedPlan
            </h1>

            <p className="mt-4 text-base leading-relaxed text-[#5f4b53] sm:text-lg dark:text-[#c8b3bd]">
              We bring couples and trusted wedding vendors together — from the
              first spark of an idea to the last dance of the night.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">
        {/* ---------------- Stats strip ---------------- */}
        <section
          aria-label="WedPlan at a glance"
          className="relative isolate -mt-6 grid grid-cols-2 gap-3 rounded-3xl border border-[#f8dcec] bg-white p-5 shadow-[0_24px_60px_-45px_rgba(114,14,50,0.55)] sm:gap-4 sm:p-7 lg:grid-cols-4 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-1 rounded-2xl bg-[#fef8fa] px-3 py-4 text-center sm:py-5 dark:bg-white/5"
            >
              <p className="font-heading text-2xl font-semibold text-[#720e32] sm:text-3xl dark:text-[#ff9bb9]">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-[#6b5a61] sm:text-sm dark:text-[#c8b3bd]">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        {/* ---------------- Our story ---------------- */}
        <section className="mt-16 grid items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <div className="order-2 lg:order-1">
            <p className="text-[0.7rem] font-bold tracking-[0.32em] text-[#720e32] uppercase dark:text-[#ff9bb9]">
              Our Story
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
              Wedding planning shouldn&apos;t feel like a second job
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-[#5f4b53] dark:text-[#c8b3bd]">
              <p>
                WedPlan started with a simple frustration: planning a wedding
                in Bangladesh meant dozens of phone calls, scattered
                recommendations and prices you could never quite pin down. We
                knew couples deserved better.
              </p>
              <p>
                So we built one place where couples can discover verified
                vendors, compare real prices and book their dates with
                confidence — while vendors get the tools to showcase their work
                and grow their business.
              </p>
              <p>
                Today couples across Dhaka, Chattogram, Sylhet, Khulna and
                Rajshahi use WedPlan to turn their dream weddings into reality.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-[#720e32] px-7 py-3 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] sm:text-base dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                Explore Services
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full border border-[#720e32]/40 bg-white px-7 py-3 text-sm font-bold text-[#720e32] transition hover:bg-[#720e32] hover:text-white sm:text-base dark:border-[#ff9bb9]/40 dark:bg-transparent dark:text-[#ffb0c5] dark:hover:bg-[#720e32] dark:hover:text-white"
              >
                Join Free
              </Link>
            </div>
          </div>

          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-3xl border border-[#f8dcec] lg:order-2 dark:border-white/10">
            <Image
              src="/hero.jpg"
              alt="Bride and groom sharing a quiet moment on their wedding day"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-[center_38%] dark:brightness-90 dark:saturate-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2b0713]/45 via-transparent to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-auto sm:max-w-[280px] dark:border-white/10 dark:bg-[#1e131a]/90">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f472b6] to-[#db2777] text-white">
                <Heart size={18} aria-hidden="true" className="fill-current" />
              </span>
              <p className="text-sm font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                10K+ couples have said &ldquo;I do&rdquo; with WedPlan
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- What we stand for ---------------- */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-bold tracking-[0.32em] text-[#720e32] uppercase dark:text-[#ff9bb9]">
              What We Stand For
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
              Built on trust, made for joy
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#5f4b53] dark:text-[#c8b3bd]">
              Four promises that shape every feature we ship and every vendor
              we welcome onto WedPlan.
            </p>
          </div>

          <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-3xl border border-[#f8dcec] bg-white p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_50px_-40px_rgba(114,14,50,0.6)] dark:border-white/10 dark:bg-[#1e131a]"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#f472b6] to-[#db2777] text-white shadow-md transition group-hover:scale-105">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="font-heading mt-4 text-lg font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b5a61] dark:text-[#c8b3bd]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- How it works ---------------- */}
        <section className="mt-16">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[0.7rem] font-bold tracking-[0.32em] text-[#720e32] uppercase dark:text-[#ff9bb9]">
              How It Works
            </p>
            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] sm:text-4xl dark:text-[#ffeaf1]">
              Three steps to your big day
            </h2>
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-3">
            {steps.map(({ Icon, step, title, description }, index) => (
              <div
                key={step}
                className="relative overflow-hidden rounded-3xl border border-[#f8dcec] bg-gradient-to-br from-[#fff8fa] to-[#fdeef4] p-6 sm:p-7 dark:border-white/10 dark:from-[#8e2249]/15 dark:to-[#8e2249]/5"
              >
                <span
                  aria-hidden="true"
                  className="font-heading absolute top-3 right-5 text-5xl font-semibold text-[#720e32]/10 dark:text-[#ff9bb9]/15"
                >
                  {step}
                </span>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#720e32] text-white shadow-md dark:bg-[#a52b50]">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="font-heading mt-4 text-lg font-semibold text-[#2b0713] dark:text-[#ffeaf1]">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#6b5a61] dark:text-[#c8b3bd]">
                  {description}
                </p>
                {index < steps.length - 1 && (
                  <ArrowRight
                    size={20}
                    aria-hidden="true"
                    className="absolute right-5 bottom-6 hidden text-[#e6c3d3] lg:block dark:text-[#6f5c66]"
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ---------------- Categories ---------------- */}
        <section className="mt-16 rounded-3xl border border-[#f8dcec] bg-white p-6 sm:p-9 dark:border-white/10 dark:bg-[#1e131a]">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.32em] text-[#720e32] uppercase dark:text-[#ff9bb9]">
                <Sparkles size={14} aria-hidden="true" />
                Everything Wedding
              </p>
              <h2 className="font-heading mt-3 text-2xl font-semibold tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
                One platform, every category
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-[#8e2249] transition hover:text-[#720e32] dark:text-[#ff9bb9] dark:hover:text-[#f9a8c4]"
            >
              Browse all
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {categories.map((category) => (
              <Link
                key={category.value}
                href={`/services?category=${category.value}`}
                className="rounded-full border border-[#f3d5e2] bg-[#fef8fa] px-5 py-2.5 text-sm font-bold text-[#8e2249] transition hover:border-[#720e32] hover:bg-[#720e32] hover:text-white focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/10 dark:bg-white/5 dark:text-[#ffb0c5] dark:hover:border-[#a52b50] dark:hover:bg-[#a52b50] dark:hover:text-white dark:focus-visible:ring-[#ff9bb9]/30"
              >
                {category.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-[#6b5a61] dark:text-[#c8b3bd]">
            <MapPin
              size={15}
              aria-hidden="true"
              className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
            />
            Serving couples in Dhaka, Chattogram, Sylhet, Khulna and Rajshahi.
          </p>
        </section>

        {/* ---------------- CTA ---------------- */}
        <section className="relative isolate mt-16 overflow-hidden rounded-3xl border border-[#f8dcec] dark:border-[#8e2249]/40">
          <Image
            src="/services-banner.jpg"
            alt=""
            fill
            sizes="(max-width: 1500px) 100vw, 1440px"
            className="-z-20 object-cover object-center"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#fce7f3] via-[#fce7f3]/92 to-[#fce7f3]/55 dark:from-[#2a121c] dark:via-[#2a121c]/92 dark:to-[#2a121c]/60" />

          <div className="flex flex-col items-start gap-5 px-6 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <BadgeCheck
                size={26}
                aria-hidden="true"
                className="text-[#a52b50] dark:text-[#ff9bb9]"
              />
              <h2 className="font-heading mt-3 text-2xl font-semibold tracking-tight text-[#2b0713] sm:text-3xl dark:text-[#ffeaf1]">
                Ready to plan your dream wedding?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#6b5a61] sm:text-base dark:text-[#c8b3bd]">
                Join thousands of couples who found their perfect vendors on
                WedPlan — it&apos;s free to get started.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full bg-[#720e32] px-7 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-[#570a26] sm:text-base dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
              >
                Browse Services
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 rounded-full border border-[#720e32]/40 bg-white px-7 py-3.5 text-sm font-bold text-[#720e32] transition hover:bg-[#720e32] hover:text-white sm:text-base dark:border-[#ff9bb9]/40 dark:bg-transparent dark:text-[#ffb0c5] dark:hover:bg-[#720e32] dark:hover:text-white"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
