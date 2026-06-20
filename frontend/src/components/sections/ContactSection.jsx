import LeadForm from "@/components/LeadForm";

export default function ContactSection() {
  return (
    <section data-testid="contact-section" className="section-pad bg-[#1C3144] text-white">
      <div className="container-pad mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-5">
          <p className="overline text-[#EAA015] mb-5">Get in Touch</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]">
            Let's plan your
            <br />
            next <em className="text-[#EAA015] not-italic">journey</em>.
          </h2>
          <p className="mt-8 text-white/70 leading-relaxed max-w-md">
            Drop us your details and our trip planners will reach out within a few hours. Or
            connect on WhatsApp for an instant chat — we usually reply within minutes.
          </p>

          <div className="mt-10 space-y-4 text-sm">
            <div>
              <p className="overline text-white/40 text-[10px] mb-1">Phone</p>
              <a href="tel:+919580261255" className="text-white hover:text-[#EAA015]">+91 9580261255</a>
            </div>
            <div>
              <p className="overline text-white/40 text-[10px] mb-1">Email</p>
              <a href="mailto:hello@nepaltrip.in" className="text-white hover:text-[#EAA015]">hello@nepaltrip.in</a>
            </div>
            <div>
              <p className="overline text-white/40 text-[10px] mb-1">Office</p>
              <p className="text-white/80">Gorakhpur, Uttar Pradesh, India</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <LeadForm
            subject="General Enquiry"
            category="general"
            testIdPrefix="enquiry"
            variant="dark"
          />
        </div>
      </div>
    </section>
  );
}
