import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building, Sparkles, ExternalLink, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { resolveAsset } from '../utils/asset';

function SingleSponsorCard({ sponsor, size = 'default', isRegistrationArea = false }) {
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

  const isRegistration = isRegistrationArea || (sponsor.type && (/registration/i.test(sponsor.type) || /premier/i.test(sponsor.type)));

  if (isRegistration) {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-8 sm:p-10 rounded-2xl bg-white border-2 border-[#D9A441] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A441]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0E4B75]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="min-h-[140px] sm:min-h-[160px] md:min-h-[180px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Premier Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-28 sm:max-h-36 md:max-h-44 max-w-[280px] sm:max-w-[400px] md:max-w-[480px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-xl font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // If sponsor has a logo, ALWAYS show only the logo without text inside the card
  if (hasLogo) {
    const isCompact = size === 'compact';
    return (
      <CardWrapper
        {...wrapperProps}
        className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:border-[#1D63ED] group flex items-center justify-center ${
          isCompact ? 'p-4 sm:p-5 min-h-[125px] sm:min-h-[140px]' : 'p-6 sm:p-8 min-h-[160px] sm:min-h-[180px]'
        }`}
      >
        <div className={`w-full flex items-center justify-center ${isCompact ? 'h-20 sm:h-24' : 'h-24 sm:h-28'}`}>
          <img
            src={resolveAsset(sponsor.logo)}
            alt={sponsor.name}
            onError={() => setImgFailed(true)}
            className={`w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 ${
              isCompact ? 'max-h-16 sm:max-h-20 max-w-[150px]' : 'max-h-full max-w-[240px]'
            }`}
          />
        </div>
      </CardWrapper>
    );
  }

  // Fallbacks for sponsors WITHOUT a logo
  if (size === 'featured') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-8 rounded-2xl bg-white border-2 border-[#D9A441] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#D9A441]/10 rounded-full blur-2xl pointer-events-none" />

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
        <Building className="w-5 h-5 text-[#0E4B75] mb-2 group-hover:text-[#D9A441] transition-colors" />
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

  return (
    <CardWrapper
      {...wrapperProps}
      className="p-6 rounded-2xl bg-white border border-[#0E4B75]/20 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:border-[#D9A441] group flex flex-col items-center justify-center min-h-[140px]"
    >
      <Building className="w-6 h-6 text-[#0E4B75] mb-2 group-hover:text-[#D9A441] transition-colors" />
      <h4 className="font-serif-heading text-base font-bold text-[#0A1E3F]">
        {sponsor.name}
      </h4>
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

              // Check if row has both Lunch & Coffee Sponsors AND Table Top Sponsor (as in user pic)
              const lunchCoffeeSponsors = row.filter((s) => /lunch/i.test(s.type));
              const tableTopSponsors = row.filter((s) => /table\s*top/i.test(s.type));
              const isLunchAndTableTopRow = lunchCoffeeSponsors.length > 0 && tableTopSponsors.length > 0;

              if (isLunchAndTableTopRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
                      {/* Left: Lunch & Coffee Sponsors */}
                      <div className="flex flex-col">
                        <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                          Lunch & Coffee Sponsors
                        </h3>
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex-1 flex items-center justify-center gap-4 sm:gap-6 min-h-[190px]">
                          {lunchCoffeeSponsors.map((s, idx) => {
                            const Wrapper = s.website_url ? 'a' : 'div';
                            return (
                              <Wrapper
                                key={s.id || idx}
                                href={s.website_url || undefined}
                                target={s.website_url ? '_blank' : undefined}
                                rel={s.website_url ? 'noopener noreferrer' : undefined}
                                className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-4 sm:p-5 shadow-md bg-white w-full max-w-[200px] sm:max-w-[240px] h-28 sm:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                              >
                                <img
                                  src={resolveAsset(s.logo)}
                                  alt={s.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </Wrapper>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Table Top Sponsor */}
                      <div className="flex flex-col">
                        <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                          Table Top Sponsor
                        </h3>
                        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex-1 flex items-center justify-center min-h-[190px]">
                          {tableTopSponsors.map((s, idx) => {
                            const Wrapper = s.website_url ? 'a' : 'div';
                            return (
                              <Wrapper
                                key={s.id || idx}
                                href={s.website_url || undefined}
                                target={s.website_url ? '_blank' : undefined}
                                rel={s.website_url ? 'noopener noreferrer' : undefined}
                                className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-4 sm:p-6 shadow-md bg-white w-full max-w-[280px] sm:max-w-[340px] h-28 sm:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                              >
                                <img
                                  src={resolveAsset(s.logo)}
                                  alt={s.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              </Wrapper>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Check if row is purely Associate Sponsors
              const isAssociateRow = row.length > 0 && row.every((s) => /associate/i.test(s.type));
              if (isAssociateRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        Associate Sponsors
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8 min-h-[220px]">
                        {row.map((s, idx) => {
                          const Wrapper = s.website_url ? 'a' : 'div';
                          return (
                            <Wrapper
                              key={s.id || idx}
                              href={s.website_url || undefined}
                              target={s.website_url ? '_blank' : undefined}
                              rel={s.website_url ? 'noopener noreferrer' : undefined}
                              className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-5 sm:p-7 shadow-md bg-white w-full max-w-[280px] sm:max-w-[340px] h-36 sm:h-44 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                            >
                              {s.logo ? (
                                <img
                                  src={resolveAsset(s.logo)}
                                  alt={s.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-base font-bold text-[#0A1E3F] text-center">{s.name}</span>
                              )}
                            </Wrapper>
                          );
                        })}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Check if row has Promoting Organisations (or legacy Supporting Organisations)
              const isPromotingRow = row.length > 0 && row.every((s) => /promoting/i.test(s.type) || /supporting/i.test(s.type));
              if (isPromotingRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="pt-8 border-t border-gray-200 space-y-6">
                    <div className="text-center">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                        PROMOTING ORGANISATIONS
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto items-center">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} size="compact" />
                      ))}
                    </div>
                  </ScrollReveal>
                );
              }

              // Check if row has Associate Sponsors AND Promoting Organisation mixed
              const associateSponsors = row.filter((s) => /associate/i.test(s.type));
              const promotingSponsors = row.filter((s) => /promoting/i.test(s.type) || /supporting/i.test(s.type));
              const isAssociateAndPromotingRow = associateSponsors.length > 0 && promotingSponsors.length > 0;

              if (isAssociateAndPromotingRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-8">
                    {/* Associate Sponsors */}
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        Associate Sponsors
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8 min-h-[220px]">
                        {associateSponsors.map((s, idx) => {
                          const Wrapper = s.website_url ? 'a' : 'div';
                          return (
                            <Wrapper
                              key={s.id || idx}
                              href={s.website_url || undefined}
                              target={s.website_url ? '_blank' : undefined}
                              rel={s.website_url ? 'noopener noreferrer' : undefined}
                              className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-5 sm:p-7 shadow-md bg-white w-full max-w-[280px] sm:max-w-[340px] h-36 sm:h-44 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                            >
                              {s.logo ? (
                                <img
                                  src={resolveAsset(s.logo)}
                                  alt={s.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <span className="text-base font-bold text-[#0A1E3F] text-center">{s.name}</span>
                              )}
                            </Wrapper>
                          );
                        })}
                      </div>
                    </div>

                    {/* PROMOTING ORGANISATIONS */}
                    <div className="pt-8 border-t border-gray-200 space-y-6">
                      <div className="text-center">
                        <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                          PROMOTING ORGANISATIONS
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto items-center">
                        {promotingSponsors.map((s, idx) => (
                          <SingleSponsorCard key={s.id || idx} sponsor={s} size="compact" />
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Check if all sponsors in this row have the identical type
              const commonType = row.every((s) => s.type && s.type === row[0].type)
                ? row[0].type
                : null;

              const count = row.length;
              const displayBadge = commonType
                ? (count > 1 && !commonType.endsWith('s') && !commonType.endsWith('S')
                    ? `${commonType}s`
                    : commonType)
                : null;

              return (
                <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                  {displayBadge && (
                    <div className="text-center mb-5">
                      <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs ${
                        commonType === 'Premier Sponsor' || commonType === 'Registration Area Sponsor'
                          ? 'text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50'
                          : 'text-[#0E4B75] bg-[#0E4B75]/10 border-[#0E4B75]/20'
                      }`}>
                        {count === 1 || commonType === 'Premier Sponsor' || commonType === 'Registration Area Sponsor' ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                        ) : (
                          <Award className="w-3.5 h-3.5 text-[#0E4B75]" />
                        )}
                        {displayBadge}
                      </span>
                    </div>
                  )}

                  {/* Row layout depending on number of sponsors */}
                  {count === 1 && (
                    <div className="max-w-xl mx-auto">
                      <SingleSponsorCard
                        sponsor={row[0]}
                        size="featured"
                        isRegistrationArea={Boolean(commonType && (/registration/i.test(commonType) || /premier/i.test(commonType)))}
                      />
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
              {sponsors?.premier && sponsors.premier.length > 0 && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-[#D9A441]/20 border border-[#D9A441]/50 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    Premier Sponsor
                  </div>
                  <div className="max-w-xl mx-auto">
                    {sponsors.premier.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                        size="featured"
                        isRegistrationArea={true}
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {sponsors?.registration && sponsors.registration.length > 0 && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-1 bg-[#D9A441]/20 border border-[#D9A441]/50 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    Registration Area Sponsor
                  </div>
                  <div className="max-w-xl mx-auto">
                    {sponsors.registration.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                        size="featured"
                        isRegistrationArea={true}
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* Combined Lunch & Coffee + Table Top Fallback */}
              <ScrollReveal>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
                  <div className="flex flex-col">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      Lunch & Coffee Sponsors
                    </h3>
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex-1 flex items-center justify-center gap-4 sm:gap-6 min-h-[190px]">
                      {(sponsors?.lunch_coffee || []).map((s, idx) => {
                        const Wrapper = s.website_url ? 'a' : 'div';
                        return (
                          <Wrapper
                            key={idx}
                            href={s.website_url || undefined}
                            target={s.website_url ? '_blank' : undefined}
                            rel={s.website_url ? 'noopener noreferrer' : undefined}
                            className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-4 sm:p-5 shadow-md bg-white w-full max-w-[200px] sm:max-w-[240px] h-28 sm:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                          >
                            <img
                              src={resolveAsset(s.logo)}
                              alt={s.name}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </Wrapper>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      Table Top Sponsor
                    </h3>
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex-1 flex items-center justify-center min-h-[190px]">
                      {(sponsors?.table_top || []).map((s, idx) => {
                        const Wrapper = s.website_url ? 'a' : 'div';
                        return (
                          <Wrapper
                            key={idx}
                            href={s.website_url || undefined}
                            target={s.website_url ? '_blank' : undefined}
                            rel={s.website_url ? 'noopener noreferrer' : undefined}
                            className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-4 sm:p-6 shadow-md bg-white w-full max-w-[280px] sm:max-w-[340px] h-28 sm:h-36 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                          >
                            <img
                              src={resolveAsset(s.logo)}
                              alt={s.name}
                              className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </Wrapper>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Associate Sponsors Fallback */}
              {sponsors?.associate && sponsors.associate.length > 0 && (
                <ScrollReveal className="space-y-4">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      Associate Sponsors
                    </h3>
                    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8 min-h-[220px]">
                      {sponsors.associate.map((s, idx) => {
                        const Wrapper = s.website_url ? 'a' : 'div';
                        return (
                          <Wrapper
                            key={idx}
                            href={s.website_url || undefined}
                            target={s.website_url ? '_blank' : undefined}
                            rel={s.website_url ? 'noopener noreferrer' : undefined}
                            className="rounded-2xl sm:rounded-3xl border-2 border-[#1D63ED] p-5 sm:p-7 shadow-md bg-white w-full max-w-[280px] sm:max-w-[340px] h-36 sm:h-44 flex items-center justify-center transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                          >
                            {s.logo ? (
                              <img
                                src={resolveAsset(s.logo)}
                                alt={s.name}
                                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                              />
                            ) : (
                              <span className="text-base font-bold text-[#0A1E3F] text-center">{s.name}</span>
                            )}
                          </Wrapper>
                        );
                      })}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Consolidated PROMOTING ORGANISATIONS Fallback */}
              {((sponsors?.promoting && sponsors.promoting.length > 0) || (sponsors?.supporting && sponsors.supporting.length > 0)) && (
                <ScrollReveal className="pt-8 border-t border-gray-200 space-y-6">
                  <div className="text-center">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                      PROMOTING ORGANISATIONS
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-7xl mx-auto items-center">
                    {[...(sponsors?.promoting || []), ...(sponsors?.supporting || [])].map((s, idx) => (
                      <SingleSponsorCard
                        key={`promo-${idx}`}
                        sponsor={{ name: s.name, type: 'Promoting Organisation', logo: s.logo, website_url: s.website_url }}
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
