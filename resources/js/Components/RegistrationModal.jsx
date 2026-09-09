import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X, Sparkles, Check, ShieldCheck, Ticket, User, Building, Mail, Phone, Briefcase } from 'lucide-react';

export default function RegistrationModal({ isOpen, onClose, initialType = 'delegate' }) {
  const [successMsg, setSuccessMsg] = useState(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    type: initialType,
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    industry: 'Maritime & Port Logistics',
    pass_tier: initialType === 'sponsor' ? 'Sponsor Portfolio' : initialType === 'awards' ? 'Awards Nomination' : 'VIP Executive Pass',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/register', {
      onSuccess: () => {
        setSuccessMsg('Your registration for MARPORTS GLOBAL 2027 has been confirmed!');
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#D9A441', '#F0D9A0', '#0A1E3F', '#0E4B75'],
          });
        } catch (err) {
          console.log('Confetti burst');
        }
      },
    });
  };

  const handleClose = () => {
    reset();
    setSuccessMsg(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#0A1E3F] border-2 border-[#D9A441]/60 rounded-3xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden z-10"
          >
            {/* Top Gold Accent Strip */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#D9A441] via-[#F0D9A0] to-[#D9A441]" />

            <button
              onClick={handleClose}
              className="absolute top-5 right-5 p-2 text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>

            {successMsg ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-5"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D9A441] to-[#0E4B75] p-1 mx-auto shadow-2xl">
                  <div className="w-full h-full bg-[#0A1E3F] rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-[#F0D9A0]" />
                  </div>
                </div>

                <h3 className="font-serif-heading text-2xl font-bold text-[#F0D9A0]">
                  Pass Reservation Confirmed!
                </h3>

                <p className="text-sm text-white/80 max-w-md mx-auto leading-relaxed">
                  Thank you for registering for <span className="text-[#D9A441] font-bold">MARPORTS GLOBAL 2027</span>. A confirmation receipt and calendar invitation have been issued to <span className="underline">{data.email}</span>.
                </p>

                <div className="bg-[#05142B] p-4 rounded-2xl border border-[#D9A441]/30 text-left text-xs space-y-2">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Delegate Name:</span>
                    <span className="font-bold text-white">{data.full_name}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Organization:</span>
                    <span className="font-bold text-white">{data.organization}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Pass Category:</span>
                    <span className="font-bold text-[#F0D9A0]">{data.pass_tier}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider shadow-lg"
                >
                  Done & Close Window
                </button>
              </motion.div>
            ) : (
              <div>
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E4B75] text-[#F0D9A0] text-[10px] font-bold uppercase tracking-widest border border-[#D9A441]/30">
                    <Sparkles className="w-3 h-3 text-[#D9A441]" />
                    SINGAPORE 2027 DELEGATE PORTAL
                  </span>
                  <h2 className="font-serif-heading text-2xl sm:text-3xl font-extrabold text-white mt-2">
                    {data.type === 'sponsor'
                      ? 'Sponsorship Inquiry'
                      : data.type === 'awards'
                      ? 'Award Nomination Form'
                      : 'Register for MARPORTS 2027'}
                  </h2>
                  <p className="text-xs text-white/70 mt-1">
                    Select your delegate pass or inquiry type below to reserve your place.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Registration Type Select */}
                  <div className="grid grid-cols-3 gap-2 p-1 bg-[#05142B] rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => {
                        setData('type', 'delegate');
                        setData('pass_tier', 'VIP Executive Pass');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                        data.type === 'delegate'
                          ? 'bg-[#D9A441] text-[#0A1E3F]'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Delegate
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setData('type', 'sponsor');
                        setData('pass_tier', 'Sponsor Portfolio');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                        data.type === 'sponsor'
                          ? 'bg-[#D9A441] text-[#0A1E3F]'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Sponsor
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setData('type', 'awards');
                        setData('pass_tier', 'Awards Nomination');
                      }}
                      className={`py-2 text-xs font-bold rounded-lg transition-colors ${
                        data.type === 'awards'
                          ? 'bg-[#D9A441] text-[#0A1E3F]'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      Awards
                    </button>
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={data.full_name}
                          onChange={(e) => setData('full_name', e.target.value)}
                          placeholder="Capt. Alexander Vance"
                          className="w-full bg-[#05142B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                      {errors.full_name && <p className="text-[10px] text-red-400 mt-1">{errors.full_name}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
                        Work Email *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={data.email}
                          onChange={(e) => setData('email', e.target.value)}
                          placeholder="alexander@maritime.com"
                          className="w-full bg-[#05142B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                      {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Organization & Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
                        Organization / Port *
                      </label>
                      <div className="relative">
                        <Building className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                        <input
                          type="text"
                          required
                          value={data.organization}
                          onChange={(e) => setData('organization', e.target.value)}
                          placeholder="Global Port Authority"
                          className="w-full bg-[#05142B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                      {errors.organization && <p className="text-[10px] text-red-400 mt-1">{errors.organization}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
                        Job Title / Designation
                      </label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={data.designation}
                          onChange={(e) => setData('designation', e.target.value)}
                          placeholder="Chief Executive Officer"
                          className="w-full bg-[#05142B] border border-white/15 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#D9A441]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pass Tier Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-white/80 uppercase tracking-wider mb-1">
                      Pass Tier Selection
                    </label>
                    <select
                      value={data.pass_tier}
                      onChange={(e) => setData('pass_tier', e.target.value)}
                      className="w-full bg-[#05142B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D9A441]"
                    >
                      <option value="VIP Executive Pass">VIP Executive Pass (Full Access + Gala Dinner + Lounge)</option>
                      <option value="Standard Summit Pass">Standard Summit Pass (2-Day Access + Exhibition)</option>
                      <option value="Startup Pitch Founder">Startup Pitch Founder (Demo Pod + VC Pitch Access)</option>
                      <option value="Sponsor Portfolio">Sponsorship & Exhibition Inquiry</option>
                      <option value="Awards Nomination">Excellence Awards Candidate Nomination</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D9A441] via-[#F0D9A0] to-[#D9A441] text-[#0A1E3F] font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {processing ? 'Confirming Reservation...' : 'Complete Pass Registration'}
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
