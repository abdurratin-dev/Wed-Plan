import PaymentStatusCard from "@/components/payment/PaymentStatusCard";

export const metadata = {
  title: "Subscription Activated | WedPlan",
  description:
    "Your WedPlan vendor subscription was activated successfully.",
};

export default function SubscriptionSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fdfbfa] bg-[radial-gradient(circle_at_50%_0%,#fdeef3,transparent_65%)] px-4 py-16 dark:bg-[#160e13] dark:bg-[radial-gradient(circle_at_50%_0%,#2c1c25,transparent_65%)]">
      <PaymentStatusCard
        status="success"
        eyebrow="Subscription Activated"
        title="You're All Set!"
        message="Your payment was successful and your subscription is now active. Your premium features have been unlocked right away."
        note="Your plan renews automatically — you can cancel anytime from your dashboard."
        actions={[
          {
            href: "/dashboard/vendor",
            label: "Go to Dashboard",
            variant: "primary",
          },
          {
            href: "/dashboard/vendor/subscription",
            label: "View Plans",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
