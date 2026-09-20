export type ElementType = 
  | 'text' 
  | 'shape' 
  | 'image' 
  | 'line' 
  | 'icon' 
  | 'badge'
  | 'draw'
  | 'chart'
  | 'table'
  | 'qr-code';

export type ShapeType = 
  | 'rectangle' 
  | 'circle' 
  | 'triangle' 
  | 'star' 
  | 'polygon' 
  | 'pill' 
  | 'badge' 
  | 'heart' 
  | 'blob' 
  | 'diamond'
  | 'arrow';

export type AnimationType = 
  | 'none'
  | 'fade'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale'
  | 'zoom'
  | 'rotate'
  | 'bounce'
  | 'float'
  | 'pulse';

export interface GradientStop {
  color: string;
  offset: number; // 0 to 100
}

export interface GradientFill {
  type: 'linear' | 'radial';
  angle: number; // 0 to 360
  stops: GradientStop[];
}

export interface ShadowEffect {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
}

export interface GlowEffect {
  enabled: boolean;
  color: string;
  blur: number;
}

export interface ImageFilters {
  brightness: number; // 50 to 150, default 100
  contrast: number;   // 50 to 150, default 100
  saturation: number; // 0 to 200, default 100
  blur: number;       // 0 to 20, default 0
  grayscale: number;  // 0 to 100, default 0
  duotoneEnabled: boolean;
  duotoneColor1?: string;
  duotoneColor2?: string;
}

export interface BaseElement {
  id: string;
  name: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees 0-360
  opacity: number;  // 0-1
  zIndex: number;
  locked: boolean;
  hidden: boolean;
  groupId?: string; // For multi-element grouping
  shadow?: ShadowEffect;
  glow?: GlowEffect;
  blur?: number; // backdrop / element blur
  animation?: {
    type: AnimationType;
    duration: number; // in seconds, e.g. 0.8
    delay: number;    // in seconds
    easing?: string;
  };
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string; // 300, 400, 600, 700, 900
  fontStyle?: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number; // px
  lineHeight: number;   // multiplier, e.g. 1.2
  color: string;
  gradientText?: GradientFill;
  strokeColor?: string;
  strokeWidth?: number;
  textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string; // hex/rgb or transparent
  gradientFill?: GradientFill;
  strokeColor?: string;
  strokeWidth?: number;
  strokeDash?: 'solid' | 'dashed' | 'dotted';
  borderRadius?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  objectFit: 'cover' | 'contain' | 'fill';
  flipX: boolean;
  flipY: boolean;
  filters: ImageFilters;
  maskShape?: 'none' | 'circle' | 'squircle' | 'arch' | 'star' | 'badge';
  borderRadius?: number;
}

export interface LineElement extends BaseElement {
  type: 'line';
  strokeColor: string;
  strokeWidth: number;
  strokeDash?: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
}

export interface IconElement extends BaseElement {
  type: 'icon';
  iconName: string;
  color: string;
  strokeWidth?: number;
}

// 1. Draw / Pen Tool
export type BrushType = 'pen' | 'marker' | 'highlighter' | 'eraser';

export interface DrawPoint {
  x: number;
  y: number;
}

export interface DrawElement extends BaseElement {
  type: 'draw';
  points: DrawPoint[];
  strokeColor: string;
  strokeWidth: number;
  brushType: BrushType;
  pathData?: string;
}

// 2. Charts
export type ChartType = 'bar' | 'column' | 'donut' | 'pie' | 'line' | 'area' | 'progress';

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartElement extends BaseElement {
  type: 'chart';
  chartType: ChartType;
  data: ChartDataPoint[];
  title?: string;
  showLegend?: boolean;
  showValues?: boolean;
}

// 3. Tables
export interface TableCell {
  text: string;
  bg?: string;
  color?: string;
  bold?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableElement extends BaseElement {
  type: 'table';
  rows: number;
  cols: number;
  cells: TableCell[][];
  hasHeaderRow?: boolean;
  headerBg?: string;
  headerColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

// 4. QR Codes
export interface QrCodeElement extends BaseElement {
  type: 'qr-code';
  data: string;
  fgColor: string;
  bgColor: string;
  margin?: number;
}

// 5. Comments & Annotations
export interface CommentReply {
  id: string;
  author: string;
  avatarColor: string;
  text: string;
  createdAt: number;
}

export interface CommentThread {
  id: string;
  x: number;
  y: number;
  author: string;
  avatarColor: string;
  text: string;
  createdAt: number;
  resolved: boolean;
  replies?: CommentReply[];
}

export type CanvasElement = 
  | TextElement 
  | ShapeElement 
  | ImageElement 
  | LineElement 
  | IconElement
  | DrawElement
  | ChartElement
  | TableElement
  | QrCodeElement;

export type BackgroundType = 
  | 'solid'
  | 'linear-gradient'
  | 'radial-gradient'
  | 'mesh'
  | 'conic'
  | 'aurora'
  | 'noise'
  | 'geometric'
  | 'liquid'
  | 'glass'
  | 'dark-luxury'
  | 'neon'
  | 'metallic'
  | 'sunset';

export interface CanvasBackground {
  type: BackgroundType;
  color: string;
  gradient?: GradientFill;
  secondaryColor?: string;
  tertiaryColor?: string;
  accentColor?: string;
  patternOpacity?: number;
}

export interface CanvasPreset {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  iconName: string;
  popular?: boolean;
}

export interface Project {
  id: string;
  title: string;
  width: number;
  height: number;
  background: CanvasBackground;
  elements: CanvasElement[];
  category: string;
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  isFavorite?: boolean;
  comments?: CommentThread[];
}

export interface Template {
  id: string;
  title: string;
  category: string;
  tags: string[];
  width: number;
  height: number;
  background: CanvasBackground;
  elements: CanvasElement[];
  thumbnailGradient?: string;
  isPremium?: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface BrandKit {
  name: string;
  colors: string[];
  fonts: {
    heading: string;
    subheading: string;
    body: string;
  };
  logos: string[];
}
