import React from 'react';
import { Calendar, Mail, Building, ArrowRight, ExternalLink, Sparkles, Phone, Hotel, MapPin } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ReadyToJoinSection({ eventDetails, onOpenRegister }) {
  return (
    <section id="contact" className="py-24 bg-[#F7F5EF] relative overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Dark Container Box matching marportsglobal.com */}
        <ScrollReveal className="rounded-3xl bg-[#0A1E3F] border border-[#D9A441]/30 shadow-2xl p-8 sm:p-14 lg:p-16 relative overflow-hidden text-white">
          {/* Ambient Background Gradient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0E4B75]/40 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-[130px] pointer-events-none" />

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-12 relative z-10">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#F0D9A0] bg-[#F0D9A0]/10 px-4 py-1.5 rounded-full mb-3 border border-[#D9A441]/30">
              READY TO JOIN US?
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
              Ready to Join Us?
            </h2>
            <p className="text-xs sm:text-base text-white/75 font-medium leading-relaxed">
              Register now or contact us for sponsorship opportunities
            </p>
          </div>

          {/* Cards Grid: Top Row (2 Cards) + Bottom Row (1 Full Width Card) */}
          <div className="space-y-6 max-w-5xl mx-auto relative z-10">
            {/* Top Row: 2 Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Registration */}
              <div
                onClick={() => onOpenRegister('delegate')}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D9A441] hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0E4B75]/30 border border-[#0E4B75]/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Calendar className="w-6 h-6 text-[#F0D9A0]" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-white mb-2 group-hover:text-[#F0D9A0] transition-colors">
                    Registration
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    Secure your place at the premier maritime event of 2027
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F0D9A0]">
                  <span>Register as Delegate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Card 2: Contact Us */}
              <div
                onClick={() => onOpenRegister('sponsor')}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D9A441] hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0E4B75]/30 border border-[#0E4B75]/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Mail className="w-6 h-6 text-[#F0D9A0]" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-white mb-2 group-hover:text-[#F0D9A0] transition-colors">
                    Contact Us
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
                    For sponsorship inquiries and event information
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-[#F0D9A0]">
                  <span>Sponsorship Inquiries</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            {/* Bottom Row: 1 Card Spanning Full Width */}
            <div
              onClick={() => onOpenRegister('delegate')}
              className="p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-[#D9A441] hover:bg-white/10 transition-all duration-300 cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-6"
            >
              <div className="flex items-start sm:items-center gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#0E4B75]/30 border border-[#0E4B75]/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Hotel className="w-6 h-6 text-[#F0D9A0]" />
                </div>
                <div>
                  <h3 className="font-serif-heading text-xl font-bold text-white mb-1 group-hover:text-[#F0D9A0] transition-colors">
                    Accommodation
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                    For hotel stay support and special room-rate assistance
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold text-[#F0D9A0] shrink-0 sm:pt-0 pt-2 border-t sm:border-t-0 border-white/10">
                <span>Taj Coromandel, Chennai</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
