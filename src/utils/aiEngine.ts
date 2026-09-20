import { CanvasElement } from '../types/canvas';

// ============================================================================
// AI TOOL 1: SMART PALETTE GENERATOR
// ============================================================================

export interface AiPalette {
  name: string;
  mood: string;
  harmony: string;
  colors: string[];
}

const PRESET_PALETTES: { [keyword: string]: AiPalette } = {
  cyberpunk: {
    name: 'Cyberpunk Neon',
    mood: 'Futuristic & Electric',
    harmony: 'Triadic High-Contrast',
    colors: ['#0f051d', '#ff007f', '#00f0ff', '#7928ca', '#ffe600'],
  },
  luxury: {
    name: 'Obsidian & Champagne',
    mood: 'Opulent & Prestigious',
    harmony: 'Split-Complementary',
    colors: ['#0b0c10', '#1f2833', '#c5a059', '#e5c583', '#ffffff'],
  },
  minimalist: {
    name: 'Nordic Studio',
    mood: 'Clean & Architectural',
    harmony: 'Monochromatic Neutral',
    colors: ['#121316', '#2b2d35', '#6b7280', '#e5e7eb', '#f9fafb'],
  },
  coffee: {
    name: 'Artisan Espresso',
    mood: 'Warm & Cozy',
    harmony: 'Analogous Warm',
    colors: ['#23150d', '#4b2e1e', '#8c5836', '#d4a373', '#fefae0'],
  },
  nature: {
    name: 'Botanical Emerald',
    mood: 'Organic & Refreshing',
    harmony: 'Analogous Forest',
    colors: ['#0d1f18', '#1b4332', '#2d6a4f', '#52b788', '#d8f3dc'],
  },
  sunset: {
    name: 'Golden Hour Vista',
    mood: 'Romantic & Glowing',
    harmony: 'Analogous Radiant',
    colors: ['#2b0938', '#67134d', '#b83b5e', '#f08a5d', '#f9ed69'],
  },
  tech: {
    name: 'Quantum SaaS',
    mood: 'Dynamic & Precision',
    harmony: 'Complementary Modern',
    colors: ['#090d16', '#1e293b', '#3b82f6', '#6366f1', '#38bdf8'],
  },
  retro: {
    name: 'Vintage Synthwave',
    mood: 'Nostalgic & Funky',
    harmony: 'Tetradic Vibrant',
    colors: ['#1a102f', '#ff5964', '#f7b05b', '#35a7ff', '#38618c'],
  },
  pastel: {
    name: 'Candy Dream',
    mood: 'Soft & Playful',
    harmony: 'Pastel Light',
    colors: ['#1e1b2e', '#ffc6ff', '#bdb2ff', '#a0c4ff', '#caffbf'],
  },
  dark: {
    name: 'Midnight Velvet',
    mood: 'Deep & Enigmatic',
    harmony: 'Monochromatic Dark',
    colors: ['#050508', '#11121c', '#202234', '#8b5cf6', '#ede9fe'],
  },
};

