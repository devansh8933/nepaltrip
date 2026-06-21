import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, Mountain } from "lucide-react";

const NAV = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Packages", to: "/packages" },
  { label: "Services", to: "/services" },
  { label: "Testimonials", to: "/testimonials" },
  { label: "Contact Us", to: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      data-testid="site-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-border/60"
          : "bg-white/70 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="container-pad mx-auto flex items-center justify-between h-20">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-[#1C3144] grid place-items-center text-white">
            <Mountain className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <span className="font-display text-2xl tracking-tight text-[#1C3144]">
            Nepal <span className="italic font-light">Trip</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.replace(/\s+/g, "-").toLowerCase()}`}
              className={({ isActive }) =>
                `link-underline text-sm tracking-wide font-medium ${
                  isActive ? "text-[#DC143C]" : "text-[#1C3144]/80 hover:text-[#1C3144]"
                }`
              }
              end={n.to === "/"}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/admin/login"
            data-testid="header-admin-login"
            className="link-underline text-xs uppercase tracking-[0.2em] text-[#1C3144]/70 hover:text-[#DC143C]"
          >
            Admin Login
          </Link>
          <Link
            to="/contact"
            data-testid="header-cta-enquire"
            className="inline-flex items-center px-6 py-3 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors"
          >
            Enquire
          </Link>
        </div>

        <button
          type="button"
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-[#1C3144]"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div data-testid="mobile-menu" className="lg:hidden bg-white border-t border-border">
          <div className="container-pad mx-auto py-6 flex flex-col gap-5">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                data-testid={`mobile-nav-${n.label.replace(/\s+/g, "-").toLowerCase()}`}
                className={({ isActive }) =>
                  `text-base ${isActive ? "text-[#DC143C]" : "text-[#1C3144]"}`
                }
                end={n.to === "/"}
              >
                {n.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              data-testid="mobile-cta-enquire"
              className="mt-2 inline-flex items-center justify-center px-6 py-3 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em]"
            >
              Enquire
            </Link>
            <Link
              to="/admin/login"
              data-testid="mobile-admin-login"
              className="inline-flex items-center justify-center px-6 py-3 border border-[#1C3144]/30 text-[#1C3144] text-xs uppercase tracking-[0.2em]"
            >
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
