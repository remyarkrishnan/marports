import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building, Sparkles, ExternalLink, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

function SingleSponsorCard({ sponsor, size = 'default' }) {
  const [imgFailed, setImgFailed] = useState(false);
  const hasLogo = sponsor.logo && !imgFailed;

  const CardWrapper = sponsor.website_url ? 'a' : 'div';
  const wrapperProps = sponsor.website_url
    ? {
        href: sponsor.website_url,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  if (size === 'featured') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-8 rounded-2xl bg-white border-2 border-[#D9A441] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#D9A441]/10 rounded-full blur-2xl pointer-events-none" />

        {hasLogo && (
          <div className="mb-4 h-20 flex items-center justify-center">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              onError={() => setImgFailed(true)}
              className="max-h-full max-w-[240px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        <div className="text-2xl font-serif-heading font-extrabold text-[#0A1E3F] tracking-wide mb-2 group-hover:text-[#0E4B75] transition-colors">
          {sponsor.name}
        </div>

        {sponsor.type && (
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-[#D9A441] bg-[#D9A441]/10 px-3 py-1 rounded-full border border-[#D9A441]/30">
            {sponsor.type}
          </div>
        )}

        {sponsor.description && (
          <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
            {sponsor.description}
          </p>
        )}

        {sponsor.website_url && (
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#0E4B75] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            <Globe className="w-3.5 h-3.5" />
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </div>
        )}
      </CardWrapper>
    );
  }

  if (size === 'compact') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="p-4 rounded-xl bg-white border border-gray-200 shadow-xs hover:shadow-md text-center flex flex-col items-center justify-center min-h-[105px] hover:border-[#0E4B75] transition-all duration-200 group"
      >
        {hasLogo ? (
          <div className="h-10 w-full mb-2 flex items-center justify-center">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              onError={() => setImgFailed(true)}
              className="max-h-full max-w-[120px] object-contain transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ) : (
          <Building className="w-5 h-5 text-[#0E4B75] mb-2 group-hover:text-[#D9A441] transition-colors" />
        )}

        <span className="text-xs font-bold text-[#0A1E3F] leading-tight group-hover:text-[#0E4B75] transition-colors">
          {sponsor.name}
        </span>

        {sponsor.type && (
          <span className="mt-1 text-[10px] text-gray-500 font-medium leading-tight">
            {sponsor.type}
          </span>
        )}
      </CardWrapper>
    );
  }

  // default / medium
  return (
    <CardWrapper
      {...wrapperProps}
      className="p-6 rounded-xl bg-white border border-[#0E4B75]/20 shadow-sm hover:shadow-lg transition-all duration-300 text-center hover:border-[#D9A441] group flex flex-col justify-between"
    >
      <div>
        {hasLogo && (
          <div className="mb-4 h-14 flex items-center justify-center">
            <img
              src={sponsor.logo}
              alt={sponsor.name}
              onError={() => setImgFailed(true)}
              className="max-h-full max-w-[180px] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {sponsor.type && (
          <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#0E4B75] bg-[#0E4B75]/10 px-2.5 py-0.5 rounded-md mb-2 border border-[#0E4B75]/20">
            {sponsor.type}
          </span>
        )}

        <h4 className="font-serif-heading text-lg font-bold text-[#0A1E3F] mb-1 group-hover:text-[#0E4B75] transition-colors">
          {sponsor.name}
        </h4>

        {sponsor.description && (
          <p className="mt-2 text-xs text-gray-600 line-clamp-3">
            {sponsor.description}
          </p>
        )}
      </div>

      {sponsor.website_url && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-[#0E4B75] font-semibold opacity-80 group-hover:opacity-100 transition-opacity">
          <Globe className="w-3 h-3" />
          <span>Visit Website</span>
          <ExternalLink className="w-3 h-3" />
        </div>
      )}
    </CardWrapper>
  );
}

export default function SponsorGrid({ sponsors, onOpenRegister }) {
  // Check if sponsors is dynamic row-grouped array
  const isDynamicRows = Array.isArray(sponsors);

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
          {/* DYNAMIC ROW RENDERING: Same sort_order sponsors rendered in same row */}
          {isDynamicRows ? (
            sponsors.map((row, rowIdx) => {
              if (!Array.isArray(row) || row.length === 0) return null;

              // Check if all sponsors in this row have the identical type
              const commonType = row.every((s) => s.type && s.type === row[0].type)
                ? row[0].type
                : null;

              const count = row.length;

              return (
                <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                  {commonType && (
                    <div className="text-center mb-5">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#0E4B75] px-4 py-1.5 bg-[#0E4B75]/10 rounded-full border border-[#0E4B75]/20 shadow-xs">
                        {count === 1 ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                        ) : (
                          <Award className="w-3.5 h-3.5 text-[#0E4B75]" />
                        )}
                        {commonType}
                      </span>
                    </div>
                  )}

                  {/* Row layout depending on number of sponsors */}
                  {count === 1 && (
                    <div className="max-w-xl mx-auto">
                      <SingleSponsorCard sponsor={row[0]} size="featured" />
                    </div>
                  )}

                  {count === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} size="default" />
                      ))}
                    </div>
                  )}

                  {count === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} size="default" />
                      ))}
                    </div>
                  )}

                  {count >= 4 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} size="compact" />
                      ))}
                    </div>
                  )}
                </ScrollReveal>
              );
            })
          ) : (
            /* LEGACY FALLBACK FORMAT */
            <>
              {sponsors?.registration && sponsors.registration.length > 0 && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-[#D9A441]/15 border border-[#D9A441]/40 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    Registration Area Sponsor
                  </div>
                  <div className="max-w-xl mx-auto">
                    {sponsors.registration.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role }}
                        size="featured"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {sponsors?.lunch_coffee && sponsors.lunch_coffee.length > 0 && (
                <ScrollReveal>
                  <div className="text-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#0E4B75] px-3 py-1 bg-[#0E4B75]/10 rounded-md border border-[#0E4B75]/20">
                      Lunch & Coffee Sponsors
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                    {sponsors.lunch_coffee.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role }}
                        size="default"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {((sponsors?.table_top && sponsors.table_top.length > 0) ||
                (sponsors?.associate && sponsors.associate.length > 0)) && (
                <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {sponsors.table_top?.map((s, idx) => (
                      <SingleSponsorCard
                        key={`tt-${idx}`}
                        sponsor={{ name: s.name, type: 'Table Top Sponsor' }}
                        size="default"
                      />
                    ))}
                    {sponsors.associate?.map((s, idx) => (
                      <SingleSponsorCard
                        key={`asc-${idx}`}
                        sponsor={{ name: s.name, type: 'Associate Sponsor' }}
                        size="default"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {sponsors?.promoting && sponsors.promoting.length > 0 && (
                <ScrollReveal className="text-center pt-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#0E4B75] mb-3 block">
                    Promoting Organisation
                  </span>
                  <div className="max-w-md mx-auto">
                    <SingleSponsorCard
                      sponsor={{
                        name: sponsors.promoting[0].name,
                        type: 'Global Maritime Hub',
                      }}
                      size="default"
                    />
                  </div>
                </ScrollReveal>
              )}

              {sponsors?.supporting && sponsors.supporting.length > 0 && (
                <ScrollReveal className="pt-8 border-t border-gray-200">
                  <div className="text-center mb-6">
                    <span className="inline-block text-xs font-bold uppercase tracking-widest text-gray-600 bg-gray-100 px-4 py-1.5 rounded-full">
                      Supporting Organisations
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto">
                    {sponsors.supporting.map((s, idx) => (
                      <SingleSponsorCard
                        key={`sup-${idx}`}
                        sponsor={{ name: s.name, type: 'Supporting Organisation' }}
                        size="compact"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}
            </>
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
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all shrink-0 cursor-pointer"
            >
              Become a Sponsor
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
