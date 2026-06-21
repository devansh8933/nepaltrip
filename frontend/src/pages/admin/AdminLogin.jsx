import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { useAuth, formatApiError } from "@/lib/api";
import { Lock, Mountain } from "lucide-react";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      toast.success("Welcome back, Admin");
      const redirect = location.state?.from && location.state.from.startsWith("/admin")
        ? location.state.from
        : "/admin";
      navigate(redirect, { replace: true });
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="admin-login-page" className="min-h-screen grid lg:grid-cols-2 bg-[#FAFAF8]">
      <Helmet>
        <title>Admin Login · Nepal Trip</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Brand side */}
      <div className="hidden lg:flex relative bg-[#1C3144] text-white p-16 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 opacity-25 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1637846959991-18e54d6e2035?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxoaW1hbGF5YXMlMjBtb3VudGFpbiUyMHBlYWt8ZW58MHx8fHwxNzgxOTg0NjgzfDA&ixlib=rb-4.1.0&q=85')" }} />
        <div className="absolute inset-0 bg-gradient-to-br from-[#1C3144] via-[#1C3144]/85 to-transparent" />
        <Link to="/" className="relative z-10 flex items-center gap-2 group">
          <span className="w-9 h-9 rounded-full bg-[#EAA015] grid place-items-center text-[#1C3144]">
            <Mountain className="w-5 h-5" strokeWidth={1.5} />
          </span>
          <span className="font-display text-2xl">Nepal <em className="font-light">Trip</em></span>
        </Link>
        <div className="relative z-10">
          <p className="overline text-[#EAA015] mb-4">Admin Console</p>
          <h2 className="font-display text-4xl xl:text-5xl leading-[1.05] font-light max-w-md">
            Manage every enquiry,
            <br />
            in one quiet place.
          </h2>
          <p className="mt-6 text-white/65 max-w-md text-sm leading-relaxed">
            Track service, package and general enquiries with subject and source page. Update status, add notes, and never miss a lead.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/40">Restricted access</p>
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <form onSubmit={handleSubmit} className="w-full max-w-md" data-testid="admin-login-form">
          <div className="flex items-center gap-3 mb-10">
            <span className="w-10 h-10 grid place-items-center bg-[#1C3144] text-white">
              <Lock className="w-4 h-4" />
            </span>
            <div>
              <p className="overline text-[#DC143C] text-[10px]">Admin Console</p>
              <h1 className="font-display text-2xl text-[#1C3144]">Sign in</h1>
            </div>
          </div>

          <div className="space-y-7">
            <div>
              <label className="overline text-[10px] text-[#4A4A4A]">Email</label>
              <input
                data-testid="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="overline text-[10px] text-[#4A4A4A]">Password</label>
              <input
                data-testid="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading}
            className="mt-10 w-full inline-flex items-center justify-center px-8 py-4 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="mt-6 text-xs text-[#4A4A4A]">
            Back to{" "}
            <Link to="/" className="text-[#DC143C] hover:underline">main website</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
