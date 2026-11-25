import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import HeroImg from "@/assests/Wedding Photography Pose Ideas That Look Natural and Beautiful.jpeg"

const avatars = [
  "/avatar-44.jpg",
  "/avatar-68.jpg",
  "/avatar-26.jpg",
  "/avatar-12.jpg",
];

const eyebrow = ["Plan", "Book", "Celebrate"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br min-h-[560px] h-auto lg:h-170 from-[#fff8f4] via-[#fdf1eb] to-[#fae7de] dark:from-[#1b1118] dark:via-[#160e13] dark:to-[#22141c]">
      {/* Soft background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-rose-200/50 blur-3xl dark:bg-rose-950/40" />
        <div className="absolute bottom-0 left-1/3 h-64 w-72 rounded-full bg-orange-100/70 blur-3xl dark:bg-[#a52b50]/10" />
        <div className="absolute right-1/4 top-1/3 h-56 w-56 rounded-full bg-pink-100/70 blur-3xl dark:bg-[#720e32]/20" />
      </div>

      {/* Couple photo — desktop: full-bleed on the right */}
      <div className="absolute inset-y-0 right-0 hidden w-[42%] lg:block">
        <Image
          src={HeroImg}
          alt="Bride and groom sharing a quiet moment on their wedding day"
          fill
          priority
          sizes="42vw"
          className="object-cover object-[center_38%] dark:brightness-90 dark:saturate-[0.92]"
        />
        {/* Fade the photo into the page background */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdf1eb] from-5% via-[#fdf1eb]/55 via-35% to-transparent dark:from-[#160e13] dark:via-[#160e13]/60" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#fdf1eb]/70 to-transparent dark:from-[#160e13]/70" />
      </div>

      <div className="relative mx-auto flex max-w-[1600px] flex-col gap-10 px-4 pb-16 pt-14 sm:px-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-10 lg:pb-24 lg:pt-20">
        {/* Copy */}
        <div className="flex flex-col items-start gap-5 sm:gap-6">
          <p className="flex animate-fade-up items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.32em] text-[#720e32] sm:text-xs dark:text-[#ff9bb9]">
            {eyebrow.map((word, i) => (
              <span key={word} className="flex items-center gap-2">
                {word}
                {i < eyebrow.length - 1 && (
                  <span className="text-[#c13b64] dark:text-[#ff9bb9]">•</span>
                )}
              </span>
            ))}
          </p>

          <h1
            className="font-heading text-[2.35rem] font-semibold leading-[1.06] tracking-tight text-[#2b0713] animate-fade-up sm:text-5xl md:text-6xl lg:text-[3.9rem] dark:text-[#ffeaf1]"
            style={{ animationDelay: "80ms" }}
          >
            Your Dream Wedding <br className="hidden sm:block" />
            Starts Here
          </h1>

          <p
            className="max-w-xl text-base leading-relaxed text-[#5f4b53] animate-fade-up sm:text-lg dark:text-[#c8b3bd]"
            style={{ animationDelay: "160ms" }}
          >
            Discover the best wedding services and book trusted vendors for your
            special day.
          </p>
          <Link
            href="/services"
            className="inline-flex animate-fade-up items-center justify-center rounded-2xl bg-[#720e32] px-8 py-3.5 text-base font-bold text-white transition hover:bg-[#570a26] sm:rounded-full dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
            style={{ animationDelay: "240ms" }}
          >
            Explore Wedding Services
          </Link>
          {/* Social proof */}
          <div
            className="flex animate-fade-up flex-wrap items-center gap-4 pt-1"
            style={{ animationDelay: "320ms" }}
          >
            <div className="flex -space-x-3">
              {avatars.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  aria-hidden="true"
                  width={44}
                  height={44}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#fffaf7] sm:h-11 sm:w-11 dark:ring-[#1b1118]"
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Heart
                aria-hidden="true"
                className="h-5 w-5 fill-[#e11d48] text-[#e11d48]"
              />
              <p className="text-sm font-bold text-[#2b0713] sm:text-base dark:text-[#ffeaf1]">
                10K+{" "}
                <span className="font-medium text-[#5f4b53] dark:text-[#c8b3bd]">
                  Happy Couples
                </span>
              </p>
            </div>
          </div>

          {/* Couple photo — tablet / mobile: card below the copy */}
          <div className="relative mt-2 h-[300px] w-full overflow-hidden rounded-3xl border border-[#efe2dd] sm:h-[380px] lg:hidden dark:border-white/10">
            <Image
              src={HeroImg}
              alt="Bride and groom sharing a quiet moment on their wedding day"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-[center_38%] dark:brightness-90 dark:saturate-[0.92]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
