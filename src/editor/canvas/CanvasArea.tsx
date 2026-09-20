import React, { useRef, useState } from 'react';
import { Project, CanvasElement } from '../../types/canvas';
import { CanvasRenderer } from './CanvasRenderer';
import { TransformControls } from './TransformControls';
import { QuickElementBar } from './QuickElementBar';
import { SnapGuide } from '../../utils/math';
import { ToolType } from '../../store/useEditorStore';

interface CanvasAreaProps {
  project: Project;
  scale: number;
  pan: { x: number; y: number };
  activeTool: ToolType;
  selectedId: string | null;
  snapGuides: SnapGuide[];
  isPlayingAnimation?: boolean;
  onScaleChange: (scale: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>, pushHistory?: boolean) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onSetGuides: (guides: SnapGuide[]) => void;
  onOpenEdit?: () => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  project,
  scale,
  pan,
  activeTool,
  selectedId,
  snapGuides,
  isPlayingAnimation,
  onScaleChange,
  onPanChange,
  onSelectElement,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderLayer,
  onSetGuides,
  onOpenEdit,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  const selectedElement = project.elements.find((el) => el.id === selectedId);

  // Wheel zoom / pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const nextScale = Math.min(Math.max(scale * zoomFactor, 0.15), 3);
      onScaleChange(nextScale);
    } else {
      onPanChange({
        x: pan.x - e.deltaX * 0.8,
        y: pan.y - e.deltaY * 0.8,
      });
    }
  };

  // Middle click or Hand tool drag
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || activeTool === 'hand') {
      e.preventDefault();
      setIsPanning(true);
      panStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        panX: pan.x,
        panY: pan.y,
      };

      const onMouseMove = (ev: MouseEvent) => {
        const dx = ev.clientX - panStartRef.current.clientX;
        const dy = ev.clientY - panStartRef.current.clientY;
        onPanChange({
          x: panStartRef.current.panX + dx,
          y: panStartRef.current.panY + dy,
        });
      };

      const onMouseUp = () => {
        setIsPanning(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  };

  // Touch panning and pinch zoom
  const touchStartRef = useRef<{
    dist: number;
    scaleStart: number;
    panX: number;
    panY: number;
    clientX: number;
    clientY: number;
  } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      if (activeTool === 'hand') {
        const touch = e.touches[0];
        setIsPanning(true);
        panStartRef.current = {
          clientX: touch.clientX,
          clientY: touch.clientY,
          panX: pan.x,
          panY: pan.y,
        };
      }
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      touchStartRef.current = {
        dist,
        scaleStart: scale,
        panX: pan.x,
        panY: pan.y,
        clientX: midX,
        clientY: midY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && (isPanning || activeTool === 'hand')) {
      const touch = e.touches[0];
      const dx = touch.clientX - panStartRef.current.clientX;
      const dy = touch.clientY - panStartRef.current.clientY;
      onPanChange({
        x: panStartRef.current.panX + dx,
        y: panStartRef.current.panY + dy,
      });
    } else if (e.touches.length === 2 && touchStartRef.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const factor = dist / touchStartRef.current.dist;
      const nextScale = Math.min(Math.max(touchStartRef.current.scaleStart * factor, 0.12), 4);
      onScaleChange(nextScale);

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const panDx = midX - touchStartRef.current.clientX;
      const panDy = midY - touchStartRef.current.clientY;
      onPanChange({
        x: touchStartRef.current.panX + panDx,
        y: touchStartRef.current.panY + panDy,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    touchStartRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 w-full h-full overflow-hidden bg-[#0c0d12] flex items-center justify-center ${
        activeTool === 'hand' || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectElement(null);
        }
      }}
    >
      {/* Background Subtle Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Viewport Transform Container */}
      <div
        className="relative transition-transform duration-75 origin-center will-change-transform shadow-2xl"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
        }}
      >
        {/* Render Canvas Elements */}
        <CanvasRenderer
          project={project}
          selectedId={selectedId}
          onSelectElement={(id) => onSelectElement(id || null)}
          onUpdateElement={onUpdateElement}
          isPlayingAnimation={isPlayingAnimation}
        />

        {/* Selected Element Transform Box */}
        {selectedElement && !selectedElement.hidden && (
          <>
            <TransformControls
              element={selectedElement}
              scale={scale}
              canvasWidth={project.width}
              canvasHeight={project.height}
              onUpdate={(updates, pushHistory) =>
                onUpdateElement(selectedElement.id, updates, pushHistory)
              }
              onSetGuides={onSetGuides}
            />

            <QuickElementBar
              element={selectedElement}
              scale={scale}
              onDuplicate={onDuplicateElement}
              onDelete={onDeleteElement}
              onToggleLock={(id) =>
                onUpdateElement(id, { locked: !selectedElement.locked })
              }
              onReorder={onReorderLayer}
              onOpenEdit={onOpenEdit}
            />
          </>
        )}

        {/* Smart Snapping Alignment Guides */}
        {snapGuides.map((guide, idx) => (
          <div
            key={idx}
            className="absolute pointer-events-none z-[10001]"
            style={
              guide.type === 'x'
                ? {
                    left: `${guide.position}px`,
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    backgroundColor: '#8b5cf6',
                    boxShadow: '0 0 4px #8b5cf6',
                  }
                : {
                    top: `${guide.position}px`,
                    left: 0,
                    right: 0,
                    height: '1px',
                    backgroundColor: '#8b5cf6',
                    boxShadow: '0 0 4px #8b5cf6',
                  }
            }
          />
        ))}
      </div>
    </div>
  );
};
