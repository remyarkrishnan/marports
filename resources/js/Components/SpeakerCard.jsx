import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, ExternalLink } from 'lucide-react';
import { resolveAsset } from '../utils/asset';

export default function SpeakerCard({ speaker, index = 0 }) {
  const imageUrl = resolveAsset(speaker.image);
  const bioUrl = `/speaker-bio/${speaker.id}?print=1`;

  const handleDownloadBio = (e) => {
    // Open printable bio PDF directly in new tab/window
    window.open(bioUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group bg-white rounded-3xl border border-[#0E4B75]/15 hover:border-[#D9A441] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Photograph */}
        <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={speaker.name}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />
          
          {/* Role Badge (Keynote / Moderator / Panelist) */}
          <span className="absolute top-4 left-4 text-[11px] font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F]/90 backdrop-blur-md px-3 py-1 rounded-full border border-[#D9A441]/40 shadow-sm">
            {speaker.role || 'Speaker'}
          </span>

          {/* LinkedIn Icon Badge on Image (if available) */}
          {speaker.linkedin && (
            <a
              href={speaker.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              title={`Connect with ${speaker.name} on LinkedIn`}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#0077b5] text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-[#005582] transition-all duration-200 z-10"
              aria-label={`${speaker.name} LinkedIn Profile`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
          )}
        </div>

        {/* Details: Photograph, Name, Designation, Company ONLY */}
        <div className="p-6">
          <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors mb-1.5 leading-snug">
            {speaker.name}
          </h3>
          
          {/* Designation */}
          <p className="text-xs font-bold text-[#D9A441] uppercase tracking-wide mb-1">
            {speaker.designation}
          </p>
          
          {/* Company */}
          <p className="text-sm text-gray-700 font-semibold leading-snug">
            {speaker.company}
          </p>
        </div>
      </div>

      {/* Action Footer: Download Bio + LinkedIn Button */}
      <div className="p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Download Bio Button */}
        <a
          href={bioUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            e.preventDefault();
            handleDownloadBio(e);
          }}
          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0A1E3F] hover:bg-[#0E4B75] text-[#F0D9A0] hover:text-white text-xs font-bold uppercase tracking-wider shadow-sm hover:shadow transition-all duration-200 group/btn"
        >
          <Download className="w-4 h-4 text-[#D9A441] group-hover/btn:translate-y-0.5 transition-transform" />
          <span>Download Bio</span>
        </a>

        {/* LinkedIn Connect Button (if available) */}
        {speaker.linkedin && (
          <a
            href={speaker.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title="Connect on LinkedIn"
            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-[#0077b5]/30 bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-all duration-200"
            aria-label="LinkedIn Profile"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
          </a>
        )}
      </div>
    </motion.div>
  );
}
