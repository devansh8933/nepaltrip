import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HERO_SLIDES } from "@/data/content";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % HERO_SLIDES.length), 6000);
    return () => clearInterval(t);
  }, []);

  const next = () => setIdx((p) => (p + 1) % HERO_SLIDES.length);
  const prev = () => setIdx((p) => (p - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <section
      data-testid="hero-section"
      className="relative w-full h-[88vh] min-h-[600px] overflow-hidden bg-[#1C3144]"
    >
      {HERO_SLIDES.map((s, i) => (
        <div
          key={s.url}
          className={`slide absolute inset-0 ${i === idx ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== idx}
        >
          <img
            src={s.url}
            alt={s.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: i === idx ? "scale(1.05)" : "scale(1)",
              transition: "transform 8s ease-out",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20" />
        </div>
      ))}

      {/* Overlay content */}
      <div className="relative h-full container-pad mx-auto flex flex-col justify-center">
        <div className="max-w-3xl text-white" key={idx}>
          <p data-testid="hero-overline" className="overline text-[#EAA015] mb-6 fade-up">
            Nepal Trip · Since Day One
          </p>
          <h1
            data-testid="hero-title"
            className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight font-light fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Discover the Beauty
            <br />
            of <em className="text-[#EAA015] not-italic font-normal">Nepal</em>
          </h1>
          <p
            data-testid="hero-subtitle"
            className="mt-7 max-w-xl text-base sm:text-lg text-white/85 font-light fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Explore mountains, culture, adventure and unforgettable journeys across Nepal.
          </p>

          <div className="mt-10 flex flex-wrap gap-4 fade-up" style={{ animationDelay: "0.45s" }}>
            <Link
              data-testid="hero-cta-packages"
              to="/packages"
              className="px-8 py-4 bg-white text-[#1C3144] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#EAA015] hover:text-[#1C3144] transition-colors"
            >
              Browse Packages
            </Link>
            <Link
              data-testid="hero-cta-contact"
              to="/contact"
              className="px-8 py-4 border border-white/60 text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-white hover:text-[#1C3144] transition-colors"
            >
              Plan My Trip
            </Link>
          </div>

          <p className="mt-10 text-sm text-white/70 fade-up" style={{ animationDelay: "0.6s" }}>
            <span className="text-[#EAA015]">{HERO_SLIDES[idx].title}</span> — {HERO_SLIDES[idx].caption}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 flex items-center gap-2 z-10">
        <button
          data-testid="hero-prev"
          onClick={prev}
          aria-label="Previous slide"
          className="w-11 h-11 border border-white/40 grid place-items-center text-white hover:bg-white hover:text-[#1C3144] transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          data-testid="hero-next"
          onClick={next}
          aria-label="Next slide"
          className="w-11 h-11 border border-white/40 grid place-items-center text-white hover:bg-white hover:text-[#1C3144] transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            data-testid={`hero-dot-${i}`}
            onClick={() => setIdx(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-[2px] transition-all ${
              i === idx ? "w-10 bg-[#EAA015]" : "w-5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
