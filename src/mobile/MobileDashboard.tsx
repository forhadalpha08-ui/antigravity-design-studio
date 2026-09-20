import React, { useState, useRef } from 'react';
import { Project, Template } from '../types/canvas';
import { CANVAS_PRESETS } from '../utils/presetSizes';
import { TEMPLATES } from '../templates/templatesData';
import { TEMPLATE_CATEGORIES } from '../templates/categories';
import { CanvasRenderer } from '../editor/canvas/CanvasRenderer';
import { TemplateCard } from '../components/dashboard/TemplateCard';
import { useBrandKitState } from '../store/useBrandKitStore';
import { GOOGLE_FONTS } from '../utils/fonts';
import {
  Sparkles,
  Plus,
  Search,
  Home,
  LayoutGrid,
  FolderKanban,
  Palette,
  Image as ImageIcon,
  Flame,
  Clock,
  ArrowRight,
  Star,
  Copy,
  Trash2,
  Edit3,
  Upload,
  Check,
  Eye,
  Camera,
  Layers,
} from 'lucide-react';

export type MobileDashboardTab = 'home' | 'templates' | 'projects' | 'brand-kit' | 'assets';

interface MobileDashboardProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onOpenTemplate: (t: Template) => void;
  onPreviewTemplate: (t: Template) => void;
  onOpenNewDesignModal: () => void;
  onCreateBlank: (title: string, width: number, height: number, category: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  projects,
  onOpenProject,
  onOpenTemplate,
  onPreviewTemplate,
  onOpenNewDesignModal,
  onCreateBlank,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
}) => {
  const [currentTab, setCurrentTab] = useState<MobileDashboardTab>('home');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [tagFilter, setTagFilter] = useState<'all' | 'trending' | 'premium'>('all');
  const [filterFavOnly, setFilterFavOnly] = useState(false);

  // Brand kit state
  const { brandKit, addColor, removeColor, updateFonts } = useBrandKitState();
  const [newColorInput, setNewColorInput] = useState('#8b5cf6');

  // Custom asset uploads
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setUploadedImages((prev) => [reader.result as string, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Filter templates
  const filteredTemplates = TEMPLATES.filter((t) => {
    const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchesTag =
      tagFilter === 'all' ||
      (tagFilter === 'trending' && t.isTrending) ||
      (tagFilter === 'premium' && t.isPremium);
    const matchesSearch =
      search.trim() === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesTag && matchesSearch;
  });

  // Filter projects
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      search.trim() === '' || p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFav = filterFavOnly ? p.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  const trendingTemplates = TEMPLATES.filter((t) => t.isTrending).slice(0, 8);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#090a0f] select-none overflow-hidden relative">
      {/* 1. MOBILE HEADER */}
      <header className="px-4 pt-3.5 pb-3 bg-[#0d0e14] border-b border-neutral-800 flex items-center justify-between z-20 flex-shrink-0">
        <div
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-600 p-[1px] shadow-lg shadow-violet-600/30">
            <div className="w-full h-full bg-[#0d0e14] rounded-[11px] flex items-center justify-center">
              <Sparkles size={15} className="text-violet-400" />
            </div>
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-white block uppercase">
              AF-CANVAS
            </span>
            <span className="text-[8px] font-bold text-neutral-400 block -mt-1 tracking-wider">
              DESIGN STUDIO
            </span>
          </div>
        </div>

        <button
          onClick={onOpenNewDesignModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 active:from-violet-500 active:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/30"
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </header>

      {/* 2. MAIN SCROLLABLE CONTENT */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-4 space-y-6">
        {/* Search Bar (Auto-switches to templates if on home) */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder={
              currentTab === 'projects'
                ? 'Search your designs...'
                : 'Search 50 templates, sizes, categories...'
            }
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* -------------------- TAB 1: HOME -------------------- */}
        {currentTab === 'home' && (
          <>
            {/* Quick Sizing Horizontal Strip */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Quick Start Sizing
                </span>
                <span className="text-[10px] text-neutral-500">Pick to start blank</span>
              </div>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {CANVAS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() =>
                      onCreateBlank(preset.name, preset.width, preset.height, preset.category)
                    }
                    className="flex-shrink-0 w-28 p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-left active:border-violet-500 active:scale-95 transition-all shadow"
                  >
                    <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                    <div className="text-[9px] font-mono text-neutral-500 mt-0.5">
                      {preset.width} × {preset.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Designs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} className="text-violet-400" />
                  <span>Recent Designs ({projects.length})</span>
                </span>
                <button
                  onClick={() => setCurrentTab('projects')}
                  className="text-xs text-violet-400 font-semibold"
                >
                  View all →
                </button>
              </div>

              {projects.length === 0 ? (
                <div className="p-8 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-500 text-xs">
                  No designs yet. Tap a template below or click &quot;New&quot; to start.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.slice(0, 4).map((proj) => {
                    const scale = Math.min(180 / proj.width, 120 / proj.height);
                    return (
                      <div
                        key={proj.id}
                        onClick={() => onOpenProject(proj.id)}
                        className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col active:border-violet-500 shadow-md group"
                      >
                        <div className="w-full h-32 bg-[#090a0f] flex items-center justify-center overflow-hidden relative checkerboard-pattern">
                          <div
                            className="origin-center pointer-events-none transform shadow-md"
                            style={{
                              transform: `scale(${scale})`,
                              width: `${proj.width}px`,
                              height: `${proj.height}px`,
                            }}
                          >
                            <CanvasRenderer
                              project={proj}
                              selectedId={null}
                              onSelectElement={() => {}}
                              onUpdateElement={() => {}}
                            />
                          </div>

                          {/* Quick Favorite Star */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(proj.id);
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-neutral-400 hover:text-amber-400"
                          >
                            <Star
                              size={13}
                              className={proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}
                            />
                          </button>
                        </div>

                        <div className="p-3 flex items-center justify-between bg-neutral-900 border-t border-neutral-800">
                          <div>
                            <h4 className="text-xs font-bold text-white truncate max-w-[170px]">
                              {proj.title}
                            </h4>
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {proj.width} × {proj.height}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDuplicateProject(proj.id);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
                              title="Duplicate"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteProject(proj.id);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Popular Templates */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={13} className="text-amber-400" />
                  <span>Trending Templates</span>
                </span>
                <button
                  onClick={() => setCurrentTab('templates')}
                  className="text-xs text-violet-400 font-semibold"
                >
                  View all 50 →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {trendingTemplates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onOpen={onOpenTemplate}
                    onPreview={onPreviewTemplate}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* -------------------- TAB 2: TEMPLATES (ALL 50) -------------------- */}
        {currentTab === 'templates' && (
          <div className="space-y-4">
            {/* Tag Filter Buttons */}
            <div className="flex gap-2 text-xs">
              <button
                onClick={() => setTagFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  tagFilter === 'all'
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                All ({TEMPLATES.length})
              </button>
              <button
                onClick={() => setTagFilter('trending')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  tagFilter === 'trending'
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <Flame size={13} className="text-amber-400" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setTagFilter('premium')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  tagFilter === 'premium'
                    ? 'bg-violet-600 text-white'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <Sparkles size={13} className="text-violet-400" />
                <span>Exclusive</span>
              </button>
            </div>

            {/* 30 Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {TEMPLATE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white text-neutral-950 font-bold'
                      : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Templates Count & Grid */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span>Showing {filteredTemplates.length} templates</span>
              {selectedCategory !== 'all' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="text-violet-400 underline"
                >
                  Reset category
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredTemplates.map((tpl) => (
                <TemplateCard
                  key={tpl.id}
                  template={tpl}
                  onOpen={onOpenTemplate}
                  onPreview={onPreviewTemplate}
                />
              ))}
            </div>
          </div>
        )}

        {/* -------------------- TAB 3: PROJECTS MANAGER -------------------- */}
        {currentTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Saved Designs ({filteredProjects.length})
              </span>
              <button
                onClick={() => setFilterFavOnly(!filterFavOnly)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  filterFavOnly
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                }`}
              >
                <Star size={12} className={filterFavOnly ? 'fill-amber-400' : ''} />
                <span>Favorites</span>
              </button>
            </div>

            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl text-neutral-500 text-xs">
                No designs match your filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {filteredProjects.map((proj) => {
                  const scale = Math.min(220 / proj.width, 130 / proj.height);
                  return (
                    <div
                      key={proj.id}
                      onClick={() => onOpenProject(proj.id)}
                      className="bg-neutral-900/90 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col active:border-violet-500 shadow-md group"
                    >
                      <div className="w-full h-36 bg-[#090a0f] flex items-center justify-center overflow-hidden relative checkerboard-pattern">
                        <div
                          className="origin-center pointer-events-none transform shadow-md"
                          style={{
                            transform: `scale(${scale})`,
                            width: `${proj.width}px`,
                            height: `${proj.height}px`,
                          }}
                        >
                          <CanvasRenderer
                            project={proj}
                            selectedId={null}
                            onSelectElement={() => {}}
                            onUpdateElement={() => {}}
                          />
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(proj.id);
                          }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 text-neutral-400 hover:text-amber-400"
                        >
                          <Star
                            size={14}
                            className={proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}
                          />
                        </button>
                      </div>

                      <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-white truncate max-w-[180px]">
                            {proj.title}
                          </h4>
                          <span className="text-[10px] text-neutral-500 font-mono">
                            {new Date(proj.updatedAt).toLocaleDateString()} • {proj.width}×
                            {proj.height}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateProject(proj.id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-white rounded-lg"
                            title="Duplicate"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(proj.id);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-400 rounded-lg"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* -------------------- TAB 4: BRAND KIT STUDIO -------------------- */}
        {currentTab === 'brand-kit' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Palette size={20} className="text-violet-400" />
                <span>Brand Kit Studio</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Save your company colors, typography styles, and re-theme templates with 1 tap.
              </p>
            </div>

            {/* Brand Colors */}
            <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                  Brand Color Palette
                </span>
                <span className="text-[10px] text-neutral-500 font-mono">
                  {brandKit.colors.length} colors
                </span>
              </div>

              <div className="grid grid-cols-4 gap-2.5">
                {brandKit.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center p-2 bg-neutral-800/80 border border-neutral-700/80 rounded-xl"
                  >
                    <div
                      className="w-10 h-10 rounded-lg shadow-md mb-1.5"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-[9px] font-mono text-neutral-300 uppercase truncate max-w-full">
                      {color}
                    </span>
                    <button
                      onClick={() => removeColor(color)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Color Input */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="color"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  className="w-10 h-9 rounded-lg bg-transparent border border-neutral-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={newColorInput}
                  onChange={(e) => setNewColorInput(e.target.value)}
                  className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs font-mono text-white outline-none"
                />
                <button
                  onClick={() => addColor(newColorInput)}
                  className="px-4 py-2 bg-violet-600 active:bg-violet-500 text-white rounded-xl text-xs font-bold shadow"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Brand Typography */}
            <div className="p-4 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-4">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Brand Typography
              </span>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">
                    HEADING FONT
                  </span>
                  <select
                    value={brandKit.fonts.heading}
                    onChange={(e) =>
                      updateFonts({ ...brandKit.fonts, heading: e.target.value })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white outline-none"
                  >
                    {GOOGLE_FONTS.map((f) => (
                      <option key={f.family} value={f.family}>
                        {f.family} ({f.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">
                    BODY FONT
                  </span>
                  <select
                    value={brandKit.fonts.body}
                    onChange={(e) =>
                      updateFonts({ ...brandKit.fonts, body: e.target.value })
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-2.5 text-white outline-none"
                  >
                    {GOOGLE_FONTS.map((f) => (
                      <option key={f.family} value={f.family}>
                        {f.family} ({f.category})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => onCreateBlank('Brand Design', 1080, 1080, 'brand')}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 active:from-violet-500 active:to-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles size={16} />
              <span>Create Design with Brand Kit</span>
            </button>
          </div>
        )}

        {/* -------------------- TAB 5: ASSET LIBRARY -------------------- */}
        {currentTab === 'assets' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <ImageIcon size={20} className="text-violet-400" />
                <span>Asset Library & Uploads</span>
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Upload photos from your phone camera or gallery and browse creative stock assets.
              </p>
            </div>

            {/* Device Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-6 border-2 border-dashed border-neutral-700 active:border-violet-500 rounded-3xl bg-neutral-900/60 flex flex-col items-center justify-center text-center cursor-pointer space-y-2 shadow-inner"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow">
                <Camera size={22} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">
                  Tap to upload from Device or Camera
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  Supports JPG, PNG, WEBP, SVG
                </span>
              </div>
            </div>

            {/* Custom Uploads Gallery */}
            {uploadedImages.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                  Your Uploads ({uploadedImages.length})
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {uploadedImages.map((src, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 relative shadow"
                    >
                      <img src={src} alt="Upload" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Royalty-Free Stock Photos */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block">
                Studio Stock Library
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  {
                    title: 'Haute Couture',
                    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Neon Cyberpunk',
                    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Luxury Architecture',
                    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Athletic Energy',
                    url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Artisan Culinary',
                    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Modern Abstract',
                    url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&q=80',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 group shadow"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white truncate">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. MOBILE BOTTOM 5-TAB NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0e0f16]/95 border-t border-neutral-800 flex items-center justify-around px-2 z-40 backdrop-blur-xl">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            currentTab === 'home' ? 'text-violet-400 font-bold' : 'text-neutral-500'
          }`}
        >
          <Home size={18} />
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('templates')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            currentTab === 'templates' ? 'text-violet-400 font-bold' : 'text-neutral-500'
          }`}
        >
          <LayoutGrid size={18} />
          <span className="text-[10px] mt-1 font-semibold">Templates</span>
        </button>

        <button
          onClick={() => setCurrentTab('projects')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            currentTab === 'projects' ? 'text-violet-400 font-bold' : 'text-neutral-500'
          }`}
        >
          <FolderKanban size={18} />
          <span className="text-[10px] mt-1 font-semibold">Projects</span>
        </button>

        <button
          onClick={() => setCurrentTab('brand-kit')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            currentTab === 'brand-kit' ? 'text-violet-400 font-bold' : 'text-neutral-500'
          }`}
        >
          <Palette size={18} />
          <span className="text-[10px] mt-1 font-semibold">Brand Kit</span>
        </button>

        <button
          onClick={() => setCurrentTab('assets')}
          className={`flex flex-col items-center justify-center p-1.5 transition-colors ${
            currentTab === 'assets' ? 'text-violet-400 font-bold' : 'text-neutral-500'
          }`}
        >
          <ImageIcon size={18} />
          <span className="text-[10px] mt-1 font-semibold">Assets</span>
        </button>
      </nav>
    </div>
  );
};
