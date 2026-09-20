import React, { useState } from 'react';
import { Template } from '../../types/canvas';
import { TEMPLATES } from '../../templates/templatesData';
import { TEMPLATE_CATEGORIES } from '../../templates/categories';
import { Search, Sparkles } from 'lucide-react';

interface TemplatesDrawerProps {
  onSelectTemplate: (template: Template) => void;
}

export const TemplatesDrawer: React.FC<TemplatesDrawerProps> = ({ onSelectTemplate }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filtered = TEMPLATES.filter((t) => {
    const matchesCategory =
      selectedCategory === 'all' || t.category === selectedCategory;
    const matchesSearch =
      search === '' ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none">
      <div className="p-4 border-b border-neutral-800 space-y-3">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          50 Exclusive Templates
        </h2>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-neutral-500" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 outline-none focus:border-violet-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-violet-600 text-white font-medium'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            All
          </button>
          {TEMPLATE_CATEGORIES.slice(1, 15).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-violet-600 text-white font-medium'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates List */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {filtered.map((tpl) => (
          <div
            key={tpl.id}
            onClick={() => onSelectTemplate(tpl)}
            className="group relative bg-neutral-900/90 rounded-xl overflow-hidden border border-neutral-800 hover:border-violet-500/60 transition-all cursor-pointer shadow-lg hover:shadow-violet-500/10"
          >
            <div className="p-3 bg-gradient-to-br from-neutral-800/40 to-neutral-950 flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-neutral-500 uppercase">
                  {tpl.width} × {tpl.height}
                </span>
                {tpl.isPremium && (
                  <span className="flex items-center gap-1 text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                    <Sparkles size={10} /> LUXURY
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white group-hover:text-violet-300 transition-colors">
                  {tpl.title}
                </h4>
                <p className="text-[10px] text-neutral-400 mt-0.5">
                  {tpl.tags.join(' • ')}
                </p>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-neutral-950/60 border-t border-neutral-800/60 text-[10px] text-violet-400 font-medium flex items-center justify-between">
              <span>Apply to canvas</span>
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
