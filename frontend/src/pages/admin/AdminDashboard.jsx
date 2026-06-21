import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Inbox, Clock, CheckCircle, Briefcase, MapPin, MessageSquare, TrendingUp } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, accent, testid }) => (
  <div data-testid={testid} className="bg-white border border-border p-6 flex items-start justify-between">
    <div>
      <p className="overline text-[10px] text-[#4A4A4A]">{label}</p>
      <p className="font-display text-4xl text-[#1C3144] mt-2">{value ?? "—"}</p>
    </div>
    <span className={`w-10 h-10 grid place-items-center ${accent}`}>
      <Icon className="w-5 h-5" strokeWidth={1.5} />
    </span>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/leads/stats")
      .then((r) => setStats(r.data))
      .catch(() => toast.error("Failed to load stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div data-testid="admin-dashboard" className="p-8 lg:p-12">
      <div className="mb-10">
        <p className="overline text-[#DC143C]">Overview</p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1C3144] mt-2">Dashboard</h1>
        <p className="text-[#4A4A4A] mt-2 text-sm">A snapshot of every enquiry coming through Nepal Trip.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard icon={Inbox} label="Total Enquiries" value={stats?.total} accent="bg-[#1C3144] text-white" testid="stat-total" />
        <StatCard icon={Clock} label="New" value={stats?.new} accent="bg-[#DC143C]/10 text-[#DC143C]" testid="stat-new" />
        <StatCard icon={TrendingUp} label="In Progress" value={stats?.in_progress} accent="bg-[#EAA015]/15 text-[#1C3144]" testid="stat-in-progress" />
        <StatCard icon={CheckCircle} label="Closed" value={stats?.closed} accent="bg-emerald-50 text-emerald-700" testid="stat-closed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        <div className="bg-white border border-border p-6">
          <p className="overline text-[10px] text-[#4A4A4A] mb-3">By Source Type</p>
          <ul className="space-y-3 text-sm">
            {[
              { key: "general", label: "General Enquiry", icon: MessageSquare },
              { key: "service", label: "Service Pages", icon: Briefcase },
              { key: "package", label: "Package Pages", icon: MapPin },
            ].map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.key} data-testid={`bycat-${row.key}`} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-none">
                  <span className="flex items-center gap-2 text-[#1C3144]">
                    <Icon className="w-4 h-4 text-[#DC143C]" />
                    {row.label}
                  </span>
                  <span className="font-display text-xl text-[#1C3144]">{stats?.by_category?.[row.key] ?? 0}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="bg-white border border-border p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <p className="overline text-[10px] text-[#4A4A4A]">Top Enquiry Sources</p>
            <Link to="/admin/leads" className="text-xs text-[#DC143C] hover:underline">View all →</Link>
          </div>
          {loading ? (
            <p className="text-sm text-[#4A4A4A] py-8 text-center">Loading…</p>
          ) : !stats?.by_subject?.length ? (
            <p className="text-sm text-[#4A4A4A] py-8 text-center">No enquiries yet.</p>
          ) : (
            <ul className="divide-y divide-border" data-testid="top-sources-list">
              {stats.by_subject.slice(0, 8).map((row, idx) => (
                <li key={idx} className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-[#1C3144] text-sm font-medium">{row.subject}</p>
                    <p className="text-[10px] uppercase tracking-wider text-[#4A4A4A] mt-0.5">
                      {row.category} {row.slug ? `· /${row.category === "service" ? "services" : "packages"}/${row.slug}` : ""}
                    </p>
                  </div>
                  <span className="font-display text-lg text-[#1C3144]">{row.count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
