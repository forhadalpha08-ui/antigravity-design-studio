import React, { useState } from 'react';
import { CanvasElement } from '../../types/canvas';
import {
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Sliders,
  Group,
  Ungroup,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignVerticalJustifyCenter,
  AlignStartVertical,
  AlignEndVertical,
  Type,
} from 'lucide-react';

interface QuickElementBarProps {
  element: CanvasElement;
  selectedIds?: string[];
  scale: number;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onOpenEdit?: () => void;
  onEditText?: (id: string) => void;
  onGroup?: (ids: string[]) => void;
  onUngroup?: (groupId: string) => void;
  onAlign?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}

export const QuickElementBar: React.FC<QuickElementBarProps> = ({
  element,
  selectedIds = [],
  scale,
  onDuplicate,
  onDelete,
  onToggleLock,
  onReorder,
  onOpenEdit,
  onEditText,
  onGroup,
  onUngroup,
  onAlign,
}) => {
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const isMulti = selectedIds.length > 1;

  // Exact 1:1 counter-scale for crisp, light, compact rendering at any zoom level
  const rawScale = scale || 1;
  const counterScale = 1 / rawScale;

  // If the element is near the top of the canvas, render below to prevent colliding with top header
  const isNearTop = element.y * rawScale < 60;

  return (
    <div
      className="absolute pointer-events-auto flex items-center gap-0.5 bg-[#12131e]/95 border border-neutral-700/80 rounded-lg shadow-lg px-1.5 py-1 text-white z-[10000] backdrop-blur-md ring-1 ring-white/10 select-none animate-in fade-in zoom-in-95 duration-150 max-w-[calc(100vw-28px)] overflow-x-auto scrollbar-none flex-nowrap"
      style={{
        left: `${element.x + element.width / 2}px`,
        top: isNearTop ? `${element.y + element.height}px` : `${element.y}px`,
        transform: isNearTop
          ? `translate(-50%, 0) translateY(8px) scale(${counterScale})`
          : `translate(-50%, -100%) translateY(-8px) scale(${counterScale})`,
        transformOrigin: isNearTop ? 'top center' : 'bottom center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 1. Edit Text Action for text elements */}
      {element.type === 'text' && onEditText && (
        <>
          <button
            title="Edit Text Inline"
            onClick={() => onEditText(element.id)}
            className="px-2 py-0.5 bg-violet-600 hover:bg-violet-500 active:bg-violet-700 active:scale-95 text-white rounded-md transition-all flex items-center gap-1 text-[10px] font-bold shadow-sm shadow-violet-600/30 cursor-pointer flex-shrink-0 h-7"
          >
            <Type size={13} />
            <span>Edit Text</span>
          </button>
          <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />
        </>
      )}

      {/* 2. Edit Properties / Inspector trigger */}
      {onOpenEdit && (
        <>
          <button
            title="Open Properties Inspector"
            onClick={onOpenEdit}
            className="px-2 py-0.5 bg-neutral-800/90 hover:bg-violet-600/30 active:bg-violet-600 active:scale-95 text-violet-300 hover:text-white rounded-md transition-all flex items-center gap-1 text-[10px] font-semibold cursor-pointer border border-neutral-700/60 flex-shrink-0 h-7"
          >
            <Sliders size={13} />
            <span>Edit</span>
          </button>
          <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />
        </>
      )}

      {/* 3. Group / Ungroup buttons */}
      {isMulti && onGroup && (
        <>
          <button
            title="Group Selected Elements (Ctrl+G)"
            onClick={() => onGroup(selectedIds)}
            className="px-2 py-0.5 bg-violet-600/25 hover:bg-violet-600 active:scale-95 text-violet-200 hover:text-white rounded-md transition-all flex items-center gap-1 text-[10px] font-semibold cursor-pointer border border-violet-500/40 flex-shrink-0 h-7"
          >
            <Group size={13} />
            <span>Group ({selectedIds.length})</span>
          </button>
          <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />
        </>
      )}

      {!isMulti && element.groupId && onUngroup && (
        <>
          <button
            title="Ungroup Elements (Ctrl+Shift+G)"
            onClick={() => onUngroup(element.groupId!)}
            className="px-2 py-0.5 bg-amber-600/25 hover:bg-amber-600 active:scale-95 text-amber-200 hover:text-white rounded-md transition-all flex items-center gap-1 text-[10px] font-semibold cursor-pointer border border-amber-500/40 flex-shrink-0 h-7"
          >
            <Ungroup size={13} />
            <span>Ungroup</span>
          </button>
          <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />
        </>
      )}

      {/* 4. Alignment quick dropdown */}
      {onAlign && (
        <div className="relative flex-shrink-0">
          <button
            title="Align Elements"
            onClick={() => setShowAlignMenu(!showAlignMenu)}
            className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer active:scale-95 ${
              showAlignMenu
                ? 'bg-violet-600 text-white shadow-sm shadow-violet-600/40'
                : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <AlignJustify size={14} />
          </button>

          {showAlignMenu && (
            <div
              className={`absolute left-1/2 -translate-x-1/2 ${
                isNearTop ? 'top-full mt-1.5' : 'bottom-full mb-1.5'
              } bg-[#12131e] border border-neutral-700 rounded-lg shadow-xl p-1 flex items-center gap-0.5 z-50 ring-1 ring-white/10 animate-in fade-in zoom-in-95`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                title="Align Left"
                onClick={() => {
                  onAlign('left');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignLeft size={12} />
              </button>
              <button
                title="Align Horizontal Center"
                onClick={() => {
                  onAlign('center');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignCenter size={12} />
              </button>
              <button
                title="Align Right"
                onClick={() => {
                  onAlign('right');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignRight size={12} />
              </button>
              <div className="w-[1px] h-3 bg-neutral-700 mx-0.5" />
              <button
                title="Align Top"
                onClick={() => {
                  onAlign('top');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignStartVertical size={12} />
              </button>
              <button
                title="Align Vertical Middle"
                onClick={() => {
                  onAlign('middle');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignVerticalJustifyCenter size={12} />
              </button>
              <button
                title="Align Bottom"
                onClick={() => {
                  onAlign('bottom');
                  setShowAlignMenu(false);
                }}
                className="w-6 h-6 flex items-center justify-center hover:bg-violet-600 active:scale-95 rounded text-neutral-300 hover:text-white transition-all cursor-pointer"
              >
                <AlignEndVertical size={12} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 5. Duplicate Action */}
      <button
        title="Duplicate Layer (Ctrl+D)"
        onClick={() => onDuplicate(element.id)}
        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 active:bg-neutral-700 active:scale-95 rounded-md transition-all text-neutral-300 hover:text-white cursor-pointer flex-shrink-0"
      >
        <Copy size={14} />
      </button>

      {/* 6. Lock / Unlock Action */}
      <button
        title={element.locked ? 'Unlock Layer' : 'Lock Layer'}
        onClick={() => onToggleLock(element.id)}
        className={`w-7 h-7 flex items-center justify-center rounded-md transition-all cursor-pointer flex-shrink-0 active:scale-95 ${
          element.locked
            ? 'bg-amber-500/25 text-amber-400 hover:bg-amber-500/35 border border-amber-500/40'
            : 'hover:bg-neutral-800 active:bg-neutral-700 text-neutral-300 hover:text-white'
        }`}
      >
        {element.locked ? <Lock size={14} className="text-amber-400" /> : <Unlock size={14} />}
      </button>

      <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />

      {/* 7. Bring Forward */}
      <button
        title="Bring Layer Forward"
        onClick={() => onReorder(element.id, 'up')}
        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 active:bg-neutral-700 active:scale-95 rounded-md transition-all text-neutral-300 hover:text-white cursor-pointer flex-shrink-0"
      >
        <ArrowUp size={14} />
      </button>

      {/* 8. Send Backward */}
      <button
        title="Send Layer Backward"
        onClick={() => onReorder(element.id, 'down')}
        className="w-7 h-7 flex items-center justify-center hover:bg-neutral-800 active:bg-neutral-700 active:scale-95 rounded-md transition-all text-neutral-300 hover:text-white cursor-pointer flex-shrink-0"
      >
        <ArrowDown size={14} />
      </button>

      <div className="w-[1px] h-3.5 bg-neutral-700/70 mx-0.5 flex-shrink-0" />

      {/* 9. Delete Action */}
      <button
        title="Delete Layer"
        onClick={() => onDelete(element.id)}
        className="w-7 h-7 flex items-center justify-center hover:bg-red-500/20 active:bg-red-500/40 active:scale-95 text-neutral-300 hover:text-red-400 rounded-md transition-all cursor-pointer flex-shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
