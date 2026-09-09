import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  FileText,
  Clock,
  Users,
  Calendar,
  ArrowUpRight,
  PlusCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Layers,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function Dashboard({
  metrics,
  registrationMetrics,
  recentPages,
  recentRegistrations,
  eventInfo,
}) {
  const { props } = usePage();
  const adminUrls = props?.adminUrls || {};
  const statCards = [
    {
      label: 'MANAGED PAGES',
      value: metrics.managed_pages,
      support: 'Public & sub-menu routes',
      icon: FileText,
      badgeColor: 'text-[#22C55E]',
      iconBg: 'bg-[#182F58]/60 text-[#22C55E]',
    },
    {
      label: 'UPDATED (24H)',
      value: metrics.updated_24h,
      support: 'Recent content changes',
      icon: Clock,
      badgeColor: 'text-amber-400',
      iconBg: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'CMS STAFF USERS',
      value: metrics.staff_users,
      support: 'Active system operators',
      icon: Users,
      badgeColor: 'text-sky-400',
      iconBg: 'bg-sky-500/10 text-sky-400',
    },
    {
      label: 'DAYS TO EVENT',
      value: metrics.days_to_event,
      support: `${eventInfo?.venue || 'Taj Coromandel'}, ${eventInfo?.city || 'Chennai'}`,
      icon: Calendar,
      badgeColor: 'text-[#D9A441]',
      iconBg: 'bg-[#D9A441]/15 text-[#D9A441]',
    },
  ];

  return (
    <AdminLayout
      title="System Overview"
      subtitle="Operational monitoring and content management for MARPORTS GLOBAL 2027"
      headerActions={
        <div className="flex items-center gap-2">
          <Link
            href={adminUrls.registrations || '/new/cms/registrations'}
            className="px-3.5 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Manage Registrations</span>
          </Link>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Statistics Cards (Horizontal Grid of 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#0A1529] border border-[#152747] hover:border-[#1E3A68] rounded-[18px] p-5 flex flex-col justify-between transition-all"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <div className={`w-9 h-9 rounded-full ${card.iconBg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span>{card.support}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Registration Status Mini-Cards */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#152747] gap-3">
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Registration Pipeline
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Delegate, speaker, and award participant registrations in MySQL
              </p>
            </div>
            <Link
              href={adminUrls.registrations || '/new/cms/registrations'}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#22C55E] hover:underline"
            >
              <span>Full Registration Hub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="bg-[#070E1B] border border-[#152747] rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Total Submissions</div>
              <div className="text-2xl font-bold text-white mt-1">{registrationMetrics.total}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Recorded attendees</div>
            </div>
            <div className="bg-[#070E1B] border border-[#152747] rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Pending Review
              </div>
              <div className="text-2xl font-bold text-amber-300 mt-1">{registrationMetrics.pending}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Requires approval</div>
            </div>
            <div className="bg-[#070E1B] border border-[#152747] rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Confirmed / Approved
              </div>
              <div className="text-2xl font-bold text-emerald-300 mt-1">{registrationMetrics.approved}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Passes verified</div>
            </div>
            <div className="bg-[#070E1B] border border-[#152747] rounded-xl p-3.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                Declined / Spam
              </div>
              <div className="text-2xl font-bold text-rose-300 mt-1">{registrationMetrics.rejected}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Rejected entries</div>
            </div>
          </div>
        </div>

        {/* 3. Content Cards: Two-Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Recent Page Updates */}
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#152747] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Recent Website Page Updates</h3>
                <p className="text-xs text-slate-400 mt-0.5">Public CMS routes managed across the summit</p>
              </div>
              <Link
                href={adminUrls.pages || '/new/cms/pages'}
                className="text-xs font-semibold text-[#22C55E] hover:underline flex items-center gap-1"
              >
                <span>View All ({metrics.managed_pages})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#152747] flex-1">
              {recentPages?.map((page) => (
                <div
                  key={page.id}
                  className="p-4 hover:bg-[#0E1E38] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{page.title}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          page.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono truncate">
                      <span>{page.route_path}</span>
                      <span>•</span>
                      <span>{page.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 text-xs text-slate-400">
                    <div className="text-[11px] text-slate-400">
                      {new Date(page.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Latest Registrations */}
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#152747] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Latest Attendee Inquiries</h3>
                <p className="text-xs text-slate-400 mt-0.5">Most recent delegate and sponsor submissions</p>
              </div>
              <Link
                href={adminUrls.registrations || '/new/cms/registrations'}
                className="text-xs font-semibold text-[#22C55E] hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-[#152747] flex-1">
              {recentRegistrations?.map((reg) => (
                <div
                  key={reg.id}
                  className="p-4 hover:bg-[#0E1E38] transition-colors flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white truncate">{reg.full_name}</span>
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${
                          reg.status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : reg.status === 'pending'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'bg-rose-500/10 text-rose-400'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      {reg.organization} {reg.designation ? `• ${reg.designation}` : ''}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#112344] text-slate-300 font-medium">
                      {reg.pass_tier}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Quick Actions Banner */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white uppercase tracking-wider">
                {eventInfo?.name || 'MARPORTS GLOBAL 2027'}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                {eventInfo?.date_display} • {eventInfo?.venue}, {eventInfo?.city}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <a
              href={adminUrls.registrationsExport || '/new/cms/registrations-export'}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-200 transition-colors text-center"
            >
              Export CSV
            </a>
            <Link
              href={adminUrls.settings || '/new/cms/settings'}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-200 transition-colors text-center"
            >
              System Settings
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
