import { useState } from "react";
import { toast } from "sonner";
import { submitLead, WHATSAPP_LINK } from "@/lib/api";
import { MessageCircle, Send } from "lucide-react";

export default function LeadForm({
  subject = "General Enquiry",
  category = "general",
  slug = null,
  showWhatsApp = true,
  testIdPrefix = "lead",
  variant = "card", // card | dark
}) {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.mobile) {
      toast.error("Please fill name, email and mobile.");
      return;
    }
    try {
      setSubmitting(true);
      await submitLead({ ...form, subject, category, slug });
      toast.success("Thank you! We will contact you soon.");
      setForm({ name: "", email: "", mobile: "", description: "" });
    } catch (err) {
      toast.error("Something went wrong. Please try WhatsApp or call us.");
    } finally {
      setSubmitting(false);
    }
  };

  const isDark = variant === "dark";
  const inputCls = isDark
    ? "w-full bg-transparent border-b border-white/30 focus:border-[#EAA015] outline-none text-white placeholder:text-white/50 py-3 text-sm transition-colors"
    : "w-full bg-transparent border-b border-[#1C3144]/20 focus:border-[#DC143C] outline-none text-[#1C3144] placeholder:text-[#4A4A4A]/60 py-3 text-sm transition-colors";
  const labelCls = isDark ? "overline text-[10px] text-white/50" : "overline text-[10px] text-[#4A4A4A]";

  return (
    <div data-testid={`${testIdPrefix}-form-wrapper`}>
      <form onSubmit={handleSubmit} className="space-y-6" data-testid={`${testIdPrefix}-form`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelCls}>Your Name</label>
            <input
              data-testid={`${testIdPrefix}-input-name`}
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls}
              required
            />
          </div>
          <div>
            <label className={labelCls}>Email</label>
            <input
              data-testid={`${testIdPrefix}-input-email`}
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={inputCls}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Mobile Number</label>
          <input
            data-testid={`${testIdPrefix}-input-mobile`}
            name="mobile"
            value={form.mobile}
            onChange={handleChange}
            placeholder="+91 9580261255"
            className={inputCls}
            required
          />
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            data-testid={`${testIdPrefix}-input-description`}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Tell us about your trip — dates, travellers, preferences…"
            rows={4}
            className={inputCls + " resize-none"}
          />
        </div>

        <button
          data-testid={`${testIdPrefix}-submit`}
          type="submit"
          disabled={submitting}
          className={`inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-[0.2em] font-semibold transition-colors disabled:opacity-60 ${
            isDark
              ? "bg-[#EAA015] text-[#1C3144] hover:bg-white"
              : "bg-[#1C3144] text-white hover:bg-[#DC143C]"
          }`}
        >
          {submitting ? "Sending…" : "Send Enquiry"}
          <Send className="w-4 h-4" />
        </button>

        {showWhatsApp && (
          <p className={`text-sm pt-4 ${isDark ? "text-white/70" : "text-[#4A4A4A]"}`}>
            Either fill this form, or connect with us on WhatsApp at{" "}
            <a
              data-testid={`${testIdPrefix}-whatsapp-link`}
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-1.5 font-medium ${
                isDark ? "text-[#EAA015]" : "text-[#DC143C]"
              } hover:underline`}
            >
              <MessageCircle className="w-4 h-4" />
              +91 9580261255
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
