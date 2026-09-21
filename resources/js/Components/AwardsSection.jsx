import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, Mail } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AwardsSection({ awardCategories, onOpenNominate }) {
  const fallbackAwardCategories = [
    { id: 1, title: 'Excellence in Port Strategy' },
    { id: 2, title: 'Excellence in Public Sector Leadership' },
    { id: 3, title: 'Excellence in Maritime Policy Affairs' },
    { id: 4, title: 'Inspiring Women Leader – Maritime' },
    { id: 5, title: 'Excellence in Business Development & Special Projects' },
    { id: 6, title: 'Young Personality of the Year – Maritime' },
    { id: 7, title: 'Best Maritime University' },
    { id: 8, title: 'Best Performing Port Authority of the Year' },
    { id: 9, title: 'Emerging Port of the Year' },
    { id: 10, title: 'Shipowner of the Year' },
    { id: 11, title: 'Port Developer of the Year' },
    { id: 12, title: 'Ship Management Company of the Year' },
    { id: 13, title: 'Ship Agency of the Year' },
    { id: 14, title: 'Shipping Line of the Year' },
    { id: 15, title: 'Emerging Maritime AI Start-up' },
    { id: 16, title: 'Excellence in Maritime Digital Media' },
    { id: 17, title: 'Excellence in Legal Maritime Affairs' },
    { id: 18, title: 'Excellence in Green Shipping Initiatives' },
    { id: 19, title: 'Leading Regional Maritime Association' },
    { id: 20, title: 'Excellence in Global Cruise Ship Management' },
    { id: 21, title: 'Global Container Terminal Operator' },
    { id: 22, title: 'Global Leader in Dredging' },
    { id: 23, title: 'Excellence in Ship Classification & Certification Services' },
    { id: 24, title: 'Icon – Global Maritime Industry' },
    { id: 25, title: 'Lifetime Achievement Award – Management' },
    { id: 26, title: 'Lifetime Achievement Award – Technical Excellence' },
    { id: 27, title: 'Lifetime Achievement Award – Maritime Services' },
    { id: 28, title: 'Lifetime Achievement Award – Entrepreneurship' },
  ];

  const categories = awardCategories && awardCategories.length > 0 ? awardCategories : fallbackAwardCategories;

  return (
    <section id="awards" className="py-24 bg-gradient-to-b from-[#0A1E3F] via-[#0E4B75] to-[#0A1E3F] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D9A441]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0A1E3F] blur-[100px] pointer-events-none" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Section Header */}
        <ScrollReveal className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 text-xs font-bold uppercase tracking-[0.25em] text-[#F0D9A0] mb-4 shadow-lg">
            <Trophy className="w-4 h-4 text-[#D9A441]" />
            MARPORTS GLOBAL 2027
          </div>
          
          <h2 className="font-serif-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Awards Categories
          </h2>

          <p className="text-xs sm:text-sm text-[#F0D9A0] font-semibold tracking-wider uppercase max-w-3xl mx-auto leading-relaxed mb-4">
            RECOGNIZING CORPORATE EXCELLENCE, INNOVATION, AND LEADERSHIP ACROSS THE GLOBAL MARITIME AND PORT ECOSYSTEM.
          </p>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            The MARPORTS GLOBAL Excellence Awards celebrate pioneering achievements and visionary leadership setting global benchmarks across ocean shipping, port logistics, and shipyard technology.
          </p>
        </ScrollReveal>

        {/* 28 Award Categories Unified Grid (No Tabs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {categories.map((award, idx) => {
            const num = (idx + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={award.id || idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.4) }}
                className="p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D9A441] backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-[#D9A441]/10 transition-all duration-300 flex items-start gap-3.5 group hover:-translate-y-0.5"
              >
                <div className="w-8 h-8 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/35 flex items-center justify-center shrink-0 text-[#D9A441] font-bold text-xs group-hover:scale-110 group-hover:bg-[#D9A441] group-hover:text-[#0A1E3F] transition-all">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0D9A0]/80 block mb-1">
                    Category #{num}
                  </span>
                  <h4 className="font-serif-heading text-sm sm:text-base font-bold text-white group-hover:text-[#F0D9A0] transition-colors leading-snug">
                    {award.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Nomination Guidance Note */}
        <ScrollReveal className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/15 max-w-4xl mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="text-left">
            <span className="text-sm font-bold text-[#F0D9A0] block mb-1">
              Award Nomination Secretariat
            </span>
            <p className="text-xs sm:text-sm text-white/75">
              Submit supporting entry dossiers and case studies for jury review to{' '}
              <a href="mailto:awards@marportsglobal.com" className="text-[#F0D9A0] hover:underline font-semibold">
                awards@marportsglobal.com
              </a>
            </p>
          </div>
          <button
            onClick={() => onOpenNominate('nominate')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all shrink-0 cursor-pointer"
          >
            Nomination Inquiry
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
