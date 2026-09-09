import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Anchor,
  Globe,
  Ship,
  Compass,
  Cpu,
  Layers,
  Award,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

import Navbar from '../Components/Navbar';
import TickerBanner from '../Components/TickerBanner';
import HeroCanvas from '../Components/HeroCanvas';
import ScrollReveal from '../Components/ScrollReveal';
import SponsorGrid from '../Components/SponsorGrid';
import AdvisoryBoardGrid from '../Components/AdvisoryBoardGrid';
import AwardsSection from '../Components/AwardsSection';
import GallerySection from '../Components/GallerySection';
import EventsNewsSection from '../Components/EventsNewsSection';
import PastEditionSection from '../Components/PastEditionSection';
import ReadyToJoinSection from '../Components/ReadyToJoinSection';
import Footer from '../Components/Footer';
import RegistrationModal from '../Components/RegistrationModal';

export default function Home({
  eventDetails,
  conferenceTopics,
  panelDiscussions,
  speakers,
  advisoryBoard,
  sponsors,
  participatingOrganizations,
  awardCategories,
  pastEdition2026,
  contentOverrides = {},
  menuLabels = {},
}) {
  const { siteLogo } = usePage().props;
  const logoUrl = siteLogo || '/new/images/logo.png';
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalType, setModalType] = useState('delegate');
  const [liveMenuLabels, setLiveMenuLabels] = useState(menuLabels || {});

  const handleOpenRegister = (type = 'delegate') => {
    setModalType(type);
    setRegisterModalOpen(true);
  };

  useEffect(() => {
    // Helper: generate consistent DOM path
    const getDomPath = (el) => {
      if (!el || el === document.body) return '';
      let path = '';
      let curr = el;
      while (curr && curr !== document.body && curr !== document.documentElement) {
        const parent = curr.parentElement;
        if (!parent) break;
        const index = Array.from(parent.children).indexOf(curr);
        const tag = curr.tagName.toLowerCase();
        path = `${tag}:${index}` + (path ? '/' + path : '');
        curr = parent;
      }
      return 'text:path:' + path;
    };

    // Helper: find element by path
    const findByDomPath = (path) => {
      if (!path || !path.startsWith('text:path:')) return null;
      const parts = path.replace('text:path:', '').split('/');
      let curr = document.body;
      for (const part of parts) {
        if (!part) continue;
        const [tag, idxStr] = part.split(':');
        const idx = parseInt(idxStr, 10);
        if (!curr || !curr.children || !curr.children[idx]) return null;
        curr = curr.children[idx];
      }
      return curr;
    };

    function applyOverrideToElement(path, data) {
      const el = findByDomPath(path);
      if (!el || !data) return;
      if (data.text !== undefined) {
        el.innerText = data.text;
      }
      if (data.color) el.style.color = data.color;
      if (data.bold !== undefined) el.style.fontWeight = data.bold ? 'bold' : 'normal';
      if (data.italic !== undefined) el.style.fontStyle = data.italic ? 'italic' : 'normal';
      if (data.underline !== undefined) el.style.textDecoration = data.underline ? 'underline' : 'none';
      if (data.align) el.style.textAlign = data.align;
      if (data.href && el.tagName.toLowerCase() === 'a') el.setAttribute('href', data.href);
      if (data.target && el.tagName.toLowerCase() === 'a') el.setAttribute('target', data.target);
    }

    // Apply saved overrides on load
    if (contentOverrides && Object.keys(contentOverrides).length > 0) {
      Object.entries(contentOverrides).forEach(([path, data]) => {
        applyOverrideToElement(path, data);
      });
    }

    const isStudio = typeof window !== 'undefined' && window.location.search.includes('live_studio=1');
    if (!isStudio) return;

    // Helper: Scroll smoothly to a section ID and highlight it
    const scrollToSectionId = (rawId) => {
      if (!rawId || rawId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const idMap = {
        'board-2026': 'advisory-board',
        'news': 'events-news',
        'advisory-board-2026': 'advisory-board',
        'events-news': 'events-news',
        'marports-global-2026': 'past-edition',
        'conference-topics': 'topics',
        'topics': 'topics',
        'about': 'about',
        'gallery': 'gallery',
        'hero': 'hero',
        'awards': 'awards',
      };
      const resolved = idMap[rawId] || rawId;
      const targetElement = document.getElementById(resolved) || document.querySelector(`[id*="${resolved}"]`);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        targetElement.style.transition = 'box-shadow 0.6s ease';
        targetElement.style.boxShadow = '0 0 0 4px rgba(168, 85, 247, 0.4)';
        setTimeout(() => {
          targetElement.style.boxShadow = '';
        }, 3000);
      }
    };

    // Auto-scroll on initial load based on URL parameters or anchor hash
    const urlParams = new URLSearchParams(window.location.search);
    const targetHash = urlParams.get('target_hash') || window.location.hash.replace('#', '');
    const targetSec = urlParams.get('section');
    const scrollTarget = targetHash || targetSec;
    if (scrollTarget) {
      setTimeout(() => {
        scrollToSectionId(scrollTarget);
      }, 400);
    }

    let selectedEl = null;

    // Highlight on hover
    const handleMouseOver = (e) => {
      const target = e.target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, li, img');
      if (!target || target === selectedEl) return;
      target.style.outline = '2px dashed #06b6d4';
      target.style.outlineOffset = '2px';
      target.style.cursor = 'pointer';
    };

    const handleMouseOut = (e) => {
      const target = e.target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, li, img');
      if (!target || target === selectedEl) return;
      target.style.outline = '';
      target.style.outlineOffset = '';
      target.style.cursor = '';
    };

    // Click to select
    const handleClick = (e) => {
      const target = e.target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, li, img');
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      if (selectedEl) {
        selectedEl.style.outline = '';
        selectedEl.style.outlineOffset = '';
      }

      selectedEl = target;
      selectedEl.style.outline = '3px solid #a855f7';
      selectedEl.style.outlineOffset = '3px';

      const computed = window.getComputedStyle(target);
      const path = getDomPath(target);
      const tag = target.tagName.toLowerCase();
      const text = tag === 'img' ? '' : (target.innerText || target.textContent || '');
      const color = computed.color;
      const bold = parseInt(computed.fontWeight, 10) >= 600 || computed.fontWeight === 'bold';
      const italic = computed.fontStyle === 'italic';
      const underline = computed.textDecorationLine?.includes('underline') || computed.textDecoration?.includes('underline');
      const align = computed.textAlign || 'left';
      const href = target.getAttribute('href') || '';
      const targetAttr = target.getAttribute('target') || '_self';
      const src = tag === 'img' ? (target.getAttribute('src') || '') : '';
      const alt = tag === 'img' ? (target.getAttribute('alt') || '') : '';

      window.parent.postMessage(
        {
          type: 'ELEMENT_SELECTED',
          payload: {
            path,
            tag,
            text,
            color,
            bold,
            italic,
            underline,
            align,
            href,
            target: targetAttr,
            src,
            alt,
          },
        },
        '*'
      );
    };

    // Message handler from studio parent
    const handleStudioMessage = (event) => {
      const msg = event.data;
      if (!msg || typeof msg !== 'object') return;

      if (msg.type === 'UPDATE_ELEMENT') {
        const { path, field, value } = msg.payload;
        let el = selectedEl;
        if (!el || getDomPath(el) !== path) {
          el = findByDomPath(path);
        }
        if (el) {
          if (field === 'text') {
            el.innerText = value;
          } else if (field === 'src') {
            el.setAttribute('src', value);
          } else if (field === 'alt') {
            el.setAttribute('alt', value);
          } else if (field === 'color') {
            el.style.color = value;
          } else if (field === 'bold') {
            el.style.fontWeight = value ? 'bold' : 'normal';
          } else if (field === 'italic') {
            el.style.fontStyle = value ? 'italic' : 'normal';
          } else if (field === 'underline') {
            el.style.textDecoration = value ? 'underline' : 'none';
          } else if (field === 'align') {
            el.style.textAlign = value;
          } else if (field === 'href' && el.tagName.toLowerCase() === 'a') {
            el.setAttribute('href', value);
          } else if (field === 'target' && el.tagName.toLowerCase() === 'a') {
            el.setAttribute('target', value);
          }
        }
      } else if (msg.type === 'UPDATE_MENU_LABEL') {
        const { slug, label } = msg.payload;
        setLiveMenuLabels((prev) => ({
          ...prev,
          [slug]: label,
        }));
      } else if (msg.type === 'APPLY_ALL_OVERRIDES') {
        const { contentBlocks: blocks, menuLabels: labels } = msg.payload;
        if (blocks) {
          Object.entries(blocks).forEach(([p, d]) => {
            applyOverrideToElement(p, d);
          });
        }
        if (labels) {
          setLiveMenuLabels(labels);
        }
      } else if (msg.type === 'SCROLL_TO_SECTION') {
        const { sectionId } = msg.payload;
        scrollToSectionId(sectionId);
      } else if (msg.type === 'CLEAR_SELECTION') {
        if (selectedEl) {
          selectedEl.style.outline = '';
          selectedEl.style.outlineOffset = '';
          selectedEl = null;
        }
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('click', handleClick, true);
    window.addEventListener('message', handleStudioMessage);

    // Notify parent that iframe preview is ready
    window.parent.postMessage({ type: 'STUDIO_PREVIEW_READY' }, '*');

    return () => {
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('message', handleStudioMessage);
    };
  }, [contentOverrides]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#17201D] selection:bg-[#D9A441] selection:text-[#0A1E3F]">
      <Head>
        <title>MARPORTS GLOBAL 2027 – Conference & Excellence Awards | Chennai, India</title>
        <meta
          name="description"
          content="A premium maritime forum for global leaders, port authorities, and industry innovators shaping the future of trade, sustainability and port excellence. 5th February 2027, Taj Coromandel, Chennai."
        />
      </Head>

      {/* 1. Sticky Navigation Bar with Exact 7 Top Menus */}
      <Navbar onOpenRegister={handleOpenRegister} menuLabels={liveMenuLabels} />

      {/* 2. Hero Section */}
      <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 bg-navy-gradient text-white overflow-hidden">
        {/* Particle Canvas */}
        <HeroCanvas />

        {/* Ambient Lighting Circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#0E4B75]/35 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[550px] h-[550px] bg-[#D9A441]/15 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10 w-full py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6 text-left">
              {/* Event Date & Location Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card-dark border border-[#D9A441]/40 text-xs sm:text-sm font-semibold text-[#F0D9A0] shadow-lg"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A441] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D9A441]"></span>
                </span>
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Calendar className="w-3.5 h-3.5 text-[#D9A441]" />
                  5 FEBRUARY 2027
                </span>
                <span className="text-white/40">|</span>
                <span className="flex items-center gap-1 text-white/90 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                  TAJ COROMANDEL, CHENNAI
                </span>
              </motion.div>

              {/* Main Bold Headline with Two Lines */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-serif-heading text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.05]"
              >
                <span className="block">MARPORTS</span>
                <span className="block text-gold-gradient">GLOBAL</span>
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed font-normal"
              >
                A premium maritime forum for global leaders, port authorities, and industry innovators shaping the future of trade, sustainability and port excellence.
              </motion.p>

              {/* Primary & Secondary CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => handleOpenRegister('delegate')}
                  className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#F0D9A0] to-[#D9A441] text-[#0A1E3F] font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#D9A441]/20 hover:shadow-[#D9A441]/40 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Register Now
                </button>

                <button
                  onClick={() => handleOpenRegister('sponsor')}
                  className="px-8 py-4 rounded-xl border border-[#D9A441]/60 hover:border-[#D9A441] text-[#F0D9A0] hover:text-white font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  Become a Sponsor
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="pt-2 text-xs text-white/60 flex items-center gap-2"
              >
                <span>Organized by</span>
                <strong className="text-white font-semibold">E Hub Events Private Limited</strong>
                <span className="text-[#D9A441]">•</span>
                <span>Chennai, India</span>
              </motion.div>
            </div>

            {/* Right Interactive Holographic Badge Card */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="w-full max-w-md relative"
              >
                <div className="relative rounded-3xl p-8 glass-card-dark border-2 border-[#D9A441]/40 shadow-2xl backdrop-blur-2xl flex flex-col justify-between aspect-square">
                  {/* Decorative Anchor Rings */}
                  <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F0D9A0] flex items-center gap-1.5">
                      <Anchor className="w-4 h-4 text-[#D9A441]" />
                      OFFICIAL 2027 SUMMIT
                    </span>
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#D9A441]/20 text-[#F0D9A0] font-bold border border-[#D9A441]/40">
                      CHENNAI EDITION
                    </span>
                  </div>

                  {/* Center Emblem Graphic */}
                  <div className="my-auto text-center space-y-4">
                    <motion.div
                      whileHover={{ scale: 1.08 }}
                      className="w-32 h-32 mx-auto rounded-3xl bg-white p-3 shadow-2xl gold-glow border-2 border-[#D9A441] flex items-center justify-center"
                    >
                      <img src={logoUrl} alt="MARPORTS GLOBAL Official Logo" className="w-full h-full object-contain" />
                    </motion.div>
                    <div>
                      <h3 className="font-serif-heading text-xl font-bold text-white">
                        MARITIME & PORT EXCELLENCE
                      </h3>
                      <p className="text-xs text-white/75 mt-1 max-w-xs mx-auto">
                        Global trade pathways, smart port digital twins, zero-emission fuels & shipbuilding power shifts.
                      </p>
                    </div>
                  </div>

                  {/* Card Footer Metric */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/80">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#D9A441]" />
                      Taj Coromandel
                    </span>
                    <span className="font-bold text-[#D9A441]">
                      FEB 5, 2027
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ticker Banner */}
      <TickerBanner />

      {/* 4. Sponsors & Partners Grid */}
      <SponsorGrid sponsors={sponsors} onOpenRegister={handleOpenRegister} />

      {/* 5. Participating Organizations Marquee */}
      <section className="py-12 bg-white border-y border-gray-200 overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 mb-6 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0E4B75]">
            Participating Organizations
          </span>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee flex items-center gap-10 text-sm font-semibold text-gray-700">
            {[...participatingOrganizations, ...participatingOrganizations].map((org, i) => (
              <span key={i} className="flex items-center gap-3 shrink-0 px-4 py-2 bg-[#F7F5EF] rounded-xl border border-gray-200">
                <Building className="w-4 h-4 text-[#0E4B75]" />
                <span>{org}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Explore More Cards */}
      <section className="py-20 bg-[#F7F5EF]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
              EXPLORE THE SUMMIT
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-3">
              Key Focus Areas
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E4B75]/10 text-[#0E4B75] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2">
                  Conference Topics
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  4 core pillars addressing decarbonization mandates, port infrastructure expansion, modern shipyards, and smart digital port twins.
                </p>
              </div>
              <a href="#topics" className="text-xs font-bold text-[#0E4B75] hover:text-[#D9A441] flex items-center gap-1">
                View Conference Topics <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </ScrollReveal>

            <ScrollReveal className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2">
                  Excellence Awards
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  30 official awards celebrating outstanding shipowners, port developers, maritime AI innovators, and lifetime achievement honorees.
                </p>
              </div>
              <a href="#awards" className="text-xs font-bold text-[#0E4B75] hover:text-[#D9A441] flex items-center gap-1">
                Explore Award Categories <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </ScrollReveal>

            <ScrollReveal className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#0A1E3F]/10 text-[#0A1E3F] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2">
                  Event Details & Date
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-6">
                  Friday, 5th February 2027 at the iconic Taj Coromandel, Chennai, Tamil Nadu, India.
                </p>
              </div>
              <a href="#contact" className="text-xs font-bold text-[#0E4B75] hover:text-[#D9A441] flex items-center gap-1">
                Join & Register <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 7. About Conference & E Hub Events (#about) */}
      <section id="about" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal className="space-y-6">
              <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full border border-[#0E4B75]/20">
                ABOUT MARPORTS GLOBAL
              </span>
              <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] leading-tight">
                Shaping the Future of Ocean Trade & Port Infrastructure
              </h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                The <strong>MARPORTS GLOBAL Conference & Excellence Awards</strong> is envisioned as a flagship international platform uniting maritime decision-makers, port authorities, terminal concessionaires, naval architects, and technological innovators.
              </p>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                As global shipping faces rigorous decarbonization mandates, evolving geopolitical trade corridors, and accelerating digital transformation, MARPORTS GLOBAL provides critical strategic foresight and senior-level networking.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <button
                  onClick={() => handleOpenRegister('delegate')}
                  className="px-6 py-3 rounded-xl bg-[#0A1E3F] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#0E4B75] transition-colors"
                >
                  Register as Delegate
                </button>
                <a
                  href="#topics"
                  className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs uppercase tracking-wider hover:border-[#0A1E3F] transition-colors"
                >
                  Explore Topics
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal className="p-8 sm:p-10 rounded-3xl bg-[#F7F5EF] border border-[#0E4B75]/20 shadow-xl space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441] block">
                ORGANIZER PROFILE
              </span>
              <h3 className="font-serif-heading text-2xl font-bold text-[#0A1E3F]">
                E Hub Events Private Limited
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                E Hub Events Private Limited is a premier maritime conference and awards producer, widely recognized as the organizer of the prestigious <strong>SHIPTEK</strong> international event series.
              </p>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                With a proven legacy of convening top-tier C-suite executives, government ministries, and international classification societies, E Hub Events bridges global expertise with regional market realities.
              </p>

              <div className="pt-4 border-t border-gray-300 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0A1E3F]">
                  Official Website:
                </span>
                <a
                  href={eventDetails.organizer_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#0E4B75] hover:text-[#D9A441] flex items-center gap-1"
                >
                  <span>www.ehub.events</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 8. Conference Topics (#topics) */}
      <section id="topics" className="py-24 bg-[#F7F5EF] relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
              CONFERENCE PROGRAM
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
              4 Core Conference Pillars
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Comprehensive sessions curated with industry authorities to address the most urgent commercial, technological, and environmental maritime issues.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {conferenceTopics.map((topic) => (
              <ScrollReveal
                key={topic.number}
                className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-xl transition-all duration-300 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-serif-heading font-extrabold text-[#D9A441]">
                    {topic.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E4B75] bg-[#0E4B75]/10 px-3 py-1 rounded-md">
                    Track Theme
                  </span>
                </div>

                <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F]">
                  {topic.title}
                </h3>

                <p className="text-xs text-gray-600 leading-relaxed">
                  {topic.description}
                </p>

                <ul className="space-y-2.5 pt-2 border-t border-gray-100">
                  {topic.points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Key Panel Discussions */}
      <section id="panels" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D9A441] bg-[#D9A441]/10 px-4 py-1.5 rounded-full mb-3 border border-[#D9A441]/30">
              EXECUTIVE DIALOGUE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
              Key Panel Discussions
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Interactive high-level panel debates featuring shipowners, shipyard directors, port authorities, and regulatory policymakers.
            </p>
          </ScrollReveal>

          <div className="space-y-6 max-w-6xl mx-auto">
            {panelDiscussions.map((panel, idx) => (
              <ScrollReveal
                key={idx}
                className="p-6 sm:p-8 rounded-2xl bg-[#F7F5EF] border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F]">
                    {panel.title}
                  </h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#D9A441]">
                    Panel Session #{idx + 1}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-[#0E4B75] uppercase tracking-wider mb-3">
                  {panel.subtitle}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {panel.desc}
                </p>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Key Speakers & Panelists */}
      <section id="speakers-board" className="py-24 bg-[#F7F5EF] relative overflow-hidden">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
              INDUSTRY THOUGHT LEADERS
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
              Speakers & Panelists
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Hear directly from top operations directors, policy researchers, and commercial maritime innovators.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker) => (
              <ScrollReveal
                key={speaker.id}
                className="rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A1E3F] via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-4 text-xs font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F]/80 backdrop-blur-md px-3 py-1 rounded-md border border-[#D9A441]/40">
                      {speaker.role}
                    </span>
                  </div>

                  <div className="p-6">
                    <h3 className="font-serif-heading text-lg font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors mb-1">
                      {speaker.name}
                    </h3>
                    <p className="text-xs font-bold text-[#D9A441] mb-1">
                      {speaker.designation}
                    </p>
                    <p className="text-xs text-[#0E4B75] font-semibold mb-4">
                      {speaker.company}
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {speaker.bio}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium">Taj Coromandel, Chennai</span>
                  <span className="text-[11px] font-bold text-[#0E4B75]">5 Feb 2027</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 11. Advisory Board 2027 */}
      <AdvisoryBoardGrid advisoryBoard={advisoryBoard} />

      {/* 12. Excellence Awards (#awards) */}
      <AwardsSection awardCategories={awardCategories} onOpenNominate={handleOpenRegister} />

      {/* 13. Summit Gallery (#gallery) */}
      <GallerySection />

      {/* 14. Events & News (#events-news) */}
      <EventsNewsSection onOpenRegister={handleOpenRegister} />

      {/* 15. Previous Edition (#past-edition) */}
      <PastEditionSection pastEdition={pastEdition2026} />

      {/* 16. Ready to Join Us? (Registration, Contact, Accommodation) */}
      <ReadyToJoinSection eventDetails={eventDetails} onOpenRegister={handleOpenRegister} />

      {/* 17. Corporate Footer */}
      <Footer eventDetails={eventDetails} onOpenRegister={handleOpenRegister} />

      {/* 18. Dynamic Registration & Inquiry Modal */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
}
