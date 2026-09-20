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
  onGroup,
  onUngroup,
  onAlign,
}) => {
  const [showAlignMenu, setShowAlignMenu] = useState(false);
  const isMulti = selectedIds.length > 1;

  return (
    <div
      className="absolute pointer-events-auto flex items-center gap-1 bg-neutral-900/95 border border-neutral-700/80 rounded-lg shadow-xl px-2 py-1 text-white z-[10000] -translate-y-12 backdrop-blur-md"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {onOpenEdit && (
        <>
          <button
            title="Edit Properties"
            onClick={onOpenEdit}
            className="p-1 hover:bg-violet-600/30 text-violet-400 hover:text-violet-300 rounded transition-colors flex items-center gap-1 text-[11px] font-semibold"
          >
            <Sliders size={14} />
            <span>Edit</span>
          </button>
          <div className="w-[1px] h-4 bg-neutral-700 mx-0.5" />
        </>
      )}

      {/* Group / Ungroup buttons */}
      {isMulti && onGroup && (
        <button
          title="Group Selected (Ctrl+G)"
          onClick={() => onGroup(selectedIds)}
          className="p-1 hover:bg-violet-600/30 text-violet-300 hover:text-white rounded transition-colors flex items-center gap-1 text-xs px-1.5"
        >
          <Group size={14} />
          <span className="text-[10px] font-medium">Group</span>
        </button>
      )}

      {!isMulti && element.groupId && onUngroup && (
        <button
          title="Ungroup (Ctrl+Shift+G)"
          onClick={() => onUngroup(element.groupId!)}
          className="p-1 hover:bg-amber-600/30 text-amber-300 hover:text-white rounded transition-colors flex items-center gap-1 text-xs px-1.5"
        >
          <Ungroup size={14} />
          <span className="text-[10px] font-medium">Ungroup</span>
        </button>
      )}

      {/* Alignment quick dropdown */}
      {onAlign && (
        <div className="relative">
          <button
            title="Align Elements"
            onClick={() => setShowAlignMenu(!showAlignMenu)}
            className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-300 hover:text-white"
          >
            <AlignJustify size={14} />
          </button>

          {showAlignMenu && (
            <div
              className="absolute left-0 bottom-full mb-2 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-1 flex gap-1 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                title="Align Left"
                onClick={() => {
                  onAlign('left');
                  setShowAlignMenu(false);
                }}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white"
              >
                <AlignLeft size={14} />
              </button>
              <button
                title="Align Center"
                onClick={() => {
                  onAlign('center');
                  setShowAlignMenu(false);
                }}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white"
              >
                <AlignCenter size={14} />
              </button>
              <button
                title="Align Right"
                onClick={() => {
                  onAlign('right');
                  setShowAlignMenu(false);
                }}
                className="p-1 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white"
              >
                <AlignRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}

      <div className="w-[1px] h-4 bg-neutral-700 mx-0.5" />

      <button
        title="Duplicate"
        onClick={() => onDuplicate(element.id)}
        className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-300 hover:text-white"
      >
        <Copy size={15} />
      </button>

      <button
        title={element.locked ? 'Unlock' : 'Lock'}
        onClick={() => onToggleLock(element.id)}
        className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-300 hover:text-white"
      >
        {element.locked ? <Lock size={15} className="text-amber-400" /> : <Unlock size={15} />}
      </button>

      <div className="w-[1px] h-4 bg-neutral-700 mx-0.5" />

      <button
        title="Bring Forward"
        onClick={() => onReorder(element.id, 'up')}
        className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-300 hover:text-white"
      >
        <ArrowUp size={15} />
      </button>

      <button
        title="Send Backward"
        onClick={() => onReorder(element.id, 'down')}
        className="p-1 hover:bg-neutral-800 rounded transition-colors text-neutral-300 hover:text-white"
      >
        <ArrowDown size={15} />
      </button>

      <div className="w-[1px] h-4 bg-neutral-700 mx-0.5" />

      <button
        title="Delete"
        onClick={() => onDelete(element.id)}
        className="p-1 hover:bg-red-500/20 rounded transition-colors text-neutral-300 hover:text-red-400"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
};
