import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  ArrowLeft,
  Save,
  ExternalLink,
  RotateCcw,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Monitor,
  CheckCircle2,
  AlertCircle,
  X,
  Type,
  Link as LinkIcon,
  Sparkles,
  Layers,
  Search,
  Bell,
  Sliders,
  Info,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export default function Studio({
  page,
  allPages = [],
  previewUrl,
  liveUrl,
  initialContentBlocks = {},
}) {
  const { auth } = usePage().props;
  const user = auth?.user;

  // Track modified overrides
  const [contentBlocks, setContentBlocks] = useState(initialContentBlocks || {});
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Selected element in iframe
  const [selectedElement, setSelectedElement] = useState(null);

  // Menu labels editor state
  const [menuLabels, setMenuLabels] = useState(() => {
    const map = {};
    allPages.forEach((p) => {
      map[p.slug] = p.menu_label || p.title;
    });
    return map;
  });

  const iframeRef = useRef(null);

  // Send message to iframe
  const postToIframe = (type, payload) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, payload }, '*');
    }
  };

  // Scroll iframe to target section
  const handleScrollToSection = () => {
    postToIframe('SCROLL_TO_SECTION', { sectionId: page.slug });
  };

  // Listen for messages from preview iframe
  useEffect(() => {
    const handleMessage = (event) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'STUDIO_PREVIEW_READY') {
        postToIframe('APPLY_ALL_OVERRIDES', {
          contentBlocks,
          menuLabels,
        });
        // Also trigger scroll to this section
        setTimeout(() => {
          postToIframe('SCROLL_TO_SECTION', { sectionId: page.slug });
        }, 600);
      } else if (data.type === 'ELEMENT_SELECTED') {
        const elData = data.payload;
        const existingOverride = contentBlocks[elData.path] || {};
        setSelectedElement({
          ...elData,
          text: existingOverride.text !== undefined ? existingOverride.text : elData.text,
          color: existingOverride.color || elData.color || '#ffffff',
          bold: existingOverride.bold !== undefined ? existingOverride.bold : elData.bold,
          italic: existingOverride.italic !== undefined ? existingOverride.italic : elData.italic,
          underline: existingOverride.underline !== undefined ? existingOverride.underline : elData.underline,
          align: existingOverride.align || elData.align || 'left',
          href: existingOverride.href !== undefined ? existingOverride.href : elData.href || '',
          target: existingOverride.target || elData.target || '_self',
          src: existingOverride.src !== undefined ? existingOverride.src : elData.src || '',
          alt: existingOverride.alt !== undefined ? existingOverride.alt : elData.alt || '',
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [contentBlocks, menuLabels, page.slug]);

  // Handle image upload from computer
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateSelectedProperty('src', reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Update an element property in local state and push to iframe
  const updateSelectedProperty = (field, value) => {
    if (!selectedElement) return;

    const updated = {
      ...selectedElement,
      [field]: value,
    };
    setSelectedElement(updated);
    setIsDirty(true);

    const updatedBlocks = {
      ...contentBlocks,
      [selectedElement.path]: {
        ...(contentBlocks[selectedElement.path] || {}),
        path: selectedElement.path,
        tag: selectedElement.tag,
        [field]: value,
      },
    };
    setContentBlocks(updatedBlocks);

    postToIframe('UPDATE_ELEMENT', {
      path: selectedElement.path,
      field,
      value,
      fullElement: updated,
    });
  };

  // Handle section-specific text field edits
  const handleSectionFieldChange = (fieldKey, value, domSelector = null) => {
    setIsDirty(true);
    const updatedBlocks = {
      ...contentBlocks,
      [fieldKey]: {
        ...(contentBlocks[fieldKey] || {}),
        text: value,
        selector: domSelector,
      },
    };
    setContentBlocks(updatedBlocks);

    // Also update in preview iframe if element exists
    if (domSelector) {
      postToIframe('UPDATE_ELEMENT', {
        path: domSelector,
        field: 'text',
        value,
      });
    }
  };

  // Handle menu name change
  const handleMenuChange = (slug, newLabel) => {
    const updated = {
      ...menuLabels,
      [slug]: newLabel,
    };
    setMenuLabels(updated);
    setIsDirty(true);

    postToIframe('UPDATE_MENU_LABEL', {
      slug,
      label: newLabel,
    });
  };

  // Save changes to server
  const handleSave = () => {
    setIsSaving(true);
    router.post(
      `/cms/studio/${page.id || page.slug}`,
      {
        content_blocks: contentBlocks,
        navigation_menus: menuLabels,
        menu_label: menuLabels[page.slug] || page.menu_label,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setIsSaving(false);
          setIsDirty(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3500);
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  // Reset unsaved changes
  const handleReset = () => {
    setContentBlocks(initialContentBlocks || {});
    setSelectedElement(null);
    setIsDirty(false);

    const map = {};
    allPages.forEach((p) => {
      map[p.slug] = p.menu_label || p.title;
    });
    setMenuLabels(map);

    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleDeselect = () => {
    setSelectedElement(null);
    postToIframe('CLEAR_SELECTION', {});
  };

  return (
    <div className="min-h-screen bg-[#070E1B] text-slate-200 font-sans flex flex-col antialiased selection:bg-[#22C55E] selection:text-[#0A1E3F]">
      <Head title={`Live Studio – ${page.title}`} />

      {/* 1. Global Header Bar */}
      <header className="h-14 bg-[#0A1529] border-b border-[#152747] px-4 sm:px-6 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center gap-3">
          <Link href="/cms/pages" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center text-[#0A1E3F] font-black text-xs shadow-xs">
              M
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                MARPORTS
              </span>
              <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded bg-[#162D55] text-[#22C55E] font-medium">
                LIVE STUDIO
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search / Info */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#152747] text-xs text-slate-400 w-84">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">Visual Live Editing • Section: {page.title}</span>
        </div>

        {/* User Profile Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2">
            <div className="w-7 h-7 rounded-full bg-[#152747] text-sky-400 font-bold text-xs flex items-center justify-center border border-[#1E3A68]">
              {user?.first_name?.[0] || 'A'}
            </div>
            <div className="hidden sm:block text-left leading-none">
              <span className="text-xs font-bold text-white block">{user?.name || 'admin'}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">SYSTEM ADMIN</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Workspace: Left Editor Sidebar + Right Preview Canvas */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Side: Element & Section Editor Panel (390px fixed) */}
        <aside className="w-full md:w-[390px] lg:w-[420px] shrink-0 bg-[#081120] border-r border-[#152747] flex flex-col h-[calc(100vh-56px)] overflow-y-auto">
          {/* Top Control Bar */}
          <div className="p-4 border-b border-[#152747] bg-[#0A1529]/60 flex items-center justify-between gap-3">
            <Link
              href="/cms/pages"
              className="px-3 py-1.5 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Exit</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all cursor-pointer ${
                isDirty
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white ring-2 ring-purple-500/50'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'SAVE'}</span>
            </button>
          </div>

          {/* Alert / Notice */}
          <div className="px-4 py-2 bg-[#0E1A30] border-b border-[#152747] flex items-center justify-between text-[11px] text-slate-400">
            <span>Changes are local until you click Save.</span>
            {isDirty && (
              <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold text-[10px]">
                Unsaved
              </span>
            )}
            {saveSuccess && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Saved!
              </span>
            )}
          </div>

          <div className="p-4 space-y-4 flex-1">
            {/* Studio Info Card */}
            <div className="p-4 rounded-xl bg-[#0A1529] border border-[#152747] space-y-3">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-sky-400 block mb-0.5">
                  STUDIO
                </span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  {page.title}
                </h2>
                <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                  {page.route_path}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>OPEN LIVE</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </a>

                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-[#112344] hover:bg-[#182F58] border border-[#1E3A68] text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="Discard changes and reload preview"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>RESET UNSAVED</span>
                </button>
              </div>

              {/* Scroll to section button */}
              <button
                type="button"
                onClick={handleScrollToSection}
                className="w-full py-1.5 px-3 rounded-lg bg-[#112344]/80 hover:bg-[#182F58] border border-purple-500/30 text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Focus & Scroll to This Section</span>
              </button>
            </div>

            {/* Current Page Menu Name */}
            <div className="p-4 rounded-xl bg-[#0A1529] border border-[#152747] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300 block">
                  Current Page Menu Name
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {page.slug}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Edit this page menu label directly here.
              </p>
              <input
                type="text"
                value={menuLabels[page.slug] ?? page.menu_label ?? page.title}
                onChange={(e) => handleMenuChange(page.slug, e.target.value)}
                placeholder={page.title}
                className="w-full px-3 py-2 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* ELEMENT / SECTION EDITOR CONTAINER */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs uppercase font-bold tracking-wider text-slate-300">
                    {selectedElement ? 'ELEMENT EDITOR' : 'SECTION EDITOR'}
                  </h3>
                  <span className="text-[10px] text-slate-500 block">
                    Page: {page.title}
                  </span>
                </div>
                {selectedElement && (
                  <button
                    type="button"
                    onClick={handleDeselect}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Deselect
                  </button>
                )}
              </div>

              {/* MODE A: Clicked Canvas Element is Active */}
              {selectedElement ? (
                <div className="p-4 rounded-xl bg-[#0A1529] border border-[#1B325E] space-y-4 animate-in fade-in duration-200">
                  {/* Selected Tag & DOM Path */}
                  <div className="pb-3 border-b border-[#152747]">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block mb-1">
                      SELECTED
                    </span>
                    <div className="p-2 rounded bg-[#070E1B] border border-[#152747] font-mono text-[10px] text-slate-400 break-all select-all">
                      {selectedElement.path}
                    </div>
                    <div className="mt-1.5 text-[10px] font-semibold text-slate-400 uppercase">
                      TYPE: <span className="text-white">{selectedElement.tag}</span>
                    </div>
                  </div>

                  {/* Image Tag Handling */}
                  {selectedElement.tag === 'img' ? (
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          IMAGE SOURCE (URL)
                        </label>
                        <input
                          type="text"
                          value={selectedElement.src || ''}
                          onChange={(e) => updateSelectedProperty('src', e.target.value)}
                          placeholder="https://... or /images/..."
                          className="w-full px-3 py-2 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          ALT TEXT
                        </label>
                        <input
                          type="text"
                          value={selectedElement.alt || ''}
                          onChange={(e) => updateSelectedProperty('alt', e.target.value)}
                          placeholder="Image description..."
                          className="w-full px-3 py-2 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          UPLOAD IMAGE REPLACEMENT
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-slate-300 text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Content Textarea */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          CONTENT
                        </label>
                        <textarea
                          rows={4}
                          value={selectedElement.text}
                          onChange={(e) => updateSelectedProperty('text', e.target.value)}
                          placeholder="Enter element text..."
                          className="w-full px-3 py-2.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-sans"
                        />
                      </div>

                  {/* Typography Formatting */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      FORMATTING
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateSelectedProperty('bold', !selectedElement.bold)}
                        className={`w-9 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                          selectedElement.bold
                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                            : 'bg-[#070E1B] border-[#152747] text-slate-300 hover:text-white'
                        }`}
                        title="Bold"
                      >
                        <Bold className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSelectedProperty('italic', !selectedElement.italic)}
                        className={`w-9 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                          selectedElement.italic
                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                            : 'bg-[#070E1B] border-[#152747] text-slate-300 hover:text-white'
                        }`}
                        title="Italic"
                      >
                        <Italic className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => updateSelectedProperty('underline', !selectedElement.underline)}
                        className={`w-9 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                          selectedElement.underline
                            ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                            : 'bg-[#070E1B] border-[#152747] text-slate-300 hover:text-white'
                        }`}
                        title="Underline"
                      >
                        <Underline className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      TEXT COLOR
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedElement.color || '#ffffff'}
                        onChange={(e) => updateSelectedProperty('color', e.target.value)}
                        className="w-8 h-8 rounded-lg border border-[#1E3A68] bg-[#070E1B] p-0.5 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={selectedElement.color || '#ffffff'}
                        onChange={(e) => updateSelectedProperty('color', e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      ALIGNMENT
                    </label>
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight },
                      ].map((alignOpt) => {
                        const Icon = alignOpt.icon;
                        const active = (selectedElement.align || 'left') === alignOpt.id;
                        return (
                          <button
                            key={alignOpt.id}
                            type="button"
                            onClick={() => updateSelectedProperty('align', alignOpt.id)}
                            className={`w-9 h-8 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                              active
                                ? 'bg-purple-600/30 border-purple-500 text-purple-300'
                                : 'bg-[#070E1B] border-[#152747] text-slate-300 hover:text-white'
                            }`}
                            title={`Align ${alignOpt.id}`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Link / URL if anchor or button */}
                  {(selectedElement.tag === 'a' || selectedElement.tag === 'button') && (
                    <div className="space-y-3 pt-2 border-t border-[#152747]">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          LINK URL (HREF)
                        </label>
                        <input
                          type="text"
                          value={selectedElement.href || ''}
                          onChange={(e) => updateSelectedProperty('href', e.target.value)}
                          placeholder="#section or https://..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                          TARGET
                        </label>
                        <select
                          value={selectedElement.target || '_self'}
                          onChange={(e) => updateSelectedProperty('target', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-purple-500"
                        >
                          <option value="_self">Same Window (_self)</option>
                          <option value="_blank">New Tab (_blank)</option>
                        </select>
                      </div>
                    </div>
                  )}
                    </>
                  )}
                </div>
              ) : (
                /* MODE B: Section-Specific Form Editor (Different for each of the 7 cards) */
                <div className="p-4 rounded-xl bg-[#0A1529] border border-[#152747] space-y-4">
                  {/* Click instruction banner */}
                  <div className="p-3 rounded-lg bg-[#0E1E38] border border-[#1B3563] flex items-start gap-2 text-slate-300 text-xs">
                    <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <span>
                      Click any text, heading, or button in the live preview on the right to edit it directly.
                    </span>
                  </div>

                  {/* 1. Home / Hero Page */}
                  {page.slug === 'home' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        HERO & SUMMIT BANNER
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Event Title
                        </label>
                        <input
                          type="text"
                          defaultValue="MARPORTS GLOBAL"
                          onChange={(e) => handleSectionFieldChange('hero_title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Subtitle & Focus
                        </label>
                        <textarea
                          rows={2}
                          defaultValue="A premium maritime forum for global leaders, port authorities, and industry innovators shaping the future of trade, sustainability and port excellence."
                          onChange={(e) => handleSectionFieldChange('hero_subtitle', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Date & Location Badge
                        </label>
                        <input
                          type="text"
                          defaultValue="5 FEBRUARY 2027 • TAJ COROMANDEL, CHENNAI"
                          onChange={(e) => handleSectionFieldChange('hero_badge', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 2. About Marports Global */}
                  {page.slug === 'about' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        ABOUT SECTION CONTENT
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Section Badge
                        </label>
                        <input
                          type="text"
                          defaultValue="A PREMIER GLOBAL MARITIME FORUM"
                          onChange={(e) => handleSectionFieldChange('about_badge', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Main Heading
                        </label>
                        <input
                          type="text"
                          defaultValue="Bridging Continents, Powering Maritime Excellence"
                          onChange={(e) => handleSectionFieldChange('about_heading', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Description Paragraph 1
                        </label>
                        <textarea
                          rows={3}
                          defaultValue="MARPORTS GLOBAL 2027 is an international maritime forum uniting port authorities, shipowners, naval architects, and digital supply chain leaders."
                          onChange={(e) => handleSectionFieldChange('about_p1', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 3. Conference Topics */}
                  {page.slug === 'conference-topics' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        CONFERENCE PILLARS & TOPICS
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Topic 01 Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Sustainable, Green, and Resilient Shipping"
                          onChange={(e) => handleSectionFieldChange('topic_01', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Topic 02 Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Port Infrastructure and Strategic Initiatives"
                          onChange={(e) => handleSectionFieldChange('topic_02', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Topic 03 Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Advanced Ship Design, Shipbuilding, and Modern Shipyards"
                          onChange={(e) => handleSectionFieldChange('topic_03', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Topic 04 Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Digital Transformation, Automation, and Smart Port Ecosystems"
                          onChange={(e) => handleSectionFieldChange('topic_04', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 4. Gallery & Media */}
                  {page.slug === 'gallery' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        GALLERY & MEDIA HIGHLIGHTS
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Section Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Summit Moments & Photo Gallery"
                          onChange={(e) => handleSectionFieldChange('gallery_title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Section Subtitle
                        </label>
                        <textarea
                          rows={2}
                          defaultValue="Visual highlights capturing distinguished delegations, keynote presentations, and executive networking."
                          onChange={(e) => handleSectionFieldChange('gallery_subtitle', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 5. Events & News */}
                  {page.slug === 'events-news' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        INDUSTRY NEWS & EVENTS
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Section Title
                        </label>
                        <input
                          type="text"
                          defaultValue="Events and News"
                          onChange={(e) => handleSectionFieldChange('news_title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          News Lead 1
                        </label>
                        <input
                          type="text"
                          defaultValue="Mazagon Dock Shipbuilders Joins as Lead Maritime Partner"
                          onChange={(e) => handleSectionFieldChange('news_item_1', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          News Lead 2
                        </label>
                        <input
                          type="text"
                          defaultValue="Special Focus on IMO 2030 Decarbonization Targets"
                          onChange={(e) => handleSectionFieldChange('news_item_2', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 6. Marports Global 2026 Edition */}
                  {page.slug === 'marports-global-2026' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        2026 EDITION RECAP
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Edition Headline
                        </label>
                        <input
                          type="text"
                          defaultValue="MARPORTS GLOBAL 2026 Trivandrum Highlights"
                          onChange={(e) => handleSectionFieldChange('past_title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Venue & Date
                        </label>
                        <input
                          type="text"
                          defaultValue="Lemon Tree Hotel, Trivandrum, India • 24th April 2026"
                          onChange={(e) => handleSectionFieldChange('past_venue', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 7. Advisory Board */}
                  {page.slug === 'advisory-board-2026' && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        ADVISORY BOARD OVERVIEW
                      </span>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Board Heading
                        </label>
                        <input
                          type="text"
                          defaultValue="Advisory Board 2027"
                          onChange={(e) => handleSectionFieldChange('board_title', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Subtitle
                        </label>
                        <textarea
                          rows={2}
                          defaultValue="Distinguished maritime captains, public sector leaders, and naval architects guiding MARPORTS GLOBAL."
                          onChange={(e) => handleSectionFieldChange('board_subtitle', e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E]"
                        />
                      </div>
                    </div>
                  )}

                  {/* 8. Global Header Menu / Menu Names Editor */}
                  {(page.slug === 'global-header-menu' || page.category === 'Global Header Menu') && (
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#22C55E] block">
                        TOP NAVIGATION MENUS
                      </span>

                      {[
                        { slug: 'home', defaultLabel: 'Home' },
                        { slug: 'about', defaultLabel: 'About' },
                        { slug: 'conference-topics', defaultLabel: 'Conference Topics' },
                        { slug: 'awards', defaultLabel: 'Awards' },
                        { slug: 'gallery', defaultLabel: 'Gallery' },
                        { slug: 'events-news', defaultLabel: 'Events and News' },
                        { slug: 'marports-global-2026', defaultLabel: 'Previous Editions' },
                      ].map((item) => (
                        <div key={item.slug} className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                            {item.defaultLabel}
                          </label>
                          <input
                            type="text"
                            value={menuLabels[item.slug] || ''}
                            onChange={(e) => handleMenuChange(item.slug, e.target.value)}
                            placeholder={item.defaultLabel}
                            className="w-full px-3 py-1.5 rounded-lg bg-[#070E1B] border border-[#1E3A68] text-white text-xs focus:outline-none focus:border-[#22C55E] transition-colors"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Right Side: LIVE PREVIEW CANVAS */}
        <main className="flex-1 bg-[#050B14] p-3 sm:p-5 flex flex-col h-[calc(100vh-56px)] overflow-hidden">
          {/* Preview Canvas Bar */}
          <div className="flex items-center justify-between pb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#0A1529] border border-[#152747] text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Monitor className="w-3.5 h-3.5 text-[#22C55E]" />
                LIVE PREVIEW CANVAS
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Section: <strong className="text-purple-300">{page.title}</strong> • Click any text to edit
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                Interactive Preview Active
              </span>
            </div>
          </div>

          {/* Embedded Device Frame Container */}
          <div className="flex-1 rounded-2xl bg-[#0A1529] border border-[#1E3A68] shadow-2xl overflow-hidden relative flex flex-col">
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title={`Live Studio Interactive Preview - ${page.title}`}
              className="w-full h-full border-0 bg-white"
              sandbox="allow-same-origin allow-scripts allow-forms"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
