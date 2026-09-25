import React from 'react';
import { PhotoshopPenSubTool, VectorAnchor, VectorPathElement } from '../../types/canvas';
import { PHOTOSHOP_PEN_TOOLS } from '../pen/PhotoshopPenFlyout';
import {
  Pen,
  Spline,
  Sparkles,
  PlusCircle,
  MinusCircle,
  MousePointerClick,
  Layers,
  Palette,
  Check,
  Circle,
  Square,
  Flame,
} from 'lucide-react';

interface PenDrawerProps {
  activeSubTool: PhotoshopPenSubTool;
  onSelectSubTool: (tool: PhotoshopPenSubTool) => void;
  penFill: string;
  onChangePenFill: (fill: string) => void;
  penStroke: string;
  onChangePenStroke: (stroke: string) => void;
  penStrokeWidth: number;
  onChangePenStrokeWidth: (width: number) => void;
  penClosed: boolean;
  onTogglePenClosed: (closed: boolean) => void;
  onAddPresetPath?: (element: Partial<VectorPathElement>) => void;
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

const PRESET_VECTOR_PATHS: {
  name: string;
  description: string;
  anchors: VectorAnchor[];
  closed: boolean;
  fill: string;
  strokeColor: string;
  strokeWidth: number;
}[] = [
  {
    name: 'Organic Wave',
    description: 'Smooth decorative wave banner',
    closed: true,
    fill: '#8b5cf6',
    strokeColor: '#a78bfa',
    strokeWidth: 2,
    anchors: [
      { id: 'p1', x: 0, y: 150, handleOut: { x: 100, y: -60 }, pointType: 'smooth' },
      { id: 'p2', x: 250, y: 80, handleIn: { x: -80, y: 40 }, handleOut: { x: 80, y: -40 }, pointType: 'smooth' },
      { id: 'p3', x: 500, y: 160, handleIn: { x: -80, y: -50 }, pointType: 'smooth' },
      { id: 'p4', x: 500, y: 250, pointType: 'corner' },
      { id: 'p5', x: 0, y: 250, pointType: 'corner' },
    ],
  },
  {
    name: 'Dynamic Teardrop / Splash',
    description: 'Sleek vector badge shape',
    closed: true,
    fill: '#ec4899',
    strokeColor: '#ffffff',
    strokeWidth: 3,
    anchors: [
      { id: 't1', x: 150, y: 30, pointType: 'corner' },
      { id: 't2', x: 230, y: 160, handleIn: { x: 0, y: -60 }, handleOut: { x: 0, y: 60 }, pointType: 'smooth' },
      { id: 't3', x: 150, y: 240, handleIn: { x: 60, y: 0 }, handleOut: { x: -60, y: 0 }, pointType: 'smooth' },
      { id: 't4', x: 70, y: 160, handleIn: { x: 0, y: 60 }, handleOut: { x: 0, y: -60 }, pointType: 'smooth' },
    ],
  },
  {
    name: 'S-Curve Ribbon',
    description: 'Continuous Bézier curve path',
    closed: false,
    fill: 'none',
    strokeColor: '#06b6d4',
    strokeWidth: 6,
    anchors: [
      { id: 's1', x: 40, y: 200, handleOut: { x: 80, y: -120 }, pointType: 'smooth' },
      { id: 's2', x: 200, y: 120, handleIn: { x: -80, y: 60 }, handleOut: { x: 80, y: -60 }, pointType: 'smooth' },
      { id: 's3', x: 360, y: 40, handleIn: { x: -80, y: 80 }, pointType: 'smooth' },
    ],
  },
];

export const PenDrawer: React.FC<PenDrawerProps> = ({
  activeSubTool,
  onSelectSubTool,
  penFill,
  onChangePenFill,
  penStroke,
  onChangePenStroke,
  penStrokeWidth,
  onChangePenStrokeWidth,
  penClosed,
  onTogglePenClosed,
  onAddPresetPath,
}) => {
  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6 text-white no-scrollbar select-none">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black text-xs font-mono">
            Ps
          </div>
          <h3 className="text-sm font-bold text-white">Photoshop CS6 Pen Suite</h3>
        </div>
        <p className="text-[11px] text-neutral-400">
          Professional Bézier curves, vector paths, anchor editing, and freehand smoothing.
        </p>
      </div>

      {/* 1. Sub-Tool Selector */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
          Pen Sub-Tools
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {PHOTOSHOP_PEN_TOOLS.map((tool) => {
            const isSelected = activeSubTool === tool.id;
            const Icon = tool.icon;

            return (
              <button
                key={tool.id}
                onClick={() => onSelectSubTool(tool.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/10'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">{tool.name}</span>
                    <span className="text-[10px] text-neutral-400 block line-clamp-1">
                      {tool.description}
                    </span>
                  </div>
                </div>

                {tool.shortcut && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 font-bold">
                    {tool.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Path Mode (Shape vs Path) */}
      <div className="space-y-2.5">
        <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider block">
          Drawing Mode
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onTogglePenClosed(true)}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              penClosed
                ? 'bg-violet-600/20 border-violet-500 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Square size={18} />
            <span className="text-xs font-semibold">Closed Shape</span>
          </button>

          <button
            onClick={() => onTogglePenClosed(false)}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
              !penClosed
                ? 'bg-violet-600/20 border-violet-500 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            <Spline size={18} />
            <span className="text-xs font-semibold">Open Path</span>
          </button>
        </div>
      </div>

      {/* 3. Stroke & Fill Settings */}
      <div className="space-y-4 bg-neutral-900/60 border border-neutral-800/80 p-3.5 rounded-2xl">
        {/* Stroke Width Slider */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-neutral-300">Stroke Thickness</span>
            <span className="font-mono text-violet-400 font-bold">{penStrokeWidth}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="60"
            value={penStrokeWidth}
            onChange={(e) => onChangePenStrokeWidth(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />
        </div>

        {/* Stroke Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">Stroke Color</span>
            <span className="font-mono text-[10px] text-neutral-400">{penStroke}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={`stroke_${color}`}
                onClick={() => onChangePenStroke(color)}
                style={{ backgroundColor: color === 'none' ? 'transparent' : color }}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 cursor-pointer relative ${
                  penStroke === color
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">Fill Color</span>
            <span className="font-mono text-[10px] text-neutral-400">{penFill}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COLOR_SWATCHES.map((color) => (
              <button
                key={`fill_${color}`}
                onClick={() => onChangePenFill(color)}
                style={{ backgroundColor: color === 'none' ? 'transparent' : color }}
                className={`w-6 h-6 rounded-lg border transition-transform hover:scale-110 cursor-pointer relative ${
                  penFill === color
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

      {/* 4. Preset Vector Paths */}
      {onAddPresetPath && (
        <div className="space-y-2.5">
          <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
            <Flame size={13} className="text-amber-400" />
            <span>Preset Vector Shapes</span>
          </span>
          <div className="grid grid-cols-1 gap-2">
            {PRESET_VECTOR_PATHS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() =>
                  onAddPresetPath({
                    type: 'vector-path',
                    name: preset.name,
                    anchors: preset.anchors,
                    closed: preset.closed,
                    fill: preset.fill,
                    strokeColor: preset.strokeColor,
                    strokeWidth: preset.strokeWidth,
                    width: 350,
                    height: 220,
                  })
                }
                className="p-3 bg-neutral-900 hover:bg-neutral-800/80 border border-neutral-800 hover:border-violet-500/50 rounded-2xl text-left transition-all group cursor-pointer flex items-center justify-between shadow-md"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{preset.description}</p>
                </div>
                <span className="text-xs text-violet-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  + Add
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 5. Photoshop CS6 Keyboard Guide */}
      <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-2xl space-y-2 text-[11px] text-neutral-300">
        <span className="font-bold text-blue-300 block flex items-center gap-1.5">
          <Pen size={13} />
          <span>Photoshop CS6 Pen Shortcuts</span>
        </span>
        <ul className="space-y-1 text-[10px] text-neutral-400">
          <li>• <b className="text-neutral-200">Click Canvas</b>: Place corner anchor point</li>
          <li>• <b className="text-neutral-200">Click & Drag</b>: Create smooth Bézier curves & handles</li>
          <li>• <b className="text-neutral-200">Click First Point</b>: Close path into vector shape</li>
          <li>• <b className="text-neutral-200">Enter / Double-Click</b>: Finish open path stroke</li>
          <li>• <b className="text-neutral-200">Alt / Option + Drag</b>: Break & adjust single handle</li>
          <li>• <b className="text-neutral-200">Escape</b>: Cancel current path in progress</li>
        </ul>
      </div>
    </div>
  );
};
