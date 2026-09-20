import React, { useState } from 'react';
import {
  Project,
  CanvasElement,
  TextElement,
  ShapeElement,
  ImageElement,
  LineElement,
  DrawElement,
  ChartElement,
  TableElement,
  QrCodeElement,
} from '../../types/canvas';
import { getBackgroundStyle, gradientToCss } from '../../utils/color';
import * as LucideIcons from 'lucide-react';
import { RenderDraw } from './renderers/RenderDraw';
import { RenderChart } from './renderers/RenderChart';
import { RenderTable } from './renderers/RenderTable';
import { RenderQrCode } from './renderers/RenderQrCode';
import { RenderComments } from './renderers/RenderComments';

interface CanvasRendererProps {
  project: Project;
  selectedId: string | null;
  selectedIds?: string[];
  onSelectElement: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  isPlayingAnimation?: boolean;
  showComments?: boolean;
  activeCommentId?: string | null;
  onSelectComment?: (id: string) => void;
}

export const CanvasRenderer: React.FC<CanvasRendererProps> = ({
  project,
  selectedId,
  selectedIds = [],
  onSelectElement,
  onUpdateElement,
  isPlayingAnimation = false,
  showComments = true,
  activeCommentId = null,
  onSelectComment = () => {},
}) => {
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const bgStyle = getBackgroundStyle(project.background);

  const sortedElements = [...project.elements]
    .filter((el) => !el.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div
      className="relative select-none shadow-2xl transition-all"
      style={{
        width: `${project.width}px`,
        height: `${project.height}px`,
        ...bgStyle,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onSelectElement('', e);
          setEditingTextId(null);
        }
      }}
    >
      {sortedElements.map((el) => {
        const isSelected = selectedId === el.id || selectedIds.includes(el.id);

        // Animation classes / inline styles
        let animStyle: React.CSSProperties = {};
        if (isPlayingAnimation && el.animation && el.animation.type !== 'none') {
          const dur = el.animation.duration || 0.8;
          const del = el.animation.delay || 0;
          animStyle = {
            transition: `all ${dur}s cubic-bezier(0.16, 1, 0.3, 1) ${del}s`,
          };
        }

        // Shadow & Glow effects
        let filterStr = '';
        if (el.shadow?.enabled) {
          filterStr += `drop-shadow(${el.shadow.offsetX}px ${el.shadow.offsetY}px ${el.shadow.blur}px ${el.shadow.color}) `;
        }
        if (el.glow?.enabled) {
          filterStr += `drop-shadow(0px 0px ${el.glow.blur}px ${el.glow.color}) `;
        }
        if (el.blur && el.blur > 0) {
          filterStr += `blur(${el.blur}px) `;
        }

        return (
          <div
            key={el.id}
            data-element-id={el.id}
            className={`absolute transition-transform ${
              isSelected ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-transparent' : ''
            }`}
            style={{
              left: `${el.x}px`,
              top: `${el.y}px`,
              width: `${el.width}px`,
              height: `${el.height}px`,
              transform: `rotate(${el.rotation || 0}deg)`,
              opacity: el.opacity,
              zIndex: el.zIndex,
              filter: filterStr.trim() || undefined,
              cursor: el.locked ? 'not-allowed' : 'move',
              ...animStyle,
            }}
            onMouseDown={(e) => {
              if (editingTextId === el.id) return;
              e.stopPropagation();
              onSelectElement(el.id, e);
            }}
            onTouchStart={(e) => {
              if (editingTextId === el.id) return;
              onSelectElement(el.id, e);
            }}
            onDoubleClick={(e) => {
              if (el.type === 'text') {
                e.stopPropagation();
                setEditingTextId(el.id);
              }
            }}
          >
            {/* TEXT ELEMENT */}
            {el.type === 'text' && (
              <RenderText
                element={el as TextElement}
                isEditing={editingTextId === el.id}
                onFinishEditing={(newText) => {
                  setEditingTextId(null);
                  onUpdateElement(el.id, { text: newText });
                }}
              />
            )}

            {/* SHAPE ELEMENT */}
            {el.type === 'shape' && <RenderShape element={el as ShapeElement} />}

            {/* IMAGE ELEMENT */}
            {el.type === 'image' && <RenderImage key={(el as ImageElement).src} element={el as ImageElement} />}

            {/* LINE ELEMENT */}
            {el.type === 'line' && <RenderLine element={el as LineElement} />}

            {/* ICON ELEMENT */}
            {el.type === 'icon' && <RenderIcon element={el as any} />}

            {/* DRAW / PEN ELEMENT */}
            {el.type === 'draw' && <RenderDraw element={el as DrawElement} />}

            {/* CHART ELEMENT */}
            {el.type === 'chart' && <RenderChart element={el as ChartElement} />}

            {/* TABLE ELEMENT */}
            {el.type === 'table' && (
              <RenderTable
                element={el as TableElement}
                onUpdateElement={onUpdateElement}
              />
            )}

            {/* QR CODE ELEMENT */}
            {el.type === 'qr-code' && <RenderQrCode element={el as QrCodeElement} />}
          </div>
        );
      })}

      {/* COMMENTS PIN BADGES ON CANVAS */}
      {showComments && (
        <RenderComments
          comments={project.comments}
          activeCommentId={activeCommentId}
          onSelectComment={onSelectComment}
        />
      )}
    </div>
  );
};

