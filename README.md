# 🚀 ANTIGRAVITY DESIGN STUDIO
### *The Next-Generation Browser-Based Graphic Design Platform*

![Antigravity Design Studio](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80)

**ANTIGRAVITY DESIGN STUDIO** is a complete, production-quality, browser-based graphic design platform inspired by the workflow and usability of modern creative tools, but designed with its own distinct visual identity (Obsidian Dark Luxury / Modern Creative SaaS), 50 fully designed exclusive templates across 30 categories, an interactive vector canvas engine, advanced typography, algorithmic background studio, brand kit manager, and a dedicated mobile design experience.

---

## ✨ Key Platform Features

### 1. 🎨 Professional Interactive Canvas Engine
* **Vector-Crisp Stage**: Pan and zoom from 15% to 300% with hardware-accelerated transforms.
* **8-Point Transform Controls**: Multi-directional resize handles with aspect ratio preservation.
* **Magnetic Angle Snapping**: Interactive rotation handle with live degree readout and automatic magnetic snap to 0°, 45°, 90°, 180°, 270°.
* **Smart Alignment Guides**: Real-time magnetic guides automatically snapping to canvas center and edges.
* **Inline Text Editing**: Double-click any text element to edit inline with real-time word wrap.
* **Quick Action Toolbar**: Floating contextual action bar for instant duplication, locking, layer ordering, and deletion.

### 2. 💎 50 Exclusive Professional Templates (Non-Placeholder)
50 complete original templates designed with visual hierarchy, real typography pairings, gradients, shapes, and layer structures across 30 categories:
* *Luxury Fashion Campaign, Dark Luxury Brand, Premium Product Advertisement, Modern Fashion Poster, Streetwear Campaign, Luxury Watch Advertisement, Perfume Advertisement, Sports Announcement, Football Match Poster, Basketball Event Poster, Fitness Campaign, Music Festival Poster, Concert Announcement, DJ Event Poster, Movie Poster, Cinematic Film Announcement, Technology Product Launch, AI Startup Advertisement, Smartphone Advertisement, Gaming Tournament Poster, Restaurant Promotion, Food Advertisement, Coffee Shop Promotion, Travel Campaign, Luxury Hotel Advertisement, Summer Travel Poster, Business Conference, Startup Pitch Presentation, Corporate Announcement, Business Instagram Post, Real Estate Advertisement, Education Campaign, Online Course Advertisement, Graduation Announcement, Certificate Design, Wedding Invitation, Birthday Invitation, Minimal Quote Poster, Motivational Campaign, Magazine Cover, Album Cover, YouTube Thumbnail, YouTube Channel Banner, Instagram Story Campaign, Product Launch Story, Portfolio Cover, Personal Brand Poster, Modern Abstract Poster, Cyberpunk Creative Poster, Premium Black & Red Campaign.*

### 3. ✍️ Advanced Typography System
* **Curated Google Fonts**: Inter, Playfair Display, Cinzel, Space Grotesk, Syne, Outfit, Montserrat, Bebas Neue, Oswald, Plus Jakarta Sans, Cormorant Garamond, Dancing Script.
* **9 Typographic Presets**: Luxury, Modern Tech, Editorial, Minimalist, Bold Impact, Cinematic, Athletic Sport, Cyberpunk & AI, Timeless Elegance.
* **Fine Controls**: Font weight (300 to 900), letter spacing, line height, text transform (uppercase, lowercase, capitalize), text stroke, drop shadows, and gradient text fills.

### 4. 🔮 Algorithmic Background Studio
15 algorithmic background styles with custom color palettes and fine-tuning:
* *Solid Minimal, Dark Luxury Gold, Fluid Mesh Gradient, Aurora Borealis, Cyberpunk Neon, Velvet Sunset, Titanium Metallic, Blueprint Grid, Analog Grain, Glassmorphism Depth, Linear Gradient, Radial Glow, Conic Gradient, Liquid Blob, Abstract Waves.*

### 5. 🏷️ Brand Kit System
* Store and organize custom **Brand Color Palettes**, **Brand Fonts** (Heading & Body), and **Brand Logos**.
* **1-Click "Apply Brand Kit to Canvas"**: Intelligently restyles and harmonizes any template with your brand colors and typography.

