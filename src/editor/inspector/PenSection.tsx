import React from 'react';
import { VectorPathElement } from '../../types/canvas';
import { Spline, Square, RotateCcw, Sparkles, Sliders } from 'lucide-react';
import { anchorsToSvgPath } from '../pen/penUtils';

interface PenSectionProps {
  element: VectorPathElement;
  onUpdate: (updates: Partial<VectorPathElement>) => void;
}

const COLOR_SWATCHES = [
  '#8b5cf6',
  '#ec4899',
  '#3b82f6',
  '#06b6d4',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ffffff',
  '#000000',
  'none',
];

export const PenSection: React.FC<PenSectionProps> = ({ element, onUpdate }) => {
  return (
    <div className="space-y-5 p-4 text-white select-none">
      {/* 1. Header & Path Mode */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Spline size={16} className="text-violet-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Vector Path ({element.anchors?.length || 0} Anchors)
            </h3>
          </div>
          <button
            onClick={() => onUpdate({ closed: !element.closed })}
            className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              element.closed
                ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400'
            }`}
          >
            {element.closed ? 'Closed Shape' : 'Open Path'}
          </button>
        </div>
      </div>

      {/* 2. Stroke Settings */}
      <div className="space-y-3 bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
        <div className="flex justify-between items-center text-xs">
          <span className="font-semibold text-neutral-300">Stroke Width</span>
          <span className="font-mono text-violet-400 font-bold">{element.strokeWidth || 0}px</span>
        </div>
        <input
          type="range"
          min="0"
          max="60"
          value={element.strokeWidth || 0}
          onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          className="w-full accent-violet-500 cursor-pointer"
        />

        {/* Stroke Style */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
          {(['solid', 'dashed', 'dotted'] as const).map((style) => (
            <button
              key={style}
              onClick={() => onUpdate({ strokeDash: style })}
              className={`py-1.5 rounded-lg text-xs font-medium capitalize border transition-all cursor-pointer ${
                (element.strokeDash || 'solid') === style
                  ? 'bg-violet-600 border-violet-500 text-white'
                  : 'bg-neutral-800 border-neutral-700/60 text-neutral-400'
              }`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Stroke Color */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-neutral-400 block">Stroke Color</span>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={`stroke_${color}`}
                onClick={() => onUpdate({ strokeColor: color })}
                style={{ backgroundColor: color === 'none' ? 'transparent' : color }}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 cursor-pointer relative ${
                  element.strokeColor === color
                    ? 'border-violet-400 ring-2 ring-violet-500/50 scale-110'
                    : 'border-neutral-700'
                } ${color === 'none' ? 'bg-neutral-900 border-dashed' : ''}`}
                title={color === 'none' ? 'No Stroke' : color}
              >
                {color === 'none' && (
                  <span className="text-[10px] font-bold text-red-400 leading-none">/</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Fill Color */}
        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-neutral-400 block">Fill Color</span>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={`fill_${color}`}
                onClick={() => onUpdate({ fill: color })}
                style={{ backgroundColor: color === 'none' ? 'transparent' : color }}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 cursor-pointer relative ${
                  element.fill === color
                    ? 'border-violet-400 ring-2 ring-violet-500/50 scale-110'
                    : 'border-neutral-700'
                } ${color === 'none' ? 'bg-neutral-900 border-dashed' : ''}`}
                title={color === 'none' ? 'No Fill (Transparent)' : color}
              >
                {color === 'none' && (
                  <span className="text-[10px] font-bold text-red-400 leading-none">/</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Quick Actions */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
          Path Operations
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => {
              if (!element.anchors) return;
              const reversed = [...element.anchors].reverse();
              onUpdate({
                anchors: reversed,
                pathData: anchorsToSvgPath(reversed, element.closed),
              });
            }}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Reverse Path</span>
          </button>

          <button
            onClick={() => {
              if (!element.anchors) return;
              const converted = element.anchors.map((a) => ({
                ...a,
                pointType: 'smooth' as const,
                handleIn: a.handleIn || { x: -20, y: 0 },
                handleOut: a.handleOut || { x: 20, y: 0 },
              }));
              onUpdate({
                anchors: converted,
                pathData: anchorsToSvgPath(converted, element.closed),
              });
            }}
            className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles size={14} />
            <span>Smooth All</span>
          </button>
        </div>
      </div>
    </div>
  );
};
