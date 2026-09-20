import React, { useRef, useState } from 'react';
import { Project, CanvasElement, BrushType, DrawPoint, DrawElement } from '../../types/canvas';
import { CanvasRenderer } from './CanvasRenderer';
import { TransformControls } from './TransformControls';
import { QuickElementBar } from './QuickElementBar';
import { SnapGuide } from '../../utils/math';
import { ToolType } from '../../store/useEditorStore';
import { pointsToSvgPath } from './renderers/RenderDraw';
import { generateId } from '../../utils/id';

interface CanvasAreaProps {
  project: Project;
  scale: number;
  pan: { x: number; y: number };
  activeTool: ToolType;
  selectedId: string | null;
  selectedIds?: string[];
  snapGuides: SnapGuide[];
  isPlayingAnimation?: boolean;
  brushType?: BrushType;
  brushColor?: string;
  brushSize?: number;
  showComments?: boolean;
  activeCommentId?: string | null;
  onScaleChange: (scale: number) => void;
  onPanChange: (pan: { x: number; y: number }) => void;
  onSelectElement: (id: string | null, isMulti?: boolean) => void;
  onSetSelection?: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>, pushHistory?: boolean) => void;
  onAddElement?: (element: CanvasElement) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onReorderLayer: (id: string, dir: 'up' | 'down' | 'top' | 'bottom') => void;
  onSetGuides: (guides: SnapGuide[]) => void;
  onOpenEdit?: () => void;
  onGroupElements?: (ids: string[]) => void;
  onUngroupElements?: (groupId: string) => void;
  onAlignElements?: (ids: string[], type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onAddComment?: (x: number, y: number) => void;
  onSelectComment?: (id: string) => void;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  project,
  scale,
  pan,
  activeTool,
  selectedId,
  selectedIds = [],
  snapGuides,
  isPlayingAnimation,
  brushType = 'pen',
  brushColor = '#8b5cf6',
  brushSize = 4,
  showComments = true,
  activeCommentId = null,
  onScaleChange,
  onPanChange,
  onSelectElement,
  onSetSelection,
  onUpdateElement,
  onAddElement,
  onDuplicateElement,
  onDeleteElement,
  onReorderLayer,
  onSetGuides,
  onOpenEdit,
  onGroupElements,
  onUngroupElements,
  onAlignElements,
  onAddComment,
  onSelectComment,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasBoxRef = useRef<HTMLDivElement>(null);

  // Panning state
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ clientX: number; clientY: number; panX: number; panY: number }>({
    clientX: 0,
    clientY: 0,
    panX: 0,
    panY: 0,
  });

  // Freehand Drawing State
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<DrawPoint[]>([]);

  // Marquee Selection State
  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    active: boolean;
  } | null>(null);

  // Multi-selection dragging
  const multiDragStartRef = useRef<{
    clientX: number;
    clientY: number;
    initialPositions: { id: string; x: number; y: number }[];
  } | null>(null);

  // Effective selected elements
  const effectiveSelectedIds = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : []);
  const selectedElements = project.elements.filter(
    (el) => effectiveSelectedIds.includes(el.id) && !el.hidden
  );
  const isMultiSelected = selectedElements.length > 1;
  const singleSelectedElement = selectedElements.length === 1 ? selectedElements[0] : null;

  // Multi-selection bounding box
  let multiBounds = { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 };
  if (isMultiSelected) {
    const minX = Math.min(...selectedElements.map((e) => e.x));
    const minY = Math.min(...selectedElements.map((e) => e.y));
    const maxX = Math.max(...selectedElements.map((e) => e.x + e.width));
    const maxY = Math.max(...selectedElements.map((e) => e.y + e.height));
    multiBounds = { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  // Converts viewport client coordinates to canvas coordinate space
  const getCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    if (!canvasBoxRef.current) return { x: 0, y: 0 };
    const rect = canvasBoxRef.current.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / scale,
      y: (clientY - rect.top) / scale,
    };
  };

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
      return;
    }

    // Comment Placement Tool
    if (activeTool === 'comment' && e.button === 0) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (
        coords.x >= 0 &&
        coords.x <= project.width &&
        coords.y >= 0 &&
        coords.y <= project.height
      ) {
        if (onAddComment) {
          onAddComment(Math.round(coords.x), Math.round(coords.y));
        }
      }
      return;
    }

    // Freehand Drawing Tool
    if (activeTool === 'draw' && e.button === 0) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      setIsDrawing(true);
      setCurrentDrawPoints([coords]);

      const onMouseMove = (ev: MouseEvent) => {
        const c = getCanvasCoords(ev.clientX, ev.clientY);
        setCurrentDrawPoints((prev) => [...prev, c]);
      };

      const onMouseUp = () => {
        setIsDrawing(false);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        setCurrentDrawPoints((points) => {
          if (points.length < 2 || !onAddElement) return [];

          const minX = Math.min(...points.map((p) => p.x));
          const minY = Math.min(...points.map((p) => p.y));
          const maxX = Math.max(...points.map((p) => p.x));
          const maxY = Math.max(...points.map((p) => p.y));
          const width = Math.max(20, Math.round(maxX - minX));
          const height = Math.max(20, Math.round(maxY - minY));

          // Normalize points relative to element top-left
          const normalizedPoints: DrawPoint[] = points.map((p) => ({
            x: Math.round((p.x - minX) * 10) / 10,
            y: Math.round((p.y - minY) * 10) / 10,
          }));

          const maxZ = project.elements.length > 0 ? Math.max(...project.elements.map((el) => el.zIndex)) : 0;
          const newDrawElement: DrawElement = {
            id: generateId('draw'),
            name: 'Drawing',
            type: 'draw',
            x: Math.round(minX),
            y: Math.round(minY),
            width,
            height,
            points: normalizedPoints,
            strokeColor: brushColor,
            strokeWidth: brushSize,
            brushType,
            opacity: 1,
            zIndex: maxZ + 1,
            rotation: 0,
            locked: false,
            hidden: false,
          };

          onAddElement(newDrawElement);
          return [];
        });
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return;
    }

    // Marquee Drag Selection (when clicking on background with select tool)
    if (activeTool === 'select' && e.button === 0 && e.target === e.currentTarget) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      setMarquee({
        startX: coords.x,
        startY: coords.y,
        currentX: coords.x,
        currentY: coords.y,
        active: true,
      });

      const onMouseMove = (ev: MouseEvent) => {
        const c = getCanvasCoords(ev.clientX, ev.clientY);
        setMarquee((prev) => (prev ? { ...prev, currentX: c.x, currentY: c.y } : null));
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);

        setMarquee((prev) => {
          if (!prev) return null;
          const x1 = Math.min(prev.startX, prev.currentX);
          const x2 = Math.max(prev.startX, prev.currentX);
          const y1 = Math.min(prev.startY, prev.currentY);
          const y2 = Math.max(prev.startY, prev.currentY);

          // If dragged more than 6px, select intersecting elements
          if (x2 - x1 > 6 || y2 - y1 > 6) {
            const hits = project.elements.filter(
              (el) =>
                !el.hidden &&
                el.x < x2 &&
                el.x + el.width > x1 &&
                el.y < y2 &&
                el.y + el.height > y1
            );
            if (onSetSelection) {
              onSetSelection(hits.map((h) => h.id));
            }
          } else {
            onSelectElement(null);
          }
          return null;
        });
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
      } else if (activeTool === 'draw') {
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        setIsDrawing(true);
        setCurrentDrawPoints([coords]);
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
    if (e.touches.length === 1) {
      if (isPanning || activeTool === 'hand') {
        const touch = e.touches[0];
        const dx = touch.clientX - panStartRef.current.clientX;
        const dy = touch.clientY - panStartRef.current.clientY;
        onPanChange({
          x: panStartRef.current.panX + dx,
          y: panStartRef.current.panY + dy,
        });
      } else if (isDrawing && activeTool === 'draw') {
        const touch = e.touches[0];
        const coords = getCanvasCoords(touch.clientX, touch.clientY);
        setCurrentDrawPoints((prev) => [...prev, coords]);
      }
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
    if (isDrawing && activeTool === 'draw') {
      setIsDrawing(false);
      if (currentDrawPoints.length >= 2 && onAddElement) {
        const minX = Math.min(...currentDrawPoints.map((p) => p.x));
        const minY = Math.min(...currentDrawPoints.map((p) => p.y));
        const maxX = Math.max(...currentDrawPoints.map((p) => p.x));
        const maxY = Math.max(...currentDrawPoints.map((p) => p.y));
        const width = Math.max(20, Math.round(maxX - minX));
        const height = Math.max(20, Math.round(maxY - minY));

        const normalizedPoints: DrawPoint[] = currentDrawPoints.map((p) => ({
          x: Math.round((p.x - minX) * 10) / 10,
          y: Math.round((p.y - minY) * 10) / 10,
        }));

        const maxZ = project.elements.length > 0 ? Math.max(...project.elements.map((el) => el.zIndex)) : 0;
        const newDrawElement: DrawElement = {
          id: generateId('draw'),
          name: 'Drawing',
          type: 'draw',
          x: Math.round(minX),
          y: Math.round(minY),
          width,
          height,
          points: normalizedPoints,
          strokeColor: brushColor,
          strokeWidth: brushSize,
          brushType,
          opacity: 1,
          zIndex: maxZ + 1,
          rotation: 0,
          locked: false,
          hidden: false,
        };

        onAddElement(newDrawElement);
      }
      setCurrentDrawPoints([]);
    }
    setIsPanning(false);
    touchStartRef.current = null;
  };

  // Multi-selection element drag handler
  const handleMultiDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    multiDragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      initialPositions: selectedElements.map((el) => ({ id: el.id, x: el.x, y: el.y })),
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!multiDragStartRef.current) return;
      const dx = (ev.clientX - multiDragStartRef.current.clientX) / scale;
      const dy = (ev.clientY - multiDragStartRef.current.clientY) / scale;

      multiDragStartRef.current.initialPositions.forEach((pos) => {
        onUpdateElement(pos.id, { x: Math.round(pos.x + dx), y: Math.round(pos.y + dy) }, false);
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      multiDragStartRef.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Handle element selection from renderer
  const handleSelectElementFromRenderer = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    const isShift = 'shiftKey' in e && e.shiftKey;

    if (!id) {
      onSelectElement(null, false);
      return;
    }

    const clickedEl = project.elements.find((el) => el.id === id);

    // If part of a group and not shift-clicking, select the entire group
    if (clickedEl?.groupId && onSetSelection && !isShift) {
      const groupMembers = project.elements
        .filter((el) => el.groupId === clickedEl.groupId)
        .map((el) => el.id);
      onSetSelection(groupMembers);
      return;
    }

    if (isShift && onSetSelection) {
      const current = selectedIds.length > 0 ? selectedIds : (selectedId ? [selectedId] : []);
      if (current.includes(id)) {
        onSetSelection(current.filter((item) => item !== id));
      } else {
        onSetSelection([...current, id]);
      }
    } else {
      onSelectElement(id, false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative flex-1 w-full h-full overflow-hidden bg-[#0c0d12] flex items-center justify-center ${
        activeTool === 'hand' || isPanning
          ? 'cursor-grab active:cursor-grabbing'
          : activeTool === 'draw'
          ? 'cursor-crosshair'
          : activeTool === 'comment'
          ? 'cursor-pointer'
          : 'cursor-default'
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
      {/* Background Subtle Dot Matrix Grid */}
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
        ref={canvasBoxRef}
        className="relative transition-transform duration-75 origin-center will-change-transform shadow-2xl"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
        }}
      >
        {/* Render Canvas Elements */}
        <CanvasRenderer
          project={project}
          selectedId={singleSelectedElement?.id || null}
          selectedIds={effectiveSelectedIds}
          onSelectElement={handleSelectElementFromRenderer}
          onUpdateElement={onUpdateElement}
          isPlayingAnimation={isPlayingAnimation}
          showComments={showComments}
          activeCommentId={activeCommentId}
          onSelectComment={onSelectComment}
        />

        {/* Live In-Progress Drawing Stroke Overlay */}
        {isDrawing && currentDrawPoints.length > 1 && (
          <div className="absolute inset-0 pointer-events-none z-[10005]">
            <svg
              viewBox={`0 0 ${project.width} ${project.height}`}
              className="w-full h-full overflow-visible"
            >
              <path
                d={pointsToSvgPath(currentDrawPoints)}
                fill="none"
                stroke={brushColor}
                strokeWidth={brushSize}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={brushType === 'highlighter' ? 0.45 : brushType === 'marker' ? 0.85 : 1}
              />
            </svg>
          </div>
        )}

        {/* Single Element Transform Box */}
        {singleSelectedElement && !singleSelectedElement.hidden && (
          <>
            <TransformControls
              element={singleSelectedElement}
              scale={scale}
              canvasWidth={project.width}
              canvasHeight={project.height}
              onUpdate={(updates, pushHistory) =>
                onUpdateElement(singleSelectedElement.id, updates, pushHistory)
              }
              onSetGuides={onSetGuides}
            />

            <QuickElementBar
              element={singleSelectedElement}
              selectedIds={effectiveSelectedIds}
              scale={scale}
              onDuplicate={onDuplicateElement}
              onDelete={onDeleteElement}
              onToggleLock={(id) =>
                onUpdateElement(id, { locked: !singleSelectedElement.locked })
              }
              onReorder={onReorderLayer}
              onOpenEdit={onOpenEdit}
              onUngroup={onUngroupElements}
              onAlign={(type) => onAlignElements && onAlignElements([singleSelectedElement.id], type)}
            />
          </>
        )}

        {/* Multi-Selection Bounding Box & Group Transform */}
        {isMultiSelected && (
          <>
            <div
              className="absolute border-2 border-dashed border-violet-500 bg-violet-500/10 z-[9999] cursor-move flex items-center justify-center rounded"
              style={{
                left: `${multiBounds.minX}px`,
                top: `${multiBounds.minY}px`,
                width: `${multiBounds.width}px`,
                height: `${multiBounds.height}px`,
              }}
              onMouseDown={handleMultiDragStart}
            >
              <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none select-none">
                {selectedElements.length} Items Selected
              </span>
            </div>

            <QuickElementBar
              element={{
                id: 'multi',
                x: multiBounds.minX,
                y: multiBounds.minY,
                width: multiBounds.width,
                height: multiBounds.height,
                name: 'Multi-Selection',
                type: 'shape',
                opacity: 1,
                zIndex: 9999,
                rotation: 0,
              } as any}
              selectedIds={effectiveSelectedIds}
              scale={scale}
              onDuplicate={(id) => {
                selectedElements.forEach((el) => onDuplicateElement(el.id));
              }}
              onDelete={(id) => {
                selectedElements.forEach((el) => onDeleteElement(el.id));
                if (onSetSelection) onSetSelection([]);
              }}
              onToggleLock={() => {}}
              onReorder={() => {}}
              onGroup={onGroupElements}
              onAlign={(type) => onAlignElements && onAlignElements(effectiveSelectedIds, type)}
            />
          </>
        )}

        {/* Marquee Selection Box */}
        {marquee && marquee.active && (
          <div
            className="absolute border border-violet-400 bg-violet-500/20 pointer-events-none z-[10003] rounded-sm"
            style={{
              left: `${Math.min(marquee.startX, marquee.currentX)}px`,
              top: `${Math.min(marquee.startY, marquee.currentY)}px`,
              width: `${Math.abs(marquee.currentX - marquee.startX)}px`,
              height: `${Math.abs(marquee.currentY - marquee.startY)}px`,
            }}
          />
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
