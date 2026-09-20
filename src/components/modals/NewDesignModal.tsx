import React, { useState } from 'react';
import { CANVAS_PRESETS } from '../../utils/presetSizes';
import { X, Plus, ArrowLeftRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface NewDesignModalProps {
  onClose: () => void;
  onCreate: (title: string, width: number, height: number, category: string) => void;
}

export const NewDesignModal: React.FC<NewDesignModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1080);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Social Media', 'Video', 'Print', 'Business'];

  const filteredPresets = CANVAS_PRESETS.filter(
    (p) => selectedCategory === 'All' || p.category === selectedCategory
  );

  const swapOrientation = () => {
    const w = width;
    setWidth(height);
    setHeight(w);
  };

  const handleSelectPreset = (p: typeof CANVAS_PRESETS[0]) => {
    setWidth(p.width);
    setHeight(p.height);
    if (!title) setTitle(p.name);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(title || 'Untitled Design', width, height, 'custom');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-150 p-0 sm:p-4">
      <div className="w-full sm:max-w-xl bg-[#12131a] border border-neutral-800 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Plus size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Design</h3>
              <p className="text-xs text-neutral-400">
                Choose a preset dimension or enter custom sizing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Design Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Project Title
            </label>
            <input
              type="text"
              placeholder="e.g. Autumn Fashion Campaign"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-violet-500"
            />
          </div>

          {/* Custom Size Form */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Dimensions (Pixels)
              </label>
              <button
                type="button"
                onClick={swapOrientation}
                className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
              >
                <ArrowLeftRight size={12} /> Swap W/H
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                <span className="text-neutral-500 text-[10px] block">WIDTH</span>
                <input
                  type="number"
                  min={100}
                  max={8000}
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none mt-0.5"
                />
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                <span className="text-neutral-500 text-[10px] block">HEIGHT</span>
                <input
                  type="number"
                  min={100}
                  max={8000}
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full bg-transparent text-sm font-semibold text-white outline-none mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Preset Sizes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex-shrink-0">
                Preset Sizes
              </label>

              <div className="flex gap-1 overflow-x-auto scrollbar-none flex-shrink-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded text-[10px] transition-colors whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-violet-600 text-white'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => {
                const IconComp =
                  (LucideIcons as any)[preset.iconName] || LucideIcons.Layout;
                const isSelected = width === preset.width && height === preset.height;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-white'
                    }`}
                  >
                    <IconComp size={16} className="mb-2 text-violet-400" />
                    <div>
                      <div className="text-xs font-medium truncate">
                        {preset.name}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                        {preset.width} × {preset.height}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              Create Blank Canvas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
