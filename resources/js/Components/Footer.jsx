import React from 'react';
import { usePage } from '@inertiajs/react';
import { Mail, Phone, MapPin, Globe, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Footer({ eventDetails, onOpenRegister }) {
  const { siteLogo } = usePage().props;
  const logoUrl = siteLogo || '/new/images/logo.png';

  return (
    <footer className="bg-[#0A1E3F] text-white border-t border-[#D9A441]/30 pt-16 pb-12 relative overflow-hidden">
      {/* Top Subtle Gold Border Glow */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D9A441] to-transparent opacity-60" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-14 border-b border-white/10">
          {/* Column 1: Brand Info & Official Logo */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-2 rounded-xl border border-[#D9A441]/40 shadow-lg">
                <img src={logoUrl} alt="MARPORTS GLOBAL Official Logo" className="h-10 w-auto object-contain" />
              </div>
              <div>
                <div className="flex flex-col justify-center">
                  <span className="font-serif-heading text-lg font-bold tracking-wider text-white leading-none">
                    MARPORTS
                  </span>
                  <span className="font-serif-heading text-xs font-bold tracking-widest text-[#E04E78] leading-tight mt-0.5">
                    GLOBAL
                  </span>
                </div>
                <span className="text-[10px] tracking-[0.2em] text-[#F0D9A0]/80 uppercase block font-medium mt-1">
                  5 FEB 2027 • CHENNAI, INDIA
                </span>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed max-w-sm">
              A premium maritime forum for global leaders, port authorities, and industry innovators shaping the future of trade, sustainability and port excellence.
            </p>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 max-w-sm">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D9A441] block mb-1">
                Organized by
              </span>
              <p className="text-xs font-bold text-white mb-1">
                {eventDetails.organizer}
              </p>
              <a
                href={eventDetails.organizer_url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-[#F0D9A0] hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>www.ehub.events</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif-heading text-xs font-bold uppercase tracking-widest text-[#F0D9A0] mb-4">
              CONFERENCE
            </h4>
            <ul className="space-y-2.5 text-xs text-white/75">
              <li><a href="#about" className="hover:text-[#D9A441] transition-colors">About Marports</a></li>
              <li><a href="#topics" className="hover:text-[#D9A441] transition-colors">Conference Topics</a></li>
              <li><a href="#panels" className="hover:text-[#D9A441] transition-colors">Key Panel Discussions</a></li>
              <li><a href="#speakers-board" className="hover:text-[#D9A441] transition-colors">Speakers & Panelists</a></li>
              <li><a href="#advisory-board" className="hover:text-[#D9A441] transition-colors">Advisory Board 2027</a></li>
              <li><a href="#awards" className="hover:text-[#D9A441] transition-colors">Excellence Awards</a></li>
              <li><a href="#past-edition" className="hover:text-[#D9A441] transition-colors">2026 Highlights</a></li>
            </ul>
          </div>

          {/* Column 3: Event Information */}
          <div>
            <h4 className="font-serif-heading text-xs font-bold uppercase tracking-widest text-[#F0D9A0] mb-4">
              VENUE & DATE
            </h4>
            <div className="space-y-3 text-xs text-white/75">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                <span>Taj Coromandel, Chennai, Tamil Nadu, India</span>
              </p>
              <p className="text-white/60">
                Friday, 5th February 2027
              </p>

              <div className="pt-2">
                <button
                  onClick={() => onOpenRegister('delegate')}
                  className="text-xs font-bold text-[#F0D9A0] hover:text-white flex items-center gap-1"
                >
                  Register Now <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="font-serif-heading text-xs font-bold uppercase tracking-widest text-[#F0D9A0] mb-4">
              CONTACT SECRETARIAT
            </h4>
            <div className="space-y-2.5 text-xs text-white/75">
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9A441]" />
                <a href={`mailto:${eventDetails.email}`} className="hover:text-[#D9A441] truncate">
                  {eventDetails.email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D9A441]" />
                <a href={`mailto:${eventDetails.awards_email}`} className="hover:text-[#D9A441] truncate">
                  {eventDetails.awards_email}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D9A441]" />
                <a href={`tel:${eventDetails.phone}`} className="hover:text-[#D9A441]">
                  {eventDetails.phone}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/50 gap-4">
          <p>© 2027 MARPORTS GLOBAL. Organized by E Hub Events Private Limited.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Attendance</a>
            <a href="#" className="hover:text-white">Nomination Rules</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
