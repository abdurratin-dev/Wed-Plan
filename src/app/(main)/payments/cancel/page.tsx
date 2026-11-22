import PaymentStatusCard from "@/components/payment/PaymentStatusCard";

export const metadata = {
  title: "Payment Cancelled | WedPlan",
  description: "Your payment was not completed.",
};

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fdfbfa] bg-[radial-gradient(circle_at_50%_0%,#fdeef3,transparent_65%)] px-4 py-16 dark:bg-[#160e13] dark:bg-[radial-gradient(circle_at_50%_0%,#2c1c25,transparent_65%)]">
      <PaymentStatusCard
        status="cancel"
        eyebrow="Payment Not Completed"
        title="Payment Cancelled"
        message="Your payment was cancelled before it was processed, so no charge has been made. Nothing has changed in your account."
        note="You can try again whenever you're ready — it only takes a moment."
        actions={[
          {
            href: "/",
            label: "Back to Home",
            variant: "secondary",
          },
        ]}
      />
    </div>
  );
}
