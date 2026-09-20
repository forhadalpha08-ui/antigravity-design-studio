import React, { useEffect } from 'react';
import { Project, CanvasElement, Template, CanvasBackground } from '../types/canvas';
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
}) => {
  const {
    activeTool,
    setActiveTool,
    activeDrawer,
    setActiveDrawer,
    selectedId,
    selectElement,
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
        if (selectedId) {
          e.preventDefault();
          onDeleteElement(selectedId);
          selectElement(null);
        }
        return;
      }

      // Deselect
      if (e.key === 'Escape') {
        selectElement(null);
        setActiveDrawer(null);
        return;
      }

      // Nudge with arrow keys
      if (selectedId && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
        const step = e.shiftKey ? 10 : 1;
        const target = project.elements.find((el) => el.id === selectedId);
        if (target) {
          let dx = 0;
          let dy = 0;
          if (e.key === 'ArrowLeft') dx = -step;
          if (e.key === 'ArrowRight') dx = step;
          if (e.key === 'ArrowUp') dy = -step;
          if (e.key === 'ArrowDown') dy = step;
          onUpdateElement(selectedId, { x: target.x + dx, y: target.y + dy }, false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, project.elements, onUndo, onRedo, onDuplicateElement, onDeleteElement, onUpdateElement, selectElement, setActiveDrawer]);

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

        {/* Sliding Left Drawer (if any active tool clicked) */}
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

        {/* Center Interactive Canvas Viewport */}
        <CanvasArea
          project={project}
          scale={scale}
          pan={pan}
          activeTool={activeTool}
          selectedId={selectedId}
          snapGuides={snapGuides}
          isPlayingAnimation={isPlayingAnimation}
          onScaleChange={setScale}
          onPanChange={setPan}
          onSelectElement={selectElement}
          onUpdateElement={onUpdateElement}
          onDuplicateElement={onDuplicateElement}
          onDeleteElement={onDeleteElement}
          onReorderLayer={onReorderLayer}
          onSetGuides={setSnapGuides}
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
