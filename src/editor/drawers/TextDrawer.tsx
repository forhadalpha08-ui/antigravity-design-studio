import React, { useState } from 'react';
import { TextElement } from '../../types/canvas';
import { TYPOGRAPHY_PRESETS, TypographyPreset } from '../../utils/fonts';
import { generateId } from '../../utils/id';
import { Type, Plus, Sparkles } from 'lucide-react';

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
  const [customText, setCustomText] = useState('');
  const [customType, setCustomType] = useState<'heading' | 'subheading' | 'body' | 'quote'>('heading');

  const addText = (
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: number | string,
    letterSpacing = 0,
    textTransform: 'none' | 'uppercase' = 'none',
    fontStyle: 'normal' | 'italic' = 'normal'
  ) => {
    const w = Math.min(canvasWidth - 60, Math.max(300, fontSize * 10));
    const h = Math.max(50, fontSize * 1.8);

    const el: TextElement = {
      id: generateId('text'),
      name: text.slice(0, 16),
      type: 'text',
      text,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle,
      textAlign: 'center',
      letterSpacing,
      lineHeight: 1.25,
      color: '#ffffff',
      textTransform,
      x: Math.round((canvasWidth - w) / 2),
      y: Math.round((canvasHeight - h) / 2),
      width: Math.round(w),
      height: Math.round(h),
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
    };
    onAddElement(el);
  };

  const handleAddCustomText = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const textToAdd = customText.trim() || 'Your Design Text';
    if (customType === 'heading') {
      addText(textToAdd, "'Space Grotesk', sans-serif", 54, 700, -1);
    } else if (customType === 'subheading') {
      addText(textToAdd, "'Montserrat', sans-serif", 28, 600, 1);
    } else if (customType === 'quote') {
      addText(textToAdd, "'Playfair Display', serif", 32, 600, 0, 'none', 'italic');
    } else {
      addText(textToAdd, "'Inter', sans-serif", 18, 400, 0);
    }
    setCustomText('');
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
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
          <Type size={14} className="text-violet-400" />
          <span>Typography Studio</span>
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Custom Text Direct Input */}
        <div className="p-3.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-violet-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles size={12} className="text-violet-400" />
              <span>Create Custom Text</span>
            </span>
          </div>

          <form onSubmit={handleAddCustomText} className="space-y-2.5">
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type your words here..."
              className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
            />

            {/* Quick hierarchy selector pills */}
            <div className="grid grid-cols-4 gap-1">
              {(
                [
                  { id: 'heading', label: 'Heading' },
                  { id: 'subheading', label: 'Subhead' },
                  { id: 'body', label: 'Body' },
                  { id: 'quote', label: 'Quote' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setCustomType(t.id)}
                  className={`py-1 text-[10px] font-medium rounded-lg border transition-all ${
                    customType === t.id
                      ? 'bg-violet-600/30 border-violet-500 text-violet-200 font-bold'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-2 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-violet-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={14} />
              <span>Add to Canvas</span>
            </button>
          </form>
        </div>

        {/* Core Hierarchy Buttons */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Quick Add Hierarchy
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
