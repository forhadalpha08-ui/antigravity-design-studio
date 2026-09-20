import React from 'react';
import { CanvasElement } from '../../types/canvas';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Type,
  Square,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface LayersDrawerProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderLayer,
}) => {
  // Sort descending by zIndex so top layer is at top of list
  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type size={14} className="text-blue-400" />;
      case 'shape':
        return <Square size={14} className="text-violet-400" />;
      case 'image':
        return <ImageIcon size={14} className="text-emerald-400" />;
      default:
        return <Sparkles size={14} className="text-amber-400" />;
    }
  };

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
          <Layers size={15} className="text-violet-400" />
          Layer Stack ({elements.length})
        </h2>
      </div>

      <div className="p-3 space-y-1.5 flex-1 overflow-y-auto">
        {elements.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-xs">
            Canvas is empty. Add text, shapes, or images to see layers here.
          </div>
        ) : (
          sorted.map((el) => {
            const isSelected = selectedId === el.id;

            return (
              <div
                key={el.id}
                onClick={() => onSelectElement(el.id)}
                className={`group flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-violet-600/20 border-violet-500 text-white'
                    : 'bg-neutral-900/80 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                  {getElementIcon(el.type)}
                  <input
                    type="text"
                    value={el.name}
                    onChange={(e) =>
                      onUpdateElement(el.id, { name: e.target.value })
                    }
                    className="bg-transparent text-xs outline-none truncate w-full"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Layer Quick Actions */}
                <div className="flex items-center gap-0.5">
                  <button
                    title="Move Up"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderLayer(el.id, 'up');
                    }}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    title="Move Down"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReorderLayer(el.id, 'down');
                    }}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  >
                    <ChevronDown size={14} />
                  </button>
                  <button
                    title={el.hidden ? 'Show Layer' : 'Hide Layer'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { hidden: !el.hidden });
                    }}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  >
                    {el.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button
                    title={el.locked ? 'Unlock' : 'Lock'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateElement(el.id, { locked: !el.locked });
                    }}
                    className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                  >
                    {el.locked ? (
                      <Lock size={14} className="text-amber-400" />
                    ) : (
                      <Unlock size={14} />
                    )}
                  </button>
                  <button
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteElement(el.id);
                    }}
                    className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
