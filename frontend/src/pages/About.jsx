import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import PageHeader from "@/components/PageHeader";

export default function About() {
  return (
    <div data-testid="about-page">
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
