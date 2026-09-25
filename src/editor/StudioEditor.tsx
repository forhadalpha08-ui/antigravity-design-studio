import React, { useEffect, useState } from 'react';
import { Project, CanvasElement, Template, CanvasBackground, CommentThread, CommentReply } from '../types/canvas';
import { EditorHeader } from './EditorHeader';
import { LeftSidebar } from './sidebar/LeftSidebar';
import { CanvasArea } from './canvas/CanvasArea';
import { InspectorPanel } from './inspector/InspectorPanel';
import { TimelineBar } from './timeline/TimelineBar';
import { TemplatesDrawer } from './drawers/TemplatesDrawer';
import { ElementsDrawer } from './drawers/ElementsDrawer';
import { TextDrawer } from './drawers/TextDrawer';
import { ImagesDrawer } from './drawers/ImagesDrawer';
import { BackgroundDrawer } from './drawers/BackgroundDrawer';
import { BrandKitDrawer } from './drawers/BrandKitDrawer';
import { LayersDrawer } from './drawers/LayersDrawer';
import { DrawDrawer } from './drawers/DrawDrawer';
import { ChartsDrawer } from './drawers/ChartsDrawer';
import { QrCodeDrawer } from './drawers/QrCodeDrawer';
import { TablesDrawer } from './drawers/TablesDrawer';
import { AiToolsDrawer } from './drawers/AiToolsDrawer';
import { CommentsDrawer } from './drawers/CommentsDrawer';
import { SaveStatus } from '../store/useProjectStore';
import { useEditorState } from '../store/useEditorStore';
import { useBrandKitState } from '../store/useBrandKitStore';

