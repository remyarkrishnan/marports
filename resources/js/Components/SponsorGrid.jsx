import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Building, Sparkles, ExternalLink, Globe } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { resolveAsset } from '../utils/asset';

/**
 * Resolve the sponsor tier based on sponsor type or explicit tier string.
 * Tier hierarchy in descending order of prominence:
 * 1. strategic    - Strategic Partner (Biggest benchmark)
 * 2. gold         - Gold Sponsor (Visibly distinct step-down, ~144px max logo)
 * 3. registration - Registration Area / Badge & Lanyard Sponsor (~104px max logo)
 * 4. lunch        - Lunch & Coffee Sponsor (~80px max logo)
 * 5. tabletop     - Table Top Sponsor (~64px max logo)
 * 6. associate    - Associate Sponsor (~48px max logo)
 * 7. compact      - Promoting Organisations / Supporting Partners (~36px max logo)
 */
export function getSponsorTier(sponsor, explicitTier) {
  if (explicitTier && ['strategic', 'gold', 'premier', 'registration', 'lunch', 'tabletop', 'associate', 'compact'].includes(explicitTier)) {
    return explicitTier === 'premier' ? 'gold' : explicitTier;
  }
  const type = sponsor?.type || '';
  if (/strategic/i.test(type)) return 'strategic';
  if (/gold|premier/i.test(type)) return 'gold';
  if (/registration|badge|lanyard/i.test(type)) return 'registration';
  if (/lunch|coffee|conference/i.test(type)) return 'lunch';
  if (/table\s*top/i.test(type)) return 'tabletop';
  if (/associate/i.test(type)) return 'associate';
  if (/promoting|supporting/i.test(type)) return 'compact';
  if (explicitTier === 'compact') return 'compact';
  if (explicitTier === 'featured') return 'gold';
  return 'default';
}

/**
 * Determine the tier and size for a sponsor row based on row order (sort_order) and category name.
 * Row 1 = strategic, Row 2 = gold, Row 3 = registration, Row 4 = lunch, Row 5 = tabletop, Row 6 = associate, Row 7+ = compact.
 */
