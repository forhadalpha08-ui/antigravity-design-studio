import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Project, CanvasElement, Template, CanvasBackground, BrandKit, BrushType, CommentThread } from '../types/canvas';
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
import { AiToolsDrawer } from '../editor/drawers/AiToolsDrawer';
import { DrawDrawer } from '../editor/drawers/DrawDrawer';
import { ChartsDrawer } from '../editor/drawers/ChartsDrawer';
import { TablesDrawer } from '../editor/drawers/TablesDrawer';
import { QrCodeDrawer } from '../editor/drawers/QrCodeDrawer';
import { CommentsDrawer } from '../editor/drawers/CommentsDrawer';
import { PositionLayoutSection } from '../editor/inspector/PositionLayoutSection';
import { TypographySection } from '../editor/inspector/TypographySection';
import { AppearanceSection } from '../editor/inspector/AppearanceSection';
import { ImageSection } from '../editor/inspector/ImageSection';
import { EffectsSection } from '../editor/inspector/EffectsSection';
import { AnimationSection } from '../editor/inspector/AnimationSection';
import { ChartSection } from '../editor/inspector/ChartSection';
import { TableSection } from '../editor/inspector/TableSection';
import { DrawSection } from '../editor/inspector/DrawSection';
import { QrCodeSection } from '../editor/inspector/QrCodeSection';
import { useBrandKitState } from '../store/useBrandKitStore';
import { SnapGuide } from '../utils/math';
import { ToolType } from '../store/useEditorStore';
import { CANVAS_PRESETS } from '../utils/presetSizes';
import { generateId } from '../utils/id';
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
  Hand,
  MousePointer,
  Maximize,
  Pen,
  BarChart3,
  Table as TableIcon,
  QrCode,
  Wand2,
  MessageSquare,
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
  onGroupElements?: (ids: string[]) => void;
  onUngroupElements?: (groupId: string) => void;
  onAlignElements?: (ids: string[], type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeElements?: (ids: string[], axis: 'horizontal' | 'vertical') => void;
  onAddComment?: (comment: CommentThread) => void;
  onResolveComment?: (id: string) => void;
  onDeleteComment?: (id: string) => void;
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
  onGroupElements,
  onUngroupElements,
  onAlignElements,
  onDistributeElements,
  onAddComment,
  onResolveComment,
  onDeleteComment,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'style' | 'font' | 'position' | 'effects' | 'motion'>('style');
  const [activeTool, setActiveTool] = useState<ToolType>('select');
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);

  // Brush settings for freehand drawing
  const [brushType, setBrushType] = useState<BrushType>('pen');
  const [brushColor, setBrushColor] = useState<string>('#8b5cf6');
  const [brushSize, setBrushSize] = useState<number>(4);
  const [showComments, setShowComments] = useState<boolean>(true);

  // Scale & Pan
  const [scale, setScale] = useState(0.35);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const { brandKit, addColor, removeColor, updateFonts } = useBrandKitState();

  // Auto-compute optimal scale so template shows 100% full height and width on mobile
  const fitToScreen = useCallback(() => {
    // Header is ~56px, bottom bar is ~64px, safe area is ~25px, breathing room ~32px
    const screenW = Math.max(100, window.innerWidth - 32);
    const screenH = Math.max(100, window.innerHeight - 170);
    const s = Math.min(screenW / project.width, screenH / project.height);
    if (s > 0) {
      const targetScale = Math.max(0.08, Math.min(Math.round(s * 1000) / 1000, 1.5));
      setScale(targetScale);
      setPan({ x: 0, y: 0 });
    }
  }, [project.width, project.height]);

  useEffect(() => {
    fitToScreen();
    window.addEventListener('resize', fitToScreen);
    return () => window.removeEventListener('resize', fitToScreen);
  }, [project.id, project.width, project.height, fitToScreen]);

  const selectedElement = project.elements.find((el) => el.id === selectedId) || null;

  const handleSelect = (id: string | null) => {
    setSelectedId(id || null);
    setSelectedIds(id ? [id] : []);
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

  const handleAddCommentAtCoords = (x: number, y: number) => {
    const text = window.prompt('Enter comment or design feedback:');
    if (text && text.trim() && onAddComment) {
      onAddComment({
        id: generateId('cmt'),
        x,
        y,
        author: 'Mobile User',
        avatarColor: '#8b5cf6',
        text: text.trim(),
        createdAt: Date.now(),
        resolved: false,
        replies: [],
      });
      setActiveDrawer('comments');
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#07080c] select-none overflow-hidden relative">
      {/* 1. MOBILE TOP HEADER */}
      <header
        className="h-14 lg:h-16 w-full bg-[#0d0e14] border-b border-neutral-800 flex items-center justify-between px-3 sm:px-4 z-30 flex-shrink-0"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
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
            className="bg-transparent text-xs font-bold text-white outline-none w-28 sm:w-40 md:w-56 truncate focus:bg-neutral-900 px-1.5 py-0.5 rounded"
          />

          {/* Save Status Indicator */}
          <div className="flex items-center text-[10px] text-neutral-500">
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
            className="px-2 py-1 bg-neutral-900 border border-neutral-800 rounded-md text-[10px] font-mono text-neutral-400 active:border-violet-500 hidden sm:block"
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

      {/* 2. FULL INTERACTIVE CANVAS VIEWPORT */}
      <main
        className="flex-1 w-full relative overflow-hidden bg-[#07080c]"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 68px)' }}
      >
        <CanvasArea
          project={project}
          scale={scale}
          pan={pan}
          activeTool={activeTool}
          selectedId={selectedId}
          selectedIds={selectedIds}
          snapGuides={snapGuides}
          isPlayingAnimation={false}
          brushType={brushType}
          brushColor={brushColor}
          brushSize={brushSize}
          showComments={showComments}
          onScaleChange={setScale}
          onPanChange={setPan}
          onSelectElement={handleSelect}
          onSetSelection={setSelectedIds}
          onUpdateElement={onUpdateElement}
          onAddElement={onAddElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          onReorderLayer={onReorderLayer}
          onSetGuides={setSnapGuides}
          onOpenEdit={() => setIsInspectorOpen(true)}
          onGroupElements={onGroupElements}
          onUngroupElements={onUngroupElements}
          onAlignElements={onAlignElements}
          onAddComment={handleAddCommentAtCoords}
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

          <button
            onClick={() => {
              setActiveTool((t) => (t === 'draw' ? 'select' : 'draw'));
              setActiveDrawer('draw');
            }}
            className={`p-2 rounded-lg transition-colors ${
              activeTool === 'draw'
                ? 'bg-violet-600 text-white shadow'
                : 'text-neutral-400 active:text-white'
            }`}
            title="Freehand Draw"
          >
            <Pen size={16} />
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

      {/* 3. FLOATING BOTTOM TOOL DOCK */}
      <footer
        className="fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 border-t border-neutral-700/80 backdrop-blur-xl shadow-2xl flex items-center justify-around overflow-x-auto scrollbar-none"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 6px)',
          paddingTop: '6px',
          paddingLeft: 'env(safe-area-inset-left, 0px)',
          paddingRight: 'env(safe-area-inset-right, 0px)',
        }}
      >
        <button
          onClick={() => setActiveDrawer(activeDrawer === 'ai-tools' ? null : 'ai-tools')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'ai-tools' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Wand2 size={17} className="text-violet-400" />
          <span className="text-[9px] mt-0.5 font-bold text-violet-400">AI Studio</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'templates' ? null : 'templates')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'templates' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <LayoutTemplate size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Templates</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'elements' ? null : 'elements')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'elements' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Shapes size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Shapes</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'text' ? null : 'text')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'text' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Type size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Text</span>
        </button>

        <button
          onClick={() => {
            setActiveDrawer(activeDrawer === 'draw' ? null : 'draw');
            setActiveTool('draw');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'draw' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Pen size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Draw</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'charts' ? null : 'charts')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'charts' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <BarChart3 size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Charts</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'tables' ? null : 'tables')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'tables' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <TableIcon size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Tables</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'qr' ? null : 'qr')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'qr' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <QrCode size={17} />
          <span className="text-[9px] mt-0.5 font-medium">QR Code</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'images' ? null : 'images')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'images' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <ImageIcon size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Photos</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'background' ? null : 'background')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'background' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Sparkles size={17} />
          <span className="text-[9px] mt-0.5 font-medium">BG</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'brand-kit' ? null : 'brand-kit')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'brand-kit' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Palette size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Brand</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'layers' ? null : 'layers')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'layers' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <Layers size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Layers</span>
        </button>

        <button
          onClick={() => setActiveDrawer(activeDrawer === 'comments' ? null : 'comments')}
          className={`flex flex-col items-center justify-center py-1 px-2 min-w-[50px] transition-colors ${
            activeDrawer === 'comments' ? 'text-violet-400' : 'text-neutral-400 active:text-violet-400'
          }`}
        >
          <MessageSquare size={17} />
          <span className="text-[9px] mt-0.5 font-medium">Notes</span>
        </button>

        {selectedElement ? (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="flex flex-col items-center justify-center py-1 px-2.5 bg-violet-600/30 text-violet-300 border border-violet-500/50 rounded-xl min-w-[54px] animate-pulse"
          >
            <Sliders size={17} />
            <span className="text-[9px] mt-0.5 font-bold">Edit</span>
          </button>
        ) : null}
      </footer>

      {/* 4. BOTTOM SHEET DRAWERS */}
      <MobileBottomSheet
        isOpen={Boolean(activeDrawer)}
        onClose={() => setActiveDrawer(null)}
        title={
          activeDrawer === 'ai-tools'
            ? 'AI Design Studio'
            : activeDrawer === 'templates'
            ? 'Templates Gallery'
            : activeDrawer === 'elements'
            ? 'Geometric & Abstract Elements'
            : activeDrawer === 'text'
            ? 'Add Typography'
            : activeDrawer === 'draw'
            ? 'Draw & Sketch Brush'
            : activeDrawer === 'charts'
            ? 'Interactive Charts'
            : activeDrawer === 'tables'
            ? 'Table Generator'
            : activeDrawer === 'qr'
            ? 'QR Code Generator'
            : activeDrawer === 'images'
            ? 'Stock & Media Uploads'
            : activeDrawer === 'background'
            ? 'Background Studio'
            : activeDrawer === 'brand-kit'
            ? 'Brand Kit'
            : activeDrawer === 'resize'
            ? 'Canvas Dimensions'
            : activeDrawer === 'comments'
            ? 'Design Feedback'
            : 'Layers'
        }
      >
        {activeDrawer === 'ai-tools' && (
          <AiToolsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elements={project.elements}
            selectedElement={selectedElement}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
            onUpdateElement={onUpdateElement}
            onUpdateBackground={onUpdateCanvasBackground}
          />
        )}
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
        {activeDrawer === 'draw' && (
          <DrawDrawer
            brushType={brushType}
            brushColor={brushColor}
            brushSize={brushSize}
            activeTool={activeTool}
            onSetBrushType={setBrushType}
            onSetBrushColor={setBrushColor}
            onSetBrushSize={setBrushSize}
            onSelectTool={setActiveTool}
          />
        )}
        {activeDrawer === 'charts' && (
          <ChartsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elementsCount={project.elements.length}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
          />
        )}
        {activeDrawer === 'tables' && (
          <TablesDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elementsCount={project.elements.length}
            onAddElement={(el) => {
              onAddElement(el);
              setActiveDrawer(null);
              setSelectedId(el.id);
            }}
          />
        )}
        {activeDrawer === 'qr' && (
          <QrCodeDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elementsCount={project.elements.length}
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
        {activeDrawer === 'comments' && (
          <CommentsDrawer
            comments={project.comments}
            showComments={showComments}
            onToggleShowComments={() => setShowComments(!showComments)}
            onSelectComment={() => {}}
            onAddComment={onAddComment || (() => {})}
            onResolveComment={onResolveComment || (() => {})}
            onDeleteComment={onDeleteComment || (() => {})}
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

      {/* 5. FULL INSPECTOR BOTTOM SHEET */}
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
              {selectedElement.type === 'chart' && (
                <ChartSection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
              {selectedElement.type === 'table' && (
                <TableSection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
              {selectedElement.type === 'draw' && (
                <DrawSection
                  element={selectedElement as any}
                  onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
                />
              )}
              {selectedElement.type === 'qr-code' && (
                <QrCodeSection
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
