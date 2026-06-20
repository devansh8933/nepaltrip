import { MessageCircle } from "lucide-react";
import { WHATSAPP_LINK } from "@/lib/api";

export default function WhatsAppFloat() {
  return (
    <a
      data-testid="whatsapp-float"
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366]/40 animate-ping" />
      <span className="relative flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-full shadow-lg hover:scale-105 transition-transform">
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">WhatsApp</span>
      </span>
    </a>
  );
}
