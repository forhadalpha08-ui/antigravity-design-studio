import { jsPDF } from 'jspdf';
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
} from '../types/canvas';
import { generateQrCode } from './qr';

export type ExportFormat = 'png' | 'jpg' | 'webp' | 'svg' | 'pdf';

export interface ExportOptions {
  format: ExportFormat;
  scale: 1 | 2 | 3 | 4;
  quality: number; // 0.1 to 1.0
  transparentBackground?: boolean;
}

// Helper to load image
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // In case cross-origin fails, try again without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = () => reject(new Error('Failed to load image'));
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

// Trigger file download
export function triggerDownload(blob: Blob | string, filename: string): void {
  const url = typeof blob === 'string' ? blob : URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  if (typeof blob !== 'string') {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}

// Render Project to offscreen HTML5 Canvas
export async function renderProjectToCanvas(
  project: Project,
  scale = 1,
  transparentBg = false
): Promise<HTMLCanvasElement> {
  const width = project.width * scale;
  const height = project.height * scale;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not obtain canvas 2D context');

  ctx.scale(scale, scale);

  // 1. Draw Background
  if (!transparentBg) {
    const bg = project.background;
    ctx.save();
    if (bg.type === 'solid') {
      ctx.fillStyle = bg.color || '#090a0f';
      ctx.fillRect(0, 0, project.width, project.height);
    } else if (bg.type === 'linear-gradient' && bg.gradient) {
      const angle = (bg.gradient.angle || 0) * (Math.PI / 180);
      const x1 = project.width / 2 - (Math.cos(angle) * project.width) / 2;
      const y1 = project.height / 2 - (Math.sin(angle) * project.height) / 2;
      const x2 = project.width / 2 + (Math.cos(angle) * project.width) / 2;
      const y2 = project.height / 2 + (Math.sin(angle) * project.height) / 2;

      const grad = ctx.createLinearGradient(x1, y1, x2, y2);
      bg.gradient.stops.forEach((s) => {
        grad.addColorStop(s.offset / 100, s.color);
      });
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, project.width, project.height);
    } else {
      // General gradient or styled background
      ctx.fillStyle = bg.color || '#0b0c14';
      ctx.fillRect(0, 0, project.width, project.height);

      if (bg.secondaryColor) {
        const rad = ctx.createRadialGradient(
          project.width * 0.2,
          project.height * 0.2,
          10,
          project.width * 0.5,
          project.height * 0.5,
          project.width * 0.8
        );
        rad.addColorStop(0, bg.secondaryColor);
        rad.addColorStop(1, 'transparent');
        ctx.fillStyle = rad;
        ctx.fillRect(0, 0, project.width, project.height);
      }
      if (bg.accentColor) {
        const rad2 = ctx.createRadialGradient(
          project.width * 0.8,
          project.height * 0.8,
          10,
          project.width * 0.6,
          project.height * 0.6,
          project.width * 0.7
        );
        rad2.addColorStop(0, bg.accentColor);
        rad2.addColorStop(1, 'transparent');
        ctx.fillStyle = rad2;
        ctx.fillRect(0, 0, project.width, project.height);
      }
    }
    ctx.restore();
  }

  // 2. Sort elements by zIndex
  const sortedElements = [...project.elements]
    .filter((el) => !el.hidden)
    .sort((a, b) => a.zIndex - b.zIndex);

  // 3. Render each element
  for (const el of sortedElements) {
    ctx.save();
    ctx.globalAlpha = el.opacity;

    // Element transformation
    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;
    ctx.translate(centerX, centerY);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.translate(-el.width / 2, -el.height / 2);

    // Apply shadow if enabled
    if (el.shadow?.enabled) {
      ctx.shadowColor = el.shadow.color;
      ctx.shadowBlur = el.shadow.blur;
      ctx.shadowOffsetX = el.shadow.offsetX;
      ctx.shadowOffsetY = el.shadow.offsetY;
    }

    if (el.type === 'shape') {
      drawShape(ctx, el);
    } else if (el.type === 'text') {
      drawText(ctx, el);
    } else if (el.type === 'image') {
      await drawImage(ctx, el);
    } else if (el.type === 'line') {
      drawLine(ctx, el);
    } else if (el.type === 'draw') {
      drawStroke(ctx, el as DrawElement);
    } else if (el.type === 'chart') {
      drawChart(ctx, el as ChartElement);
    } else if (el.type === 'table') {
      drawTable(ctx, el as TableElement);
    } else if (el.type === 'qr-code') {
      drawQrCode(ctx, el as QrCodeElement);
    }

    ctx.restore();
  }

  return canvas;
}

