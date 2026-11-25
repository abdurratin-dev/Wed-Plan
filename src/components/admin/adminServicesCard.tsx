"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EditServiceDialog from "@/components/services/EditServiceDialog";
import { ServiceData } from "@/types/apidata";
import {
  Cake,
  Camera,
  Check,
  Copy,
  EllipsisVertical,
  Eye,
  Flower2,
  MapPin,
  Package,
  Pencil,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const FALLBACK_IMAGE =
  "https://avatars.githubusercontent.com/u/297331273?v=4&size=64";

interface ICategoryStyle {
  className: string;
  Icon: typeof Camera;
}

const getCategoryStyle = (category: string): ICategoryStyle => {
  const value = category.toLowerCase();

  if (value.includes("photo"))
    return {
      className:
        "bg-[#fce7f3] text-[#be185d] dark:bg-[#be185d]/15 dark:text-[#ff9bb9]",
      Icon: Camera,
    };
  if (value.includes("decor") || value.includes("flower"))
    return {
      className:
        "bg-[#ede9fe] text-[#6d28d9] dark:bg-[#6d28d9]/20 dark:text-[#c4b5fd]",
      Icon: Flower2,
    };
  if (value.includes("cater") || value.includes("cake") || value.includes("food"))
    return {
      className:
        "bg-[#ffedd5] text-[#c2410c] dark:bg-[#c2410c]/15 dark:text-[#fdba74]",
      Icon: Cake,
    };
  if (
    value.includes("beauty") ||
    value.includes("makeup") ||
    value.includes("mehndi") ||
    value.includes("bridal")
  )
    return {
      className:
        "bg-[#dcfce7] text-[#15803d] dark:bg-[#16a34a]/15 dark:text-[#4ade80]",
      Icon: Sparkles,
    };

  return {
    className:
      "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#d6cbd1]",
    Icon: Package,
  };
};

const prettyCategory = (category: string) =>
  category.replace(/\b\w/g, (char) => char.toUpperCase());

const statusStyles: Record<string, string> = {
  Active:
    "bg-[#dcfce7] text-[#15803d] dark:bg-[#16a34a]/15 dark:text-[#4ade80]",
  Pending:
    "bg-[#fef3c7] text-[#b45309] dark:bg-[#f59e0b]/15 dark:text-[#fbbf24]",
  Inactive:
    "bg-[#f3f4f6] text-[#4b5563] dark:bg-white/10 dark:text-[#c8b3bd]",
};

const statusDots: Record<string, string> = {
  Active: "bg-[#16a34a]",
  Pending: "bg-[#f59e0b]",
  Inactive: "bg-[#9ca3af]",
};

const detailRowClass =
  "flex items-center justify-between gap-3 text-[#6b7280] dark:text-[#b3a3ab] dark:text-[#c8b3bd]";
const detailLabelClass = "font-medium text-[#9ca3af] dark:text-[#9b8792]";
const detailValueClass =
  "truncate font-semibold text-[#1f2937] dark:text-[#ffeaf1]";

export default function AdminServicesCard({
  service,
  index,
}: {
  service: ServiceData;
  index: number;
}) {
  const [viewOpen, setViewOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const router = useRouter();

  const { className: categoryClass, Icon: CategoryIcon } = getCategoryStyle(
    service.category,
  );
  const status = service.status;
  const statusClass = statusStyles[status] ?? statusStyles.Inactive;
  const statusDot = statusDots[status] ?? statusDots.Inactive;

  const copyServiceId = async () => {
    try {
      await navigator.clipboard?.writeText(service._id);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } finally {
      setMenuOpen(false);
    }
  };

  return (
    <tr className="border-b border-[#f1ecef] last:border-0 dark:border-white/10">
      {/* Index */}
      <td className="px-4 py-4 text-sm font-semibold text-[#9ca3af] dark:text-[#9b8792] tabular-nums">
        {index}
      </td>

      {/* Service */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative size-12 shrink-0 overflow-hidden rounded-xl ring-1 ring-[#f1ecef] dark:ring-white/10">
            <Image
              src={service.imageUrl || FALLBACK_IMAGE}
              alt={service.alt || service.name}
              fill
              sizes="48px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#1f2937] dark:text-[#ffeaf1]">
              {service.name}
            </p>
            <p className="truncate text-xs text-[#9ca3af] dark:text-[#9b8792]">
              {service.description || service.vendorName}
            </p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${categoryClass}`}
        >
          <CategoryIcon className="size-3.5" />
          {prettyCategory(service.category)}
        </span>
      </td>

      {/* Price */}
      <td className="px-4 py-4 text-sm font-semibold text-[#1f2937] dark:text-[#ffeaf1]">
        {service.price}
      </td>

      {/* Location */}
      <td className="px-4 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#4b5563] dark:text-[#c8b3bd]">
          <MapPin className="size-4 text-[#8e2249] dark:text-[#ff9bb9]" />
          {service.location}
        </span>
      </td>

      {/* Status */}
      <td className="px-4 py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
        >
          <span className={`size-1.5 rounded-full ${statusDot}`} />
          {status}
        </span>
      </td>

      {/* Bookings */}
      <td className="px-4 py-4 text-sm font-bold text-[#1f2937] tabular-nums dark:text-[#ffeaf1]">
        {service.bookings ?? 0}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          {/* View details */}
          <Popover open={viewOpen} onOpenChange={setViewOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label={`View ${service.name}`}
                  className="rounded-lg p-2 text-[#6b7280] dark:text-[#b3a3ab] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] dark:hover:bg-white/10"
                >
                  <Eye className="size-4" />
                </button>
              }
            />
            <PopoverContent align="end" className="w-64 gap-3 p-3.5">
              <div className="border-b border-[#f1ecef] pb-2 dark:border-white/10">
                <p className="truncate text-sm font-bold text-[#1f2937] dark:text-[#ffeaf1]">
                  {service.name}
                </p>
                <p className="mt-0.5 text-xs text-[#9ca3af] dark:text-[#9b8792]">
                  {prettyCategory(service.category)} · {service.location}
                </p>
              </div>
              <dl className="flex flex-col gap-1.5 text-xs">
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Vendor</dt>
                  <dd className={detailValueClass}>{service.vendorName}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Email</dt>
                  <dd className={detailValueClass}>{service.email}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Price</dt>
                  <dd className={detailValueClass}>{service.price}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Rating</dt>
                  <dd className="inline-flex items-center gap-1 font-semibold text-[#1f2937] dark:text-[#ffeaf1]">
                    <Star className="size-3.5 fill-[#f59e0b] text-[#f59e0b]" />
                    {service.rating ?? 0}
                    <span className="font-normal text-[#9ca3af] dark:text-[#9b8792]">
                      ({service.reviews?.length ?? 0})
                    </span>
                  </dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Bookings</dt>
                  <dd className={detailValueClass}>{service.bookings ?? 0}</dd>
                </div>
                <div className={detailRowClass}>
                  <dt className={detailLabelClass}>Status</dt>
                  <dd>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${statusClass}`}
                    >
                      <span className={`size-1.5 rounded-full ${statusDot}`} />
                      {status}
                    </span>
                  </dd>
                </div>
              </dl>
            </PopoverContent>
          </Popover>

          {/* Edit */}
          <button
            type="button"
            aria-label={`Edit ${service.name}`}
            title="Edit service"
            onClick={() => setEditOpen(true)}
            className="rounded-lg p-2 text-[#6b7280] dark:text-[#b3a3ab] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] dark:hover:bg-white/10"
          >
            <Pencil className="size-4" />
          </button>

          {/* More actions */}
          <Popover open={menuOpen} onOpenChange={setMenuOpen}>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  aria-label={`More actions for ${service.name}`}
                  className="rounded-lg p-2 text-[#6b7280] dark:text-[#b3a3ab] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] dark:hover:bg-white/10"
                >
                  <EllipsisVertical className="size-4" />
                </button>
              }
            />
            <PopoverContent align="end" className="w-48 gap-1 p-1.5">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setViewOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-[#4b5563] transition-colors hover:bg-[#fdf1f5] dark:text-[#d6cbd1] dark:hover:bg-white/10"
              >
                <Eye className="size-4" />
                View details
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  setEditOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-[#4b5563] transition-colors hover:bg-[#fdf1f5] dark:text-[#d6cbd1] dark:hover:bg-white/10"
              >
                <Pencil className="size-4" />
                Edit service
              </button>
              <button
                type="button"
                onClick={copyServiceId}
                className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm font-medium text-[#4b5563] transition-colors hover:bg-[#fdf1f5] dark:text-[#d6cbd1] dark:hover:bg-white/10"
              >
                {copied ? (
                  <Check className="size-4 text-[#16a34a]" />
                ) : (
                  <Copy className="size-4" />
                )}
                {copied ? "Copied!" : "Copy service ID"}
              </button>
            </PopoverContent>
          </Popover>

          {/* Edit dialog */}
          <EditServiceDialog
            service={service}
            open={editOpen}
            onOpenChange={setEditOpen}
            onSaved={() => router.refresh()}
          />
        </div>
      </td>
    </tr>
  );
}
