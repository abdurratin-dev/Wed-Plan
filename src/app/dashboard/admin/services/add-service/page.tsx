import AddServiceForm from "@/components/vendor/AddServiceForm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Add Service | WedPlan",
};

export default async function AddServicePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const user = session?.user;
  if (user?.role !== "admin" || !user) {
    return redirect("/unauthorized");
  }
  return <AddServiceForm />;
}
