import AdminServicesView from "@/components/admin/AdminServicesView";
import { getServiceData } from "@/lib/actions/api/service";
import { ServiceData } from "@/types/apidata";

export const metadata = {
    title: "Services | WedPlan",
};

export default async function AdminServicesPage() {
    const services: ServiceData[] = await getServiceData();
    return (
        <AdminServicesView
            services={Array.isArray(services) ? services : []}
        />
    );
}