// Generates an AI palette by parsing prompt keywords or algorithmic HSL math
export function generateSmartPalette(prompt: string): AiPalette {
  const p = prompt.toLowerCase().trim();

  // Keyword exact/partial matching
  for (const [key, palette] of Object.entries(PRESET_PALETTES)) {
    if (p.includes(key)) {
      return palette;
    }
  }

  // Algorithmic color harmony generator based on prompt hash
  let hash = 0;
  for (let i = 0; i < p.length; i++) {
    hash = (hash * 31 + p.charCodeAt(i)) & 0xffffffff;
  }
  const baseHue = Math.abs(hash % 360);

  // Convert HSL to Hex
  const hslToHex = (h: number, s: number, l: number): string => {
    const normalizedH = (h % 360 + 360) % 360;
    const c = (1 - Math.abs(2 * (l / 100) - 1)) * (s / 100);
    const x = c * (1 - Math.abs(((normalizedH / 60) % 2) - 1));
    const m = l / 100 - c / 2;
    let r = 0, g = 0, b = 0;
    if (normalizedH < 60) { r = c; g = x; }
    else if (normalizedH < 120) { r = x; g = c; }
    else if (normalizedH < 180) { g = c; b = x; }
    else if (normalizedH < 240) { g = x; b = c; }
    else if (normalizedH < 300) { r = x; b = c; }
    else { r = c; b = x; }
    const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const colors = [
    hslToHex(baseHue, 30, 8),                  // Deep canvas base
    hslToHex(baseHue + 25, 60, 20),             // Secondary shade
    hslToHex(baseHue + 180, 85, 55),            // Accent complementary
    hslToHex(baseHue + 150, 75, 65),            // Soft contrast
    hslToHex(baseHue + 30, 20, 95),             // Bright highlight
  ];

  return {
    name: prompt ? `${prompt.charAt(0).toUpperCase() + prompt.slice(1)} Palette` : 'Harmonic Studio',
    mood: 'Curated by AI Color Theory',
    harmony: 'Algorithmic Complementary',
    colors,
  };
}

// ============================================================================
// AI TOOL 2: AI FONT PAIRING ENGINE
// ============================================================================

export interface AiFontPairing {
  heading: string;
  body: string;
  accent: string;
  style: string;
  rationale: string;
}

const FONT_PAIRINGS: { [fontName: string]: AiFontPairing[] } = {
  'Playfair Display': [
    {
      heading: 'Playfair Display',
      body: 'Inter',
      accent: 'Cinzel',
      style: 'Editorial Elegance',
      rationale: 'High-contrast romantic serif balanced by the hyper-legible geometric precision of Inter.',
    },
    {
      heading: 'Playfair Display',
      body: 'Montserrat',
      accent: 'Cormorant Garamond',
      style: 'High Fashion & Vogue',
      rationale: 'Classic luxury serif paired with geometric architectural sans for modern magazine hierarchy.',
    },
  ],
  'Bebas Neue': [
    {
      heading: 'Bebas Neue',
      body: 'Inter',
      accent: 'Space Grotesk',
      style: 'Punchy Athletic & Tech',
      rationale: 'Condensed powerhouse display paired with balanced neutral body text creates intense visual punch.',
    },
    {
      heading: 'Bebas Neue',
      body: 'Outfit',
      accent: 'Montserrat',
      style: 'Urban Streetwear',
      rationale: 'Tall impactful headlines grounded by modern rounded sans for street and apparel brands.',
    },
  ],
  'Cinzel': [
    {
      heading: 'Cinzel',
      body: 'Plus Jakarta Sans',
      accent: 'Playfair Display',
      style: 'Ancient Royalty & Modern Luxury',
      rationale: 'Roman lapidary proportions with clean contemporary sans creates effortless authority.',
    },
  ],
  'Syne': [
    {
      heading: 'Syne',
      body: 'Inter',
      accent: 'Space Grotesk',
      style: 'Avant-Garde & Creative Agency',
      rationale: 'Expressive variable glyphs on top of ultra-clean neutral body typography.',
    },
  ],
  'Space Grotesk': [
    {
      heading: 'Space Grotesk',
      body: 'Inter',
      accent: 'Oswald',
      style: 'Web3 & AI Tech',
      rationale: 'Monospace-inspired proportional sans gives strong cryptographic and engineering credentials.',
    },
  ],
};

export function getAiFontPairings(currentHeadingFont = 'Inter'): AiFontPairing[] {
  if (FONT_PAIRINGS[currentHeadingFont]) {
    return FONT_PAIRINGS[currentHeadingFont];
  }

  // Fallback dynamic curated pairings
  return [
    {
      heading: currentHeadingFont,
      body: 'Inter',
      accent: 'Space Grotesk',
      style: 'Modern Pro Balanced',
      rationale: 'Clean typographic rhythm with guaranteed clarity on high-density screens.',
    },
    {
      heading: currentHeadingFont,
      body: 'Montserrat',
      accent: 'Cinzel',
      style: 'Architectural Geometric',
      rationale: 'Strong horizontal structure and wide tracking for premium presentation decks.',
    },
    {
      heading: currentHeadingFont,
      body: 'Outfit',
      accent: 'Playfair Display',
      style: 'Contemporary Friendly',
      rationale: 'Warm geometric curves that soften headlines and improve readability in long paragraphs.',
    },
  ];
}

// ============================================================================
// AI TOOL 3: AI LAYOUT SUGGESTER
// ============================================================================

export interface LayoutSuggestion {
  id: string;
  name: string;
  description: string;
  previewThumb: string;
  apply: (elements: CanvasElement[], width: number, height: number) => CanvasElement[];
}

export function getLayoutSuggestions(
  elements: CanvasElement[],
  width: number,
  height: number
): LayoutSuggestion[] {
  return [
    {
      id: 'split-hero',
      name: 'Split Visual & Typography',
      description: 'Places visual media on the left/top and aligns typography and CTAs on the right/bottom.',
      previewThumb: 'split',
      apply: (els, w, h) => {
        const textEls = els.filter((e) => e.type === 'text');
        const mediaEls = els.filter((e) => e.type === 'image' || e.type === 'shape');

        const isLandscape = w >= h;
        return els.map((el) => {
          if (el.locked) return el;
          if (mediaEls.some((m) => m.id === el.id)) {
            if (isLandscape) {
              return { ...el, x: Math.round(w * 0.05), y: Math.round(h * 0.1), width: Math.round(w * 0.42), height: Math.round(h * 0.8) };
            } else {
              return { ...el, x: Math.round(w * 0.05), y: Math.round(h * 0.05), width: Math.round(w * 0.9), height: Math.round(h * 0.45) };
            }
          }
          if (textEls.some((t) => t.id === el.id)) {
            const idx = textEls.findIndex((t) => t.id === el.id);
            if (isLandscape) {
              return { ...el, x: Math.round(w * 0.52), y: Math.round(h * 0.2 + idx * 90), width: Math.min(el.width, Math.round(w * 0.42)) };
            } else {
              return { ...el, x: Math.round(w * 0.08), y: Math.round(h * 0.55 + idx * 80), width: Math.min(el.width, Math.round(w * 0.84)) };
            }
          }
          return el;
        });
      },
    },
    {
      id: 'centered-editorial',
      name: 'Centered Editorial Axis',
      description: 'Centers all core headline typography and stacks complementary elements symmetrically.',
      previewThumb: 'center',
      apply: (els, w, h) => {
        let currentY = Math.round(h * 0.15);
        return els.map((el) => {
          if (el.locked) return el;
          const centeredX = Math.round((w - el.width) / 2);
          const newY = currentY;
          currentY += Math.round(el.height + 24);
          return { ...el, x: centeredX, y: Math.min(newY, h - el.height - 20) };
        });
      },
    },
    {
      id: 'card-container',
      name: 'Card Container Focus',
      description: 'Wraps focal content in a structured elevated box layout with generous outer breathing room.',
      previewThumb: 'card',
      apply: (els, w, h) => {
        const padX = Math.round(w * 0.1);
        const padY = Math.round(h * 0.1);
        return els.map((el, idx) => {
          if (el.locked) return el;
          return {
            ...el,
            x: Math.round(padX + (idx % 2) * (w * 0.42)),
            y: Math.round(padY + Math.floor(idx / 2) * 140),
            width: Math.min(el.width, Math.round(w * 0.38)),
          };
        });
      },
    },
    {
      id: 'diagonal-dynamic',
      name: 'Diagonal Contemporary Flow',
      description: 'Steps elements diagonally to create dynamic movement across visual reading paths.',
      previewThumb: 'diagonal',
      apply: (els, w, h) => {
        const count = els.length || 1;
        return els.map((el, idx) => {
          if (el.locked) return el;
          const stepX = Math.round((w - el.width - 60) * (idx / (count - 1 || 1)) + 30);
          const stepY = Math.round((h - el.height - 60) * (idx / (count - 1 || 1)) + 30);
          return { ...el, x: stepX, y: stepY };
        });
      },
    },
  ];
}

// ============================================================================
// AI TOOL 4: SMART TEXT ENHANCER
// ============================================================================

export type TextEnhanceMode = 'formal' | 'casual' | 'punchy' | 'sales' | 'grammar' | 'cta';

export function enhanceText(input: string, mode: TextEnhanceMode): string {
  const t = input.trim();
  if (!t) return input;

  switch (mode) {
    case 'formal':
      return t
        .replace(/can't/gi, 'cannot')
        .replace(/don't/gi, 'do not')
        .replace(/won't/gi, 'will not')
        .replace(/it's/gi, 'it is')
        .replace(/awesome|great|cool/gi, 'exceptional')
        .replace(/buy now/gi, 'Acquire Today')
        .replace(/check it out/gi, 'Discover the Collection')
        .replace(/get/gi, 'receive')
        .concat(' with unmatched distinction.');

    case 'casual':
      return t
        .replace(/do not/gi, "don't")
        .replace(/cannot/gi, "can't")
        .replace(/exceptional|prestigious/gi, 'awesome')
        .replace(/acquire/gi, 'grab')
        .replace(/\.$/, '!')
        .concat(' ✨');

    case 'punchy': {
      const words = t.split(/\s+/);
      if (words.length <= 4) return t.toUpperCase();
      return words.slice(0, 4).join(' ').toUpperCase() + '.';
    }

    case 'sales':
      return `Limited Release: ${t} — Designed to Elevate Your Standard.`;

    case 'grammar': {
      let polished = t.charAt(0).toUpperCase() + t.slice(1);
      if (!/[.!?]$/.test(polished)) polished += '.';
      return polished;
    }

    case 'cta':
      return 'CLAIM YOUR EXCLUSIVE ACCESS →';

    default:
      return t;
  }
}

// ============================================================================
// AI TOOL 5: IN-BROWSER BACKGROUND REMOVER (100% Client-Side Canvas)
// ============================================================================

export async function removeBackgroundFromImage(
  imageSrc: string,
  tolerance = 32,
  featherRadius = 1
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) throw new Error('Canvas 2D context unavailable');

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const w = canvas.width;
        const h = canvas.height;

        // Sample background color from the 4 corners
        const cornerSamples = [
          [0, 0],
          [w - 1, 0],
          [0, h - 1],
          [w - 1, h - 1],
        ].map(([x, y]) => {
          const idx = (y * w + x) * 4;
          return [data[idx], data[idx + 1], data[idx + 2]];
        });

        // Median corner color
        const avgR = cornerSamples.reduce((acc, c) => acc + c[0], 0) / 4;
        const avgG = cornerSamples.reduce((acc, c) => acc + c[1], 0) / 4;
        const avgB = cornerSamples.reduce((acc, c) => acc + c[2], 0) / 4;

        // Color distance function
        const colorDist = (r: number, g: number, b: number): number => {
          const dr = r - avgR;
          const dg = g - avgG;
          const db = b - avgB;
          return Math.sqrt(dr * dr + dg * dg + db * db);
        };

        const tol = Math.max(10, tolerance);

        // Alpha mask pass
        for (let i = 0; i < data.length; i += 4) {
          const dist = colorDist(data[i], data[i + 1], data[i + 2]);
          if (dist < tol) {
            // Smooth gradient feathering near cutoff
            const alphaFactor = Math.max(0, (dist - tol * 0.7) / (tol * 0.3));
            data[i + 3] = Math.round(data[i + 3] * alphaFactor);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = () => reject(new Error('Failed to load image for background removal'));
    img.src = imageSrc;
  });
}
