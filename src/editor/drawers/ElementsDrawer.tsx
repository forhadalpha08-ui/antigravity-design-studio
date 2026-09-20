import React from 'react';
import { CanvasElement, ShapeType } from '../../types/canvas';
import { AVAILABLE_SHAPES, VECTOR_ICONS } from '../../assets/shapesList';
import { generateId } from '../../utils/id';
import * as LucideIcons from 'lucide-react';

interface ElementsDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddElement: (element: CanvasElement) => void;
}

export const ElementsDrawer: React.FC<ElementsDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  onAddElement,
}) => {
  const addShape = (shapeType: ShapeType, fill = '#8b5cf6', w = 280, h = 200, radius = 0) => {
    const el: CanvasElement = {
      id: generateId('shape'),
      name: `${shapeType.charAt(0).toUpperCase() + shapeType.slice(1)}`,
      type: 'shape',
      shapeType,
      x: Math.round((canvasWidth - w) / 2),
      y: Math.round((canvasHeight - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
      fill,
      borderRadius: radius,
    };
    onAddElement(el);
  };

  const addLine = (dashed = false, isArrow = false) => {
    const w = 400;
    const h = 20;
    const el: CanvasElement = {
      id: generateId('line'),
      name: isArrow ? 'Arrow Line' : 'Divider Line',
      type: 'line',
      x: Math.round((canvasWidth - w) / 2),
      y: Math.round((canvasHeight - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
      strokeColor: '#ffffff',
      strokeWidth: 3,
      strokeDash: dashed ? 'dashed' : 'solid',
      arrowEnd: isArrow,
    };
    onAddElement(el);
  };

  const addIcon = (iconName: string) => {
    const size = 120;
    const el: CanvasElement = {
      id: generateId('icon'),
      name: `${iconName} Icon`,
      type: 'icon',
      iconName,
      x: Math.round((canvasWidth - size) / 2),
      y: Math.round((canvasHeight - size) / 2),
      width: size,
      height: size,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
      color: '#c084fc',
      strokeWidth: 2,
    };
    onAddElement(el);
  };

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Elements & Vector Shapes
        </h2>
      </div>

      <div className="p-4 space-y-6">
        {/* Basic Shapes */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Shapes
          </span>
          <div className="grid grid-cols-3 gap-2">
            {AVAILABLE_SHAPES.map((shape) => (
              <button
                key={shape.id}
                onClick={() =>
                  addShape(
                    shape.shapeType,
                    shape.defaultFill,
                    shape.defaultWidth,
                    shape.defaultHeight,
                    shape.borderRadius
                  )
                }
                className="flex flex-col items-center justify-center p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl transition-all group"
              >
                <div
                  className="w-10 h-10 flex items-center justify-center mb-1.5 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: shape.defaultFill,
                    borderRadius:
                      shape.shapeType === 'circle' || shape.shapeType === 'pill'
                        ? '50%'
                        : shape.borderRadius
                        ? '8px'
                        : '2px',
                  }}
                />
                <span className="text-[10px] text-neutral-400 group-hover:text-white truncate">
                  {shape.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lines & Dividers */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Lines & Arrows
          </span>
          <div className="space-y-1.5">
            <button
              onClick={() => addLine(false, false)}
              className="w-full flex items-center gap-3 p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 transition-colors"
            >
              <div className="w-16 h-0.5 bg-white rounded" />
              <span>Solid Divider</span>
            </button>
            <button
              onClick={() => addLine(true, false)}
              className="w-full flex items-center gap-3 p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 transition-colors"
            >
              <div className="w-16 h-0.5 border-b-2 border-dashed border-white" />
              <span>Dashed Line</span>
            </button>
            <button
              onClick={() => addLine(false, true)}
              className="w-full flex items-center gap-3 p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-left text-xs text-neutral-300 transition-colors"
            >
              <div className="w-16 flex items-center">
                <div className="flex-1 h-0.5 bg-violet-400" />
                <div className="w-0 h-0 border-y-4 border-y-transparent border-l-[6px] border-l-violet-400" />
              </div>
              <span>Arrow Pointer</span>
            </button>
          </div>
        </div>

        {/* Vector Icons */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Vector Icons
          </span>
          <div className="grid grid-cols-4 gap-2">
            {VECTOR_ICONS.map((iconName) => {
              const IconComp = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
              return (
                <button
                  key={iconName}
                  title={iconName}
                  onClick={() => addIcon(iconName)}
                  className="flex flex-col items-center justify-center p-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-violet-500/50 rounded-xl transition-all group"
                >
                  <IconComp
                    size={20}
                    className="text-neutral-400 group-hover:text-violet-300 transition-colors"
                  />
                  <span className="text-[9px] text-neutral-500 mt-1 truncate max-w-full">
                    {iconName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
