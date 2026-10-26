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
  FolderPlus,
  Tag,
  Settings,
} from 'lucide-react';
import { resolveAsset } from '../../utils/asset';

export default function Sponsors({ sponsors = [], metrics = {}, existingTypes = [], categories = [] }) {
  const { flash } = usePage().props;

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'table'

  // Sponsor Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState(null);
  const [targetRowTier, setTargetRowTier] = useState(null);
  const [deleteConfirmSponsor, setDeleteConfirmSponsor] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Category Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryModalTab, setCategoryModalTab] = useState('create'); // 'create' or 'list'
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] = useState(null);

  // Category Form
  const categoryForm = useForm({
    name: '',
    placement_mode: 'new_row', // 'new_row' | 'existing_row' | 'end_row' | 'current_row'
    target_row: 1,
    description: '',
  });

  // Common preset sponsor types
  const defaultTypes = [
    'Strategic Partner',
    'Gold Sponsor',
    'Registration Area Sponsor',
    'Badge and Lanyard Sponsor',
    'Lunch & Coffee Sponsor',
    'Conference Session Sponsor',
    'Table Top Sponsor',
    'Associate Sponsor',
    'Promoting Organisation',
    'Lead Maritime Partner',
    'Technology Partner',
    'Gala Dinner Sponsor',
  ];

  /**
   * Resolve the sort order for a sponsor so partners of the same category are grouped together.
   */
  const getCategorySortOrder = (typeName, existingSponsors = sponsors) => {
    if (!typeName) return 1;
    const normalized = typeName.trim().toLowerCase();

    // 1. Check database categories table first
    const catMatch = categories.find(
      (c) => c.name && c.name.trim().toLowerCase() === normalized
    );
    if (catMatch && catMatch.sort_order) {
      return Number(catMatch.sort_order);
    }

    // 2. If any sponsor with this exact/case-insensitive type already exists in DB, use its sort order
    const match = existingSponsors.find(
      (s) => s.type && s.type.trim().toLowerCase() === normalized
    );
    if (match && match.sort_order) {
      return Number(match.sort_order);
    }

    // 3. Standard category pattern matching
    if (/strategic/i.test(normalized)) return 1;
    if (/gold|premier/i.test(normalized)) return 2;
    if (/registration|badge|lanyard/i.test(normalized)) return 3;
    if (/lunch|coffee|conference/i.test(normalized)) return 4;
    if (/table\s*top/i.test(normalized)) return 5;
    if (/associate/i.test(normalized)) return 6;
    if (/promoting|supporting/i.test(normalized)) return 7;

    // 4. Fallback to next new row
    const maxOrder = Math.max(
      0,
      ...categories.map((c) => Number(c.sort_order) || 0),
      ...existingSponsors.map((s) => Number(s.sort_order) || 0)
    );
    return maxOrder > 0 ? maxOrder + 1 : 1;
  };

  const allAvailableTypes = useMemo(() => {
    const set = new Set([
      ...categories.map((c) => c.name),
      ...existingTypes,
      ...defaultTypes,
    ]);
    return Array.from(set).filter(Boolean);
  }, [categories, existingTypes]);

  // All distinct row numbers
  const allRowOrders = useMemo(() => {
    const orders = new Set([
      ...categories.map((c) => Number(c.sort_order) || 1),
      ...sponsors.map((s) => Number(s.sort_order) || 1),
    ]);
    if (orders.size === 0) orders.add(1);
    return Array.from(orders).sort((a, b) => a - b);
  }, [categories, sponsors]);

  const maxRowOrder = useMemo(() => {
    return allRowOrders.length > 0 ? Math.max(...allRowOrders) : 1;
  }, [allRowOrders]);

  // Category Modal Handlers
  const openCreateCategoryModal = (targetRow = null, placementMode = 'new_row') => {
    setEditingCategory(null);
    categoryForm.reset();
    categoryForm.setData({
      name: '',
      placement_mode: targetRow !== null ? placementMode : 'new_row',
      target_row: targetRow !== null ? Number(targetRow) : 1,
      description: '',
    });
    setCategoryModalTab('create');
    setCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category) => {
    setEditingCategory(category);
    categoryForm.reset();
    categoryForm.setData({
      name: category.name || '',
      placement_mode: 'current_row',
      target_row: Number(category.sort_order) || 1,
      description: category.description || '',
    });
    setCategoryModalTab('create');
    setCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!categoryForm.data.name.trim()) {
      alert('Please enter a category name.');
      return;
    }

    if (editingCategory) {
      categoryForm.put(`/cms/sponsors/categories/${editingCategory.id}`, {
        preserveScroll: true,
        onSuccess: () => {
          setCategoryModalOpen(false);
          setEditingCategory(null);
          categoryForm.reset();
        },
      });
    } else {
      categoryForm.post('/cms/sponsors/categories', {
        preserveScroll: true,
        onSuccess: () => {
          setCategoryModalOpen(false);
          categoryForm.reset();
        },
      });
    }
  };

  const handleDeleteCategory = (category) => {
    if ((category.sponsors_count ?? 0) > 0) {
      alert(
        `Cannot delete category "${category.name}" because it currently contains ${category.sponsors_count} sponsor(s). Please delete or reassign them first.`
      );
      return;
    }
    setDeleteConfirmCategory(category);
  };

  const confirmDeleteCategory = () => {
    if (!deleteConfirmCategory) return;
    router.delete(`/cms/sponsors/categories/${deleteConfirmCategory.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteConfirmCategory(null);
      },
    });
  };

  // Form for Add & Edit Sponsor
  const form = useForm({
    type: 'Strategic Partner',
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

  const openAddModal = (targetSortOrder = null, suggestedType = null) => {
    setEditingSponsor(null);
    setLogoPreview(null);
    form.reset();

    // Determine type
    let typeToUse = suggestedType;
    if (!typeToUse && targetSortOrder !== null) {
      const inCat = categories.find((c) => Number(c.sort_order) === Number(targetSortOrder));
      if (inCat) {
        typeToUse = inCat.name;
      } else {
        const inRow = sponsors.find((s) => Number(s.sort_order) === Number(targetSortOrder));
        if (inRow) typeToUse = inRow.type;
      }
    }
    if (!typeToUse) {
      typeToUse = categories[0]?.name || defaultTypes[0] || 'Strategic Partner';
    }

    const isCustom = !defaultTypes.includes(typeToUse) && !categories.some((c) => c.name === typeToUse);

    // If targetSortOrder was explicitly provided, use it; otherwise auto-align with category
    const order = targetSortOrder !== null
      ? Number(targetSortOrder)
      : getCategorySortOrder(typeToUse, sponsors);

    setTargetRowTier(order);

    form.setData({
      type: isCustom ? 'CUSTOM' : typeToUse,
      custom_type: isCustom ? typeToUse : '',
      name: '',
      description: '',
      website_url: '',
      sort_order: order,
      is_active: true,
      logo_file: null,
      logo_url: '',
      remove_logo: false,
    });
    setModalOpen(true);
  };

  const openEditModal = (sponsor) => {
    setEditingSponsor(sponsor);
    setTargetRowTier(sponsor.sort_order ?? null);
    setLogoPreview(sponsor.logo ? resolveAsset(sponsor.logo) : null);
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
      logo_url: sponsor.logo || '',
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

    if (editingSponsor) {
      // Use POST with _method spoofing or standard POST for multipart
      router.post(`/new/cms/sponsors/${editingSponsor.id}`, payload, {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    } else {
      router.post('/cms/sponsors', payload, {
        preserveScroll: true,
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const handleToggleActive = (sponsor) => {
    router.post(`/cms/sponsors/${sponsor.id}/toggle-active`, {}, { preserveScroll: true });
  };

  const handleDelete = () => {
    if (!deleteConfirmSponsor) return;
    router.delete(`/cms/sponsors/${deleteConfirmSponsor.id}`, {
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
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              categoryForm.reset();
              setCategoryModalTab('list');
              setCategoryModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-purple-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Manage Categories ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => openCreateCategoryModal()}
            className="px-3.5 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-sky-300 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <FolderPlus className="w-4 h-4 text-sky-400" />
            <span>+ New Category</span>
          </button>

          <button
            type="button"
            onClick={() => openAddModal()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#1eb855] hover:to-[#158f41] text-[#0A1E3F] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sponsor / Partner</span>
          </button>
        </div>
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

          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setCategoryModalTab('list');
              setCategoryModalOpen(true);
            }}
            className="bg-[#0A1529] hover:bg-[#0E1E38] border border-[#152747] hover:border-purple-500/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left transition-all cursor-pointer group"
          >
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <Layers className="w-3 h-3" />
                Categories & Rows
              </div>
              <div className="text-3xl font-extrabold text-purple-300 mt-1 flex items-baseline gap-2">
                <span>{categories.length || metrics.categories || 0}</span>
                <span className="text-xs text-slate-400 font-normal">
                  in {allRowOrders.length} {allRowOrders.length === 1 ? 'row' : 'rows'}
                </span>
              </div>
              <div className="text-xs text-purple-400/80 group-hover:text-purple-300 mt-0.5 flex items-center gap-1 font-medium">
                <span>Manage Categories &rarr;</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ArrowUpDown className="w-5 h-5" />
            </div>
          </button>
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
            {allRowOrders.length === 0 ? (
              <div className="p-12 text-center bg-[#0A1529] border border-[#152747] rounded-2xl">
                <Building className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No sponsors or categories found</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Click "+ New Category" or "+ Add Sponsor / Partner" to get started.
                </p>
              </div>
            ) : (
              allRowOrders.map((sortOrder) => {
                const rowCategories = categories.filter((c) => Number(c.sort_order) === Number(sortOrder));
                const rowSponsors = filteredSponsors.filter((s) => Number(s.sort_order) === Number(sortOrder));

                // If user applied search/filter and neither category nor sponsors match, skip row
                const hasFilter = searchQuery || selectedTypeFilter !== 'ALL' || selectedStatusFilter !== 'ALL';
                const searchMatchesCat = searchQuery && rowCategories.some((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
                if (hasFilter && rowSponsors.length === 0 && !searchMatchesCat) {
                  return null;
                }

                const uniqueCategoriesInRow = Array.from(
                  new Set([
                    ...rowCategories.map((c) => c.name),
                    ...rowSponsors.map((s) => s.type),
                  ])
                ).filter(Boolean);

                const rowCategoryTitle =
                  uniqueCategoriesInRow.length > 0
                    ? uniqueCategoriesInRow.join(' & ')
                    : `Row ${sortOrder}`;

                return (
                <div
                  key={sortOrder}
                  className="bg-[#081120] border border-[#152747] rounded-2xl overflow-hidden shadow-lg"
                >
                  {/* Row Tier Header */}
                  <div className="p-4 sm:p-5 bg-[#0A1529] border-b border-[#152747] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold text-sm shrink-0">
                        #{sortOrder}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-bold text-white">
                            Row #{sortOrder}
                          </h3>

                          {/* Category Badges with quick Edit & Delete */}
                          {rowCategories.length > 0 ? (
                            rowCategories.map((cat) => (
                              <span
                                key={cat.id}
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#112344] border border-[#1E3A68] text-xs font-bold text-[#D9A441]"
                              >
                                <Tag className="w-3 h-3 text-[#D9A441]" />
                                <span>{cat.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  ({cat.sponsors_count ?? 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openEditCategoryModal(cat)}
                                  className="p-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                  title={`Edit "${cat.name}"`}
                                >
                                  <Edit2 className="w-3 h-3 text-sky-400" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat)}
                                  className="p-0.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                  title={`Delete "${cat.name}"`}
                                >
                                  <Trash2 className="w-3 h-3 text-rose-400" />
                                </button>
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-400 italic">
                              ({rowCategoryTitle})
                            </span>
                          )}

                          <span className="text-xs font-normal text-slate-400">
                            &bull; {rowSponsors.length} {rowSponsors.length === 1 ? 'partner' : 'partners'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 mt-1">
                          {rowCategories.length > 1
                            ? `Shared Row: ${rowCategories.map((c) => c.name).join(' and ')} appear side-by-side in this row`
                            : `Appears on website in Row #${sortOrder} tier: ${rowCategoryTitle}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-[#112344] text-slate-300 border border-[#1E3A68]">
                        Sort Order: {sortOrder}
                      </span>

                      <button
                        type="button"
                        onClick={() => openCreateCategoryModal(sortOrder, 'existing_row')}
                        className="px-3 py-1.5 rounded-xl bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-purple-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                        title={`Add another category to share Row #${sortOrder}`}
                      >
                        <FolderPlus className="w-3.5 h-3.5 text-purple-400" />
                        <span>+ Add Category to Row #{sortOrder}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => openAddModal(sortOrder, rowCategories[0]?.name || rowSponsors[0]?.type)}
                        className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Add Sponsor</span>
                      </button>
                    </div>
                  </div>

                  {/* Sponsors in this row grid */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {rowSponsors.length === 0 && (
                      <div className="col-span-full p-6 text-center rounded-2xl bg-[#070E1B]/40 border border-[#152747] text-slate-400">
                        <p className="text-xs">
                          No sponsors have been assigned to <strong>Row #{sortOrder} ({rowCategoryTitle})</strong> yet.
                        </p>
                        <button
                          type="button"
                          onClick={() => openAddModal(sortOrder, rowCategories[0]?.name)}
                          className="mt-3 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add First Sponsor to Row #{sortOrder}</span>
                        </button>
                      </div>
                    )}

                    {rowSponsors.map((sponsor) => (
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
                                  src={resolveAsset(sponsor.logo)}
                                  alt={sponsor.name}
                                  className="max-h-full max-w-full object-contain"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
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

                    {/* Quick Add Sponsor Card for this specific row */}
                    <button
                      type="button"
                      onClick={() => openAddModal(sortOrder, rowCategories[0]?.name || rowSponsors[0]?.type)}
                      className="rounded-2xl border-2 border-dashed border-[#1E3A68] hover:border-purple-500 bg-[#070E1B]/40 hover:bg-purple-600/10 p-5 flex flex-col items-center justify-center text-center transition-all group min-h-[190px] cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-600/15 group-hover:bg-purple-600 text-purple-300 group-hover:text-white flex items-center justify-center mb-2.5 transition-all shadow-sm">
                        <Plus className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-200 group-hover:text-white">
                        + Add Sponsor
                      </span>
                      <span className="text-[10px] text-purple-400 font-mono mt-0.5">
                        to Row #{sortOrder}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })
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
                            <img src={resolveAsset(sponsor.logo)} alt={sponsor.name} className="max-h-full max-w-full object-contain" />
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
                    {editingSponsor
                      ? 'Edit Sponsor / Partner'
                      : targetRowTier
                      ? `Add Sponsor to Row #${targetRowTier}`
                      : 'Add New Sponsor / Partner'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {targetRowTier && !editingSponsor
                      ? `New partner will be added directly into Row #${targetRowTier}`
                      : 'Configure partner role, logo, and row placement'}
                  </p>
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
              {/* Row Tier Indicator */}
              {targetRowTier && !editingSponsor && (
                <div className="p-3 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Adding to: <strong>Row #{targetRowTier} Tier</strong></span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 border border-purple-400/30">
                    Sort Order #{targetRowTier}
                  </span>
                </div>
              )}
              {/* Type Selection */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Sponsor Type / Category <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false);
                      openCreateCategoryModal(form.data.sort_order);
                    }}
                    className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <FolderPlus className="w-3 h-3" />
                    <span>+ New Category</span>
                  </button>
                </div>
                <select
                  value={form.data.type}
                  onChange={(e) => {
                    const newType = e.target.value;
                    if (newType === 'CUSTOM') {
                      form.setData((prev) => ({ ...prev, type: 'CUSTOM' }));
                    } else {
                      const matchedOrder = getCategorySortOrder(newType, sponsors);
                      form.setData((prev) => ({
                        ...prev,
                        type: newType,
                        sort_order: matchedOrder,
                      }));
                      setTargetRowTier(matchedOrder);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                >
                  <optgroup label="Configured Categories">
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name} (Row #{cat.sort_order})
                      </option>
                    ))}
                  </optgroup>
                  {allAvailableTypes.filter((t) => !categories.some((c) => c.name === t)).length > 0 && (
                    <optgroup label="Other Types">
                      {allAvailableTypes
                        .filter((t) => !categories.some((c) => c.name === t))
                        .map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                    </optgroup>
                  )}
                  <option value="CUSTOM">+ Custom / Enter new type...</option>
                </select>

                {form.data.type === 'CUSTOM' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={form.data.custom_type}
                      onChange={(e) => {
                        const customVal = e.target.value;
                        const matchedOrder = getCategorySortOrder(customVal, sponsors);
                        form.setData((prev) => ({
                          ...prev,
                          custom_type: customVal,
                          sort_order: matchedOrder,
                        }));
                        setTargetRowTier(matchedOrder);
                      }}
                      placeholder="e.g. Lead Maritime Partner, Badge & Lanyard Sponsor"
                      className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-purple-500 text-white text-xs focus:outline-none"
                      required
                    />
                  </div>
                )}

                {/* Category & Row Alignment Info */}
                {(() => {
                  const resolvedCat = form.data.type === 'CUSTOM' ? form.data.custom_type.trim() : form.data.type;
                  const matchingSponsors = sponsors.filter(
                    (s) => s.type && resolvedCat && s.type.trim().toLowerCase() === resolvedCat.toLowerCase() && (!editingSponsor || s.id !== editingSponsor.id)
                  );
                  return (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-purple-600/15 border border-purple-500/30 flex items-center justify-between text-xs text-purple-200">
                      <div className="flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>
                          Category Placement: <strong>Row #{form.data.sort_order} Tier</strong>
                          {matchingSponsors.length > 0 ? (
                            <span className="text-slate-300 ml-1">
                              (groups with {matchingSponsors.length} existing {matchingSponsors.length === 1 ? 'partner' : 'partners'} in {resolvedCat})
                            </span>
                          ) : (
                            <span className="text-slate-300 ml-1">(new row for this category)</span>
                          )}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 border border-purple-400/20 whitespace-nowrap">
                        Auto-Matched
                      </span>
                    </div>
                  );
                })()}
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

      {/* 7. DELETE SPONSOR CONFIRMATION MODAL */}
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

      {/* 8. CATEGORY & ROW MANAGEMENT MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#1E3A68] rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#152747] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingCategory
                      ? `Edit Category: ${editingCategory.name}`
                      : 'Category & Row Placement'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control row positions, push down tiers, or share rows side-by-side
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="w-8 h-8 rounded-lg bg-[#112344] hover:bg-[#182F58] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-[#152747] bg-[#070E1B]/60 px-4">
              <button
                type="button"
                onClick={() => setCategoryModalTab('create')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  categoryModalTab === 'create'
                    ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {editingCategory ? 'Edit Category Placement' : '+ Add New Category'}
              </button>
              <button
                type="button"
                onClick={() => setCategoryModalTab('list')}
                className={`py-3 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                  categoryModalTab === 'list'
                    ? 'border-purple-500 text-purple-300 bg-purple-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                All Categories ({categories.length})
              </button>
            </div>

            {/* Modal Body */}
            {categoryModalTab === 'create' ? (
              <form onSubmit={handleCategorySubmit} className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Category Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={categoryForm.data.name}
                    onChange={(e) => categoryForm.setData('name', e.target.value)}
                    placeholder="e.g. Lead Maritime Partner, Badge & Lanyard Sponsor"
                    className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                    required
                  />
                  {categoryForm.errors.name && (
                    <p className="mt-1 text-xs text-rose-400">{categoryForm.errors.name}</p>
                  )}
                </div>

                {/* Placement Options: The Core Feature Requested by User */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Row Placement Rule <span className="text-rose-400">*</span>
                  </label>

                  {/* Option 1: Take over an existing row (push existing rows down) */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      categoryForm.data.placement_mode === 'new_row'
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-xs'
                        : 'bg-[#081120] border-[#152747] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="placement_mode"
                        value="new_row"
                        checked={categoryForm.data.placement_mode === 'new_row'}
                        onChange={(e) => categoryForm.setData('placement_mode', e.target.value)}
                        className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 bg-[#081120] border-[#152747]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Take over an existing row (Push existing rows down)</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            Push Down
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          This category takes over a row. Old category and its sponsors in that row, plus all subsequent rows, will automatically be pushed down to the next row (Row + 1).
                        </p>

                        {categoryForm.data.placement_mode === 'new_row' && (
                          <div className="mt-3 p-3 rounded-lg bg-[#070E1B] border border-purple-500/30 space-y-2.5">
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-purple-200 font-semibold">
                                Target Row to Take Over:
                              </span>
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={categoryForm.data.target_row}
                                onChange={(e) =>
                                  categoryForm.setData(
                                    'target_row',
                                    Math.max(1, parseInt(e.target.value, 10) || 1)
                                  )
                                }
                                className="w-20 px-2.5 py-1 rounded-lg bg-[#0A1529] border border-purple-400 text-white text-xs font-bold text-center focus:outline-none"
                              />
                            </div>

                            {/* Live preview of what gets pushed down */}
                            {(() => {
                              const target = Number(categoryForm.data.target_row) || 1;
                              const affectedCategories = categories.filter(
                                (c) => Number(c.sort_order) >= target && (!editingCategory || c.id !== editingCategory.id)
                              );
                              return (
                                <div className="text-[11px] text-purple-300/90 leading-relaxed">
                                  ⚡ <strong>Result:</strong> This category will become{' '}
                                  <span className="underline font-bold">Row #{target}</span>.
                                  {affectedCategories.length > 0 ? (
                                    <span className="block text-slate-400 mt-1">
                                      Rows pushed down: {affectedCategories.map((c) => `"${c.name}" (Row #${c.sort_order} &rarr; Row #${c.sort_order + 1})`).slice(0, 3).join(', ')}
                                      {affectedCategories.length > 3 && `, and ${affectedCategories.length - 3} more...`}
                                    </span>
                                  ) : (
                                    <span className="block text-slate-400 mt-1">
                                      (No existing rows will be pushed down since Row #{target} is currently empty.)
                                    </span>
                                  )}
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 2: Share an existing row with other category/categories */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      categoryForm.data.placement_mode === 'existing_row'
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-xs'
                        : 'bg-[#081120] border-[#152747] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="placement_mode"
                        value="existing_row"
                        checked={categoryForm.data.placement_mode === 'existing_row'}
                        onChange={(e) => categoryForm.setData('placement_mode', e.target.value)}
                        className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 bg-[#081120] border-[#152747]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Share an existing row with other category/categories</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                            Shared Row
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Both categories appear side-by-side in the same row (like Lunch & Coffee + Conference Session). No other rows are pushed down.
                        </p>

                        {categoryForm.data.placement_mode === 'existing_row' && (
                          <div className="mt-3 p-3 rounded-lg bg-[#070E1B] border border-purple-500/30 space-y-2">
                            <span className="text-xs text-purple-200 font-semibold block">
                              Select Existing Row to Share With:
                            </span>
                            <select
                              value={categoryForm.data.target_row}
                              onChange={(e) =>
                                categoryForm.setData('target_row', Number(e.target.value) || 1)
                              }
                              className="w-full px-3 py-1.5 rounded-lg bg-[#0A1529] border border-purple-400 text-white text-xs focus:outline-none"
                            >
                              {allRowOrders.map((rowNum) => {
                                const rowCats = categories.filter(
                                  (c) => Number(c.sort_order) === Number(rowNum) && (!editingCategory || c.id !== editingCategory.id)
                                );
                                const label = rowCats.length > 0 ? rowCats.map((c) => c.name).join(', ') : 'Empty Row';
                                return (
                                  <option key={rowNum} value={rowNum}>
                                    Row #{rowNum} &mdash; ({label})
                                  </option>
                                );
                              })}
                            </select>

                            <div className="text-[11px] text-sky-300 mt-1">
                              🤝 <strong>Result:</strong> Will appear side-by-side with other sponsors in <strong>Row #{categoryForm.data.target_row}</strong>.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </label>

                  {/* Option 3: Add as a new row at the end */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      categoryForm.data.placement_mode === 'end_row'
                        ? 'bg-purple-600/15 border-purple-500 text-white shadow-xs'
                        : 'bg-[#081120] border-[#152747] text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="placement_mode"
                        value="end_row"
                        checked={categoryForm.data.placement_mode === 'end_row'}
                        onChange={(e) => categoryForm.setData('placement_mode', e.target.value)}
                        className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 bg-[#081120] border-[#152747]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white flex items-center justify-between">
                          <span>Add as a new row at the very end</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            Row #{maxRowOrder + 1}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Placed after all current categories without disturbing existing rows.
                        </p>
                      </div>
                    </div>
                  </label>

                  {/* Option 4: (Edit Mode only) Keep in current row */}
                  {editingCategory && (
                    <label
                      className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                        categoryForm.data.placement_mode === 'current_row'
                          ? 'bg-purple-600/15 border-purple-500 text-white shadow-xs'
                          : 'bg-[#081120] border-[#152747] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="placement_mode"
                          value="current_row"
                          checked={categoryForm.data.placement_mode === 'current_row'}
                          onChange={(e) => categoryForm.setData('placement_mode', e.target.value)}
                          className="mt-0.5 w-4 h-4 text-purple-600 focus:ring-purple-500 bg-[#081120] border-[#152747]"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>Keep in current row (Row #{editingCategory.sort_order})</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-500/20 text-slate-300">
                              Current Row
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Keep category in its current position and only update its name or description.
                          </p>
                        </div>
                      </div>
                    </label>
                  )}
                </div>

                {/* Description / Subtitle */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Description / Note (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={categoryForm.data.description}
                    onChange={(e) => categoryForm.setData('description', e.target.value)}
                    placeholder="Short description or internal note for this category tier..."
                    className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                {/* Form Actions */}
                <div className="pt-3 border-t border-[#152747] flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryModalOpen(false);
                      setEditingCategory(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={categoryForm.processing}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>
                      {categoryForm.processing
                        ? 'Saving...'
                        : editingCategory
                        ? 'Update Category'
                        : 'Create Category'}
                    </span>
                  </button>
                </div>
              </form>
            ) : (
              /* TAB 2: ALL CATEGORIES LIST */
              <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Categories are ordered by their row position on the public website.
                  </p>
                  <button
                    type="button"
                    onClick={() => openCreateCategoryModal()}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ New Category</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className="p-3 rounded-xl bg-[#081120] border border-[#152747] hover:border-purple-500/40 flex items-center justify-between gap-3 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/30 font-bold text-xs flex items-center justify-center shrink-0">
                          #{cat.sort_order}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{cat.name}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#112344] text-[#D9A441] border border-[#1E3A68]">
                              {cat.sponsors_count ?? 0} {cat.sponsors_count === 1 ? 'partner' : 'partners'}
                            </span>
                          </div>
                          {cat.description && (
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                              {cat.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openAddModal(cat.sort_order, cat.name)}
                          className="px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-[11px] font-semibold border border-purple-500/30 transition-colors cursor-pointer"
                          title={`Add sponsor to ${cat.name}`}
                        >
                          + Add Partner
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditCategoryModal(cat)}
                          className="p-1.5 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-sky-400 hover:text-white transition-colors cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            (cat.sponsors_count ?? 0) > 0
                              ? 'bg-slate-800/40 border-slate-700/40 text-slate-600 cursor-not-allowed'
                              : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400'
                          }`}
                          title={
                            (cat.sponsors_count ?? 0) > 0
                              ? `Cannot delete while ${cat.sponsors_count} partner(s) exist`
                              : 'Delete Category'
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. DELETE CATEGORY CONFIRMATION MODAL */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#1E3A68] rounded-2xl w-full max-w-sm p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>

            <div className="text-center">
              <h4 className="text-base font-bold text-white">Delete Category?</h4>
              <p className="text-xs text-slate-300 mt-1">
                Are you sure you want to delete category{' '}
                <strong className="text-white font-bold">{deleteConfirmCategory.name}</strong>?
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                This category currently has 0 sponsors. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmCategory(null)}
                className="flex-1 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
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
