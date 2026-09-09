import React from 'react';
import { Anchor, Calendar, MapPin, Award } from 'lucide-react';

export default function TickerBanner() {
  const tickerText = "MARPORTS GLOBAL 2027 • CONFERENCE & EXCELLENCE AWARDS • 5 FEBRUARY 2027 • TAJ COROMANDEL, CHENNAI • ";

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#0A1E3F] via-[#0E4B75] to-[#0A1E3F] border-y border-[#D9A441]/40 py-3 text-white shadow-lg">
      <div className="flex whitespace-nowrap overflow-hidden">
        <div className="animate-marquee flex items-center gap-8 text-xs sm:text-sm font-serif-heading tracking-widest font-bold text-[#F0D9A0]">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="flex items-center gap-4 shrink-0">
              <Anchor className="w-3.5 h-3.5 text-[#D9A441]" />
              <span>MARPORTS GLOBAL 2027</span>
              <span className="text-[#E04E78]">•</span>
              <span>CONFERENCE & EXCELLENCE AWARDS</span>
              <span className="text-[#E04E78]">•</span>
              <span className="flex items-center gap-1.5 text-white font-sans font-semibold">
                <Calendar className="w-3 h-3 text-[#D9A441]" /> 5 FEBRUARY 2027
              </span>
              <span className="text-[#E04E78]">•</span>
              <span className="flex items-center gap-1.5 text-white font-sans font-semibold">
                <MapPin className="w-3 h-3 text-[#D9A441]" /> TAJ COROMANDEL, CHENNAI
              </span>
              <span className="text-[#E04E78]">•</span>
              <Award className="w-3.5 h-3.5 text-[#D9A441]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
