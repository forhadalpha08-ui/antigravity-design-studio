import React, { useRef, useState, useEffect } from 'react';
import { Template } from '../../types/canvas';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { X, ArrowRight, Sparkles, Layers, Maximize2 } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: Template;
  onClose: () => void;
  onUseTemplate: (template: Template) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onUseTemplate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;

    const computeScale = () => {
      const rect = el.getBoundingClientRect();
      const padding = 24;
      const boxW = Math.max(100, (rect.width || 320) - padding);
      const boxH = Math.max(100, (rect.height || 260) - padding);

      const s = Math.min(boxW / template.width, boxH / template.height);
      if (s > 0) {
        setScale(s);
      }
    };

    computeScale();
    const ro = new ResizeObserver(computeScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, [template.width, template.height]);

  const scaledW = Math.round(template.width * scale);
  const scaledH = Math.round(template.height * scale);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-150 p-0 sm:p-4">
      <div className="w-full sm:max-w-4xl bg-[#12131a] border border-neutral-800 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        {/* Mobile Drag Indicator */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <span className="px-2 py-0.5 bg-violet-600/20 border border-violet-500/40 text-violet-300 text-[10px] font-bold uppercase rounded flex-shrink-0">
              {template.category}
            </span>
            <h3 className="text-sm sm:text-base font-bold text-white truncate">
              {template.title}
            </h3>
            {template.isPremium && (
              <span className="hidden sm:flex items-center gap-1 text-[9px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded">
                <Sparkles size={10} /> EXCLUSIVE
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Canvas Center with Dynamic Fitting */}
        <div
          ref={containerRef}
          className="flex-1 bg-[#08090d] p-3 sm:p-6 flex items-center justify-center overflow-hidden min-h-[220px] sm:min-h-[400px] relative"
        >
          {/* Subtle Canvas Backdrop Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-25"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* Scaled Template Wrapper Box */}
          <div
            className="shadow-2xl rounded-xl overflow-hidden border border-neutral-800 relative z-10 transition-all"
            style={{
              width: `${scaledW}px`,
              height: `${scaledH}px`,
            }}
          >
            <div
              className="origin-top-left pointer-events-none"
              style={{
                transform: `scale(${scale})`,
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
        </div>

        {/* Modal Footer with Metadata and Action */}
        <div
          className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/80 flex items-center justify-between gap-3 flex-shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 14px)' }}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-200">
              <span className="font-mono">{template.width} × {template.height} px</span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1 text-neutral-400 text-[11px]">
                <Layers size={12} />
                {template.elements.length} Elements
              </span>
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
              {template.tags.join(' • ')}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onUseTemplate(template);
                onClose();
              }}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Customize Template</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
