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
  Package,
  Store,
  User,
  Users,
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

  // Prefer the resolved session role, falling back to the URL so the correct
  // menu renders before the session loads (and no other role flashes first).
  const effectiveRole = role ?? pathnameRole;
  const isAdmin = effectiveRole === "admin";

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

  const adminNav: NavItem[] = [
    { label: "Overview", href: base, icon: LayoutDashboard },
    { label: "Users", href: `${base}/users`, icon: Users },
    { label: "Bookings", href: `${base}/bookings`, icon: Store },
    { label: "Services", href: `${base}/services`, icon: Package },
    { label: "Transactions", href: `${base}/transactions`, icon: CreditCard },
  ];
  const navItems: NavItem[] =
    effectiveRole === "vendor"
      ? vendorNav
      : effectiveRole === "customer"
        ? customerNav
        : adminNav;
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
    <Sidebar
      className={cn(
        "border-r",
        isAdmin
          ? "border-[#8e2249]/15 bg-[#fbe9ef]"
          : "border-white/10 bg-[#5c0f28]",
      )}
      style={
        isAdmin
          ? ({
              "--sidebar": "#fbe9ef",
              "--sidebar-foreground": "#8e2249",
              "--sidebar-accent": "#7d1436",
              "--sidebar-accent-foreground": "#ffffff",
              "--sidebar-border": "rgb(142 34 73 / 15%)",
              "--sidebar-ring": "rgb(142 34 73 / 35%)",
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Brand */}
      <SidebarHeader className="px-3 pt-5 pb-3">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-1.5 transition-opacity hover:opacity-90",
            isAdmin ? "text-[#7d1436]" : "text-white",
          )}
        >
          <Heart
            size={30}
            strokeWidth={2.5}
            className={
              isAdmin ? "fill-[#7d1436]/10 text-[#7d1436]" : "fill-white/10 text-white"
            }
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
                        isAdmin
                          ? [
                              "text-[#8e2249]",
                              "hover:bg-[#7d1436] hover:text-white",
                              "data-active:bg-[#7d1436] data-active:text-white",
                            ]
                          : [
                              "text-white/85",
                              "hover:bg-[#8e2249] hover:text-white",
                              "data-active:bg-[#8e2249] data-active:text-white",
                            ],
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                          active
                            ? "border-white/50 bg-white/10"
                            : isAdmin
                              ? "border-transparent"
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