export function getTierForRow(rowOrder, type) {
  const typeStr = type || '';
  if (/strategic/i.test(typeStr)) return 'strategic';
  if (/gold|premier/i.test(typeStr)) return 'gold';
  if (/registration|badge|lanyard/i.test(typeStr)) return 'registration';
  if (/lunch|coffee|conference/i.test(typeStr)) return 'lunch';
  if (/table\s*top/i.test(typeStr)) return 'tabletop';
  if (/associate/i.test(typeStr)) return 'associate';
  if (/promoting|supporting/i.test(typeStr)) return 'compact';

  const order = Number(rowOrder) || 1;
  if (order === 1) return 'strategic';
  if (order === 2) return 'gold';
  if (order === 3) return 'registration';
  if (order === 4) return 'lunch';
  if (order === 5) return 'tabletop';
  if (order === 6) return 'associate';
  return 'compact';
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

  // 2. GOLD SPONSOR (Tier 2 - Visibly distinct step-down from Strategic Partner, noticeably larger than Tier 3)
  if (effectiveTier === 'gold' || effectiveTier === 'premier') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-6 sm:p-7 md:p-8 rounded-3xl bg-white border-2 border-[#D9A441] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D9A441]/12 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#0E4B75]/8 rounded-full blur-2xl pointer-events-none" />

        <div className="min-h-[125px] sm:min-h-[150px] md:min-h-[170px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Gold Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-24 sm:max-h-30 md:max-h-36 max-w-[240px] sm:max-w-[300px] md:max-w-[360px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
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

  // 3. REGISTRATION AREA & BADGE / LANYARD (Tier 3 - Step down from Gold Sponsor)
  if (effectiveTier === 'registration') {
    return (
      <CardWrapper
        {...wrapperProps}
        className="block p-5 sm:p-6 md:p-7 rounded-2xl bg-white border-2 border-[#D9A441]/80 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden text-center h-full flex flex-col justify-center"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#D9A441]/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#0E4B75]/5 rounded-full blur-xl pointer-events-none" />

        <div className="min-h-[110px] sm:min-h-[125px] md:min-h-[140px] flex items-center justify-center py-2">
          {hasLogo ? (
            <img
              src={resolveAsset(sponsor.logo)}
              alt={sponsor.name || 'Sponsor'}
              onError={() => setImgFailed(true)}
              className="max-h-18 sm:max-h-22 md:max-h-26 max-w-[200px] sm:max-w-[250px] md:max-w-[280px] w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105"
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

              const rowOrder = Number(row[0]?.sort_order) || (rowIdx + 1);
              const distinctCategories = Array.from(new Set(row.map((s) => s.type).filter(Boolean)));
              const isMultiCategoryRow = distinctCategories.length > 1;

              // CASE A: MULTIPLE CATEGORIES SHARING THE SAME ROW (e.g. Lunch & Coffee + Conference Session, Registration Area + Badge & Lanyard, etc.)
              if (isMultiCategoryRow) {
                const categoryGroups = distinctCategories.map((cat) => ({
                  category: cat,
                  sponsors: row.filter((s) => s.type === cat),
                  tier: getTierForRow(rowOrder, cat),
                }));

                const colCount = categoryGroups.length;

                return (
                  <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                    <div
                      className={`mx-auto items-stretch ${
                        colCount === 2
                          ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl'
                          : colCount === 3
                          ? 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl'
                          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl'
                      }`}
                    >
                      {categoryGroups.map((group, gIdx) => {
                        const isGoldOrReg =
                          /gold|premier|registration|badge|lanyard/i.test(group.category) ||
                          rowOrder <= 3;
                        const title =
                          group.sponsors.length > 1 &&
                          !group.category.endsWith('s') &&
                          !group.category.endsWith('S')
                            ? `${group.category}s`
                            : group.category;

                        return (
                          <div key={gIdx} className="flex flex-col items-center">
                            <div className="text-center mb-4">
                              <span
                                className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs ${
                                  isGoldOrReg
                                    ? 'text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50'
                                    : 'text-[#0E4B75] bg-[#1D63ED]/15 border-[#1D63ED]/40'
                                }`}
                              >
                                <Sparkles
                                  className={`w-3.5 h-3.5 ${
                                    isGoldOrReg ? 'text-[#D9A441]' : 'text-[#1D63ED]'
                                  }`}
                                />
                                {title}
                              </span>
                            </div>

                            <div
                              className={`w-full flex-1 ${
                                group.sponsors.length === 1
                                  ? 'w-full max-w-md mx-auto h-full flex flex-col justify-center'
                                  : 'grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-stretch'
                              }`}
                            >
                              {group.sponsors.map((s, idx) => (
                                <SingleSponsorCard
                                  key={s.id || idx}
                                  sponsor={s}
                                  tier={group.tier}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollReveal>
                );
              }

              // CASE B: SINGLE CATEGORY IN THIS ROW
              const categoryName = distinctCategories[0] || 'Sponsor';
              const tier = getTierForRow(rowOrder, categoryName);
              const count = row.length;
              const isGoldOrReg =
                /strategic|gold|premier|registration|badge|lanyard/i.test(categoryName) ||
                rowOrder <= 3;

              const title =
                count > 1 && !categoryName.endsWith('s') && !categoryName.endsWith('S')
                  ? `${categoryName}s`
                  : categoryName;

              return (
                <ScrollReveal key={`row-${rowIdx}`} className="space-y-4">
                  {/* Category Badge Header */}
                  <div className="text-center mb-5">
                    <span
                      className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs ${
                        tier === 'strategic'
                          ? 'text-[#0A1E3F] bg-gradient-to-r from-[#D9A441]/20 via-[#D9A441]/30 to-[#D9A441]/20 border-[#D9A441] sm:text-sm px-5 py-2'
                          : isGoldOrReg
                          ? 'text-[#0A1E3F] bg-[#D9A441]/20 border-[#D9A441]/50'
                          : 'text-[#0E4B75] bg-[#1D63ED]/15 border-[#1D63ED]/40'
                      }`}
                    >
                      <Sparkles
                        className={`w-3.5 h-3.5 ${
                          isGoldOrReg ? 'text-[#D9A441]' : 'text-[#1D63ED]'
                        }`}
                      />
                      {title}
                    </span>
                  </div>

                  {/* Sized Card Layout According to Tier */}
                  {tier === 'strategic' && (
                    <div
                      className={`mx-auto ${
                        count === 1
                          ? 'max-w-2xl'
                          : count === 2
                          ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl'
                          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'
                      }`}
                    >
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} tier="strategic" />
                      ))}
                    </div>
                  )}

                  {tier === 'gold' && (
                    <div
                      className={`mx-auto ${
                        count === 1
                          ? 'max-w-lg'
                          : count === 2
                          ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl'
                          : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl'
                      }`}
                    >
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} tier="gold" />
                      ))}
                    </div>
                  )}

                  {(tier === 'registration' || tier === 'lunch') && (
                    <div
                      className={`mx-auto ${
                        count === 1
                          ? 'max-w-md'
                          : count === 2
                          ? 'grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl'
                          : count === 3
                          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl'
                          : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl'
                      }`}
                    >
                      {row.map((s, idx) => (
                        <SingleSponsorCard key={s.id || idx} sponsor={s} tier={tier} />
                      ))}
                    </div>
                  )}

                  {tier === 'tabletop' && (
                    <div className="max-w-5xl mx-auto">
                      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-6">
                        {row.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="w-full max-w-[260px] sm:max-w-[310px] md:max-w-[330px]"
                          >
                            <SingleSponsorCard sponsor={s} tier="tabletop" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tier === 'associate' && (
                    <div className="max-w-5xl mx-auto">
                      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 flex flex-wrap items-center justify-center gap-5 sm:gap-6">
                        {row.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            className="w-full max-w-[220px] sm:max-w-[270px] md:max-w-[290px]"
                          >
                            <SingleSponsorCard sponsor={s} tier="associate" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {tier === 'compact' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4 max-w-7xl mx-auto items-center">
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

              {/* 2. Gold Sponsor Fallback */}
              {((sponsors?.gold && sponsors.gold.length > 0) || (sponsors?.premier && sponsors.premier.length > 0)) && (
                <ScrollReveal className="text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-[#D9A441]/20 border border-[#D9A441]/50 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A1E3F]">
                    <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                    {((sponsors?.gold?.length || 0) + (sponsors?.premier?.length || 0)) > 1 ? 'Gold Sponsors' : 'Gold Sponsor'}
                  </div>
                  <div className="max-w-lg mx-auto">
                    {[...(sponsors?.gold || []), ...(sponsors?.premier || [])].map((s, idx) => (
                      <SingleSponsorCard
                        key={idx}
                        sponsor={{ name: s.name, type: s.role || 'Gold Sponsor', logo: s.logo, website_url: s.website_url }}
                        tier="gold"
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

              {/* 4. Lunch & Coffee Sponsors & Conference Session Sponsor Fallback */}
              {((sponsors?.lunch_coffee && sponsors.lunch_coffee.length > 0) || (sponsors?.conference_session && sponsors.conference_session.length > 0)) && (
                <ScrollReveal className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch">
                    {/* Left: Lunch & Coffee */}
                    {sponsors?.lunch_coffee && sponsors.lunch_coffee.length > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#1D63ED]/15 border-[#1D63ED]/40">
                            <Sparkles className="w-3.5 h-3.5 text-[#1D63ED]" />
                            {sponsors.lunch_coffee.length > 1 ? 'Lunch & Coffee Sponsors' : 'Lunch & Coffee Sponsor'}
                          </span>
                        </div>
                        <div className={`w-full flex-1 ${
                          sponsors.lunch_coffee.length === 1
                            ? 'w-full max-w-md mx-auto h-full flex flex-col justify-center'
                            : 'grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-stretch'
                        }`}>
                          {sponsors.lunch_coffee.map((s, idx) => (
                            <SingleSponsorCard
                              key={idx}
                              sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                              tier="lunch"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Right: Conference Session Sponsor */}
                    {sponsors?.conference_session && sponsors.conference_session.length > 0 && (
                      <div className="flex flex-col items-center">
                        <div className="text-center mb-4">
                          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-xs text-[#0A1E3F] bg-[#1D63ED]/15 border-[#1D63ED]/40">
                            <Sparkles className="w-3.5 h-3.5 text-[#1D63ED]" />
                            {sponsors.conference_session.length > 1 ? 'Conference Session Sponsors' : 'Conference Session Sponsor'}
                          </span>
                        </div>
                        <div className={`w-full flex-1 ${
                          sponsors.conference_session.length === 1
                            ? 'w-full max-w-md mx-auto h-full flex flex-col justify-center'
                            : 'grid grid-cols-1 sm:grid-cols-2 gap-4 w-full h-full items-stretch'
                        }`}>
                          {sponsors.conference_session.map((s, idx) => (
                            <SingleSponsorCard
                              key={idx}
                              sponsor={{ name: s.name, type: s.role, logo: s.logo, website_url: s.website_url }}
                              tier="lunch"
                            />
                          ))}
                        </div>
                      </div>
                    )}
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
