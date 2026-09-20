import React from 'react';
import { CanvasBackground, BackgroundType } from '../../types/canvas';

interface BackgroundDrawerProps {
  currentBackground: CanvasBackground;
  onUpdateBackground: (bg: CanvasBackground) => void;
}

interface PresetBg {
  id: BackgroundType;
  name: string;
  bg: CanvasBackground;
}

const PRESET_BACKGROUNDS: PresetBg[] = [
  {
    id: 'dark-luxury',
    name: 'Dark Luxury Gold',
    bg: {
      type: 'dark-luxury',
      color: '#0a0a0d',
      secondaryColor: 'rgba(197, 160, 89, 0.2)',
    },
  },
  {
    id: 'mesh',
    name: 'Fluid Mesh Gradient',
    bg: {
      type: 'mesh',
      color: '#090a14',
      secondaryColor: '#4f46e5',
      accentColor: '#ec4899',
      tertiaryColor: '#06b6d4',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    bg: {
      type: 'aurora',
      color: '#050508',
      secondaryColor: 'rgba(120, 119, 198, 0.5)',
      accentColor: 'rgba(56, 189, 248, 0.4)',
      tertiaryColor: 'rgba(168, 85, 247, 0.4)',
    },
  },
  {
    id: 'neon',
    name: 'Cyberpunk Neon',
    bg: {
      type: 'neon',
      color: '#070710',
      secondaryColor: '#00f2fe',
      accentColor: '#ff0080',
    },
  },
  {
    id: 'sunset',
    name: 'Velvet Sunset',
    bg: {
      type: 'sunset',
      color: '#1a0b2e',
      secondaryColor: '#801850',
      accentColor: '#ff6b4a',
    },
  },
  {
    id: 'metallic',
    name: 'Titanium Metallic',
    bg: {
      type: 'metallic',
      color: '#18191e',
    },
  },
  {
    id: 'geometric',
    name: 'Blueprint Grid',
    bg: {
      type: 'geometric',
      color: '#0c0e18',
    },
  },
  {
    id: 'noise',
    name: 'Analog Grain',
    bg: {
      type: 'noise',
      color: '#111218',
    },
  },
  {
    id: 'glass',
    name: 'Glassmorphism Depth',
    bg: {
      type: 'glass',
      color: '#0c0d14',
    },
  },
  {
    id: 'solid',
    name: 'Obsidian Solid',
    bg: {
      type: 'solid',
      color: '#090a0f',
    },
  },
  {
    id: 'solid',
    name: 'Pure Canvas White',
    bg: {
      type: 'solid',
      color: '#ffffff',
    },
  },
];

export const BackgroundDrawer: React.FC<BackgroundDrawerProps> = ({
  currentBackground,
  onUpdateBackground,
}) => {
  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Background Studio
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Presets Grid */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Algorithmic Styles
          </span>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_BACKGROUNDS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => onUpdateBackground(preset.bg)}
                className="flex flex-col p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/60 rounded-xl text-left transition-all group"
              >
                <div
                  className="w-full h-12 rounded-lg mb-2 border border-white/10"
                  style={{
                    backgroundColor: preset.bg.color,
                  }}
                />
                <span className="text-xs font-medium text-neutral-300 group-hover:text-white truncate">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Fine-Tuning */}
        <div className="space-y-3 pt-2 border-t border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Custom Colors
          </span>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Base Color</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentBackground.color || '#090a0f'}
                  onChange={(e) =>
                    onUpdateBackground({
                      ...currentBackground,
                      color: e.target.value,
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer"
                />
                <span className="font-mono text-neutral-300">
                  {currentBackground.color}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Secondary Accent</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentBackground.secondaryColor || '#4f46e5'}
                  onChange={(e) =>
                    onUpdateBackground({
                      ...currentBackground,
                      secondaryColor: e.target.value,
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer"
                />
                <span className="font-mono text-neutral-300">
                  {currentBackground.secondaryColor || 'Default'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
