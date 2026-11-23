import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/ui/sideber/dashboardSideber";
import DashboardNavbar from "@/components/layout/dashboardNavbar";

export const metadata = {
    title : "Dashboard | WedPlan"
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      {/* The navbar lives inside <main>, which sits directly beside the
          sidebar's width-reserving gap — so it stays flush against the
          sidebar and re-flows whenever the sidebar is toggled. */}
      <main className="min-w-0 flex-1">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