### 6. 📱 Dedicated Mobile Design Studio & Dashboard
* **Not a shrunken desktop interface** — a dedicated mobile layout built from the ground up for touchscreen workflows:
  * Floating bottom tool dock for instant access to Templates, Elements, Text, Images, Backgrounds, and Layers.
  * Touch-friendly Bottom-Sheet Inspector when any element is selected (Style, Typography, Position, Effects, Motion).
  * Mobile-first Home Dashboard with horizontal scrolling category cards and quick design sizing.

### 7. 📤 Real Multi-Format High-Res Export (Never Faked)
* **Real Client-Side Canvas 2D Rasterizer**:
  * **PNG**: Lossless transparency support.
  * **JPG**: High-speed compression with adjustable quality.
  * **WEBP**: Next-gen ultra-compact web image.
  * **SVG**: Standalone valid vector SVG download.
  * **PDF**: Multi-page print-ready document formatted with `jspdf`.
* **Resolution Multipliers**: 1x (Standard), 2x (Retina HD), 3x (Super Crisp), 4x (Ultra Print 300+ DPI).
* Celebration confetti feedback on export!

### 8. 💾 Persistent Storage & Undo / Redo
* Built-in browser persistence via `localStorage` and `IndexedDB`.
* Multi-level Undo / Redo history stack (`Ctrl+Z`, `Ctrl+Shift+Z`).
* Real-time auto-save indicator: *"Saved"*, *"Saving..."*, *"Unsaved changes"*.

---

## 🛠️ Easy Customization Guide

### How to Add or Edit Templates
Open [`src/templates/templatesData.ts`](./src/templates/templatesData.ts). Each template is defined with a clean, readable TypeScript object:

```typescript
{
  id: 'tpl-custom',
  title: 'My Custom Campaign',
  category: 'fashion',
  tags: ['Fashion', 'Poster'],
  width: 1200,
  height: 1600,
  background: { type: 'dark-luxury', color: '#0a0a0d' },
  elements: [
    {
      id: 'el-1',
      name: 'Headline',
      type: 'text',
      text: 'SUMMER VIBES',
      fontFamily: "'Playfair Display', serif",
      fontSize: 72,
      fontWeight: 700,
      color: '#ffffff',
      x: 100,
      y: 200,
      width: 1000,
      height: 120,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
    }
  ]
}
```

### How to Add Custom Canvas Preset Sizes
Open [`src/utils/presetSizes.ts`](./src/utils/presetSizes.ts) and add your custom dimensions:
```typescript
{
  id: 'custom-banner',
  name: 'LinkedIn Banner',
  category: 'Social Media',
  width: 1584,
  height: 396,
  iconName: 'Image',
}
```

### How to Add Custom Color Palettes
Open [`src/utils/color.ts`](./src/utils/color.ts) to add or edit color themes in `COLOR_PALETTES`.

---

## 🌐 Easy Deployment to GitHub Pages

### Method 1: Automatic Deployment via GitHub Actions (Zero Setup)
This repository includes a pre-configured GitHub Actions workflow in [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml).

1. Initialize git and push to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Antigravity Design Studio"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```
2. In your GitHub repository:
   * Go to **Settings** > **Pages**.
   * Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. That's it! GitHub Actions will automatically build and publish your app.

### Method 2: Manual 1-Command Deploy via `gh-pages`
```bash
npm run deploy
```
This builds the production bundle and deploys the `./dist` folder directly to the `gh-pages` branch.

---

## 💻 Local Development & Build

### Prerequisites
* Node.js v18+ or v20+
* npm v9+

### Install Dependencies
```bash
npm install
```

### Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
```
The compiled, minified production assets will be generated in `./dist`.

---

## 📋 Technology Stack
* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 6+ / 8+ with `@tailwindcss/vite`
* **Styling**: Tailwind CSS v4 + Obsidian Dark Luxury Design System
* **Icons**: Lucide React
* **PDF Engine**: `jspdf`
* **Animations**: Canvas Confetti + Hardware-Accelerated CSS Transitions
* **Persistence**: Client-side storage (IndexedDB & LocalStorage)

---

## 📄 License
MIT License. Built for creators and developers who demand a professional design workflow.
