import { Link } from "react-router-dom";
import { PACKAGES_BY_CITY, PACKAGES_BY_CATEGORY } from "@/data/content";
import { ArrowUpRight } from "lucide-react";

function PackageCard({ pkg, type }) {
  return (
    <Link
      to={`/packages/${pkg.slug}`}
      data-testid={`package-card-${pkg.slug}`}
      className="card-zoom group relative block overflow-hidden bg-[#1C3144] aspect-[3/4]"
    >
      <img
        src={pkg.image}
        alt={pkg.title}
        className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute top-5 left-5 z-10">
        <span className="overline text-[10px] bg-white/15 backdrop-blur-md text-white px-3 py-1.5">
          {type}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
        <h3 className="font-display text-2xl lg:text-3xl leading-tight">{pkg.title}</h3>
        {pkg.duration && <p className="text-xs text-white/70 mt-1.5 tracking-wide">{pkg.duration}</p>}
        <span className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-[#EAA015]">
          Explore <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

export default function PackagesSection({ full = false }) {
  const cities = full ? PACKAGES_BY_CITY : PACKAGES_BY_CITY.slice(0, 4);
  const cats = full ? PACKAGES_BY_CATEGORY : PACKAGES_BY_CATEGORY.slice(0, 4);

  return (
    <section data-testid="packages-section" className="section-pad bg-background">
      <div className="container-pad mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="overline text-[#DC143C] mb-5">Curated Packages</p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C3144] leading-[1.05]">
              Choose how you
              <br />
              want to <em className="text-[#DC143C] not-italic">travel</em>.
            </h2>
          </div>
          {!full && (
            <Link
              data-testid="packages-view-all"
              to="/packages"
              className="link-underline text-sm text-[#1C3144] hover:text-[#DC143C]"
            >
              View all packages →
            </Link>
          )}
        </div>

        {/* By City */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h3 className="overline text-[#1C3144]">Packages by City</h3>
            {full && <span className="text-xs text-[#4A4A4A]/70">{PACKAGES_BY_CITY.length} destinations</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((p) => <PackageCard key={p.slug} pkg={p} type="By City" />)}
          </div>
        </div>

        {/* By Category */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="overline text-[#1C3144]">Packages by Category</h3>
            {full && <span className="text-xs text-[#4A4A4A]/70">{PACKAGES_BY_CATEGORY.length} themes</span>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cats.map((p) => <PackageCard key={p.slug} pkg={p} type="By Theme" />)}
          </div>
        </div>
      </div>
    </section>
  );
}
