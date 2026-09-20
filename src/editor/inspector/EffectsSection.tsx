import React from 'react';
import { CanvasElement } from '../../types/canvas';

interface EffectsSectionProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
}

export const EffectsSection: React.FC<EffectsSectionProps> = ({
  element,
  onUpdate,
}) => {
  const shadow = element.shadow || {
    enabled: false,
    color: 'rgba(0,0,0,0.5)',
    blur: 15,
    offsetX: 0,
    offsetY: 8,
  };

  const glow = element.glow || {
    enabled: false,
    color: '#8b5cf6',
    blur: 20,
  };

  return (
    <div className="space-y-3 pb-4 border-b border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Effects & Shadows
      </div>

      {/* Drop Shadow */}
      <div className="space-y-2 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-300 font-medium">Drop Shadow</span>
          <input
            type="checkbox"
            checked={shadow.enabled}
            onChange={(e) =>
              onUpdate({
                shadow: { ...shadow, enabled: e.target.checked },
              })
            }
            className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
          />
        </div>

        {shadow.enabled && (
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Shadow Blur</span>
              <span>{shadow.blur}px</span>
            </div>
            <input
              type="range"
              min={0}
              max={60}
              value={shadow.blur}
              onChange={(e) =>
                onUpdate({
                  shadow: { ...shadow, blur: Number(e.target.value) },
                })
              }
              className="w-full accent-violet-500 cursor-pointer"
            />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded p-1">
                <span className="text-neutral-500 text-[10px]">Offset X</span>
                <input
                  type="number"
                  value={shadow.offsetX}
                  onChange={(e) =>
                    onUpdate({
                      shadow: { ...shadow, offsetX: Number(e.target.value) },
                    })
                  }
                  className="w-12 bg-transparent text-right outline-none text-neutral-200"
                />
              </div>
              <div className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded p-1">
                <span className="text-neutral-500 text-[10px]">Offset Y</span>
                <input
                  type="number"
                  value={shadow.offsetY}
                  onChange={(e) =>
                    onUpdate({
                      shadow: { ...shadow, offsetY: Number(e.target.value) },
                    })
                  }
                  className="w-12 bg-transparent text-right outline-none text-neutral-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Glow */}
      <div className="space-y-2 bg-neutral-900/50 p-2.5 rounded-lg border border-neutral-800">
        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-300 font-medium">Outer Glow</span>
          <input
            type="checkbox"
            checked={glow.enabled}
            onChange={(e) =>
              onUpdate({
                glow: { ...glow, enabled: e.target.checked },
              })
            }
            className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
          />
        </div>

        {glow.enabled && (
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={glow.color}
              onChange={(e) =>
                onUpdate({
                  glow: { ...glow, color: e.target.value },
                })
              }
              className="w-6 h-6 rounded cursor-pointer"
            />
            <input
              type="range"
              min={5}
              max={60}
              value={glow.blur}
              onChange={(e) =>
                onUpdate({
                  glow: { ...glow, blur: Number(e.target.value) },
                })
              }
              className="flex-1 accent-violet-500 cursor-pointer"
            />
            <span className="text-xs text-neutral-400">{glow.blur}px</span>
          </div>
        )}
      </div>
    </div>
  );
};
