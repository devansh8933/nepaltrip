import TestimonialsSection from "@/components/sections/TestimonialsSection";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";

export default function Testimonials() {
  return (
    <div data-testid="testimonials-page">
      <SEO
        title="Testimonials — Real travellers, real journeys"
        description="Honest stories from travellers who explored Nepal, Kashmir and Char Dham with Nepal Trip — the Best Tour and Travel Agency in Gorakhpur."
        path="/testimonials"
      />
      <PageHeader
        overline="Testimonials"
        title="Words from our travellers."
        subtitle="Honest stories from people who travelled with Nepal Trip."
      />
      <TestimonialsSection />
    </div>
  );
}
