import React from 'react';
import { Shield, Award, Building, UserCheck } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AdvisoryBoardGrid({ advisoryBoard }) {
  return (
    <section id="advisory-board" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D9A441] bg-[#D9A441]/10 px-4 py-1.5 rounded-full mb-3 border border-[#D9A441]/30">
            STRATEGIC GOVERNANCE
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-4">
            Advisory Board 2027
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Distinguished maritime captains, public sector leaders, naval architects, and port visionaries guiding the mission and technical agenda of MARPORTS GLOBAL.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisoryBoard.map((member, idx) => (
            <ScrollReveal
              key={idx}
              className="p-6 rounded-2xl bg-[#F7F5EF] border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0A1E3F] to-[#0E4B75] text-[#F0D9A0] font-serif-heading font-extrabold text-lg flex items-center justify-center mb-5 shadow-md group-hover:scale-105 transition-transform">
                  {member.initials}
                </div>
                <h3 className="font-serif-heading text-base font-bold text-[#0A1E3F] mb-2 group-hover:text-[#0E4B75] transition-colors line-clamp-2">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-[#D9A441] mb-2 leading-snug">
                  {member.designation}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 mt-4 flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                <Building className="w-3.5 h-3.5 text-[#0E4B75] shrink-0" />
                <span className="line-clamp-2">{member.company}</span>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
