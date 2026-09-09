import React, { useState } from 'react';
import { Link, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  Edit3,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Globe,
  Sliders,
  X,
  Save,
  Clock,
  Sparkles,
  Home as HomeIcon,
  Info,
  BookOpen,
  Image as ImageIcon,
  Newspaper,
  Ship,
  Users,
  Award,
  Calendar,
  Compass,
  ArrowRight,
} from 'lucide-react';

export default function Pages({ categories, totalPages, publishedCount, draftCount }) {
  const { props } = usePage();
  const adminUrls = props?.adminUrls || {};
  const pagesUrl = adminUrls.pages || '/cms/pages';

  const [openCategories, setOpenCategories] = useState({
    'Global Header Menu': true,
    'Main Menu': true,
    'Conference Topics Sub Menu': true,
    'Awards Sub Menu': true,
  });

  const [editingPage, setEditingPage] = useState(null);

  const editForm = useForm({
    title: '',
    menu_label: '',
    route_path: '',
    meta_description: '',
    status: 'published',
  });

  const allCategoryNames = Object.keys(categories);
  const areAllExpanded = allCategoryNames.every((name) => openCategories[name] !== false);

  const toggleAll = () => {
    const nextState = !areAllExpanded;
    const updated = {};
    allCategoryNames.forEach((name) => {
      updated[name] = nextState;
    });
    setOpenCategories(updated);
  };

  const toggleCategory = (catName) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catName]: prev[catName] === false ? true : false,
    }));
  };

  const handleOpenEdit = (page) => {
    setEditingPage(page);
    editForm.setData({
      title: page.title,
      menu_label: page.menu_label,
      route_path: page.route_path,
      meta_description: page.meta_description || '',
      status: page.status,
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingPage) return;

    editForm.put(`${pagesUrl}/${editingPage.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setEditingPage(null);
      },
    });
  };

  const handleToggleStatus = (page) => {
    router.post(`${pagesUrl}/${page.id}/toggle-status`, {}, { preserveScroll: true });
  };

  const getPageIcon = (slug) => {
    switch (slug) {
      case 'home':
        return HomeIcon;
      case 'about':
        return Info;
      case 'conference-topics':
        return BookOpen;
      case 'gallery':
        return ImageIcon;
      case 'events-news':
        return Newspaper;
      case 'marports-global-2026':
        return Ship;
      case 'advisory-board-2026':
      case 'advisory-board-2027':
        return Users;
      case 'awards':
      case 'awards-categories':
      case 'awards-overview':
      case 'awards-rules':
      case 'awards-winners':
        return Award;
      case 'speakers-panelists':
        return Users;
      case 'conference-agenda':
        return Calendar;
      case 'global-header-menu':
        return Compass;
      default:
        return FileText;
    }
  };

  const getCategoryDescription = (catName) => {
    switch (catName) {
      case 'Global Header Menu':
        return 'Site header, branding and primary top navigation bar.';
      case 'Main Menu':
        return 'Top-level menu pages visible in website navigation (7 cards).';
      case 'Conference Topics Sub Menu':
        return 'All sub menu pages under Conference Topics.';
      case 'Awards Sub Menu':
        return 'All sub menu pages under Maritime Excellence Awards.';
      default:
        return 'Pages grouped under this section.';
    }
  };

  return (
    <AdminLayout
      title="Website Page Manager"
      subtitle="All menu and sub menu pages are listed below for direct live editing"
    >
      <div className="space-y-6">
        {/* 1. Header Toolbar & Summary Cards */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white flex items-center gap-2.5">
              <Globe className="w-6 h-6 text-[#22C55E]" />
              Website Page Manager
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Select any page below to launch the interactive Live Studio visual editor.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleAll}
            className="rounded-xl border border-[#1E3A68] bg-[#0A1529] hover:bg-[#112344] px-4 py-2 text-xs font-bold text-slate-200 transition-colors shadow-sm cursor-pointer flex items-center gap-2"
          >
            {areAllExpanded ? 'Collapse All Sections' : 'Expand All Sections'}
          </button>
        </div>

        {/* 2. Metric Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0A1529] border border-[#152747] rounded-[18px] p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Managed Pages
              </div>
              <div className="text-3xl font-extrabold text-white mt-1">{totalPages}</div>
              <div className="text-xs text-slate-400 mt-0.5">Categorized summit routes</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A1529] border border-[#152747] rounded-[18px] p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Live / Published
              </div>
              <div className="text-3xl font-extrabold text-emerald-300 mt-1">{publishedCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Active on public site</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-[#0A1529] border border-[#152747] rounded-[18px] p-4 sm:p-5 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Draft Pages
              </div>
              <div className="text-3xl font-extrabold text-amber-300 mt-1">{draftCount}</div>
              <div className="text-xs text-slate-400 mt-0.5">Unpublished or offline</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 3. Categorized Sections */}
        <div className="space-y-6">
          {Object.entries(categories).map(([catName, pageList]) => {
            const isOpen = openCategories[catName] !== false;
            return (
              <section
                key={catName}
                className="bg-[#081120] border border-[#152747] rounded-2xl overflow-hidden shadow-lg"
              >
                {/* Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleCategory(catName)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between bg-[#0A1529] hover:bg-[#0E1E38] transition-colors border-b border-[#152747] text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#112344] border border-[#1E3A68] flex items-center justify-center text-[#22C55E]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{catName}</h3>
                      <p className="text-xs text-slate-400">{getCategoryDescription(catName)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#112344] text-slate-300 border border-[#1E3A68]">
                      {pageList.length} {pageList.length === 1 ? 'card' : 'cards'}
                    </span>
                    {isOpen ? (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* 7 Cards Grid for Main Menu & Sub Menus */}
                {isOpen && (
                  <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 bg-[#081120]">
                    {pageList.map((page) => {
                      const IconComp = getPageIcon(page.slug);
                      return (
                        <div
                          key={page.id}
                          className="rounded-2xl border border-[#152747] bg-[#0A1529] hover:border-purple-500/50 p-4 sm:p-5 shadow-sm transition-all duration-200 flex flex-col justify-between group hover:shadow-purple-500/10 hover:shadow-xl"
                        >
                          {/* Top row: Icon, Title, Status */}
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#112344] border border-[#1E3A68] text-purple-400 group-hover:text-purple-300 group-hover:border-purple-500/40 transition-colors">
                                <IconComp className="w-5 h-5" />
                              </div>

                              <span
                                className={`text-[9px] uppercase px-2 py-0.5 rounded-full font-bold ${
                                  page.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                }`}
                              >
                                {page.status}
                              </span>
                            </div>

                            <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
                              {page.menu_label || page.title}
                            </h4>

                            <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                              <span className="text-[#22C55E] truncate">{page.route_path}</span>
                              <span>•</span>
                              <span className="text-slate-500 truncate">{page.slug}</span>
                            </div>

                            {page.meta_description && (
                              <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                                {page.meta_description}
                              </p>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 pt-3.5 border-t border-[#152747]/80 space-y-2">
                            {/* Primary Button: Enter Live Studio */}
                            <Link
                              href={`/cms/studio/${page.slug || page.id}`}
                              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-purple-500/30 border border-purple-400/30 cursor-pointer"
                              title={`Enter Live Studio for ${page.title}`}
                            >
                              <span>Enter Live Studio</span>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            </Link>

                            {/* Secondary Quick Controls */}
                            <div className="flex items-center gap-1.5">
                              <a
                                href={page.route_path === '#' ? '/' : page.route_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 px-2 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-[11px] font-semibold text-slate-300 flex items-center justify-center gap-1 transition-colors"
                                title="Preview page on live site"
                              >
                                <ExternalLink className="w-3 h-3 text-[#D9A441]" />
                                <span>Preview</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => handleOpenEdit(page)}
                                className="py-1.5 px-2.5 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Edit page metadata"
                              >
                                <Edit3 className="w-3 h-3 text-sky-400" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleToggleStatus(page)}
                                className={`py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
                                  page.status === 'published'
                                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/20'
                                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/20'
                                }`}
                                title={page.status === 'published' ? 'Switch to Draft' : 'Publish Page'}
                              >
                                {page.status === 'published' ? 'Draft' : 'Publish'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* 4. Edit Page Modal */}
      {editingPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0A1529] border border-[#1E3A68] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 sm:p-5 border-b border-[#152747] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Edit Page Details</h3>
                <p className="text-xs text-slate-400">Configure page route & publication status</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="w-8 h-8 rounded-lg bg-[#112344] hover:bg-[#182F58] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-4 sm:p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Page Title
                </label>
                <input
                  type="text"
                  value={editForm.data.title}
                  onChange={(e) => editForm.setData('title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Menu Display Label
                </label>
                <input
                  type="text"
                  value={editForm.data.menu_label}
                  onChange={(e) => editForm.setData('menu_label', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Route Path
                </label>
                <input
                  type="text"
                  value={editForm.data.route_path}
                  onChange={(e) => editForm.setData('route_path', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={editForm.data.meta_description}
                  onChange={(e) => editForm.setData('meta_description', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Status
                </label>
                <select
                  value={editForm.data.status}
                  onChange={(e) => editForm.setData('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#081120] border border-[#152747] text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="published">Published (Live)</option>
                  <option value="draft">Draft (Offline)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-xl bg-[#112344] hover:bg-[#182F58] text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editForm.processing}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editForm.processing ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
