
import {
  Camera,
  Palette,
  Utensils,
  Sparkles,
  Building2,
  CalendarDays,
  Search,
  Heart,
  ShieldCheck,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Wedding Photography",
    description: "Find professional photographers for your special day",
  },
  {
    icon: Palette,
    title: "Beautiful Decoration",
    description: "Discover stunning wedding decoration services",
  },
  {
    icon: Utensils,
    title: "Catering Services",
    description: "Explore delicious menus for your celebration",
  },
  {
    icon: Sparkles,
    title: "Bridal Makeup",
    description: "Connect with expert bridal makeup artists",
  },
  {
    icon: Building2,
    title: "Wedding Venues",
    description: "Find the perfect venue for your dream wedding",
  },
  {
    icon: CalendarDays,
    title: "Easy Booking",
    description: "Book your favorite wedding vendors effortlessly",
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find the right services in just a few clicks",
  },
  {
    icon: Heart,
    title: "Favorite Vendors",
    description: "Save and manage your favorite wedding services",
  },
  {
    icon: MessageCircle,
    title: "Direct Communication",
    description: "Connect with vendors and discuss your needs",
  },
  {
    icon: ShieldCheck,
    title: "Secure Platform",
    description: "Enjoy a safe and reliable booking experience",
  },
];

export default function WedPlanFeatures() {
  return (
    <section className="relative overflow-hidden bg-[#fff8f6] px-4 py-20 transition-colors duration-300 dark:bg-[#160d11] sm:px-6 lg:px-8">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#f8dadd]/40 blur-3xl dark:bg-[#800d35]/10" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-[#f8dadd]/40 blur-3xl dark:bg-[#800d35]/10" />

      <div className="relative mx-auto max-w-7xl">

        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#dba2a9]" />

            <Heart
              size={18}
              className="text-[#800d35] dark:text-[#f08ba8]"
            />

            <span className="h-px w-10 bg-[#dba2a9]" />
          </div>

          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#800d35] dark:text-[#f08ba8]">
            Why Choose WedPlan
          </p>

          <h2 className="font-serif text-3xl font-bold text-[#590d26] dark:text-[#ffe2e9] sm:text-4xl md:text-5xl">
            Everything You Need for Your Dream Wedding
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#725b62] dark:text-[#c5aeb6] sm:text-base">
            Discover a smarter way to plan your wedding.
            From finding trusted vendors to booking your
            favorite services, everything is in one place.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-14">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group flex flex-col items-center text-center"
              >
                {/* Icon Circle */}
                <div className="relative mb-5 flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-[#dfbfc2] transition-all duration-300 group-hover:border-[#800d35] group-hover:bg-[#fcebed] dark:border-white/15 dark:group-hover:border-[#f08ba8] dark:group-hover:bg-[#800d35]/10">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#800d35] text-white shadow-lg shadow-[#800d35]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl dark:bg-[#a3234e]">
                    <Icon
                      size={27}
                      strokeWidth={1.8}
                    />
                  </div>
                </div>

                {/* Feature Content */}
                <h3 className="text-sm font-bold text-[#590d26] transition-colors duration-300 group-hover:text-[#920d3d] dark:text-[#ffe2e9] dark:group-hover:text-[#f08ba8] sm:text-base">
                  {feature.title}
                </h3>

                <p className="mt-2 max-w-[210px] text-xs leading-5 text-[#987b83] dark:text-[#aa929b] sm:text-sm sm:leading-6">
                  {feature.description}
                </p>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
