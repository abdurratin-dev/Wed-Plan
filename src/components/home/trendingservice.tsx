import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MapPin,
  Star,
} from "lucide-react";

import { ServiceData } from "@/types/apidata";
import { getServiceData } from "@/lib/actions/api/service";

export default async function NewServices() {
  const services: ServiceData[] = await getServiceData();

  const activeServices = services.filter(
    (service) => service.status === "Active",
  );

  return (
    <section className="overflow-hidden bg-[#fdfbfa] py-12 dark:bg-[#160e13]">
      <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-6 lg:px-10">

        {/* Header */}
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">

          <div>
            <span className="inline-flex items-center rounded-full border border-[#e8c9d1] bg-[#fdeef2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#720e32] dark:border-[#a52b50]/30 dark:bg-[#a52b50]/15 dark:text-[#ff9bb9]">
              Just In
            </span>

            <h2 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[#2b0713] dark:text-[#ffeaf1]">
              New Services
            </h2>

            <p className="mt-1 text-sm text-[#8a7a80] dark:text-[#bba7b0]">
              Discover our latest wedding services
            </p>
          </div>

          <Link
            href="/services"
            className="group inline-flex items-center gap-2 rounded-full border border-[#e3c3bd] bg-white px-5 py-2.5 text-sm font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#fdeef2] dark:border-white/15 dark:bg-[#1e131a] dark:text-[#ff9bb9] dark:hover:border-[#ff9bb9] dark:hover:bg-white/5"
          >
            See All Services
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* Services */}
        {activeServices.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">

            {activeServices.slice(-10).map((service) => (
              <article
                key={service._id}
                className="group overflow-hidden rounded-[24px] border border-[#f1ded7] bg-white shadow-[0_12px_35px_-28px_rgba(114,14,50,0.5)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-25px_rgba(114,14,50,0.3)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-[#f6ece8] dark:bg-[#241720]">

                  <Image
                    src={service.imageUrl}
                    alt={service.alt || service.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Favorite */}
                  <button
                    type="button"
                    aria-label={`Add ${service.name} to favorites`}
                    className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full border border-white/70 bg-white/90 text-[#5a3542] shadow-sm backdrop-blur-sm transition hover:bg-[#720e32] hover:text-white"
                  >
                    <Heart size={18} />
                  </button>

                  {/* Category */}
                  <span className="absolute top-3 left-3 rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-bold text-[#720e32] shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-[#1e131a]/90 dark:text-[#ff9bb9]">
                    {service.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">

                  {/* Service Name */}
                  <h3 className="line-clamp-1 text-base font-bold text-[#2b0713] transition-colors group-hover:text-[#a52b50] dark:text-[#ffeaf1] dark:group-hover:text-[#ff9bb9]">
                    {service.name}
                  </h3>

                  {/* Vendor */}
                  <p className="mt-1 truncate text-xs font-medium text-[#8a7a80] dark:text-[#bba7b0]">
                    By {service.vendorName}
                  </p>

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#8a7a80] dark:text-[#bba7b0]">
                    <MapPin
                      size={14}
                      className="shrink-0 text-[#a52b50] dark:text-[#ff9bb9]"
                    />
                    <span className="truncate">{service.location}</span>
                  </div>

                  {/* Rating & Bookings */}
                  <div className="mt-3 flex items-center justify-between gap-2">

                    <div className="flex items-center gap-1.5">
                      <Star
                        size={15}
                        className={
                          service.rating > 0
                            ? "fill-[#f5b301] text-[#f5b301]"
                            : "text-[#d8c8cd] dark:text-[#6f5c66]"
                        }
                      />

                      {service.rating > 0 ? (
                        <span className="text-xs font-bold text-[#4a3a41] dark:text-[#e8d5dd]">
                          {service.rating.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-[#8a7a80] dark:text-[#bba7b0]">
                          No ratings yet
                        </span>
                      )}
                    </div>

                    {service.bookings > 0 && (
                      <span className="truncate text-[11px] text-[#8a7a80] dark:text-[#9b8792]">
                        {service.bookings} bookings
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="my-4 h-px bg-[#f1e5e1] dark:bg-white/10" />

                  {/* Price + Button */}
                  <div className="flex items-center justify-between gap-2">

                    <div className="min-w-0">
                      <span className="text-xs text-[#8a7a80] dark:text-[#9b8792]">
                        From
                      </span>

                      <p className="truncate text-xl font-extrabold text-[#2b0713] dark:text-[#ffeaf1]">
                        ৳ {service.price}
                      </p>
                    </div>

                    <Link
                      href={`/services/${service._id}`}
                      className="group/btn inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#e3c3bd] px-3.5 py-2.5 text-xs font-bold text-[#720e32] transition hover:border-[#720e32] hover:bg-[#720e32] hover:text-white dark:border-[#a52b50]/50 dark:text-[#ff9bb9] dark:hover:border-[#a52b50] dark:hover:bg-[#a52b50] dark:hover:text-white"
                    >
                      Book Now
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover/btn:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}

          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#e3c3bd] bg-white px-6 py-16 text-center dark:border-white/15 dark:bg-[#1e131a]">
            <p className="text-sm font-medium text-[#8a7a80] dark:text-[#bba7b0]">
              No services available right now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}