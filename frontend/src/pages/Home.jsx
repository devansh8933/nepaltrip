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
        title="Best Tour and Travel Agency in Gorakhpur"
        description="Nepal Trip — Discover Nepal Holiday Tours, Honeymoon Packages, Kathmandu Pokhara Tour, Char Dham Yatra, Kailash Mansarovar, Muktinath & Kashmir tours from Gorakhpur."
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
