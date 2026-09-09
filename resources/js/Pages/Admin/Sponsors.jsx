import React, { useState, useMemo } from 'react';
import { useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Handshake,
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
  ArrowUpDown,
} from 'lucide-react';

export default function Sponsors({ sponsors = [], metrics = {}, existingTypes = [] }) {
  const { flash } = usePage().props;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'table'

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [deleteConfirmSponsor, setDeleteConfirmSponsor] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Common preset sponsor types
  const defaultTypes = [
    'Registration Area Sponsor',
    'Lunch & Coffee Sponsor',
    'Table Top Sponsor',
    'Associate Sponsor',
    'Promoting Organisation',
    'Supporting Organisation',
    'Lead Maritime Partner',
    'Badge & Lanyard Sponsor',
    'Gala Dinner Sponsor',
    'Technology Partner',
  ];

  const allAvailableTypes = useMemo(() => {
    const set = new Set([...defaultTypes, ...existingTypes]);
    return Array.from(set);
  }, [existingTypes]);

  // Form for Add & Edit
  const form = useForm({
    type: 'Registration Area Sponsor',
    custom_type: '',
    name: '',
    description: '',
    website_url: '',
    sort_order: 1,
    is_active: true,
    logo_file: null,
    logo_url: '',
    remove_logo: false,
  });

  const openAddModal = () => {
    setEditingSponsor(null);
    setLogoPreview(null);
    form.reset();
    form.setData({
      type: 'Registration Area Sponsor',
      custom_type: '',
      name: '',
      description: '',
      website_url: '',
      sort_order: sponsors.length > 0 ? Math.max(...sponsors.map((s) => s.sort_order || 1)) : 1,
      is_active: true,
      logo_file: null,
      logo_url: '',
      remove_logo: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setLogoPreview(sponsor.logo || null);
    form.reset();

    const isCustom = !defaultTypes.includes(sponsor.type);
    form.setData({
      type: isCustom ? 'CUSTOM' : sponsor.type,
      custom_type: isCustom ? sponsor.type : '',
      name: sponsor.name || '',
      description: sponsor.description || '',
      website_url: sponsor.website_url || '',
      sort_order: sponsor.sort_order ?? 1,
      is_active: Boolean(sponsor.is_active),
      logo_file: null,
      logo_url: sponsor.logo && !sponsor.logo.startsWith('/new/') ? sponsor.logo : '',
      remove_logo: false,
    });
    setModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setData('logo_file', file);
      form.setData('remove_logo', false);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    form.setData('logo_file', null);
    form.setData('logo_url', '');
    form.setData('remove_logo', true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const resolvedType = form.data.type === 'CUSTOM' ? form.data.custom_type.trim() : form.data.type;
    if (!resolvedType) {
      alert('Please enter or select a sponsor type.');
      return;
    }

    const payload = {
      ...form.data,
      type: resolvedType,
    };

    const baseSponsorsUrl = props?.adminUrls?.sponsors || '/new/cms/sponsors';

    if (editingSponsor) {
      // Use POST with _method spoofing or standard POST for multipart
      router.post(`${baseSponsorsUrl}/${editingSponsor.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    } else {
      router.post(baseSponsorsUrl, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const handleToggleActive = (sponsor) => {
    const baseSponsorsUrl = props?.adminUrls?.sponsors || '/new/cms/sponsors';
    router.post(`${baseSponsorsUrl}/${sponsor.id}/toggle-active`, {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteConfirmSponsor) return;
    const baseSponsorsUrl = props?.adminUrls?.sponsors || '/new/cms/sponsors';
    router.delete(`${baseSponsorsUrl}/${deleteConfirmSponsor.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmSponsor(null);
      },
    });
  };

  // Filtered sponsors
  const filteredSponsors = useMemo(() => {
    return sponsors.filter((sponsor) => {
      const matchesSearch =
        !searchQuery ||
        sponsor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sponsor.description && sponsor.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        sponsor.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        selectedTypeFilter === 'ALL' || sponsor.type === selectedTypeFilter;

      const matchesStatus =
        selectedStatusFilter === 'ALL' ||
        (selectedStatusFilter === 'ACTIVE' && sponsor.is_active) ||
        (selectedStatusFilter === 'INACTIVE' && !sponsor.is_active);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [sponsors, searchQuery, selectedTypeFilter, selectedStatusFilter]);

  // Grouped by sort_order
  const groupedBySortOrder = useMemo(() => {
    const groups = {};
    filteredSponsors.forEach((sponsor) => {
      const order = sponsor.sort_order ?? 1;
      if (!groups[order]) {
        groups[order] = [];
      }
      groups[order].push(sponsor);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(a) - Number(b));
  }, [filteredSponsors]);

  // Distinct types in filtered list
  const uniqueTypesList = useMemo(() => {
    return Array.from(new Set(sponsors.map((s) => s.type))).filter(Boolean);
  }, [sponsors]);

  return (
    <AdminLayout
      title="Sponsors & Partners"
      subtitle="Manage summit sponsors, partner organisations, display tiers and logo placements"
      headerActions={
        <button
          type="button"
          onClick={openAddModal}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#1eb855] hover:to-[#158f41] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Sponsor / Partner</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* 1. Summary Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Total Partners
              </div>
              <div className="text-3xl font-extrabold text-white mt-1">
                {metrics.total ?? sponsors.length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Configured in registry</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <Handshake className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live on Website
              </div>
              <div className="text-3xl font-extrabold text-emerald-300 mt-1">
                {metrics.active ?? sponsors.filter((s) => s.is_active).length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Active & displayed publicly</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Hidden / Draft
              </div>
              <div className="text-3xl font-extrabold text-amber-300 mt-1">
                {metrics.inactive ?? sponsors.filter((s) => !s.is_active).length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Excluded from public site</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Display Rows (Tiers)
              </div>
              <div className="text-3xl font-extrabold text-purple-300 mt-1">
                {metrics.tiers ?? groupedBySortOrder.length}
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Grouped by Sort Order</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
              <ArrowUpDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 2. Search, Filter, and View Controls */}
        <div className="bg-[#0A1529] border border-[#152747] rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sponsor by name, type, or description..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#070E1B] border border-[#1E3A68] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
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

            {/* Type Filter */}
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Sponsor Types ({sponsors.length})</option>
              {uniqueTypesList.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active (Live)</option>
              <option value="INACTIVE">Inactive (Hidden)</option>
            </select>
          </div>

          {/* View mode toggle: Grouped by Row vs List */}
          <div className="flex items-center gap-1.5 self-end md:self-auto bg-[#070E1B] p-1 rounded-xl border border-[#1E3A68]">
            <button
              type="button"
              onClick={() => setViewMode('grouped')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'grouped'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Grouped by Row
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>
        </div>

        {/* 3. Helper Banner: How Sort Order Works */}
        <div className="p-3.5 rounded-xl bg-[#0E1E38] border border-[#1B3563] flex items-start gap-2.5 text-xs text-slate-300">
          <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white">Same Sort Order Rule: </strong>
            Sponsors with the exact same <strong>Sort Order number</strong> will automatically appear side-by-side in the <strong>same row</strong> on the public website. Lower numbers appear closer to the top.
          </div>
        </div>

        {/* 4. Display Sponsors: Grouped by Row (Sort Order) */}
        {viewMode === 'grouped' ? (
          <div className="space-y-6">
            {groupedBySortOrder.length === 0 ? (
              <div className="p-12 text-center bg-[#0A1529] border border-[#152747] rounded-2xl">
                <Building className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No sponsors found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try adjusting your filters or click "Add Sponsor / Partner" to create one.
                </p>
              </div>
            ) : (
              groupedBySortOrder.map(([sortOrder, sponsorList]) => (
                <div
                  key={sortOrder}
                  className="bg-[#081120] border border-[#152747] rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Row Tier Header */}
                  <div className="p-4 sm:p-5 bg-[#0A1529] border-b border-[#152747] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold text-sm">
                        #{sortOrder}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>Row {sortOrder} Tier</span>
                          <span className="text-xs font-normal text-slate-400">
                            ({sponsorList.length} {sponsorList.length === 1 ? 'partner' : 'partners'} in this row)
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Appears together in horizontal row {sortOrder} on public page
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#112344] text-slate-300 border border-[#1E3A68]">
                        Sort Order: {sortOrder}
                      </span>
                    </div>
                  </div>

                  {/* Sponsors in this row grid */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {sponsorList.map((sponsor) => (
                      <div
                        key={sponsor.id}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between ${
                          sponsor.is_active
                            ? 'bg-[#0A1529] border-[#152747] hover:border-purple-500/50 shadow-sm'
                            : 'bg-[#070E1B]/60 border-[#152747]/40 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {/* Top Content */}
                        <div>
                          {/* Logo or Placeholder */}
                          <div className="mb-4 flex items-center justify-between gap-2">
                            <div className="h-14 w-28 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 overflow-hidden shadow-xs">
                              {sponsor.logo ? (
                                <img
                                  src={sponsor.logo}
                                  alt={sponsor.name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div
                                className={`h-full w-full items-center justify-center text-xs font-bold text-[#0A1E3F] ${
                                  sponsor.logo ? 'hidden' : 'flex'
                                }`}
                              >
                                {sponsor.name
                                  .split(' ')
                                  .slice(0, 3)
                                  .map((n) => n[0])
                                  .join('')
                                  .toUpperCase()}
                              </div>
                            </div>

                            {/* Status Pill */}
                            <span
                              className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold border ${
                                sponsor.is_active
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}
                            >
                              {sponsor.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>

                          {/* Sponsor Type Badge */}
                          <div className="inline-block px-2.5 py-0.5 rounded-md bg-[#112344] border border-[#1E3A68] text-[10px] font-bold uppercase tracking-wider text-[#D9A441] mb-2">
                            {sponsor.type}
                          </div>

                          {/* Name */}
                          <h4 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                            {sponsor.name}
                          </h4>

                          {/* Description */}
                          {sponsor.description && (
                            <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {sponsor.description}
                            </p>
                          )}

                          {/* Website */}
                          {sponsor.website_url && (
                            <a
                              href={sponsor.website_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono truncate"
                            >
                              <ExternalLink className="w-3 h-3 shrink-0" />
                              <span className="truncate">{sponsor.website_url.replace(/^https?:\/\//, '')}</span>
                            </a>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 pt-3 border-t border-[#152747]/80 flex items-center justify-between gap-1.5">
                          {/* Active Toggle Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleActive(sponsor)}
                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                              sponsor.is_active
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                            }`}
                            title={sponsor.is_active ? 'Click to deactivate sponsor' : 'Click to activate sponsor'}
                          >
                            {sponsor.is_active ? (
                              <>
                                <EyeOff className="w-3 h-3" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3 h-3" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => openEditModal(sponsor)}
                              className="p-1.5 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Edit sponsor details"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmSponsor(sponsor)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 transition-colors cursor-pointer"
                              title="Delete sponsor"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* 5. Flat Table View */
          <div className="bg-[#0A1529] border border-[#152747] rounded-2xl overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#081120] text-slate-400 border-b border-[#152747] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Row / Order</th>
                    <th className="py-3.5 px-4">Logo</th>
                    <th className="py-3.5 px-4">Name & Website</th>
                    <th className="py-3.5 px-4">Type / Category</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#152747]/60">
                  {filteredSponsors.map((sponsor) => (
                    <tr key={sponsor.id} className="hover:bg-[#0E1E38] transition-colors">
                      <td className="py-3 px-4 font-bold text-purple-300">
                        <span className="px-2 py-0.5 rounded bg-purple-600/20 border border-purple-500/30">
                          Row #{sponsor.sort_order}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="h-9 w-16 rounded bg-white p-1 flex items-center justify-center overflow-hidden border border-slate-200">
                          {sponsor.logo ? (
                            <img src={sponsor.logo} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
                          ) : (
                            <span className="text-[10px] font-bold text-slate-600">No logo</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-white">
                        <div>{sponsor.name}</div>
                        {sponsor.website_url && (
                          <div className="text-[10px] text-sky-400 font-normal truncate max-w-xs font-mono">
                            {sponsor.website_url}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-[#112344] text-[#D9A441] border border-[#1E3A68] font-semibold">
                          {sponsor.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">
                        {sponsor.description || '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold border ${
                            sponsor.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {sponsor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleToggleActive(sponsor)}
                            className={`px-2 py-1 rounded text-[11px] font-semibold border ${
                              sponsor.is_active
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                            }`}
                          >
                            {sponsor.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(sponsor)}
                            className="p-1 rounded bg-[#112344] text-sky-400 hover:text-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmSponsor(sponsor)}
                            className="p-1 rounded bg-rose-500/10 text-rose-400 hover:text-rose-300"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 6. ADD / EDIT SPONSOR MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#1E3A68] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#152747] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                  <Handshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingSponsor ? 'Edit Sponsor / Partner' : 'Add New Sponsor / Partner'}
                  </h3>
                  <p className="text-xs text-slate-400">Configure partner role, logo, and row placement</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#112344] hover:bg-[#182F58] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Type Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Sponsor Type / Category <span className="text-rose-400">*</span>
                </label>
                <select
                  value={form.data.type}
                  onChange={(e) => form.setData('type', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                >
                  {allAvailableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                  <option value="CUSTOM">+ Custom / Enter new type...</option>
                </select>

                {form.data.type === 'CUSTOM' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={form.data.custom_type}
                      onChange={(e) => form.setData('custom_type', e.target.value)}
                      placeholder="e.g. Lead Maritime Partner, Badge & Lanyard Sponsor"
                      className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-purple-500 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Sponsor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Company / Organization Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.data.name}
                  onChange={(e) => form.setData('name', e.target.value)}
                  placeholder="e.g. Mazagon Dock Shipbuilders Limited"
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Sort Order (Row placement) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Sort Order (Row Grouping) <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-purple-300 font-semibold">
                    Row #{form.data.sort_order || 1}
                  </span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={form.data.sort_order}
                  onChange={(e) => form.setData('sort_order', parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  ⚡ <strong>Sponsors with the same sort order appear in the same row</strong> on the website.
                </p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Description / Tagline (Optional)
                </label>
                <textarea
                  rows={2}
                  value={form.data.description}
                  onChange={(e) => form.setData('description', e.target.value)}
                  placeholder="Short role bio, partner description or subtitle..."
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Website URL (Optional)
                </label>
                <input
                  type="url"
                  value={form.data.website_url}
                  onChange={(e) => form.setData('website_url', e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              {/* Logo Upload / URL */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Partner Logo
                </label>

                {logoPreview ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#070E1B] border border-[#1E3A68]">
                    <div className="h-12 w-24 rounded-lg bg-white p-1.5 flex items-center justify-center overflow-hidden">
                      <img src={logoPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">Logo selected</p>
                      <p className="text-[10px] text-slate-400">Will be saved with this partner</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs border border-rose-500/20 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-[#1E3A68] hover:border-purple-500 bg-[#070E1B] cursor-pointer transition-colors">
                      <Upload className="w-5 h-5 text-purple-400 mb-1" />
                      <span className="text-xs font-semibold text-white">Click to upload logo image</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 uppercase">OR Image URL:</span>
                      <input
                        type="text"
                        value={form.data.logo_url}
                        onChange={(e) => {
                          form.setData('logo_url', e.target.value);
                          if (e.target.value) setLogoPreview(e.target.value);
                        }}
                        placeholder="https://... or /new/images/..."
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="is_active_checkbox"
                  checked={form.data.is_active}
                  onChange={(e) => form.setData('is_active', e.target.checked)}
                  className="w-4 h-4 rounded bg-[#081120] border-[#152747] text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="is_active_checkbox" className="text-xs font-semibold text-slate-200 cursor-pointer">
                  Active (Show publicly on website sponsor grid)
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-[#152747] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={form.processing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{form.processing ? 'Saving...' : editingSponsor ? 'Update Sponsor' : 'Add Sponsor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deleteConfirmSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#1E3A68] rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-white">Delete Sponsor?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to delete{' '}
                <strong className="text-white font-bold">{deleteConfirmSponsor.name}</strong>?
              </p>
              <p className="text-[11px] text-slate-500 mt-1">This action cannot be undone.</p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmSponsor(null)}
                className="flex-1 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors shadow-md cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
