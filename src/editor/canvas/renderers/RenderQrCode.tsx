import React, { useMemo } from 'react';
import { QrCodeElement } from '../../../types/canvas';
import { generateQrCode } from '../../../utils/qr';

interface RenderQrCodeProps {
  element: QrCodeElement;
}

export const RenderQrCode: React.FC<RenderQrCodeProps> = ({ element }) => {
  const { data, fgColor = '#ffffff', bgColor = '#000000', width, height } = element;
  const size = Math.min(width, height);

  const qr = useMemo(() => {
    return generateQrCode(data || 'https://af-canvas.app', size, fgColor, bgColor);
  }, [data, size, fgColor, bgColor]);

  const cellSize = size / qr.matrixSize;

  return (
    <div
      className="w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden rounded-lg shadow-md"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full"
        shapeRendering="crispEdges"
      >
        <rect width={size} height={size} fill={bgColor} />
        {qr.matrix.map((row, r) =>
          row.map((cell, c) => {
            if (!cell) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fgColor}
              />
            );
          })
        )}
      </svg>
    </div>
  );
};
