"use client";

import { Ban, EllipsisVertical, Eye, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
}

const itemClass =
  "flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none";

const baseItem = "text-[#2b0713] hover:bg-[#f3f1f2] active:bg-[#eae2e5] dark:text-[#ffeaf1] dark:hover:bg-white/10 dark:active:bg-white/15";

export default function ManegUserDropdwoun({
  onView,
  onBlock,
  onRemove,
  status = "Active",
  open,
  onOpenChange,
  userName,
}: ManegUserDropdwounProps = {}) {
  const isBlocked = status !== "Active";

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
        <button
          type="button"
          onClick={onView}
          className={`${itemClass} ${baseItem} focus-visible:ring-[#720e32]/30 dark:focus-visible:ring-[#ff9bb9]/30`}
        >
          <Eye className="size-4 text-[#8e2249] dark:text-[#ff9bb9]" />
          View details
        </button>

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
