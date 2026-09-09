import React from 'react';
import { Newspaper, Calendar, ArrowRight, ExternalLink, Sparkles, Building } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function EventsNewsSection({ onOpenRegister }) {
  const newsItems = [
    {
      id: 1,
      date: 'February 2027 Edition Announced',
      category: 'Summit Announcement',
      title: 'MARPORTS GLOBAL 2027 Scheduled for 5th February at Taj Coromandel, Chennai',
      summary: 'Following the remarkable success of the inaugural Trivandrum edition, E Hub Events announces Chennai as the host city for the 2027 international summit.',
      tag: 'Headline Event',
    },
    {
      id: 2,
      date: 'Strategic Industry Partnerships',
      category: 'Partnership',
      title: 'Mazagon Dock & Port of Rotterdam Confirmed as Key Strategic Partners',
      summary: 'Leading defense and commercial shipbuilders alongside European port leaders partner with MARPORTS GLOBAL to drive international maritime trade corridors.',
      tag: 'Industry Accord',
    },
    {
      id: 3,
      date: 'Excellence Awards 2027',
      category: 'Award Nominations',
      title: 'Call for Entries: 30 Categories Across Shipping, Ports & Shipbuilding Leadership',
      summary: 'The independent jury invites entries from global shipowners, port developers, maritime AI startups, and seasoned veterans shaping the blue economy.',
      tag: 'Awards Desk',
    },
    {
      id: 4,
      date: 'Regulatory Focus',
      category: 'Decarbonization',
      title: 'Special Focus on IMO 2030 Decarbonization Targets & Smart Port Electrification',
      summary: 'Expert panels to deliberate on green methanol bunkering, cold ironing infrastructure, and sovereign maritime cybersecurity defense.',
      tag: 'Policy & Tech',
    },
  ];

  return (
    <section id="events-news" className="py-24 bg-[#F7F5EF] relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
            <Newspaper className="w-3.5 h-3.5 text-[#0E4B75]" />
            MEDIA & PRESS RELEASES
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
            Events and News
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Stay informed with the latest announcements, speaker confirmations, partnership accords, and press releases from MARPORTS GLOBAL.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {newsItems.map((item) => (
            <ScrollReveal
              key={item.id}
              className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E4B75] bg-[#0E4B75]/10 px-3 py-1 rounded-md">
                    {item.category}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {item.date}
                  </span>
                </div>

                <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-gray-100 mt-6 flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#D9A441] uppercase tracking-wider">
                  {item.tag}
                </span>
                <button
                  onClick={() => onOpenRegister('delegate')}
                  className="text-xs font-bold text-[#0A1E3F] hover:text-[#D9A441] flex items-center gap-1 transition-colors"
                >
                  <span>Attend Summit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
