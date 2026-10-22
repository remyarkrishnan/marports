import React, { useState, useMemo } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ExternalLink,
  Layers,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  AlertCircle,
  Save,
  Check,
  Building,
  HelpCircle,
  FileText,
  ArrowUpDown,
  Mic,
  Award,
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

export default function Speakers({
  speakers = [],
  metrics = {},
  existingRoles = [],
  existingPdfFiles = [],
}) {
  const { flash, adminUrls = {} } = usePage().props;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [deleteConfirmSpeaker, setDeleteConfirmSpeaker] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Common preset roles
  const defaultRoles = [
    'Panelist',
    'Moderator',
    'Keynote Speaker',
    'Guest Speaker',
    'Advisory Speaker',
  ];

  const allAvailableRoles = useMemo(() => {
    const set = new Set([...defaultRoles, ...existingRoles]);
    return Array.from(set);
  }, [existingRoles]);

  // Form for Add & Edit
  const form = useForm({
    name: '',
    designation: '',
    company: '',
    role: 'Panelist',
    custom_role: '',
    bio: '',
    bio_file: '',
    bio_file_upload: null,
    remove_bio_file: false,
    description: '',
    linkedin: '',
    topic: '',
    sort_order: 1,
    is_active: true,
    image_file: null,
    image_url: '',
    remove_image: false,
  });

  const openAddModal = () => {
    setEditingSpeaker(null);
    setImagePreview(null);
    form.reset();

    const nextOrder = speakers.length > 0
      ? Math.max(...speakers.map((s) => Number(s.sort_order) || 1)) + 1
      : 1;

    form.setData({
      name: '',
      designation: '',
      company: '',
      role: 'Panelist',
      custom_role: '',
      bio: '',
      bio_file: '',
      bio_file_upload: null,
      remove_bio_file: false,
      description: '',
      linkedin: '',
      topic: '',
      sort_order: nextOrder,
      is_active: true,
      image_file: null,
      image_url: '',
      remove_image: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (speaker) => {
    setEditingSpeaker(speaker);
    setImagePreview(speaker.image ? resolveAsset(speaker.image) : null);
    form.reset();

    const isCustomRole = !defaultRoles.includes(speaker.role);
    form.setData({
      name: speaker.name || '',
      designation: speaker.designation || '',
      company: speaker.company || '',
      role: isCustomRole ? 'CUSTOM' : (speaker.role || 'Panelist'),
      custom_role: isCustomRole ? speaker.role : '',
      bio: speaker.bio || '',
      bio_file: speaker.bio_file || '',
      bio_file_upload: null,
      remove_bio_file: false,
      description: speaker.description || '',
      linkedin: speaker.linkedin || '',
      topic: speaker.topic || '',
      sort_order: speaker.sort_order ?? 1,
      is_active: Boolean(speaker.is_active),
      image_file: null,
      image_url: speaker.image || '',
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

    const resolvedRole = form.data.role === 'CUSTOM'
      ? form.data.custom_role.trim()
      : form.data.role;

    if (!form.data.name.trim()) {
      alert('Please enter panel member name.');
      return;
    }

    const payload = {
      ...form.data,
      role: resolvedRole || 'Panelist',
    };

    if (editingSpeaker) {
      const updateUrl = `/cms/panel-members/${editingSpeaker.id}`;
      router.post(updateUrl, payload, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
          setEditingSpeaker(null);
          setImagePreview(null);
        },
      });
    } else {
      const storeUrl = adminUrls.speakersStore || '/cms/panel-members';
      router.post(storeUrl, payload, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
          setImagePreview(null);
          form.reset();
        },
      });
    }
  };

  const handleToggleActive = (speaker) => {
    router.post(`/cms/panel-members/${speaker.id}/toggle-active`, {}, {
      preserveScroll: true,
    });
  };

  const handleDelete = () => {
    if (!deleteConfirmSpeaker) return;
    router.delete(`/cms/panel-members/${deleteConfirmSpeaker.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmSpeaker(null);
      },
    });
  };

  // Filtered Speakers
  const filteredSpeakers = useMemo(() => {
    return speakers.filter((speaker) => {
      // Search matching
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        speaker.name?.toLowerCase().includes(query) ||
        speaker.designation?.toLowerCase().includes(query) ||
        speaker.company?.toLowerCase().includes(query) ||
        speaker.role?.toLowerCase().includes(query) ||
        speaker.bio?.toLowerCase().includes(query) ||
        speaker.topic?.toLowerCase().includes(query);

      // Role filter
      const matchesRole =
        selectedRoleFilter === 'ALL' ||
        speaker.role?.toLowerCase() === selectedRoleFilter.toLowerCase();

      // Status filter
      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'ACTIVE' && speaker.is_active) ||
        (selectedStatusFilter === 'INACTIVE' && !speaker.is_active);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [speakers, searchQuery, selectedRoleFilter, selectedStatusFilter]);

  return (
    <AdminLayout
      title="Industry Thought Leaders & Panel Members"
      subtitle="Manage panel members, keynotes, and thought leaders displayed in the Industry Thought Leaders section of the live summit website."
      headerActions={
        <div className="flex items-center gap-3">
          <a
            href="/#speakers-board"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0A1529] hover:bg-[#112344] text-slate-300 hover:text-white border border-[#152747] text-xs font-semibold transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D9A441]" />
            <span>View Section on Website</span>
          </a>
          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-[#0A1E3F] font-bold text-xs shadow-md shadow-emerald-500/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Panel Member</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
        {/* Flash Message */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{flash.success}</span>
            </div>
          </div>
        )}
        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{flash.error}</span>
            </div>
          </div>
        )}

        {/* 1. Metric Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1529] border border-[#152747] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Members</span>
              <Users className="w-4 h-4 text-[#22C55E]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {metrics.total ?? speakers.length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>All confirmed thought leaders</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1529] border border-[#152747] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Visible on Website</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              {metrics.active ?? speakers.filter((s) => s.is_active).length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Currently public in Panel section</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1529] border border-[#152747] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Hidden / Draft</span>
              <EyeOff className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              {metrics.inactive ?? speakers.filter((s) => !s.is_active).length}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Excluded from public view</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-[#0A1529] border border-[#152747] shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Distinct Roles</span>
              <Sparkles className="w-4 h-4 text-[#D9A441]" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#D9A441] font-mono">
              {metrics.roles ?? new Set(speakers.map((s) => s.role)).size}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
              <span>Panelists, Moderators, Keynotes</span>
            </div>
          </div>
        </div>

        {/* 2. Controls Bar: Search, Filters, View Modes */}
        <div className="p-4 rounded-2xl bg-[#0A1529] border border-[#152747] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-sm">
          {/* Left: Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, title, company, bio, topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#070E1B] border border-[#152747] rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors"
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

          {/* Right: Filters & View Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Role */}
            <div className="flex items-center gap-1.5 bg-[#070E1B] border border-[#152747] rounded-xl px-2.5 py-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedRoleFilter}
                onChange={(e) => setSelectedRoleFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0A1529] text-white">All Roles</option>
                {allAvailableRoles.map((role) => (
                  <option key={role} value={role} className="bg-[#0A1529] text-white">
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-[#070E1B] border border-[#152747] rounded-xl px-2.5 py-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-[#0A1529] text-white">All Status</option>
                <option value="ACTIVE" className="bg-[#0A1529] text-white">Visible on Website</option>
                <option value="INACTIVE" className="bg-[#0A1529] text-white">Hidden / Inactive</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#070E1B] border border-[#152747] rounded-xl p-1">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#22C55E] text-[#0A1E3F] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cards Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-[#22C55E] text-[#0A1E3F] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Table View
              </button>
            </div>
          </div>
        </div>

        {/* 3. Helper Info Box */}
        <div className="p-3.5 rounded-xl bg-[#0E1E38] border border-[#1B3563] flex items-start gap-2.5 text-xs text-slate-300">
          <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Live Website Section: </strong>
            Panel members are automatically rendered under <strong className="text-[#D9A441]">INDUSTRY THOUGHT LEADERS &gt; Panel Members</strong> on the homepage and on the dedicated <strong className="text-white">Speakers & Panelists</strong> page. The order is determined by the <strong>Sort Order</strong> (lower numbers appear first).
          </div>
        </div>

        {/* 4. Content Area: Grid View or Table View */}
        {filteredSpeakers.length === 0 ? (
          <div className="p-12 text-center bg-[#0A1529] border border-[#152747] rounded-2xl shadow-sm">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white">No panel members found</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedRoleFilter !== 'ALL' || selectedStatusFilter !== 'ALL'
                ? 'Try clearing or modifying your search filters above.'
                : 'Get started by adding your first panel member or speaker.'}
            </p>
            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#22C55E] text-[#0A1E3F] font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Panel Member</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Cards Grid Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpeakers.map((speaker) => {
              const imageUrl = resolveAsset(speaker.image);
              return (
                <div
                  key={speaker.id}
                  className="bg-[#0A1529] border border-[#152747] hover:border-[#D9A441]/50 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Area with Badges */}
                    <div className="relative aspect-[16/10] bg-[#070E1B] overflow-hidden">
                      {speaker.image ? (
                        <img
                          src={imageUrl}
                          alt={speaker.name}
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#0A1E3F] to-[#070E1B] text-slate-500">
                          <Users className="w-12 h-12 mb-1 text-slate-600" />
                          <span className="text-[11px] font-mono">No Photo Uploaded</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A1529] via-transparent to-transparent opacity-80" />

                      {/* Role Badge */}
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D9A441]/40 shadow-sm">
                        {speaker.role || 'Panelist'}
                      </span>

                      {/* Sort Order Badge */}
                      <span className="absolute top-3 right-3 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#070E1B]/90 text-slate-300 border border-[#152747]">
                        Order: #{speaker.sort_order}
                      </span>

                      {/* Status indicator pill */}
                      <div className="absolute bottom-3 left-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            speaker.is_active
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              speaker.is_active ? 'bg-emerald-400' : 'bg-amber-400'
                            }`}
                          />
                          {speaker.is_active ? 'Live on Site' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* Member Details */}
                    <div className="p-5">
                      <h3 className="text-base font-bold text-white group-hover:text-[#F0D9A0] transition-colors leading-snug">
                        {speaker.name}
                      </h3>

                      {speaker.designation && (
                        <p className="text-xs font-semibold text-[#D9A441] uppercase tracking-wide mt-1">
                          {speaker.designation}
                        </p>
                      )}

                      {speaker.company && (
                        <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                          {speaker.company}
                        </p>
                      )}

                      {speaker.topic && (
                        <div className="mt-2.5 px-2.5 py-1 rounded-lg bg-[#070E1B] border border-[#152747] text-[11px] text-slate-400">
                          <strong className="text-slate-300">Topic:</strong> {speaker.topic}
                        </div>
                      )}

                      {/* Bio preview */}
                      {speaker.bio && (
                        <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                          {speaker.bio}
                        </p>
                      )}

                      {/* Bio PDF badge if attached */}
                      {speaker.bio_file && (
                        <div className="mt-3 flex items-center gap-1.5 p-2 rounded-xl bg-[#070E1B] border border-[#152747] text-[11px] text-emerald-400 font-medium">
                          <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate flex-1">
                            Bio PDF: {speaker.bio_file.split('/').pop()}
                          </span>
                          <a
                            href={resolveAsset(speaker.bio_file)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-sky-400 hover:underline shrink-0"
                          >
                            Open
                          </a>
                        </div>
                      )}

                      {/* Social links */}
                      {speaker.linkedin && (
                        <div className="mt-3">
                          <a
                            href={speaker.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[11px] text-[#0077b5] hover:text-sky-300 transition-colors font-medium"
                          >
                            <LinkedInIcon className="w-3 h-3" />
                            <span>LinkedIn Profile</span>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-3 bg-[#070E1B] border-t border-[#152747] flex items-center justify-between gap-2">
                    {/* Bio Download Action */}
                    <a
                      href={speaker.bio_file ? resolveAsset(speaker.bio_file) : `/speaker-bio/${speaker.id}?print=1`}
                      target="_blank"
                      rel="noopener noreferrer"
                      {...(speaker.bio_file ? { download: `${speaker.name ? speaker.name.replace(/\s+/g, '_') : 'Speaker'}_Bio.pdf` } : {})}
                      className="px-2.5 py-1.5 rounded-lg bg-[#0A1529] hover:bg-[#112344] text-[#D9A441] hover:text-[#F0D9A0] text-xs font-medium flex items-center gap-1.5 border border-[#152747] transition-colors"
                      title={speaker.bio_file ? `Download ${speaker.name} Bio PDF` : `Download ${speaker.name} Bio as PDF (Print View)`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Bio</span>
                    </a>

                    <div className="flex items-center gap-1">
                      {/* Toggle Active Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(speaker)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          speaker.is_active
                            ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                            : 'bg-amber-950/40 text-amber-300 border-amber-500/30 hover:bg-amber-900/60'
                        }`}
                        title={speaker.is_active ? 'Click to Hide from Website' : 'Click to Make Live on Website'}
                      >
                        {speaker.is_active ? (
                          <Eye className="w-3.5 h-3.5" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => openEditModal(speaker)}
                        className="p-1.5 rounded-lg bg-[#0A1529] hover:bg-[#112344] text-sky-400 border border-[#152747] hover:border-sky-500/40 transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmSpeaker(speaker)}
                        className="p-1.5 rounded-lg bg-[#0A1529] hover:bg-rose-950/50 text-rose-400 border border-[#152747] hover:border-rose-500/40 transition-colors cursor-pointer"
                        title="Delete Panel Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Table View Mode */
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#070E1B] text-slate-400 uppercase tracking-wider text-[10px] font-bold border-b border-[#152747]">
                  <tr>
                    <th className="py-3.5 px-4 w-12 text-center">#</th>
                    <th className="py-3.5 px-4">Member</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Designation & Company</th>
                    <th className="py-3.5 px-4">Order</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#152747]">
                  {filteredSpeakers.map((speaker) => {
                    const imageUrl = resolveAsset(speaker.image);
                    return (
                      <tr key={speaker.id} className="hover:bg-[#081120] transition-colors">
                        <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                          {speaker.id}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#070E1B] border border-[#152747] overflow-hidden shrink-0">
                              {speaker.image ? (
                                <img
                                  src={imageUrl}
                                  alt={speaker.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                  <Users className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">
                                {speaker.name}
                              </div>
                              {speaker.linkedin && (
                                <a
                                  href={speaker.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-[#0077b5] hover:underline flex items-center gap-1 mt-0.5"
                                >
                                  <LinkedInIcon className="w-2.5 h-2.5" />
                                  <span>LinkedIn</span>
                                </a>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#F0D9A0] bg-[#0A1E3F] px-2.5 py-1 rounded-full border border-[#D9A441]/40">
                            {speaker.role || 'Panelist'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="text-white font-medium truncate">
                            {speaker.designation || '—'}
                          </div>
                          <div className="text-slate-400 text-[11px] truncate mt-0.5">
                            {speaker.company || '—'}
                          </div>
                          {speaker.bio_file && (
                            <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-1 truncate">
                              <FileText className="w-3 h-3 shrink-0" />
                              <span className="truncate">{speaker.bio_file.split('/').pop()}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-300">
                          #{speaker.sort_order}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(speaker)}
                            className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                              speaker.is_active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                speaker.is_active ? 'bg-emerald-400' : 'bg-amber-400'
                              }`}
                            />
                            {speaker.is_active ? 'Live' : 'Hidden'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/speaker-bio/${speaker.id}?print=1`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg bg-[#070E1B] hover:bg-[#112344] text-[#D9A441] border border-[#152747] transition-colors"
                              title="Download Bio as PDF (as on Website)"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => openEditModal(speaker)}
                              className="p-1.5 rounded-lg bg-[#070E1B] hover:bg-[#112344] text-sky-400 border border-[#152747] transition-colors cursor-pointer"
                              title="Edit Member"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmSpeaker(speaker)}
                              className="p-1.5 rounded-lg bg-[#070E1B] hover:bg-rose-950/50 text-rose-400 border border-[#152747] transition-colors cursor-pointer"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 5. ADD & EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0A1529] border border-[#152747] rounded-3xl shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#081120] border-b border-[#152747] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#22C55E]/20 to-[#16A34A]/10 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    {editingSpeaker ? 'Edit Panel Member' : 'Add Panel Member'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingSpeaker
                      ? `Updating details for ${editingSpeaker.name}`
                      : 'Add a new thought leader under Industry Thought Leaders'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#112344] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Row 1: Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Antony Prince"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                  {form.errors.name && (
                    <p className="text-rose-400 text-[11px] mt-1">{form.errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Role / Position Badge <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={form.data.role}
                    onChange={(e) => form.setData('role', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  >
                    {defaultRoles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                    <option value="CUSTOM">+ Other / Custom Role...</option>
                  </select>
                </div>
              </div>

              {/* Custom Role Input if selected */}
              {form.data.role === 'CUSTOM' && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Specify Custom Role <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Keynote Panelist, Session Chair"
                    value={form.data.custom_role}
                    onChange={(e) => form.setData('custom_role', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                </div>
              )}

              {/* Row 2: Title/Designation & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Title / Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. President & CEO, Visiting Fellow"
                    value={form.data.designation}
                    onChange={(e) => form.setData('designation', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Smart Engineering & Design Solutions Ltd."
                    value={form.data.company}
                    onChange={(e) => form.setData('company', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Row 3: Photo / Image Upload & Preview */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">
                  Member Photograph / Image
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  {/* Image Preview Box */}
                  <div className="relative w-full h-28 rounded-xl bg-[#070E1B] border border-[#152747] flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover object-top"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors cursor-pointer"
                          title="Remove Image"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500 p-2 text-center">
                        <ImageIcon className="w-6 h-6 mb-1 text-slate-600" />
                        <span className="text-[10px]">No image selected</span>
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block px-3.5 py-2.5 rounded-xl border border-dashed border-[#1B3563] bg-[#070E1B]/60 hover:bg-[#070E1B] text-slate-300 hover:text-white cursor-pointer text-center transition-colors">
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-[#22C55E]" />
                        <span className="font-semibold text-xs">Choose Photo File</span>
                      </div>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        PNG, JPG, JPEG, WEBP up to 10MB
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    {/* Or URL option */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400 shrink-0">Or Image URL:</span>
                      <input
                        type="text"
                        placeholder="/images/speakers/name.jpg or https://..."
                        value={form.data.image_url}
                        onChange={(e) => {
                          form.setData('image_url', e.target.value);
                          if (e.target.value) {
                            setImagePreview(resolveAsset(e.target.value));
                            form.setData('remove_image', false);
                          }
                        }}
                        className="w-full px-2.5 py-1.5 bg-[#070E1B] border border-[#152747] rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Panelist Bio File Upload (Downloaded when visitors click 'Download Bio') */}
              <div className="p-4 rounded-2xl bg-[#081120] border border-[#152747] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#D9A441]" />
                    <label className="text-slate-200 font-semibold text-xs">
                      Panelist Bio File (PDF)
                    </label>
                  </div>
                  <span className="text-[10px] text-[#22C55E]">
                    Uploaded PDF will be downloaded when visitors click "Download Bio"
                  </span>
                </div>

                {/* Info banner for existing panelists who have built-in description */}
                {editingSpeaker && !form.data.bio_file && !form.data.bio_file_upload && editingSpeaker.bio && (
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
                      Upload from Computer:
                    </span>
                    <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#1B3563] bg-[#070E1B] hover:bg-[#0A1529] text-slate-300 hover:text-white cursor-pointer transition-colors text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5 text-[#22C55E]" />
                      <span>Choose Bio File...</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={handleBioFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Or select from existing files in public/pdf */}
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
                      className="w-full px-3 py-2 bg-[#070E1B] border border-[#152747] rounded-xl text-white text-xs focus:outline-none focus:border-[#22C55E] cursor-pointer"
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

              {/* Row 5: Short Description / Topic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Short Description / Summary (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Leading trade facilitation specialist across 50+ ports"
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Session Topic / Focus Area (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Decarbonization & Green Corridors"
                    value={form.data.topic}
                    onChange={(e) => form.setData('topic', e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                  />
                </div>
              </div>

              {/* Row 6: LinkedIn URL & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    LinkedIn Profile URL
                  </label>
                  <div className="relative">
                    <LinkedInIcon className="w-3.5 h-3.5 text-[#0077b5] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="url"
                      placeholder="https://www.linkedin.com/in/username"
                      value={form.data.linkedin}
                      onChange={(e) => form.setData('linkedin', e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#22C55E] transition-colors text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1.5">
                    Display Sort Order <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="999"
                    required
                    value={form.data.sort_order}
                    onChange={(e) => form.setData('sort_order', parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2.5 bg-[#070E1B] border border-[#152747] rounded-xl text-white focus:outline-none focus:border-[#22C55E] transition-colors text-xs font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Lower numbers (e.g. 1, 2) appear first on website
                  </span>
                </div>
              </div>

              {/* Row 7: Visibility Toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 rounded-xl bg-[#070E1B] border border-[#152747] cursor-pointer hover:border-[#1E3A68] transition-colors">
                  <input
                    type="checkbox"
                    checked={form.data.is_active}
                    onChange={(e) => form.setData('is_active', e.target.checked)}
                    className="w-4 h-4 rounded text-[#22C55E] focus:ring-emerald-500 focus:ring-offset-0 bg-[#0A1529] border-[#152747]"
                  />
                  <div>
                    <span className="font-semibold text-white block">
                      Visible on Public Website
                    </span>
                    <span className="text-[11px] text-slate-400 block">
                      When checked, this panel member will immediately appear in the Industry Thought Leaders section.
                    </span>
                  </div>
                </label>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-[#152747] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#070E1B] hover:bg-[#112344] text-slate-300 text-xs font-semibold border border-[#152747] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#22C55E] hover:bg-emerald-400 text-[#0A1E3F] font-bold text-xs shadow-md shadow-emerald-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {form.processing ? (
                    <span>Saving...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{editingSpeaker ? 'Update Member' : 'Save & Publish Member'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. DELETE CONFIRMATION MODAL */}
      {deleteConfirmSpeaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#0A1529] border border-[#152747] rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Delete Panel Member?
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Are you sure you want to delete <strong className="text-white">"{deleteConfirmSpeaker.name}"</strong>? This will remove them from the Industry Thought Leaders section on the live website.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmSpeaker(null)}
                className="px-4 py-2.5 rounded-xl bg-[#070E1B] hover:bg-[#112344] text-slate-300 text-xs font-semibold border border-[#152747] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
