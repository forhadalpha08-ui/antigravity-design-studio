import React, { useState } from 'react';
import { Template } from '../../types/canvas';
import { TEMPLATES } from '../../templates/templatesData';
import { TEMPLATE_CATEGORIES } from '../../templates/categories';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { TemplateCard } from './TemplateCard';
import {
  Search,
  Sparkles,
  Filter,
  Flame,
  Star,
  Layers,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface TemplateLibraryProps {
  onOpenTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
  initialSearch?: string;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  onOpenTemplate,
  onPreviewTemplate,
  initialSearch = '',
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState(initialSearch);
  const [tagFilter, setTagFilter] = useState<'all' | 'trending' | 'new' | 'premium'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name'>('default');

  const filtered = TEMPLATES.filter((tpl) => {
    const matchesCategory =
      selectedCategory === 'all' || tpl.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      tpl.title.toLowerCase().includes(search.toLowerCase()) ||
      tpl.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    let matchesTag = true;
    if (tagFilter === 'trending') matchesTag = !!tpl.isTrending;
    if (tagFilter === 'new') matchesTag = !!tpl.isNew;
    if (tagFilter === 'premium') matchesTag = !!tpl.isPremium;

    return matchesCategory && matchesSearch && matchesTag;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    return 0;
  });

  return (
    <div className="flex-1 w-full overflow-y-auto px-6 py-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Top Banner & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Exclusive Template Library
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse all 50 bespoke editorial, tech, luxury, and social designs
          </p>
        </div>

        {/* Search bar */}
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search size={15} className="absolute left-3.5 top-3 text-neutral-500" />
            <input
              type="text"
              placeholder="Search all 50 templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-violet-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-300 outline-none cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="name">Alphabetical (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Filter Tabs: Trending / New / Premium */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTagFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            tagFilter === 'all'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          All Designs ({TEMPLATES.length})
        </button>

        <button
          onClick={() => setTagFilter('trending')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            tagFilter === 'trending'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Flame size={13} className="text-amber-400" />
          <span>Trending</span>
        </button>

        <button
          onClick={() => setTagFilter('premium')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
            tagFilter === 'premium'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
              : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
          }`}
        >
          <Sparkles size={13} className="text-violet-400" />
          <span>Premium Exclusive</span>
        </button>
      </div>

      {/* 30 Category Filter Pills */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider block">
          Filter by Category ({TEMPLATE_CATEGORIES.length})
        </span>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {TEMPLATE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-100 text-neutral-900 font-bold shadow-lg'
                    : 'bg-neutral-900/90 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-neutral-400">
          <span>Showing {filtered.length} templates</span>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-violet-400 hover:underline"
            >
              Clear category filter
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl text-neutral-500 text-sm">
            No templates match the selected criteria. Try searching for a different keyword.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                template={tpl}
                onOpen={onOpenTemplate}
                onPreview={onPreviewTemplate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
