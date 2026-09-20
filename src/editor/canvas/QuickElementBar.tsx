import React from 'react';
import { CanvasElement } from '../../types/canvas';
import { Copy, Trash2, Lock, Unlock, ArrowUp, ArrowDown, Sliders } from 'lucide-react';

interface QuickElementBarProps {
  element: CanvasElement;
  scale: number;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleLock: (id: string) => void;
  onReorder: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onOpenEdit?: () => void;
}

export const QuickElementBar: React.FC<QuickElementBarProps> = ({
  element,
  scale,
  onDuplicate,
  onDelete,
  onToggleLock,
  onReorder,
  onOpenEdit,
}) => {
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
