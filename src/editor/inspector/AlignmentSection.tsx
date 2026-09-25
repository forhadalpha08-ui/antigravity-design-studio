import React, { useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignStartVertical,
  AlignEndVertical,
  AlignCenterVertical,
  AlignHorizontalDistributeCenter,
  AlignVerticalDistributeCenter,
  LayoutGrid,
  Columns3,
} from 'lucide-react';

interface AlignmentSectionProps {
  selectedIds: string[];
  elements: any[];
  canvasWidth: number;
  canvasHeight: number;
  onUpdateElement: (id: string, updates: any) => void;
}

type AlignMode = 'canvas' | 'selection';

export const AlignmentSection: React.FC<AlignmentSectionProps> = ({
  selectedIds,
  elements,
  canvasWidth,
  canvasHeight,
  onUpdateElement,
}) => {
  const [alignMode, setAlignMode] = useState<AlignMode>('selection');

  // Only show when at least 1 element is selected
  if (selectedIds.length === 0) return null;

  const selectedElements = elements.filter((el) => selectedIds.includes(el.id));

  // Bounding box of the current selection
  const selectionBounds = (() => {
    if (selectedElements.length === 0) return null;
    const xs = selectedElements.map((el) => el.x);
    const ys = selectedElements.map((el) => el.y);
    const x2s = selectedElements.map((el) => el.x + (el.width ?? 0));
    const y2s = selectedElements.map((el) => el.y + (el.height ?? 0));
    return {
      left: Math.min(...xs),
      top: Math.min(...ys),
      right: Math.max(...x2s),
      bottom: Math.max(...y2s),
      width: Math.max(...x2s) - Math.min(...xs),
      height: Math.max(...y2s) - Math.min(...ys),
    };
  })();

  // Reference bounds depending on alignMode
  const refBounds =
    alignMode === 'canvas' || selectedIds.length === 1
      ? { left: 0, top: 0, right: canvasWidth, bottom: canvasHeight, width: canvasWidth, height: canvasHeight }
      : selectionBounds!;

  // ── Align helpers ──────────────────────────────────────────────────────────
  const alignLeft = () => {
    const target = refBounds.left;
    selectedElements.forEach((el) => onUpdateElement(el.id, { x: target }));
  };

  const alignCenterH = () => {
    const centerX = refBounds.left + refBounds.width / 2;
    selectedElements.forEach((el) =>
      onUpdateElement(el.id, { x: centerX - (el.width ?? 0) / 2 })
    );
  };

  const alignRight = () => {
    const right = refBounds.right;
    selectedElements.forEach((el) =>
      onUpdateElement(el.id, { x: right - (el.width ?? 0) })
    );
  };

  const alignTop = () => {
    const target = refBounds.top;
    selectedElements.forEach((el) => onUpdateElement(el.id, { y: target }));
  };

  const alignCenterV = () => {
    const centerY = refBounds.top + refBounds.height / 2;
    selectedElements.forEach((el) =>
      onUpdateElement(el.id, { y: centerY - (el.height ?? 0) / 2 })
    );
  };

  const alignBottom = () => {
    const bottom = refBounds.bottom;
    selectedElements.forEach((el) =>
      onUpdateElement(el.id, { y: bottom - (el.height ?? 0) })
    );
  };

  // ── Distribute helpers (3+ elements) ──────────────────────────────────────
  const distributeH = () => {
    if (selectedElements.length < 3) return;
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const totalWidth = sorted.reduce((sum, el) => sum + (el.width ?? 0), 0);
    const firstX = sorted[0].x;
    const lastX = sorted[sorted.length - 1].x + (sorted[sorted.length - 1].width ?? 0);
    const gap = (lastX - firstX - totalWidth) / (sorted.length - 1);
    let cursor = firstX;
    sorted.forEach((el) => {
      onUpdateElement(el.id, { x: cursor });
      cursor += (el.width ?? 0) + gap;
    });
  };

  const distributeV = () => {
    if (selectedElements.length < 3) return;
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const totalHeight = sorted.reduce((sum, el) => sum + (el.height ?? 0), 0);
    const firstY = sorted[0].y;
    const lastY = sorted[sorted.length - 1].y + (sorted[sorted.length - 1].height ?? 0);
    const gap = (lastY - firstY - totalHeight) / (sorted.length - 1);
    let cursor = firstY;
    sorted.forEach((el) => {
      onUpdateElement(el.id, { y: cursor });
      cursor += (el.height ?? 0) + gap;
    });
  };

  const canDistribute = selectedIds.length >= 3;

  const btnBase =
    'flex flex-col items-center justify-center gap-1 p-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed';

  const alignButtons = [
    { label: 'Align Left', icon: <AlignLeft size={15} />, action: alignLeft },
    { label: 'Align Center H', icon: <AlignCenter size={15} />, action: alignCenterH },
    { label: 'Align Right', icon: <AlignRight size={15} />, action: alignRight },
    { label: 'Align Top', icon: <AlignStartVertical size={15} />, action: alignTop },
    { label: 'Align Center V', icon: <AlignCenterVertical size={15} />, action: alignCenterV },
    { label: 'Align Bottom', icon: <AlignEndVertical size={15} />, action: alignBottom },
  ];

  return (
    <div className="border-t border-neutral-800 pt-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-4">
        <div className="flex items-center gap-2">
          <AlignCenter size={14} className="text-violet-400" />
          <span className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
            Align &amp; Distribute
          </span>
        </div>
      </div>

      <div className="px-4 space-y-3">
        {/* Align to Canvas / Selection toggle */}
        <div className="flex bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
          {(['canvas', 'selection'] as AlignMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAlignMode(mode)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                alignMode === mode
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {mode === 'canvas' ? (
                <LayoutGrid size={12} />
              ) : (
                <Columns3 size={12} />
              )}
              {mode === 'canvas' ? 'Align to Canvas' : 'Align to Selection'}
            </button>
          ))}
        </div>

        {/* 3×2 Align Buttons Grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {alignButtons.map(({ label, icon, action }) => (
            <button
              key={label}
              title={label}
              onClick={action}
              className={btnBase}
            >
              {icon}
              <span className="text-[9px] leading-none text-center">{label}</span>
            </button>
          ))}
        </div>

        {/* Distribute buttons — only when 3+ elements selected */}
        {selectedIds.length >= 2 && (
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">
              Distribute {!canDistribute && '(select 3+)'}
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                title="Distribute Horizontally"
                onClick={distributeH}
                disabled={!canDistribute}
                className={btnBase}
              >
                <AlignHorizontalDistributeCenter size={15} />
                <span className="text-[9px] leading-none">Horizontal</span>
              </button>
              <button
                title="Distribute Vertically"
                onClick={distributeV}
                disabled={!canDistribute}
                className={btnBase}
              >
                <AlignVerticalDistributeCenter size={15} />
                <span className="text-[9px] leading-none">Vertical</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
