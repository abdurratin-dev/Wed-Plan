import type { Metadata } from "next";
import BrowseServices from "@/components/services/BrowseServices";

export const metadata: Metadata = {
    title: "Browse Services | WedPlan",
    description:
        "Discover and book the best wedding services from trusted vendors for your special day.",
};

export default function Page() {
    return <BrowseServices />;
}
