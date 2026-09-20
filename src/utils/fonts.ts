export interface FontOption {
  name: string;
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting';
  weights: number[];
}

export const GOOGLE_FONTS: FontOption[] = [
  { name: 'Inter', family: "'Inter', sans-serif", category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800, 900] },
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'serif', weights: [400, 600, 700, 900] },
  { name: 'Cinzel', family: "'Cinzel', serif", category: 'serif', weights: [400, 600, 700, 900] },
  { name: 'Space Grotesk', family: "'Space Grotesk', sans-serif", category: 'sans-serif', weights: [400, 500, 600, 700] },
  { name: 'Syne', family: "'Syne', sans-serif", category: 'display', weights: [500, 600, 700, 800] },
  { name: 'Outfit', family: "'Outfit', sans-serif", category: 'sans-serif', weights: [300, 400, 500, 600, 700, 800] },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'sans-serif', weights: [300, 400, 600, 700, 800, 900] },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'display', weights: [400] },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'sans-serif', weights: [400, 600, 700] },
  { name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif", category: 'sans-serif', weights: [400, 500, 600, 700, 800] },
  { name: 'Cormorant Garamond', family: "'Cormorant Garamond', serif", category: 'serif', weights: [400, 600, 700] },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'handwriting', weights: [600, 700] },
];

export interface TypographyPreset {
  id: string;
  name: string;
  category: string;
  heading: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    letterSpacing: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
  subheading: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    letterSpacing: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
  body: {
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    letterSpacing: number;
  };
}

export const TYPOGRAPHY_PRESETS: TypographyPreset[] = [
  {
    id: 'luxury',
    name: 'Luxury',
    category: 'Premium & High-End',
    heading: { fontFamily: "'Cinzel', serif", fontSize: 64, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' },
    subheading: { fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 400, letterSpacing: 4, textTransform: 'uppercase' },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 300, letterSpacing: 0.5 },
  },
  {
    id: 'modern',
    name: 'Modern Tech',
    category: 'Futuristic & Clean',
    heading: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 68, fontWeight: 700, letterSpacing: -1 },
    subheading: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 500, letterSpacing: 0 },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 400, letterSpacing: 0 },
  },
  {
    id: 'editorial',
    name: 'Editorial',
    category: 'Vogue & Publishing',
    heading: { fontFamily: "'Playfair Display', serif", fontSize: 72, fontWeight: 900, letterSpacing: -0.5 },
    subheading: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 400, letterSpacing: 1 },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 300, letterSpacing: 0.2 },
  },
  {
    id: 'minimal',
    name: 'Minimalist',
    category: 'Nordic & Pure',
    heading: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 56, fontWeight: 600, letterSpacing: -1 },
    subheading: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 400, letterSpacing: 0 },
    body: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: 0 },
  },
  {
    id: 'bold',
    name: 'Bold Impact',
    category: 'Streetwear & Energy',
    heading: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 88, fontWeight: 400, letterSpacing: 3, textTransform: 'uppercase' },
    subheading: { fontFamily: "'Montserrat', sans-serif", fontSize: 24, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase' },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 500, letterSpacing: 0 },
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    category: 'Film & Dramatic',
    heading: { fontFamily: "'Cinzel', serif", fontSize: 76, fontWeight: 900, letterSpacing: 8, textTransform: 'uppercase' },
    subheading: { fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 400, letterSpacing: 6, textTransform: 'uppercase' },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 300, letterSpacing: 1 },
  },
  {
    id: 'sport',
    name: 'Athletic Sport',
    category: 'Action & Dynamic',
    heading: { fontFamily: "'Oswald', sans-serif", fontSize: 80, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' },
    subheading: { fontFamily: "'Montserrat', sans-serif", fontSize: 22, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase' },
    body: { fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 400, letterSpacing: 0.5 },
  },
  {
    id: 'technology',
    name: 'Cyberpunk & AI',
    category: 'Next-Gen Interface',
    heading: { fontFamily: "'Syne', sans-serif", fontSize: 64, fontWeight: 800, letterSpacing: 0 },
    subheading: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase' },
    body: { fontFamily: "'Space Grotesk', sans-serif", fontSize: 15, fontWeight: 400, letterSpacing: 0.5 },
  },
  {
    id: 'elegant',
    name: 'Timeless Elegance',
    category: 'Weddings & Galas',
    heading: { fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 600, letterSpacing: 2 },
    subheading: { fontFamily: "'Dancing Script', cursive", fontSize: 36, fontWeight: 700, letterSpacing: 1 },
    body: { fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 400, letterSpacing: 0.5 },
  },
];
