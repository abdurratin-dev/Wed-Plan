"use client";
import { creatChakout } from "@/lib/actions/api/subscriptionService";
import { authClient } from "@/lib/auth-client";
import { ISubscriptionPlan } from "@/types/apidata";
import { ArrowRight, Check, CrownIcon, DiamondIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "../ui/toast";
import { Spinner } from "../ui/spinner";

export default function SubscriptionCard({
  plan,
}: {
  plan: ISubscriptionPlan;
}) {
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const hendleButton = async (price: number) => {
    if (price === 0) {
      if (user?.premium) {
        toast.add({
          description: "You already Premium vendor",
        });
        return;
      }
      toast.add({
        description: "Subscribe to free",
      });
      return;
    }
    setLoading(true);
    let redirectUrl;
    try {
      const data = {
        serviceID: plan._id,
        email: user?.email,
        name: user?.name,
        userId: user?.id,
      };
      const chackout = await creatChakout(data);
      redirectUrl = chackout.data.redirectUrl;
    } catch {
      // Checkout request failed — stay on the page instead of pushing an undefined URL.
    } finally {
      if (redirectUrl) {
        router.push(redirectUrl);
      }
    }
  };
  return (
    <div
      key={plan.name}
      className={`relative overflow-visible rounded-3xl border transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        plan.popular
          ? "border-[#920d3d] bg-white shadow-xl shadow-[#800d35]/15 dark:border-[#a52b50] dark:bg-[#1e131a] dark:shadow-none"
          : "border-[#f0d5d2] bg-white/80 shadow-lg shadow-[#800d35]/5 dark:border-white/10 dark:bg-[#1e131a] dark:shadow-none"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f9dca9] px-7 py-2 text-sm font-bold text-[#651027] shadow-md dark:bg-[#fbbf24] dark:text-[#451a03]">
          <span className="mr-2">★</span>
          Most Popular
        </div>
      )}

      {/* Card Header */}
      <div
        className={`relative overflow-hidden rounded-t-3xl px-6 pb-8 pt-12 text-center ${
          plan.popular
            ? "bg-gradient-to-br from-[#700b2e] via-[#970d40] to-[#710b30] text-white dark:from-[#700b2e] dark:via-[#970d40] dark:to-[#710b30]"
            : "bg-gradient-to-br from-[#fff9f7] to-[#fff0ee] text-[#590d26] dark:from-[#241720] dark:to-[#1e131a] dark:text-[#ffeaf1]"
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            plan.popular
              ? "bg-white text-[#800d35]"
              : "bg-[#fbe0e1] text-[#800d35] dark:bg-[#8e2249]/25 dark:text-[#ff9bb9]"
          }`}
        >
          {plan.popular ? <CrownIcon /> : <DiamondIcon />}
        </div>

        <h2 className="font-serif text-3xl font-bold">{plan.name}</h2>

        <p
          className={`mt-2 text-sm ${
            plan.popular
              ? "text-white/85"
              : "text-[#725b62] dark:text-[#c8b3bd]"
          }`}
        >
          {plan.description}
        </p>

        <div className="mt-6 flex items-baseline justify-center gap-2">
          <span className="font-serif text-6xl font-bold">${plan.price}</span>
          <span className="text-sm opacity-80">{plan.period}</span>
        </div>
      </div>

      {/* Features */}
      <div className="px-7 pb-8 pt-8 sm:px-10">
        <div className="space-y-5">
          {plan.features.map((feature) => (
            <div key={feature} className="flex items-center gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#920d3d] text-white dark:bg-[#a52b50]">
                <Check size={17} strokeWidth={3} />
              </span>

              <span className="text-sm font-medium text-[#302329] sm:text-base dark:text-[#e8dfe3]">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        {loading ? (
          <button
            className={`mt-12 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition duration-300 focus-visible:ring-2 focus-visible:ring-[#920d3d] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#ff9bb9] dark:focus-visible:ring-offset-[#1e131a] ${
              plan.popular
                ? "bg-gradient-to-r from-[#800d35] to-[#a20e43] text-white shadow-lg shadow-[#800d35]/20 hover:from-[#650a2a] hover:to-[#800d35]"
                : "border-2 border-[#920d3d] bg-white text-[#800d35] hover:bg-[#800d35] hover:text-white dark:border-[#a52b50] dark:bg-transparent dark:text-[#ff9bb9] dark:hover:bg-[#a52b50] dark:hover:text-white"
            }`}
            disabled={user?.premium && plan.popular}
            onClick={() => hendleButton(plan.price)}
          >
            <Spinner className="size-6" />
            {user?.premium && plan.popular
              ? "You selected this plan"
              : plan.buttonText}
            <ArrowRight size={19} />
          </button>
        ) : (
          <button
            className={`mt-12 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition duration-300 focus-visible:ring-2 focus-visible:ring-[#920d3d] focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-[#ff9bb9] dark:focus-visible:ring-offset-[#1e131a] ${
              plan.popular
                ? "bg-gradient-to-r from-[#800d35] to-[#a20e43] text-white shadow-lg shadow-[#800d35]/20 hover:from-[#650a2a] hover:to-[#800d35]"
                : "border-2 border-[#920d3d] bg-white text-[#800d35] hover:bg-[#800d35] hover:text-white dark:border-[#a52b50] dark:bg-transparent dark:text-[#ff9bb9] dark:hover:bg-[#a52b50] dark:hover:text-white"
            }`}
            disabled={user?.premium && plan.popular}
            onClick={() => hendleButton(plan.price)}
          >
            {user?.premium && plan.popular
              ? "You selected this plan"
              : plan.buttonText}
            <ArrowRight size={19} />
          </button>
        )}
      </div>
    </div>
  );
}
