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
  const services = await getServiceData();
  if(services.status){
    return redirect('/unauthorized')
  }
  const service :ServiceData[] = Array.isArray(services) ? services : []
  return (
    <AdminServicesView services={service} />
  );
}
