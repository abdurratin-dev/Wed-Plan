
import Link from "next/link";
import {
  CalendarCheck,
  Trophy,
  Quote,
  Camera,
  Palette,
  Utensils,
  Sparkles,
  Building2,
  ArrowRight,
  Star,
  LucideIcon,
} from "lucide-react";

// Types
type InfoCardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  delay?: number;
};

type CategoryType = {
  icon: LucideIcon;
  name: string;
  href: string;
};

type BookingStep = {
  id: number;
  title: string;
};

type ReviewType = {
  name: string;
  review: string;
  rating: number;
  initial: string;
};

// Dummy Data
const bookingSteps: BookingStep[] = [
  { id: 1, title: "Explore wedding services" },
  { id: 2, title: "Choose your favorite vendor" },
  { id: 3, title: "Send a booking request" },
  { id: 4, title: "Confirm your booking" },
];

const categories: CategoryType[] = [
  { icon: Camera, name: "Photography", href: "/services" },
  { icon: Palette, name: "Decoration", href: "/services" },
  { icon: Utensils, name: "Catering", href: "/services" },
  { icon: Sparkles, name: "Makeup", href: "/services" },
  { icon: Building2, name: "Venues", href: "/services" },
];

const review: ReviewType = {
  name: "Sarah Ahmed",
  review:
    "WedPlan made our wedding planning so much easier! Finding trusted vendors and booking services was a wonderful experience.",
  rating: 5,
  initial: "S",
};

// Reusable Card Component
const InfoCard = ({ icon: Icon, title, children, delay }: InfoCardProps) => {
  return (
    <div
      className="group flex h-full flex-col animate-fade-up rounded-[26px] border border-[#efdedd] bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#dba2a9] hover:shadow-xl hover:shadow-[#800d35]/5 dark:border-white/10 dark:bg-[#21141a] dark:hover:border-[#a3234e] sm:p-7"
      style={delay !== undefined ? { animationDelay: `${delay}ms` } : undefined}
    >
      <Icon
        size={27}
        strokeWidth={1.8}
        className="mb-5 text-[#800d35] transition-transform duration-300 group-hover:scale-110 dark:text-[#f08ba8]"
      />

      <h3 className="mb-4 text-lg font-bold text-[#590d26] dark:text-[#ffe2e9]">
        {title}
      </h3>

      {children}
    </div>
  );
};

// Main Component
export default function WedPlanInfoSection() {
  return (
    <section className="relative overflow-hidden bg-[#fff8f6] px-4 py-16 transition-colors duration-300 dark:bg-[#160d11] sm:px-6 lg:px-8">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[#f8dadd]/30 blur-3xl dark:bg-[#800d35]/10" />

      <div className="pointer-events-none absolute -right-24 bottom-0 h-64 w-64 rounded-full bg-[#f8dadd]/30 blur-3xl dark:bg-[#800d35]/10" />

      <div className="relative mx-auto grid max-w-7xl animate-stagger grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Card 1: Booking Process */}
        <InfoCard
          icon={CalendarCheck}
          title="How Booking Works"
          delay={0}
        >
          <div className="flex-1 space-y-3 text-sm text-[#725b62] dark:text-[#c5aeb6]">
            {bookingSteps.map((step) => (
              <p key={step.id}>
                <span className="font-bold text-[#800d35] dark:text-[#f08ba8]">
                  {step.id}.
                </span>{" "}
                {step.title}
              </p>
            ))}
          </div>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#800d35] transition-all hover:gap-3 dark:text-[#f08ba8]"
          >
            Learn More
            <ArrowRight size={16} />
          </Link>
        </InfoCard>

        {/* Card 2: Categories */}
        <InfoCard
          icon={Trophy}
          title="Top Categories"
          delay={70}
        >
          <div className="grid flex-1 grid-cols-3 gap-x-3 gap-y-5 pt-1 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  href={category.href}
                  key={category.name}
                  className="group/category flex flex-col items-center gap-2 text-center"
                >
                  <Icon
                    size={23}
                    strokeWidth={1.8}
                    className="text-[#800d35] transition-transform duration-300 group-hover/category:-translate-y-1 dark:text-[#f08ba8]"
                  />

                  <span className="text-[10px] font-medium text-[#725b62] dark:text-[#c5aeb6]">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>

          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#800d35] transition-all hover:gap-3 dark:text-[#f08ba8]"
          >
            Browse Services
            <ArrowRight size={16} />
          </Link>
        </InfoCard>

        {/* Card 3: Customer Reviews */}
        <InfoCard
          icon={Quote}
          title="Customer Reviews"
          delay={140}
        >
          <div className="flex-1">
            <p className="text-sm leading-7 text-[#725b62] dark:text-[#c5aeb6]">
              "{review.review}"
            </p>

            <div className="mt-6 flex items-center gap-3">

              {/* Avatar */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f8dadd] font-serif text-lg font-bold text-[#800d35] dark:bg-[#800d35]/30 dark:text-[#f08ba8]">
                {review.initial}
              </div>

              <div>
                <h4 className="text-sm font-bold text-[#590d26] dark:text-[#ffe2e9]">
                  {review.name}
                </h4>

                <div className="mt-1 flex items-center gap-1">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star
                      key={index}
                      size={13}
                      className="fill-[#e9a323] text-[#e9a323]"
                    />
                  ))}

                  <span className="ml-1 text-xs text-[#987b83] dark:text-[#aa929b]">
                    {review.rating}.0
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-[#800d35] transition-all hover:gap-3 dark:text-[#f08ba8]"
          >
            Read Reviews
            <ArrowRight size={16} />
          </Link>
        </InfoCard>

      </div>
    </section>
  );
}
