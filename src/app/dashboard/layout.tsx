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
      <main className="min-w-0 flex-1">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
