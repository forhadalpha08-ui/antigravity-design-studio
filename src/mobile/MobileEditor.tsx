import React, { useState, useEffect, useRef } from 'react';
import { Project, CanvasElement, Template, CanvasBackground, BrandKit } from '../types/canvas';
import { SaveStatus } from '../store/useProjectStore';
import { CanvasArea } from '../editor/canvas/CanvasArea';
import { MobileBottomSheet } from './MobileBottomSheet';
import { TemplatesDrawer } from '../editor/drawers/TemplatesDrawer';
import { ElementsDrawer } from '../editor/drawers/ElementsDrawer';
import { TextDrawer } from '../editor/drawers/TextDrawer';
import { ImagesDrawer } from '../editor/drawers/ImagesDrawer';
import { BackgroundDrawer } from '../editor/drawers/BackgroundDrawer';
import { BrandKitDrawer } from '../editor/drawers/BrandKitDrawer';
import { LayersDrawer } from '../editor/drawers/LayersDrawer';
import { PositionLayoutSection } from '../editor/inspector/PositionLayoutSection';
import { TypographySection } from '../editor/inspector/TypographySection';
import { AppearanceSection } from '../editor/inspector/AppearanceSection';
import { ImageSection } from '../editor/inspector/ImageSection';
import { EffectsSection } from '../editor/inspector/EffectsSection';
import { AnimationSection } from '../editor/inspector/AnimationSection';
import { useBrandKitState } from '../store/useBrandKitStore';
import { SnapGuide } from '../utils/math';
import { ToolType } from '../store/useEditorStore';
import { CANVAS_PRESETS } from '../utils/presetSizes';
import {
  ChevronLeft,
  Undo2,
  Redo2,
  Play,
  Download,
  LayoutTemplate,
  Shapes,
  Type,
  Image as ImageIcon,
  Sparkles,
  Palette,
  Layers,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Hand,
  MousePointer,
  Check,
  Loader2,
  Maximize,
} from 'lucide-react';

interface MobileEditorProps {
  project: Project;
  saveStatus?: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBack: () => void;
  onUpdateTitle: (t: string) => void;
  onOpenExportModal: () => void;
  onOpenPresentation: () => void;
  onSelectTemplate: (t: Template) => void;
  onAddElement: (el: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>, pushHistory?: boolean) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onUpdateCanvasSize: (w: number, h: number) => void;
  onUpdateCanvasBackground: (bg: CanvasBackground) => void;
  onApplyBrandKit: (brandKit: BrandKit) => void;
}

