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
  const previewMaxDimension = 500;
  const scale = Math.min(
    previewMaxDimension / template.width,
    previewMaxDimension / template.height
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-[#12131a] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-violet-600/20 border border-violet-500/40 text-violet-300 text-[10px] font-bold uppercase rounded">
              {template.category}
            </span>
            <h3 className="text-base font-bold text-white truncate">
              {template.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Preview Canvas Center */}
        <div className="flex-1 bg-[#090a0f] p-8 flex items-center justify-center overflow-auto min-h-[420px]">
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
        <div className="p-5 border-t border-neutral-800 bg-neutral-900/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-neutral-300 font-medium">
              Dimensions: {template.width} × {template.height} px
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              Tags: {template.tags.join(', ')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onUseTemplate(template);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <span>Use This Template</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
