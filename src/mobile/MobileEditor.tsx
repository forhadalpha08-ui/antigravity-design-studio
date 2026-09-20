import React, { useState, useEffect } from 'react';
import { Project, CanvasElement, Template, CanvasBackground } from '../types/canvas';
import { CanvasRenderer } from '../editor/canvas/CanvasRenderer';
import { MobileBottomSheet } from './MobileBottomSheet';
import { TemplatesDrawer } from '../editor/drawers/TemplatesDrawer';
import { ElementsDrawer } from '../editor/drawers/ElementsDrawer';
import { TextDrawer } from '../editor/drawers/TextDrawer';
import { ImagesDrawer } from '../editor/drawers/ImagesDrawer';
import { BackgroundDrawer } from '../editor/drawers/BackgroundDrawer';
import { LayersDrawer } from '../editor/drawers/LayersDrawer';
import { PositionLayoutSection } from '../editor/inspector/PositionLayoutSection';
import { TypographySection } from '../editor/inspector/TypographySection';
import { AppearanceSection } from '../editor/inspector/AppearanceSection';
import { ImageSection } from '../editor/inspector/ImageSection';
import { EffectsSection } from '../editor/inspector/EffectsSection';
import { AnimationSection } from '../editor/inspector/AnimationSection';
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
  Layers,
  Sliders,
} from 'lucide-react';

interface MobileEditorProps {
  project: Project;
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
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onUpdateBackground: (bg: CanvasBackground) => void;
}

