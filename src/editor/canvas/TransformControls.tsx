import React, { useEffect, useRef, useState } from 'react';
import { CanvasElement } from '../../types/canvas';
import { snapAngle, getSmartSnap, SnapGuide } from '../../utils/math';

interface TransformControlsProps {
  element: CanvasElement;
  scale: number;
  canvasWidth: number;
  canvasHeight: number;
  onUpdate: (updates: Partial<CanvasElement>, pushHistory?: boolean) => void;
  onSetGuides: (guides: SnapGuide[]) => void;
}

type HandleType = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'rot';

export const TransformControls: React.FC<TransformControlsProps> = ({
  element,
  scale,
  canvasWidth,
  canvasHeight,
  onUpdate,
  onSetGuides,
}) => {
  const [isTransforming, setIsTransforming] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(element.rotation || 0);

  const startPosRef = useRef<{
    clientX: number;
    clientY: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    handle: HandleType;
  } | null>(null);

  useEffect(() => {
    setCurrentAngle(element.rotation || 0);
  }, [element.rotation]);

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    handle: HandleType
  ) => {
    e.stopPropagation();
    e.preventDefault();

    setIsTransforming(true);
    startPosRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height,
      rotation: element.rotation || 0,
      handle,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!startPosRef.current) return;
      const { clientX, clientY, x, y, width, height, rotation, handle } =
        startPosRef.current;

      const deltaX = (ev.clientX - clientX) / scale;
      const deltaY = (ev.clientY - clientY) / scale;

      if (handle === 'rot') {
        const rectCenter = {
          x: x + width / 2,
          y: y + height / 2,
        };
        // Calculate angle from center
        const mouseX = x + deltaX;
        const mouseY = y + deltaY;
        const rad = Math.atan2(mouseY - rectCenter.y, mouseX - rectCenter.x);
        let deg = (rad * 180) / Math.PI + 90;
        deg = snapAngle(deg);
        setCurrentAngle(deg);
        onUpdate({ rotation: deg }, false);
        return;
      }

      let newX = x;
      let newY = y;
      let newW = width;
      let newH = height;

      if (handle.includes('e')) newW = Math.max(20, width + deltaX);
      if (handle.includes('s')) newH = Math.max(20, height + deltaY);
      if (handle.includes('w')) {
        const potentialW = width - deltaX;
        if (potentialW >= 20) {
          newW = potentialW;
          newX = x + deltaX;
        }
      }
      if (handle.includes('n')) {
        const potentialH = height - deltaY;
        if (potentialH >= 20) {
          newH = potentialH;
          newY = y + deltaY;
        }
      }

      // Check smart guides on resize/move
      const { snappedX, snappedY, guides } = getSmartSnap(
        { x: newX, y: newY, width: newW, height: newH },
        canvasWidth,
        canvasHeight
      );

      onSetGuides(guides);
      onUpdate(
        {
          x: Math.round(snappedX),
          y: Math.round(snappedY),
          width: Math.round(newW),
          height: Math.round(newH),
        },
        false
      );
    };

    const handlePointerUp = () => {
      setIsTransforming(false);
      startPosRef.current = null;
      onSetGuides([]);
      onUpdate({}, true); // Commit history snapshot
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Drag whole element
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (element.locked) return;
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = element.x;
    const initialY = element.y;

    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;

      const targetRect = {
        x: initialX + dx,
        y: initialY + dy,
        width: element.width,
        height: element.height,
      };

      const { snappedX, snappedY, guides } = getSmartSnap(
        targetRect,
        canvasWidth,
        canvasHeight
      );

      onSetGuides(guides);
      onUpdate({ x: Math.round(snappedX), y: Math.round(snappedY) }, false);
    };

    const onUp = () => {
      onSetGuides([]);
      onUpdate({}, true); // Commit to history
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const handleStyle =
    'absolute w-3.5 h-3.5 bg-white border-2 border-violet-600 rounded-sm shadow-md pointer-events-auto z-50 hover:scale-125 transition-transform touch-none';

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${element.x}px`,
        top: `${element.y}px`,
        width: `${element.width}px`,
        height: `${element.height}px`,
        transform: `rotate(${element.rotation || 0}deg)`,
        zIndex: 9999,
      }}
    >
      {/* Selection Bounding Box Outline */}
      <div
        className="w-full h-full border-2 border-violet-500 pointer-events-auto cursor-move touch-none"
        onPointerDown={handleDragStart}
      >
        {/* Rotation handle */}
        {!element.locked && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto touch-none">
            <div
              className="w-4 h-4 rounded-full bg-violet-600 border-2 border-white cursor-grab active:cursor-grabbing shadow-lg hover:scale-125 transition-transform touch-none"
              onPointerDown={(e) => handlePointerDown(e, 'rot')}
            />
            <div className="w-[1.5px] h-4 bg-violet-500" />
            {isTransforming && (
              <div className="absolute -top-6 bg-neutral-900 text-[10px] text-white px-1.5 py-0.5 rounded shadow border border-white/20 whitespace-nowrap">
                {currentAngle}°
              </div>
            )}
          </div>
        )}

        {/* 8 Resize Handles */}
        {!element.locked && (
          <>
            <div
              className={`${handleStyle} -top-1.5 -left-1.5 cursor-nwse-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'nw')}
            />
            <div
              className={`${handleStyle} -top-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'n')}
            />
            <div
              className={`${handleStyle} -top-1.5 -right-1.5 cursor-nesw-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'ne')}
            />
            <div
              className={`${handleStyle} top-1/2 -translate-y-1/2 -right-1.5 cursor-ew-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'e')}
            />
            <div
              className={`${handleStyle} -bottom-1.5 -right-1.5 cursor-nwse-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'se')}
            />
            <div
              className={`${handleStyle} -bottom-1.5 left-1/2 -translate-x-1/2 cursor-ns-resize`}
              onPointerDown={(e) => handlePointerDown(e, 's')}
            />
            <div
              className={`${handleStyle} -bottom-1.5 -left-1.5 cursor-nesw-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'sw')}
            />
            <div
              className={`${handleStyle} top-1/2 -translate-y-1/2 -left-1.5 cursor-ew-resize`}
              onPointerDown={(e) => handlePointerDown(e, 'w')}
            />
          </>
        )}
      </div>
    </div>
  );
};
