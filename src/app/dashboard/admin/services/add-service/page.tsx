import AddServiceForm from "@/components/vendor/AddServiceForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Service | WedPlan",
};

export default async function AddServicePage() {
  return <AddServiceForm />;
}
