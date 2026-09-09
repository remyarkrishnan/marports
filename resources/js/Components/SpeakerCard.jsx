import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Share2, ExternalLink, Sparkles, X, ChevronRight } from 'lucide-react';

export default function SpeakerCard({ speaker, onOpenRegister, index = 0 }) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
        whileHover={{ y: -8 }}
        className="group relative bg-[#0A1E3F]/90 backdrop-blur-xl rounded-2xl border border-[#D9A441]/20 p-5 overflow-hidden shadow-xl hover:border-[#D9A441]/70 hover:shadow-2xl hover:shadow-[#D9A441]/15 flex flex-col justify-between transition-all duration-300"
      >
        {/* Glowing Top Edge Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#D9A441] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div>
          {/* Speaker Portrait Image */}
          <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-5 bg-[#0E4B75]">
            <motion.img
              src={speaker.image}
              alt={speaker.name}
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F] via-transparent to-transparent opacity-90" />
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3 bg-[#0A1E3F]/90 border border-[#D9A441]/40 px-3 py-1 rounded-full text-[11px] font-bold text-[#F0D9A0] tracking-wider uppercase backdrop-blur-md">
              {speaker.category}
            </div>
          </div>

          {/* Speaker Info */}
          <h3 className="font-serif-heading text-xl font-bold text-white group-hover:text-[#F0D9A0] transition-colors mb-1">
            {speaker.name}
          </h3>
          <p className="text-xs font-semibold text-[#D9A441] mb-2 uppercase tracking-wide">
            {speaker.designation} • <span className="text-white/80">{speaker.company}</span>
          </p>
          <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-4">
            {speaker.topic}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => setModalOpen(true)}
            className="text-xs font-bold text-[#F0D9A0] hover:text-white flex items-center gap-1.5 transition-colors group/btn"
          >
            <span>View Executive Bio</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center gap-2 text-white/50">
            <a href="#" className="hover:text-[#D9A441] transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#" className="hover:text-[#D9A441] transition-colors" aria-label="External Link">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Speaker Bio Modal with AnimatePresence */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative w-full max-w-2xl bg-[#0A1E3F] border border-[#D9A441]/50 rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden z-10"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-[#D9A441]/60 shrink-0"
                />
                <div>
                  <span className="inline-block bg-[#0E4B75] text-[#F0D9A0] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full mb-2 border border-[#D9A441]/30">
                    {speaker.category} Keynote Speaker
                  </span>
                  <h2 className="font-serif-heading text-2xl font-bold text-[#F0D9A0]">
                    {speaker.name}
                  </h2>
                  <p className="text-sm font-semibold text-white/90">
                    {speaker.designation}
                  </p>
                  <p className="text-xs text-[#D9A441] font-medium">
                    {speaker.company}
                  </p>
                </div>
              </div>

              <div className="mb-6 bg-white/5 p-4 rounded-xl border border-white/10">
                <h4 className="text-xs font-bold text-[#D9A441] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Keynote Presentation Topic
                </h4>
                <p className="text-sm font-semibold text-white">{speaker.topic}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">
                  Executive Biography & Impact
                </h4>
                <p className="text-sm text-white/80 leading-relaxed">
                  {speaker.bio}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => {
                    setModalOpen(false);
                    onOpenRegister('delegate');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#D9A441] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider hover:bg-[#F0D9A0] transition-colors shadow-lg"
                >
                  Book Pass to Hear {speaker.name.split(' ')[0]}
                </button>

                <button
                  onClick={() => setModalOpen(false)}
                  className="text-xs text-white/60 hover:text-white"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
