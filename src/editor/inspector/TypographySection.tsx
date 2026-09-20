import React from 'react';
import { TextElement } from '../../types/canvas';
import { GOOGLE_FONTS, TYPOGRAPHY_PRESETS } from '../../utils/fonts';
import {
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  CaseUpper,
} from 'lucide-react';

interface TypographySectionProps {
  element: TextElement;
  onUpdate: (updates: Partial<TextElement>) => void;
}

export const TypographySection: React.FC<TypographySectionProps> = ({
  element,
  onUpdate,
}) => {
  return (
    <div className="space-y-3 pb-4 border-b border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Typography
      </div>

      {/* Font Family Dropdown */}
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-500">Font Family</label>
        <select
          value={element.fontFamily}
          onChange={(e) => onUpdate({ fontFamily: e.target.value })}
          className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-neutral-200 outline-none focus:border-violet-500 cursor-pointer"
        >
          {GOOGLE_FONTS.map((f) => (
            <option key={f.name} value={f.family} style={{ fontFamily: f.family }}>
              {f.name} ({f.category})
            </option>
          ))}
        </select>
      </div>

      {/* Size & Weight */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500">Size</label>
          <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
            <input
              type="number"
              min={8}
              max={300}
              value={element.fontSize}
              onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
              className="w-full bg-transparent outline-none text-neutral-200"
            />
            <span className="text-neutral-500 text-[10px]">px</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500">Weight</label>
          <select
            value={element.fontWeight}
            onChange={(e) => onUpdate({ fontWeight: Number(e.target.value) })}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 outline-none"
          >
            <option value={300}>300 Light</option>
            <option value={400}>400 Regular</option>
            <option value={500}>500 Medium</option>
            <option value={600}>600 SemiBold</option>
            <option value={700}>700 Bold</option>
            <option value={800}>800 ExtraBold</option>
            <option value={900}>900 Black</option>
          </select>
        </div>
      </div>

      {/* Styling & Alignment Toggles */}
      <div className="flex items-center justify-between bg-neutral-900 p-1 rounded-lg border border-neutral-800">
        <button
          title="Italic"
          onClick={() =>
            onUpdate({ fontStyle: element.fontStyle === 'italic' ? 'normal' : 'italic' })
          }
          className={`p-1.5 rounded transition-colors ${
            element.fontStyle === 'italic'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Italic size={15} />
        </button>
        <button
          title="Underline"
          onClick={() =>
            onUpdate({
              textDecoration:
                element.textDecoration === 'underline' ? 'none' : 'underline',
            })
          }
          className={`p-1.5 rounded transition-colors ${
            element.textDecoration === 'underline'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Underline size={15} />
        </button>
        <div className="w-[1px] h-4 bg-neutral-800" />
        <button
          title="Align Left"
          onClick={() => onUpdate({ textAlign: 'left' })}
          className={`p-1.5 rounded transition-colors ${
            element.textAlign === 'left'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AlignLeft size={15} />
        </button>
        <button
          title="Align Center"
          onClick={() => onUpdate({ textAlign: 'center' })}
          className={`p-1.5 rounded transition-colors ${
            element.textAlign === 'center'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AlignCenter size={15} />
        </button>
        <button
          title="Align Right"
          onClick={() => onUpdate({ textAlign: 'right' })}
          className={`p-1.5 rounded transition-colors ${
            element.textAlign === 'right'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AlignRight size={15} />
        </button>
        <div className="w-[1px] h-4 bg-neutral-800" />
        <button
          title="Uppercase"
          onClick={() =>
            onUpdate({
              textTransform:
                element.textTransform === 'uppercase' ? 'none' : 'uppercase',
            })
          }
          className={`p-1.5 rounded transition-colors ${
            element.textTransform === 'uppercase'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CaseUpper size={15} />
        </button>
      </div>

      {/* Spacing Controls */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500">Letter Spacing</label>
          <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
            <input
              type="number"
              step={0.5}
              value={element.letterSpacing || 0}
              onChange={(e) => onUpdate({ letterSpacing: Number(e.target.value) })}
              className="w-full bg-transparent outline-none text-neutral-200"
            />
            <span className="text-neutral-500 text-[10px]">px</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] text-neutral-500">Line Height</label>
          <div className="bg-neutral-900 border border-neutral-800 rounded p-1.5 flex items-center justify-between">
            <input
              type="number"
              step={0.1}
              min={0.8}
              max={3}
              value={element.lineHeight || 1.2}
              onChange={(e) => onUpdate({ lineHeight: Number(e.target.value) })}
              className="w-full bg-transparent outline-none text-neutral-200"
            />
          </div>
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-500">Text Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={element.color || '#ffffff'}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={element.color || '#ffffff'}
            onChange={(e) => onUpdate({ color: e.target.value })}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 uppercase font-mono"
          />
        </div>
      </div>

      {/* Quick Typography Presets */}
      <div className="space-y-1 pt-1">
        <label className="text-[11px] text-neutral-500">Style Presets</label>
        <div className="grid grid-cols-3 gap-1">
          {TYPOGRAPHY_PRESETS.slice(0, 6).map((preset) => (
            <button
              key={preset.id}
              onClick={() =>
                onUpdate({
                  fontFamily: preset.heading.fontFamily,
                  letterSpacing: preset.heading.letterSpacing,
                  textTransform: preset.heading.textTransform,
                })
              }
              className="px-2 py-1 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded text-[10px] text-neutral-300 truncate text-left"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
