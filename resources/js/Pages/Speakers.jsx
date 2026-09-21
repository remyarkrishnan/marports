import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import { Search, ChevronRight, Users, Sparkles } from 'lucide-react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import RegistrationModal from '../Components/RegistrationModal';
import SpeakerCard from '../Components/SpeakerCard';

export default function Speakers({ speakers = [], menuLabels = {} }) {
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [modalType, setModalType] = useState('delegate');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const handleOpenRegister = (type = 'delegate') => {
    setModalType(type);
    setRegisterModalOpen(true);
  };

  const filteredSpeakers = useMemo(() => {
    return speakers.filter((s) => {
      const matchesSearch =
        !searchTerm.trim() ||
        `${s.name} ${s.designation} ${s.company} ${s.role}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole === 'all' ||
        (s.role && s.role.toLowerCase() === selectedRole.toLowerCase());

      return matchesSearch && matchesRole;
    });
  }, [speakers, searchTerm, selectedRole]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] text-[#0A1E3F] font-sans antialiased selection:bg-[#D9A441] selection:text-[#0A1E3F]">
      <Head>
        <title>Speakers & Panelists | MARPORTS GLOBAL 2027</title>
        <meta
          name="description"
          content="Explore the distinguished speakers, keynote thought leaders, and moderators convening at MARPORTS GLOBAL 2027 in Chennai, India."
        />
      </Head>

      {/* Navigation */}
      <Navbar onOpenRegister={handleOpenRegister} menuLabels={menuLabels} />

      {/* Hero Header */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-[#0A1E3F] via-[#0E2A54] to-[#0A1E3F] text-white relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#0E4B75]/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-[#D9A441]/15 rounded-full blur-[130px] pointer-events-none" />

        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-white/60 mb-6 font-medium">
            <Link href="/" className="hover:text-[#F0D9A0] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <Link href="/#topics" className="hover:text-[#F0D9A0] transition-colors">
              Conference Topics
            </Link>
            <ChevronRight className="w-3 h-3 text-white/40" />
            <span className="text-[#F0D9A0] font-semibold">Speakers & Panelists</span>
          </div>

          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#F0D9A0] bg-white/5 border border-[#D9A441]/30 px-3.5 py-1.5 rounded-full mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
              Industry Leaders & Visionaries
            </span>
            <h1 className="font-serif-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Speakers & <span className="text-gold-gradient">Panelists</span>
            </h1>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed font-normal">
              Convening eminent maritime policy experts, shipyard directors, regulatory officials, and commercial innovators at MARPORTS GLOBAL 2027.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="bg-white border-b border-gray-200 py-6 sticky top-[60px] z-20 shadow-sm">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, company, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-xs font-medium text-[#0A1E3F] placeholder:text-gray-400 focus:outline-none focus:border-[#0A1E3F] focus:bg-white transition-all"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { label: 'All Thought Leaders', value: 'all' },
                { label: 'Moderators', value: 'moderator' },
                { label: 'Panelists', value: 'panelist' },
              ].map((pill) => (
                <button
                  key={pill.value}
                  onClick={() => setSelectedRole(pill.value)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    selectedRole === pill.value
                      ? 'bg-[#0A1E3F] text-white shadow-md'
                      : 'bg-slate-100 text-gray-600 hover:bg-slate-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Speakers Grid Content */}
      <main className="py-16 sm:py-20">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12">
          {filteredSpeakers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSpeakers.map((speaker, idx) => (
                <SpeakerCard key={speaker.id} speaker={speaker} index={idx} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 p-8 max-w-xl mx-auto shadow-sm">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-serif-heading text-lg font-bold text-[#0A1E3F] mb-1">
                No speakers found
              </h3>
              <p className="text-xs text-gray-500 mb-6">
                Try searching with different keywords or clear the filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRole('all');
                }}
                className="px-5 py-2.5 rounded-xl bg-[#0A1E3F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0E4B75] transition-colors"
              >
                Reset Search
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer onOpenRegister={handleOpenRegister} />

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        defaultType={modalType}
      />
    </div>
  );
}
