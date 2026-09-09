import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Filter } from 'lucide-react';

export default function AgendaTimeline({ agendaDay1, agendaDay2, onOpenRegister }) {
  const [activeDay, setActiveDay] = useState(1);
  const [selectedTrack, setSelectedTrack] = useState('All');

  const currentAgenda = activeDay === 1 ? agendaDay1 : agendaDay2;

  const tracks = ['All', ...new Set(currentAgenda.map((item) => item.track))];

  const filteredAgenda =
    selectedTrack === 'All'
      ? currentAgenda
      : currentAgenda.filter((item) => item.track === selectedTrack);

  return (
    <div className="bg-[#0A1E3F] rounded-3xl p-6 sm:p-10 border border-[#D9A441]/30 shadow-2xl text-white">
      {/* Day Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
        <div className="flex items-center gap-3 bg-[#05142B] p-1.5 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              setActiveDay(1);
              setSelectedTrack('All');
            }}
            className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeDay === 1
                ? 'bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>DAY 1 • OCT 14, 2027</span>
          </button>

          <button
            onClick={() => {
              setActiveDay(2);
              setSelectedTrack('All');
            }}
            className={`px-6 py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              activeDay === 2
                ? 'bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] shadow-lg'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>DAY 2 • OCT 15, 2027</span>
          </button>
        </div>

        {/* Track Filter Dropdown/Badges */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <Filter className="w-4 h-4 text-[#D9A441] hidden sm:block" />
          <span className="text-xs text-white/60 font-semibold uppercase tracking-wider hidden sm:inline">
            Filter Track:
          </span>
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedTrack === track
                  ? 'bg-[#0E4B75] text-[#F0D9A0] border border-[#D9A441]/50'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Schedule Grid */}
      <div className="mt-8 space-y-6">
        {filteredAgenda.map((item, index) => (
          <div
            key={index}
            className="group relative bg-[#05142B]/90 rounded-2xl p-5 sm:p-7 border border-[#D9A441]/15 hover:border-[#D9A441]/50 transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            {/* Time Badge */}
            <div className="md:w-56 shrink-0">
              <div className="inline-flex items-center gap-2 bg-[#0A1E3F] border border-[#D9A441]/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-[#F0D9A0]">
                <Clock className="w-3.5 h-3.5 text-[#D9A441]" />
                {item.time}
              </div>
              <div className="text-[11px] font-semibold text-white/50 uppercase tracking-widest mt-2">
                {item.track}
              </div>
            </div>

            {/* Content Details */}
            <div className="flex-1">
              <h4 className="font-serif-heading text-lg sm:text-xl font-bold text-white group-hover:text-[#F0D9A0] transition-colors mb-2">
                {item.title}
              </h4>

              <div className="flex flex-wrap items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1.5 text-[#F0D9A0] font-medium">
                  <User className="w-3.5 h-3.5 text-[#D9A441]" />
                  {item.speaker}
                </span>

                <span className="flex items-center gap-1.5 text-white/60">
                  <MapPin className="w-3.5 h-3.5 text-[#D9A441]" />
                  {item.stage}
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="w-full md:w-auto shrink-0 pt-2 md:pt-0">
              <button
                onClick={() => onOpenRegister('delegate')}
                className="w-full md:w-auto px-5 py-2 rounded-xl bg-white/5 hover:bg-[#D9A441] text-white hover:text-[#0A1E3F] border border-[#D9A441]/30 text-xs font-bold uppercase tracking-wider transition-all duration-300"
              >
                Reserve Seat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
