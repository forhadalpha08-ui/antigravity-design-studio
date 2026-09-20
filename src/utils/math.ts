export interface Point {
  x: number;
  y: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SnapGuide {
  type: 'x' | 'y';
  position: number;
  label?: string;
}

// Snap rotation to nearest 45 degree angle if within threshold
export function snapAngle(deg: number, threshold = 4): number {
  let normalized = (deg % 360 + 360) % 360;
  const snapPoints = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  for (const p of snapPoints) {
    if (Math.abs(normalized - p) <= threshold) {
      return p === 360 ? 0 : p;
    }
  }
  return Math.round(normalized);
}

// Calculate smart snap guides against canvas edges & center
export function getSmartSnap(
  rect: Rect,
  canvasWidth: number,
  canvasHeight: number,
  threshold = 6
): { snappedX: number; snappedY: number; guides: SnapGuide[] } {
  let snappedX = rect.x;
  let snappedY = rect.y;
  const guides: SnapGuide[] = [];

  const centerX = rect.x + rect.width / 2;
  const centerY = rect.y + rect.height / 2;

  // Canvas Horizontal Center
  const canvasCenterX = canvasWidth / 2;
  if (Math.abs(centerX - canvasCenterX) <= threshold) {
    snappedX = canvasCenterX - rect.width / 2;
    guides.push({ type: 'x', position: canvasCenterX, label: 'Center' });
  } else if (Math.abs(rect.x) <= threshold) {
    // Left edge
    snappedX = 0;
    guides.push({ type: 'x', position: 0 });
  } else if (Math.abs(rect.x + rect.width - canvasWidth) <= threshold) {
    // Right edge
    snappedX = canvasWidth - rect.width;
    guides.push({ type: 'x', position: canvasWidth });
  }

  // Canvas Vertical Center
  const canvasCenterY = canvasHeight / 2;
  if (Math.abs(centerY - canvasCenterY) <= threshold) {
    snappedY = canvasCenterY - rect.height / 2;
    guides.push({ type: 'y', position: canvasCenterY, label: 'Center' });
  } else if (Math.abs(rect.y) <= threshold) {
    // Top edge
    snappedY = 0;
    guides.push({ type: 'y', position: 0 });
  } else if (Math.abs(rect.y + rect.height - canvasHeight) <= threshold) {
    // Bottom edge
    snappedY = canvasHeight - rect.height;
    guides.push({ type: 'y', position: canvasHeight });
  }

  return { snappedX, snappedY, guides };
}

// Clamp helper
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
