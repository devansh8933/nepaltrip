import { Link } from "react-router-dom";
import { Mountain, Phone, Mail, MapPin } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/api";

export default function Footer() {
  return (
    <footer data-testid="site-footer" className="bg-[#1C3144] text-white/85 mt-24">
      <div className="container-pad mx-auto py-16 grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-4">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-9 h-9 rounded-full bg-[#EAA015] grid place-items-center text-[#1C3144]">
              <Mountain className="w-5 h-5" strokeWidth={1.5} />
            </span>
            <span className="font-display text-2xl text-white">
              Nepal <span className="italic font-light">Trip</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-white/65 max-w-sm">
            The Best Tour and Travel Agency in Gorakhpur — crafting Nepal Holiday Tours,
            Honeymoon Packages, Pilgrimage Tours and curated Himalayan journeys since day one.
          </p>
        </div>

        <div className="md:col-span-2">
          <p className="overline text-white/50 mb-4">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link data-testid="footer-link-home" to="/" className="hover:text-[#EAA015]">Home</Link></li>
            <li><Link data-testid="footer-link-about" to="/about" className="hover:text-[#EAA015]">About Us</Link></li>
            <li><Link data-testid="footer-link-packages" to="/packages" className="hover:text-[#EAA015]">Packages</Link></li>
            <li><Link data-testid="footer-link-services" to="/services" className="hover:text-[#EAA015]">Services</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="overline text-white/50 mb-4">Top Packages</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/packages/kathmandu" className="hover:text-[#EAA015]">Kathmandu Pokhara Tour</Link></li>
            <li><Link to="/packages/religious-pilgrimage" className="hover:text-[#EAA015]">Char Dham Yatra Package</Link></li>
            <li><Link to="/packages/hill-stations-valleys" className="hover:text-[#EAA015]">Nepal Honeymoon Package</Link></li>
            <li><Link to="/packages/heritage-tours" className="hover:text-[#EAA015]">Varanasi Tour Package</Link></li>
          </ul>
        </div>

        <div className="md:col-span-3">
          <p className="overline text-white/50 mb-4">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 text-[#EAA015]" />
              <span>Gorakhpur, Uttar Pradesh, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#EAA015]" />
              <a data-testid="footer-phone" href="tel:+919580261255" className="hover:text-[#EAA015]">+91 9580261255</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#EAA015]" />
              <a href="mailto:hello@nepaltrip.in" className="hover:text-[#EAA015]">hello@nepaltrip.in</a>
            </li>
            <li>
              <a
                data-testid="footer-whatsapp"
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center mt-2 px-4 py-2 border border-[#EAA015] text-[#EAA015] text-xs uppercase tracking-[0.2em] hover:bg-[#EAA015] hover:text-[#1C3144] transition-colors"
              >
                WhatsApp Us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-pad mx-auto py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <p>© {new Date().getFullYear()} Nepal Trip. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p>Best Tour and Travel Agency in Gorakhpur</p>
            <Link
              data-testid="footer-admin-login"
              to="/admin/login"
              className="hover:text-[#EAA015] transition-colors"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
