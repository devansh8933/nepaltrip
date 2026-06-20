import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { ABOUT_IMAGE } from "@/data/content";

export default function AboutSection({ full = false }) {
  return (
    <section data-testid="about-section" className="section-pad bg-background relative">
      <div className="container-pad mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={ABOUT_IMAGE}
              alt="Nepal Heritage"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-6 -right-6 hidden md:block bg-[#EAA015] text-[#1C3144] px-6 py-5">
              <p className="font-display text-3xl">10+</p>
              <p className="overline text-xs">Years of Journeys</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <p data-testid="about-overline" className="overline text-[#DC143C] mb-5">
            Welcome to Nepal Trip
          </p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-[#1C3144] leading-[1.05] tracking-tight">
            The Best Tour and Travel
            <br />
            Agency in <em className="text-[#DC143C] not-italic">Gorakhpur</em>.
          </h2>

          <div className="mt-8 space-y-5 text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
            <p>
              At Nepal Trip we craft a <strong>trip to Nepal</strong> the way it deserves to be —
              slowly, soulfully and with absolute attention to detail. As the most-loved{" "}
              <strong>Best Tour and Travel Agency in Gorakhpur</strong>, we have spent over a decade
              guiding families, pilgrims and honeymooners across Nepal, Kashmir, Char Dham, Ayodhya,
              Varanasi and beyond.
            </p>
            <p>
              From <strong>Nepal Holiday Tours</strong> to thoughtful{" "}
              <strong>Honeymoon Packages</strong> and devout <strong>Pilgrimage Tours</strong>, every
              itinerary is hand-built around what you want from the trip. No cookie-cutter buses,
              no rushed darshans — just smooth logistics, warm hospitality and the right amount of
              wonder.
            </p>
            {full && (
              <>
                <p>
                  Our promise is simple: lowest fares, hand-picked hotels, certified guides, 24x7
                  on-ground support, and a dedicated trip manager for every booking. We are the
                  Nepal Tour Operator in Gorakhpur trusted by hundreds of families every year — and
                  we would love to be yours next.
                </p>
                <p>
                  Whether you're searching “Travel Agency Near Me” for a quick weekend escape, a
                  Char Dham Yatra Package, a Kailash Mansarovar Yatra, a Muktinath Darshan Package
                  or a romantic Kashmir Honeymoon Package — Nepal Trip is one call away.
                </p>
              </>
            )}
          </div>

          {!full && (
            <Link
              data-testid="about-cta-more"
              to="/about"
              className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#DC143C] transition-colors group"
            >
              Click here to see more
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
