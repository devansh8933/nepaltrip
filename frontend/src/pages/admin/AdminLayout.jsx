import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/lib/api";
import { LayoutDashboard, Inbox, LogOut, Mountain, ExternalLink } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/leads", label: "All Enquiries", icon: Inbox },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] grid grid-cols-1 lg:grid-cols-[280px_1fr]" data-testid="admin-layout">
      <Helmet>
        <title>Admin · Nepal Trip</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Sidebar */}
      <aside className="bg-[#1C3144] text-white flex flex-col">
        <Link to="/admin" className="flex items-center gap-2 px-8 py-7 border-b border-white/10">
          <span className="w-9 h-9 rounded-full bg-[#EAA015] grid place-items-center text-[#1C3144]">
            <Mountain className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <div>
            <span className="font-display text-xl block leading-none">Nepal <em className="font-light">Trip</em></span>
            <span className="overline text-[9px] text-[#EAA015]">Admin Console</span>
          </div>
        </Link>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                data-testid={`admin-nav-${n.label.replace(/\s+/g, "-").toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-white/10 text-[#EAA015]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`
                }
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {n.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-5 border-t border-white/10 space-y-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-white/60 hover:text-[#EAA015] px-4"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View public site
          </a>
          <div className="px-4">
            <p className="text-xs text-white/50 mb-0.5">Signed in as</p>
            <p data-testid="admin-current-user" className="text-sm text-white truncate">{user?.email}</p>
          </div>
          <button
            data-testid="admin-logout-btn"
            onClick={onLogout}
            className="w-full mx-0 inline-flex items-center justify-center gap-2 px-4 py-3 border border-white/20 text-xs uppercase tracking-[0.2em] text-white hover:bg-[#DC143C] hover:border-[#DC143C] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="min-h-screen bg-[#FAFAF8]">
        <Outlet />
      </main>

      <Toaster richColors position="top-center" />
    </div>
  );
}
