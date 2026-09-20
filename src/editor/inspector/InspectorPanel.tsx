import React from 'react';
import { Project, CanvasElement, TextElement, ShapeElement, ImageElement, CanvasBackground } from '../../types/canvas';
import { PositionLayoutSection } from './PositionLayoutSection';
import { TypographySection } from './TypographySection';
import { AppearanceSection } from './AppearanceSection';
import { ImageSection } from './ImageSection';
import { EffectsSection } from './EffectsSection';
import { AnimationSection } from './AnimationSection';
import { ChartSection } from './ChartSection';
import { TableSection } from './TableSection';
import { DrawSection } from './DrawSection';
import { QrCodeSection } from './QrCodeSection';
import { CANVAS_PRESETS } from '../../utils/presetSizes';
import { Lock, Unlock, Trash2, Sliders } from 'lucide-react';

interface InspectorPanelProps {
  project: Project;
  selectedId: string | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onUpdateCanvasSize: (w: number, h: number) => void;
  onUpdateCanvasBackground: (bg: CanvasBackground) => void;
  onPlayAnimation: () => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  project,
  selectedId,
  onUpdateElement,
  onDeleteElement,
  onUpdateCanvasSize,
  onUpdateCanvasBackground,
  onPlayAnimation,
}) => {
  const selectedElement = project.elements.find((el) => el.id === selectedId);

  // If no element selected, show Canvas properties
  if (!selectedElement) {
    return (
      <aside className="w-72 h-full bg-[#111218] border-l border-neutral-800 flex flex-col z-10 select-none overflow-y-auto">
        <div className="p-4 border-b border-neutral-800 flex items-center gap-2">
          <Sliders size={16} className="text-violet-400" />
          <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
            Canvas Properties
          </h2>
        </div>

        <div className="p-4 space-y-5">
          {/* Canvas Size */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Canvas Dimensions
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-neutral-900 border border-neutral-800 rounded p-2">
                <span className="text-neutral-500 block text-[10px]">WIDTH</span>
                <input
                  type="number"
                  value={project.width}
                  onChange={(e) =>
                    onUpdateCanvasSize(Number(e.target.value), project.height)
                  }
                  className="w-full bg-transparent outline-none text-neutral-200 font-mono mt-0.5"
                />
              </div>
              <div className="bg-neutral-900 border border-neutral-800 rounded p-2">
                <span className="text-neutral-500 block text-[10px]">HEIGHT</span>
                <input
                  type="number"
                  value={project.height}
                  onChange={(e) =>
                    onUpdateCanvasSize(project.width, Number(e.target.value))
                  }
                  className="w-full bg-transparent outline-none text-neutral-200 font-mono mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Quick Preset Resizing */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Popular Presets
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {CANVAS_PRESETS.slice(0, 6).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => onUpdateCanvasSize(preset.width, preset.height)}
                  className="p-2 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded text-left transition-colors"
                >
                  <div className="text-[11px] text-neutral-300 font-medium truncate">
                    {preset.name}
                  </div>
                  <div className="text-[9px] text-neutral-500 font-mono">
                    {preset.width} × {preset.height}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Background Color */}
          <div className="space-y-2 pt-2 border-t border-neutral-800">
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Background Color
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={project.background.color || '#0b0c10'}
                onChange={(e) =>
                  onUpdateCanvasBackground({
                    ...project.background,
                    color: e.target.value,
                  })
                }
                className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={project.background.color || '#0b0c10'}
                onChange={(e) =>
                  onUpdateCanvasBackground({
                    ...project.background,
                    color: e.target.value,
                  })
                }
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-neutral-200 uppercase font-mono"
              />
            </div>
          </div>

          {/* Layer Summary */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
              <span>Elements in Canvas</span>
              <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-mono">
                {project.elements.length}
              </span>
            </div>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Click any element on the canvas to inspect its typography, shapes, gradient fills, and animations.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // An element is selected: show properties
  return (
    <aside className="w-72 h-full bg-[#111218] border-l border-neutral-800 flex flex-col z-10 select-none overflow-y-auto">
      {/* Selected Element Header */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-1.5 py-0.5 bg-violet-600/30 border border-violet-500/40 text-violet-300 text-[10px] font-semibold uppercase rounded">
            {selectedElement.type}
          </span>
          <input
            type="text"
            value={selectedElement.name}
            onChange={(e) =>
              onUpdateElement(selectedElement.id, { name: e.target.value })
            }
            className="bg-transparent text-xs text-neutral-200 font-medium outline-none truncate"
          />
        </div>

        <div className="flex items-center gap-1">
          <button
            title={selectedElement.locked ? 'Unlock Element' : 'Lock Element'}
            onClick={() =>
              onUpdateElement(selectedElement.id, {
                locked: !selectedElement.locked,
              })
            }
            className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
          >
            {selectedElement.locked ? (
              <Lock size={15} className="text-amber-400" />
            ) : (
              <Unlock size={15} />
            )}
          </button>
          <button
            title="Delete Element"
            onClick={() => onDeleteElement(selectedElement.id)}
            className="p-1 hover:bg-red-500/20 rounded text-neutral-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Transform & Position */}
        <PositionLayoutSection
          element={selectedElement}
          canvasWidth={project.width}
          canvasHeight={project.height}
          onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
        />

        {/* Text specific inspector */}
        {selectedElement.type === 'text' && (
          <TypographySection
            element={selectedElement as TextElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Shape specific inspector */}
        {selectedElement.type === 'shape' && (
          <AppearanceSection
            element={selectedElement as ShapeElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Image specific inspector */}
        {selectedElement.type === 'image' && (
          <ImageSection
            element={selectedElement as ImageElement}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Chart specific inspector */}
        {selectedElement.type === 'chart' && (
          <ChartSection
            element={selectedElement as any}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Table specific inspector */}
        {selectedElement.type === 'table' && (
          <TableSection
            element={selectedElement as any}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Draw specific inspector */}
        {selectedElement.type === 'draw' && (
          <DrawSection
            element={selectedElement as any}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* QR Code specific inspector */}
        {selectedElement.type === 'qr-code' && (
          <QrCodeSection
            element={selectedElement as any}
            onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          />
        )}

        {/* Effects & Shadows */}
        <EffectsSection
          element={selectedElement}
          onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
        />

        {/* Motion & Animation */}
        <AnimationSection
          element={selectedElement}
          onUpdate={(updates) => onUpdateElement(selectedElement.id, updates)}
          onPlayAnimation={onPlayAnimation}
        />
      </div>
    </aside>
  );
};
