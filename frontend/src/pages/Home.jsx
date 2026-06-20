import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <div data-testid="home-page">
      <HeroSlider />
      <AboutSection />
      <ServicesSection />
      <PackagesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
