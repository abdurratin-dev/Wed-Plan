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
import { GiLoveMystery } from "react-icons/gi";

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
      data-sidebar-theme={isAdmin ? "blush" : "wine"}
      className={cn("border-r border-sidebar-border")}
    >
      {/* Brand */}
      <SidebarHeader className="px-3 pt-5 pb-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sidebar-foreground transition-opacity hover:opacity-90"
        >
          <GiLoveMystery size={45} strokeWidth={2.5} />
          <div className="flex flex-col justify-center">
          <span className="text-xl font-extrabold tracking-tight">WedPlan</span>
          <span className="text-sm">Dashboard</span>
          </div>
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
                        "text-sidebar-foreground/85",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg border border-sidebar-border transition-colors",
                          active && "bg-white/10",
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
