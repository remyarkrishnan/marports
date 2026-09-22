import React from 'react';
import { Anchor, Calendar, MapPin, Award } from 'lucide-react';

export default function TickerBanner() {
  const tickerText = "MARPORTS GLOBAL 2027 • CONFERENCE & EXCELLENCE AWARDS • 5 FEBRUARY 2027 • TAJ COROMANDEL, CHENNAI • ";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0A1E3F] via-[#0E4B75] to-[#0A1E3F] border-y border-[#D9A441]/40 py-3 text-white shadow-xl">
      <div className="flex whitespace-nowrap overflow-hidden marquee-fade-mask">
        <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-serif-heading tracking-widest font-bold text-[#F0D9A0]">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 shrink-0">
              <Anchor className="w-3.5 h-3.5 text-[#D9A441] drop-shadow-[0_0_8px_rgba(217,164,65,0.6)]" />
              <span>MARPORTS GLOBAL 2027</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E04E78] shadow-[0_0_6px_#E04E78]" />
              <span>CONFERENCE & EXCELLENCE AWARDS</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E04E78] shadow-[0_0_6px_#E04E78]" />
              <span className="flex items-center gap-1.5 text-white font-sans font-semibold">
                <Calendar className="w-3 h-3 text-[#D9A441]" /> 5 FEBRUARY 2027
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E04E78] shadow-[0_0_6px_#E04E78]" />
              <span className="flex items-center gap-1.5 text-white font-sans font-semibold">
                <MapPin className="w-3 h-3 text-[#D9A441]" /> TAJ COROMANDEL, CHENNAI
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E04E78] shadow-[0_0_6px_#E04E78]" />
              <Award className="w-3.5 h-3.5 text-[#D9A441] drop-shadow-[0_0_8px_rgba(217,164,65,0.6)]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
