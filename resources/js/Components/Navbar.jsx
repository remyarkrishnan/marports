import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Menu, X, ChevronRight, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenRegister, menuLabels = {} }) {
  const { siteLogo } = usePage().props;
  const logoUrl = siteLogo || '/new/images/logo.png';
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Top menus strictly matching https://marportsglobal.com/
  const navLinks = [
    { slug: 'home', defaultName: 'Home', href: '#hero' },
    { slug: 'about', defaultName: 'About', href: '#about' },
    { slug: 'conference-topics', defaultName: 'Conference Topic', href: '#topics' },
    { slug: 'awards', defaultName: 'Awards', href: '#awards' },
    { slug: 'gallery', defaultName: 'Gallery', href: '#gallery' },
    { slug: 'events-news', defaultName: 'Events and News', href: '#events-news' },
    { slug: 'marports-global-2026', defaultName: 'Previous Editions', href: '#past-edition' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'py-2.5 glass-nav shadow-2xl'
          : 'py-4 bg-gradient-to-b from-[#0A1E3F]/98 via-[#0A1E3F]/85 to-transparent border-b border-[#D9A441]/20'
      }`}
    >
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Official Brand Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="bg-white p-1.5 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-300 border border-[#D9A441]/40 flex items-center justify-center">
              <img
                src={logoUrl}
                alt="MARPORTS GLOBAL Logo"
                className="h-9 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:flex flex-col justify-center">
              <span className="font-serif-heading text-sm sm:text-base font-bold tracking-wider text-white leading-none">
                MARPORTS
              </span>
              <span className="font-serif-heading text-xs font-bold tracking-widest text-[#E04E78] leading-tight mt-0.5">
                GLOBAL
              </span>
            </div>
          </a>

          {/* Desktop Navigation - Strictly the 7 Menus */}
          <nav className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => {
              const label = menuLabels[link.slug] || link.defaultName;
              return (
                <a
                  key={link.slug}
                  href={link.href}
                  className="text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-[#F0D9A0] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#D9A441] hover:after:w-full after:transition-all after:duration-300"
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* CTA & Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => onOpenRegister('sponsor')}
              className="text-xs font-semibold uppercase tracking-wider text-[#F0D9A0] hover:text-white px-3 py-2 transition-colors border border-[#D9A441]/30 rounded-lg hover:border-[#D9A441]"
            >
              Become a Sponsor
            </button>

            <button
              onClick={() => onOpenRegister('delegate')}
              className="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-xs font-bold tracking-wider text-[#0A1E3F] rounded-xl group bg-gradient-to-br from-[#D9A441] via-[#F0D9A0] to-[#E04E78] shadow-lg shadow-[#D9A441]/20 hover:shadow-[#E04E78]/30 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span className="px-4 py-2 transition-all ease-in duration-75 bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] rounded-[10px] flex items-center gap-1.5 font-bold uppercase text-[#0A1E3F]">
                <Sparkles className="w-3.5 h-3.5 text-[#0A1E3F]" />
                Register Now
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenRegister('delegate')}
              className="sm:hidden text-xs font-bold bg-[#D9A441] text-[#0A1E3F] px-3 py-1.5 rounded-lg"
            >
              Register
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/90 hover:text-[#F0D9A0] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[65px] bg-[#0A1E3F]/98 backdrop-blur-2xl border-b border-[#D9A441]/20 p-6 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[calc(100vh-70px)] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <img src={logoUrl} alt="MARPORTS GLOBAL Logo" className="h-9 w-auto bg-white p-1 rounded-lg" />
              <div>
                <span className="font-serif-heading text-lg font-bold text-white">
                  MARPORTS <span className="text-[#E04E78]">GLOBAL</span>
                </span>
                <span className="text-[10px] text-white/60 block">5 FEB 2027 • TAJ COROMANDEL, CHENNAI</span>
              </div>
            </div>

            {navLinks.map((link) => {
              const label = menuLabels[link.slug] || link.defaultName;
              return (
                <a
                  key={link.slug}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-white/90 hover:text-[#F0D9A0] flex items-center justify-between py-2 border-b border-white/5"
                >
                  {label}
                  <ChevronRight className="w-4 h-4 text-[#D9A441]" />
                </a>
              );
            })}

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister('delegate');
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-center uppercase tracking-wider shadow-lg text-xs"
              >
                Register Now
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister('sponsor');
                }}
                className="w-full py-2.5 rounded-xl border border-[#D9A441]/40 text-[#F0D9A0] font-semibold text-center uppercase text-xs"
              >
                Become a Sponsor
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
