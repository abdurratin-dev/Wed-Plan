
import Link from "next/link";
import {
  Search,
  CalendarCheck,
  UsersRound,
  Music2,
  ArrowRight,
  Heart,
  BadgeCheck,
  ShieldCheck,
  Headset,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FeatureType = {
  icon: LucideIcon;
  title: string;
  description: string;
};

type StepType = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const features: FeatureType[] = [
  {
    icon: BadgeCheck,
    title: "Trusted Vendors",
    description: "Verified & professional",
  },
  {
    icon: ShieldCheck,
    title: "Secure Booking",
    description: "Safe & reliable",
  },
  {
    icon: Headset,
    title: "Premium Support",
    description: "Always here for you",
  },
  {
    icon: Music2,
    title: "Best Experience",
    description: "Plan with confidence",
  },
];

const steps: StepType[] = [
  {
    icon: Search,
    title: "Search Services",
    description: "Find the best vendors",
  },
  {
    icon: CalendarCheck,
    title: "Book Request",
    description: "Send your request",
  },
  {
    icon: CheckCircle2,
    title: "Confirm Booking",
    description: "Get confirmation",
  },
];

export default function WhyChooseWedPlan() {
  return (
    <section className="overflow-hidden bg-[#fff8f6] transition-colors duration-300 dark:bg-[#160d11]">

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Why Choose WedPlan */}
        <div className="text-center">

          <h2 className="font-serif text-2xl font-bold text-[#590d26] animate-fade-up dark:text-[#ffe2e9]">
            Why Choose WedPlan?
          </h2>

          <div className="mx-auto mt-7 grid animate-stagger grid-cols-2 gap-5 md:grid-cols-4">

            {features.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group flex flex-col items-center border-[#efdedd] px-3 py-2 md:border-r md:last:border-r-0 dark:border-white/10"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#f8dadd] text-[#800d35] transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-[#800d35] group-hover:text-white dark:bg-[#800d35]/20 dark:text-[#f08ba8] dark:group-hover:bg-[#800d35] dark:group-hover:text-white">
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <h3 className="text-xs font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-sm">
                    {feature.title}
                  </h3>

                  <p className="mt-1 text-[10px] text-[#987b83] dark:text-[#aa929b] sm:text-xs">
                    {feature.description}
                  </p>
                </div>
              );
            })}

          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#dba2a9]/60 to-transparent dark:via-white/10" />

        {/* How WedPlan Works */}
        <div className="grid grid-cols-1 items-center gap-6">

          {/* Steps */}
          <div>

            <h3 className="mb-6 text-center font-serif text-xl font-bold text-[#590d26] animate-fade-up dark:text-[#ffe2e9]">
              How WedPlan Works
            </h3>

            <div className="grid animate-stagger grid-cols-1 gap-5 sm:grid-cols-3">

              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <div
                    key={step.title}
                    className="relative flex items-center justify-center gap-3 sm:justify-start"
                  >
                    {/* Icon */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8dadd] text-[#800d35] dark:bg-[#800d35]/20 dark:text-[#f08ba8]">
                      <Icon size={19} strokeWidth={1.8} />
                    </div>

                    {/* Text */}
                    <div>
                      <h4 className="text-xs font-bold text-[#590d26] dark:text-[#ffe2e9]">
                        {step.title}
                      </h4>

                      <p className="mt-1 text-[10px] text-[#987b83] dark:text-[#aa929b] sm:text-xs">
                        {step.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    {index !== steps.length - 1 && (
                      <ArrowRight
                        size={18}
                        className="hidden text-[#dba2a9] sm:absolute sm:-right-3 sm:block dark:text-white/20"
                      />
                    )}
                  </div>
                );
              })}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
