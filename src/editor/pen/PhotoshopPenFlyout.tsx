import React from 'react';
import { PhotoshopPenSubTool } from '../../types/canvas';
import {
  Pen,
  Spline,
  PlusCircle,
  MinusCircle,
  MousePointerClick,
  Sparkles,
  Check,
} from 'lucide-react';

interface PhotoshopPenFlyoutProps {
  activeSubTool: PhotoshopPenSubTool;
  onSelectSubTool: (tool: PhotoshopPenSubTool) => void;
  onClose?: () => void;
}

export interface PenToolOption {
  id: PhotoshopPenSubTool;
  name: string;
  shortcut?: string;
  description: string;
  icon: React.ElementType;
}

export const PHOTOSHOP_PEN_TOOLS: PenToolOption[] = [
  {
    id: 'pen',
    name: 'Pen Tool',
    shortcut: 'P',
    description: 'Click to place anchor points, drag to create smooth Bézier curve handles',
    icon: Pen,
  },
  {
    id: 'freeform',
    name: 'Freeform Pen Tool',
    shortcut: 'P',
    description: 'Draw freehand vector paths that automatically vectorize into smooth anchors',
    icon: Spline,
  },
  {
    id: 'curvature',
    name: 'Curvature Pen Tool',
    shortcut: 'P',
    description: 'Effortlessly create smooth curves by clicking points without dragging handles',
    icon: Sparkles,
  },
  {
    id: 'add-anchor',
    name: 'Add Anchor Point Tool',
    description: 'Click anywhere on an existing vector path segment to insert a new anchor point',
    icon: PlusCircle,
  },
  {
    id: 'delete-anchor',
    name: 'Delete Anchor Point Tool',
    description: 'Click on any existing anchor point to remove it and connect neighbors',
    icon: MinusCircle,
  },
  {
    id: 'convert-point',
    name: 'Convert Point Tool',
    description: 'Click to toggle sharp corner vs smooth curve, or drag handles independently',
    icon: MousePointerClick,
  },
];

export const PhotoshopPenFlyout: React.FC<PhotoshopPenFlyoutProps> = ({
  activeSubTool,
  onSelectSubTool,
  onClose,
}) => {
  return (
    <div
      className="w-72 bg-[#1e1f26]/98 border border-neutral-700/90 rounded-2xl shadow-2xl p-2.5 text-white z-[10001] backdrop-blur-2xl ring-1 ring-white/10 select-none animate-in fade-in zoom-in-95 duration-100"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Photoshop CS6 Header Badge */}
      <div className="flex items-center justify-between px-2 pb-2 mb-1.5 border-b border-neutral-700/60">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 font-black text-[10px] font-mono">
            Ps
          </div>
          <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
            Photoshop CS6 Pen Tools
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded">
          P
        </span>
      </div>

      {/* Tools List */}
      <div className="flex flex-col gap-1">
        {PHOTOSHOP_PEN_TOOLS.map((tool) => {
          const isSelected = activeSubTool === tool.id;
          const Icon = tool.icon;

          return (
            <button
              key={tool.id}
              onClick={() => {
                onSelectSubTool(tool.id);
                if (onClose) onClose();
              }}
              className={`flex items-center justify-between px-2.5 py-2 rounded-xl transition-all cursor-pointer group text-left ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'hover:bg-neutral-800/80 text-neutral-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Active indicator dot/square like Photoshop CS6 */}
                <div className="w-2.5 h-2.5 flex items-center justify-center shrink-0">
                  {isSelected ? (
                    <div className="w-1.5 h-1.5 bg-white rounded-sm" />
                  ) : (
                    <div className="w-1.5 h-1.5 rounded-sm opacity-0 group-hover:opacity-30 bg-neutral-400" />
                  )}
                </div>

                <div
                  className={`p-1 rounded-lg ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-neutral-800 text-neutral-300 group-hover:text-white group-hover:bg-neutral-700'
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div>
                  <div className="text-xs font-medium tracking-tight flex items-center gap-1.5">
                    <span>{tool.name}</span>
                  </div>
                  <div
                    className={`text-[10px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-blue-100' : 'text-neutral-400'
                    }`}
                  >
                    {tool.description}
                  </div>
                </div>
              </div>

              {tool.shortcut && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold shrink-0 ml-2 ${
                    isSelected ? 'bg-white/20 text-white' : 'text-neutral-500 bg-neutral-800/60'
                  }`}
                >
                  {tool.shortcut}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
