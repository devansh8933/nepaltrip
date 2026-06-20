import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/data/content";

export default function TestimonialsSection() {
  return (
    <section
      data-testid="testimonials-section"
      className="section-pad bg-[#FAFAF8] relative overflow-hidden"
    >
      <div className="container-pad mx-auto">
        <div className="max-w-2xl mb-14">
          <p className="overline text-[#DC143C] mb-5">Travellers' Words</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C3144] leading-[1.05]">
            Real journeys,
            <br />
            real <em className="text-[#DC143C] not-italic">people</em>.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <article
              key={t.name}
              data-testid={`testimonial-${i}`}
              className="bg-white border border-border p-8 lg:p-10 relative"
            >
              <Quote className="w-10 h-10 text-[#EAA015]/70 mb-6" strokeWidth={1} />
              <p className="font-display text-xl lg:text-2xl text-[#1C3144] leading-[1.5] italic font-light">
                “{t.quote}”
              </p>
              <div className="mt-8 flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-14 h-14 object-cover rounded-full"
                />
                <div>
                  <p className="font-medium text-[#1C3144]">{t.name}</p>
                  <p className="text-xs text-[#4A4A4A] tracking-wide">{t.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
