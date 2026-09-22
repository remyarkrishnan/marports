import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Sparkles } from 'lucide-react';

export default function CountdownTimer({ targetDate = '2027-02-05T09:00:00+05:30' }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted) return null;

  const units = [
    { label: 'DAYS', value: timeLeft.days },
    { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
    { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
    { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') },
  ];

  return (
    <div className="w-full max-w-lg mx-auto sm:mx-0">
      {/* Live Badge Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#F0D9A0] flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
          Summit Countdown • 5 Feb 2027
        </span>
      </div>

      {/* Glassmorphic Countdown Box Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5">
        {units.map((unit, idx) => (
          <div
            key={unit.label}
            className="group relative rounded-2xl p-3 sm:p-3.5 glass-card-dark border border-[#D9A441]/35 hover:border-[#D9A441] shadow-xl hover:shadow-[#D9A441]/20 transition-all duration-300 text-center overflow-hidden flex flex-col justify-center items-center"
          >
            {/* Ambient inner card glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#D9A441]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Micro corner brackets */}
            <div className="card-decor-tl !top-1.5 !left-1.5 !w-1.5 !h-1.5 group-hover:!w-2 group-hover:!h-2" />
            <div className="card-decor-tr !top-1.5 !right-1.5 !w-1.5 !h-1.5 group-hover:!w-2 group-hover:!h-2" />

            {/* Digit Value */}
            <motion.span
              key={unit.value}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="font-serif-heading text-2xl sm:text-3xl font-black text-white group-hover:text-[#F0D9A0] transition-colors leading-none tracking-tight drop-shadow-md"
            >
              {unit.value}
            </motion.span>

            {/* Label */}
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/70 group-hover:text-white mt-1.5 transition-colors">
              {unit.label}
            </span>

            {/* Scanning line indicator */}
            <div className="card-scan-line" />
          </div>
        ))}
      </div>
    </div>
  );
}
