import type { Metadata } from "next";
import BrowseServices from "@/components/services/BrowseServices";
import { getServiceData } from "@/lib/actions/api/service";

export const metadata: Metadata = {
    title: "Browse Services | WedPlan",
    description:
        "Discover and book the best wedding services from trusted vendors for your special day.",
};

export default async function Page({searchParams}) {
    const params = await searchParams
    const url = new URLSearchParams(params)
    const services = await getServiceData(url.toString())
    return <BrowseServices results={services}/>;
}
