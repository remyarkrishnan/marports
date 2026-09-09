import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, Camera, Award, Users, Ship, ExternalLink, X } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = ['All', 'Keynote & Panels', 'Excellence Awards', 'Networking'];

  const galleryItems = [
    {
      id: 1,
      title: 'Inaugural Keynote Address - DG Shipping & Dignitaries',
      category: 'Keynote & Panels',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
      caption: 'Inaugural address by senior government officials and maritime captains.',
    },
    {
      id: 2,
      title: 'Excellence Awards Trophy Presentation Gala',
      category: 'Excellence Awards',
      image: 'https://images.unsplash.com/photo-1531058240690-006c446962d8?auto=format&fit=crop&w=800&q=80',
      caption: 'Honoring outstanding shipowners and port authorities on stage.',
    },
    {
      id: 3,
      title: 'Executive Panel on Green Shipping & Alternative Fuels',
      category: 'Keynote & Panels',
      image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
      caption: 'Maritime leaders discussing IMO compliance, green methanol, and hydrogen.',
    },
    {
      id: 4,
      title: 'Senior Leadership Networking & VIP Luncheon',
      category: 'Networking',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=800&q=80',
      caption: 'Port directors and classification society chiefs exchanging strategies.',
    },
    {
      id: 5,
      title: 'Lifetime Achievement Award Conferment',
      category: 'Excellence Awards',
      image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
      caption: 'Recognizing decades of transformative service to ocean logistics.',
    },
    {
      id: 6,
      title: 'Smart Port Technology & Digital Twin Exhibition',
      category: 'Networking',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      caption: 'Industry delegates exploring cutting-edge automated terminal solutions.',
    },
  ];

  const filteredItems = activeCategory === 'All'
    ? galleryItems
    : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-24 bg-white relative overflow-hidden border-t border-gray-200">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
        <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
            <Camera className="w-3.5 h-3.5 text-[#0E4B75]" />
            SUMMIT GALLERY
          </span>
          <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
            Moments of Maritime Excellence
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Capturing the energy, leadership dialogues, award celebrations, and executive connections that define MARPORTS GLOBAL gatherings.
          </p>
        </ScrollReveal>

        {/* Category Tabs */}
        <ScrollReveal className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-[#0A1E3F] text-white font-bold shadow-md scale-105'
                  : 'bg-[#F7F5EF] text-gray-700 hover:bg-gray-200 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </ScrollReveal>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl overflow-hidden bg-[#F7F5EF] border border-[#0E4B75]/15 shadow-sm hover:shadow-xl hover:border-[#D9A441] transition-all duration-300 group cursor-pointer"
              onClick={() => setSelectedImage(item)}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-gray-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F]/90 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-[#0A1E3F] bg-[#F0D9A0] px-2.5 py-1 rounded-md shadow">
                  {item.category}
                </span>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h4 className="font-serif-heading text-sm sm:text-base font-bold text-white group-hover:text-[#F0D9A0] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-white/75 mt-1 line-clamp-1">
                    {item.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
              onClick={() => setSelectedImage(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-[#0A1E3F] border border-[#D9A441]/40 rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-[#D9A441] hover:text-[#0A1E3F] transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="aspect-[16/10] bg-black">
                  <img
                    src={selectedImage.image}
                    alt={selectedImage.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D9A441] block mb-1">
                    {selectedImage.category}
                  </span>
                  <h3 className="font-serif-heading text-xl font-bold text-white mb-2">
                    {selectedImage.title}
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {selectedImage.caption}
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
