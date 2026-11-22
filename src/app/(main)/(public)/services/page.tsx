import type { Metadata } from "next";
import BrowseServices from "@/components/services/BrowseServices";
import { getServiceData } from "@/lib/actions/api/service";

export const metadata: Metadata = {
  title: "Browse Services | WedPlan",
  description:
    "Discover and book the best wedding services from trusted vendors for your special day.",
};

interface ParamsType {
  search?: string;
  category?: string;
  location?: string;
}
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string,string>>;
}) {
  const params = await searchParams;
  const url = new URLSearchParams(params);
  const services = await getServiceData(url.toString());
  return <BrowseServices results={services} />;
}
