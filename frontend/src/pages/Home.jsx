import HeroSlider from "@/components/HeroSlider";
import AboutSection from "@/components/sections/AboutSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PackagesSection from "@/components/sections/PackagesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ContactSection from "@/components/sections/ContactSection";
import SEO from "@/components/SEO";

export default function Home() {
  return (
    <div data-testid="home-page">
      <SEO
  title="Nepal Tour Packages from Gorakhpur | Kathmandu, Pokhara & Muktinath"
  description="Book affordable Nepal tour packages from Gorakhpur with Kathmandu, Pokhara, Muktinath, Lumbini, Kailash Mansarovar and honeymoon tours. Trusted travel agency with customized holiday packages."
  path="/"
/>
      <HeroSlider />
      <AboutSection />
      <ServicesSection />
      <PackagesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
}
