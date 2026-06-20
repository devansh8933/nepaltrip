import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { SERVICES } from "@/data/content";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";
import { ArrowUpRight } from "lucide-react";

export default function Services() {
  return (
    <div data-testid="services-page">
      <SEO
        title="Travel Services — Tour Operator, Airline & Visa"
        description="End-to-end travel services from Nepal Trip — tour operator, airline ticketing, railway ticketing, cruise, hotel booking, passport, visa, car rental and travel insurance."
        path="/services"
      />
      <PageHeader
        overline="Our Services"
        title="Everything you need for a perfect trip."
        subtitle="From flights and hotels to permits and insurance — Nepal Trip handles every detail so you can simply travel."
      />

      <section className="section-pad container-pad mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Compass;
            return (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                data-testid={`services-page-card-${s.slug}`}
                className="group bg-white border border-border hover:border-[#1C3144] p-8 flex flex-col gap-5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 grid place-items-center bg-[#1C3144]/5 text-[#1C3144] group-hover:bg-[#DC143C] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" strokeWidth={1.4} />
                  </span>
                  <span className="text-[10px] text-[#4A4A4A]/60 tracking-[0.3em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-[#1C3144]">{s.title}</h3>
                <p className="text-sm text-[#4A4A4A] leading-relaxed">{s.short}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[#DC143C]">
                  Read More <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
