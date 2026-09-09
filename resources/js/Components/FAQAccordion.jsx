import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export default function FAQAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {faqs.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.08 }}
            className={`rounded-2xl transition-all duration-300 border overflow-hidden ${
              isOpen
                ? 'bg-[#0A1E3F] border-[#D9A441]/50 text-white shadow-xl'
                : 'bg-white border-[#0A1E3F]/15 text-[#17201D] hover:border-[#0E4B75]/40'
            }`}
          >
            <button
              onClick={() => toggle(idx)}
              className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
            >
              <span className={`font-serif-heading text-base sm:text-lg font-bold ${isOpen ? 'text-[#F0D9A0]' : 'text-[#0A1E3F]'}`}>
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                  isOpen ? 'bg-[#D9A441] text-[#0A1E3F]' : 'bg-[#F7F5EF] text-[#0A1E3F]'
                }`}
              >
                {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="px-6 pb-6 text-xs sm:text-sm text-white/80 leading-relaxed border-t border-white/10 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
