import React, { useRef, useState, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  Star,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Building,
  ShieldCheck,
  Mic,
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { resolveAsset } from '../utils/asset';
import { advisoryBoard2026, speakers2026 } from '../data/edition2026Data';

function MemberSliderCard({ member, roleBadgeColor = 'navy' }) {
  const imageUrl = member.image ? resolveAsset(member.image) : null;
  const pdfUrl = member.pdf ? resolveAsset(member.pdf) : null;

  return (
    <div className="w-[280px] sm:w-[320px] flex-shrink-0 bg-white rounded-3xl border border-[#0E4B75]/15 hover:border-[#D9A441] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* Photograph */}
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100">
          {imageUrl && (
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
          )}

          <div
            className={`initials-fallback w-full h-full bg-gradient-to-tr from-[#0A1E3F] to-[#0E4B75] text-[#F0D9A0] font-serif-heading font-extrabold text-3xl flex items-center justify-center ${
              imageUrl ? 'hidden' : 'flex'
            }`}
          >
            {member.initials}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

          {/* Role Badge */}
          <span className="absolute top-3.5 left-3.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#D9A441]/40 shadow-sm">
            {member.role || 'Member'}
          </span>
        </div>

        {/* Member Details */}
        <div className="p-5 sm:p-6">
          <h3 className="font-serif-heading text-base sm:text-lg font-bold text-[#0A1E3F] mb-1.5 group-hover:text-[#0E4B75] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {member.name}
          </h3>

          <p className="text-xs font-bold text-[#D9A441] uppercase tracking-wide leading-snug line-clamp-2 mb-2.5 min-h-[2rem]">
            {member.designation}
          </p>

          {member.company ? (
            <div className="flex items-start gap-2 text-[11px] text-gray-600 font-medium min-h-[2.25rem]">
              <Building className="w-3.5 h-3.5 text-[#0E4B75] shrink-0 mt-0.5" />
              <span className="line-clamp-2 leading-tight">{member.company}</span>
            </div>
          ) : (
            <div className="min-h-[2.25rem]" />
          )}
        </div>
      </div>

      {/* Action Footer: Download Bio */}
      <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100">
        <a
          href={pdfUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (pdfUrl) {
              e.preventDefault();
              window.open(pdfUrl, '_blank');
            }
          }}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0A1E3F] hover:bg-[#0E4B75] text-[#F0D9A0] hover:text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-200 group/btn cursor-pointer"
        >
          <Download className="w-4 h-4 text-[#D9A441] group-hover/btn:translate-y-0.5 transition-transform" />
          <span>Download Bio</span>
        </a>
      </div>
    </div>
  );
}

function HorizontalSliderSection({
  title,
  badgeText,
  badgeIcon: BadgeIcon,
  countText,
  description,
  members,
}) {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true });
      window.addEventListener('resize', checkScroll);
      return () => {
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [members]);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div className="mt-16">
      {/* Slider Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#0E4B75] bg-[#0E4B75]/10 px-3.5 py-1.5 rounded-full mb-2.5 border border-[#0E4B75]/20">
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-[#0E4B75]" />}
            <span>{badgeText}</span>
            {countText && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#0E4B75] text-[#F0D9A0] text-[10px]">
                {countText}
              </span>
            )}
          </div>
          <h3 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F]">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mt-1 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Scroll Controls (Arrows) */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous items"
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollLeft
                ? 'bg-white border-gray-300 text-[#0A1E3F] hover:bg-[#0A1E3F] hover:text-[#F0D9A0] hover:border-[#0A1E3F] shadow-sm active:scale-95'
                : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            aria-label="Next items"
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-200 ${
              canScrollRight
                ? 'bg-white border-gray-300 text-[#0A1E3F] hover:bg-[#0A1E3F] hover:text-[#F0D9A0] hover:border-[#0A1E3F] shadow-sm active:scale-95'
                : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed opacity-50'
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Scrollable Slider */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth select-none focus:outline-none"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {members.map((member) => (
          <div key={member.id} style={{ scrollSnapAlign: 'start' }}>
            <MemberSliderCard member={member} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PastEditionSection({ pastEdition }) {
  return (
    <section id="past-edition" className="py-20 bg-[#F7F5EF] relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Section Header */}
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

        {/* Edition Highlights & Distinguished Guests */}
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

        {/* 1. Advisory Board 2026 Horizontal Slider */}
        <ScrollReveal>
          <HorizontalSliderSection
            title="Advisory Board 2026"
            badgeText="Advisory Board 2026"
            badgeIcon={ShieldCheck}
            countText={`${advisoryBoard2026.length}`}
            description="Meet the esteemed advisory council whose visionary leadership and governance shaped the foundation of MARPORTS GLOBAL 2026."
            members={advisoryBoard2026}
          />
        </ScrollReveal>

        {/* 2. Panelists & Moderators 2026 Horizontal Slider */}
        <ScrollReveal>
          <HorizontalSliderSection
            title="Panelists & Moderators 2026"
            badgeText="Panelists & Moderators 2026"
            badgeIcon={Mic}
            countText={`${speakers2026.length}`}
            description="Eminent keynote speakers, maritime dignitaries, and panelists who delivered masterclasses and thought-provoking sessions."
            members={speakers2026}
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
