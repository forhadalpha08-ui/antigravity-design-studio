import React from 'react';
import { DrawElement } from '../../../types/canvas';

interface RenderDrawProps {
  element: DrawElement;
}

export function pointsToSvgPath(points: { x: number; y: number }[]): string {
  if (!points || points.length === 0) return '';
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y} L ${points[0].x + 0.1} ${points[0].y + 0.1}`;
  }
  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length - 1; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    d += ` Q ${points[i].x} ${points[i].y}, ${xc} ${yc}`;
  }
  d += ` L ${points[points.length - 1].x} ${points[points.length - 1].y}`;
  return d;
}

export const RenderDraw: React.FC<RenderDrawProps> = ({ element }) => {
  const pathD = element.pathData || pointsToSvgPath(element.points);

  let opacity = 1;
  let strokeLinecap: 'round' | 'square' = 'round';
  let blendMode: React.CSSProperties['mixBlendMode'] = 'normal';

  switch (element.brushType) {
    case 'marker':
      opacity = 0.85;
      strokeLinecap = 'square';
      break;
    case 'highlighter':
      opacity = 0.45;
      strokeLinecap = 'square';
      blendMode = 'multiply';
      break;
    case 'eraser':
      opacity = 1;
      break;
    case 'pen':
    default:
      opacity = 1;
      strokeLinecap = 'round';
      break;
  }

  return (
    <div
      className="w-full h-full pointer-events-none"
      style={{
        width: `${element.width}px`,
        height: `${element.height}px`,
        mixBlendMode: blendMode,
      }}
    >
      <svg
        viewBox={`0 0 ${element.width} ${element.height}`}
        className="w-full h-full overflow-visible"
      >
        <path
          d={pathD}
          fill="none"
          stroke={element.strokeColor || '#8b5cf6'}
          strokeWidth={element.strokeWidth || 4}
          strokeLinecap={strokeLinecap}
          strokeLinejoin="round"
          opacity={opacity}
        />
      </svg>
    </div>
  );
};
