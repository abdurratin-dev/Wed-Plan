'use client'
import { creatChakout } from "@/lib/actions/api/subscriptionService";
import { authClient } from "@/lib/auth-client";
import { ISubscriptionPlan } from "@/types/apidata";
import { ArrowRight, Check, CrownIcon, DiamondIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SubscriptionCard({plan} : {plan : ISubscriptionPlan}) {
    const {data : session, error} = authClient.useSession()
    const user = session?.user
    const router = useRouter()
    const hendleButton = async(price : number)=>{
        if(price === 0){
            return
        }
        let redirectUrl;
        try{

            const data = {
                serviceID : plan._id,
                email : user?.email,
                name : user?.name,
                userId : user?.id,
            }
            const chackout = await creatChakout(data)
            redirectUrl = chackout.data.redirectUrl
        } catch {
            console.log('fatch faild');
        } finally {
            router.push(redirectUrl)
        }
        
    }
  return (
    <div
      key={plan.name}
      className={`relative overflow-visible rounded-[28px] border transition duration-300 hover:-translate-y-2 hover:shadow-2xl ${
        plan.popular
          ? "border-[#920d3d] bg-white shadow-xl shadow-[#800d35]/15"
          : "border-[#f0d5d2] bg-white/80 shadow-lg shadow-[#800d35]/5"
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#f9dca9] px-7 py-2 text-sm font-bold text-[#651027] shadow-md">
          <span className="mr-2">★</span>
          Most Popular
        </div>
      )}

      {/* Card Header */}
      <div
        className={`relative overflow-hidden rounded-t-[26px] px-6 pb-8 pt-12 text-center ${
          plan.popular
            ? "bg-gradient-to-br from-[#700b2e] via-[#970d40] to-[#710b30] text-white"
            : "bg-gradient-to-br from-[#fff9f7] to-[#fff0ee] text-[#590d26]"
        }`}
      >
        <div
          className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            plan.popular
              ? "bg-white text-[#800d35]"
              : "bg-[#fbe0e1] text-[#800d35]"
          }`}
        >
          {plan.popular ? <CrownIcon /> : <DiamondIcon />}
        </div>

        <h2 className="font-serif text-3xl font-bold">{plan.name}</h2>

        <p
          className={`mt-2 text-sm ${
            plan.popular ? "text-white/85" : "text-[#725b62]"
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
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#920d3d] text-white">
                <Check size={17} strokeWidth={3} />
              </span>

              <span className="text-sm font-medium text-[#302329] sm:text-base">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Button */}
        <button
          className={`mt-12 flex w-full items-center justify-center gap-3 rounded-2xl px-5 py-4 text-sm font-bold transition duration-300 ${
            plan.popular
              ? "bg-gradient-to-r from-[#800d35] to-[#a20e43] text-white shadow-lg shadow-[#800d35]/20 hover:from-[#650a2a] hover:to-[#800d35]"
              : "border-2 border-[#920d3d] bg-white text-[#800d35] hover:bg-[#800d35] hover:text-white"
          }`}
          onClick={()=>hendleButton(plan.price)}
        >
          {plan.buttonText}
          <ArrowRight size={19} />
        </button>
      </div>
    </div>
  );
}
