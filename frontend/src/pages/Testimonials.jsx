import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PageHeader from "@/components/PageHeader";

export default function Testimonials() {
  return (
    <div data-testid="testimonials-page">
      <PageHeader
        overline="Testimonials"
        title="Words from our travellers."
        subtitle="Honest stories from people who travelled with Nepal Trip."
      />
      <TestimonialsSection />
    </div>
  );
}
