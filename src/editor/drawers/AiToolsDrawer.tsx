import React, { useState } from 'react';
import { CanvasElement, CanvasBackground, TextElement, ImageElement } from '../../types/canvas';
import {
  generateSmartPalette,
  getAiFontPairings,
  getLayoutSuggestions,
  enhanceText,
  removeBackgroundFromImage,
  AiPalette,
  AiFontPairing,
  LayoutSuggestion,
} from '../../utils/aiEngine';
import {
  Sparkles,
  Type,
  LayoutGrid,
  Wand2,
  Scissors,
  Check,
  Loader2,
  Copy,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { generateId } from '../../utils/id';

interface AiToolsDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
  selectedElement: CanvasElement | null;
  onAddElement: (element: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateBackground: (bg: CanvasBackground) => void;
  onBatchUpdateElements?: (updatedElements: CanvasElement[]) => void;
}

type AiTab = 'palette' | 'fonts' | 'layout' | 'text' | 'bg-remover';

export const AiToolsDrawer: React.FC<AiToolsDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  elements,
  selectedElement,
  onAddElement,
  onUpdateElement,
  onUpdateBackground,
  onBatchUpdateElements,
}) => {
  const [activeTab, setActiveTab] = useState<AiTab>('palette');

  // 1. Palette State
  const [palettePrompt, setPalettePrompt] = useState('luxury neon');
  const [generatedPalette, setGeneratedPalette] = useState<AiPalette>(() =>
    generateSmartPalette('luxury neon')
  );
  const [appliedColorIndex, setAppliedColorIndex] = useState<number | null>(null);

  const handleGeneratePalette = (prompt: string) => {
    setPalettePrompt(prompt);
    const pal = generateSmartPalette(prompt);
    setGeneratedPalette(pal);
  };

  // 2. Font Pairing State
  const [selectedPrimaryFont, setSelectedPrimaryFont] = useState('Montserrat');
  const fontPairings = getAiFontPairings(selectedPrimaryFont);

  // 3. Layout Suggester State
  const [layoutSuggestions, setLayoutSuggestions] = useState<LayoutSuggestion[]>(() =>
    getLayoutSuggestions(elements, canvasWidth, canvasHeight)
  );

  const handleRefreshLayouts = () => {
    setLayoutSuggestions(getLayoutSuggestions(elements, canvasWidth, canvasHeight));
  };

  const handleApplyLayout = (suggestion: LayoutSuggestion) => {
    const updated = suggestion.apply(elements, canvasWidth, canvasHeight);
    if (onBatchUpdateElements) {
      onBatchUpdateElements(updated);
    } else {
      updated.forEach((el) => {
        onUpdateElement(el.id, { x: el.x, y: el.y, width: el.width, height: el.height });
      });
    }
  };

  // 4. Text Enhancer State
  const isSelectedText = selectedElement?.type === 'text';
  const [sourceText, setSourceText] = useState(
    isSelectedText ? (selectedElement as TextElement).text : 'Transform your brand with next-gen design'
  );
  const [enhancedText, setEnhancedText] = useState('');
  const [selectedTone, setSelectedTone] = useState<'formal' | 'casual' | 'punchy' | 'sales' | 'grammar' | 'cta'>('punchy');

  const handleEnhance = (tone: typeof selectedTone) => {
    setSelectedTone(tone);
    const result = enhanceText(sourceText, tone);
    setEnhancedText(result);
  };

  const handleApplyEnhancedText = () => {
    if (isSelectedText && enhancedText) {
      onUpdateElement(selectedElement.id, { text: enhancedText });
    } else if (enhancedText) {
      const newTextEl: TextElement = {
        id: generateId('text'),
        name: 'AI Enhanced Text',
        type: 'text',
        x: Math.round(canvasWidth / 2 - 200),
        y: Math.round(canvasHeight / 2 - 40),
        width: 400,
        height: 80,
        text: enhancedText,
        fontFamily: 'Inter',
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        letterSpacing: 0,
        lineHeight: 1.2,
        rotation: 0,
        locked: false,
        hidden: false,
        opacity: 1,
        zIndex: elements.length + 1,
      };
      onAddElement(newTextEl);
    }
  };

  // 5. Background Remover State
  const isSelectedImage = selectedElement?.type === 'image';
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgRemovedSuccess, setBgRemovedSuccess] = useState(false);
  const [bgRemoveError, setBgRemoveError] = useState<string | null>(null);

  const handleRemoveBg = async () => {
    if (!isSelectedImage) return;
    const imgEl = selectedElement as ImageElement;
    setIsRemovingBg(true);
    setBgRemoveError(null);
    setBgRemovedSuccess(false);

    try {
      const transparentDataUrl = await removeBackgroundFromImage(imgEl.src);
      onUpdateElement(imgEl.id, { src: transparentDataUrl });
      setBgRemovedSuccess(true);
    } catch (err: any) {
      setBgRemoveError(err.message || 'Unable to process image background');
    } finally {
      setIsRemovingBg(false);
    }
  };

  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800">
        <div className="flex items-center gap-2 text-violet-400 font-bold text-sm">
          <Sparkles size={18} className="animate-pulse" />
          <span>AF-CANVAS AI Studio</span>
        </div>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Pure in-browser neural & algorithmic design engines
        </p>

        {/* Tab Strip */}
        <div className="flex items-center gap-1 mt-3 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800/80 overflow-x-auto no-scrollbar">
          <button
            title="Smart Palette"
            onClick={() => setActiveTab('palette')}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'palette'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={12} />
            <span>Color</span>
          </button>
          <button
            title="Font Pairing"
            onClick={() => setActiveTab('fonts')}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'fonts'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Type size={12} />
            <span>Fonts</span>
          </button>
          <button
            title="Layout Suggester"
            onClick={() => setActiveTab('layout')}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'layout'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutGrid size={12} />
            <span>Layout</span>
          </button>
          <button
            title="Text Enhancer"
            onClick={() => setActiveTab('text')}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'text'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Wand2 size={12} />
            <span>Copy</span>
          </button>
          <button
            title="Magic BG Remover"
            onClick={() => setActiveTab('bg-remover')}
            className={`flex-1 py-1 px-2 rounded text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'bg-remover'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Scissors size={12} />
            <span>Cutout</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. PALETTE TAB */}
        {activeTab === 'palette' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300">Mood or Keyword</label>
              <div className="flex gap-2 mt-1.5">
                <input
                  type="text"
                  value={palettePrompt}
                  onChange={(e) => setPalettePrompt(e.target.value)}
                  placeholder="e.g. cyber, luxury, pastel, ocean..."
                  className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:border-violet-500 outline-none"
                  onKeyDown={(e) => e.key === 'Enter' && handleGeneratePalette(palettePrompt)}
                />
                <button
                  onClick={() => handleGeneratePalette(palettePrompt)}
                  className="bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Quick Mood Chips */}
            <div className="flex flex-wrap gap-1.5">
              {['Cyberpunk', 'Luxury', 'Minimalist', 'Coffee', 'Nature', 'Sunset', 'Retro'].map(
                (mood) => (
                  <button
                    key={mood}
                    onClick={() => handleGeneratePalette(mood.toLowerCase())}
                    className="text-[10px] px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors border border-neutral-700/60"
                  >
                    {mood}
                  </button>
                )
              )}
            </div>

            {/* Palette Result Card */}
            <div className="bg-neutral-900/90 border border-neutral-700/80 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{generatedPalette.name}</h4>
                  <p className="text-[10px] text-neutral-400">{generatedPalette.mood}</p>
                </div>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-800 font-mono">
                  {generatedPalette.harmony}
                </span>
              </div>

              {/* 5 Swatches Bar */}
              <div className="flex h-12 rounded-lg overflow-hidden border border-neutral-700 shadow-inner">
                {generatedPalette.colors.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full cursor-pointer hover:opacity-90 transition-opacity relative group"
                    style={{ backgroundColor: color }}
                    title={`Click to copy ${color}`}
                    onClick={() => {
                      navigator.clipboard?.writeText(color);
                      setAppliedColorIndex(i);
                      setTimeout(() => setAppliedColorIndex(null), 1500);
                    }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 text-[9px] text-white font-mono transition-opacity">
                      {appliedColorIndex === i ? 'Copied' : color.slice(1, 4)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    onUpdateBackground({
                      type: 'solid',
                      color: generatedPalette.colors[0],
                    })
                  }
                  className="flex-1 py-1.5 text-center text-[11px] font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg transition-colors border border-neutral-700"
                >
                  Set as BG Color
                </button>
                <button
                  onClick={() =>
                    onUpdateBackground({
                      type: 'linear-gradient',
                      color: generatedPalette.colors[0],
                      gradient: {
                        type: 'linear',
                        angle: 135,
                        stops: [
                          { color: generatedPalette.colors[0], offset: 0 },
                          { color: generatedPalette.colors[1], offset: 50 },
                          { color: generatedPalette.colors[2], offset: 100 },
                        ],
                      },
                    })
                  }
                  className="flex-1 py-1.5 text-center text-[11px] font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors shadow-sm"
                >
                  Apply Gradient BG
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. FONTS TAB */}
        {activeTab === 'fonts' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300">Choose Primary Font</label>
              <select
                value={selectedPrimaryFont}
                onChange={(e) => setSelectedPrimaryFont(e.target.value)}
                className="w-full mt-1.5 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-violet-500"
              >
                {['Montserrat', 'Playfair Display', 'Bebas Neue', 'Inter', 'Space Grotesk', 'Cinzel', 'Oswald', 'Poppins'].map(
                  (font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="space-y-2.5">
              <span className="text-[11px] font-medium text-neutral-400">Curated Harmonious Pairings</span>
              {fontPairings.map((pairing, idx) => (
                <div
                  key={idx}
                  className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-2 hover:border-violet-500/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{pairing.style}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                      {pairing.accent}
                    </span>
                  </div>

                  <div className="p-2.5 rounded bg-neutral-950/70 border border-neutral-800 space-y-1">
                    <div
                      className="text-base font-bold text-white leading-tight"
                      style={{ fontFamily: pairing.heading }}
                    >
                      {pairing.heading} Headline
                    </div>
                    <div
                      className="text-xs text-neutral-400 leading-normal"
                      style={{ fontFamily: pairing.body }}
                    >
                      Complementary body font formatted in {pairing.body} with balanced tracking.
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (selectedElement && selectedElement.type === 'text') {
                        onUpdateElement(selectedElement.id, { fontFamily: pairing.heading });
                      } else {
                        // Add headline + body pair to canvas
                        const headlineEl: TextElement = {
                          id: generateId('text'),
                          name: `${pairing.heading} Headline`,
                          type: 'text',
                          x: Math.round(canvasWidth / 2 - 220),
                          y: Math.round(canvasHeight / 2 - 60),
                          width: 440,
                          height: 60,
                          text: 'Captivating Headline',
                          fontFamily: pairing.heading,
                          fontSize: 42,
                          fontWeight: 'bold',
                          color: '#ffffff',
                          textAlign: 'center',
                          letterSpacing: 0,
                          lineHeight: 1.2,
                          rotation: 0,
                          locked: false,
                          hidden: false,
                          opacity: 1,
                          zIndex: elements.length + 1,
                        };
                        const bodyEl: TextElement = {
                          id: generateId('text'),
                          name: `${pairing.body} Body`,
                          type: 'text',
                          x: Math.round(canvasWidth / 2 - 200),
                          y: Math.round(canvasHeight / 2 + 10),
                          width: 400,
                          height: 50,
                          text: 'High readability supporting typography that pairs seamlessly.',
                          fontFamily: pairing.body,
                          fontSize: 16,
                          fontWeight: 'normal',
                          color: '#9ca3af',
                          textAlign: 'center',
                          letterSpacing: 0,
                          lineHeight: 1.2,
                          rotation: 0,
                          locked: false,
                          hidden: false,
                          opacity: 1,
                          zIndex: elements.length + 2,
                        };
                        onAddElement(headlineEl);
                        onAddElement(bodyEl);
                      }
                    }}
                    className="w-full py-1.5 text-center text-xs font-medium bg-neutral-800 hover:bg-violet-600 text-neutral-200 hover:text-white rounded-lg transition-colors"
                  >
                    {selectedElement?.type === 'text' ? 'Apply to Selected Text' : 'Add Font Stack to Canvas'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. LAYOUT TAB */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-neutral-200">AI Layout Suggestions</h4>
                <p className="text-[10px] text-neutral-400">
                  Automated geometric balance for {elements.length} elements
                </p>
              </div>
              <button
                onClick={handleRefreshLayouts}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                title="Recalculate Suggestions"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            {elements.length < 2 ? (
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center text-xs text-neutral-400">
                Add at least 2 elements to the canvas to generate layout variations.
              </div>
            ) : (
              <div className="space-y-2.5">
                {layoutSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-3 space-y-2 hover:border-violet-500 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{suggestion.name}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-950 text-violet-300 font-medium">
                        Balanced
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-400">{suggestion.description}</p>

                    <button
                      onClick={() => handleApplyLayout(suggestion)}
                      className="w-full py-1.5 text-center text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Apply Layout</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. TEXT ENHANCER TAB */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-neutral-300">Input Text</label>
                {isSelectedText && (
                  <span className="text-[10px] text-violet-400 font-medium">
                    (Syncing Selected Text)
                  </span>
                )}
              </div>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                rows={3}
                placeholder="Enter or paste copy to enhance..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 outline-none focus:border-violet-500 resize-none"
              />
            </div>

            {/* Tone Selectors */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">Select Transformation Tone</label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'punchy', label: 'Punchy' },
                  { id: 'sales', label: 'Sales Copy' },
                  { id: 'cta', label: 'Action CTA' },
                  { id: 'formal', label: 'Executive' },
                  { id: 'casual', label: 'Casual' },
                  { id: 'grammar', label: 'Polish' },
                ].map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => handleEnhance(tone.id as any)}
                    className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors border ${
                      selectedTone === tone.id
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Result Box */}
            {enhancedText && (
              <div className="bg-neutral-900 border border-violet-500/40 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-violet-400 flex items-center gap-1">
                    <Sparkles size={12} />
                    AI Enhanced Version
                  </span>
                  <button
                    onClick={() => navigator.clipboard?.writeText(enhancedText)}
                    className="text-neutral-400 hover:text-white"
                    title="Copy to clipboard"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <p className="text-xs text-neutral-100 italic bg-neutral-950/60 p-2 rounded border border-neutral-800">
                  "{enhancedText}"
                </p>

                <button
                  onClick={handleApplyEnhancedText}
                  className="w-full py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg transition-colors"
                >
                  {isSelectedText ? 'Replace Selected Text' : 'Insert as New Text Element'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* 5. BACKGROUND REMOVER TAB */}
        {activeTab === 'bg-remover' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-neutral-200">Magic Background Remover</h4>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Client-side edge detection & alpha matting running entirely in your browser
              </p>
            </div>

            {isSelectedImage ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-lg bg-neutral-950 border border-neutral-700 overflow-hidden shrink-0">
                    <img
                      src={(selectedElement as ImageElement).src}
                      alt="Selected"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white truncate block max-w-[150px]">
                      {selectedElement.name || 'Selected Image'}
                    </span>
                    <span className="text-[10px] text-emerald-400">Ready for cutout</span>
                  </div>
                </div>

                {bgRemoveError && (
                  <p className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900">
                    {bgRemoveError}
                  </p>
                )}

                {bgRemovedSuccess && (
                  <p className="text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-900 flex items-center gap-1.5">
                    <Check size={14} />
                    Background successfully isolated!
                  </p>
                )}

                <button
                  onClick={handleRemoveBg}
                  disabled={isRemovingBg}
                  className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {isRemovingBg ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Extracting Subject...</span>
                    </>
                  ) : (
                    <>
                      <Scissors size={14} />
                      <span>Remove Background</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center space-y-2">
                <p className="text-xs text-neutral-300 font-medium">No Image Selected</p>
                <p className="text-[11px] text-neutral-400">
                  Select an image on the canvas to isolate its subject with one click.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