export const MobileEditor: React.FC<MobileEditorProps> = ({
  project,
  saveStatus = 'saved',
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBack,
  onUpdateTitle,
  onOpenExportModal,
  onOpenPresentation,
  onSelectTemplate,
  onAddElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderLayer,
  onUpdateCanvasSize,
  onUpdateCanvasBackground,
  onApplyBrandKit,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'style' | 'font' | 'position' | 'effects' | 'motion'>('style');
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  // Scale & Pan
  const [scale, setScale] = useState(0.35);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { brandKit, addColor, removeColor, updateFonts } = useBrandKitState();

  // Auto-compute optimal initial scale to fit mobile viewport
  const fitToScreen = () => {
    const screenW = window.innerWidth - 24;
    const screenH = window.innerHeight - 220;
    const s = Math.min(screenW / project.width, screenH / project.height);
    setScale(Math.max(0.12, Math.min(s, 1.2)));
    setPan({ x: 0, y: 0 });
  };

  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [project.width, project.height]);

  const selectedElement = project.elements.find((el) => el.id === selectedId);

  const handleSelect = (id: string | null) => {
    setSelectedId(id || null);
    if (id) {
      const el = project.elements.find((e) => e.id === id);
      if (el?.type === 'text') {
        setInspectorTab('font');
      } else {
        setInspectorTab('style');
      }
    }
  };

  const zoomIn = () => setScale((s) => Math.min(s * 1.2, 3));
  const zoomOut = () => setScale((s) => Math.max(s * 0.8, 0.12));
  const setActualSize = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#07080c] select-none overflow-hidden relative">
      {/* 1. MOBILE TOP HEADER */}
      <header className="h-14 w-full bg-[#0d0e14] border-b border-neutral-800 flex items-center justify-between px-2.5 z-30 flex-shrink-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg active:bg-neutral-800 flex-shrink-0"
            title="Back to Dashboard"
          >
            <ChevronLeft size={20} />
          </button>

          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent text-xs font-bold text-white outline-none w-24 sm:w-36 truncate focus:bg-neutral-900 px-1.5 py-0.5 rounded"
          />

          {/* Save Status Indicator */}
          <div className="hidden xs:flex items-center text-[10px] text-neutral-500">
            {saveStatus === 'saved' && <span className="text-emerald-400">● Saved</span>}
            {saveStatus === 'saving' && <span className="text-violet-400 animate-pulse">● Saving</span>}
            {saveStatus === 'unsaved' && <span className="text-amber-400">● Unsaved</span>}
          </div>
        </div>

        {/* Center: Undo / Redo */}
        <div className="flex items-center gap-0.5 bg-neutral-900/90 border border-neutral-800/80 rounded-lg p-0.5">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 disabled:opacity-30 text-neutral-300 active:text-white"
            title="Undo"
          >
            <Undo2 size={15} />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 disabled:opacity-30 text-neutral-300 active:text-white"
            title="Redo"
          >
            <Redo2 size={15} />
          </button>
        </div>

        {/* Right: Dimension Pill + Presentation + Export */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setActiveDrawer('resize')}
            className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-mono text-neutral-400 active:border-violet-500"
            title="Change Canvas Size"
          >
            {project.width}×{project.height}
          </button>

          <button
            onClick={onOpenPresentation}
            className="p-1.5 text-neutral-400 hover:text-white active:bg-neutral-800 rounded-lg"
            title="Present"
          >
            <Play size={15} className="text-violet-400" />
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-600 active:bg-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-violet-600/30"
          >
            <Download size={13} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </header>

      {/* 2. FULL INTERACTIVE CANVAS VIEWPORT (Identical to Desktop) */}
      <main className="flex-1 w-full h-full relative overflow-hidden bg-[#07080c]">
        <CanvasArea
          project={project}
          scale={scale}
          pan={pan}
          activeTool={activeTool}
          selectedId={selectedId}
          snapGuides={snapGuides}
          isPlayingAnimation={false}
          onScaleChange={setScale}
          onPanChange={setPan}
          onSelectElement={handleSelect}
          onUpdateElement={onUpdateElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          onReorderLayer={onReorderLayer}
          onSetGuides={setSnapGuides}
          onOpenEdit={() => setIsInspectorOpen(true)}
        />

        {/* FLOATING MOBILE CANVAS VIEW CONTROLS */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-1.5 bg-neutral-900/90 border border-neutral-800/90 rounded-xl p-1 shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setActiveTool((t) => (t === 'hand' ? 'select' : 'hand'))}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'hand'
                ? 'bg-violet-600 text-white shadow'
                : 'text-neutral-400 active:text-white'
            }`}
            title={activeTool === 'hand' ? 'Select Mode' : 'Pan Canvas'}
          >
            {activeTool === 'hand' ? <Hand size={16} /> : <MousePointer size={16} />}
          </button>

          <div className="w-full h-[1px] bg-neutral-800 my-0.5" />

          <button
            onClick={zoomIn}
            className="p-2 text-neutral-300 active:text-white hover:bg-neutral-800 rounded-lg"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>

          <button
            onClick={fitToScreen}
            className="px-1.5 py-1 text-[10px] font-mono font-bold text-violet-400 hover:bg-neutral-800 rounded-lg text-center"
            title="Fit to Viewport"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={zoomOut}
            className="p-2 text-neutral-300 active:text-white hover:bg-neutral-800 rounded-lg"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>

          <button
            onClick={setActualSize}
            className="p-2 text-neutral-400 active:text-white hover:bg-neutral-800 rounded-lg"
            title="100% Size"
          >
            <Maximize size={15} />
          </button>
        </div>
      </main>

      {/* 3. FLOATING BOTTOM TOOL DOCK (All Desktop Drawers & Tools) */}
      <footer className="fixed bottom-3 left-2 right-2 z-40 bg-neutral-900/95 border border-neutral-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-1.5 flex items-center justify-around overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveDrawer('templates')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <LayoutTemplate size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Templates</span>
        </button>

        <button
          onClick={() => setActiveDrawer('elements')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <Shapes size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Shapes</span>
        </button>

        <button
          onClick={() => setActiveDrawer('text')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <Type size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Text</span>
        </button>

        <button
          onClick={() => setActiveDrawer('images')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <ImageIcon size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Photos</span>
        </button>

        <button
          onClick={() => setActiveDrawer('background')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <Sparkles size={18} />
          <span className="text-[9px] mt-0.5 font-medium">BG Studio</span>
        </button>

        <button
          onClick={() => setActiveDrawer('brand-kit')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <Palette size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Brand Kit</span>
        </button>

        <button
          onClick={() => setActiveDrawer('layers')}
          className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
        >
          <Layers size={18} />
          <span className="text-[9px] mt-0.5 font-medium">Layers</span>
        </button>

        {selectedElement ? (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 bg-violet-600/30 text-violet-300 border border-violet-500/50 rounded-xl min-w-[54px] animate-pulse"
          >
            <Sliders size={18} />
            <span className="text-[9px] mt-0.5 font-bold">Edit</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveDrawer('resize')}
            className="flex flex-col items-center justify-center py-1 px-2 text-neutral-400 active:text-violet-400 min-w-[52px]"
          >
            <Maximize2 size={18} />
            <span className="text-[9px] mt-0.5 font-medium">Resize</span>
          </button>
        )}
      </footer>

      {/* 4. DRAWER BOTTOM SHEET (Templates, Elements, Text, Images, BG Studio, Brand Kit, Layers, Resize) */}
      <MobileBottomSheet
        isOpen={activeDrawer !== null}
        onClose={() => setActiveDrawer(null)}
        title={
          activeDrawer === 'templates'
            ? 'Select Template'
            : activeDrawer === 'elements'
            ? 'Shapes & Icons'
            : activeDrawer === 'text'
            ? 'Typography'
            : activeDrawer === 'images'
            ? 'Photos & Uploads'
            : activeDrawer === 'background'
            ? 'Background Studio'
            : activeDrawer === 'brand-kit'
            ? 'Brand Kit'
            : activeDrawer === 'resize'
            ? 'Canvas Dimensions'
            : 'Layers'
        }
      >
        {activeDrawer === 'templates' && (
          <TemplatesDrawer
            onSelectTemplate={(tpl) => {
              onSelectTemplate(tpl);
              setActiveDrawer(null);
            }}
          />
        )}
        {activeDrawer === 'elements' && (
          <ElementsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
          />
        )}
        {activeDrawer === 'text' && (
          <TextDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
          />
        )}
        {activeDrawer === 'images' && (
          <ImagesDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
          />
        )}
        {activeDrawer === 'background' && (
          <BackgroundDrawer
            currentBackground={project.background}
            onUpdateBackground={onUpdateCanvasBackground}
          />
        )}
        {activeDrawer === 'brand-kit' && (
          <BrandKitDrawer
            brandKit={brandKit}
            onAddColor={addColor}
            onRemoveColor={removeColor}
            onUpdateFonts={updateFonts}
            onApplyBrandKitToCanvas={() => onApplyBrandKit(brandKit)}
          />
        )}
        {activeDrawer === 'layers' && (
          <LayersDrawer
            elements={project.elements}
            selectedId={selectedId}
            onSelectElement={(id) => {
              setSelectedId(id);
              setActiveDrawer(null);
              if (id) setIsInspectorOpen(true);
            }}
            onUpdateElement={onUpdateElement}
            onDuplicateElement={onDuplicateElement}
            onDeleteElement={onDeleteElement}
            onReorderLayer={onReorderLayer}
          />
        )}
        {activeDrawer === 'resize' && (
          <div className="space-y-5 p-2">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Custom Dimensions (px)
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">WIDTH</span>
                  <input
                    type="number"
                    value={project.width}
                    onChange={(e) => onUpdateCanvasSize(Number(e.target.value), project.height)}
                    className="w-full bg-transparent outline-none text-white font-mono mt-1 text-sm font-bold"
                  />
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-2.5">
                  <span className="text-[10px] text-neutral-500 font-bold block">HEIGHT</span>
                  <input
                    type="number"
                    value={project.height}
                    onChange={(e) => onUpdateCanvasSize(project.width, Number(e.target.value))}
                    className="w-full bg-transparent outline-none text-white font-mono mt-1 text-sm font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
                Preset Sizes
              </span>
              <div className="grid grid-cols-2 gap-2">
                {CANVAS_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      onUpdateCanvasSize(preset.width, preset.height);
                      setActiveDrawer(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      project.width === preset.width && project.height === preset.height
                        ? 'bg-violet-600/20 border-violet-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{preset.name}</div>
                    <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                      {preset.width} × {preset.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </MobileBottomSheet>

      {/* 5. FULL INSPECTOR BOTTOM SHEET (Every feature from Desktop) */}
      {selectedElement ? (
        <MobileBottomSheet
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          title={`Edit ${selectedElement.name || selectedElement.type}`}
        >
          {/* Inspector Tabs */}
          <div className="flex gap-1.5 border-b border-neutral-800 pb-2 mb-4 overflow-x-auto text-xs scrollbar-none">
            <button
              onClick={() => setInspectorTab('style')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'style'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Style & Fill
            </button>
            {selectedElement.type === 'text' && (
              <button
                onClick={() => setInspectorTab('font')}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                  inspectorTab === 'font'
                    ? 'bg-violet-600 text-white'
                    : 'text-neutral-400 bg-neutral-900'
                }`}
              >
                Typography
              </button>
            )}
            <button
              onClick={() => setInspectorTab('position')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'position'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Position & Align
            </button>
            <button
              onClick={() => setInspectorTab('effects')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'effects'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Effects & Shadow
            </button>
            <button
              onClick={() => setInspectorTab('motion')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'motion'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Motion Animation
            </button>
          </div>

          {/* Tab contents */}
          {inspectorTab === 'position' && (
            <PositionLayoutSection
              element={selectedElement}
              canvasWidth={project.width}
              canvasHeight={project.height}
              onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
            />
          )}

          {inspectorTab === 'font' && selectedElement.type === 'text' && (
            <TypographySection
              element={selectedElement as any}
              onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
            />
          )}

          {inspectorTab === 'style' && (
            <>
              {selectedElement.type === 'shape' && (
                <AppearanceSection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
              {selectedElement.type === 'image' && (
                <ImageSection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
              {selectedElement.type === 'text' && (
                <TypographySection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
            </>
          )}

          {inspectorTab === 'effects' && (
            <EffectsSection
              element={selectedElement}
              onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
            />
          )}

          {inspectorTab === 'motion' && (
            <AnimationSection
              element={selectedElement}
              onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
              onPlayAnimation={onOpenPresentation}
            />
          )}
        </MobileBottomSheet>
      ) : null}
    </div>
  );
};
