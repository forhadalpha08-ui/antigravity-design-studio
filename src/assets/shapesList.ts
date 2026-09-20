import { ShapeType } from '../types/canvas';

export interface ShapeItem {
  id: string;
  name: string;
  shapeType: ShapeType;
  category: 'basic' | 'geometric' | 'badges' | 'decorative';
  defaultWidth: number;
  defaultHeight: number;
  borderRadius?: number;
  defaultFill: string;
  defaultStroke?: string;
  defaultStrokeWidth?: number;
}

export const AVAILABLE_SHAPES: ShapeItem[] = [
  // Basic
  {
    id: 'shape-rect',
    name: 'Rectangle',
    shapeType: 'rectangle',
    category: 'basic',
    defaultWidth: 300,
    defaultHeight: 200,
    borderRadius: 0,
    defaultFill: '#8b5cf6',
  },
  {
    id: 'shape-rounded-rect',
    name: 'Rounded Box',
    shapeType: 'rectangle',
    category: 'basic',
    defaultWidth: 280,
    defaultHeight: 180,
    borderRadius: 24,
    defaultFill: '#3b82f6',
  },
  {
    id: 'shape-circle',
    name: 'Circle',
    shapeType: 'circle',
    category: 'basic',
    defaultWidth: 240,
    defaultHeight: 240,
    defaultFill: '#ec4899',
  },
  {
    id: 'shape-pill',
    name: 'Pill / Button',
    shapeType: 'pill',
    category: 'basic',
    defaultWidth: 260,
    defaultHeight: 80,
    defaultFill: '#10b981',
  },

  // Geometric
  {
    id: 'shape-triangle',
    name: 'Triangle',
    shapeType: 'triangle',
    category: 'geometric',
    defaultWidth: 220,
    defaultHeight: 200,
    defaultFill: '#f59e0b',
  },
  {
    id: 'shape-star',
    name: 'Star Badge',
    shapeType: 'star',
    category: 'geometric',
    defaultWidth: 220,
    defaultHeight: 220,
    defaultFill: '#fbbf24',
  },
  {
    id: 'shape-diamond',
    name: 'Diamond Rhombus',
    shapeType: 'diamond',
    category: 'geometric',
    defaultWidth: 200,
    defaultHeight: 200,
    defaultFill: '#06b6d4',
  },

  // Badges & Decorative
  {
    id: 'shape-heart',
    name: 'Heart',
    shapeType: 'heart',
    category: 'decorative',
    defaultWidth: 220,
    defaultHeight: 200,
    defaultFill: '#f43f5e',
  },
];

export interface DecorativeBadge {
  id: string;
  name: string;
  category: string;
  svgPath: string;
}

export const VECTOR_ICONS = [
  'Sparkles',
  'Crown',
  'Zap',
  'Star',
  'Heart',
  'Flame',
  'Award',
  'CheckCircle2',
  'Compass',
  'Globe',
  'ShieldCheck',
  'Camera',
  'Music',
  'Headphones',
  'Coffee',
  'ShoppingBag',
  'Gift',
  'TrendingUp',
  'Cpu',
  'Smartphone',
  'Tv',
  'Play',
  'Send',
  'Eye',
  'Layers',
  'Palette',
];
