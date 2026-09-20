import React, { useRef, useState, useEffect, memo } from 'react';
import { Template } from '../../types/canvas';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { Eye, ArrowRight, Sparkles } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onOpen: (template: Template) => void;
  onPreview: (template: Template) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = memo(({
  template,
  onOpen,
  onPreview,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.18);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const updateScale = () => {
      const rect = el.getBoundingClientRect();
      const boxW = rect.width || 280;
      const boxH = rect.height || 208;
      const padding = 16;
      const w = template.width || 1080;
      const h = template.height || 1080;
      const s = Math.min((boxW - padding) / w, (boxH - padding) / h);
      if (s > 0) {
        setScale(s);
      }
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
      onClick={() => onOpen(template)}
      className="group relative bg-[#11121a] rounded-2xl overflow-hidden border border-neutral-800/90 hover:border-violet-500/70 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-violet-600/15 flex flex-col hover:-translate-y-1"
    >
      {/* 1. VISUAL CANVAS PREVIEW BOX */}
      <div
        ref={containerRef}
        className="w-full h-52 bg-[#090a0f] flex items-center justify-center overflow-hidden relative checkerboard-pattern p-2"
      >
        {/* Rendered Template Scaled in Box */}
        <div
          className="shadow-2xl rounded-lg overflow-hidden relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            width: `${scaledW}px`,
            height: `${scaledH}px`,
          }}
        >
          <div
            className="origin-top-left pointer-events-none"
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

        {/* Exclusive / Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 text-[9px] font-extrabold bg-neutral-900/90 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md shadow-lg backdrop-blur-sm">
            <Sparkles size={10} className="text-amber-400" />
            <span>EXCLUSIVE</span>
          </div>
        )}

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-neutral-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-250 flex flex-col items-center justify-center gap-2.5 p-4 backdrop-blur-[3px] z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpen(template);
            }}
            className="w-full max-w-[160px] flex items-center justify-center gap-1.5 py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/40 transition-all hover:scale-105"
          >
            <span>Use Template</span>
            <ArrowRight size={14} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="w-full max-w-[160px] flex items-center justify-center gap-1.5 py-1.5 px-3 bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-medium border border-neutral-700 transition-colors"
          >
            <Eye size={13} />
            <span>Full Preview</span>
          </button>
        </div>
      </div>

      {/* 2. CARD METADATA FOOTER */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-neutral-900/80 border-t border-neutral-800/90">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider">
              {template.category}
            </span>
            <span className="text-[10px] font-mono text-neutral-500">
              {template.width} × {template.height}
            </span>
          </div>
          <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors mt-1 truncate">
            {template.title}
          </h3>
        </div>

        <div className="pt-2 mt-2 border-t border-neutral-800/50 flex items-center justify-between text-[11px] text-neutral-400">
          <span className="text-neutral-500 truncate max-w-[160px]">
            {template.tags.slice(0, 2).join(' • ')}
          </span>
          <span className="text-violet-400 font-semibold group-hover:translate-x-0.5 transition-transform">
            Open →
          </span>
        </div>
      </div>
    </div>
  );
});

TemplateCard.displayName = 'TemplateCard';
