import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function SponsorGrid({ sponsors, onOpenRegister }) {
  return (
    <section id="sponsors" className="py-20 bg-[#F7F5EF] relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#0A1E3F_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
            OUR SPONSORS & PARTNERS
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-4">
            Partnering With Industry Leaders
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            Driving maritime innovation, port modernization, and sustainable global supply chains through visionary partnerships.
          </p>
        </ScrollReveal>

        <div className="space-y-12">
          {/* Tier 1: Registration Area Sponsor */}
          {sponsors.registration && sponsors.registration.length > 0 && (
            <ScrollReveal className="text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-[#D9A441]/15 border border-[#D9A441]/40 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                Registration Area Sponsor
              </div>
              <div className="max-w-xl mx-auto">
                {sponsors.registration.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl bg-white border-2 border-[#D9A441] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    <div className="text-2xl font-serif-heading font-extrabold text-[#0A1E3F] tracking-wide mb-1 group-hover:text-[#0E4B75] transition-colors">
                      {s.name}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                      {s.role}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Tier 2: Lunch & Coffee Sponsors */}
          {sponsors.lunch_coffee && sponsors.lunch_coffee.length > 0 && (
            <ScrollReveal>
              <div className="text-center mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E4B75] px-3 py-1 bg-[#0E4B75]/10 rounded-md border border-[#0E4B75]/20">
                  Lunch & Coffee Sponsors
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {sponsors.lunch_coffee.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-xl bg-white border border-[#0E4B75]/20 shadow-md hover:shadow-lg transition-all duration-300 text-center hover:border-[#D9A441]"
                  >
                    <h4 className="font-serif-heading text-lg font-bold text-[#0A1E3F] mb-1">
                      {s.name}
                    </h4>
                    <p className="text-xs font-semibold text-[#0E4B75] uppercase tracking-wider">
                      {s.role}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}

          {/* Tier 3: Table Top & Associate Sponsors */}
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {sponsors.table_top && sponsors.table_top.map((s, idx) => (
                <div
                  key={`tt-${idx}`}
                  className="p-5 rounded-xl bg-white border border-[#0E4B75]/20 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block mb-1">
                    Table Top Sponsor
                  </span>
                  <h4 className="font-serif-heading text-base font-bold text-[#0A1E3F]">
                    {s.name}
                  </h4>
                </div>
              ))}

              {sponsors.associate && sponsors.associate.map((s, idx) => (
                <div
                  key={`asc-${idx}`}
                  className="p-5 rounded-xl bg-white border border-[#0E4B75]/20 shadow-sm hover:shadow-md transition-all text-center"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E4B75] block mb-1">
                    Associate Sponsor
                  </span>
                  <h4 className="font-serif-heading text-base font-bold text-[#0A1E3F]">
                    {s.name}
                  </h4>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Tier 4: Promoting Organisation */}
          {sponsors.promoting && sponsors.promoting.length > 0 && (
            <ScrollReveal className="text-center pt-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#0E4B75] mb-3 block">
                Promoting Organisation
              </span>
              <div className="max-w-md mx-auto p-5 rounded-xl bg-white border border-[#0E4B75]/30 shadow-md">
                <div className="font-serif-heading text-xl font-bold text-[#0A1E3F]">
                  {sponsors.promoting[0].name}
                </div>
                <span className="text-xs text-[#0E4B75] font-semibold uppercase tracking-wider">
                  Global Maritime Hub
                </span>
              </div>
            </ScrollReveal>
          )}

          {/* Tier 5: Supporting Organisations */}
          {sponsors.supporting && sponsors.supporting.length > 0 && (
            <ScrollReveal className="pt-8 border-t border-gray-200">
              <div className="text-center mb-6">
                <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">
                  Supporting Organisations
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                {sponsors.supporting.map((s, idx) => (
                  <div
                    key={`sup-${idx}`}
                    className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm text-center flex flex-col items-center justify-center min-h-[90px] hover:border-[#0E4B75] transition-colors"
                  >
                    <Building className="w-5 h-5 text-[#0E4B75] mb-2" />
                    <span className="text-xs font-bold text-[#0A1E3F] leading-tight">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* Sponsor CTA Banner */}
        <ScrollReveal className="mt-16 text-center">
          <div className="p-8 rounded-2xl bg-navy-gradient text-white border border-[#D9A441]/40 shadow-xl max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="font-serif-heading text-xl font-bold text-white mb-1">
                Elevate Your Maritime Brand
              </h4>
              <p className="text-xs text-white/80">
                Showcase your solutions to senior port operators, shipowners, and policymakers.
              </p>
            </div>
            <button
              onClick={() => onOpenRegister('sponsor')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all shrink-0"
            >
              Become a Sponsor
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
