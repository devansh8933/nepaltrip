import { useParams, Link, Navigate } from "react-router-dom";
import { ALL_PACKAGES } from "@/data/content";
import LeadForm from "@/components/LeadForm";
import SEO from "@/components/SEO";
import { ArrowLeft } from "lucide-react";

export default function PackageDetail() {
  const { slug } = useParams();
  const pkg = ALL_PACKAGES.find((p) => p.slug === slug);
  if (!pkg) return <Navigate to="/packages" replace />;

  return (
    <div data-testid="package-detail-page">
      <SEO
        title={`${pkg.title} — Tour Package by Nepal Trip`}
        description={`${pkg.title} curated by Nepal Trip from Gorakhpur. ${pkg.blog?.[0]?.slice(0, 140) || ""}`}
        path={`/packages/${pkg.slug}`}
        image={pkg.image}
      />
      <section className="relative h-[60vh] min-h-[420px] overflow-hidden bg-[#1C3144]">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C3144] via-[#1C3144]/50 to-transparent" />
        <div className="relative h-full container-pad mx-auto flex flex-col justify-end pb-16 text-white">
          <Link
            to="/packages"
            data-testid="back-to-packages"
            className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-[#EAA015] mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> All Packages
          </Link>
          <p className="overline text-[#EAA015] mb-3">Package</p>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight">
            {pkg.title}
          </h1>
          {pkg.duration && <p className="mt-3 text-white/75 text-sm tracking-wide">{pkg.duration}</p>}
        </div>
      </section>

      <section className="section-pad container-pad mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
        <div className="lg:col-span-7">
          <p className="overline text-[#DC143C] mb-5">About this journey</p>
          <h2 className="font-display text-3xl sm:text-4xl text-[#1C3144] mb-8 leading-tight">
            {pkg.title} — curated by Nepal Trip
          </h2>
          <div className="space-y-6 text-base text-[#4A4A4A] leading-relaxed">
            {pkg.blog.map((para, i) => (
              <p key={i} data-testid={`package-blog-paragraph-${i}`}>{para}</p>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-28 self-start bg-white border border-border p-8 lg:p-10">
          <p className="overline text-[#DC143C] mb-3">Enquire now</p>
          <h3 className="font-display text-2xl text-[#1C3144] mb-6">{pkg.title}</h3>
          <LeadForm
            subject={pkg.title}
            category="package"
            slug={pkg.slug}
            testIdPrefix={`package-${pkg.slug}`}
            variant="card"
          />
        </aside>
      </section>
    </div>
  );
}
