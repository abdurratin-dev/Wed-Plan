import AdminServicesView from "@/components/admin/AdminServicesView";
import { getServiceData } from "@/lib/actions/api/service";
import { auth } from "@/lib/auth";
import { ServiceData } from "@/types/apidata";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Services | WedPlan",
};

export default async function AdminServicesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  if (user?.role !== "admin" || !user) {
    return redirect("/unauthorized");
  }
  const services: ServiceData[] = await getServiceData();
  return (
    <AdminServicesView services={Array.isArray(services) ? services : []} />
  );
}
