import React from 'react';
import { VectorPathElement } from '../../../types/canvas';
import { anchorsToSvgPath } from '../../pen/penUtils';

interface RenderVectorPathProps {
  element: VectorPathElement;
}

export const RenderVectorPath: React.FC<RenderVectorPathProps> = ({ element }) => {
  const pathD = element.pathData || anchorsToSvgPath(element.anchors, element.closed);

  let strokeDasharray = 'none';
  if (element.strokeDash === 'dashed') strokeDasharray = '8 6';
  else if (element.strokeDash === 'dotted') strokeDasharray = '3 3';

  const fill = element.fill && element.fill !== 'none' ? element.fill : 'none';
  const stroke = element.strokeColor && element.strokeColor !== 'none' ? element.strokeColor : 'none';
  const strokeWidth = element.strokeWidth || 0;

  return (
    <div
      className="w-full h-full pointer-events-none"
      style={{
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
    >
      <svg
        viewBox={`0 0 ${element.width} ${element.height}`}
        className="w-full h-full overflow-visible"
      >
        <path
          d={pathD}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeLinecap={element.strokeLinecap || 'round'}
          strokeLinejoin={element.strokeLinejoin || 'round'}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
};
