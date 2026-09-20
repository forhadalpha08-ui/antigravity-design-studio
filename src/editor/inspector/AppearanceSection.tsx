import React from 'react';
import { ShapeElement } from '../../types/canvas';

interface AppearanceSectionProps {
  element: ShapeElement;
  onUpdate: (updates: Partial<ShapeElement>) => void;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  element,
  onUpdate,
}) => {
  const isGradient = !!element.gradientFill;

  const toggleGradient = () => {
    if (isGradient) {
      onUpdate({ gradientFill: undefined });
    } else {
      onUpdate({
        gradientFill: {
          type: 'linear',
          angle: 135,
          stops: [
            { color: element.fill || '#8b5cf6', offset: 0 },
            { color: '#ec4899', offset: 100 },
          ],
        },
      });
    }
  };

  return (
    <div className="space-y-3 pb-4 border-b border-neutral-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Appearance & Fill
        </span>
        <button
          onClick={toggleGradient}
          className="text-[11px] text-violet-400 hover:text-violet-300 font-medium"
        >
          {isGradient ? 'Switch to Solid' : 'Use Gradient'}
        </button>
      </div>

      {/* Solid Fill */}
      {!isGradient && (
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500">Fill Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={element.fill === 'transparent' ? '#000000' : element.fill || '#ffffff'}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={element.fill || '#ffffff'}
              onChange={(e) => onUpdate({ fill: e.target.value })}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 uppercase font-mono"
            />
            <button
              onClick={() => onUpdate({ fill: 'transparent' })}
              className={`px-2 py-1 border rounded text-[10px] ${
                element.fill === 'transparent'
                  ? 'border-violet-500 text-violet-400'
                  : 'border-neutral-800 text-neutral-400'
              }`}
            >
              None
            </button>
          </div>
        </div>
      )}

      {/* Gradient Controls */}
      {isGradient && element.gradientFill && (
        <div className="space-y-2 bg-neutral-900/50 p-2 rounded-lg border border-neutral-800">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Gradient Angle</span>
            <span>{element.gradientFill.angle}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={element.gradientFill.angle}
            onChange={(e) =>
              onUpdate({
                gradientFill: {
                  ...element.gradientFill!,
                  angle: Number(e.target.value),
                },
              })
            }
            className="w-full accent-violet-500 cursor-pointer"
          />
          <div className="flex items-center gap-2 pt-1">
            <label className="text-[11px] text-neutral-400">Stops:</label>
            <input
              type="color"
              value={element.gradientFill.stops[0]?.color || '#8b5cf6'}
              onChange={(e) => {
                const stops = [...element.gradientFill!.stops];
                stops[0] = { ...stops[0], color: e.target.value };
                onUpdate({
                  gradientFill: { ...element.gradientFill!, stops },
                });
              }}
              className="w-6 h-6 rounded cursor-pointer"
            />
            <input
              type="color"
              value={element.gradientFill.stops[1]?.color || '#ec4899'}
              onChange={(e) => {
                const stops = [...element.gradientFill!.stops];
                stops[1] = { ...stops[1], color: e.target.value };
                onUpdate({
                  gradientFill: { ...element.gradientFill!, stops },
                });
              }}
              className="w-6 h-6 rounded cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Stroke / Border */}
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-500">Border Stroke</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.strokeColor || '#ffffff'}
            onChange={(e) => onUpdate({ strokeColor: e.target.value })}
            className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
          />
          <input
            type="number"
            min={0}
            max={40}
            value={element.strokeWidth || 0}
            onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
            placeholder="Width"
            className="w-20 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200"
          />
          <select
            value={element.strokeDash || 'solid'}
            onChange={(e) => onUpdate({ strokeDash: e.target.value as any })}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 outline-none"
          >
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
        </div>
      </div>

      {/* Corner Radius (for rectangle shapes) */}
      {element.shapeType === 'rectangle' && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Corner Radius</span>
            <span>{element.borderRadius || 0}px</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={element.borderRadius || 0}
            onChange={(e) => onUpdate({ borderRadius: Number(e.target.value) })}
            className="w-full accent-violet-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};
