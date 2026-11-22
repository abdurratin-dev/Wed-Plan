import PaymentStatusCard from "@/components/payment/PaymentStatusCard";

export const metadata = {
  title: "Subscription Cancelled | WedPlan",
  description:
    "Your WedPlan vendor subscription checkout was cancelled.",
};

export default function SubscriptionCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fdfbfa] bg-[radial-gradient(circle_at_50%_0%,#fdeef3,transparent_65%)] px-4 py-16 dark:bg-[#160e13] dark:bg-[radial-gradient(circle_at_50%_0%,#2c1c25,transparent_65%)]">
      <PaymentStatusCard
        status="cancel"
        eyebrow="Checkout Not Completed"
        title="Subscription Cancelled"
        message="No worries — your payment was not processed and your card was not charged. Your current plan (if any) remains unchanged."
        note="Ready to grow your business? Pick a plan and complete checkout whenever you like."
        actions={[
          {
            href: "/dashboard/vendor/subscription",
            label: "Back to Plans",
            variant: "primary",
          },
          {
            href: "/dashboard/vendor",
            label: "Go to Dashboard",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
