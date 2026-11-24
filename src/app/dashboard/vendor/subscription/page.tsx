
import SubscriptionCard from "@/components/subscription/subscriptionCard";
import { getSubscriptionService } from "@/lib/actions/api/subscriptionService";
import { auth } from "@/lib/auth";
import { ISubscriptionPlan } from "@/types/apidata";
import { Heart } from "lucide-react";
import { headers } from "next/headers";

const Subscription = async() => {
  const session = await auth.api.getSession({
    headers : await headers(),
  })
  const user = session?.user
    const plans : ISubscriptionPlan[] = await getSubscriptionService()
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fff8f6] px-4 py-16">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-[#f8dadd]/50 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-[#f8dadd]/50 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {user?.premium && <p className="text-black">You are a Premium Vendor</p>}

        {/* Header */}
        <div className="mb-14 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-[#dba2a9]" />
            <Heart className="h-7 w-7 text-[#800d35]" />
            <span className="h-px w-16 bg-[#dba2a9]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#800d35]">
            WedPlan Membership
          </p>

          <h1 className="font-serif text-4xl font-bold text-[#590d26] sm:text-5xl md:text-6xl">
            Choose Your Plan
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#725b62] sm:text-base">
            Upgrade your account and unlock more features to grow
            your business on WedPlan.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-8 md:grid-cols-2">

          {plans.map((plan) => {
            return (
             <SubscriptionCard key={plan._id} plan={plan}/>
            );
          })}

        </div>

        {/* Bottom Note */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f0d5d2] bg-white/70 px-5 py-3 text-xs text-[#725b62] shadow-sm sm:text-sm">
            <Heart size={16} className="text-[#920d3d]" />
            Make your wedding business more successful with WedPlan.
          </div>
        </div>

      </div>
    </main>
  );
};

export default Subscription;
