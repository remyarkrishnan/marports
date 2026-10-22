import React, { useState, useMemo } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';
import {
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  ArrowUpDown,
  Building,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  AlertTriangle,
  Eye,
  Download,
} from 'lucide-react';
import { resolveAsset } from '../../utils/asset';

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

export default function AdvisoryBoard({
  members = [],
  metrics = {},
  existingPdfFiles = [],
}) {
  const { flash, adminUrls = {} } = usePage().props;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteConfirmMember, setDeleteConfirmMember] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Form for Add & Edit
  const form = useForm({
    name: '',
    designation: '',
    company: '',
    role: 'Advisory Board',
    initials: '',
    bio: '',
    bio_file: '',
    bio_file_upload: null,
    remove_bio_file: false,
    description: '',
    linkedin: '',
    sort_order: 1,
    is_active: true,
    image_file: null,
    image_url: '',
    remove_image: false,
  });

  const openAddModal = () => {
    setEditingMember(null);
    setImagePreview(null);
    form.reset();

    const maxOrder = members.length > 0
      ? Math.max(...members.map((m) => m.sort_order || 1))
      : 0;
    const nextOrder = maxOrder + 1;

    form.setData({
      name: '',
      designation: '',
      company: '',
      role: 'Advisory Board',
      initials: '',
      bio: '',
      bio_file: '',
      bio_file_upload: null,
      remove_bio_file: false,
      description: '',
      linkedin: '',
      sort_order: nextOrder,
      is_active: true,
      image_file: null,
      image_url: '',
      remove_image: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    setImagePreview(member.image ? resolveAsset(member.image) : null);
    form.reset();

    form.setData({
      name: member.name || '',
      designation: member.designation || '',
      company: member.company || '',
      role: member.role || 'Advisory Board',
      initials: member.initials || '',
      bio: member.bio || '',
      bio_file: member.bio_file || '',
      bio_file_upload: null,
      remove_bio_file: false,
      description: member.description || '',
      linkedin: member.linkedin || '',
      sort_order: member.sort_order ?? 1,
      is_active: Boolean(member.is_active),
      image_file: null,
      image_url: member.image || '',
      remove_image: false,
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setData('image_file', file);
      form.setData('remove_image', false);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    form.setData('image_file', null);
    form.setData('image_url', '');
    form.setData('remove_image', true);
  };

  const handleBioFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setData('bio_file_upload', file);
      form.setData('remove_bio_file', false);
    }
  };

  const handleRemoveBioFile = () => {
    form.setData('bio_file_upload', null);
    form.setData('bio_file', '');
    form.setData('remove_bio_file', true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.data.name.trim()) {
      alert('Please enter member name.');
      return;
    }

    const payload = {
      ...form.data,
      role: form.data.role.trim() || 'Advisory Board',
    };

    if (editingMember) {
      const updateUrl = `/cms/advisory-board/${editingMember.id}`;
      router.post(updateUrl, payload, {
        forceFormData: true,
        onSuccess: () => {
          setModalOpen(false);
          setEditingMember(null);
          form.reset();
        },
      });
    } else {
      const storeUrl = adminUrls.advisoryBoardStore || '/cms/advisory-board';
      router.post(storeUrl, payload, {
        forceFormData: true,
        onSuccess: () => {
          setModalOpen(false);
          form.reset();
        },
      });
    }
  };

  const handleToggleActive = (member) => {
    router.post(`/cms/advisory-board/${member.id}/toggle-active`, {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirmMember) return;
    router.delete(`/cms/advisory-board/${deleteConfirmMember.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmMember(null);
      },
    });
  };

  // Filtered members
  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      // Search query
      const matchesSearch =
        searchQuery === '' ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.initials?.toLowerCase().includes(searchQuery.toLowerCase());

      // Status
      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'ACTIVE' && member.is_active) ||
        (selectedStatusFilter === 'INACTIVE' && !member.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [members, searchQuery, selectedStatusFilter]);

  return (
    <AdminLayout
      title="Advisory Board 2027"
      subtitle="Strategic Governance & High-Level Advisory Council Members for MARPORTS GLOBAL 2027"
      headerActions={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] hover:brightness-105 text-[#0A1E3F] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Advisory Board Member</span>
          </button>
        </div>
      }
    >
      <Head title="Advisory Board 2027 - CMS" />

      <div className="space-y-6">
        {/* Flash Message */}
        {flash?.success && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{flash.success}</span>
            </div>
          </div>
        )}

        {/* 1. Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Members
              </span>
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white mt-2">
              {metrics.total || members.length}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Governance leaders recorded
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                Active & Live
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-2">
              {metrics.active ?? members.filter((m) => m.is_active).length}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Visible on website grid
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Hidden / Draft
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <XCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-amber-400 mt-2">
              {metrics.inactive ?? members.filter((m) => !m.is_active).length}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Temporarily unlisted
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                With Bio PDF
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-indigo-400 mt-2">
              {metrics.with_bio_file ?? members.filter((m) => m.bio_file).length}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Direct PDF downloads
            </span>
          </div>
        </div>

        {/* 2. Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747] flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, title, organization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#D9A441] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="flex items-center gap-1 bg-[#070E1B] p-1 rounded-xl border border-[#152747]">
              {[
                { key: 'ALL', label: 'All' },
                { key: 'ACTIVE', label: 'Active' },
                { key: 'INACTIVE', label: 'Hidden' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStatusFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedStatusFilter === tab.key
                      ? 'bg-[#D9A441] text-[#0A1E3F] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. Members Grid */}
        {filteredMembers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0A1529] border border-[#152747] space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#152747] text-slate-400 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white">No Advisory Board Members Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery || selectedStatusFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter to locate members.'
                : 'Click "Add Advisory Board Member" to add governance leaders to the 2027 edition.'}
            </p>
            {!searchQuery && selectedStatusFilter === 'ALL' && (
              <button
                type="button"
                onClick={openAddModal}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D9A441] hover:bg-[#F0D9A0] text-[#0A1E3F] text-xs font-bold transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Member</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMembers.map((member) => {
              const imageUrl = member.image ? resolveAsset(member.image) : null;
              const hasBioFile = Boolean(member.bio_file);
              const downloadUrl = hasBioFile
                ? resolveAsset(member.bio_file)
                : `/panel-chair-bio/${member.id}?print=1`;

              return (
                <div
                  key={member.id}
                  className={`relative bg-[#0A1529] border rounded-2xl overflow-hidden transition-all duration-200 flex flex-col justify-between group ${
                    member.is_active
                      ? 'border-[#152747] hover:border-[#D9A441]/50'
                      : 'border-amber-900/40 opacity-75'
                  }`}
                >
                  {/* Top Bar with Sort Order and Status */}
                  <div className="p-4 flex items-center justify-between border-b border-[#152747]/60 bg-[#070E1B]/50">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <ArrowUpDown className="w-3.5 h-3.5 text-[#D9A441]" />
                      <span className="font-semibold text-slate-300">#{member.sort_order}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          member.is_active
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.is_active ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        {member.is_active ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-start gap-4">
                      {/* Photo or Initials Avatar */}
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-tr from-[#0A1E3F] to-[#0E4B75] border border-[#152747] shrink-0">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.parentElement.querySelector('.initials-fallback');
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className={`initials-fallback w-full h-full text-[#F0D9A0] font-serif-heading font-extrabold text-lg flex items-center justify-center ${
                            imageUrl ? 'hidden' : 'flex'
                          }`}
                        >
                          {member.initials || 'AB'}
                        </div>
                      </div>

                      {/* Header info */}
                      <div className="min-w-0 flex-1">
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#D9A441] bg-[#D9A441]/10 px-2 py-0.5 rounded-md border border-[#D9A441]/20 mb-1">
                          {member.role || 'Advisory Board'}
                        </span>
                        <h3 className="text-sm font-bold text-white truncate leading-snug">
                          {member.name}
                        </h3>
                        {member.designation && (
                          <p className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                            {member.designation}
                          </p>
                        )}
                        {member.company && (
                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                            <Building className="w-3 h-3 text-[#D9A441] shrink-0" />
                            <span className="truncate">{member.company}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Bio status badge */}
                    <div className="mt-4 pt-3 border-t border-[#152747]/60 flex items-center justify-between text-xs">
                      {hasBioFile ? (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                          <FileText className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-[11px]">Bio: Uploaded PDF</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-[11px]">Bio: Built-in Content</span>
                        </div>
                      )}

                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#0077b5] hover:text-sky-300 transition-colors p-1"
                          title="LinkedIn Profile"
                        >
                          <LinkedInIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-[#070E1B] border-t border-[#152747] flex items-center justify-between gap-2">
                    {/* Download Bio Action */}
                    <a
                      href={downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...(hasBioFile ? { download: `${member.name.replace(/\s+/g, '_')}_Bio.pdf` } : {})}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0A1529] hover:bg-[#112344] text-[#D9A441] hover:text-[#F0D9A0] text-xs font-medium flex items-center gap-1.5 border border-[#152747] transition-colors"
                      title={hasBioFile ? `Download ${member.name} Bio PDF` : `Download ${member.name} Bio as PDF (Print View)`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Bio</span>
                    </a>

                    <div className="flex items-center gap-1">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(member)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          member.is_active
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                        }`}
                        title={member.is_active ? 'Click to Hide from Website' : 'Click to Make Live on Website'}
                      >
                        {member.is_active ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="p-1.5 rounded-lg bg-[#0A1529] hover:bg-[#112344] text-sky-400 hover:text-sky-200 border border-[#152747] transition-colors cursor-pointer"
                        title="Edit Advisory Board Member"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmMember(member)}
                        className="p-1.5 rounded-lg bg-[#0A1529] hover:bg-rose-950/50 text-rose-400 hover:text-rose-200 border border-[#152747] hover:border-rose-500/30 transition-colors cursor-pointer"
                        title="Delete Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0A1529] border border-[#152747] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#152747]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#D9A441] block mb-1">
                  Advisory Board Council
                </span>
                <h2 className="text-lg font-bold text-white">
                  {editingMember ? `Edit ${editingMember.name}` : 'Add Advisory Board Member'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Strategic governance and high-level advisory leadership for MARPORTS GLOBAL 2027.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#152747] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Full Name & Honors <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cmde PR Hari, IN (Retd.)"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Council Role / Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Advisory Board, Strategic Advisor"
                    value={form.data.role}
                    onChange={(e) => form.setData('role', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Row 2: Designation & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chairman & Managing Director"
                    value={form.data.designation}
                    onChange={(e) => form.setData('designation', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Garden Reach Shipbuilders & Engineers Ltd"
                    value={form.data.company}
                    onChange={(e) => form.setData('company', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Row 3: Initials & LinkedIn */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Initials (Avatar Fallback)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="e.g. PRH"
                    value={form.data.initials}
                    onChange={(e) => form.setData('initials', e.target.value.toUpperCase())}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs uppercase"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Auto-generated from name if left empty
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.linkedin.com/in/..."
                    value={form.data.linkedin}
                    onChange={(e) => form.setData('linkedin', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Row 4: Photograph Upload */}
              <div className="p-4 rounded-2xl bg-[#081120] border border-[#152747] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-200 font-semibold text-xs flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#D9A441]" />
                    <span>Member Photograph</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    JPG, PNG, or WEBP (Max 10MB)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Preview avatar */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#0A1E3F] to-[#0E4B75] border border-[#152747] shrink-0 flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <span className="text-xl font-bold font-serif-heading text-[#F0D9A0]">
                        {form.data.initials || 'AB'}
                      </span>
                    )}

                    {imagePreview && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-1 right-1 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 w-full space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#1B3563] bg-[#070E1B] hover:bg-[#0A1529] text-slate-300 hover:text-white cursor-pointer transition-colors text-xs font-semibold">
                      <Upload className="w-4 h-4 text-[#D9A441]" />
                      <span>Choose Photo from Computer...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div>
                      <input
                        type="text"
                        placeholder="Or paste image URL (e.g. /images/advisory/...)"
                        value={form.data.image_url}
                        onChange={(e) => {
                          form.setData('image_url', e.target.value);
                          if (e.target.value) {
                            setImagePreview(resolveAsset(e.target.value));
                            form.setData('remove_image', false);
                          }
                        }}
                        className="w-full px-3 py-1.5 bg-[#070E1B] border border-[#152747] rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D9A441] transition-colors text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 5: Member Bio File (PDF) */}
              <div className="p-4 rounded-2xl bg-[#081120] border border-[#152747] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D9A441]" />
                    <label className="text-slate-200 font-semibold text-xs">
                      Member Bio File (PDF)
                    </label>
                  </div>
                  <span className="text-[10px] text-[#22C55E]">
                    Uploaded PDF will be downloaded when visitors click "Download Bio"
                  </span>
                </div>

                {/* Info banner for existing members who have built-in description */}
                {editingMember && !form.data.bio_file && !form.data.bio_file_upload && editingMember.bio && (
                  <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                    <span className="font-semibold text-amber-300">Current Bio:</span> Built-in description is active for Download Bio. Uploading a new PDF here will replace that text and the PDF will be downloaded directly.
                  </div>
                )}

                {/* Currently attached file preview */}
                {(form.data.bio_file || form.data.bio_file_upload) && !form.data.remove_bio_file && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="text-xs font-semibold text-emerald-200 truncate">
                        {form.data.bio_file_upload
                          ? `New upload: ${form.data.bio_file_upload.name}`
                          : form.data.bio_file.split('/').pop()}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {form.data.bio_file && !form.data.bio_file_upload && (
                        <a
                          href={resolveAsset(form.data.bio_file)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-1 rounded bg-[#0A1529] hover:bg-[#112344] text-[10px] text-sky-300 font-semibold border border-[#152747]"
                        >
                          View File
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={handleRemoveBioFile}
                        className="p-1 rounded text-rose-400 hover:text-rose-200 hover:bg-rose-950/50"
                        title="Remove Bio File"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* File Upload Button */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-1 font-medium">
                      Upload PDF from Computer:
                    </span>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#1B3563] bg-[#070E1B] hover:bg-[#0A1529] text-slate-300 hover:text-white cursor-pointer transition-colors text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Choose PDF File...</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleBioFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Pick from existing folder files */}
                  <div>
                    <span className="block text-[11px] text-slate-400 mb-1 font-medium">
                      Or Pick Existing Folder Bio:
                    </span>
                    <select
                      value={form.data.bio_file || ''}
                      onChange={(e) => {
                        form.setData('bio_file', e.target.value);
                        form.setData('remove_bio_file', false);
                      }}
                      className="w-full px-3 py-2 bg-[#070E1B] border border-[#152747] rounded-xl text-white text-xs focus:outline-none focus:border-[#D9A441] cursor-pointer"
                    >
                      <option value="">-- Select from existing files --</option>
                      {existingPdfFiles.map((pdf) => (
                        <option key={pdf.path} value={pdf.path}>
                          {pdf.filename}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Row 6: Sort Order & Active */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-slate-300 font-semibold text-xs mb-1.5">
                    Display Sort Order <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    required
                    value={form.data.sort_order}
                    onChange={(e) => form.setData('sort_order', parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white text-xs focus:outline-none focus:border-[#D9A441]"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    Lower numbers appear first on the advisory board grid
                  </span>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.data.is_active}
                      onChange={(e) => form.setData('is_active', e.target.checked)}
                      className="w-4 h-4 rounded text-[#D9A441] focus:ring-[#D9A441] bg-[#070E1B] border-[#152747]"
                    />
                    <div>
                      <span className="text-xs font-semibold text-white block">
                        Visible on Public Website
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Displayed in the Advisory Board 2027 section
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#152747]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#152747] bg-[#070E1B] hover:bg-[#112344] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#F0D9A0] hover:brightness-105 text-[#0A1E3F] text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {form.processing ? 'Saving...' : editingMember ? 'Update Member' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#0A1529] border border-[#152747] rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Advisory Board Member?</h3>
                <p className="text-xs text-slate-400">This action will remove the member from the CMS and public website.</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#070E1B] border border-[#152747] text-xs space-y-1">
              <div className="font-bold text-white">{deleteConfirmMember.name}</div>
              <div className="text-slate-400">{deleteConfirmMember.designation}</div>
              <div className="text-slate-500">{deleteConfirmMember.company}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmMember(null)}
                className="px-4 py-2 rounded-xl border border-[#152747] bg-[#070E1B] hover:bg-[#112344] text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
