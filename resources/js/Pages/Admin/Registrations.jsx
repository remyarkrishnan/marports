import React, { useState } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  ClipboardList,
  Search,
  Filter,
  Download,
  Printer,
  Plus,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
  X,
  Building,
  Mail,
  Phone,
  Tag,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Layers,
  ArrowUpDown,
} from 'lucide-react';

export default function Registrations({ registrations, metrics, filters }) {
  const { props } = usePage();
  const adminUrls = props?.adminUrls || {};
  const registrationsUrl = adminUrls.registrations || '/cms/registrations';

  const [search, setSearch] = useState(filters.search || '');
  const [statusFilter, setStatusFilter] = useState(filters.status || 'all');
  const [selectedReg, setSelectedReg] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form for Manual Registration
  const addForm = useForm({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    industry: '',
    pass_tier: 'Standard Delegate Pass',
    type: 'delegate',
    status: 'approved',
    message: '',
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      registrationsUrl,
      { status: statusFilter, search, sort: filters.sort },
      { preserveState: true }
    );
  };

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    router.get(
      registrationsUrl,
      { status, search, sort: filters.sort },
      { preserveState: true }
    );
  };

  const handleSortChange = (sort) => {
    router.get(
      registrationsUrl,
      { status: statusFilter, search, sort },
      { preserveState: true }
    );
  };

  const handleUpdateStatus = (id, newStatus) => {
    router.put(
      `${registrationsUrl}/${id}/status`,
      { status: newStatus },
      {
        preserveScroll: true,
        onSuccess: () => {
          if (selectedReg && selectedReg.id === id) {
            setSelectedReg((prev) => ({ ...prev, status: newStatus }));
          }
        },
      }
    );
  };

  const handleDelete = (id, name) => {
    if (confirm(`Are you sure you want to delete registration for ${name}?`)) {
      router.delete(`${registrationsUrl}/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          if (selectedReg && selectedReg.id === id) {
            setSelectedReg(null);
          }
        },
      });
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    addForm.post(adminUrls.registrationsStore || '/cms/registrations', {
      onSuccess: () => {
        addForm.reset();
        setIsAddModalOpen(false);
      },
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const statCards = [
    {
      label: 'TOTAL REGISTRATIONS',
      value: metrics.total,
      support: 'All submitted attendee records',
      icon: ClipboardList,
      bgIcon: 'bg-sky-500/10 text-sky-400',
    },
    {
      label: 'PENDING REVIEW',
      value: metrics.pending,
      support: 'Awaiting administrative verification',
      icon: Clock,
      bgIcon: 'bg-amber-500/10 text-amber-400',
    },
    {
      label: 'APPROVED ATTENDEES',
      value: metrics.approved,
      support: 'Confirmed summit passes',
      icon: CheckCircle2,
      bgIcon: 'bg-emerald-500/10 text-emerald-400',
    },
    {
      label: 'DECLINED / REJECTED',
      value: metrics.rejected,
      support: 'Cancellations or spam submissions',
      icon: XCircle,
      bgIcon: 'bg-rose-500/10 text-rose-400',
    },
  ];

  return (
    <AdminLayout
      title="Registration Hub"
      subtitle="Manage delegates, VIPs, sponsors, and award nominations stored in MySQL"
      headerActions={
        <div className="flex items-center gap-2">
          <a
            href={`${adminUrls.registrationsExport || '/cms/registrations-export'}?status=${statusFilter}&search=${encodeURIComponent(search)}`}
            className="px-3 py-1.5 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#22C55E]" />
            <span className="hidden sm:inline">Export CSV</span>
          </a>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Registration</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Statistics Cards (4 Horizontal Cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-[#0A1529] border border-[#152747] rounded-[18px] p-5 flex flex-col justify-between"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <div className={`w-9 h-9 rounded-full ${card.bgIcon} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {card.value}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {card.support}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. Filter & Controls Card */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { key: 'all', label: 'All Records', count: metrics.total },
                { key: 'pending', label: 'Pending', count: metrics.pending },
                { key: 'approved', label: 'Approved', count: metrics.approved },
                { key: 'rejected', label: 'Rejected', count: metrics.rejected },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleFilterChange(tab.key)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    statusFilter === tab.key
                      ? 'bg-[#22C55E] text-[#0A1E3F]'
                      : 'bg-[#070E1B] text-slate-300 hover:bg-[#112344] hover:text-white border border-[#152747]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      statusFilter === tab.key
                        ? 'bg-[#0A1E3F]/20 text-[#0A1E3F]'
                        : 'bg-[#152747] text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-[#070E1B] hover:bg-[#112344] border border-[#152747] text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Print registration roster"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print</span>
              </button>
              <button
                onClick={() => router.reload({ preserveScroll: true })}
                className="px-3 py-1.5 rounded-xl bg-[#070E1B] hover:bg-[#112344] border border-[#152747] text-xs font-medium text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Refresh from MySQL"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Search & Sort Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-[#152747]">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by attendee name, email, organization, pass tier..."
                className="w-full bg-[#070E1B] border border-[#1E3A68] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] rounded-xl pl-10 pr-20 py-2 text-xs text-white placeholder:text-slate-400 outline-none transition-colors"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#112344] hover:bg-[#182F58] text-[11px] font-semibold text-slate-200"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Sort:</span>
              </div>
              <select
                value={filters.sort || 'newest'}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-[#070E1B] border border-[#1E3A68] rounded-xl px-2.5 py-1.5 text-xs text-slate-200 outline-none cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Registrations Table */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#152747] bg-[#081120] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Attendee Name</th>
                  <th className="py-3 px-4">Organization / Role</th>
                  <th className="py-3 px-4">Pass Tier</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152747]/60 text-xs">
                {registrations.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <div className="font-semibold text-slate-300">No registrations found</div>
                      <div className="text-xs text-slate-400 mt-0.5">Try adjusting your filters or search terms</div>
                    </td>
                  </tr>
                ) : (
                  registrations.data.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-[#0E1E38] transition-colors"
                    >
                      {/* Date */}
                      <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {reg.created_at ? new Date(reg.created_at).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Attendee Name */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-white">{reg.full_name}</div>
                        <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5 mt-0.5">
                          <span>{reg.email}</span>
                          {reg.phone && <span>• {reg.phone}</span>}
                        </div>
                      </td>

                      {/* Organization & Designation */}
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{reg.organization || '—'}</div>
                        {reg.designation && (
                          <div className="text-[11px] text-slate-400">{reg.designation}</div>
                        )}
                      </td>

                      {/* Pass Tier */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-lg bg-[#112344] text-slate-300 text-[11px] font-medium border border-[#1E3A68]">
                          {reg.pass_tier}
                        </span>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            reg.status === 'approved'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : reg.status === 'pending'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              reg.status === 'approved'
                                ? 'bg-emerald-400'
                                : reg.status === 'pending'
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                          />
                          {reg.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Modal */}
                          <button
                            onClick={() => setSelectedReg(reg)}
                            className="p-1.5 rounded-lg bg-[#112344] hover:bg-[#182F58] text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="View full registration details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Approve */}
                          {reg.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(reg.id, 'approved')}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors cursor-pointer"
                              title="Approve pass"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {reg.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(reg.id, 'rejected')}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors cursor-pointer"
                              title="Reject registration"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(reg.id, reg.full_name)}
                            className="p-1.5 rounded-lg bg-[#070E1B] hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {registrations.links && registrations.links.length > 3 && (
            <div className="p-4 border-t border-[#152747] flex items-center justify-between text-xs text-slate-400">
              <div>
                Showing {registrations.from || 0} to {registrations.to || 0} of {registrations.total} entries
              </div>
              <div className="flex items-center gap-1">
                {registrations.links.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => link.url && router.visit(link.url)}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      link.active
                        ? 'bg-[#22C55E] text-[#0A1E3F]'
                        : link.url
                        ? 'bg-[#070E1B] text-slate-300 hover:bg-[#112344]'
                        : 'opacity-30 cursor-not-allowed'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Detail View Modal */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#152747] flex items-center justify-between bg-[#081120]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E]">
                  Registration Ref #{String(selectedReg.id).padStart(5, '0')}
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedReg.full_name}</h3>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#112344]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#070E1B] p-3 rounded-xl border border-[#152747]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Current Status</div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold uppercase px-2 py-0.5 rounded-full ${
                        selectedReg.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : selectedReg.status === 'pending'
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-rose-500/20 text-rose-300'
                      }`}
                    >
                      {selectedReg.status}
                    </span>
                  </div>
                </div>

                <div className="bg-[#070E1B] p-3 rounded-xl border border-[#152747]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Pass Tier</div>
                  <div className="text-xs font-bold text-white mt-1">{selectedReg.pass_tier}</div>
                </div>
              </div>

              <div className="space-y-3 bg-[#070E1B] p-4 rounded-xl border border-[#152747]">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-[#22C55E]" />
                  <span className="font-semibold text-white select-all">{selectedReg.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-[#22C55E]" />
                  <span>{selectedReg.phone || 'No phone number provided'}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Building className="w-4 h-4 text-[#22C55E]" />
                  <span>
                    {selectedReg.organization} {selectedReg.designation ? `(${selectedReg.designation})` : ''}
                  </span>
                </div>
                {selectedReg.industry && (
                  <div className="flex items-center gap-2 text-slate-300">
                    <Tag className="w-4 h-4 text-[#22C55E]" />
                    <span>Industry Sector: {selectedReg.industry}</span>
                  </div>
                )}
              </div>

              {selectedReg.message && (
                <div className="bg-[#070E1B] p-4 rounded-xl border border-[#152747]">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Attendee Inquiry / Requirements
                  </div>
                  <p className="text-slate-200 leading-relaxed italic whitespace-pre-wrap">
                    "{selectedReg.message}"
                  </p>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-1">
                Submitted on {new Date(selectedReg.created_at).toLocaleString()}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-[#081120] border-t border-[#152747] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedReg.id, 'approved')}
                  disabled={selectedReg.status === 'approved'}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReg.id, 'pending')}
                  disabled={selectedReg.status === 'pending'}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Set Pending</span>
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedReg.id, 'rejected')}
                  disabled={selectedReg.status === 'rejected'}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Decline</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="px-3 py-1.5 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Manual Registration Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-[#152747] flex items-center justify-between bg-[#081120]">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Create On-Site / Manual Registration
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.data.full_name}
                    onChange={(e) => addForm.setData('full_name', e.target.value)}
                    placeholder="e.g. Admiral K. Sharma"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={addForm.data.email}
                    onChange={(e) => addForm.setData('email', e.target.value)}
                    placeholder="sharma@maritime.org"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={addForm.data.phone}
                    onChange={(e) => addForm.setData('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Organization *</label>
                  <input
                    type="text"
                    required
                    value={addForm.data.organization}
                    onChange={(e) => addForm.setData('organization', e.target.value)}
                    placeholder="Shipping Corporation of India"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Designation</label>
                  <input
                    type="text"
                    value={addForm.data.designation}
                    onChange={(e) => addForm.setData('designation', e.target.value)}
                    placeholder="Executive Director"
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Pass Tier</label>
                  <select
                    value={addForm.data.pass_tier}
                    onChange={(e) => addForm.setData('pass_tier', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="Standard Delegate Pass">Standard Delegate Pass</option>
                    <option value="VIP Executive Pass">VIP Executive Pass</option>
                    <option value="Speaker Pass">Speaker Pass</option>
                    <option value="Sponsor Tier">Sponsor Tier</option>
                    <option value="Startup Pitch">Startup Pitch</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={addForm.data.status}
                    onChange={(e) => addForm.setData('status', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={addForm.data.type}
                    onChange={(e) => addForm.setData('type', e.target.value)}
                    className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl px-3 py-2 text-white outline-none focus:border-[#22C55E]"
                  >
                    <option value="delegate">Delegate</option>
                    <option value="speaker">Speaker</option>
                    <option value="sponsor">Sponsor</option>
                    <option value="awards">Awards</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">Notes / Message</label>
                <textarea
                  rows={2}
                  value={addForm.data.message}
                  onChange={(e) => addForm.setData('message', e.target.value)}
                  placeholder="Special accommodations, VIP escort, table requirements..."
                  className="w-full bg-[#070E1B] border border-[#1E3A68] rounded-xl p-3 text-white outline-none focus:border-[#22C55E]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#112344] text-slate-300 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addForm.processing}
                  className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-[#0A1E3F] font-bold disabled:opacity-50"
                >
                  {addForm.processing ? 'Saving...' : 'Save Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
