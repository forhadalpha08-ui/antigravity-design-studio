import { CanvasBackground, GradientFill } from '../types/canvas';

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'luxury',
    name: 'Luxury Gold & Obsidian',
    colors: ['#0f0f11', '#1a1921', '#c5a059', '#e5c07b', '#f3e5ab', '#ffffff'],
  },
  {
    id: 'dark',
    name: 'Dark Velvet & Crimson',
    colors: ['#08080a', '#141419', '#8b0000', '#e50914', '#ff4d4d', '#f5f5f7'],
  },
  {
    id: 'minimal',
    name: 'Nordic Minimalist',
    colors: ['#121214', '#282830', '#71717a', '#a1a1aa', '#e4e4e7', '#fafafa'],
  },
  {
    id: 'fashion',
    name: 'High Fashion Mauve',
    colors: ['#18151c', '#342a42', '#865d8c', '#c084fc', '#f3e8ff', '#ffffff'],
  },
  {
    id: 'technology',
    name: 'Cyberpunk & AI Neon',
    colors: ['#090d16', '#00f2fe', '#4facfe', '#7928ca', '#ff0080', '#00ffcc'],
  },
  {
    id: 'corporate',
    name: 'Executive Slate',
    colors: ['#0b1329', '#1c2541', '#3a506b', '#00b4d8', '#90e0ef', '#ffffff'],
  },
  {
    id: 'sport',
    name: 'High-Impact Volt',
    colors: ['#0a0a0c', '#18181b', '#ccff00', '#ff5722', '#ff9800', '#ffffff'],
  },
  {
    id: 'creative',
    name: 'Artisan Vibrant',
    colors: ['#170f1c', '#ff0055', '#ff5400', '#ffbd00', '#00f0ff', '#7000ff'],
  },
];

export function gradientToCss(gradient?: GradientFill): string {
  if (!gradient || !gradient.stops || gradient.stops.length === 0) {
    return 'none';
  }
  const stopsStr = gradient.stops
    .map((s) => `${s.color} ${s.offset}%`)
    .join(', ');

  if (gradient.type === 'radial') {
    return `radial-gradient(circle at center, ${stopsStr})`;
  }
  return `linear-gradient(${gradient.angle}deg, ${stopsStr})`;
}

export function getBackgroundStyle(bg: CanvasBackground): React.CSSProperties {
  switch (bg.type) {
    case 'solid':
      return { backgroundColor: bg.color };

    case 'linear-gradient':
    case 'radial-gradient':
      return {
        background: gradientToCss(bg.gradient) || bg.color,
      };

    case 'mesh':
      return {
        backgroundColor: bg.color || '#090a10',
        backgroundImage: `
          radial-gradient(at 0% 0%, ${bg.secondaryColor || '#6366f1'} 0px, transparent 50%),
          radial-gradient(at 100% 0%, ${bg.accentColor || '#ec4899'} 0px, transparent 50%),
          radial-gradient(at 100% 100%, ${bg.tertiaryColor || '#3b82f6'} 0px, transparent 50%),
          radial-gradient(at 0% 100%, ${bg.secondaryColor || '#8b5cf6'} 0px, transparent 50%)
        `,
      };

    case 'aurora':
      return {
        backgroundColor: bg.color || '#050508',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, ${bg.secondaryColor || 'rgba(120, 119, 198, 0.45)'}, transparent),
          radial-gradient(ellipse 60% 50% at 80% 100%, ${bg.accentColor || 'rgba(56, 189, 248, 0.35)'}, transparent),
          radial-gradient(ellipse 50% 40% at 20% 80%, ${bg.tertiaryColor || 'rgba(168, 85, 247, 0.35)'}, transparent)
        `,
      };

    case 'dark-luxury':
      return {
        backgroundColor: bg.color || '#0b0c10',
        backgroundImage: `
          radial-gradient(circle at 50% 30%, rgba(197, 160, 89, 0.18), transparent 65%),
          radial-gradient(circle at 100% 100%, rgba(26, 25, 33, 0.8), transparent)
        `,
      };

    case 'neon':
      return {
        backgroundColor: bg.color || '#08080e',
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(0, 242, 254, 0.3) 0%, transparent 40%),
          radial-gradient(circle at 80% 80%, rgba(255, 0, 128, 0.35) 0%, transparent 40%)
        `,
      };

    case 'sunset':
      return {
        background: `linear-gradient(135deg, ${bg.color || '#1a0b2e'} 0%, ${bg.secondaryColor || '#801850'} 45%, ${bg.accentColor || '#ff6b4a'} 100%)`,
      };

    case 'metallic':
      return {
        backgroundColor: bg.color || '#18191e',
        backgroundImage: `
          repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px),
          linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.4) 100%)
        `,
      };

    case 'geometric':
      return {
        backgroundColor: bg.color || '#0d0e15',
        backgroundImage: `
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      };

    case 'noise':
      return {
        backgroundColor: bg.color || '#12131a',
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
        backgroundSize: '12px 12px',
      };

    case 'glass':
      return {
        backgroundColor: bg.color || '#0c0d14',
        backgroundImage: `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.12), transparent 70%)`,
      };

    default:
      return { backgroundColor: bg.color || '#121316' };
  }
}
