import Hero from "@/components/home/Hero";
import WedPlanFeatures from "@/components/home/Key-features";
import NewServices from "@/components/home/trendingservice";
import WedPlanInfoSection from "@/components/home/WedPlanInfoSection";
import WhyChooseWedPlan from "@/components/home/WhyChooseWedPlan";

export default function Home() {
  return (
    <>
      <Hero />
      <NewServices />
      <WedPlanFeatures />
      <WedPlanInfoSection />
      <WhyChooseWedPlan />
    </>
  );
}
