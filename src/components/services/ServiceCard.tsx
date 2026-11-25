"use client";

import { ServiceData } from "@/types/apidata";
import { ArrowRight, Heart, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useState } from "react";

/** `reviews` has been a number and a list of review objects over time. */
const reviewCount = (reviews: ServiceData["reviews"]) =>
  Array.isArray(reviews)
    ? reviews.length
    : typeof reviews === "number"
      ? reviews
      : 0;
import Link from "next/link";

export default function ServiceCard({ service }: { service: ServiceData }) {
  const [favorite, setFavorite] = useState(false);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#f1ded7] bg-white shadow-[0_24px_50px_-38px_rgba(114,14,50,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_60px_-38px_rgba(114,14,50,0.65)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20">
      {/* Image + favorite */}
      <div className="relative aspect-[16/10]">
        <Link
          href={`/services/${service._id}`}
          aria-label={`View ${service.name} details`}
          className="absolute inset-0 block overflow-hidden"
        >
          <Image
            src={service.imageUrl}
            alt={service.alt || service.name}
            fill
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/25 to-transparent" />
        </Link>

        <button
          type="button"
          onClick={() => setFavorite((prev) => !prev)}
          aria-pressed={favorite}
          aria-label={
            favorite
              ? `Remove ${service.name} from favorites`
              : `Add ${service.name} to favorites`
          }
          className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition active:scale-90 hover:bg-white focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#1e131a]/90 dark:hover:bg-[#241720]"
        >
          <Heart
            size={16}
            className={cn(
              "transition",
              favorite
                ? "fill-current text-[#e11d48] dark:text-[#ff9bb9]"
                : "text-[#4a3a41] dark:text-[#d5c1ca]",
            )}
          />
        </button>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-[1.02rem] leading-snug font-bold text-[#2b0713] dark:text-[#ffeaf1]">
          <Link
            href={`/services/${service._id}`}
            className="transition hover:text-[#720e32] dark:hover:text-[#ff9bb9]"
          >
            {service.name}
          </Link>
        </h3>

        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
          {/* <Icon
                            size={13}
                            className="text-[#a52b50] dark:text-[#ff9bb9]"
                            /> */}
          {service.category}
          <span
            aria-hidden="true"
            className="text-[#c4b4ba] dark:text-[#6f5c66]"
          >
            ·
          </span>
          <MapPin size={13} className="text-[#a52b50] dark:text-[#ff9bb9]" />
          {service.location}
        </p>

        <p className="mt-2.5 flex items-center gap-1.5 text-xs text-[#6b5a61] dark:text-[#c8b3bd]">
          <Star size={14} className="fill-[#f5b301] text-[#f5b301]" />
          {typeof service.rating === "number" && service.rating > 0 ? (
            <span className="font-bold text-[#2b0713] dark:text-[#ffeaf1]">
              {service.rating.toFixed(1)}
            </span>
          ) : null}
          {reviewCount(service.reviews) > 0 ? (
            <span className="text-[#8a7a80] dark:text-[#9b8792]">
              ({reviewCount(service.reviews)} reviews)
            </span>
          ) : (
            <span className="text-[#8a7a80] dark:text-[#9b8792]">
              No ratings yet
            </span>
          )}
        </p>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f6ece8] pt-3.5 dark:border-white/10">
          <p className="flex items-baseline gap-1.5">
            <span className="text-xs font-medium text-[#8a7a80] dark:text-[#9b8792]">
              From
            </span>
            <span className="text-lg font-extrabold text-[#2b0713] dark:text-[#ffeaf1]">
              ৳ {service.price}
            </span>
          </p>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#e3c3bd] bg-white px-4 py-2 text-[0.75rem] font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#720e32] hover:text-white focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-[#ff9bb9] dark:hover:text-[#160e13] dark:focus-visible:ring-[#ff9bb9]/30"
          >
            Book Now
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}
