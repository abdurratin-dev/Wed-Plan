"use client";

import { Ban, EllipsisVertical, Eye, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { IUsers } from "@/types/apidata";

interface ManegUserDropdwounProps {
  /** Open the user detail view. */
  onView?: () => void;
  /** Block (or unban, when `status` is "Blocked") the user. */
  onBlock?: () => void;
  /** Remove the user. Hidden from the menu when not provided. */
  onRemove?: () => void;
  /** Drives the Block / Unban label — defaults to "Active". */
  status?: string;
  /** Controlled open state (so the parent can close the menu before opening a view). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** User name for the trigger's accessible label. */
  userName?: string;
  u: IUsers;
}

const detailRowClass =
  "flex items-center justify-between gap-3 text-[#6b7280] dark:text-[#b3a3ab] dark:text-[#c8b3bd]";
const detailLabelClass = "font-medium text-[#9ca3af] dark:text-[#9b8792]";
const detailValueClass =
  "truncate font-semibold text-[#1f2937] dark:text-[#ffeaf1]";
const itemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";

const baseItem =
  "text-[#2b0713] hover:bg-[#f3f1f2] active:bg-[#eae2e5] dark:text-[#ffeaf1] dark:hover:bg-white/10 dark:active:bg-white/15";

export default function ManegUserDropdwoun({
  onBlock,
  onRemove,
  status = "Active",
  open,
  onOpenChange,
  userName,
  u,
}: ManegUserDropdwounProps) {
  const isBlocked = status !== "Active";
  const [viewOpen, setViewOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            aria-label={userName ? `Manage ${userName}` : "Manage user"}
            className="rounded-lg p-2.5 text-[#6b7280] dark:text-[#b3a3ab] transition-colors hover:bg-[#f3f1f2] hover:text-[#8e2249] focus-visible:ring-2 focus-visible:ring-[#720e32]/30 focus-visible:outline-none dark:text-[#c8b3bd] dark:hover:bg-white/10 dark:hover:text-[#ff9bb9] dark:focus-visible:ring-[#ff9bb9]/30"
            variant="ghost"
          >
            <EllipsisVertical className="size-4" />
          </Button>
        }
      />
      <PopoverContent align="end" className="w-56 gap-1 p-1.5">
        <Popover open={viewOpen} onOpenChange={setViewOpen}>
          <PopoverTrigger
            render={
              <button
                type="button"
                onClick={() => setViewOpen(true)}
                className={`${itemClass} ${baseItem} focus-visible:ring-[#720e32]/30 dark:focus-visible:ring-[#ff9bb9]/30`}
              >
                <Eye className="size-4 text-[#8e2249] dark:text-[#ff9bb9]" />
                View details
              </button>
            }
          />
          <PopoverContent align="end" className="w-64 gap-3 p-3.5">
            <div className="border-b border-[#f1ecef] pb-2 dark:border-white/10">
              <p className="truncate text-sm font-bold text-[#1f2937] dark:text-[#ffeaf1]">
                {u.name}
              </p>
              <p className="mt-0.5 text-xs text-[#9ca3af] dark:text-[#9b8792]">
                {u.email}
              </p>
            </div>
            <dl className="flex flex-col gap-1.5 text-xs">
              <div className={detailRowClass}>
                <dt className={detailLabelClass}>Role</dt>
                <dd className={detailValueClass}>{u.role}</dd>
              </div>
              <div className={detailRowClass}>
                <dt className={detailLabelClass}>Premium user</dt>
                <dd className={detailValueClass}>
                  {u.premium ? "Premium" : "Non Premium"}
                </dd>
              </div>
              <div className={detailRowClass}>
                <dt className={detailLabelClass}>Status</dt>
                <dd>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.68rem] font-semibold ${
                      u.status === "Active"
                        ? "bg-[#16a34a]/15 text-[#15803d] dark:bg-[#16a34a]/20 dark:text-[#4ade80]"
                        : "bg-[#dc2626]/15 text-[#dc2626] dark:bg-[#dc2626]/20 dark:text-[#f87171]"
                    }`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${
                        u.status === "Active"
                          ? "bg-[#16a34a] dark:bg-[#4ade80]"
                          : "bg-[#dc2626] dark:bg-[#f87171]"
                      }`}
                    />
                    {u.status}
                  </span>
                </dd>
              </div>
            </dl>
          </PopoverContent>
        </Popover>

        <div
          role="separator"
          className="my-1 border-t border-[#f1ecef] dark:border-white/10"
        />

        <button
          type="button"
          onClick={onBlock}
          className={`${itemClass} ${
            isBlocked
              ? baseItem
              : "text-[#b45309] hover:bg-[#fef3e2] active:bg-[#fde9c8] dark:text-[#fdba74] dark:hover:bg-[#c2410c]/15 dark:active:bg-[#c2410c]/25"
          } focus-visible:ring-[#720e32]/30 dark:focus-visible:ring-[#ff9bb9]/30`}
        >
          {isBlocked ? (
            <>
              <ShieldCheck className="size-4 text-[#16a34a] dark:text-[#4ade80]" />
              Unban user
            </>
          ) : (
            <>
              <Ban className="size-4 text-[#dc2626] dark:text-[#f87171]" />
              Block user
            </>
          )}
        </button>

        {onRemove && (
          <>
            <div
              role="separator"
              className="my-1 border-t border-[#f1ecef] dark:border-white/10"
            />
            <button
              type="button"
              onClick={onRemove}
              className={`${itemClass} text-[#dc2626] hover:bg-[#fdecec] active:bg-[#fadcdc] dark:text-[#f87171] dark:hover:bg-[#dc2626]/10 dark:active:bg-[#dc2626]/20 focus-visible:ring-[#dc2626]/30 dark:focus-visible:ring-[#f87171]/30`}
            >
              <Trash2 className="size-4" />
              Remove
            </button>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}
