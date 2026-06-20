import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

export default function About() {
  return (
    <div data-testid="about-page">
      <SEO
        title="About Us — Nepal Tour Operator in Gorakhpur"
        description="Welcome to Nepal Trip — Best Tour and Travel Agency in Gorakhpur. A decade of curated Nepal Holiday Tours, Honeymoon Packages and Pilgrimage Tours."
        path="/about"
      />
      <PageHeader
        overline="About Nepal Trip"
        title="A team that lives & breathes the Himalayas."
        subtitle="Welcome to Nepal Trip — your trusted partner for Nepal Holiday Tours, Honeymoon Packages and Pilgrimage Tours from Gorakhpur."
      />
      <AboutSection full />
      <ContactSection />
    </div>
  );
}
