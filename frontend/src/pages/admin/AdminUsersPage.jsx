import { useEffect, useState } from "react";
import { api, useAuth, formatApiError } from "@/lib/api";
import { toast } from "sonner";
import { UserPlus, Trash2, KeyRound, ShieldCheck } from "lucide-react";

export default function AdminUsersPage() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [submitting, setSubmitting] = useState(false);
  const [resetFor, setResetFor] = useState(null);
  const [resetPassword, setResetPassword] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch {
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const addUser = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Email and password required");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/admin/users", form);
      toast.success(`Admin ${form.email} added`);
      setForm({ email: "", password: "", name: "" });
      fetchUsers();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not add admin");
    } finally {
      setSubmitting(false);
    }
  };

  const removeUser = async (u) => {
    if (!window.confirm(`Remove admin ${u.email}?`)) return;
    try {
      await api.delete(`/admin/users/${u.id}`);
      toast.success("Admin removed");
      fetchUsers();
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not remove");
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    if (!resetPassword || resetPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      await api.patch(`/admin/users/${resetFor.id}/password`, { password: resetPassword });
      toast.success("Password updated");
      setResetFor(null);
      setResetPassword("");
    } catch (err) {
      toast.error(formatApiError(err.response?.data?.detail) || "Could not update");
    }
  };

  return (
    <div data-testid="admin-users-page" className="p-8 lg:p-12">
      <div className="mb-10">
        <p className="overline text-[#DC143C]">Team</p>
        <h1 className="font-display text-4xl lg:text-5xl text-[#1C3144] mt-2">Admin Users</h1>
        <p className="text-[#4A4A4A] mt-2 text-sm">
          Add new admins, reset passwords, or remove access. Anyone with an account here can sign in at <code className="text-[#DC143C]">/admin/login</code>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add admin form */}
        <div className="lg:col-span-1 bg-white border border-border p-6 lg:p-8 h-fit lg:sticky lg:top-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-10 h-10 grid place-items-center bg-[#1C3144] text-white">
              <UserPlus className="w-4 h-4" />
            </span>
            <h2 className="font-display text-xl text-[#1C3144]">Add new admin</h2>
          </div>
          <form onSubmit={addUser} className="space-y-5" data-testid="add-admin-form">
            <div>
              <label className="overline text-[10px] text-[#4A4A4A]">Email</label>
              <input
                data-testid="new-admin-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="newadmin@example.com"
                required
                className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
              />
            </div>
            <div>
              <label className="overline text-[10px] text-[#4A4A4A]">Display name (optional)</label>
              <input
                data-testid="new-admin-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Devansh"
                className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
              />
            </div>
            <div>
              <label className="overline text-[10px] text-[#4A4A4A]">Password (min 6 chars)</label>
              <input
                data-testid="new-admin-password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="strong password"
                required
                className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
              />
            </div>
            <button
              data-testid="add-admin-submit"
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-8 py-4 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C] transition-colors disabled:opacity-60"
            >
              {submitting ? "Adding…" : "Add admin"}
            </button>
          </form>
        </div>

        {/* Users list */}
        <div className="lg:col-span-2 bg-white border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] text-[#1C3144]">
              <tr>
                <th className="text-left p-4 overline text-[10px]">Email</th>
                <th className="text-left p-4 overline text-[10px]">Name</th>
                <th className="text-left p-4 overline text-[10px]">Added</th>
                <th className="text-right p-4 overline text-[10px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={4} className="text-center py-12 text-[#4A4A4A]">Loading…</td></tr>
              )}
              {!loading && users.length === 0 && (
                <tr><td colSpan={4} className="text-center py-12 text-[#4A4A4A]">No admins yet.</td></tr>
              )}
              {!loading && users.map((u) => {
                const isMe = u.id === me?.id;
                return (
                  <tr key={u.id} data-testid={`admin-user-row-${u.id}`} className="border-t border-border hover:bg-[#FAFAF8]/60">
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-[#1C3144] font-medium">
                        <ShieldCheck className="w-4 h-4 text-[#DC143C]" />
                        {u.email}
                        {isMe && <span className="text-[10px] uppercase tracking-wider bg-[#EAA015]/20 text-[#1C3144] px-2 py-0.5">you</span>}
                      </div>
                    </td>
                    <td className="p-4 text-[#4A4A4A]">{u.name || "—"}</td>
                    <td className="p-4 text-xs text-[#4A4A4A]">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          data-testid={`reset-pw-${u.id}`}
                          onClick={() => { setResetFor(u); setResetPassword(""); }}
                          className="px-3 py-1.5 border border-border text-xs text-[#1C3144] hover:bg-[#1C3144] hover:text-white inline-flex items-center gap-1"
                          title="Reset password"
                        >
                          <KeyRound className="w-3.5 h-3.5" /> Reset
                        </button>
                        <button
                          data-testid={`delete-admin-${u.id}`}
                          onClick={() => removeUser(u)}
                          disabled={isMe}
                          className="p-1.5 border border-border text-[#DC143C] hover:bg-[#DC143C] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#DC143C]"
                          title={isMe ? "You can't remove yourself" : "Remove admin"}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset password modal */}
      {resetFor && (
        <div data-testid="reset-pw-modal" className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-6" onClick={() => setResetFor(null)}>
          <form
            onSubmit={submitReset}
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-md p-8"
          >
            <p className="overline text-[#DC143C] text-[10px] mb-2">Reset password</p>
            <h3 className="font-display text-2xl text-[#1C3144] mb-6">{resetFor.email}</h3>
            <label className="overline text-[10px] text-[#4A4A4A]">New password</label>
            <input
              data-testid="reset-pw-input"
              type="password"
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
              required
              minLength={6}
              autoFocus
              className="w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none py-3 text-sm text-[#1C3144]"
            />
            <div className="flex gap-2 mt-8">
              <button type="button" onClick={() => setResetFor(null)} className="flex-1 px-6 py-3 border border-border text-xs uppercase tracking-[0.2em] text-[#1C3144] hover:bg-[#FAFAF8]">Cancel</button>
              <button data-testid="reset-pw-submit" type="submit" className="flex-1 px-6 py-3 bg-[#1C3144] text-white text-xs uppercase tracking-[0.2em] hover:bg-[#DC143C]">Save</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
