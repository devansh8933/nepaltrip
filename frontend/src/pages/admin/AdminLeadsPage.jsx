import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Search, RefreshCw, Trash2, X, Phone, Mail, MessageCircle, MapPin, Briefcase, MessageSquare } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/api";

const STATUS_OPTIONS = [
  { value: "new", label: "New", chip: "bg-[#DC143C]/10 text-[#DC143C]" },
  { value: "in_progress", label: "In Progress", chip: "bg-[#EAA015]/15 text-[#1C3144]" },
  { value: "closed", label: "Closed", chip: "bg-emerald-50 text-emerald-700" },
];

const CATEGORY_TABS = [
  { value: "all", label: "All" },
  { value: "general", label: "General", icon: MessageSquare },
  { value: "service", label: "Services", icon: Briefcase },
  { value: "package", label: "Packages", icon: MapPin },
];

function fmtDate(d) {
  try { return new Date(d).toLocaleString(); } catch { return d; }
}

function StatusChip({ status }) {
  const o = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  return <span className={`inline-block px-2 py-1 text-[10px] uppercase tracking-wider ${o.chip}`}>{o.label}</span>;
}

function CategoryBadge({ category, subject, slug }) {
  const map = {
    service: { bg: "bg-[#DC143C]/10", text: "text-[#DC143C]", icon: Briefcase, label: "Service" },
    package: { bg: "bg-[#EAA015]/15", text: "text-[#1C3144]", icon: MapPin, label: "Package" },
    general: { bg: "bg-[#1C3144]/10", text: "text-[#1C3144]", icon: MessageSquare, label: "General" },
  };
  const s = map[category] || map.general;
  const Icon = s.icon;
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center gap-1.5 self-start px-2 py-1 text-[10px] uppercase tracking-wider ${s.bg} ${s.text}`}>
        <Icon className="w-3 h-3" /> {s.label} Enquiry
      </span>
      <p className="text-[#1C3144] font-medium text-sm">{subject}</p>
      {slug && <p className="text-[10px] text-[#4A4A4A]">/{category === "service" ? "services" : "packages"}/{slug}</p>}
    </div>
  );
}

export default function AdminLeads() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/leads", { params: { category, status, search, limit: 500 } });
      setItems(data);
    } catch {
      toast.error("Failed to load enquiries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchLeads();
}, [category, status]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected]);

  const counts = useMemo(() => {
    const c = { all: items.length, general: 0, service: 0, package: 0 };
    items.forEach((it) => { c[it.category] = (c[it.category] || 0) + 1; });
    return c;
  }, [items]);

  const updateStatus = async (id, newStatus) => {
    try {
      const { data } = await api.patch(`/admin/leads/${id}`, { status: newStatus });
      setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
      if (selected?.id === id) setSelected(data);
      toast.success(`Marked as ${newStatus.replace("_", " ")}`);
    } catch {
      toast.error("Could not update status");
    }
  };

  const saveNotes = async (id, notes) => {
    try {
      const { data } = await api.patch(`/admin/leads/${id}`, { notes });
      setItems((prev) => prev.map((it) => (it.id === id ? data : it)));
      if (selected?.id === id) setSelected(data);
      toast.success("Notes saved");
    } catch {
      toast.error("Could not save notes");
    }
  };

  const deleteLead = async (id) => {
    if (!window.confirm("Delete this enquiry permanently?")) return;
    try {
      await api.delete(`/admin/leads/${id}`);
      setItems((prev) => prev.filter((it) => it.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Could not delete");
    }
  };

  return (
    <div data-testid="admin-leads-page" className="p-8 lg:p-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <p className="overline text-[#DC143C]">Inbox</p>
          <h1 className="font-display text-4xl lg:text-5xl text-[#1C3144] mt-2">Enquiries</h1>
          <p className="text-[#4A4A4A] mt-2 text-sm">Every form submission from the website lands here with its source.</p>
        </div>
        <button
          data-testid="leads-refresh"
          onClick={fetchLeads}
          className="inline-flex items-center gap-2 px-4 py-2 border border-border text-sm text-[#1C3144] hover:bg-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORY_TABS.map((c) => {
          const Icon = c.icon;
          const active = category === c.value;
          return (
            <button
              key={c.value}
              data-testid={`leads-category-${c.value}`}
              onClick={() => setCategory(c.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-[0.2em] border ${
                active ? "bg-[#1C3144] text-white border-[#1C3144]" : "bg-white text-[#1C3144] border-border hover:border-[#1C3144]"
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              {c.label}
              <span className="ml-1 opacity-70">({counts[c.value] ?? 0})</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="flex items-center bg-white border border-border px-3 flex-1 min-w-[240px] max-w-md">
          <Search className="w-4 h-4 text-[#4A4A4A]" />
          <input
            data-testid="leads-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchLeads()}
            placeholder="Search name / email / mobile / subject"
            className="bg-transparent outline-none py-2.5 px-3 text-sm flex-1 text-[#1C3144]"
          />
          {search && (
            <button onClick={() => { setSearch(""); setTimeout(fetchLeads, 0); }} className="text-[#4A4A4A]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          data-testid="leads-status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-border px-3 py-2.5 text-sm text-[#1C3144]"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border overflow-x-auto" data-testid="leads-table">
        <table className="w-full text-sm">
          <thead className="bg-[#FAFAF8] text-[#1C3144]">
            <tr>
              <th className="text-left p-4 overline text-[10px]">When</th>
              <th className="text-left p-4 overline text-[10px]">Source</th>
              <th className="text-left p-4 overline text-[10px]">From</th>
              <th className="text-left p-4 overline text-[10px]">Contact</th>
              <th className="text-left p-4 overline text-[10px]">Status</th>
              <th className="text-right p-4 overline text-[10px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="text-center py-12 text-[#4A4A4A]">Loading enquiries…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="text-center py-12 text-[#4A4A4A]">No enquiries match these filters.</td></tr>
            )}
            {!loading && items.map((it) => (
              <tr key={it.id} data-testid={`lead-row-${it.id}`} className="border-t border-border align-top hover:bg-[#FAFAF8]/60">
                <td className="p-4 text-[#4A4A4A] whitespace-nowrap text-xs">{fmtDate(it.created_at)}</td>
                <td className="p-4 max-w-[260px]"><CategoryBadge category={it.category} subject={it.subject} slug={it.slug} /></td>
                <td className="p-4">
                  <p className="text-[#1C3144] font-medium">{it.name}</p>
                  {it.description && <p className="text-[#4A4A4A] text-xs mt-1 line-clamp-2 max-w-[220px]">{it.description}</p>}
                </td>
                <td className="p-4 text-xs space-y-1">
                  <a href={`mailto:${it.email}`} className="flex items-center gap-1.5 text-[#DC143C] hover:underline"><Mail className="w-3 h-3" />{it.email}</a>
                  <a href={`tel:${it.mobile}`} className="flex items-center gap-1.5 text-[#1C3144]"><Phone className="w-3 h-3" />{it.mobile}</a>
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20${encodeURIComponent(it.name)}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-700 hover:underline"><MessageCircle className="w-3 h-3" />WhatsApp</a>
                </td>
                <td className="p-4">
                  <select
                    data-testid={`lead-status-${it.id}`}
                    value={it.status || "new"}
                    onChange={(e) => updateStatus(it.id, e.target.value)}
                    className="bg-white border border-border px-2 py-1.5 text-xs text-[#1C3144]"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                  <div className="mt-1"><StatusChip status={it.status} /></div>
                </td>
                <td className="p-4 text-right">
                  <div className="inline-flex gap-1">
                    <button
                      data-testid={`lead-open-${it.id}`}
                      onClick={() => setSelected(it)}
                      className="px-3 py-1.5 border border-border text-xs text-[#1C3144] hover:bg-[#1C3144] hover:text-white"
                    >Open</button>
                    <button
                      data-testid={`lead-delete-${it.id}`}
                      onClick={() => deleteLead(it.id)}
                      className="p-1.5 border border-border text-[#DC143C] hover:bg-[#DC143C] hover:text-white"
                      title="Delete"
                    ><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail drawer */}
      {selected && (
        <div data-testid="lead-detail-drawer" className="fixed inset-0 z-50 bg-black/50" onClick={() => setSelected(null)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-xl bg-white border-l border-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <CategoryBadge category={selected.category} subject={selected.subject} slug={selected.slug} />
                </div>
                <button data-testid="lead-detail-close" onClick={() => setSelected(null)} className="p-2 text-[#4A4A4A] hover:text-[#1C3144]"><X className="w-5 h-5" /></button>
              </div>

              <h2 className="font-display text-3xl text-[#1C3144]">{selected.name}</h2>
              <p className="text-xs text-[#4A4A4A] mt-1">{fmtDate(selected.created_at)}</p>

              <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
                <a href={`mailto:${selected.email}`} className="flex items-center gap-2 text-[#DC143C] hover:underline"><Mail className="w-4 h-4" />{selected.email}</a>
                <a href={`tel:${selected.mobile}`} className="flex items-center gap-2 text-[#1C3144]"><Phone className="w-4 h-4" />{selected.mobile}</a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20${encodeURIComponent(selected.name)}`} target="_blank" rel="noreferrer" className="col-span-2 flex items-center gap-2 text-emerald-700 hover:underline"><MessageCircle className="w-4 h-4" />Reply on WhatsApp</a>
              </div>

              <div className="mt-8">
                <p className="overline text-[10px] text-[#4A4A4A] mb-2">Message from traveller</p>
                <div className="bg-[#FAFAF8] border border-border p-4 text-sm text-[#1C3144] whitespace-pre-wrap min-h-[80px]">
                  {selected.description || <span className="text-[#4A4A4A]">No message provided.</span>}
                </div>
              </div>

              <div className="mt-8">
                <p className="overline text-[10px] text-[#4A4A4A] mb-2">Status</p>
                <div className="flex gap-2">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s.value}
                      data-testid={`detail-status-${s.value}`}
                      onClick={() => updateStatus(selected.id, s.value)}
                      className={`px-4 py-2 text-xs uppercase tracking-wider border ${
                        (selected.status || "new") === s.value
                          ? "bg-[#1C3144] text-white border-[#1C3144]"
                          : "bg-white text-[#1C3144] border-border hover:border-[#1C3144]"
                      }`}
                    >{s.label}</button>
                  ))}
                </div>
              </div>

              <NotesField
                key={selected.id}
                initial={selected.notes || ""}
                onSave={(val) => saveNotes(selected.id, val)}
              />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function NotesField({ initial, onSave }) {
  const [val, setVal] = useState(initial);
  return (
    <div className="mt-8">
      <p className="overline text-[10px] text-[#4A4A4A] mb-2">Internal notes</p>
      <textarea
        data-testid="lead-notes-input"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        rows={4}
        placeholder="Add follow-up notes here…"
        className="w-full bg-white border border-border p-3 text-sm text-[#1C3144] outline-none focus:border-[#DC143C]"
      />
      <button
        data-testid="lead-notes-save"
        onClick={() => onSave(val)}
        className="mt-3 px-6 py-2.5 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors"
      >
        Save notes
      </button>
    </div>
  );
}
