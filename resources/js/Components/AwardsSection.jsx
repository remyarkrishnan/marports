import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Trophy, Star, ShieldCheck, Mail, CheckCircle2, ChevronRight, ArrowRight, Sparkles, Building, Briefcase, Anchor, Cpu, Compass, Users } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function AwardsSection({ awardCategories, onOpenNominate }) {
  const [activeTab, setActiveTab] = useState('All');

  const tabs = [
    'All',
    'Corporate Excellence',
    'Infrastructure',
    'Operations',
    'Manufacturing',
    'Innovation',
    'Leadership',
    'Sustainability',
    'Lifetime Achievement'
  ];

  const filteredCategories = activeTab === 'All'
    ? awardCategories
    : awardCategories.filter((c) => {
        if (activeTab === 'Manufacturing') return c.category === 'Manufacturing';
        if (activeTab === 'Innovation') return c.category === 'Innovation';
        if (activeTab === 'Leadership') return c.category === 'Leadership' || c.category === 'Diversity & Inclusion' || c.category === 'Entrepreneurship';
        if (activeTab === 'Sustainability') return c.category === 'Sustainability' || c.category === 'Corporate Responsibility';
        return c.category.toLowerCase().includes(activeTab.toLowerCase());
      });

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Corporate Excellence':
      case 'Operations':
        return <Anchor className="w-5 h-5 text-[#0E4B75]" />;
      case 'Infrastructure':
      case 'Government':
        return <Building className="w-5 h-5 text-[#0E4B75]" />;
      case 'Manufacturing':
      case 'Innovation':
      case 'Technical Innovation':
        return <Cpu className="w-5 h-5 text-[#0E4B75]" />;
      case 'Leadership':
      case 'Diversity & Inclusion':
      case 'Entrepreneurship':
        return <Users className="w-5 h-5 text-[#0E4B75]" />;
      case 'Sustainability':
      case 'Corporate Responsibility':
        return <Compass className="w-5 h-5 text-[#0E4B75]" />;
      default:
        return <Trophy className="w-5 h-5 text-[#D9A441]" />;
    }
  };

  return (
    <section id="awards" className="py-24 bg-gradient-to-b from-[#0A1E3F] via-[#0E4B75] to-[#0A1E3F] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D9A441]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#0A1E3F] blur-[100px] pointer-events-none" />

      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        {/* Main Section Header Banner */}
        <ScrollReveal className="text-center max-w-4xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D9A441]/20 border border-[#D9A441]/40 text-xs font-bold uppercase tracking-[0.25em] text-[#F0D9A0] mb-4 shadow-lg">
            <Trophy className="w-4 h-4 text-[#D9A441]" />
            AWARDS CATEGORIES
          </div>
          
          <h2 className="font-serif-heading text-4xl sm:text-6xl font-extrabold text-white mb-4 tracking-tight">
            Awards & Recognition
          </h2>

          <p className="text-xs sm:text-sm text-[#F0D9A0] font-semibold tracking-wider uppercase max-w-3xl mx-auto leading-relaxed mb-4">
            RECOGNIZING THE CORPORATE EXCELLENCE, INFRASTRUCTURE DEVELOPMENT, AND OPERATIONAL PROWESS OF LEADING COMPANIES AND INSTITUTIONS IN THE GLOBAL MARITIME SECTOR.
          </p>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto">
            The MARPORTS GLOBAL Excellence Awards celebrate pioneering achievements and leadership setting global benchmarks across ocean shipping, port logistics, and shipyard technology.
          </p>
        </ScrollReveal>

        {/* Section Sub-Heading */}
        <ScrollReveal className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/15 pb-6 mb-8 gap-4">
          <div>
            <h3 className="font-serif-heading text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-[#D9A441]" />
              Official Award Categories
            </h3>
            <p className="text-xs text-white/70 mt-1">
              Explore the 30 categories available for nomination within this edition.
            </p>
          </div>

          <span className="text-xs font-bold text-[#F0D9A0] bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
            30 Total Categories
          </span>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold shadow-lg shadow-[#D9A441]/25 scale-105'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'All' ? 'All Categories (30)' : tab}
            </button>
          ))}
        </ScrollReveal>

        {/* 30 Award Categories 3-Column Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {filteredCategories.map((award) => (
            <motion.div
              key={award.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="p-6 rounded-2xl bg-white text-[#17201D] border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-2xl transition-all duration-300 flex items-start gap-4 group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#0E4B75]/10 border border-[#0E4B75]/20 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#D9A441]/20 transition-all">
                {getCategoryIcon(award.category)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E4B75] bg-[#0E4B75]/10 px-2 py-0.5 rounded-md inline-block mb-1.5">
                  {award.category} • #{award.id}
                </span>
                <h4 className="font-serif-heading text-base font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors leading-snug">
                  {award.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Nomination Guidance Note */}
        <ScrollReveal className="p-6 rounded-2xl bg-white/5 border border-white/10 max-w-4xl mx-auto text-center flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <span className="text-xs font-bold text-[#F0D9A0] block">
              Award Nomination Secretariat
            </span>
            <p className="text-xs text-white/70">
              Submit supporting entry dossiers and case studies for jury review to awards@marportsglobal.com
            </p>
          </div>
          <button
            onClick={() => onOpenNominate('sponsor')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:shadow-lg transition-all shrink-0"
          >
            Nomination Inquiry
          </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