// Renderers for specific types
const RenderText: React.FC<{
  element: TextElement;
  isEditing: boolean;
  onFinishEditing: (text: string) => void;
}> = ({ element, isEditing, onFinishEditing }) => {
  const [tempText, setTempText] = useState(element.text);

  let textTransformStyle = element.textTransform || 'none';
  let fontStyle = element.fontStyle || 'normal';
  let textDecoration = element.textDecoration || 'none';

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={tempText}
        onChange={(e) => setTempText(e.target.value)}
        onBlur={() => onFinishEditing(tempText)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onFinishEditing(tempText);
        }}
        className="w-full h-full bg-black/60 text-white outline-none resize-none p-1 border border-violet-500 rounded"
        style={{
          fontFamily: element.fontFamily,
          fontSize: `${element.fontSize}px`,
          fontWeight: element.fontWeight,
          textAlign: element.textAlign,
          lineHeight: element.lineHeight,
          letterSpacing: `${element.letterSpacing}px`,
          textTransform: textTransformStyle,
        }}
      />
    );
  }

  const gradientFill = element.gradientText ? gradientToCss(element.gradientText) : undefined;

  return (
    <div
      className="w-full h-full whitespace-pre-wrap select-none overflow-hidden"
      style={{
        fontFamily: element.fontFamily,
        fontSize: `${element.fontSize}px`,
        fontWeight: element.fontWeight,
        fontStyle,
        textDecoration,
        textAlign: element.textAlign,
        lineHeight: element.lineHeight,
        letterSpacing: `${element.letterSpacing}px`,
        color: gradientFill ? 'transparent' : element.color,
        background: gradientFill,
        WebkitBackgroundClip: gradientFill ? 'text' : undefined,
        textTransform: textTransformStyle,
        WebkitTextStroke:
          element.strokeColor && element.strokeWidth
            ? `${element.strokeWidth}px ${element.strokeColor}`
            : undefined,
      }}
    >
      {element.text}
    </div>
  );
};

