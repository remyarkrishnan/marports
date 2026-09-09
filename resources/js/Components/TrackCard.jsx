import React from 'react';
import { motion } from 'framer-motion';
import {
  Anchor,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Globe,
  TrendingUp,
  Award,
  ArrowUpRight
} from 'lucide-react';

const iconMap = {
  Anchor,
  Cpu,
  ShieldCheck,
  Zap,
  Layers,
  Globe,
  TrendingUp,
  Award,
};

export default function TrackCard({ theme, onOpenRegister, index = 0 }) {
  const IconComponent = iconMap[theme.icon] || Anchor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.215, 0.61, 0.355, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-lg hover:shadow-2xl hover:shadow-[#0A1E3F]/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Decorative Number Badge */}
      <div className="absolute top-4 right-5 font-serif-heading text-4xl sm:text-5xl font-extrabold text-[#0A1E3F]/10 group-hover:text-[#D9A441]/20 transition-colors select-none">
        {theme.number}
      </div>

      <div>
        {/* Icon Container */}
        <motion.div
          whileHover={{ rotate: 12, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A1E3F] to-[#0E4B75] p-0.5 mb-6 shadow-md"
        >
          <div className="w-full h-full bg-[#0A1E3F] rounded-[10px] flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-[#D9A441]" />
          </div>
        </motion.div>

        {/* Title & Description */}
        <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors mb-3 leading-snug">
          {theme.title}
        </h3>

        <p className="text-xs sm:text-sm text-[#17201D]/70 leading-relaxed mb-6">
          {theme.description}
        </p>
      </div>

      {/* Footer Link */}
      <div className="pt-4 border-t border-[#0A1E3F]/10 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-[#0E4B75]">
          TRACK {theme.number} SESSION
        </span>
        <button
          onClick={() => onOpenRegister('delegate')}
          className="w-8 h-8 rounded-full bg-[#F7F5EF] group-hover:bg-[#D9A441] text-[#0A1E3F] flex items-center justify-center transition-colors"
          aria-label={`Register for track ${theme.number}`}
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
