import React from 'react';
import { MessageCircle } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const phoneNumber = '27681432025'; // 068 143 2025 in international format
  const message = encodeURIComponent(
    "Hi Imraan, I'm interested in Hartley Tutoring for Mathematics and Physical Sciences."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <div className="hidden md:flex flex-col items-end bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-xl border border-emerald-100 text-xs text-slate-700 animate-bounce duration-1000">
        <span className="font-semibold text-emerald-800 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Chat with Imraan Hartley
        </span>
        <span className="text-[11px] text-slate-500">Instant WhatsApp: 068 143 2025</span>
      </div>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Imraan on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-300"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full border-2 border-white"></span>
        <MessageCircle className="w-7 h-7 fill-white/20 stroke-white" />
      </a>
    </aside>
  );
};
