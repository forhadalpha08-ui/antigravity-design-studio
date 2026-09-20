import React, { useState } from 'react';
import { BrandKit } from '../../types/canvas';
import { GOOGLE_FONTS } from '../../utils/fonts';
import { Palette, Sparkles, Plus, Trash2 } from 'lucide-react';

interface BrandKitDrawerProps {
  brandKit: BrandKit;
  onAddColor: (hex: string) => void;
  onRemoveColor: (hex: string) => void;
  onUpdateFonts: (fonts: BrandKit['fonts']) => void;
  onApplyBrandKitToCanvas: () => void;
}

export const BrandKitDrawer: React.FC<BrandKitDrawerProps> = ({
  brandKit,
  onAddColor,
  onRemoveColor,
  onUpdateFonts,
  onApplyBrandKitToCanvas,
}) => {
  const [newColor, setNewColor] = useState('#8b5cf6');

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800 space-y-3">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Brand Kit Studio
        </h2>

        {/* 1-Click Apply Button */}
        <button
          onClick={onApplyBrandKitToCanvas}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
        >
          <Sparkles size={15} /> Apply Brand Kit to Canvas
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Brand Colors */}
        <div className="space-y-3">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Brand Color Palette
          </span>

          <div className="grid grid-cols-3 gap-2">
            {brandKit.colors.map((c, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col items-center p-2 bg-neutral-900 border border-neutral-800 rounded-xl"
              >
                <div
                  className="w-10 h-10 rounded-lg shadow-md mb-1.5"
                  style={{ backgroundColor: c }}
                />
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  {c}
                </span>
                <button
                  onClick={() => onRemoveColor(c)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-7 h-7 rounded border-none bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 uppercase font-mono"
            />
            <button
              onClick={() => onAddColor(newColor)}
              className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        {/* Brand Fonts */}
        <div className="space-y-3 pt-2 border-t border-neutral-800">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Brand Typography
          </span>

          <div className="space-y-2">
            <label className="text-[11px] text-neutral-500 block">
              Header Font
            </label>
            <select
              value={brandKit.fonts.heading}
              onChange={(e) =>
                onUpdateFonts({ ...brandKit.fonts, heading: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-neutral-200 outline-none"
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f.name} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-neutral-500 block">
              Body Font
            </label>
            <select
              value={brandKit.fonts.body}
              onChange={(e) =>
                onUpdateFonts({ ...brandKit.fonts, body: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-neutral-200 outline-none"
            >
              {GOOGLE_FONTS.map((f) => (
                <option key={f.name} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
