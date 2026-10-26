import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building, Sparkles, ExternalLink, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { resolveAsset } from '../utils/asset';

/**
 * Resolve the sponsor tier based on sponsor type or explicit tier string.
 * Tier hierarchy in descending order of prominence:
 * 1. strategic   - Strategic Partner (Biggest)
 * 2. premier     - Premier Sponsor
 * 3. registration - Registration Area / Badge & Lanyard Sponsor
 * 4. lunch       - Lunch & Coffee Sponsor
 * 5. tabletop    - Table Top Sponsor
 * 6. associate   - Associate Sponsor
 * 7. compact     - Promoting Organisations / Supporting Partners (Smallest)
 */
export function getSponsorTier(sponsor, explicitTier) {
  if (explicitTier && ['strategic', 'premier', 'registration', 'lunch', 'tabletop', 'associate', 'compact'].includes(explicitTier)) {
    return explicitTier;
  }
  const type = sponsor?.type || '';
  if (/strategic/i.test(type)) return 'strategic';
  if (/premier/i.test(type)) return 'premier';
  if (/registration|badge|lanyard/i.test(type)) return 'registration';
  if (/lunch|coffee/i.test(type)) return 'lunch';
  if (/table\s*top/i.test(type)) return 'tabletop';
  if (/associate/i.test(type)) return 'associate';
  if (/promoting|supporting/i.test(type)) return 'compact';
  if (explicitTier === 'compact') return 'compact';
  if (explicitTier === 'featured') return 'premier';
  return 'default';
}