export const MobileEditor: React.FC<MobileEditorProps> = ({
  project,
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
  onUpdateBackground,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'style' | 'font' | 'position' | 'effects' | 'motion'>('style');

  // Compute scale for mobile screen width
  const [mobileScale, setMobileScale] = useState(0.35);

  useEffect(() => {
    const updateMobileScale = () => {
      const screenW = window.innerWidth - 32;
      const screenH = window.innerHeight - 200;
      const s = Math.min(screenW / project.width, screenH / project.height);
      setMobileScale(Math.max(0.18, s));
    };
    updateMobileScale();
    window.addEventListener('resize', updateMobileScale);
    return () => window.removeEventListener('resize', updateMobileScale);
  }, [project.width, project.height]);

  const selectedElement = project.elements.find((el) => el.id === selectedId);

  const handleSelect = (id: string) => {
    setSelectedId(id || null);
    if (id) {
      setIsInspectorOpen(true);
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen bg-[#0a0a0f] select-none overflow-hidden relative">
      {/* 1. TOP BAR */}
      <header className="h-14 w-full bg-[#111218] border-b border-neutral-800 flex items-center justify-between px-3 z-30">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onBack}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg active:bg-neutral-800"
          >
            <ChevronLeft size={20} />
          </button>
          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent text-xs font-semibold text-white outline-none w-28 truncate"
          />
        </div>

        {/* Center: Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            disabled={!canUndo}
            onClick={onUndo}
            className="p-1.5 disabled:opacity-30 text-neutral-300 hover:text-white"
          >
            <Undo2 size={16} />
          </button>
          <button
            disabled={!canRedo}
            onClick={onRedo}
            className="p-1.5 disabled:opacity-30 text-neutral-300 hover:text-white"
          >
            <Redo2 size={16} />
          </button>
        </div>

        {/* Right: Preview & Export */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPresentation}
            className="p-2 text-neutral-300 hover:text-white rounded-lg"
          >
            <Play size={16} className="text-violet-400" />
          </button>
          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 active:bg-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-violet-600/30"
          >
            <Download size={13} />
            <span>Export</span>
          </button>
        </div>
      </header>

      {/* 2. CENTER CANVAS VIEWPORT */}
      <main
        className="flex-1 w-full overflow-hidden flex items-center justify-center p-4 bg-[#08090d]"
        onClick={() => {
          setSelectedId(null);
          setIsInspectorOpen(false);
        }}
      >
        <div
          className="shadow-2xl origin-center will-change-transform"
          style={{
            transform: `scale(${mobileScale})`,
            width: `${project.width}px`,
            height: `${project.height}px`,
          }}
        >
          <CanvasRenderer
            project={project}
            selectedId={selectedId}
            onSelectElement={(id) => handleSelect(id)}
            onUpdateElement={onUpdateElement}
          />
        </div>
      </main>

      {/* 3. FLOATING BOTTOM TOOLBAR */}
      <footer className="fixed bottom-4 left-4 right-4 z-40 bg-neutral-900/95 border border-neutral-700/80 backdrop-blur-xl rounded-2xl shadow-2xl p-2 flex items-center justify-around">
        <button
          onClick={() => setActiveDrawer('templates')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <LayoutTemplate size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Templates</span>
        </button>

        <button
          onClick={() => setActiveDrawer('elements')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <Shapes size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Elements</span>
        </button>

        <button
          onClick={() => setActiveDrawer('text')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <Type size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Text</span>
        </button>

        <button
          onClick={() => setActiveDrawer('images')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <ImageIcon size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Images</span>
        </button>

        <button
          onClick={() => setActiveDrawer('background')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <Sparkles size={18} />
          <span className="text-[10px] mt-0.5 font-medium">BG Studio</span>
        </button>

        <button
          onClick={() => setActiveDrawer('layers')}
          className="flex flex-col items-center justify-center p-1 text-neutral-400 active:text-violet-400"
        >
          <Layers size={18} />
          <span className="text-[10px] mt-0.5 font-medium">Layers</span>
        </button>

        {selectedElement && (
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="flex flex-col items-center justify-center p-1 text-violet-400 font-bold"
          >
            <Sliders size={18} />
            <span className="text-[10px] mt-0.5">Edit</span>
          </button>
        )}
      </footer>

      {/* 4. DRAWER BOTTOM SHEET (For picking items) */}
      <MobileBottomSheet
        isOpen={activeDrawer !== null}
        onClose={() => setActiveDrawer(null)}
        title={
          activeDrawer === 'templates'
            ? 'Select Template'
            : activeDrawer === 'elements'
            ? 'Add Shape or Icon'
            : activeDrawer === 'text'
            ? 'Add Typography'
            : activeDrawer === 'images'
            ? 'Photos & Uploads'
            : activeDrawer === 'background'
            ? 'Background Studio'
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
            }}
          />
        )}
        {activeDrawer === 'background' && (
          <BackgroundDrawer
            currentBackground={project.background}
            onUpdateBackground={onUpdateBackground}
          />
        )}
        {activeDrawer === 'layers' && (
          <LayersDrawer
            elements={project.elements}
            selectedId={selectedId}
            onSelectElement={(id) => {
              setSelectedId(id);
              setActiveDrawer(null);
              setIsInspectorOpen(true);
            }}
            onUpdateElement={onUpdateElement}
            onDuplicateElement={onDuplicateElement}
            onDeleteElement={onDeleteElement}
            onReorderLayer={onReorderLayer}
          />
        )}
      </MobileBottomSheet>

      {/* 5. INSPECTOR BOTTOM SHEET (When an element is selected) */}
      {selectedElement && (
        <MobileBottomSheet
          isOpen={isInspectorOpen}
          onClose={() => setIsInspectorOpen(false)}
          title={`Edit ${selectedElement.name || selectedElement.type}`}
        >
          {/* Inspector Tabs */}
          <div className="flex gap-1.5 border-b border-neutral-800 pb-2 mb-4 overflow-x-auto text-xs">
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
              Position
            </button>
            <button
              onClick={() => setInspectorTab('effects')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'effects'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Effects
            </button>
            <button
              onClick={() => setInspectorTab('motion')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
                inspectorTab === 'motion'
                  ? 'bg-violet-600 text-white'
                  : 'text-neutral-400 bg-neutral-900'
              }`}
            >
              Motion
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
      )}
    </div>
  );
};
