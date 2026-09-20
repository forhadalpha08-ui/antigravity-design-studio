import React, { useEffect } from 'react';
import { Project, CanvasElement, Template, CanvasBackground, CommentThread } from '../types/canvas';
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
import { AiToolsDrawer } from './drawers/AiToolsDrawer';
import { DrawDrawer } from './drawers/DrawDrawer';
import { ChartsDrawer } from './drawers/ChartsDrawer';
import { TablesDrawer } from './drawers/TablesDrawer';
import { QrCodeDrawer } from './drawers/QrCodeDrawer';
import { CommentsDrawer } from './drawers/CommentsDrawer';
import { SaveStatus } from '../store/useProjectStore';
import { useEditorState } from '../store/useEditorStore';
import { useBrandKitState } from '../store/useBrandKitStore';
import { generateId } from '../utils/id';

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
  onGroupElements?: (ids: string[]) => void;
  onUngroupElements?: (groupId: string) => void;
  onAlignElements?: (ids: string[], type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistributeElements?: (ids: string[], axis: 'horizontal' | 'vertical') => void;
  onAddComment?: (comment: CommentThread) => void;
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
  onDistributeElements,
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
    setSelection,
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
    brushType,
    setBrushType,
    brushColor,
    setBrushColor,
    brushSize,
    setBrushSize,
    showComments,
    setShowComments,
  } = useEditorState();

  const { brandKit, addColor, removeColor, updateFonts } = useBrandKitState();

  const selectedElement = project.elements.find((el) => el.id === selectedId) || null;

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Group: Ctrl+G / Cmd+G
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && !e.shiftKey) {
        e.preventDefault();
        if (selectedIds.length > 1 && onGroupElements) {
          onGroupElements(selectedIds);
        }
        return;
      }

      // Ungroup: Ctrl+Shift+G / Cmd+Shift+G
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g' && e.shiftKey) {
        e.preventDefault();
        if (selectedElement?.groupId && onUngroupElements) {
          onUngroupElements(selectedElement.groupId);
        }
        return;
      }

      // Undo / Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          onRedo();
        } else {
          e.preventDefault();
          onUndo();
        }
        return;
      }

      // Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedId) onDuplicateElement(selectedId);
        return;
      }

      // Delete
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          selectedIds.forEach((id) => onDeleteElement(id));
          clearSelection();
        } else if (selectedId) {
          e.preventDefault();
          onDeleteElement(selectedId);
          selectElement(null);
        }
        return;
      }

      // Deselect
      if (e.key === 'Escape') {
        clearSelection();
        selectElement(null);
        setActiveDrawer(null);
        return;
      }

      // Tool shortcuts
      if (e.key.toLowerCase() === 'v' && !e.ctrlKey && !e.metaKey) {
        setActiveTool('select');
      } else if (e.key.toLowerCase() === 'h' && !e.ctrlKey && !e.metaKey) {
        setActiveTool('hand');
      } else if (e.key.toLowerCase() === 'p' && !e.ctrlKey && !e.metaKey) {
        setActiveTool('draw');
        setActiveDrawer('draw');
      }

      // Nudge with arrow keys
      if (selectedId && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const targetEl = project.elements.find((el) => el.id === selectedId);
        if (targetEl) {
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;
          onUpdateElement(selectedId, { x: targetEl.x + dx, y: targetEl.y + dy }, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedId,
    selectedIds,
    selectedElement,
    project.elements,
    onUndo,
    onRedo,
    onDuplicateElement,
    onDeleteElement,
    onUpdateElement,
    selectElement,
    clearSelection,
    setActiveDrawer,
    setActiveTool,
    onGroupElements,
    onUngroupElements,
  ]);

  const handleAddCommentAtCoords = (x: number, y: number) => {
    const text = window.prompt('Enter comment or design feedback:');
    if (text && text.trim() && onAddComment) {
      onAddComment({
        id: generateId('cmt'),
        x,
        y,
        author: 'Designer',
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
        onResetZoom={resetView}
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

        {/* Sliding Left Drawers */}
        {activeDrawer === 'ai-tools' && (
          <AiToolsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            elements={project.elements}
            selectedElement={selectedElement}
            onAddElement={onAddElement}
            onUpdateElement={onUpdateElement}
            onUpdateBackground={onUpdateCanvasBackground}
          />
        )}
        {activeDrawer === 'templates' && (
          <TemplatesDrawer onSelectTemplate={onSelectTemplate} />
        )}
        {activeDrawer === 'elements' && (
          <ElementsDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={onAddElement}
          />
        )}
        {activeDrawer === 'text' && (
          <TextDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={onAddElement}
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
            onAddElement={onAddElement}
          />
        )}
        {activeDrawer === 'tables' && (
          <TablesDrawer
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
        {activeDrawer === 'images' && (
          <ImagesDrawer
            canvasWidth={project.width}
            canvasHeight={project.height}
            onAddElement={onAddElement}
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
            onSelectElement={selectElement}
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
            onSelectComment={(id) => {}}
            onAddComment={onAddComment || (() => {})}
            onResolveComment={onResolveComment || (() => {})}
            onDeleteComment={onDeleteComment || (() => {})}
          />
        )}

        {/* Center Interactive Canvas Viewport */}
        <CanvasArea
          project={project}
          scale={scale}
          pan={pan}
          activeTool={activeTool}
          selectedId={selectedId}
          selectedIds={selectedIds}
          snapGuides={snapGuides}
          isPlayingAnimation={isPlayingAnimation}
          brushType={brushType}
          brushColor={brushColor}
          brushSize={brushSize}
          showComments={showComments}
          onScaleChange={setScale}
          onPanChange={setPan}
          onSelectElement={(id) => selectElement(id)}
          onSetSelection={setSelection}
          onUpdateElement={onUpdateElement}
          onAddElement={onAddElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          onReorderLayer={onReorderLayer}
          onSetGuides={setSnapGuides}
          onGroupElements={onGroupElements}
          onUngroupElements={onUngroupElements}
          onAlignElements={onAlignElements}
          onAddComment={handleAddCommentAtCoords}
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

      {/* 3. OPTIONAL BOTTOM TIMELINE BAR */}
      <TimelineBar
        isPlaying={isPlayingAnimation}
        onTogglePlay={playAnimations}
        onReset={() => {}}
      />
    </div>
  );
};
