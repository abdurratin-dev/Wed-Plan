"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  CirclePlus,
  CreditCard,
  Heart,
  LayoutDashboard,
  LayoutList,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const role = (session?.user as { role?: string } | undefined)?.role;

  // Dashboard routes are scoped per role: /dashboard/vendor/..., and fall
  // back to /dashboard until the session (and its role) has loaded. Without a
  // session the role is inferred from the URL, so a direct link to
  // /dashboard/vendor/services/new still lights the matching item.
  const pathnameRole = (["vendor", "customer", "admin"] as const).find((r) =>
    pathname.startsWith(`/dashboard/${r}`),
  );
  const base = role
    ? `/dashboard/${role}`
    : pathnameRole
      ? `/dashboard/${pathnameRole}`
      : "/dashboard";

  const customerNav: NavItem[] = [
    { label: "Overview", href: base, icon: LayoutDashboard },
    {
      label: "My Bookings",
      href: `${base}/bookings`,
      icon: CalendarDays,
    },
    {
      label: "Profile And Settings",
      href: `/profile`,
      icon: User,
    },
  ];
  const vendorNav: NavItem[] = [
    {
      label: "Overview",
      href: base,
      icon: LayoutDashboard,
    },
    { label: "My Services", href: `${base}/services`, icon: LayoutList },
    { label: "Add Service", href: `${base}/services/new`, icon: CirclePlus },
    {
      label: "Booking Requests",
      href: `${base}/bookings`,
      icon: CalendarDays,
    },
    { label: "Subscription", href: `${base}/subscription`, icon: CreditCard },
  ];

  const adminNav: NavItem[] = []
  const navItems: NavItem[] = role === 'vendor' ? vendorNav : role === 'customer' ? customerNav : adminNav;
  // The most specific match wins (.../services/new -> Add Service). When no
  // section claims the route, Overview stays lit for the dashboard landing.
  const matchedHref = navItems
    .map((item) => item.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

  const isActive = (item: NavItem) =>
    item.href === matchedHref ||
    (!matchedHref &&
      item.label === "Overview" &&
      pathname.startsWith("/dashboard"));

  return (
    <Sidebar className="border-r border-white/10 bg-[#5c0f28]">
      {/* Brand */}
      <SidebarHeader className="px-3 pt-5 pb-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-white transition-opacity hover:opacity-90"
        >
          <Heart
            size={30}
            strokeWidth={2.5}
            className="fill-white/10 text-white"
          />
          <span className="text-xl font-extrabold tracking-tight">WedPlan</span>
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-2 py-1">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-1.5">
              {navItems.map((item) => {
                const active = isActive(item);
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.label}>
                    <SidebarMenuButton
                      render={<Link href={item.href} />}
                      isActive={active}
                      className={cn(
                        "h-11 gap-3 rounded-xl px-2.5 py-2 text-[0.95rem] font-medium",
                        "text-white/85",
                        "hover:bg-[#8e2249] hover:text-white",
                        "data-active:bg-[#8e2249] data-active:text-white",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          active
                            ? "border-white/50 bg-white/10"
                            : "border-white/25",
                        )}
                      >
                        <Icon className="size-4" />
                      </span>
                      <span className="truncate">{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
}
