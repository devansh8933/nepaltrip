import { useEffect, useState } from "react";
import { API } from "@/lib/api";
import axios from "axios";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import PageHeader from "@/components/PageHeader";
import { Lock, RefreshCw, Trash2 } from "lucide-react";

const TOKEN_KEY = "nepaltrip_admin_token";

export default function AdminLeads() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("");

  const fetchLeads = async (t = token, category = filter) => {
    if (!t) {
      toast.error("Please enter your admin token");
      return;
    }
    setLoading(true);
    try {
      const params = category ? { category, limit: 500 } : { limit: 500 };
      const res = await axios.get(`${API}/leads`, {
        headers: { "X-Admin-Token": t },
        params,
      });
      setLeads(res.data);
      setAuthed(true);
      localStorage.setItem(TOKEN_KEY, t);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Invalid admin token");
        localStorage.removeItem(TOKEN_KEY);
        setAuthed(false);
      } else {
        toast.error("Failed to fetch leads");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchLeads(token, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authed) fetchLeads(token, filter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setAuthed(false);
    setLeads([]);
  };

  if (!authed) {
    return (
      <div data-testid="admin-login-page">
        <Helmet>
          <title>Admin · Nepal Trip</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <PageHeader
          overline="Admin Area"
          title="Lead Inbox"
          subtitle="Restricted access. Enter the admin token from your backend .env to continue."
        />
        <section className="section-pad container-pad mx-auto max-w-xl">
          <div className="bg-white border border-border p-8 lg:p-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 grid place-items-center bg-[#1C3144] text-white">
                <Lock className="w-4 h-4" />
              </span>
              <div>
                <h2 className="font-display text-2xl text-[#1C3144]">Admin Access</h2>
                <p className="text-xs text-[#4A4A4A]">Token is required to view submitted leads</p>
              </div>
            </div>
            <label className="overline text-[10px] text-[#4A4A4A]">Admin Token</label>
            <input
              data-testid="admin-token-input"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste X-Admin-Token here"
              className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm"
              onKeyDown={(e) => e.key === "Enter" && fetchLeads(token, filter)}
            />
            <button
              data-testid="admin-login-submit"
              onClick={() => fetchLeads(token, filter)}
              disabled={loading}
              className="mt-8 inline-flex items-center px-8 py-4 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors disabled:opacity-60"
            >
              {loading ? "Checking…" : "Unlock"}
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div data-testid="admin-leads-page">
      <Helmet>
        <title>Lead Inbox · Nepal Trip Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <PageHeader
        overline="Admin · Leads"
        title={`${leads.length} enquiries received`}
        subtitle="Recent first. Filter by category to focus on what matters."
      />
      <section className="section-pad container-pad mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {["", "general", "service", "package"].map((c) => (
            <button
              key={c || "all"}
              data-testid={`filter-${c || "all"}`}
              onClick={() => setFilter(c)}
              className={`px-4 py-2 text-xs uppercase tracking-[0.2em] border ${
                filter === c
                  ? "bg-[#1C3144] text-white border-[#1C3144]"
                  : "bg-white text-[#1C3144] border-border hover:border-[#1C3144]"
              }`}
            >
              {c || "All"}
            </button>
          ))}
          <button
            data-testid="refresh-leads"
            onClick={() => fetchLeads(token, filter)}
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-[#1C3144] hover:bg-[#FAFAF8]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            data-testid="admin-logout"
            onClick={clearToken}
            className="inline-flex items-center gap-2 px-4 py-2 border border-[#DC143C]/40 text-sm text-[#DC143C] hover:bg-[#DC143C]/5"
          >
            <Trash2 className="w-4 h-4" />
            Forget token
          </button>
        </div>

        <div className="overflow-x-auto border border-border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-[#1C3144]">
              <tr>
                <th className="text-left p-4 overline text-[10px]">When</th>
                <th className="text-left p-4 overline text-[10px]">Category</th>
                <th className="text-left p-4 overline text-[10px]">Subject</th>
                <th className="text-left p-4 overline text-[10px]">Name</th>
                <th className="text-left p-4 overline text-[10px]">Email</th>
                <th className="text-left p-4 overline text-[10px]">Mobile</th>
                <th className="text-left p-4 overline text-[10px]">Description</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#4A4A4A]">
                    No leads yet for this filter.
                  </td>
                </tr>
              )}
              {leads.map((l) => (
                <tr key={l.id} className="border-t border-border align-top">
                  <td className="p-4 text-[#4A4A4A] whitespace-nowrap">
                    {new Date(l.created_at).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider ${
                      l.category === "package" ? "bg-[#EAA015]/15 text-[#1C3144]" :
                      l.category === "service" ? "bg-[#DC143C]/10 text-[#DC143C]" :
                      "bg-[#1C3144]/10 text-[#1C3144]"
                    }`}>
                      {l.category}
                    </span>
                  </td>
                  <td className="p-4 text-[#1C3144] font-medium">{l.subject}</td>
                  <td className="p-4 text-[#1C3144]">{l.name}</td>
                  <td className="p-4"><a href={`mailto:${l.email}`} className="text-[#DC143C] hover:underline">{l.email}</a></td>
                  <td className="p-4"><a href={`tel:${l.mobile}`} className="text-[#1C3144]">{l.mobile}</a></td>
                  <td className="p-4 text-[#4A4A4A] max-w-xs">{l.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
