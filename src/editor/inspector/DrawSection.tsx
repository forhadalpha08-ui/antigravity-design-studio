import React from 'react';
import { DrawElement, BrushType } from '../../types/canvas';

interface DrawSectionProps {
  element: DrawElement;
  onUpdate: (updates: Partial<DrawElement>) => void;
}

export const DrawSection: React.FC<DrawSectionProps> = ({ element, onUpdate }) => {
  return (
    <div className="space-y-4 pt-3 border-t border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Drawing Stroke Properties
      </div>

      {/* Stroke Color */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-neutral-400">Stroke Color</span>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.strokeColor || '#8b5cf6'}
            onChange={(e) => onUpdate({ strokeColor: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
          />
          <span className="font-mono text-neutral-300 text-[11px] uppercase">
            {element.strokeColor}
          </span>
        </div>
      </div>

      {/* Stroke Width */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-neutral-400">Thickness</span>
          <span className="font-mono text-violet-400">{element.strokeWidth || 4}px</span>
        </div>
        <input
          type="range"
          min="1"
          max="36"
          value={element.strokeWidth || 4}
          onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {/* Brush Type */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-400">Brush Style</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(['pen', 'marker', 'highlighter', 'eraser'] as BrushType[]).map((b) => (
            <button
              key={b}
              onClick={() => onUpdate({ brushType: b })}
              className={`py-1.5 px-2 rounded text-xs capitalize transition-colors ${
                element.brushType === b
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
