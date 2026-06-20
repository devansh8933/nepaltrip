import ContactSection from "@/components/sections/ContactSection";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

export default function Contact() {
  return (
    <div data-testid="contact-page">
      <SEO
        title="Contact — Plan your next journey with Nepal Trip"
        description="Talk to the Best Tour and Travel Agency in Gorakhpur. Call +91 9580261255 or send us an enquiry — we usually reply in minutes."
        path="/contact"
      />
      <PageHeader
        overline="Contact Us"
        title="Plan your next journey with Nepal Trip."
        subtitle="Tell us what you're dreaming of — we'll come back with a beautifully designed itinerary."
      />
      <ContactSection />
    </div>
  );
}
