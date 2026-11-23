"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Bell,
  Heart,
  Moon,
  Plus,
  ShieldCheck,
  Store,
  Sun,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { SidebarTrigger } from "@/components/ui/sidebar";
import ProfileDropDwoun from "@/components/pofile/profileDropDwoun";
import { cn } from "@/lib/utils";

type RoleKey = "admin" | "vendor" | "customer";
type IconType = React.ComponentType<{ className?: string }>;

type RoleConfig = {
  /** Chip label shown next to the sidebar toggle. */
  label: string;
  /** One-line description of what this role does in the dashboard. */
  tagline: string;
  /** Chip colors — each role gets its own accent. */
  chipClassName: string;
  Icon: IconType;
  /** Role-specific primary action. */
  cta: { label: string; href: string; Icon: IconType };
  /** Role-specific quick links (desktop only). */
  links: { label: string; href: string }[];
};

const roleConfig: Record<RoleKey, RoleConfig> = {
  admin: {
    label: "Admin",
    tagline: "Platform administration",
    chipClassName:
      "bg-[#fce7f3] text-[#be185d] ring-[#f9c9dd] dark:bg-[#fce7f3]/10 dark:text-[#ff9bb9] dark:ring-[#ff9bb9]/25",
    Icon: ShieldCheck,
    cta: { label: "Manage Users", href: "/dashboard/admin/users", Icon: Users },
    links: [
      { label: "Overview", href: "/dashboard/admin" },
      { label: "Users", href: "/dashboard/admin/users" },
      { label: "Bookings", href: "/dashboard/admin/bookings" },
      { label: "Services", href: "/dashboard/admin/services" },
      { label: "Transactions", href: "/dashboard/admin/transactions" },
    ],
  },
  vendor: {
    label: "Vendor",
    tagline: "Grow your wedding business",
    chipClassName:
      "bg-[#dbeafe] text-[#1d4ed8] ring-[#c7defb] dark:bg-[#dbeafe]/10 dark:text-[#93c5fd] dark:ring-[#93c5fd]/25",
    Icon: Store,
    cta: {
      label: "Add Service",
      href: "/dashboard/vendor/services/new",
      Icon: Plus,
    },
    links: [
      { label: "Overview", href: "/dashboard/vendor" },
      { label: "My Services", href: "/dashboard/vendor/services" },
      { label: "Booking Requests", href: "/dashboard/vendor/bookings" },
      { label: "Subscription", href: "/dashboard/vendor/subscription" },
    ],
  },
  customer: {
    label: "Customer",
    tagline: "Plan your perfect wedding",
    chipClassName:
      "bg-[#f3f4f6] text-[#4b5563] ring-[#e4e2e5] dark:bg-white/10 dark:text-[#d6cbd1] dark:ring-white/15",
    Icon: Heart,
    cta: { label: "Browse Services", href: "/services", Icon: Store },
    links: [
      { label: "Overview", href: "/dashboard/customer" },
      { label: "My Bookings", href: "/dashboard/customer/bookings" },
      { label: "Browse Services", href: "/services" },
    ],
  },
};

/**
 * Role-aware top bar for the dashboard.
 *
 * It lives inside `<main>` (next to the sidebar's width-reserving gap), so it
 * starts flush against the sidebar and re-flows automatically whenever the
 * sidebar is expanded or collapsed. On mobile it opens the sidebar sheet via
 * the shared `SidebarTrigger`.
 */
export default function DashboardNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session } = authClient.useSession();

  // Same role resolution as the sidebar: prefer the session role, fall back to
  // the URL so the correct bar renders before the session loads.
  const role = (session?.user as { role?: string } | undefined)?.role;
  const pathnameRole = (["vendor", "customer", "admin"] as const).find((r) =>
    pathname.startsWith(`/dashboard/${r}`),
  );
  const resolved = role ?? pathnameRole;
  const config: RoleConfig =
    resolved && resolved in roleConfig
      ? roleConfig[resolved as RoleKey]
      : roleConfig.admin;

  // Most specific link wins (.../admin/users -> Users, not Overview).
  const matchedHref = config.links
    .map((link) => link.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#eadbd8] bg-[#fffaf7]/95 backdrop-blur-xl dark:border-white/10 dark:bg-[#160e13]/95">
      <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 sm:px-5 lg:px-6">
        {/* Sidebar toggle — shared state with the sidebar/sheet */}
        <SidebarTrigger
          className="size-9 shrink-0 rounded-lg text-[#5b4b52] transition-colors hover:bg-[#f4e9ee] hover:text-[#720e32] dark:text-[#d6cbd1] dark:hover:bg-white/10 dark:hover:text-[#ff9bb9]"
          aria-label="Toggle sidebar"
        />

        {/* Role chip + tagline */}
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1",
              config.chipClassName,
            )}
          >
            <config.Icon className="size-3.5" />
            {config.label}
          </span>
          <span className="hidden max-w-[13rem] truncate text-sm font-medium text-[#6b5a61] md:block xl:max-w-none dark:text-[#c8b3bd]">
            {config.tagline}
          </span>
        </div>

        {/* Right cluster */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {/* Role-specific quick links (desktop) */}
          <nav
            aria-label="Dashboard"
            className="mr-1 hidden items-center gap-1 xl:flex"
          >
            {config.links.map((link) => {
              const active = link.href === matchedHref;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-[#fce7f3] text-[#720e32] dark:bg-[#ff9bb9]/10 dark:text-[#ff9bb9]"
                      : "text-[#5b4b52] hover:bg-[#f7ecef] hover:text-[#720e32] dark:text-[#c8b3bd] dark:hover:bg-white/10 dark:hover:text-[#ff9bb9]",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Role-specific primary action */}
          <Link
            href={config.cta.href}
            className="hidden h-9 items-center gap-1.5 rounded-lg bg-[#720e32] px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#570a26] md:inline-flex dark:bg-[#a52b50] dark:hover:bg-[#c13b64]"
          >
            <config.cta.Icon className="size-4" />
            {config.cta.label}
          </Link>

          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm transition hover:border-[#720e32] hover:text-[#720e32] dark:border-white/10 dark:bg-[#281b24] dark:text-white dark:hover:border-[#ff9bb9] dark:hover:text-[#ff9bb9]"
          >
            {/* Both icons render always; CSS swaps them on the `dark` class
                so server and client markup stay identical (no hydration
                mismatch) without a mounted flag. */}
            <Sun className="size-5 hidden dark:block" />
            <Moon className="size-5 block dark:hidden" />
          </button>

          <ProfileDropDwoun />
        </div>
      </div>
    </header>
  );
}
