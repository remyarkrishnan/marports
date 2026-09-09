import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
  LayoutDashboard,
  ClipboardList,
  Layers,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  User as UserIcon,
} from 'lucide-react';

export default function AdminLayout({ children, title, subtitle, headerActions }) {
  const { url, props } = usePage();
  const { auth, flash } = props;
  const user = auth?.user;

  const [mobileOpen, setMobileOpen] = useState(false);

  const adminUrls = props?.adminUrls || {};

  const navItems = [
    {
      label: 'Dashboard',
      href: adminUrls.dashboard || '/cms',
      icon: LayoutDashboard,
      active: url.endsWith('/cms') || url.endsWith('/cms/'),
    },
    {
      label: 'Registrations',
      href: adminUrls.registrations || '/cms/registrations',
      icon: ClipboardList,
      active: url.includes('/cms/registrations'),
    },
    {
      label: 'Website Pages',
      href: adminUrls.pages || '/cms/pages',
      icon: Layers,
      active: url.includes('/cms/pages'),
    },
    {
      label: 'Settings',
      href: adminUrls.settings || '/cms/settings',
      icon: Settings,
      active: url.includes('/cms/settings'),
    },
  ];

  const handleLogout = (e) => {
    e.preventDefault();
    router.post(adminUrls.logout || '/cms/logout');
  };

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-200 font-sans flex flex-col md:flex-row antialiased selection:bg-[#22C55E] selection:text-[#0A1E3F]">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar (Desktop 240px fixed + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-[240px] shrink-0 bg-[#0A1529] border-r border-[#152747] flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Brand Section */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-[#152747]">
            <Link href="/cms" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-[#0A1E3F] font-black text-sm shadow-sm">
                M
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                  MARPORTS
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#162D55] text-[#22C55E] font-medium">
                    CMS
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tight">GLOBAL 2027</div>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white md:hidden"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? 'bg-[#22C55E] text-[#0A1E3F] font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-[#112344] hover:text-white'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      item.active ? 'text-[#0A1E3F]' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Live Site
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-[#112344] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 text-[#D9A441]" />
                View Website
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#162D55] text-slate-300">
                2027
              </span>
            </a>
          </nav>
        </div>

        {/* Bottom Section: User & Logout */}
        <div className="p-3 border-t border-[#152747] space-y-2 bg-[#081120]">
          <div className="flex items-center gap-2.5 px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-[#182F58] border border-[#23437D] flex items-center justify-center text-xs font-bold text-[#22C55E]">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">
                {user?.name || 'Administrator'}
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-[#22C55E] shrink-0" />
                <span className="truncate">{user?.role || 'SYSTEM ADMIN'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 transition-colors border border-rose-500/20"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#0A1529]/90 backdrop-blur-md border-b border-[#152747] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#112344] md:hidden"
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                {title}
              </h1>
              {subtitle && <p className="text-xs text-slate-400 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown / Event Chip */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#112344] border border-[#1E3A68] text-xs">
              <Calendar className="w-3.5 h-3.5 text-[#22C55E]" />
              <span className="text-slate-300">Taj Coromandel, Chennai</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] font-bold">
                FEB 2027
              </span>
            </div>

            {headerActions && <div>{headerActions}</div>}
          </div>
        </header>

        {/* Flash Message Alerts */}
        {flash?.success && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="flex-1">{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="flex-1">{flash.error}</span>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
