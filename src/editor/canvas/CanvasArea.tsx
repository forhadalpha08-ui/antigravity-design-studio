import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Project,
  CanvasElement,
  BrushType,
  DrawPoint,
  DrawElement,
  VectorPathElement,
  VectorAnchor,
  PhotoshopPenSubTool,
} from '../../types/canvas';
import { CanvasRenderer } from './CanvasRenderer';
import { TransformControls } from './TransformControls';
import { QuickElementBar } from './QuickElementBar';
import { SnapGuide } from '../../utils/math';
import { ToolType } from '../../store/useEditorStore';
import { pointsToSvgPath } from './renderers/RenderDraw';
import {
  anchorsToSvgPath,
  fitPointsToSmoothAnchors,
  getAnchorsBoundingBox,
  findClosestSegmentInsertionIndex,
} from '../pen/penUtils';
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
  activePenSubTool?: PhotoshopPenSubTool;
  penFill?: string;
  penStroke?: string;
  penStrokeWidth?: number;
  penClosed?: boolean;
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
  onRegisterFitToScreen?: (fitFn: () => void) => void;
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
  activePenSubTool = 'pen',
  penFill = 'none',
  penStroke = '#8b5cf6',
  penStrokeWidth = 3,
  penClosed = false,
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
  onRegisterFitToScreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Freehand drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<DrawPoint[]>([]);

  // Photoshop CS6 Pen in-progress drawing state
  const [penAnchors, setPenAnchors] = useState<VectorAnchor[]>([]);
  const [penCursorPos, setPenCursorPos] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringFirstPenPoint, setIsHoveringFirstPenPoint] = useState(false);
  const [isFreeformDrawing, setIsFreeformDrawing] = useState(false);
  const [freeformPoints, setFreeformPoints] = useState<{ x: number; y: number }[]>([]);

  // Editing anchor on selected VectorPathElement
  const [selectedAnchorId, setSelectedAnchorId] = useState<string | null>(null);
  const [draggingAnchorIndex, setDraggingAnchorIndex] = useState<number | null>(null);
  const [draggingHandle, setDraggingHandle] = useState<{
    anchorIndex: number;
    handleType: 'handleIn' | 'handleOut';
  } | null>(null);

  // Inline text editing state
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Marquee selection state
  const [marquee, setMarquee] = useState<{
    startX: number;
    startY: number;
    currentX: number;
    currentY: number;
    active: boolean;
  } | null>(null);

  // Convert client (screen) coordinates to canvas coordinates (unscaled)
  const getCanvasCoords = useCallback(
    (clientX: number, clientY: number) => {
      if (!canvasRef.current) return { x: 0, y: 0 };
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (clientX - rect.left) / scale;
      const y = (clientY - rect.top) / scale;
      return { x, y };
    },
    [scale]
  );

  // Auto-fit function: calculates the exact scale so the template's full width & height are visible inside the screen
  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    if (container.width === 0 || container.height === 0) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
    const paddingX = isMobile ? 20 : 48;
    const paddingY = isMobile ? 24 : 48;

    const availableW = Math.max(container.width - paddingX * 2, 80);
    const availableH = Math.max(container.height - paddingY * 2, 80);
    const scaleX = availableW / project.width;
    const scaleY = availableH / project.height;

    // By taking Math.min(scaleX, scaleY), both width and height are 100% visible inside the screen
    const newScale = Math.min(scaleX, scaleY);
    if (newScale > 0) {
      const clampedScale = Math.max(0.04, Math.min(Math.round(newScale * 1000) / 1000, 2.5));
      onScaleChange(clampedScale);
      onPanChange({ x: 0, y: 0 });
    }
  }, [project.width, project.height, onScaleChange, onPanChange]);

  // Register fitToScreen callback for parent components (StudioEditor / header reset buttons)
  useEffect(() => {
    if (onRegisterFitToScreen) {
      onRegisterFitToScreen(fitToScreen);
    }
  }, [onRegisterFitToScreen, fitToScreen]);

  // Auto-fit immediately on mount, on template/dimension switch, and on window resize
  const lastProjectIdRef = useRef<string>(project.id);
  useEffect(() => {
    const isProjectChange = lastProjectIdRef.current !== project.id;
    lastProjectIdRef.current = project.id;

    // Use requestAnimationFrame + timeout to guarantee container layout is measured accurately
    const rafId = requestAnimationFrame(() => {
      fitToScreen();
    });

    const timer = setTimeout(() => {
      fitToScreen();
    }, 60);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [project.id, project.width, project.height, fitToScreen]);

  // Observer for viewport container dimension changes
  useEffect(() => {
    if (!containerRef.current) return;
    let initialFitDone = false;
    const ro = new ResizeObserver(() => {
      if (!initialFitDone) {
        initialFitDone = true;
        fitToScreen();
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [fitToScreen]);

  // Finish Photoshop Pen open path into a VectorPathElement
  const commitPenPath = useCallback(
    (isClosedShape: boolean = false) => {
      if (penAnchors.length < 2 || !onAddElement) {
        setPenAnchors([]);
        setPenCursorPos(null);
        return;
      }

      const bbox = getAnchorsBoundingBox(penAnchors);
      // Normalize anchors relative to element top-left
      const normalizedAnchors: VectorAnchor[] = penAnchors.map((a) => ({
        ...a,
        x: Math.round((a.x - bbox.minX) * 10) / 10,
        y: Math.round((a.y - bbox.minY) * 10) / 10,
      }));

      const maxZ = project.elements.length > 0 ? Math.max(...project.elements.map((el) => el.zIndex)) : 0;
      const newPathEl: VectorPathElement = {
        id: generateId('pen'),
        name: isClosedShape ? 'Pen Shape' : 'Pen Vector Path',
        type: 'vector-path',
        x: Math.round(bbox.minX),
        y: Math.round(bbox.minY),
        width: Math.max(20, Math.round(bbox.width)),
        height: Math.max(20, Math.round(bbox.height)),
        anchors: normalizedAnchors,
        closed: isClosedShape,
        fill: isClosedShape ? (penFill === 'none' ? '#8b5cf6' : penFill) : 'none',
        strokeColor: penStroke || '#8b5cf6',
        strokeWidth: penStrokeWidth || 3,
        strokeDash: 'solid',
        opacity: 1,
        zIndex: maxZ + 1,
        rotation: 0,
        locked: false,
        hidden: false,
        pathData: anchorsToSvgPath(normalizedAnchors, isClosedShape),
      };

      onAddElement(newPathEl);
      onSelectElement(newPathEl.id);
      setPenAnchors([]);
      setPenCursorPos(null);
    },
    [penAnchors, onAddElement, project.elements, penFill, penStroke, penStrokeWidth, onSelectElement]
  );

  // Keyboard shortcut listener for Pen Tool (Enter / Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTool === 'pen') {
        if (e.key === 'Enter') {
          e.preventDefault();
          commitPenPath(penClosed);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setPenAnchors([]);
          setPenCursorPos(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTool, penClosed, commitPenPath]);

  // Wheel Zoom & Pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
      const nextScale = Math.min(Math.max(scale * zoomFactor, 0.05), 5);
      onScaleChange(Math.round(nextScale * 1000) / 1000);
    } else {
      onPanChange({
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY,
      });
    }
  };

  // Mouse Down Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    // Middle click or Spacebar/Hand tool -> Pan canvas
    if (e.button === 1 || activeTool === 'hand' || (e as any).spaceKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });

      const onMouseMove = (ev: MouseEvent) => {
        onPanChange({
          x: ev.clientX - panStart.x,
          y: ev.clientY - panStart.y,
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

    // Comment placement tool
    if (activeTool === 'comment' && e.button === 0) {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      if (
        coords.x >= 0 &&
        coords.x <= project.width &&
        coords.y >= 0 &&
        coords.y <= project.height
      ) {
        if (onAddComment) onAddComment(Math.round(coords.x), Math.round(coords.y));
      }
      return;
    }

    // Freehand Draw Tool
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

    // PHOTOSHOP CS6 PEN SUITE
    if (activeTool === 'pen' && e.button === 0) {
      const coords = getCanvasCoords(e.clientX, e.clientY);

      // 1. FREEFORM PEN TOOL
      if (activePenSubTool === 'freeform') {
        setIsFreeformDrawing(true);
        setFreeformPoints([coords]);

        const onMouseMove = (ev: MouseEvent) => {
          const c = getCanvasCoords(ev.clientX, ev.clientY);
          setFreeformPoints((prev) => [...prev, c]);
        };

        const onMouseUp = () => {
          setIsFreeformDrawing(false);
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);

          setFreeformPoints((pts) => {
            if (pts.length < 3 || !onAddElement) return [];
            const fittedAnchors = fitPointsToSmoothAnchors(pts, penClosed);
            const bbox = getAnchorsBoundingBox(fittedAnchors);

            const normalizedAnchors = fittedAnchors.map((a) => ({
              ...a,
              x: Math.round((a.x - bbox.minX) * 10) / 10,
              y: Math.round((a.y - bbox.minY) * 10) / 10,
            }));

            const maxZ = project.elements.length > 0 ? Math.max(...project.elements.map((el) => el.zIndex)) : 0;
            const newEl: VectorPathElement = {
              id: generateId('pen'),
              name: 'Freeform Vector Path',
              type: 'vector-path',
              x: Math.round(bbox.minX),
              y: Math.round(bbox.minY),
              width: Math.max(20, Math.round(bbox.width)),
              height: Math.max(20, Math.round(bbox.height)),
              anchors: normalizedAnchors,
              closed: penClosed,
              fill: penClosed ? (penFill === 'none' ? '#8b5cf6' : penFill) : 'none',
              strokeColor: penStroke,
              strokeWidth: penStrokeWidth,
              opacity: 1,
              zIndex: maxZ + 1,
              rotation: 0,
              locked: false,
              hidden: false,
              pathData: anchorsToSvgPath(normalizedAnchors, penClosed),
            };

            onAddElement(newEl);
            onSelectElement(newEl.id);
            return [];
          });
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return;
      }

      // 2. CURVATURE PEN TOOL
      if (activePenSubTool === 'curvature') {
        if (penAnchors.length >= 3 && isHoveringFirstPenPoint) {
          // Close loop
          commitPenPath(true);
          return;
        }

        const rawPoints = [...penAnchors.map((a) => ({ x: a.x, y: a.y })), coords];
        const newSmoothAnchors = fitPointsToSmoothAnchors(rawPoints, false);
        setPenAnchors(newSmoothAnchors);
        return;
      }

      // 3. STANDARD BÉZIER PEN TOOL
      if (activePenSubTool === 'pen') {
        // Check if clicking on first anchor point to close loop
        if (penAnchors.length >= 3 && isHoveringFirstPenPoint) {
          commitPenPath(true);
          return;
        }

        const newAnchorIndex = penAnchors.length;
        const newAnchor: VectorAnchor = {
          id: `a_${Date.now()}_${newAnchorIndex}`,
          x: coords.x,
          y: coords.y,
          pointType: 'corner',
        };

        setPenAnchors((prev) => [...prev, newAnchor]);

        // Drag handle creation
        const onMouseMove = (ev: MouseEvent) => {
          const c = getCanvasCoords(ev.clientX, ev.clientY);
          const dx = c.x - coords.x;
          const dy = c.y - coords.y;

          if (Math.hypot(dx, dy) > 3) {
            setPenAnchors((prev) => {
              const next = [...prev];
              if (next[newAnchorIndex]) {
                next[newAnchorIndex] = {
                  ...next[newAnchorIndex],
                  pointType: 'smooth',
                  handleOut: { x: dx, y: dy },
                  handleIn: { x: -dx, y: -dy },
                };
              }
              return next;
            });
          }
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return;
      }

      // 4. ADD ANCHOR POINT TOOL
      if (activePenSubTool === 'add-anchor') {
        const selectedEl = project.elements.find((el) => el.id === selectedId);
        if (selectedEl && selectedEl.type === 'vector-path') {
          const vp = selectedEl as VectorPathElement;
          const localCoords = { x: coords.x - vp.x, y: coords.y - vp.y };
          const { insertIndex, distance } = findClosestSegmentInsertionIndex(
            vp.anchors,
            localCoords,
            vp.closed
          );

          if (distance < 20 / scale) {
            const newAnchors = [...vp.anchors];
            newAnchors.splice(insertIndex, 0, {
              id: `a_${Date.now()}`,
              x: localCoords.x,
              y: localCoords.y,
              pointType: 'smooth',
              handleIn: { x: -15, y: 0 },
              handleOut: { x: 15, y: 0 },
            });

            onUpdateElement(vp.id, {
              anchors: newAnchors,
              pathData: anchorsToSvgPath(newAnchors, vp.closed),
            });
          }
        }
        return;
      }
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

          if (x2 - x1 > 6 || y2 - y1 > 6) {
            const intersecting = project.elements.filter((el) => {
              if (el.hidden || el.locked) return false;
              const elX2 = el.x + el.width;
              const elY2 = el.y + el.height;
              return el.x < x2 && elX2 > x1 && el.y < y2 && elY2 > y1;
            });

            if (intersecting.length > 0 && onSetSelection) {
              onSetSelection(intersecting.map((el) => el.id));
            } else {
              onSelectElement(null);
            }
          } else {
            onSelectElement(null);
          }
          return null;
        });
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      return;
    }
  };

  // Mouse Move over Canvas Area (Tracks Pen Rubber-Band Preview & Close Hover)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (activeTool === 'pen') {
      const coords = getCanvasCoords(e.clientX, e.clientY);
      setPenCursorPos(coords);

      if (penAnchors.length >= 3) {
        const first = penAnchors[0];
        const dist = Math.hypot(coords.x - first.x, coords.y - first.y);
        setIsHoveringFirstPenPoint(dist < 18 / scale);
      } else {
        setIsHoveringFirstPenPoint(false);
      }
    }
  };

  // Multi-Selection Drag Handling
  const handleMultiDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;

    const initialPositions = new Map<string, { x: number; y: number }>();
    project.elements
      .filter((el) => effectiveSelectedIds.includes(el.id))
      .forEach((el) => {
        initialPositions.set(el.id, { x: el.x, y: el.y });
      });

    const onMouseMove = (ev: MouseEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      initialPositions.forEach((pos, id) => {
        onUpdateElement(id, {
          x: Math.round(pos.x + dx),
          y: Math.round(pos.y + dy),
        });
      });
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  // Selection state
  const effectiveSelectedIds = selectedIds.length > 0 ? selectedIds : selectedId ? [selectedId] : [];
  const selectedElements = project.elements.filter((el) => effectiveSelectedIds.includes(el.id));
  const isMultiSelected = selectedElements.length > 1;
  const singleSelectedElement =
    selectedElements.length === 1 ? selectedElements[0] : null;

  // Selected Vector Path for interactive anchor editing
  const selectedVectorPath =
    singleSelectedElement && singleSelectedElement.type === 'vector-path'
      ? (singleSelectedElement as VectorPathElement)
      : null;

  // Multi-selection bounding box calculation
  const multiBounds = React.useMemo(() => {
    if (selectedElements.length === 0) return { minX: 0, minY: 0, width: 0, height: 0 };
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    selectedElements.forEach((el) => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    });

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }, [selectedElements]);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onDoubleClick={() => {
        if (activeTool === 'pen' && penAnchors.length >= 2) {
          commitPenPath(penClosed);
        }
      }}
      className={`relative flex-1 h-full w-full overflow-hidden flex items-center justify-center bg-[#07080c] select-none ${
        isPanning || activeTool === 'hand'
          ? 'cursor-grab active:cursor-grabbing'
          : activeTool === 'draw'
          ? 'cursor-crosshair'
          : activeTool === 'pen'
          ? 'cursor-crosshair'
          : activeTool === 'comment'
          ? 'cursor-crosshair'
          : 'cursor-default'
      }`}
    >
      {/* Scaled & Centered Canvas Artboard */}
      <div
        ref={canvasRef}
        className="relative bg-white shadow-2xl transition-shadow"
        style={{
          width: `${project.width}px`,
          height: `${project.height}px`,
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Core Canvas Element Renderer */}
        <CanvasRenderer
          project={project}
          selectedId={selectedId}
          selectedIds={selectedIds}
          editingTextId={editingTextId}
          onSetEditingTextId={setEditingTextId}
          showComments={showComments}
          activeCommentId={activeCommentId}
          onSelectElement={(id, e) => {
            if (activeTool === 'select') {
              onSelectElement(id, (e as any)?.shiftKey);
            }
          }}
          onUpdateElement={onUpdateElement}
          onSelectComment={onSelectComment}
        />

        {/* FREEHAND DRAWING LIVE PREVIEW */}
        {isDrawing && currentDrawPoints.length > 1 && (
          <div className="absolute inset-0 pointer-events-none z-[9998]">
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

        {/* PHOTOSHOP FREEFORM PEN LIVE PREVIEW */}
        {isFreeformDrawing && freeformPoints.length > 1 && (
          <div className="absolute inset-0 pointer-events-none z-[9998]">
            <svg
              viewBox={`0 0 ${project.width} ${project.height}`}
              className="w-full h-full overflow-visible"
            >
              <path
                d={pointsToSvgPath(freeformPoints)}
                fill="none"
                stroke={penStroke}
                strokeWidth={penStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        {/* PHOTOSHOP BÉZIER / CURVATURE PEN LIVE PREVIEW OVERLAY */}
        {activeTool === 'pen' && penAnchors.length > 0 && (
          <div className="absolute inset-0 pointer-events-none z-[9999]">
            <svg
              viewBox={`0 0 ${project.width} ${project.height}`}
              className="w-full h-full overflow-visible"
            >
              {/* Completed Path Segments */}
              <path
                d={anchorsToSvgPath(penAnchors, false)}
                fill="none"
                stroke={penStroke}
                strokeWidth={penStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Rubber-band preview line from last anchor to cursor */}
              {penCursorPos && (
                <line
                  x1={penAnchors[penAnchors.length - 1].x}
                  y1={penAnchors[penAnchors.length - 1].y}
                  x2={isHoveringFirstPenPoint ? penAnchors[0].x : penCursorPos.x}
                  y2={isHoveringFirstPenPoint ? penAnchors[0].y : penCursorPos.y}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
              )}

              {/* Anchor Points Handles */}
              {penAnchors.map((anchor, idx) => {
                const isFirst = idx === 0;
                return (
                  <g key={anchor.id}>
                    {/* Control Handles (if smooth) */}
                    {anchor.handleIn && (
                      <>
                        <line
                          x1={anchor.x}
                          y1={anchor.y}
                          x2={anchor.x + anchor.handleIn.x}
                          y2={anchor.y + anchor.handleIn.y}
                          stroke="#60a5fa"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={anchor.x + anchor.handleIn.x}
                          cy={anchor.y + anchor.handleIn.y}
                          r={4 / scale}
                          fill="#3b82f6"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      </>
                    )}
                    {anchor.handleOut && (
                      <>
                        <line
                          x1={anchor.x}
                          y1={anchor.y}
                          x2={anchor.x + anchor.handleOut.x}
                          y2={anchor.y + anchor.handleOut.y}
                          stroke="#60a5fa"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={anchor.x + anchor.handleOut.x}
                          cy={anchor.y + anchor.handleOut.y}
                          r={4 / scale}
                          fill="#3b82f6"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                        />
                      </>
                    )}

                    {/* Anchor square knob */}
                    <rect
                      x={anchor.x - 5 / scale}
                      y={anchor.y - 5 / scale}
                      width={10 / scale}
                      height={10 / scale}
                      fill={isFirst && isHoveringFirstPenPoint ? '#10b981' : '#2563eb'}
                      stroke="#ffffff"
                      strokeWidth={1.5 / scale}
                      className="transition-colors"
                    />

                    {/* Close loop indicator circle when hovering first point */}
                    {isFirst && isHoveringFirstPenPoint && (
                      <circle
                        cx={anchor.x}
                        cy={anchor.y}
                        r={12 / scale}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth={2 / scale}
                        strokeDasharray="2 2"
                      />
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* INTERACTIVE VECTOR PATH ANCHORS EDITING OVERLAY FOR SELECTED VECTOR PATH */}
        {selectedVectorPath && (
          <div className="absolute inset-0 pointer-events-none z-[9999]">
            <svg
              viewBox={`0 0 ${project.width} ${project.height}`}
              className="w-full h-full overflow-visible"
            >
              {selectedVectorPath.anchors?.map((anchor, idx) => {
                const absX = selectedVectorPath.x + anchor.x;
                const absY = selectedVectorPath.y + anchor.y;

                return (
                  <g key={anchor.id} className="pointer-events-auto cursor-pointer">
                    {/* Handle In */}
                    {anchor.handleIn && (
                      <>
                        <line
                          x1={absX}
                          y1={absY}
                          x2={absX + anchor.handleIn.x}
                          y2={absY + anchor.handleIn.y}
                          stroke="#93c5fd"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={absX + anchor.handleIn.x}
                          cy={absY + anchor.handleIn.y}
                          r={5 / scale}
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const startCoords = getCanvasCoords(e.clientX, e.clientY);
                            const initHandle = { ...anchor.handleIn! };

                            const onMouseMove = (ev: MouseEvent) => {
                              const curr = getCanvasCoords(ev.clientX, ev.clientY);
                              const dx = curr.x - absX;
                              const dy = curr.y - absY;

                              const nextAnchors = [...selectedVectorPath.anchors];
                              nextAnchors[idx] = {
                                ...nextAnchors[idx],
                                handleIn: { x: dx, y: dy },
                              };

                              onUpdateElement(selectedVectorPath.id, {
                                anchors: nextAnchors,
                                pathData: anchorsToSvgPath(nextAnchors, selectedVectorPath.closed),
                              });
                            };

                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };

                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        />
                      </>
                    )}

                    {/* Handle Out */}
                    {anchor.handleOut && (
                      <>
                        <line
                          x1={absX}
                          y1={absY}
                          x2={absX + anchor.handleOut.x}
                          y2={absY + anchor.handleOut.y}
                          stroke="#93c5fd"
                          strokeWidth={1.5}
                        />
                        <circle
                          cx={absX + anchor.handleOut.x}
                          cy={absY + anchor.handleOut.y}
                          r={5 / scale}
                          fill="#2563eb"
                          stroke="#ffffff"
                          strokeWidth={1.5}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            const onMouseMove = (ev: MouseEvent) => {
                              const curr = getCanvasCoords(ev.clientX, ev.clientY);
                              const dx = curr.x - absX;
                              const dy = curr.y - absY;

                              const nextAnchors = [...selectedVectorPath.anchors];
                              nextAnchors[idx] = {
                                ...nextAnchors[idx],
                                handleOut: { x: dx, y: dy },
                              };

                              onUpdateElement(selectedVectorPath.id, {
                                anchors: nextAnchors,
                                pathData: anchorsToSvgPath(nextAnchors, selectedVectorPath.closed),
                              });
                            };

                            const onMouseUp = () => {
                              window.removeEventListener('mousemove', onMouseMove);
                              window.removeEventListener('mouseup', onMouseUp);
                            };

                            window.addEventListener('mousemove', onMouseMove);
                            window.addEventListener('mouseup', onMouseUp);
                          }}
                        />
                      </>
                    )}

                    {/* Anchor square handle */}
                    <rect
                      x={absX - 6 / scale}
                      y={absY - 6 / scale}
                      width={12 / scale}
                      height={12 / scale}
                      fill={selectedAnchorId === anchor.id ? '#ec4899' : '#3b82f6'}
                      stroke="#ffffff"
                      strokeWidth={2 / scale}
                      onClick={(e) => {
                        e.stopPropagation();
                        // If Delete Anchor Tool is active, remove this anchor
                        if (activePenSubTool === 'delete-anchor') {
                          if (selectedVectorPath.anchors.length > 2) {
                            const filtered = selectedVectorPath.anchors.filter((_, i) => i !== idx);
                            onUpdateElement(selectedVectorPath.id, {
                              anchors: filtered,
                              pathData: anchorsToSvgPath(filtered, selectedVectorPath.closed),
                            });
                          }
                          return;
                        }

                        // If Convert Point Tool is active, toggle corner vs smooth
                        if (activePenSubTool === 'convert-point') {
                          const isCorner = anchor.pointType === 'corner' || (!anchor.handleIn && !anchor.handleOut);
                          const nextAnchors = [...selectedVectorPath.anchors];
                          nextAnchors[idx] = {
                            ...nextAnchors[idx],
                            pointType: isCorner ? 'smooth' : 'corner',
                            handleIn: isCorner ? { x: -20, y: 0 } : undefined,
                            handleOut: isCorner ? { x: 20, y: 0 } : undefined,
                          };
                          onUpdateElement(selectedVectorPath.id, {
                            anchors: nextAnchors,
                            pathData: anchorsToSvgPath(nextAnchors, selectedVectorPath.closed),
                          });
                          return;
                        }

                        setSelectedAnchorId(anchor.id);
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        const startCoords = getCanvasCoords(e.clientX, e.clientY);
                        const initX = anchor.x;
                        const initY = anchor.y;

                        const onMouseMove = (ev: MouseEvent) => {
                          const curr = getCanvasCoords(ev.clientX, ev.clientY);
                          const dx = curr.x - startCoords.x;
                          const dy = curr.y - startCoords.y;

                          const nextAnchors = [...selectedVectorPath.anchors];
                          nextAnchors[idx] = {
                            ...nextAnchors[idx],
                            x: Math.round((initX + dx) * 10) / 10,
                            y: Math.round((initY + dy) * 10) / 10,
                          };

                          onUpdateElement(selectedVectorPath.id, {
                            anchors: nextAnchors,
                            pathData: anchorsToSvgPath(nextAnchors, selectedVectorPath.closed),
                          });
                        };

                        const onMouseUp = () => {
                          window.removeEventListener('mousemove', onMouseMove);
                          window.removeEventListener('mouseup', onMouseUp);
                        };

                        window.addEventListener('mousemove', onMouseMove);
                        window.addEventListener('mouseup', onMouseUp);
                      }}
                    />
                  </g>
                );
              })}
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

            {/* ENLARGED COUNTER-SCALED QUICK OPTIONS SECTION */}
            <QuickElementBar
              element={singleSelectedElement}
              selectedIds={effectiveSelectedIds}
              scale={scale}
              onDuplicate={onDuplicateElement}
              onDelete={onDeleteElement}
              onEditText={(id) => setEditingTextId(id)}
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
              className="absolute border-2 border-dashed border-violet-500 bg-violet-500/10 z-[9999] cursor-move flex items-center justify-center rounded-xl"
              style={{
                left: `${multiBounds.minX}px`,
                top: `${multiBounds.minY}px`,
                width: `${multiBounds.width}px`,
                height: `${multiBounds.height}px`,
              }}
              onMouseDown={handleMultiDragStart}
            >
              <span className="bg-violet-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-lg pointer-events-none select-none">
                {selectedElements.length} Items Selected
              </span>
            </div>

            {/* ENLARGED COUNTER-SCALED QUICK OPTIONS SECTION FOR MULTI-SELECTION */}
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
            className="absolute border-2 border-violet-400 bg-violet-500/20 pointer-events-none z-[10003] rounded"
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
                    width: '1.5px',
                    backgroundColor: '#8b5cf6',
                    boxShadow: '0 0 6px #8b5cf6',
                  }
                : {
                    top: `${guide.position}px`,
                    left: 0,
                    right: 0,
                    height: '1.5px',
                    backgroundColor: '#8b5cf6',
                    boxShadow: '0 0 6px #8b5cf6',
                  }
            }
          />
        ))}
      </div>
    </div>
  );
};
