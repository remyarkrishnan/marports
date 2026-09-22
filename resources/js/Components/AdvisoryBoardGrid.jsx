import React from 'react';
import { Building, Shield, Download } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { resolveAsset } from '../utils/asset';

export default function AdvisoryBoardGrid({ advisoryBoard = [] }) {
  const fallbackAdvisoryBoard = [
    {
      id: 1,
      name: 'Cmde PR Hari, IN (Retd.)',
      designation: 'Chairman & Managing Director',
      company: 'Garden Reach Shipbuilders & Engineers Ltd (GRSE), Kolkata',
      initials: 'PRH',
      image: '/images/advisory/CMDE_PR_HARI.jpeg',
    },
    {
      id: 2,
      name: 'Biju George',
      designation: 'Director (Operations)',
      company: 'Mazagon Dock Shipbuilders Ltd',
      initials: 'BG',
      image: '/images/advisory/BIJU_GEORGE.jpeg',
    },
    {
      id: 3,
      name: 'Tijo C. Mathew',
      designation: 'GM & Head – Ports & Harbours Business Segment',
      company: 'Heavy Civil Infrastructure, Larsen & Toubro Limited',
      initials: 'TCM',
      image: '/images/advisory/TIJO_C_MATHEW.jpeg',
    },
    {
      id: 4,
      name: 'Ajay Kumar Singh',
      designation: 'Head of Section, Maritime Advisory India',
      company: 'DNV',
      initials: 'AKS',
      image: '/images/advisory/AJAY_KUMAR_SINGH.jpeg',
    },
    {
      id: 5,
      name: 'Mathew Johns',
      designation: 'Managing Director',
      company: 'Core Axis Maritime Solutions L.L.C',
      initials: 'MJ',
      image: '/images/advisory/MATHEW_JOHNS.jpeg',
    },
    {
      id: 6,
      name: 'Amlan Bora',
      designation: 'Chief Representative for South Asia',
      company: 'Port of Rotterdam Authority',
      initials: 'AB',
      image: '/images/advisory/AMLAN_BORA.jpg',
    },
    {
      id: 7,
      name: 'Niranjan Nigalye',
      designation: 'CEO & Founder',
      company: 'Nirmon Marine & Offshore Design Pvt Ltd',
      initials: 'NN',
      image: '/images/advisory/NIRANJAN_NIGALYE.jpg',
    },
    {
      id: 8,
      name: 'Dr. S. A. Sannasiraj',
      designation: 'Chair Professor, Department of Ocean Engineering',
      company: 'Indian Institute of Technology Madras (IIT Madras)',
      initials: 'SAS',
      image: '/images/advisory/DR.S.A.SANNASIRAJ.jpg',
    },
  ];

  const members = advisoryBoard && advisoryBoard.length > 0 ? advisoryBoard : fallbackAdvisoryBoard;

  return (
    <section id="advisory-board" className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D9A441] bg-[#D9A441]/10 px-4 py-1.5 rounded-full mb-3 border border-[#D9A441]/30">
            STRATEGIC GOVERNANCE
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-4">
            Panel chairs 2027
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Distinguished maritime captains, public sector leaders, naval architects, and port visionaries guiding the mission and technical agenda of MARPORTS GLOBAL.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member, idx) => {
            const memberId = member.id || (idx + 1);
            const imageUrl = member.image ? resolveAsset(member.image) : null;
            const bioUrl = resolveAsset(`/panel-chair-bio/${memberId}?print=1`);

            return (
              <ScrollReveal
                key={memberId}
                className="group relative bg-white rounded-3xl border border-[#0E4B75]/15 hover:border-[#D9A441] overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#D9A441]/10 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1.5"
              >
                {/* Corner Brackets */}
                <div className="card-decor-tl" />
                <div className="card-decor-tr" />
                <div className="card-decor-bl" />
                <div className="card-decor-br" />

                {/* Laser Scan Line */}
                <div className="card-scan-line" />

                <div>
                  {/* Member Photograph */}
                  <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={member.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.parentElement.querySelector('.initials-fallback');
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`initials-fallback w-full h-full bg-gradient-to-tr from-[#0A1E3F] to-[#0E4B75] text-[#F0D9A0] font-serif-heading font-extrabold text-2xl flex items-center justify-center ${
                        imageUrl ? 'hidden' : 'flex'
                      }`}
                    >
                      {member.initials}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A441]/40 shadow-sm">
                      Panel Chair
                    </span>
                  </div>

                  {/* Member Details */}
                  <div className="p-5">
                    <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#0A1E3F] mb-1.5 group-hover:text-[#0E4B75] transition-colors line-clamp-2 leading-snug">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#D9A441] leading-snug line-clamp-2 mb-3">
                      {member.designation}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-gray-600 font-medium">
                      <Building className="w-3.5 h-3.5 text-[#0E4B75] shrink-0" />
                      <span className="line-clamp-2 leading-tight">{member.company}</span>
                    </div>
                  </div>
                </div>

                {/* Download Bio Action Button */}
                <div className="p-4 bg-slate-50 border-t border-slate-100">
                  <a
                    href={bioUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      window.open(bioUrl, '_blank');
                    }}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0A1E3F] hover:bg-[#0E4B75] text-[#F0D9A0] hover:text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-200 group/btn"
                  >
                    <Download className="w-4 h-4 text-[#D9A441] group-hover/btn:translate-y-0.5 transition-transform" />
                    <span>Download Bio</span>
                  </a>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