const RenderShape: React.FC<{ element: ShapeElement }> = ({ element }) => {
  const fill =
    element.gradientFill && element.gradientFill.stops.length > 0
      ? gradientToCss(element.gradientFill)
      : element.fill;

  const strokeDash =
    element.strokeDash === 'dashed'
      ? '8 6'
      : element.strokeDash === 'dotted'
      ? '3 3'
      : undefined;

  switch (element.shapeType) {
    case 'circle':
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: fill,
            border: element.strokeWidth
              ? `${element.strokeWidth}px ${element.strokeDash || 'solid'} ${element.strokeColor}`
              : 'none',
          }}
        />
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon
            points="50,0 100,100 0,100"
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
            strokeDasharray={strokeDash}
          />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <polygon
            points="50,0 63,35 100,35 69,57 81,92 50,70 19,92 31,57 0,35 37,35"
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
          />
        </svg>
      );

    case 'diamond':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polygon
            points="50,0 100,50 50,100 0,50"
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
          />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <path
            d="M50,25 C50,0 0,0 0,40 C0,75 50,87.5 50,100 C50,87.5 100,75 100,40 C100,0 50,0 50,25 Z"
            fill={element.fill}
            stroke={element.strokeColor}
            strokeWidth={element.strokeWidth}
          />
        </svg>
      );

    case 'pill':
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            background: fill,
            border: element.strokeWidth
              ? `${element.strokeWidth}px ${element.strokeDash || 'solid'} ${element.strokeColor}`
              : 'none',
          }}
        />
      );

    default: // rectangle
      return (
        <div
          className="w-full h-full"
          style={{
            background: fill,
            borderRadius: `${element.borderRadius || 0}px`,
            border: element.strokeWidth
              ? `${element.strokeWidth}px ${element.strokeDash || 'solid'} ${element.strokeColor}`
              : 'none',
          }}
        />
      );
  }
};

const RenderImage: React.FC<{ element: ImageElement }> = ({ element }) => {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [retrySrc, setRetrySrc] = useState(element.src);

  const f = element.filters || {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    grayscale: 0,
    duotoneEnabled: false,
  };

  const filterStyle = `
    brightness(${f.brightness}%)
    contrast(${f.contrast}%)
    saturate(${f.saturation}%)
    grayscale(${f.grayscale}%)
    blur(${f.blur}px)
  `;

  let clipClass = '';
  if (element.maskShape === 'circle') clipClass = 'rounded-full';
  else if (element.maskShape === 'squircle') clipClass = 'rounded-[28%]';

  const handleError = () => {
    // Try once more without cache buster, then give up
    if (retrySrc === element.src) {
      // Add a cache-bust param to retry
      const sep = element.src.includes('?') ? '&' : '?';
      setRetrySrc(`${element.src}${sep}_retry=1`);
    } else {
      setStatus('error');
    }
  };

  return (
    <div
      className={`w-full h-full relative overflow-hidden ${clipClass}`}
      style={{
        borderRadius: element.borderRadius ? `${element.borderRadius}px` : undefined,
      }}
    >
      {/* Loading shimmer — shown while image is fetching */}
      {status === 'loading' && (
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.04) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.8s infinite linear',
          }}
        />
      )}

      {/* Error fallback */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-neutral-900/80 text-neutral-500">
          <svg width="30%" height="30%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span className="text-[0.6em] text-center px-2">Image unavailable</span>
          <button
            className="text-[0.55em] text-violet-400 underline mt-0.5"
            onClick={(e) => { e.stopPropagation(); setStatus('loading'); setRetrySrc(`${element.src}?_r=${Date.now()}`); }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Actual image — fades in once loaded */}
      <img
        key={retrySrc}
        src={retrySrc}
        alt={element.name || 'Image'}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          objectFit: element.objectFit || 'cover',
          filter: filterStyle,
          transform: `scale(${element.flipX ? -1 : 1}, ${element.flipY ? -1 : 1})`,
          opacity: status === 'loaded' ? 1 : 0,
          transition: 'opacity 0.25s ease',
        }}
        loading="eager"
        decoding="async"
        onLoad={() => setStatus('loaded')}
        onError={handleError}
      />
    </div>
  );
};

const RenderLine: React.FC<{ element: LineElement }> = ({ element }) => {
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <div
        className="w-full"
        style={{
          height: `${element.strokeWidth || 2}px`,
          backgroundColor: element.strokeColor || '#ffffff',
        }}
      />
    </div>
  );
};

const RenderIcon: React.FC<{ element: any }> = ({ element }) => {
  const IconComp = (LucideIcons as any)[element.iconName] || LucideIcons.Sparkles;
  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none">
      <IconComp
        size={Math.min(element.width, element.height)}
        color={element.color || '#ffffff'}
        strokeWidth={element.strokeWidth || 2}
      />
    </div>
  );
};
