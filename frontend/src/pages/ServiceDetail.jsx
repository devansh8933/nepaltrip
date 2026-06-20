import { useParams, Link, Navigate } from "react-router-dom";
import { SERVICES } from "@/data/content";
import LeadForm from "@/components/LeadForm";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return <Navigate to="/services" replace />;

  return (
    <div data-testid="service-detail-page">
      <SEO
        title={`${service.title} — Nepal Trip`}
        description={`${service.title} by Nepal Trip — ${service.short} Trusted Tour Operator in Gorakhpur. Call +91 9580261255.`}
        path={`/services/${service.slug}`}
        image={service.image}
      />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-[#1C3144]">
        <img
          src={service.image}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C3144] via-[#1C3144]/60 to-transparent" />
        <div className="relative h-full container-pad mx-auto flex flex-col justify-end pb-16 text-white">
          <Link
            to="/services"
            data-testid="back-to-services"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#EAA015] mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All Services
          </Link>
          <p className="overline text-[#EAA015] mb-3">Service</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
            {service.title}
          </h1>
        </div>
      </section>

      {/* Blog */}
      <section className="section-pad container-pad mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          <p className="overline text-[#DC143C] mb-5">Why book this with Nepal Trip</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1C3144] mb-8 leading-tight">
            {service.short}
          </h2>
          <div className="space-y-6 text-base text-[#4A4A4A] leading-relaxed">
            {service.blog.map((para, i) => (
              <p key={i} data-testid={`service-blog-paragraph-${i}`}>{para}</p>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-28 self-start bg-white border border-border p-8 lg:p-10">
          <p className="overline text-[#DC143C] mb-3">Enquire now</p>
          <h3 className="font-display text-2xl text-[#1C3144] mb-6">{service.title}</h3>
          <LeadForm
            subject={service.title}
            category="service"
            slug={service.slug}
            testIdPrefix={`service-${service.slug}`}
            variant="card"
          />
        </aside>
      </section>
    </div>
  );
}
