import React from 'react';
import { CanvasElement } from '../../types/canvas';
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
} from 'lucide-react';

interface PositionLayoutSectionProps {
  element: CanvasElement;
  canvasWidth: number;
  canvasHeight: number;
  onUpdate: (updates: Partial<CanvasElement>) => void;
}

export const PositionLayoutSection: React.FC<PositionLayoutSectionProps> = ({
  element,
  canvasWidth,
  canvasHeight,
  onUpdate,
}) => {
  const align = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    switch (type) {
      case 'left':
        onUpdate({ x: 0 });
        break;
      case 'center':
        onUpdate({ x: Math.round((canvasWidth - element.width) / 2) });
        break;
      case 'right':
        onUpdate({ x: canvasWidth - element.width });
        break;
      case 'top':
        onUpdate({ y: 0 });
        break;
      case 'middle':
        onUpdate({ y: Math.round((canvasHeight - element.height) / 2) });
        break;
      case 'bottom':
        onUpdate({ y: canvasHeight - element.height });
        break;
    }
  };

  return (
    <div className="space-y-3 pb-4 border-b border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Transform & Layout
      </div>

      {/* Alignment Bar */}
      <div className="flex items-center justify-between bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
        <button
          title="Align Left"
          onClick={() => align('left')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignLeft size={16} />
        </button>
        <button
          title="Align Center"
          onClick={() => align('center')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignCenter size={16} />
        </button>
        <button
          title="Align Right"
          onClick={() => align('right')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignRight size={16} />
        </button>
        <div className="w-[1px] h-4 bg-neutral-800" />
        <button
          title="Align Top"
          onClick={() => align('top')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignStartVertical size={16} />
        </button>
        <button
          title="Align Middle"
          onClick={() => align('middle')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignCenterVertical size={16} />
        </button>
        <button
          title="Align Bottom"
          onClick={() => align('bottom')}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
        >
          <AlignEndVertical size={16} />
        </button>
      </div>

      {/* X & Y */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500 font-mono">X</span>
          <input
            type="number"
            value={Math.round(element.x)}
            onChange={(e) => onUpdate({ x: Number(e.target.value) })}
            className="w-16 bg-transparent text-right outline-none text-neutral-200"
          />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500 font-mono">Y</span>
          <input
            type="number"
            value={Math.round(element.y)}
            onChange={(e) => onUpdate({ y: Number(e.target.value) })}
            className="w-16 bg-transparent text-right outline-none text-neutral-200"
          />
        </div>
      </div>

      {/* W & H */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500 font-mono">W</span>
          <input
            type="number"
            value={Math.round(element.width)}
            onChange={(e) => onUpdate({ width: Math.max(10, Number(e.target.value)) })}
            className="w-16 bg-transparent text-right outline-none text-neutral-200"
          />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500 font-mono">H</span>
          <input
            type="number"
            value={Math.round(element.height)}
            onChange={(e) => onUpdate({ height: Math.max(10, Number(e.target.value)) })}
            className="w-16 bg-transparent text-right outline-none text-neutral-200"
          />
        </div>
      </div>

      {/* Rotation & Opacity */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500">Angle</span>
          <input
            type="number"
            value={Math.round(element.rotation || 0)}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) % 360 })}
            className="w-12 bg-transparent text-right outline-none text-neutral-200"
          />
          <span className="text-neutral-500">°</span>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
          <span className="text-neutral-500">Opacity</span>
          <input
            type="number"
            min={0}
            max={100}
            value={Math.round(element.opacity * 100)}
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
            className="w-12 bg-transparent text-right outline-none text-neutral-200"
          />
          <span className="text-neutral-500">%</span>
        </div>
      </div>
    </div>
  );
};
