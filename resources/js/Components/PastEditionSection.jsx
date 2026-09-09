import React from 'react';
import { Calendar, MapPin, Award, CheckCircle2, Users, Star, ArrowUpRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PastEditionSection({ pastEdition }) {
  return (
    <section id="past-edition" className="py-20 bg-[#F7F5EF] relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
            HERITAGE & TRACK RECORD
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-4">
            MARPORTS GLOBAL 2026 Edition
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Reliving the inaugural milestone gathering in Trivandrum that united Indian government authorities, global classification societies, and maritime industry icons.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
          {/* Left Column: Edition Overview */}
          <ScrollReveal className="lg:col-span-5 p-8 rounded-3xl bg-navy-gradient text-white border border-[#D9A441]/30 shadow-xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 text-xs font-bold text-[#F0D9A0]">
              <Star className="w-3.5 h-3.5 text-[#D9A441]" />
              Inaugural Edition Highlights
            </div>

            <div>
              <h3 className="font-serif-heading text-2xl font-bold text-white mb-2">
                {pastEdition.edition}
              </h3>
              <div className="space-y-2 text-xs text-white/80">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D9A441]" />
                  <span>{pastEdition.date}</span>
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D9A441]" />
                  <span>{pastEdition.venue}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-white/75 leading-relaxed">
              {pastEdition.summary}
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-[#F0D9A0] font-semibold">Organized by E Hub Events</span>
              <span className="text-xs text-white/60">Trivandrum Chapter</span>
            </div>
          </ScrollReveal>

          {/* Right Column: Notable Dignitaries & Speakers */}
          <ScrollReveal className="lg:col-span-7 space-y-4">
            <h4 className="font-serif-heading text-lg font-bold text-[#0A1E3F] mb-3">
              Distinguished Guests & Dignitaries
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {pastEdition.notable_guests.map((guest, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:border-[#D9A441] transition-all flex items-start gap-3"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-gray-800 leading-snug">
                    {guest}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[#0E4B75]/5 border border-[#0E4B75]/20 text-xs text-[#0E4B75] mt-4 flex items-center gap-2">
              <Users className="w-4 h-4 shrink-0 text-[#0E4B75]" />
              <span>Attended by over 300+ C-level delegates representing ports, shipyards, classification societies, and maritime academies.</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
