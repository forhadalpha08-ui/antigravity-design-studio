export type ElementType = 'text' | 'shape' | 'image' | 'line' | 'icon' | 'badge';

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

export type CanvasElement = 
  | TextElement 
  | ShapeElement 
  | ImageElement 
  | LineElement 
  | IconElement;

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
