import React from 'react';
import { ImageElement } from '../../types/canvas';
import { FlipHorizontal, FlipVertical } from 'lucide-react';

interface ImageSectionProps {
  element: ImageElement;
  onUpdate: (updates: Partial<ImageElement>) => void;
}

export const ImageSection: React.FC<ImageSectionProps> = ({
  element,
  onUpdate,
}) => {
  const f = element.filters || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    duotoneEnabled: false,
  };

  const updateFilter = (key: keyof typeof f, val: number | boolean) => {
    onUpdate({
      filters: {
        ...f,
        [key]: val,
      },
    });
  };

  return (
    <div className="space-y-3 pb-4 border-b border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Image Controls & Filters
      </div>

      {/* Flips & Fit */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onUpdate({ flipX: !element.flipX })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border text-xs transition-colors ${
            element.flipX
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
          }`}
        >
          <FlipHorizontal size={14} /> Flip X
        </button>
        <button
          onClick={() => onUpdate({ flipY: !element.flipY })}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded border text-xs transition-colors ${
            element.flipY
              ? 'bg-violet-600 border-violet-500 text-white'
              : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
          }`}
        >
          <FlipVertical size={14} /> Flip Y
        </button>
      </div>

      {/* Mask Shape */}
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-500">Clipping Frame</label>
        <select
          value={element.maskShape || 'none'}
          onChange={(e) => onUpdate({ maskShape: e.target.value as any })}
          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 outline-none"
        >
          <option value="none">Standard Rectangle</option>
          <option value="circle">Circular Frame</option>
          <option value="squircle">Squircle Pebble</option>
        </select>
      </div>

      {/* Brightness */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Brightness</span>
          <span>{f.brightness}%</span>
        </div>
        <input
          type="range"
          min={50}
          max={150}
          value={f.brightness}
          onChange={(e) => updateFilter('brightness', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {/* Contrast */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Contrast</span>
          <span>{f.contrast}%</span>
        </div>
        <input
          type="range"
          min={50}
          max={160}
          value={f.contrast}
          onChange={(e) => updateFilter('contrast', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {/* Saturation */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Saturation</span>
          <span>{f.saturation}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={200}
          value={f.saturation}
          onChange={(e) => updateFilter('saturation', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>

      {/* Blur */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <span>Blur</span>
          <span>{f.blur}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={20}
          value={f.blur}
          onChange={(e) => updateFilter('blur', Number(e.target.value))}
          className="w-full accent-violet-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
