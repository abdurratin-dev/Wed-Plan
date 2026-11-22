import PaymentStatusCard from "@/components/payment/PaymentStatusCard";

export const metadata = {
  title: "Payment Successful | WedPlan",
  description: "Your payment was processed successfully.",
};

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#fdfbfa] bg-[radial-gradient(circle_at_50%_0%,#fdeef3,transparent_65%)] px-4 py-16 dark:bg-[#160e13] dark:bg-[radial-gradient(circle_at_50%_0%,#2c1c25,transparent_65%)]">
      <PaymentStatusCard
        status="success"
        eyebrow="Payment Confirmed"
        title="Payment Successful!"
        message="Thank you — your payment has been processed successfully. A confirmation has been sent to your email address."
        note="You can review your transactions anytime from your account."
        actions={[
          {
            href: "/customer/bookings",
            label: "Continue",
            variant: "primary",
          },
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
