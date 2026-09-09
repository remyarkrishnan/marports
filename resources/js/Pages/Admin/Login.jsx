import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { Shield, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { props } = usePage();
  const loginUrl = props?.adminUrls?.loginSubmit || '/cms/login';
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(loginUrl);
  };

  const handleDemoFill = () => {
    setData({
      email: 'admin@marportsglobal.com',
      password: 'Admin12345',
      remember: true,
    });
  };

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-200 font-sans flex items-center justify-center p-4 antialiased selection:bg-[#22C55E] selection:text-[#0A1E3F]">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#0E4B75]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[200px] bg-[#22C55E]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#22C55E] to-[#16A34A] text-[#0A1E3F] font-black text-2xl shadow-lg mb-4">
            M
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            MARPORTS GLOBAL
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#22C55E] font-semibold mt-1">
            Content Management & Administration
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Authorized administrative access for summit operations
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {errors.email && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errors.email}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="admin@marportsglobal.com"
                  required
                  className="w-full bg-[#070E1B] border border-[#1E3A68] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-400 transition-colors outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#070E1B] border border-[#1E3A68] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-400 transition-colors outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                <input
                  type="checkbox"
                  checked={data.remember}
                  onChange={(e) => setData('remember', e.target.checked)}
                  className="w-4 h-4 rounded border-[#1E3A68] bg-[#070E1B] text-[#22C55E] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember session</span>
              </label>

              <button
                type="button"
                onClick={handleDemoFill}
                className="text-[#22C55E] hover:underline text-[11px] font-medium"
              >
                Fill credentials
              </button>
            </div>

            <button
              type="submit"
              disabled={processing}
              className="w-full mt-3 py-2.5 px-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
            >
              <span>{processing ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-4 border-t border-[#152747] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#22C55E]" />
              Encrypted Session
            </span>
            <span>MySQL 8.4 • Inertia SPA</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-6 text-xs text-slate-400">
          MARPORTS GLOBAL 2027 • Taj Coromandel, Chennai
        </div>
      </div>
    </div>
  );
}
