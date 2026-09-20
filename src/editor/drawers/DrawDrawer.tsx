import React from 'react';
import { BrushType } from '../../types/canvas';
import { ToolType } from '../../store/useEditorStore';
import { Pen, Highlighter, Paintbrush, Eraser } from 'lucide-react';

interface DrawDrawerProps {
  brushType: BrushType;
  brushColor: string;
  brushSize: number;
  activeTool: ToolType;
  onSetBrushType: (type: BrushType) => void;
  onSetBrushColor: (color: string) => void;
  onSetBrushSize: (size: number) => void;
  onSelectTool: (tool: ToolType) => void;
}

const BRUSH_PRESETS: { type: BrushType; label: string; icon: React.ElementType; desc: string }[] = [
  { type: 'pen', label: 'Pen / Pencil', icon: Pen, desc: 'Smooth, crisp vector strokes' },
  { type: 'marker', label: 'Marker', icon: Paintbrush, desc: 'Vibrant opaque felt tip' },
  { type: 'highlighter', label: 'Highlighter', icon: Highlighter, desc: 'Translucent text accent' },
  { type: 'eraser', label: 'Eraser', icon: Eraser, desc: 'Vector point clean up' },
];

const COLOR_SWATCHES = [
  '#ffffff',
  '#8b5cf6',
  '#ec4899',
  '#ef4444',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#000000',
];

export const DrawDrawer: React.FC<DrawDrawerProps> = ({
  brushType,
  brushColor,
  brushSize,
  activeTool,
  onSetBrushType,
  onSetBrushColor,
  onSetBrushSize,
  onSelectTool,
}) => {
  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Pen size={18} className="text-violet-400" />
          <span>Draw & Sketch Tool</span>
        </h3>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Draw freehand vector paths directly on your canvas
        </p>

        {activeTool !== 'draw' && (
          <button
            onClick={() => onSelectTool('draw')}
            className="w-full mt-3 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-lg transition-colors shadow-lg shadow-violet-600/20"
          >
            Activate Draw Mode
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Brush Type Selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">Brush Type</label>
          <div className="grid grid-cols-2 gap-2">
            {BRUSH_PRESETS.map((item) => {
              const Icon = item.icon;
              const isSelected = brushType === item.type;

              return (
                <button
                  key={item.type}
                  onClick={() => {
                    onSetBrushType(item.type);
                    if (activeTool !== 'draw') onSelectTool('draw');
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-sm'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
                  }`}
                >
                  <Icon size={18} className={isSelected ? 'text-violet-400' : 'text-neutral-400'} />
                  <div className="font-bold text-xs mt-1.5 text-white">{item.label}</div>
                  <div className="text-[10px] text-neutral-400 leading-tight mt-0.5">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brush Stroke Size */}
        <div className="space-y-2 bg-neutral-900 border border-neutral-800 rounded-xl p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">Stroke Thickness</span>
            <span className="text-violet-400 font-mono font-bold">{brushSize}px</span>
          </div>
          <input
            type="range"
            min="1"
            max="36"
            value={brushSize}
            onChange={(e) => onSetBrushSize(Number(e.target.value))}
            className="w-full accent-violet-500 cursor-pointer"
          />

          {/* Stroke Preview */}
          <div className="h-10 flex items-center justify-center bg-neutral-950 rounded-lg border border-neutral-800/80">
            <div
              className="rounded-full transition-all"
              style={{
                width: '80%',
                height: `${brushSize}px`,
                backgroundColor: brushColor,
                opacity: brushType === 'highlighter' ? 0.45 : 1,
              }}
            />
          </div>
        </div>

        {/* Brush Color */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300">Stroke Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => onSetBrushColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-xs font-mono text-neutral-400 uppercase">{brushColor}</span>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-2 pt-1">
            {COLOR_SWATCHES.map((col) => (
              <button
                key={col}
                onClick={() => onSetBrushColor(col)}
                className={`w-full aspect-square rounded-lg border-2 transition-transform hover:scale-110 ${
                  brushColor.toLowerCase() === col.toLowerCase()
                    ? 'border-violet-500 scale-105 shadow-md'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: col }}
              />
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="p-3 bg-violet-950/20 border border-violet-800/30 rounded-xl text-[11px] text-violet-300 leading-relaxed">
          <p className="font-semibold text-violet-200 mb-0.5">Vector Precision</p>
          Each stroke creates an editable, scalable vector path element that you can resize, reorder, and color after drawing.
        </div>
      </div>
    </div>
  );
};
