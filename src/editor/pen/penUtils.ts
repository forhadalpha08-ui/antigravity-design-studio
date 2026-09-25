import { VectorAnchor } from '../../types/canvas';

/**
 * Converts an array of VectorAnchor points to an SVG Path 'd' string
 * supporting both sharp corners and cubic Bézier curves with handles.
 */
export function anchorsToSvgPath(anchors: VectorAnchor[], closed: boolean = false): string {
  if (!anchors || anchors.length === 0) return '';
  if (anchors.length === 1) {
    const p = anchors[0];
    return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)} L ${(p.x + 0.1).toFixed(2)} ${(p.y + 0.1).toFixed(2)}`;
  }

  let d = `M ${anchors[0].x.toFixed(2)} ${anchors[0].y.toFixed(2)}`;

  for (let i = 0; i < anchors.length - 1; i++) {
    const curr = anchors[i];
    const next = anchors[i + 1];

    const cp1x = curr.handleOut ? curr.x + curr.handleOut.x : curr.x;
    const cp1y = curr.handleOut ? curr.y + curr.handleOut.y : curr.y;
    const cp2x = next.handleIn ? next.x + next.handleIn.x : next.x;
    const cp2y = next.handleIn ? next.y + next.handleIn.y : next.y;

    const hasCurve =
      (curr.handleOut && (Math.abs(curr.handleOut.x) > 0.1 || Math.abs(curr.handleOut.y) > 0.1)) ||
      (next.handleIn && (Math.abs(next.handleIn.x) > 0.1 || Math.abs(next.handleIn.y) > 0.1));

    if (hasCurve) {
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
    } else {
      d += ` L ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
    }
  }

  if (closed && anchors.length >= 3) {
    const last = anchors[anchors.length - 1];
    const first = anchors[0];

    const cp1x = last.handleOut ? last.x + last.handleOut.x : last.x;
    const cp1y = last.handleOut ? last.y + last.handleOut.y : last.y;
    const cp2x = first.handleIn ? first.x + first.handleIn.x : first.x;
    const cp2y = first.handleIn ? first.y + first.handleIn.y : first.y;

    const hasCurve =
      (last.handleOut && (Math.abs(last.handleOut.x) > 0.1 || Math.abs(last.handleOut.y) > 0.1)) ||
      (first.handleIn && (Math.abs(first.handleIn.x) > 0.1 || Math.abs(first.handleIn.y) > 0.1));

    if (hasCurve) {
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${first.x.toFixed(2)} ${first.y.toFixed(2)} Z`;
    } else {
      d += ` L ${first.x.toFixed(2)} ${first.y.toFixed(2)} Z`;
    }
  }

  return d;
}

/**
 * Automatically calculates smooth Bézier handles (Curvature / Catmull-Rom fitting)
 * for a sequence of points clicked with the Curvature Pen tool or Freeform Pen tool.
 */
export function fitPointsToSmoothAnchors(
  points: { x: number; y: number }[],
  closed: boolean = false
): VectorAnchor[] {
  if (points.length === 0) return [];
  if (points.length === 1) {
    return [{ id: 'a_0', x: points[0].x, y: points[0].y, pointType: 'corner' }];
  }

  const tension = 0.35;
  const n = points.length;
  const anchors: VectorAnchor[] = [];

  for (let i = 0; i < n; i++) {
    const prev = closed ? points[(i - 1 + n) % n] : points[Math.max(0, i - 1)];
    const curr = points[i];
    const next = closed ? points[(i + 1) % n] : points[Math.min(n - 1, i + 1)];

    let handleIn: { x: number; y: number } | undefined = undefined;
    let handleOut: { x: number; y: number } | undefined = undefined;

    if (closed || (i > 0 && i < n - 1)) {
      const dx = (next.x - prev.x) * tension;
      const dy = (next.y - prev.y) * tension;
      handleIn = { x: -dx, y: -dy };
      handleOut = { x: dx, y: dy };
    } else if (i === 0 && !closed) {
      const dx = (next.x - curr.x) * tension;
      const dy = (next.y - curr.y) * tension;
      handleOut = { x: dx, y: dy };
    } else if (i === n - 1 && !closed) {
      const dx = (curr.x - prev.x) * tension;
      const dy = (curr.y - prev.y) * tension;
      handleIn = { x: -dx, y: -dy };
    }

    anchors.push({
      id: `a_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 4)}`,
      x: curr.x,
      y: curr.y,
      handleIn,
      handleOut,
      pointType: 'smooth',
    });
  }

  return anchors;
}

/**
 * Calculates bounding box for a set of VectorAnchor points (including handles)
 */
export function getAnchorsBoundingBox(anchors: VectorAnchor[]): {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
} {
  if (anchors.length === 0) {
    return { minX: 0, minY: 0, maxX: 100, maxY: 100, width: 100, height: 100 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  anchors.forEach((a) => {
    minX = Math.min(minX, a.x);
    minY = Math.min(minY, a.y);
    maxX = Math.max(maxX, a.x);
    maxY = Math.max(maxY, a.y);

    if (a.handleIn) {
      minX = Math.min(minX, a.x + a.handleIn.x);
      minY = Math.min(minY, a.y + a.handleIn.y);
      maxX = Math.max(maxX, a.x + a.handleIn.x);
      maxY = Math.max(maxY, a.y + a.handleIn.y);
    }
    if (a.handleOut) {
      minX = Math.min(minX, a.x + a.handleOut.x);
      minY = Math.min(minY, a.y + a.handleOut.y);
      maxX = Math.max(maxX, a.x + a.handleOut.x);
      maxY = Math.max(maxY, a.y + a.handleOut.y);
    }
  });

  const width = Math.max(20, maxX - minX);
  const height = Math.max(20, maxY - minY);

  return { minX, minY, maxX, maxY, width, height };
}

/**
 * Finds the closest point on any path segment to insert a new anchor point (Add Anchor Point tool)
 */
export function findClosestSegmentInsertionIndex(
  anchors: VectorAnchor[],
  clickPoint: { x: number; y: number },
  closed: boolean
): { insertIndex: number; distance: number } {
  let minDistance = Infinity;
  let insertIndex = anchors.length;

  const count = closed ? anchors.length : anchors.length - 1;
  for (let i = 0; i < count; i++) {
    const p1 = anchors[i];
    const p2 = anchors[(i + 1) % anchors.length];

    // Sample distance to line segment
    const dist = distToSegment(clickPoint, p1, p2);
    if (dist < minDistance) {
      minDistance = dist;
      insertIndex = i + 1;
    }
  }

  return { insertIndex, distance: minDistance };
}

function distToSegment(
  p: { x: number; y: number },
  v: { x: number; y: number },
  w: { x: number; y: number }
): number {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}
