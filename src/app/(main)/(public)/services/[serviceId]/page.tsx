import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceDetails from "@/components/services/ServiceDetails";
import { getServiceData } from "@/lib/actions/api/service";
import { ServiceData } from "@/types/apidata";

export const metadata: Metadata = {
  title: "Service Details | WedPlan",
  description:
    "View details, pricing and availability for a wedding service and book your slot.",
};

interface Props {
  params: Promise<{ serviceId: string }>;
}

export default async function ServiceDetailsPage({ params }: Props) {
  const { serviceId } = await params;

  let list: ServiceData[] = [];
  try {
    const services = await getServiceData();
    list = Array.isArray(services) ? services : [];
  } catch {
    // API unreachable — fall through to the not-found page below.
  }

  const service = list.find((item) => item._id === serviceId);
  if (!service) notFound();

  const related = list.filter((item) => item._id !== serviceId).slice(0, 4);

  return <ServiceDetails service={service} related={related} />;
}
