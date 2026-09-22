import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AwardsSection({ awardCategories, onOpenNominate }) {
  const sliderRef = useRef(null);
  const [viewMode, setViewMode] = useState('slider'); // 'slider' or 'grid'

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

  const scrollSlider = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 340 * 2;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section id="awards" className="py-24 bg-gradient-to-b from-[#0A1E3F] via-[#0E4B75] to-[#0A1E3F] text-white relative overflow-hidden">
      {/* Background Ambient Floating Glows */}
      <div className="absolute top-1/4 left-1/4 w-[650px] h-[650px] bg-[#D9A441]/10 blur-[130px] rounded-full pointer-events-none ambient-orb-float-1" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-[#0E4B75]/40 blur-[140px] rounded-full pointer-events-none ambient-orb-float-2" />
      <div className="absolute inset-0 tech-grid-dark pointer-events-none opacity-40" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Section Header */}
        <ScrollReveal className="text-center max-w-4xl mx-auto mb-12">
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

        {/* Controls Bar (Slider Navigation & View Toggle) */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#F0D9A0]">
            <Award className="w-4 h-4 text-[#D9A441]" />
            <span>{categories.length} Official Excellence Categories</span>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setViewMode('slider')}
                title="Carousel View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'slider'
                    ? 'bg-[#D9A441] text-[#0A1E3F] shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#D9A441] text-[#0A1E3F] shadow-md'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* Slider Navigation Arrows */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollSlider('left')}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D9A441] border border-white/15 hover:border-[#D9A441] text-white hover:text-[#0A1E3F] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Previous categories"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollSlider('right')}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#D9A441] border border-white/15 hover:border-[#D9A441] text-white hover:text-[#0A1E3F] flex items-center justify-center transition-all duration-300 shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  aria-label="Next categories"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Categories Display (Slider or Grid) */}
        {viewMode === 'slider' ? (
          <div
            ref={sliderRef}
            className="flex gap-5 overflow-x-auto pb-6 scrollbar-none snap-x snap-mandatory scroll-smooth no-scrollbar"
          >
            {categories.map((award, idx) => {
              const num = (idx + 1).toString().padStart(2, '0');
              return (
                <div
                  key={award.id || idx}
                  className="group relative flex-shrink-0 w-[310px] sm:w-[340px] snap-start p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D9A441] backdrop-blur-md shadow-xl hover:shadow-[#D9A441]/20 transition-all duration-400 flex flex-col justify-between overflow-hidden cursor-pointer"
                >
                  {/* Glowing Radial Light on Hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 bg-[radial-gradient(circle_at_50%_100%,rgba(217,164,65,0.2)_0%,transparent_75%)] pointer-events-none" />

                  {/* Corner Brackets */}
                  <div className="card-decor-tl" />
                  <div className="card-decor-tr" />
                  <div className="card-decor-bl" />
                  <div className="card-decor-br" />

                  {/* Scan Line Sweep */}
                  <div className="card-scan-line" />

                  {/* Top: Star Badge and Outline Number */}
                  <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/40 flex items-center justify-center text-[#D9A441] group-hover:bg-[#D9A441] group-hover:text-[#0A1E3F] transition-all duration-300 group-hover:scale-105">
                      <Star className="w-5 h-5 fill-current group-hover:animate-star-rotate" />
                    </div>
                    <span className="outline-stroke-number text-3xl font-black">
                      #{num}
                    </span>
                  </div>

                  {/* Middle: Title */}
                  <div className="relative z-10 mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#F0D9A0]/80 block mb-1">
                      Official Category
                    </span>
                    <h4 className="font-serif-heading text-lg font-bold text-white group-hover:text-[#F0D9A0] transition-colors leading-snug">
                      {award.title}
                    </h4>
                  </div>

                  {/* Bottom: Accent Bar & Action */}
                  <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="card-accent-bar" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 group-hover:text-[#F0D9A0] transition-colors">
                      Nominate →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
                  className="group relative p-5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D9A441] backdrop-blur-sm shadow-md hover:shadow-xl hover:shadow-[#D9A441]/15 transition-all duration-300 flex items-start gap-3.5 overflow-hidden hover:-translate-y-0.5"
                >
                  <div className="card-decor-tl" />
                  <div className="card-decor-tr" />
                  <div className="card-scan-line" />
                  <div className="w-8 h-8 rounded-xl bg-[#D9A441]/15 border border-[#D9A441]/35 flex items-center justify-center shrink-0 text-[#D9A441] font-bold text-xs group-hover:scale-110 group-hover:bg-[#D9A441] group-hover:text-[#0A1E3F] transition-all">
                    <Star className="w-4 h-4 fill-current group-hover:animate-star-rotate" />
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
        )}

        {/* Nomination Guidance Note */}
        <ScrollReveal className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/15 max-w-4xl mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden group">
          <div className="card-scan-line" />
          <div className="text-left relative z-10">
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
            className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#F0D9A0] to-[#D9A441] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:shadow-lg hover:shadow-[#D9A441]/30 transition-all shrink-0 cursor-pointer relative z-10 hover:-translate-y-0.5"
          >
            Nomination Inquiry
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}

