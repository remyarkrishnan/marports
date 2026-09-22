import React, { useState, useEffect, useRef } from 'react';
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
  ExternalLink,
  Clock
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
import SpeakerCard from '../Components/SpeakerCard';
import CountdownTimer from '../Components/CountdownTimer';
import TiltCard from '../Components/TiltCard';
import { resolveAsset } from '../utils/asset';

export default function Home({
  eventDetails,
  conferenceTopics,
  panelDiscussions,
  speakingTopics,
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
  const logoUrl = resolveAsset(siteLogo || '/new/images/logo.png');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalType, setModalType] = useState('delegate');
  const [liveMenuLabels, setLiveMenuLabels] = useState(menuLabels || {});
  const heroVideoRef = useRef(null);

  const fallbackSpeakingTopics = [
    'Future-proofing maritime education: adapting to emerging technologies',
    'Upskilling the maritime workforce: bridging academia and industry',
    'Funding and risk management in ports, shipping, and shipbuilding',
    'Strategic alliances in the maritime sector for competitive advantage',
  ];
  const speakingTopicsList = speakingTopics && speakingTopics.length > 0 ? speakingTopics : fallbackSpeakingTopics;

  const fallbackPanelDiscussions = [
    {
      number: 1,
      title: 'Maritime Outlook 2030',
      subtitle: 'Global Challenges, Regulations, Trade & Industry Realities',
      fullTitle: 'Maritime Outlook 2030 – Global Challenges, Regulations, Trade & Industry Realities',
    },
    {
      number: 2,
      title: 'Ports as Future Energy Hubs',
      subtitle: 'Beyond Cargo Gateways: Transforming Port Ecosystems',
      fullTitle: 'Ports as Future Energy Hubs – Beyond Cargo Gateways: Transforming Port Ecosystems',
    },
    {
      number: 3,
      title: 'Geopolitics & the Changing Shipbuilding Landscape',
      subtitle: 'The Emerging Global Shipbuilding Power Shift',
      fullTitle: 'Geopolitics & the Changing Shipbuilding Landscape – The Emerging Global Shipbuilding Power Shift',
    },
    {
      number: 4,
      title: 'Future Ports: No Depth, No Growth',
      subtitle: 'The Strategic Role of Dredging for Ports & Ship Owners',
      fullTitle: 'Future Ports: No Depth, No Growth – The Strategic Role of Dredging for Ports & Ship Owners',
    },
    {
      number: 5,
      title: 'Maritime 4.0',
      subtitle: 'Balancing Digitalization, Innovation, Connectivity & Cyber Security',
      fullTitle: 'Maritime 4.0 – Balancing Digitalization, Innovation, Connectivity & Cyber Security',
    },
  ];
  const panelsList = panelDiscussions && panelDiscussions.length > 0 ? panelDiscussions : fallbackPanelDiscussions;

  useEffect(() => {
    if (heroVideoRef.current) {
      heroVideoRef.current.play().catch(() => {});
    }
  }, []);

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
      <section id="hero" className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 bg-[#0A1E3F] text-white overflow-hidden">
        {/* Continuous Background Video (Clickable to YouTube) */}
        <a
          href="https://www.youtube.com/watch?si=u-Wl_Rs5crdJ8MHu&v=JkzJvGrVvdA&feature=youtu.be"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 w-full h-full overflow-hidden z-0 cursor-pointer group"
          title="Watch video on YouTube"
          aria-label="Watch MARPORTS GLOBAL video on YouTube"
        >
          <video
            ref={heroVideoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          >
            <source src={resolveAsset('/video/hero-bg-video-BXQNrT1Q.mp4')} type="video/mp4" />
          </video>
          {/* Light Cinematic Tint to Ensure Video is Bright & Vivid */}
          <div className="absolute inset-0 bg-black/25 group-hover:bg-black/15 transition-colors duration-300" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1E3F]/55 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[#0A1E3F]/50" />

          {/* Floating Watch on YouTube Badge */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-12 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#0A1E3F]/90 hover:bg-[#CC0000] text-white backdrop-blur-md border border-[#D9A441]/40 shadow-2xl transition-all duration-300 group-hover:scale-105">
            <svg className="w-4 h-4 fill-current text-[#FF0000] group-hover:text-white transition-colors" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            <span className="text-xs font-bold uppercase tracking-wider">Watch on YouTube</span>
          </div>
        </a>

        {/* Particle Canvas */}
        <HeroCanvas />

        {/* Ambient Floating Lighting Orbs & Tech Grid (Inspired by aitekconclave.com) */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-[#0E4B75]/25 rounded-full blur-[140px] pointer-events-none z-[1] ambient-orb-float-1" />
        <div className="absolute bottom-0 right-0 w-[650px] h-[650px] bg-[#D9A441]/15 rounded-full blur-[160px] pointer-events-none z-[1] ambient-orb-float-2" />
        <div className="absolute inset-0 tech-grid-dark pointer-events-none opacity-40 z-[1]" />

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10 w-full py-8 pointer-events-none">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Area */}
            <div className="lg:col-span-7 space-y-6 text-left pointer-events-auto">
              {/* Event Date & Location Pill Badge with Live Radar Pulse */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-card-dark border border-[#D9A441]/40 text-xs sm:text-sm font-semibold text-[#F0D9A0] shadow-lg relative group overflow-hidden"
              >
                <div className="card-scan-line" />
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
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

              {/* Main Bold Headline in Single Line */}
              <motion.h1
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="font-serif-heading text-[28px] sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-white leading-tight whitespace-nowrap drop-shadow-[0_4px_20px_rgba(0,0,0,0.85)]"
              >
                <span>MARPORTS</span>{' '}
                <span className="text-gold-gradient">GLOBAL</span>
              </motion.h1>

              {/* Supporting Description */}
              <motion.p
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-base sm:text-lg text-white/95 max-w-2xl leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
              >
                A premium maritime forum for global leaders, port authorities, and industry innovators shaping the future of trade, sustainability and port excellence.
              </motion.p>

              {/* Live Summit Countdown Timer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <CountdownTimer targetDate="2027-02-05T09:00:00+05:30" />
              </motion.div>

              {/* Primary & Secondary CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="pt-2 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => handleOpenRegister('delegate')}
                  className="btn-shimmer px-8 py-4 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#F0D9A0] to-[#D9A441] text-[#0A1E3F] font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-[#D9A441]/25 hover:shadow-[#D9A441]/40 transition-all transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-[#0A1E3F]" />
                  Register Now
                </button>

                <button
                  onClick={() => handleOpenRegister('sponsor')}
                  className="px-8 py-4 rounded-xl border border-[#D9A441]/60 hover:border-[#D9A441] text-[#F0D9A0] hover:text-white font-bold text-xs uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-all flex items-center gap-2 hover:-translate-y-1 shadow-lg hover:shadow-[#D9A441]/15"
                >
                  Become a Sponsor
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Live Metrics Glass Capsule (Inspired by aitekconclave.com) */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="pt-2 max-w-xl"
              >
                <div className="rounded-2xl p-4 sm:p-5 glass-card-dark border border-[#D9A441]/35 backdrop-blur-xl shadow-2xl flex items-center justify-around divide-x divide-white/10 relative overflow-hidden group">
                  <div className="card-decor-tl" />
                  <div className="card-decor-tr" />
                  <div className="card-scan-line" />
                  
                  <div className="text-center px-2 sm:px-3">
                    <span className="font-serif-heading text-xl sm:text-2xl font-black text-[#F0D9A0] block">
                      500+
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Leaders
                    </span>
                  </div>
                  <div className="text-center px-2 sm:px-3">
                    <span className="font-serif-heading text-xl sm:text-2xl font-black text-[#F0D9A0] block">
                      50+
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Port Authorities
                    </span>
                  </div>
                  <div className="text-center px-2 sm:px-3">
                    <span className="font-serif-heading text-xl sm:text-2xl font-black text-[#F0D9A0] block">
                      28+
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Awards
                    </span>
                  </div>
                  <div className="text-center px-2 sm:px-3">
                    <span className="font-serif-heading text-xl sm:text-2xl font-black text-[#F0D9A0] block">
                      15+
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                      Keynote Panels
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="pt-1 text-xs text-white/60 flex items-center gap-2"
              >
                <span>Organized by</span>
                <strong className="text-white font-semibold">E Hub Events Private Limited</strong>
                <span className="text-[#D9A441]">•</span>
                <span>Chennai, India</span>
              </motion.div>
            </div>

            {/* Right Interactive Holographic Badge Card wrapped in 3D TiltCard */}
            <div className="lg:col-span-5 flex justify-center pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.4 }}
                className="w-full max-w-md relative"
              >
                <TiltCard
                  maxTilt={10}
                  className="rounded-3xl p-8 glass-card-dark border-2 border-[#D9A441]/40 shadow-2xl backdrop-blur-2xl aspect-square"
                >
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
                      className="w-32 h-32 mx-auto rounded-3xl bg-white p-3 shadow-2xl gold-glow border-2 border-[#D9A441] flex items-center justify-center cursor-pointer transition-transform duration-300"
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
                </TiltCard>
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
        <div className="flex whitespace-nowrap overflow-hidden marquee-fade-mask">
          <div className="animate-marquee flex items-center gap-10 text-sm font-semibold text-gray-700">
            {[...participatingOrganizations, ...participatingOrganizations].map((org, i) => (
              <span key={i} className="flex items-center gap-3 shrink-0 px-4 py-2 bg-[#F7F5EF] rounded-xl border border-gray-200 shadow-sm hover:border-[#D9A441] hover:shadow-md transition-all">
                <Building className="w-4 h-4 text-[#0E4B75]" />
                <span>{org}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Explore More Cards */}
      <section className="py-20 bg-[#F7F5EF] relative overflow-hidden">
        {/* Subtle Ambient Orb */}
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#D9A441]/5 rounded-full blur-[120px] pointer-events-none ambient-orb-float-1" />
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
              EXPLORE THE SUMMIT
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-4xl font-extrabold text-[#0A1E3F] mb-3">
              Key Focus Areas
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollReveal>
              <TiltCard className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-2xl hover:shadow-[#D9A441]/10 transition-all duration-300 h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0E4B75]/10 text-[#0E4B75] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2 group-hover:text-[#0E4B75] transition-colors">
                    Conference Topics
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    4 core pillars addressing decarbonization mandates, port infrastructure expansion, modern shipyards, and smart digital port twins.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="card-accent-bar" />
                  <a href="#topics" className="text-xs font-bold text-[#0E4B75] group-hover:text-[#D9A441] flex items-center gap-1 transition-colors">
                    View Topics <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal>
              <TiltCard className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-2xl hover:shadow-[#D9A441]/10 transition-all duration-300 h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#D9A441]/15 text-[#D9A441] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Award className="w-6 h-6 group-hover:animate-star-rotate" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2 group-hover:text-[#D9A441] transition-colors">
                    Excellence Awards
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    28 official awards celebrating outstanding shipowners, port developers, maritime AI innovators, and lifetime achievement honorees.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="card-accent-bar" />
                  <a href="#awards" className="text-xs font-bold text-[#0E4B75] group-hover:text-[#D9A441] flex items-center gap-1 transition-colors">
                    Explore Awards <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </TiltCard>
            </ScrollReveal>

            <ScrollReveal>
              <TiltCard className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-2xl hover:shadow-[#D9A441]/10 transition-all duration-300 h-full">
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#0A1E3F]/10 text-[#0A1E3F] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-heading text-xl font-bold text-[#0A1E3F] mb-2 group-hover:text-[#0A1E3F] transition-colors">
                    Event Details & Date
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed mb-6">
                    Friday, 5th February 2027 at the iconic Taj Coromandel, Chennai, Tamil Nadu, India.
                  </p>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <div className="card-accent-bar" />
                  <a href="#contact" className="text-xs font-bold text-[#0E4B75] group-hover:text-[#D9A441] flex items-center gap-1 transition-colors">
                    Join & Register <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </TiltCard>
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
              <ScrollReveal key={topic.number}>
                <TiltCard className="p-8 rounded-3xl bg-white border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-md hover:shadow-2xl hover:shadow-[#D9A441]/15 transition-all duration-300 h-full space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="outline-stroke-number text-4xl font-black">
                      #{String(topic.number).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E4B75] bg-[#0E4B75]/10 px-3 py-1 rounded-md border border-[#0E4B75]/15">
                      Track Theme
                    </span>
                  </div>

                  <h3 className="font-serif-heading text-xl sm:text-2xl font-bold text-[#0A1E3F] group-hover:text-[#0E4B75] transition-colors">
                    {topic.title}
                  </h3>

                  <div className="card-accent-bar" />

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {topic.description}
                  </p>

                  <ul className="space-y-2.5 pt-3 border-t border-gray-100">
                    {topic.points.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-[#D9A441] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Key Panel Discussions & Speaking Topics (#panels) */}
      <section id="panels" className="py-24 bg-white relative overflow-hidden">
        <div id="agenda" className="scroll-mt-24" />
        <div id="panel-topics" className="scroll-mt-24" />
        {/* Subtle Ambient Orb */}
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#0E4B75]/5 rounded-full blur-[120px] pointer-events-none ambient-orb-float-2" />
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#D9A441] bg-[#D9A441]/10 px-4 py-1.5 rounded-full mb-3 border border-[#D9A441]/30">
              EXECUTIVE DIALOGUE
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
              Key <span className="text-[#0E4B75]">Panel Discussions</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Addressing the evolving dynamics of the maritime sector
            </p>
          </ScrollReveal>

          {/* 5 Key Panel Discussions from official agenda */}
          <div className="max-w-5xl mx-auto mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {panelsList.map((panel, idx) => (
                <ScrollReveal
                  key={panel.number || idx}
                  className={`group relative bg-[#F7F5EF] rounded-2xl p-6 sm:p-7 border border-[#0E4B75]/15 hover:border-[#D9A441] shadow-sm hover:shadow-xl hover:shadow-[#D9A441]/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 ${
                    idx === 4 ? 'md:col-span-2 md:max-w-2xl md:mx-auto w-full' : ''
                  }`}
                >
                  {/* Corner Brackets */}
                  <div className="card-decor-tl" />
                  <div className="card-decor-tr" />
                  <div className="card-decor-bl" />
                  <div className="card-decor-br" />

                  {/* Scan Line */}
                  <div className="card-scan-line" />

                  <div className="flex items-start gap-3.5 relative z-10">
                    <span className="flex-shrink-0 w-8 h-8 bg-[#0E4B75] group-hover:bg-[#D9A441] group-hover:text-[#0A1E3F] text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5 shadow-sm transition-colors duration-300">
                      {idx + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-gray-800 font-medium text-sm sm:text-base leading-snug">
                        <span className="font-bold text-[#0A1E3F]">{panel.title}</span>
                        {panel.subtitle && (
                          <span className="text-gray-700"> – {panel.subtitle}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* SPEAKING TOPICS block matching marportsglobal.com/conference-topics/agenda */}
          <div className="max-w-5xl mx-auto">
            <ScrollReveal className="mb-6">
              <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-[#0A1E3F] tracking-wide uppercase pb-4 border-b-2 border-gray-200">
                SPEAKING TOPICS
              </h2>
            </ScrollReveal>

            <ScrollReveal className="bg-white rounded-2xl shadow-lg border border-[#0E4B75]/15 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8">
                <div className="space-y-4">
                  {speakingTopicsList.slice(0, 2).map((topic, i) => (
                    <div key={i} className="flex items-start">
                      <span className="inline-block w-2.5 h-2.5 bg-[#0E4B75] rounded-full mt-2 mr-3 shrink-0" />
                      <span className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  {speakingTopicsList.slice(2).map((topic, i) => (
                    <div key={i} className="flex items-start">
                      <span className="inline-block w-2.5 h-2.5 bg-[#0E4B75] rounded-full mt-2 mr-3 shrink-0" />
                      <span className="text-sm sm:text-base font-medium text-gray-700 leading-relaxed">
                        {topic}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#0E4B75] via-[#0A1E3F] to-[#0E4B75] py-4 px-6 sm:px-8">
                <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                  <Clock className="w-5 h-5 text-[#D9A441]" />
                  <span>Final Conference Agenda Will Be Updated Soon</span>
                </h3>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 10. Panelists */}
      <section id="speakers-board" className="py-24 bg-[#F7F5EF] relative overflow-hidden">
        <div id="speakers" className="scroll-mt-24" />
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-[#0E4B75] bg-[#0E4B75]/10 px-4 py-1.5 rounded-full mb-3 border border-[#0E4B75]/20">
              INDUSTRY THOUGHT LEADERS
            </span>
            <h2 className="font-serif-heading text-3xl sm:text-5xl font-extrabold text-[#0A1E3F] mb-4">
              Panelists
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Hear directly from top operations directors, policy researchers, and commercial maritime innovators.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {speakers.map((speaker, idx) => (
              <SpeakerCard key={speaker.id} speaker={speaker} index={idx} />
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
