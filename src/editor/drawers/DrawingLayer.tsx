import React, { useRef, useEffect, useCallback, useState } from 'react';

export type BrushType = 'pen' | 'marker' | 'highlighter' | 'eraser';

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  points: StrokePoint[];
  color: string;
  width: number;
  brushType: BrushType;
  opacity: number;
}

interface DrawingLayerProps {
  canvasWidth: number;
  canvasHeight: number;
  brushType: BrushType;
  brushColor: string;
  brushSize: number;
  opacity: number;
  strokes: Stroke[];
  onStrokeAdd: (stroke: Stroke) => void;
  isActive: boolean; // true when activeTool === 'draw'
}

// ── Smooth path using quadratic bezier interpolation ──────────────────────────
function buildSmoothPath(points: StrokePoint[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) {
    // Render a dot
    const { x, y } = points[0];
    return `M ${x} ${y} L ${x + 0.01} ${y + 0.01}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i++) {
    const midX = (points[i].x + points[i + 1].x) / 2;
    const midY = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y} ${midX} ${midY}`;
  }

  // Last segment — go straight to final point
  const last = points[points.length - 1];
  d += ` L ${last.x} ${last.y}`;

  return d;
}

// ── Generate a unique ID ───────────────────────────────────────────────────────
function genId() {
  return `stroke_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
}

export const DrawingLayer: React.FC<DrawingLayerProps> = ({
  canvasWidth,
  canvasHeight,
  brushType,
  brushColor,
  brushSize,
  opacity,
  strokes,
  onStrokeAdd,
  isActive,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [livePoints, setLivePoints] = useState<StrokePoint[]>([]);
  const isDrawingRef = useRef(false);
  const currentStrokeIdRef = useRef<string>('');

  // ── Coordinate helpers ──────────────────────────────────────────────────────
  const getPoint = useCallback(
    (clientX: number, clientY: number): StrokePoint | null => {
      const svg = svgRef.current;
      if (!svg) return null;
      const rect = svg.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * (canvasWidth / rect.width),
        y: (clientY - rect.top) * (canvasHeight / rect.height),
      };
    },
    [canvasWidth, canvasHeight]
  );

  // ── Mouse handlers ──────────────────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isActive) return;
      e.preventDefault();
      const pt = getPoint(e.clientX, e.clientY);
      if (!pt) return;
      isDrawingRef.current = true;
      currentStrokeIdRef.current = genId();
      setLivePoints([pt]);
    },
    [isActive, getPoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      if (!isDrawingRef.current || !isActive) return;
      const pt = getPoint(e.clientX, e.clientY);
      if (!pt) return;
      setLivePoints((prev) => [...prev, pt]);
    },
    [isActive, getPoint]
  );

  const finalizeStroke = useCallback(
    (points: StrokePoint[]) => {
      if (points.length === 0) return;
      const resolvedOpacity =
        brushType === 'highlighter' ? 0.4 : opacity;

      const stroke: Stroke = {
        id: currentStrokeIdRef.current || genId(),
        points,
        color: brushColor,
        width: brushType === 'highlighter' ? brushSize * 2 : brushSize,
        brushType,
        opacity: resolvedOpacity,
      };
      onStrokeAdd(stroke);
      setLivePoints([]);
      isDrawingRef.current = false;
    },
    [brushType, brushColor, brushSize, opacity, onStrokeAdd]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawingRef.current) {
      setLivePoints((prev) => {
        finalizeStroke(prev);
        return [];
      });
    }
  }, [finalizeStroke]);

  // ── Touch handlers ──────────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pt = getPoint(touch.clientX, touch.clientY);
      if (!pt) return;
      isDrawingRef.current = true;
      currentStrokeIdRef.current = genId();
      setLivePoints([pt]);
    },
    [isActive, getPoint]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<SVGSVGElement>) => {
      if (!isDrawingRef.current || !isActive) return;
      e.preventDefault();
      const touch = e.touches[0];
      const pt = getPoint(touch.clientX, touch.clientY);
      if (!pt) return;
      setLivePoints((prev) => [...prev, pt]);
    },
    [isActive, getPoint]
  );

  const handleTouchEnd = useCallback(() => {
    if (isDrawingRef.current) {
      setLivePoints((prev) => {
        finalizeStroke(prev);
        return [];
      });
    }
  }, [finalizeStroke]);

  // ── Global mouseup guard (handles leaving the SVG while drawing) ──────────
  useEffect(() => {
    const onGlobalMouseUp = () => {
      if (isDrawingRef.current) {
        setLivePoints((prev) => {
          finalizeStroke(prev);
          return [];
        });
      }
    };
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, [finalizeStroke]);

  // ── Render a single stroke path ─────────────────────────────────────────────
  const renderStroke = (stroke: Stroke, isLive = false) => {
    const d = buildSmoothPath(stroke.points);
    if (!d) return null;

    const isEraser = stroke.brushType === 'eraser';
    const isHighlighter = stroke.brushType === 'highlighter';

    const strokeOpacity = isHighlighter ? 0.4 : stroke.opacity;
    const strokeLinecap: React.SVGAttributes<SVGPathElement>['strokeLinecap'] = 'round';
    const strokeLinejoin: React.SVGAttributes<SVGPathElement>['strokeLinejoin'] = 'round';

    return (
      <path
        key={isLive ? 'live-stroke' : stroke.id}
        d={d}
        fill="none"
        stroke={isEraser ? '#000000' : stroke.color}
        strokeWidth={stroke.width}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        opacity={strokeOpacity}
        style={isEraser ? ({ mixBlendMode: 'destination-out' } as any) : undefined}
      />
    );
  };

  const livePath = buildSmoothPath(livePoints);
  const liveIsEraser = brushType === 'eraser';
  const liveIsHighlighter = brushType === 'highlighter';

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: isActive ? 'all' : 'none',
        cursor: isActive ? 'crosshair' : 'default',
        overflow: 'visible',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Committed strokes */}
      <g>
        {strokes.map((stroke) => renderStroke(stroke))}
      </g>

      {/* Live in-progress stroke */}
      {isDrawingRef.current && livePath && (
        <path
          d={livePath}
          fill="none"
          stroke={liveIsEraser ? '#000000' : brushColor}
          strokeWidth={liveIsHighlighter ? brushSize * 2 : brushSize}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={liveIsHighlighter ? 0.4 : opacity}
          style={liveIsEraser ? ({ mixBlendMode: 'destination-out' } as any) : undefined}
        />
      )}
    </svg>
  );
};