interface StudioEditorProps {
  project: Project;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBackToDashboard: () => void;
  onUpdateTitle: (title: string) => void;
  onOpenExportModal: () => void;
  onOpenPresentation: () => void;
  onSelectTemplate: (template: Template) => void;
  onAddElement: (element: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>, pushHistory?: boolean) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onUpdateCanvasSize: (w: number, h: number) => void;
  onUpdateCanvasBackground: (bg: CanvasBackground) => void;
  onApplyBrandKit: (brandKit: any) => void;
  // Optional advanced props passed from App.tsx
  onGroupElements?: (ids: string[]) => void;
  onUngroupElements?: (groupId: string) => void;
  onAlignElements?: (ids: string[], type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeElements?: (ids: string[], axis: 'horizontal' | 'vertical') => void;
  onAddComment?: (comment: any) => void;
  onResolveComment?: (id: string) => void;
  onDeleteComment?: (id: string) => void;
}

export const StudioEditor: React.FC<StudioEditorProps> = ({
  project,
  saveStatus,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBackToDashboard,
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
  onAddComment,
  onResolveComment,
  onDeleteComment,
}) => {
  const {
    activeTool,
    setActiveTool,
    activeDrawer,
    setActiveDrawer,
    selectedId,
    selectedIds,
    selectElement,
    selectMultiple,
    clearSelection,
    scale,
    setScale,
    pan,
    setPan,
    resetView,
    zoomIn,
    zoomOut,
    snapGuides,
    setSnapGuides,
    isPlayingAnimation,
    playAnimations,
  } = useEditorState();

  const { brandKit, addColor, removeColor, updateFonts } = useBrandKitState();

  // Draw tool state
  const [brushType, setBrushType] = useState<any>('pen');
  const [brushColor, setBrushColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(4);

  // Local comments state (merged with project)
  const [localComments, setLocalComments] = useState<CommentThread[]>(project.comments || []);
  const [showComments, setShowComments] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

  // Fit to screen callback registered from CanvasArea
  const fitToScreenRef = React.useRef<(() => void) | null>(null);

  const handleFitToScreen = () => {
    if (fitToScreenRef.current) {
      fitToScreenRef.current();
    } else {
      resetView();
    }
  };

  const selectedElement = project.elements.find((el) => el.id === selectedId) || null;

  // ─── selectElement wrapper that supports isMulti flag ──────────
  const handleSelectElement = (id: string | null, isMulti?: boolean) => {
    if (!id) {
      clearSelection();
      return;
    }
    if (isMulti) {
      // toggle the element in/out of selection
      if (selectedIds.includes(id)) {
        selectMultiple(selectedIds.filter((i) => i !== id));
      } else {
        selectMultiple([...selectedIds, id]);
      }
    } else {
      selectElement(id);
    }
  };

  // ─── Keyboard Shortcuts ────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) return;

      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        handleFitToScreen();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) { e.preventDefault(); onRedo(); }
        else { e.preventDefault(); onUndo(); }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId) onDuplicateElement(selectedId);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        selectMultiple(project.elements.map((el) => el.id));
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          // ungroup — find groupId of selected element
        } else if (selectedIds.length > 1) {
          onGroupElements?.(selectedIds);
        }
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedId) {
          e.preventDefault();
          onDeleteElement(selectedId);
          clearSelection();
        }
        return;
      }
      if (e.key === 'Escape') {
        clearSelection();
        setActiveDrawer(null);
        return;
      }
      if (e.key.toLowerCase() === 'd' && !e.ctrlKey && !e.metaKey) {
        setActiveTool('draw');
        setActiveDrawer('drawing');
        return;
      }
      if (selectedId && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const el = project.elements.find((el) => el.id === selectedId);
        if (el) {
          let dx = 0, dy = 0;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;
          onUpdateElement(selectedId, { x: el.x + dx, y: el.y + dy }, false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, selectedIds, project.elements, onUndo, onRedo, onDuplicateElement, onDeleteElement, onUpdateElement, selectElement, selectMultiple, clearSelection, setActiveDrawer, setActiveTool, onGroupElements]);

  // ─── Comment handlers ──────────────────────────────────────────
  const handleAddComment = (comment: CommentThread) => {
    setLocalComments((prev) => [...prev, comment]);
    onAddComment?.(comment);
  };
  const handleResolveComment = (id: string) => {
    setLocalComments((prev) =>
      prev.map((c) => c.id === id ? { ...c, resolved: !c.resolved } : c)
    );
    onResolveComment?.(id);
  };
  const handleDeleteComment = (id: string) => {
    setLocalComments((prev) => prev.filter((c) => c.id !== id));
    onDeleteComment?.(id);
  };
  const handleAddReply = (threadId: string, reply: CommentReply) => {
    setLocalComments((prev) =>
      prev.map((c) =>
        c.id === threadId ? { ...c, replies: [...(c.replies || []), reply] } : c
      )
    );
  };

  // ─── Batch update for AI layout ────────────────────────────────
  const handleBatchUpdateElements = (updatedElements: CanvasElement[]) => {
    updatedElements.forEach((el) => {
      onUpdateElement(el.id, { x: el.x, y: el.y, width: el.width, height: el.height });
    });
  };

  const projectWithComments = { ...project, comments: localComments };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#0a0a0f] select-none overflow-hidden">
      {/* 1. TOP BAR */}
      <EditorHeader
        project={project}
        saveStatus={saveStatus}
        canUndo={canUndo}
        canRedo={canRedo}
        scale={scale}
        onUndo={onUndo}
        onRedo={onRedo}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={handleFitToScreen}
        onBackToDashboard={onBackToDashboard}
        onUpdateTitle={onUpdateTitle}
        onOpenExportModal={onOpenExportModal}
        onOpenPresentation={onOpenPresentation}
        onPlayAnimation={playAnimations}
      />

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Toolbar Strip */}
        <LeftSidebar
          activeDrawer={activeDrawer}
          activeTool={activeTool}
          onSelectDrawer={setActiveDrawer}
          onSelectTool={setActiveTool}
        />

        {/* ── Sliding Left Drawers ── */}
        {activeDrawer === 'templates' && <TemplatesDrawer onSelectTemplate={onSelectTemplate} />}
        {activeDrawer === 'elements' && (
          <ElementsDrawer canvasWidth={project.width} canvasHeight={project.height} onAddElement={onAddElement} />
        )}
        {activeDrawer === 'text' && (
          <TextDrawer canvasWidth={project.width} canvasHeight={project.height} onAddElement={onAddElement} />
        )}
        {activeDrawer === 'images' && (
          <ImagesDrawer canvasWidth={project.width} canvasHeight={project.height} onAddElement={onAddElement} />
        )}
        {activeDrawer === 'background' && (
          <BackgroundDrawer currentBackground={project.background} onUpdateBackground={onUpdateCanvasBackground} />
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
            onSelectElement={selectElement}
            onUpdateElement={onUpdateElement}
            onDuplicateElement={onDuplicateElement}
            onDeleteElement={onDeleteElement}
            onReorderLayer={onReorderLayer}
          />
        )}
        {activeDrawer === 'drawing' && (
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
            onAddElement={onAddElement}
          />
        )}
        {activeDrawer === 'qr' && (
          <QrCodeDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elementsCount={project.elements.length}
            onAddElement={onAddElement}
          />
        )}
        {activeDrawer === 'table' && (
          <TablesDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elementsCount={project.elements.length}
            onAddElement={onAddElement}
          />
        )}
        {activeDrawer === 'ai' && (
          <AiToolsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elements={project.elements}
            selectedElement={selectedElement}
            onAddElement={onAddElement}
            onUpdateElement={onUpdateElement}
            onUpdateBackground={onUpdateCanvasBackground}
            onBatchUpdateElements={handleBatchUpdateElements}
          />
        )}
        {activeDrawer === 'comments' && (
          <CommentsDrawer
            comments={localComments}
            activeCommentId={activeCommentId}
            showComments={showComments}
            onToggleShowComments={() => setShowComments((v) => !v)}
            onSelectComment={setActiveCommentId}
            onAddComment={handleAddComment}
            onResolveComment={handleResolveComment}
            onDeleteComment={handleDeleteComment}
            onAddReply={handleAddReply}
          />
        )}

        {/* Center Interactive Canvas Viewport */}
        <CanvasArea
          project={projectWithComments}
          scale={scale}
          pan={pan}
          activeTool={activeTool}
          selectedId={selectedId}
          selectedIds={selectedIds}
          snapGuides={snapGuides}
          isPlayingAnimation={isPlayingAnimation}
          showComments={showComments}
          activeCommentId={activeCommentId}
          brushType={brushType}
          brushColor={brushColor}
          brushSize={brushSize}
          onScaleChange={setScale}
          onPanChange={setPan}
          onSelectElement={handleSelectElement}
          onSetSelection={selectMultiple}
          onUpdateElement={onUpdateElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          onReorderLayer={onReorderLayer}
          onSetGuides={setSnapGuides}
          onSelectComment={setActiveCommentId}
          onGroupElements={onGroupElements}
          onUngroupElements={onUngroupElements}
          onAlignElements={onAlignElements}
          onRegisterFitToScreen={(fn) => {
            fitToScreenRef.current = fn;
          }}
        />

        {/* Right Inspector Panel */}
        <InspectorPanel
          project={project}
          selectedId={selectedId}
          onUpdateElement={onUpdateElement}
          onDeleteElement={onDeleteElement}
          onUpdateCanvasSize={onUpdateCanvasSize}
          onUpdateCanvasBackground={onUpdateCanvasBackground}
          onPlayAnimation={playAnimations}
        />
      </div>

      {/* 3. BOTTOM TIMELINE BAR */}
      <TimelineBar
        isPlaying={isPlayingAnimation}
        onTogglePlay={playAnimations}
        onReset={() => {}}
      />
    </div>
  );
};