function SingleSponsorCard({ sponsor, tier, size = 'default', isRegistrationArea = false }) {
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

  const effectiveTier = isRegistrationArea ? 'registration' : getSponsorTier(sponsor, tier || size);

  // 1. STRATEGIC PARTNER (Tier 1 - Biggest sponsor, current size is benchmark)
  if (effectiveTier === 'strategic') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-8 sm:p-10 md:p-12 rounded-3xl bg-white border-2 border-[#D9A441] shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-44 h-44 bg-[#D9A441]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#0E4B75]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="min-h-[160px] sm:min-h-[200px] md:min-h-[240px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Strategic Partner'}
              onError={() => setImgFailed(true)}
              className="max-h-36 sm:max-h-48 md:max-h-56 max-w-[280px] sm:max-w-[420px] md:max-w-[480px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-2xl font-serif-heading font-extrabold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 2. PREMIER SPONSOR (Tier 2 - Visibly second largest, noticeably larger than Registration/Badge)
  if (effectiveTier === 'premier') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-7 sm:p-9 md:p-10 rounded-3xl bg-white border-2 border-[#D9A441] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#D9A441]/12 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#0E4B75]/8 rounded-full blur-2xl pointer-events-none" />

        <div className="min-h-[145px] sm:min-h-[175px] md:min-h-[205px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Premier Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-30 sm:max-h-38 md:max-h-44 max-w-[260px] sm:max-w-[360px] md:max-w-[420px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-xl sm:text-2xl font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 3. REGISTRATION AREA & BADGE / LANYARD (Tier 3 - Step down from Premier)
  if (effectiveTier === 'registration') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-6 sm:p-7 md:p-8 rounded-2xl bg-white border-2 border-[#D9A441]/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-[#D9A441]/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-[#0E4B75]/5 rounded-full blur-xl pointer-events-none" />

        <div className="min-h-[125px] sm:min-h-[145px] md:min-h-[165px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-24 sm:max-h-30 md:max-h-34 max-w-[230px] sm:max-w-[300px] md:max-w-[340px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-lg sm:text-xl font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 4. LUNCH & COFFEE SPONSORS (Tier 4 - Step down from Registration Area)
  if (effectiveTier === 'lunch') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white border-2 border-[#1D63ED]/80 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center hover:border-[#1D63ED]"
      >
        <div className="min-h-[105px] sm:min-h-[120px] md:min-h-[135px] flex items-center justify-center py-1.5">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Lunch & Coffee Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-20 sm:max-h-24 md:max-h-28 max-w-[210px] sm:max-w-[260px] md:max-w-[290px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-base sm:text-lg font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 5. TABLE TOP SPONSORS (Tier 5 - Visibly smaller than Lunch & Coffee)
  if (effectiveTier === 'tabletop') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#1D63ED]/60 shadow-xs hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center hover:border-[#1D63ED]"
      >
        <div className="min-h-[90px] sm:min-h-[105px] md:min-h-[115px] flex items-center justify-center py-1.5">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Table Top Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-16 sm:max-h-20 md:max-h-22 max-w-[190px] sm:max-w-[230px] md:max-w-[250px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-sm sm:text-base font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 6. ASSOCIATE SPONSORS (Tier 6 - Visibly smaller than Table Top)
  if (effectiveTier === 'associate') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-300 shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 group relative overflow-hidden text-center h-full flex flex-col justify-center hover:border-[#0E4B75]"
      >
        <div className="min-h-[75px] sm:min-h-[85px] md:min-h-[95px] flex items-center justify-center py-1">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Associate Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-12 sm:max-h-15 md:max-h-17 max-w-[160px] sm:max-w-[190px] md:max-w-[210px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="text-xs sm:text-sm font-serif-heading font-bold text-[#0A1E3F]">
              {sponsor.name}
            </div>
          )}
        </div>
      </CardWrapper>
    );
  }

  // 7. COMPACT / PROMOTING ORGANISATIONS (Tier 7 - Base tier, most compact)
  if (effectiveTier === 'compact') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="p-3 sm:p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-all duration-200 text-center flex items-center justify-center min-h-[80px] sm:min-h-[90px] hover:border-[#0E4B75] group w-full"
      >
        <div className="h-10 sm:h-12 w-full flex items-center justify-center">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Promoting Organisation'}
              onError={() => setImgFailed(true)}
              className="max-h-9 sm:max-h-11 md:max-h-12 max-w-[105px] sm:max-w-[125px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="text-[11px] font-bold text-[#0A1E3F] leading-tight group-hover:text-[#0E4B75] transition-colors">
              {sponsor.name}
            </span>
          )}
        </div>
      </CardWrapper>
    );
  }

  // Fallback default
  return (
    <CardWrapper
      {...wrapperProps}
      className="p-5 sm:p-6 rounded-2xl bg-white border border-[#0E4B75]/20 shadow-sm hover:shadow-xl transition-all duration-300 text-center hover:border-[#D9A441] group flex flex-col items-center justify-center min-h-[120px]"
    >
      <div className="min-h-[80px] flex items-center justify-center w-full">
        {hasLogo ? (
          <img
            src={resolveAsset(sponsor.logo)}
            alt={sponsor.name}
            onError={() => setImgFailed(true)}
            className="max-h-16 sm:max-h-20 max-w-[180px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <h4 className="font-serif-heading text-sm sm:text-base font-bold text-[#0A1E3F]">
            {sponsor.name}
          </h4>
        )}
      </div>
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

              // Tier 1: Strategic Partner (rendered with highest distinction & biggest size)
              const isStrategicRow = row.length > 0 && row.every((s) => /strategic/i.test(s.type));
              if (isStrategicRow) {
                const count = row.length;
                const title = count > 1 ? 'Strategic Partners' : 'Strategic Partner';
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="text-center mb-5">
                      <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest px-5 py-2 rounded-full border shadow-sm text-[#0A1E3F] bg-gradient-to-r from-[#D9A441]/20 via-[#D9A441]/30 to-[#D9A441]/20 border-[#D9A441]">
                        <Sparkles className="w-4 h-4 text-[#D9A441]" />
                        {title}
                      </span>
                    </div>

                    <div className={`mx-auto ${
                      count === 1
                        ? 'max-w-2xl'
                        : count === 2
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'
                    }`}>
                      {row.map((s, idx) => (
                        <SingleSponsorCard
                          key={s.id || idx}
                          sponsor={s}
                          tier="strategic"
                        />
                      ))}
                    </div>
                  </ScrollReveal>
                );
              }

              // Tier 2: Premier Sponsor (second biggest tier)
              const isPremierRow = row.length > 0 && row.every((s) => /premier/i.test(s.type));
              if (isPremierRow) {
                const count = row.length;
                const title = count > 1 ? 'Premier Sponsors' : 'Premier Sponsor';
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="text-center mb-5">
                      <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50">
                        <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                        {title}
                      </span>
                    </div>

                    <div className={`mx-auto ${
                      count === 1
                        ? 'max-w-xl'
                        : count === 2
                        ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl'
                        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'
                    }`}>
                      {row.map((s, idx) => (
                        <SingleSponsorCard
                          key={s.id || idx}
                          sponsor={s}
                          tier="premier"
                        />
                      ))}
                    </div>
                  </ScrollReveal>
                );
              }

              // Tier 3: Registration Area Sponsor AND Badge & Lanyard Sponsor
              const regAreaSponsors = row.filter((s) => /registration/i.test(s.type));
              const badgeLanyardSponsors = row.filter((s) => /badge|lanyard/i.test(s.type));
              const otherInRegRow = row.filter((s) => !/registration/i.test(s.type) && !/badge|lanyard/i.test(s.type));
              const isRegAndBadgeRow = regAreaSponsors.length > 0 && badgeLanyardSponsors.length > 0;

              if (isRegAndBadgeRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                      {/* Left: Registration Area Sponsor */}
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50">
                            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                            {regAreaSponsors.length > 1 ? 'Registration Area Sponsors' : (regAreaSponsors[0]?.type || 'Registration Area Sponsor')}
                          </span>
                        </div>
                        <div className="w-full flex-1 flex flex-col justify-center">
                          {regAreaSponsors.map((s, idx) => (
                            <SingleSponsorCard
                              key={s.id || idx}
                              sponsor={s}
                              tier="registration"
                            />
                          ))}
                        </div>
                      </div>

                      {/* Right: Badge and Lanyard Sponsor */}
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50">
                            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                            {badgeLanyardSponsors.length > 1 ? 'Badge & Lanyard Sponsors' : (badgeLanyardSponsors[0]?.type || 'Badge & Lanyard Sponsor')}
                          </span>
                        </div>
                        <div className="w-full flex-1 flex flex-col justify-center">
                          {badgeLanyardSponsors.map((s, idx) => (
                            <SingleSponsorCard
                              key={s.id || idx}
                              sponsor={s}
                              tier="registration"
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {otherInRegRow.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 max-w-5xl mx-auto">
                        {otherInRegRow.map((s, idx) => (
                          <SingleSponsorCard key={s.id || idx} sponsor={s} tier="registration" />
                        ))}
                      </div>
                    )}
                  </ScrollReveal>
                );
              }

              // Check if row has both Lunch & Coffee Sponsors AND Table Top Sponsor
              const lunchCoffeeSponsors = row.filter((s) => /lunch/i.test(s.type));
              const tableTopSponsors = row.filter((s) => /table\s*top/i.test(s.type));
              const otherInLunchRow = row.filter((s) => !/lunch/i.test(s.type) && !/table\s*top/i.test(s.type));
              const isLunchAndTableTopRow = lunchCoffeeSponsors.length > 0 && tableTopSponsors.length > 0;

              if (isLunchAndTableTopRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-10">
                    {/* Lunch & Coffee Sponsors */}
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        {lunchCoffeeSponsors.length > 1 ? 'Lunch & Coffee Sponsors' : 'Lunch & Coffee Sponsor'}
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {lunchCoffeeSponsors.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[390px]">
                            <SingleSponsorCard sponsor={s} tier="lunch" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Table Top Sponsor */}
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        {tableTopSponsors.length > 1 ? 'Table Top Sponsors' : 'Table Top Sponsor'}
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6">
                        {tableTopSponsors.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[260px] sm:max-w-[310px] md:max-w-[330px]">
                            <SingleSponsorCard sponsor={s} tier="tabletop" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {otherInLunchRow.length > 0 && (
                      <div className="flex flex-wrap items-center justify-center gap-6 pt-4 max-w-5xl mx-auto">
                        {otherInLunchRow.map((s, idx) => (
                          <SingleSponsorCard key={s.id || idx} sponsor={s} />
                        ))}
                      </div>
                    )}
                  </ScrollReveal>
                );
              }

              // Tier 4: Pure Lunch & Coffee Sponsors row
              const isPureLunchRow = row.length > 0 && row.every((s) => /lunch/i.test(s.type));
              if (isPureLunchRow) {
                const count = row.length;
                const title = count > 1 ? 'Lunch & Coffee Sponsors' : 'Lunch & Coffee Sponsor';
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        {title}
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        {row.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[390px]">
                            <SingleSponsorCard sponsor={s} tier="lunch" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Tier 5: Pure Table Top Sponsors row (visibly smaller than Lunch & Coffee)
              const isPureTableTopRow = row.length > 0 && row.every((s) => /table\s*top/i.test(s.type));
              if (isPureTableTopRow) {
                const count = row.length;
                const title = count > 1 ? 'Table Top Sponsors' : 'Table Top Sponsor';
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        {title}
                      </h3>
                      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6">
                        {row.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[260px] sm:max-w-[310px] md:max-w-[330px]">
                            <SingleSponsorCard sponsor={s} tier="tabletop" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Tier 6: Pure Associate Sponsors row (visibly smaller than Table Top)
              const isAssociateRow = row.length > 0 && row.every((s) => /associate/i.test(s.type));
              if (isAssociateRow) {
                const count = row.length;
                const title = count > 1 ? 'Associate Sponsors' : 'Associate Sponsor';
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div className="max-w-5xl mx-auto">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                        {title}
                      </h3>
                      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                        {row.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[220px] sm:max-w-[270px] md:max-w-[290px]">
                            <SingleSponsorCard sponsor={s} tier="associate" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Tier 7: Pure Promoting Organisations (most compact)
              const isPromotingRow = row.length > 0 && row.every((s) => /promoting/i.test(s.type) || /supporting/i.test(s.type));
              if (isPromotingRow) {
                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="pt-8 border-t border-gray-200 space-y-6">
                    <div className="text-center">
                      <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                        {row.length > 1 ? 'PROMOTING ORGANISATIONS' : 'PROMOTING ORGANISATION'}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 max-w-7xl mx-auto items-center">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} tier="compact" />
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
                        {associateSponsors.length > 1 ? 'Associate Sponsors' : 'Associate Sponsor'}
                      </h3>
                      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                        {associateSponsors.map((s, idx) => (
                          <div key={s.id || idx} className="w-full max-w-[220px] sm:max-w-[270px] md:max-w-[290px]">
                            <SingleSponsorCard sponsor={s} tier="associate" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PROMOTING ORGANISATIONS */}
                    <div className="pt-8 border-t border-gray-200 space-y-6">
                      <div className="text-center">
                        <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                          {promotingSponsors.length > 1 ? 'PROMOTING ORGANISATIONS' : 'PROMOTING ORGANISATION'}
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 max-w-7xl mx-auto items-center">
                        {promotingSponsors.map((s, idx) => (
                          <SingleSponsorCard key={s.id || idx} sponsor={s} tier="compact" />
                        ))}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // General row fallback for custom types/counts
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
                        commonType && (/registration/i.test(commonType) || /premier/i.test(commonType) || /badge|lanyard/i.test(commonType))
                          ? 'text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50'
                          : 'text-[#0E4B75] bg-[#0E4B75]/10 border-[#0E4B75]/20'
                      }`}>
                        {count === 1 || (commonType && (/registration/i.test(commonType) || /premier/i.test(commonType) || /badge|lanyard/i.test(commonType))) ? (
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
                      />
                    </div>
                  )}

                  {count === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                      {row.map((s, idx) => {
                        const isFeaturedTier = s.type && (/registration/i.test(s.type) || /premier/i.test(s.type) || /badge|lanyard/i.test(s.type));
                        return (
                          <div key={s.id || idx} className="flex flex-col items-center">
                            {!commonType && s.type && (
                              <div className="text-center mb-4">
                                <span className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs ${
                                  isFeaturedTier
                                    ? 'text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50'
                                    : 'text-[#0E4B75] bg-[#0E4B75]/10 border-[#0E4B75]/20'
                                }`}>
                                  {isFeaturedTier ? (
                                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                                  ) : (
                                    <Award className="w-3.5 h-3.5 text-[#0E4B75]" />
                                  )}
                                  {s.type}
                                </span>
                              </div>
                            )}
                            <div className="w-full flex-1 flex flex-col justify-center">
                              <SingleSponsorCard sponsor={s} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {count === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} />
                      ))}
                    </div>
                  )}

                  {count === 4 && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} />
                      ))}
                    </div>
                  )}

                  {count >= 5 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} tier="compact" />
                      ))}
                    </div>
                  )}
                </ScrollReveal>
              );
            })
          ) : (
            /* LEGACY FALLBACK FORMAT WITH PROPER TIER HIERARCHY */
            <>
              {/* 1. Strategic Partner */}
              {sponsors?.strategic && sponsors.strategic.length > 0 && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-5 py-2 bg-gradient-to-r from-[#D9A441]/20 via-[#D9A441]/30 to-[#D9A441]/20 border border-[#D9A441] rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0A1E3F] shadow-sm">
                    <Sparkles className="w-4 h-4 text-[#D9A441]" />
                    Strategic Partner
                  </div>
                  <div className="max-w-2xl mx-auto">
                    {sponsors.strategic.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role || 'Strategic Partner', logo: s.logo, website_url: s.website_url }}
                        tier="strategic"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* 2. Premier Sponsor */}
              {sponsors?.premier && sponsors.premier.length > 0 && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-[#D9A441]/20 border border-[#D9A441]/50 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    Premier Sponsor
                  </div>
                  <div className="max-w-xl mx-auto">
                    {sponsors.premier.map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                        tier="premier"
                      />
                    ))}
                  </div>
                </ScrollReveal>
              )}

              {/* 3. Registration Area Sponsor & Badge and Lanyard Sponsor Fallback */}
              {((sponsors?.registration && sponsors.registration.length > 0) || (sponsors?.badge_lanyard && sponsors.badge_lanyard.length > 0)) && (
                <ScrollReveal className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                    {/* Left: Registration Area Sponsor */}
                    {sponsors?.registration && sponsors.registration.length > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50">
                            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                            Registration Area Sponsor
                          </span>
                        </div>
                        <div className="w-full flex-1 flex flex-col justify-center">
                          {sponsors.registration.map((s, idx) => (
                            <SingleSponsorCard
                              key={idx}
                              sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                              tier="registration"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right: Badge and Lanyard Sponsor */}
                    {sponsors?.badge_lanyard && sponsors.badge_lanyard.length > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50">
                            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                            Badge and Lanyard Sponsor
                          </span>
                        </div>
                        <div className="w-full flex-1 flex flex-col justify-center">
                          {sponsors.badge_lanyard.map((s, idx) => (
                            <SingleSponsorCard
                              key={idx}
                              sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                              tier="registration"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              )}

              {/* 4. Lunch & Coffee Sponsors Fallback */}
              {sponsors?.lunch_coffee && sponsors.lunch_coffee.length > 0 && (
                <ScrollReveal className="space-y-4">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      {sponsors.lunch_coffee.length > 1 ? 'Lunch & Coffee Sponsors' : 'Lunch & Coffee Sponsor'}
                    </h3>
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                      {sponsors.lunch_coffee.map((s, idx) => (
                        <div key={idx} className="w-full max-w-[300px] sm:max-w-[360px] md:max-w-[390px]">
                          <SingleSponsorCard
                            sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                            tier="lunch"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* 5. Table Top Sponsor Fallback */}
              {sponsors?.table_top && sponsors.table_top.length > 0 && (
                <ScrollReveal className="space-y-4">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      {sponsors.table_top.length > 1 ? 'Table Top Sponsors' : 'Table Top Sponsor'}
                    </h3>
                    <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6">
                      {sponsors.table_top.map((s, idx) => (
                        <div key={idx} className="w-full max-w-[260px] sm:max-w-[310px] md:max-w-[330px]">
                          <SingleSponsorCard
                            sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                            tier="tabletop"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* 6. Associate Sponsors Fallback */}
              {sponsors?.associate && sponsors.associate.length > 0 && (
                <ScrollReveal className="space-y-4">
                  <div className="max-w-5xl mx-auto">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] text-center mb-4">
                      Associate Sponsors
                    </h3>
                    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                      {sponsors.associate.map((s, idx) => (
                        <div key={idx} className="w-full max-w-[220px] sm:max-w-[270px] md:max-w-[290px]">
                          <SingleSponsorCard
                            sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                            tier="associate"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* 7. Consolidated PROMOTING ORGANISATIONS Fallback */}
              {((sponsors?.promoting && sponsors.promoting.length > 0) || (sponsors?.supporting && sponsors.supporting.length > 0)) && (
                <ScrollReveal className="pt-8 border-t border-gray-200 space-y-6">
                  <div className="text-center">
                    <h3 className="font-serif-heading text-lg sm:text-xl font-bold text-[#0A1E3F] tracking-wider uppercase mb-2">
                      PROMOTING ORGANISATIONS
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 max-w-7xl mx-auto items-center">
                    {[...(sponsors?.promoting || []), ...(sponsors?.supporting || [])].map((s, idx) => (
                      <SingleSponsorCard
                        key={`promo-${idx}`}
                        sponsor={{ name: s.name, type: 'Promoting Organisation', logo: s.logo, website_url: s.website_url }}
                        tier="compact"
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
