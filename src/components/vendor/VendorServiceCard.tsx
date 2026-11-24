"use client";

import EditServiceDialog from "@/components/services/EditServiceDialog";
import { ServiceData } from "@/types/apidata";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CalendarDays, Pencil, Star, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { deleteService } from "@/lib/actions/api/service";

export default function VendorServiceCard({
  service,
  isActive,
}: {
  service: ServiceData;
  isActive: boolean;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const router = useRouter();
  const hendleDelete = async() => {
    const res = await deleteService(`id=${service._id}`)
    if(res.deletedCount > 0){
      router.refresh()
    }
  };
  return (
    <>
      <article
        key={service._id}
        className="group overflow-hidden rounded-2xl border border-[#f1ded7] bg-white shadow-[0_24px_50px_-38px_rgba(114,14,50,0.6)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_34px_60px_-38px_rgba(114,14,50,0.65)] dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none dark:hover:border-white/20"
      >
        {/* Image + overlays */}
        <div className="relative aspect-[16/9]">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={
                service?.imageUrl ||
                "https://avatars.githubusercontent.com/u/297331273?v=4&size=64"
              }
              alt={service.name}
              fill
              sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/35 to-transparent" />
          </div>

          {/* Status badge */}
          <span
            className={cn(
              "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.68rem] font-bold shadow-sm backdrop-blur",
              isActive
                ? "bg-white/90 text-[#15803d] dark:bg-[#1e131a]/90 dark:text-[#4ade80]"
                : "bg-white/90 text-[#d6455f] dark:bg-[#1e131a]/90 dark:text-[#ff8fa3]",
            )}
          >
            {service.status}
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 rounded-full",
                isActive
                  ? "bg-[#22c55e] dark:bg-[#4ade80]"
                  : "bg-[#ef4444] dark:bg-[#ff6b81]",
              )}
            />
          </span>
        </div>
        {/* Body */}
        <div className="p-4">
          <h3 className="text-[1.02rem] leading-snug font-bold text-[#2b0713] dark:text-[#ffeaf1]">
            {service.name}
          </h3>

          <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#6b5a61] dark:text-[#c8b3bd]">
            {/* <CategoryIcon size={13} className="text-[#a52b50] dark:text-[#ff9bb9]" /> */}
            {service.category}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#6b5a61] dark:text-[#c8b3bd]">
            <span className="inline-flex items-center gap-1.5">
              <Star size={13} className="fill-[#f5b301] text-[#f5b301]" />
              <span className="font-bold text-[#2b0713] dark:text-[#ffeaf1]">
                {/* {service.rating.toFixed(1)} */}
              </span>{" "}
              <span className="text-[#8a7a80] dark:text-[#9b8792]">
                (
                {Array.isArray(service.reviews)
                  ? service.reviews.length
                  : service.reviews}{" "}
                Reviews)
              </span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                size={13}
                className="text-[#a52b50] dark:text-[#ff9bb9]"
              />
              {service.bookings} Bookings
            </span>
          </div>

          <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f6ece8] pt-3.5 dark:border-white/10">
            <p className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-[#2b0713] dark:text-[#ffeaf1]">
                ৳ {service.price}
              </span>{" "}
              <span className="text-[0.7rem] font-medium text-[#8a7a80] dark:text-[#9b8792]">
                / per day
              </span>
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#e3c3bd] bg-white px-3.5 py-2.5 text-[0.72rem] font-bold text-[#720e32] transition hover:bg-[#fdf1eb] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:border-white/15 dark:bg-transparent dark:text-[#ff9bb9] dark:hover:bg-white/5 dark:focus-visible:ring-[#ff9bb9]/30"
              >
                <Pencil size={12} />
                Edit
              </button>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#720e32] px-3.5 py-2.5 text-[0.72rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                    >
                      <Trash2 size={12} />
                      Delete
                    </Button>
                  }
                />
                <PopoverContent align="start">
                  <p>Are tou sure <span className="text-red-500 font-bold">Delete</span> thsi service</p>
                  <button
                    type="button"
                    onClick={hendleDelete}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#720e32] px-3.5 py-2.5 text-[0.72rem] font-bold text-white shadow-sm transition hover:bg-[#570a26] focus-visible:ring-2 focus-visible:ring-[#720e32]/40 focus-visible:outline-none dark:bg-[#a52b50] dark:hover:bg-[#c13b64] dark:focus-visible:ring-[#ff9bb9]/40"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </article>

      <EditServiceDialog
        service={service}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={() => router.refresh()}
      />
    </>
  );
}
