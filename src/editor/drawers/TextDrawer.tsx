import React from 'react';
import { TextElement } from '../../types/canvas';
import { TYPOGRAPHY_PRESETS, TypographyPreset } from '../../utils/fonts';
import { generateId } from '../../utils/id';

interface TextDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddElement: (element: TextElement) => void;
}

export const TextDrawer: React.FC<TextDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  onAddElement,
}) => {
  const addText = (
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: number | string,
    letterSpacing = 0,
    textTransform: 'none' | 'uppercase' = 'none'
  ) => {
    const w = Math.min(canvasWidth - 100, 600);
    const h = fontSize * 1.5;

    const el: TextElement = {
      id: generateId('text'),
      name: text.slice(0, 16),
      type: 'text',
      text,
      fontFamily,
      fontSize,
      fontWeight,
      textAlign: 'center',
      letterSpacing,
      lineHeight: 1.2,
      color: '#ffffff',
      textTransform,
      x: Math.round((canvasWidth - w) / 2),
      y: Math.round((canvasHeight - h) / 2),
      width: w,
      height: Math.round(h),
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
    };
    onAddElement(el);
  };

  const applyPreset = (preset: TypographyPreset) => {
    addText(
      'HEADLINE TITLE',
      preset.heading.fontFamily,
      preset.heading.fontSize,
      preset.heading.fontWeight,
      preset.heading.letterSpacing,
      preset.heading.textTransform === 'uppercase' ? 'uppercase' : 'none'
    );
  };

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Typography Studio
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Core Hierarchy Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Add Text
          </span>

          <button
            onClick={() =>
              addText('Add a Heading', "'Space Grotesk', sans-serif", 56, 700, -1)
            }
            className="w-full p-4 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl text-left transition-all group"
          >
            <span className="text-xl font-bold text-white group-hover:text-violet-300 block">
              Add a Heading
            </span>
            <span className="text-[10px] text-neutral-500 mt-1 block font-mono">
              Space Grotesk • 56px
            </span>
          </button>

          <button
            onClick={() =>
              addText('Add a Subheading', "'Montserrat', sans-serif", 28, 600, 1)
            }
            className="w-full p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl text-left transition-all group"
          >
            <span className="text-base font-semibold text-neutral-200 group-hover:text-violet-300 block">
              Add a Subheading
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block font-mono">
              Montserrat • 28px
            </span>
          </button>

          <button
            onClick={() =>
              addText('Add a little bit of body text for context and storytelling.', "'Inter', sans-serif", 16, 400, 0)
            }
            className="w-full p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl text-left transition-all group"
          >
            <span className="text-xs text-neutral-300 group-hover:text-white block">
              Add body paragraph
            </span>
            <span className="text-[10px] text-neutral-500 mt-0.5 block font-mono">
              Inter • 16px
            </span>
          </button>
        </div>

        {/* 9 Typography Presets */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Curated Font Pairings
          </span>

          <div className="space-y-2">
            {TYPOGRAPHY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                className="w-full p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl text-left transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-violet-300">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-neutral-500 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {preset.category}
                  </span>
                </div>
                <div
                  className="text-lg text-neutral-200 mt-2 truncate"
                  style={{
                    fontFamily: preset.heading.fontFamily,
                    letterSpacing: `${preset.heading.letterSpacing}px`,
                    textTransform: preset.heading.textTransform,
                  }}
                >
                  Sophisticated Design
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
