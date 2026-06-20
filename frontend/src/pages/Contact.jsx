import ContactSection from "@/components/sections/ContactSection";
import PageHeader from "@/components/PageHeader";

export default function Contact() {
  return (
    <div data-testid="contact-page">
      <PageHeader
        overline="Contact Us"
        title="Plan your next journey with Nepal Trip."
        subtitle="Tell us what you're dreaming of — we'll come back with a beautifully designed itinerary."
      />
      <ContactSection />
    </div>
  );
}
