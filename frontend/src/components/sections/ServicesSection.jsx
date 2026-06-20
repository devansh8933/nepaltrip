import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import * as Icons from "lucide-react";
import { SERVICES } from "@/data/content";

export default function ServicesSection() {
  return (
    <section
      data-testid="services-section"
      className="section-pad bg-[#1C3144] text-white relative overflow-hidden"
    >
      <div className="container-pad mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="overline text-[#EAA015] mb-5">Services We Offer</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05]">
              Travel, end to end.
              <br />
              Handled by <em className="text-[#EAA015] not-italic">us</em>.
            </h2>
          </div>
          <Link
            to="/services"
            data-testid="services-view-all"
            className="link-underline text-sm text-white/85 hover:text-[#EAA015]"
          >
            View all services →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {SERVICES.map((s, i) => {
            const Icon = Icons[s.icon] || Icons.Compass;
            return (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                data-testid={`service-card-${s.slug}`}
                className="group bg-[#1C3144] hover:bg-[#16283A] p-8 lg:p-10 flex flex-col gap-5 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="w-12 h-12 grid place-items-center border border-white/20 group-hover:border-[#EAA015] transition-colors">
                    <Icon className="w-5 h-5 text-[#EAA015]" strokeWidth={1.4} />
                  </span>
                  <span className="text-[10px] text-white/40 tracking-[0.3em]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-2xl text-white group-hover:text-[#EAA015] transition-colors">
                  {s.title}
                </h3>
                <p className="text-sm text-white/65 leading-relaxed line-clamp-3">{s.short}</p>
                <span className="mt-auto inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-white/70 group-hover:text-[#EAA015]">
                  Learn More
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
