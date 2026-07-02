import { lazy, Suspense } from "react";

import HeroSlider from "@/components/HeroSlider";
import SEO from "@/components/SEO";

const AboutSection = lazy(() =>
  import("@/components/sections/AboutSection")
);

const ServicesSection = lazy(() =>
  import("@/components/sections/ServicesSection")
);

const PackagesSection = lazy(() =>
  import("@/components/sections/PackagesSection")
);

const TestimonialsSection = lazy(() =>
  import("@/components/sections/TestimonialsSection")
);

const ContactSection = lazy(() =>
  import("@/components/sections/ContactSection")
);
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

<Suspense fallback={<div>Loading...</div>}>
  <AboutSection />
</Suspense>

<Suspense fallback={<div>Loading...</div>}>
  <ServicesSection />
</Suspense>

<Suspense fallback={<div>Loading...</div>}>
  <PackagesSection />
</Suspense>

<Suspense fallback={<div>Loading...</div>}>
  <TestimonialsSection />
</Suspense>

<Suspense fallback={<div>Loading...</div>}>
  <ContactSection />
</Suspense>
    </div>
  );
}
