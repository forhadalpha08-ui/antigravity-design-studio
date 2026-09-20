import React from 'react';
import { Template } from '../../types/canvas';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { X, ArrowRight } from 'lucide-react';

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
  // Compute preview scale to fit in modal viewport nicely
  // On mobile use a smaller dimension to avoid overflow
  const previewMaxW = typeof window !== 'undefined' ? Math.min(window.innerWidth - 48, 480) : 480;
  const previewMaxH = typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.4, 400) : 400;
  const scale = Math.min(previewMaxW / template.width, previewMaxH / template.height);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-150 p-0 sm:p-4">
      <div className="w-full sm:max-w-3xl bg-[#12131a] border border-neutral-800 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Drag handle on mobile */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 sm:hidden flex-shrink-0">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 py-3 sm:p-5 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span className="px-2 py-0.5 bg-violet-600/20 border border-violet-500/40 text-violet-300 text-[10px] font-bold uppercase rounded flex-shrink-0">
              {template.category}
            </span>
            <h3 className="text-base font-bold text-white truncate">
              {template.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Canvas Center — height is fluid on mobile */}
        <div className="flex-1 bg-[#090a0f] p-4 sm:p-8 flex items-center justify-center overflow-auto min-h-[200px] sm:min-h-[360px]">
          <div
            className="shadow-2xl origin-center will-change-transform"
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

        {/* Footer info & CTA */}
        <div
          className="p-4 sm:p-5 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between gap-3 flex-shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)' }}
        >
          <div className="min-w-0">
            <div className="text-xs text-neutral-300 font-medium">
              {template.width} × {template.height} px
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5 truncate">
              {template.tags.join(', ')}
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
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <span>Use Template</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
