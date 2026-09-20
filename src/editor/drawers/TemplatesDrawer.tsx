import React, { useState, useRef, useEffect, memo } from 'react';
import { Template } from '../../types/canvas';
import { TEMPLATES } from '../../templates/templatesData';
import { TEMPLATE_CATEGORIES } from '../../templates/categories';
import { CanvasRenderer } from '../canvas/CanvasRenderer';
import { Search, Sparkles } from 'lucide-react';

interface TemplatesDrawerProps {
  onSelectTemplate: (template: Template) => void;
}

const DrawerTemplateCard: React.FC<{
  template: Template;
  onSelect: (t: Template) => void;
}> = memo(({ template, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.18);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      const boxW = Math.max(80, (rect.width || 270) - 16);
      const boxH = Math.max(60, (rect.height || 140) - 16);
      const s = Math.min(boxW / template.width, boxH / template.height);
      if (s > 0) setScale(s);
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [template.width, template.height]);

  const scaledW = Math.round(template.width * scale);
  const scaledH = Math.round(template.height * scale);

  return (
    <div
      onClick={() => onSelect(template)}
      className="group relative bg-[#11121c] rounded-xl overflow-hidden border border-neutral-800 hover:border-violet-500/70 transition-all cursor-pointer shadow-lg hover:shadow-violet-600/15"
    >
      {/* Visual Canvas Preview Box */}
      <div
        ref={containerRef}
        className="w-full h-36 bg-[#07080d] flex items-center justify-center overflow-hidden relative"
      >
        <div
          className="shadow-xl rounded overflow-hidden relative flex-shrink-0"
          style={{ width: `${scaledW}px`, height: `${scaledH}px` }}
        >
          <div
            className="origin-top-left pointer-events-none transform transition-transform duration-300 group-hover:scale-105"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              width: `${template.width}px`,
              height: `${template.height}px`,
            }}
          >
            <CanvasRenderer
              project={template as any}
              selectedId={null}
              onSelectElement={() => {}}
              onUpdateElement={() => {}}
            />
          </div>
        </div>

        {template.isPremium && (
          <span className="absolute top-2 left-2 flex items-center gap-1 text-[9px] font-extrabold bg-neutral-950/85 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded shadow backdrop-blur-sm">
            <Sparkles size={10} className="text-amber-400" /> LUXURY
          </span>
        )}

        <span className="absolute bottom-2 right-2 text-[9px] font-mono text-neutral-400 bg-black/75 px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-800">
          {template.width} × {template.height}
        </span>
      </div>

      {/* Info Footer */}
      <div className="p-2.5 bg-neutral-900/90 border-t border-neutral-800 flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
            {template.title}
          </h4>
          <p className="text-[10px] text-neutral-400 truncate">
            {template.tags.slice(0, 3).join(' • ')}
          </p>
        </div>
        <button className="px-2.5 py-1 bg-violet-600/20 hover:bg-violet-600 group-hover:bg-violet-600 border border-violet-500/40 group-hover:border-violet-500 text-violet-300 group-hover:text-white rounded-lg text-[10px] font-bold transition-all whitespace-nowrap shadow-sm">
          Apply
        </button>
      </div>
    </div>
  );
});

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
          <DrawerTemplateCard
            key={tpl.id}
            template={tpl}
            onSelect={onSelectTemplate}
          />
        ))}
      </div>
    </div>
  );
};