function drawShape(ctx: CanvasRenderingContext2D, el: ShapeElement) {
  ctx.save();
  ctx.beginPath();

  // Create fill
  if (el.gradientFill && el.gradientFill.stops.length > 0) {
    const angle = (el.gradientFill.angle || 0) * (Math.PI / 180);
    const x1 = el.width / 2 - (Math.cos(angle) * el.width) / 2;
    const y1 = el.height / 2 - (Math.sin(angle) * el.height) / 2;
    const x2 = el.width / 2 + (Math.cos(angle) * el.width) / 2;
    const y2 = el.height / 2 + (Math.sin(angle) * el.height) / 2;
    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    el.gradientFill.stops.forEach((s) => grad.addColorStop(s.offset / 100, s.color));
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = el.fill || '#ffffff';
  }

  const radius = el.borderRadius || 0;

  switch (el.shapeType) {
    case 'circle': {
      ctx.ellipse(el.width / 2, el.height / 2, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
      break;
    }
    case 'triangle': {
      ctx.moveTo(el.width / 2, 0);
      ctx.lineTo(el.width, el.height);
      ctx.lineTo(0, el.height);
      ctx.closePath();
      break;
    }
    case 'star': {
      const cx = el.width / 2;
      const cy = el.height / 2;
      const spikes = 5;
      const outerRadius = Math.min(cx, cy);
      const innerRadius = outerRadius / 2.2;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerRadius;
        let y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      break;
    }
    case 'diamond': {
      ctx.moveTo(el.width / 2, 0);
      ctx.lineTo(el.width, el.height / 2);
      ctx.lineTo(el.width / 2, el.height);
      ctx.lineTo(0, el.height / 2);
      ctx.closePath();
      break;
    }
    case 'heart': {
      const w = el.width;
      const h = el.height;
      ctx.moveTo(w / 2, h / 4);
      ctx.bezierCurveTo(w / 2, 0, 0, 0, 0, h / 2.4);
      ctx.bezierCurveTo(0, (h * 3) / 4, w / 2, (h * 7) / 8, w / 2, h);
      ctx.bezierCurveTo(w / 2, (h * 7) / 8, w, (h * 3) / 4, w, h / 2.4);
      ctx.bezierCurveTo(w, 0, w / 2, 0, w / 2, h / 4);
      ctx.closePath();
      break;
    }
    case 'pill': {
      const pillRadius = Math.min(el.width, el.height) / 2;
      ctx.roundRect(0, 0, el.width, el.height, pillRadius);
      break;
    }
    default: {
      // Rectangle with possible radius
      if (radius > 0) {
        ctx.roundRect(0, 0, el.width, el.height, radius);
      } else {
        ctx.rect(0, 0, el.width, el.height);
      }
      break;
    }
  }

  if (el.fill !== 'transparent') {
    ctx.fill();
  }

  if (el.strokeColor && el.strokeWidth && el.strokeWidth > 0) {
    ctx.strokeStyle = el.strokeColor;
    ctx.lineWidth = el.strokeWidth;
    if (el.strokeDash === 'dashed') ctx.setLineDash([8, 6]);
    else if (el.strokeDash === 'dotted') ctx.setLineDash([3, 3]);
    ctx.stroke();
  }

  ctx.restore();
}

function drawText(ctx: CanvasRenderingContext2D, el: TextElement) {
  ctx.save();

  let text = el.text || '';
  if (el.textTransform === 'uppercase') text = text.toUpperCase();
  else if (el.textTransform === 'lowercase') text = text.toLowerCase();
  else if (el.textTransform === 'capitalize') {
    text = text.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  const fontStyle = el.fontStyle === 'italic' ? 'italic' : 'normal';
  const fontWeight = el.fontWeight || 400;
  const fontSize = el.fontSize || 24;
  const fontFamily = el.fontFamily || "'Inter', sans-serif";

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
  ctx.textAlign = (el.textAlign === 'justify' ? 'left' : el.textAlign) || 'left';
  ctx.textBaseline = 'top';

  let alignX = 0;
  if (el.textAlign === 'center') alignX = el.width / 2;
  else if (el.textAlign === 'right') alignX = el.width;

  const lines = text.split('\n');
  const lineHeightPx = fontSize * (el.lineHeight || 1.2);

  ctx.fillStyle = el.color || '#ffffff';

  lines.forEach((line, index) => {
    const lineY = index * lineHeightPx;
    if (el.strokeColor && el.strokeWidth && el.strokeWidth > 0) {
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.strokeText(line, alignX, lineY);
    }
    ctx.fillText(line, alignX, lineY);
  });

  ctx.restore();
}

async function drawImage(ctx: CanvasRenderingContext2D, el: ImageElement) {
  try {
    const img = await loadImage(el.src);
    ctx.save();

    // Clip mask if specified
    if (el.maskShape === 'circle') {
      ctx.beginPath();
      ctx.ellipse(el.width / 2, el.height / 2, el.width / 2, el.height / 2, 0, 0, Math.PI * 2);
      ctx.clip();
    } else if (el.maskShape === 'squircle') {
      ctx.beginPath();
      ctx.roundRect(0, 0, el.width, el.height, Math.min(el.width, el.height) * 0.28);
      ctx.clip();
    } else if (el.borderRadius && el.borderRadius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, el.width, el.height, el.borderRadius);
      ctx.clip();
    }

    // Flips
    if (el.flipX || el.flipY) {
      ctx.translate(el.flipX ? el.width : 0, el.flipY ? el.height : 0);
      ctx.scale(el.flipX ? -1 : 1, el.flipY ? -1 : 1);
    }

    // Filter effects
    const filters: string[] = [];
    if (el.filters?.brightness && el.filters.brightness !== 100) {
      filters.push(`brightness(${el.filters.brightness}%)`);
    }
    if (el.filters?.contrast && el.filters.contrast !== 100) {
      filters.push(`contrast(${el.filters.contrast}%)`);
    }
    if (el.filters?.saturation && el.filters.saturation !== 100) {
      filters.push(`saturate(${el.filters.saturation}%)`);
    }
    if (el.filters?.grayscale && el.filters.grayscale > 0) {
      filters.push(`grayscale(${el.filters.grayscale}%)`);
    }
    if (el.filters?.blur && el.filters.blur > 0) {
      filters.push(`blur(${el.filters.blur}px)`);
    }
    if (filters.length > 0) {
      ctx.filter = filters.join(' ');
    }

    ctx.drawImage(img, 0, 0, el.width, el.height);
    ctx.restore();
  } catch (err) {
    console.error('Failed to draw image to export canvas', err);
    // Draw placeholder fallback
    ctx.fillStyle = '#22232b';
    ctx.fillRect(0, 0, el.width, el.height);
  }
}

function drawLine(ctx: CanvasRenderingContext2D, el: LineElement) {
  ctx.save();
  ctx.beginPath();
  ctx.strokeStyle = el.strokeColor || '#ffffff';
  ctx.lineWidth = el.strokeWidth || 2;
  if (el.strokeDash === 'dashed') ctx.setLineDash([8, 6]);
  else if (el.strokeDash === 'dotted') ctx.setLineDash([3, 3]);

  ctx.moveTo(0, el.height / 2);
  ctx.lineTo(el.width, el.height / 2);
  ctx.stroke();

  // Draw arrowheads if requested
  if (el.arrowEnd) {
    ctx.beginPath();
    ctx.fillStyle = el.strokeColor || '#ffffff';
    ctx.moveTo(el.width, el.height / 2);
    ctx.lineTo(el.width - 12, el.height / 2 - 6);
    ctx.lineTo(el.width - 12, el.height / 2 + 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

function drawStroke(ctx: CanvasRenderingContext2D, el: DrawElement) {
  const pts = el.points;
  if (!pts || pts.length === 0) return;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    ctx.quadraticCurveTo(pts[i].x, pts[i].y, xc, yc);
  }
  if (pts.length > 1) {
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
  }

  ctx.strokeStyle = el.strokeColor || '#8b5cf6';
  ctx.lineWidth = el.strokeWidth || 4;
  ctx.lineCap = el.brushType === 'highlighter' || el.brushType === 'marker' ? 'square' : 'round';
  ctx.lineJoin = 'round';
  if (el.brushType === 'highlighter') {
    ctx.globalAlpha *= 0.45;
  }
  ctx.stroke();
  ctx.restore();
}

function drawQrCode(ctx: CanvasRenderingContext2D, el: QrCodeElement) {
  const size = Math.min(el.width, el.height);
  const qr = generateQrCode(el.data || 'https://af-canvas.app', size, el.fgColor, el.bgColor);
  const cellSize = size / qr.matrixSize;

  ctx.save();
  ctx.fillStyle = el.bgColor || '#000000';
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = el.fgColor || '#ffffff';
  for (let r = 0; r < qr.matrixSize; r++) {
    for (let c = 0; c < qr.matrixSize; c++) {
      if (qr.matrix[r][c]) {
        ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
  ctx.restore();
}

function drawChart(ctx: CanvasRenderingContext2D, el: ChartElement) {
  ctx.save();
  // Card BG
  ctx.fillStyle = '#111218';
  ctx.beginPath();
  ctx.roundRect(0, 0, el.width, el.height, 8);
  ctx.fill();
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Title
  if (el.title) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(el.title, el.width / 2, 22);
  }

  const data = el.data || [];
  if (data.length > 0) {
    const maxVal = Math.max(...data.map((d) => d.value), 1);
    const chartAreaY = el.title ? 36 : 16;
    const chartAreaH = el.height - chartAreaY - 24;
    const colW = (el.width - 40) / data.length;

    data.forEach((d, i) => {
      const x = 20 + i * colW + colW * 0.15;
      const barW = colW * 0.7;
      const h = (d.value / maxVal) * chartAreaH;
      const y = chartAreaY + chartAreaH - h;

      ctx.fillStyle = d.color || '#8b5cf6';
      ctx.beginPath();
      ctx.roundRect(x, y, barW, Math.max(2, h), 3);
      ctx.fill();

      // Label
      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label.slice(0, 5), x + barW / 2, chartAreaY + chartAreaH + 14);
    });
  }
  ctx.restore();
}

function drawTable(ctx: CanvasRenderingContext2D, el: TableElement) {
  const rows = el.rows || 3;
  const cols = el.cols || 3;
  const colW = el.width / cols;
  const rowH = el.height / rows;

  ctx.save();
  for (let r = 0; r < rows; r++) {
    const isHeader = el.hasHeaderRow && r === 0;
    for (let c = 0; c < cols; c++) {
      const cell = el.cells?.[r]?.[c] || { text: '' };
      const cellBg = isHeader
        ? el.headerBg || '#1e1b4b'
        : cell.bg || (r % 2 === 0 ? '#111218' : '#181920');

      ctx.fillStyle = cellBg;
      ctx.fillRect(c * colW, r * rowH, colW, rowH);

      ctx.strokeStyle = el.borderColor || '#374151';
      ctx.lineWidth = el.borderWidth || 1;
      ctx.strokeRect(c * colW, r * rowH, colW, rowH);

      const cellText = cell.text || '';
      ctx.fillStyle = isHeader ? el.headerColor || '#ffffff' : cell.color || '#e5e7eb';
      ctx.font = `${isHeader || cell.bold ? 'bold' : 'normal'} 10px Inter, sans-serif`;
      ctx.textAlign = cell.align || (isHeader ? 'center' : 'left');
      ctx.textBaseline = 'middle';

      const tx = cell.align === 'center' || isHeader ? c * colW + colW / 2 : c * colW + 8;
      ctx.fillText(cellText, tx, r * rowH + rowH / 2, colW - 12);
    }
  }
  ctx.restore();
}

// Generate Standalone Vector SVG String
export function generateSvgString(project: Project): string {
  const elementsSvg = project.elements
    .filter((el) => !el.hidden)
    .sort((a, b) => a.zIndex - b.zIndex)
    .map((el) => {
      const transform = `transform="translate(${el.x}, ${el.y}) rotate(${el.rotation || 0} ${el.width / 2} ${el.height / 2})" opacity="${el.opacity}"`;
      if (el.type === 'text') {
        const t = el as TextElement;
        return `<g ${transform}><text x="${t.textAlign === 'center' ? t.width / 2 : t.textAlign === 'right' ? t.width : 0}" y="${t.fontSize}" font-family="${t.fontFamily}" font-size="${t.fontSize}" font-weight="${t.fontWeight}" fill="${t.color}" text-anchor="${t.textAlign === 'center' ? 'middle' : t.textAlign === 'right' ? 'end' : 'start'}">${escapeXml(t.text)}</text></g>`;
      }
      if (el.type === 'shape') {
        const s = el as ShapeElement;
        return `<g ${transform}><rect width="${s.width}" height="${s.height}" rx="${s.borderRadius || 0}" fill="${s.fill}" stroke="${s.strokeColor || 'none'}" stroke-width="${s.strokeWidth || 0}" /></g>`;
      }
      if (el.type === 'image') {
        const img = el as ImageElement;
        return `<g ${transform}><image href="${img.src}" width="${img.width}" height="${img.height}" preserveAspectRatio="none" /></g>`;
      }
      if (el.type === 'draw') {
        const d = el as DrawElement;
        let dPath = '';
        if (d.points && d.points.length > 0) {
          dPath = `M ${d.points[0].x} ${d.points[0].y}`;
          for (let i = 1; i < d.points.length - 1; i++) {
            const xc = (d.points[i].x + d.points[i + 1].x) / 2;
            const yc = (d.points[i].y + d.points[i + 1].y) / 2;
            dPath += ` Q ${d.points[i].x} ${d.points[i].y}, ${xc} ${yc}`;
          }
          if (d.points.length > 1) {
            dPath += ` L ${d.points[d.points.length - 1].x} ${d.points[d.points.length - 1].y}`;
          }
        }
        return `<g ${transform}><path d="${dPath}" fill="none" stroke="${d.strokeColor || '#8b5cf6'}" stroke-width="${d.strokeWidth || 4}" stroke-linecap="round" stroke-linejoin="round" /></g>`;
      }
      if (el.type === 'qr-code') {
        const qr = el as QrCodeElement;
        const qrObj = generateQrCode(qr.data, Math.min(qr.width, qr.height), qr.fgColor, qr.bgColor);
        return `<g ${transform}>${qrObj.svgString}</g>`;
      }
      return '';
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${project.width} ${project.height}" width="${project.width}" height="${project.height}">
  <rect width="${project.width}" height="${project.height}" fill="${project.background.color || '#090a0f'}" />
  ${elementsSvg}
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

// Master Export Function
export async function exportProject(
  project: Project,
  options: ExportOptions
): Promise<void> {
  const filename = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'design'}_${Date.now()}.${options.format}`;

  if (options.format === 'svg') {
    const svgStr = generateSvgString(project);
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    triggerDownload(blob, filename);
    return;
  }

  const canvas = await renderProjectToCanvas(
    project,
    options.scale,
    options.transparentBackground
  );

  if (options.format === 'pdf') {
    const orientation = project.width > project.height ? 'landscape' : 'portrait';
    const pdf = new jsPDF({
      orientation,
      unit: 'px',
      format: [project.width, project.height],
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    pdf.addImage(imgData, 'JPEG', 0, 0, project.width, project.height);
    pdf.save(filename);
    return;
  }

  const mimeType =
    options.format === 'jpg'
      ? 'image/jpeg'
      : options.format === 'webp'
      ? 'image/webp'
      : 'image/png';

  canvas.toBlob(
    (blob) => {
      if (blob) {
        triggerDownload(blob, filename);
      }
    },
    mimeType,
    options.quality
  );
}
