import React, { useState } from 'react';
import {
  Compass,
  Workflow,
  Sparkles,
  BookOpen,
  Layout,
  Type,
  Pen,
  BarChart3,
  Table as TableIcon,
  QrCode,
  Wand2,
  Download,
  Palette,
  Layers,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Maximize2,
  Copy,
  MousePointer,
  Zap,
  Image as ImageIcon,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Monitor,
} from 'lucide-react';

export const StudioWorkflowGuide: React.FC<{
  onExploreTemplates?: () => void;
  onOpenNewDesign?: () => void;
}> = ({ onExploreTemplates, onOpenNewDesign }) => {
  const [activeTab, setActiveTab] = useState<'workflow' | 'tools' | 'quickstart' | 'ai'>('workflow');
  const [activeToolCategory, setActiveToolCategory] = useState<'all' | 'content' | 'data' | 'ai' | 'export'>('all');

  return (
    <section className="relative bg-gradient-to-b from-[#10111a] via-[#0d0e16] to-[#0a0b10] border border-neutral-800/90 rounded-3xl p-5 sm:p-8 lg:p-10 shadow-2xl overflow-hidden select-none space-y-8">
      {/* Background Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. SECTION HEADER WITH MINI ICON */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-neutral-800/80 pb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-[11px] font-bold uppercase tracking-wider">
            <Compass size={13} className="text-violet-400" />
            <span>Studio Workflow & Tool Guide</span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
            What you can do & How to do it
          </h2>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
            Discover the full capabilities of AF-CANVAS. Explore our visual workflow diagram, learn how to use every tool on desktop and mobile, and turn your creative ideas into production-ready designs.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 bg-neutral-900/90 p-1 rounded-xl border border-neutral-800 overflow-x-auto scrollbar-none flex-shrink-0">
          <button
            onClick={() => setActiveTab('workflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'workflow'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Workflow size={13} />
            <span>Workflow Diagram</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'tools'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sliders size={13} />
            <span>Tools Manual</span>
          </button>

          <button
            onClick={() => setActiveTab('quickstart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'quickstart'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Zap size={13} />
            <span>60-Sec Quick Start</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-violet-600 text-white shadow-md shadow-violet-600/30'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles size={13} />
            <span>AI Superpowers</span>
          </button>
        </div>
      </div>

      {/* 2. TAB CONTENT: 1. VISUAL WORKFLOW DIAGRAM */}
      {activeTab === 'workflow' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Visual Step-by-Step Flow Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
            {/* Step 1: Select & Size */}
            <div className="relative group bg-[#13141f]/90 border border-neutral-800/90 hover:border-violet-500/60 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-black text-xs flex items-center justify-center">
                    01
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    STAGE 1
                  </span>
                </div>

                {/* Mini Visual Diagram Card */}
                <div className="h-28 bg-[#090a0f] rounded-xl border border-neutral-800/80 p-2.5 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                    <span>50 Templates</span>
                    <span>Custom Sizes</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 py-1">
                    <div className="h-10 bg-violet-950/40 border border-violet-500/30 rounded-lg flex items-center justify-center text-[9px] font-bold text-violet-300">
                      1080×1080
                    </div>
                    <div className="h-10 bg-indigo-950/40 border border-indigo-500/30 rounded-lg flex items-center justify-center text-[9px] font-bold text-indigo-300">
                      1920×1080
                    </div>
                    <div className="h-10 bg-pink-950/40 border border-pink-500/30 rounded-lg flex items-center justify-center text-[9px] font-bold text-pink-300">
                      1080×1920
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono text-center">
                    ✓ Responsive Auto-Fit View
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    Choose or Create
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Pick from 50 exclusive templates or specify exact custom dimensions (Instagram, YouTube, Print, Banner).
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-800/60 text-[11px] text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                <span>One-click template launch</span>
              </div>
            </div>

            {/* Step 2: Edit & Style */}
            <div className="relative group bg-[#13141f]/90 border border-neutral-800/90 hover:border-violet-500/60 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-black text-xs flex items-center justify-center">
                    02
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    STAGE 2
                  </span>
                </div>

                {/* Mini Visual Diagram Card */}
                <div className="h-28 bg-[#090a0f] rounded-xl border border-neutral-800/80 p-2.5 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                    <span>Typography & Vectors</span>
                    <span>Touch / Click</span>
                  </div>
                  <div className="space-y-1 py-1">
                    <div className="h-5 bg-neutral-900 rounded border border-violet-500/40 px-2 flex items-center justify-between text-[9px] text-white font-mono">
                      <span>&quot;Your Headline&quot;</span>
                      <span className="text-violet-400">Edit</span>
                    </div>
                    <div className="flex gap-1 text-[8px]">
                      <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">Pen Draw</span>
                      <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">Charts</span>
                      <span className="bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-300">Tables</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono text-center">
                    ✓ Double-Tap Mobile & Click Desktop
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    Design & Compose
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Double-click or double-tap to edit text. Draw freehand vector strokes, insert charts, tables, QR codes, and shapes.
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-800/60 text-[11px] text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                <span>Inspector + Quick Action Bar</span>
              </div>
            </div>

            {/* Step 3: Supercharge with AI */}
            <div className="relative group bg-[#13141f]/90 border border-neutral-800/90 hover:border-violet-500/60 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-black text-xs flex items-center justify-center">
                    03
                  </span>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    AI POWERED
                  </span>
                </div>

                {/* Mini Visual Diagram Card */}
                <div className="h-28 bg-[#090a0f] rounded-xl border border-neutral-800/80 p-2.5 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                    <span>5 In-Browser AI Tools</span>
                    <span>Zero API Keys</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1">
                    <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-400 text-violet-300 flex items-center justify-center text-[10px] font-bold">P</span>
                    <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-400 text-indigo-300 flex items-center justify-center text-[10px] font-bold">F</span>
                    <span className="w-6 h-6 rounded-full bg-pink-600/30 border border-pink-400 text-pink-300 flex items-center justify-center text-[10px] font-bold">L</span>
                    <span className="w-6 h-6 rounded-full bg-amber-600/30 border border-amber-400 text-amber-300 flex items-center justify-center text-[10px] font-bold">T</span>
                    <span className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-400 text-emerald-300 flex items-center justify-center text-[10px] font-bold">BG</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono text-center">
                    ✓ 100% Client-Side Speed
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    AI Design Studio
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Generate harmonic color palettes, match font pairings, reflow geometric layouts, rewrite copy, and remove image backgrounds.
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-800/60 text-[11px] text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                <span>Instant 1-click execution</span>
              </div>
            </div>

            {/* Step 4: High-Res Export */}
            <div className="relative group bg-[#13141f]/90 border border-neutral-800/90 hover:border-violet-500/60 rounded-2xl p-5 shadow-xl transition-all hover:-translate-y-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 font-black text-xs flex items-center justify-center">
                    04
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    STAGE 4
                  </span>
                </div>

                {/* Mini Visual Diagram Card */}
                <div className="h-28 bg-[#090a0f] rounded-xl border border-neutral-800/80 p-2.5 flex flex-col justify-between overflow-hidden relative">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                    <span>Up to 4K / 300 DPI</span>
                    <span>5 Formats</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 py-1">
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-bold text-white">PNG</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-bold text-white">JPG</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-bold text-white">WEBP</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-bold text-white">SVG</span>
                    <span className="px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] font-bold text-white">PDF</span>
                  </div>
                  <span className="text-[9px] text-emerald-400 font-mono text-center">
                    ✓ Clean Client-Side Download
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-violet-300 transition-colors">
                    Export & Download
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Inspect your live customized design in the export modal and download crisp, watermark-free files for web, social, or print.
                  </p>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-neutral-800/60 text-[11px] text-neutral-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                <span>Lossless quality rendering</span>
              </div>
            </div>
          </div>

          {/* Graphical Pipeline Architecture Overview */}
          <div className="p-5 bg-neutral-900/50 border border-neutral-800 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0">
                <Workflow size={20} />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">
                  Unified Desktop & Mobile Creative Pipeline
                </h4>
                <p className="text-[11px] text-neutral-400">
                  Every tool, drawer, gesture, and export operates with 100% feature parity across phones, tablets, and desktop computers.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 w-full md:w-auto">
              {onExploreTemplates && (
                <button
                  onClick={onExploreTemplates}
                  className="flex-1 md:flex-none px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Explore Templates</span>
                  <ArrowRight size={13} />
                </button>
              )}
              {onOpenNewDesign && (
                <button
                  onClick={onOpenNewDesign}
                  className="flex-1 md:flex-none px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white rounded-xl text-xs font-medium border border-neutral-700 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Start Blank</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB CONTENT: 2. INTERACTIVE TOOLS MANUAL */}
      {activeTab === 'tools' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Category filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {(
              [
                { id: 'all', label: 'All 12 Studio Tools' },
                { id: 'content', label: 'Typography & Art' },
                { id: 'data', label: 'Data & Infographics' },
                { id: 'ai', label: 'AI Assistance' },
                { id: 'export', label: 'Layout & Export' },
              ] as const
            ).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveToolCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap font-semibold ${
                  activeToolCategory === cat.id
                    ? 'bg-violet-600 text-white shadow-md shadow-violet-600/20'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tool 1: Typography Studio */}
            {(activeToolCategory === 'all' || activeToolCategory === 'content') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Type size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Typography Studio</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Shortcut: T
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-violet-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>30+ Google Fonts, custom font sizes (8–300px)</li>
                    <li>Gradient fills, stroke outlines, letter-spacing, line-height</li>
                    <li>Multi-line headings, quotes, and narrative body copy</li>
                  </ul>
                  <p className="font-semibold text-violet-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Double-click (desktop) or double-tap (mobile) any text on canvas, or type directly in the &quot;Text Content&quot; box at the top of the Inspector.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 2: Freehand Draw Tool */}
            {(activeToolCategory === 'all' || activeToolCategory === 'content') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                      <Pen size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Freehand Pen & Sketch</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Shortcut: P
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-pink-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>4 brush styles: Pencil, Marker, Highlighter, Eraser</li>
                    <li>Smooth quadratic Bezier vector smoothing</li>
                    <li>Adjustable stroke thickness (1–36px) and color swatches</li>
                  </ul>
                  <p className="font-semibold text-pink-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Click the Pen icon in sidebar, choose brush type & size, then drag on desktop or draw with your finger on touch screens.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 3: Vector Charts */}
            {(activeToolCategory === 'all' || activeToolCategory === 'data') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <BarChart3 size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Vector Chart Engine</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Shortcut: C
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-indigo-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>7 chart types: Column, Bar, Donut, Pie, Line, Area, Gauge</li>
                    <li>Live dataset editor with custom labels, values, and colors</li>
                    <li>Toggleable titles, values, and interactive legend swatches</li>
                  </ul>
                  <p className="font-semibold text-indigo-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Open the Charts drawer from sidebar, pick a chart layout, then use the Chart Data inspector to add or update data points.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 4: Tables */}
            {(activeToolCategory === 'all' || activeToolCategory === 'data') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <TableIcon size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Interactive Tables</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Up to 8×8
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-emerald-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>4 curated themes: Obsidian, Violet, Emerald, Frosted Glass</li>
                    <li>Header row toggles, cell border controls, and custom padding</li>
                    <li>In-cell direct double-click text editing</li>
                  </ul>
                  <p className="font-semibold text-emerald-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Open Tables drawer, choose row/col counts and theme, add to canvas, then double-click any cell to enter numbers or text.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 5: QR Code Generator */}
            {(activeToolCategory === 'all' || activeToolCategory === 'data') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <QrCode size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">QR Code Generator</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Vector Matrix
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-amber-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>Convert any website URL, Wi-Fi, or plain text into scannable QR</li>
                    <li>Pure client-side generation without external servers</li>
                    <li>Custom foreground and background contrast colors</li>
                  </ul>
                  <p className="font-semibold text-amber-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Open QR Code drawer, paste your target URL, customize colors, and click &quot;Generate & Add to Canvas&quot;.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 6: AI Design Studio */}
            {(activeToolCategory === 'all' || activeToolCategory === 'ai') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-fuchsia-600/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400">
                      <Wand2 size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">AI Design Studio</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    5 Tools
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-fuchsia-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>Palette Generator, Font Matcher, Layout Suggester</li>
                    <li>Smart Text Rewriter with 6 marketing tone styles</li>
                    <li>In-browser Magic Background Remover for photos</li>
                  </ul>
                  <p className="font-semibold text-fuchsia-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Open AI Studio drawer from sidebar, type a mood or keyword, and apply color palettes or layout reflows with 1 click.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 7: Multi-Select & Grouping */}
            {(activeToolCategory === 'all' || activeToolCategory === 'export') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <MousePointer size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Multi-Select & Grouping</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Ctrl+G
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-cyan-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>Marquee rubber-band drag selection across empty canvas</li>
                    <li>Shift+Click multiple elements to move together</li>
                    <li>Lock into single group with Ctrl+G; ungroup with Ctrl+Shift+G</li>
                  </ul>
                  <p className="font-semibold text-cyan-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Click & drag across empty canvas area to select multiple items, then click &quot;Group&quot; on the floating Quick Action bar.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 8: Smart Alignment */}
            {(activeToolCategory === 'all' || activeToolCategory === 'export') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Sliders size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">Smart Alignment</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    6-Way Align
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-violet-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>Align Left, Center, Right, Top, Middle, Bottom</li>
                    <li>Distribute horizontal and vertical spacing evenly</li>
                    <li>Smart magnetic snapping guides while dragging</li>
                  </ul>
                  <p className="font-semibold text-violet-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Select an element to see the alignment dropdown on the Quick Action bar, or open the Position & Align tab in the Inspector.
                  </p>
                </div>
              </div>
            )}

            {/* Tool 9: High-Res Export */}
            {(activeToolCategory === 'all' || activeToolCategory === 'export') && (
              <div className="bg-[#13141f] border border-neutral-800 hover:border-violet-500/50 rounded-2xl p-4.5 space-y-3 shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <Download size={16} />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-white">High-Res Export Engine</h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    Up to 4K
                  </span>
                </div>
                <div className="space-y-1.5 text-xs text-neutral-300">
                  <p className="font-semibold text-emerald-300">What you can do:</p>
                  <ul className="list-disc list-inside text-neutral-400 space-y-0.5 text-[11px]">
                    <li>PNG (lossless with transparent background option)</li>
                    <li>JPG (compact), WebP (modern web), SVG (pure vector), PDF</li>
                    <li>Resolution multipliers: 1x (Standard), 2x (HD), 4x (Ultra 4K)</li>
                  </ul>
                  <p className="font-semibold text-emerald-300 pt-1">How to use it:</p>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    Click the &quot;Export&quot; button in the top bar, preview your design, choose your format and scale, and download.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT: 3. 60-SEC QUICK START */}
      {activeTab === 'quickstart' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center text-[11px] text-white">1</span>
                <span>Select a Template or Blank Canvas</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Click &quot;Explore 50 Templates&quot; on the dashboard or choose a preset like Instagram Post (1080×1080) or Presentation (1920×1080). The editor automatically fits the design to 100% full height and width on your screen.
              </p>
            </div>

            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center text-[11px] text-white">2</span>
                <span>Customize Your Words & Colors</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Double-click or double-tap any text to edit inline, or type into the &quot;Text Content&quot; box in the Inspector panel. Change fonts, text colors, gradients, and font weights with live instant preview.
              </p>
            </div>

            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center text-[11px] text-white">3</span>
                <span>Add Visuals, Charts & QR Codes</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Open the left sidebar drawers to add vector shapes, freehand drawing sketches, data charts, styled tables, or scannable vector QR codes. Reorder layers with front/back controls.
              </p>
            </div>

            <div className="p-5 bg-neutral-900/80 border border-neutral-800 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-6 h-6 rounded-full bg-violet-600/30 border border-violet-500 flex items-center justify-center text-[11px] text-white">4</span>
                <span>Export in High Resolution</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Click &quot;Export&quot; at the top right. Select PNG, JPG, WebP, SVG or PDF, pick 1x to 4K Ultra resolution, and download. Everything processes securely on your device with zero upload latency.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT: 4. AI SUPERPOWERS */}
      {activeTab === 'ai' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-violet-300 text-xs font-bold">
                <Palette size={16} className="text-violet-400" />
                <span>1. Smart Palette Generator</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Type any mood or theme (e.g. &quot;cyberpunk&quot;, &quot;minimal coffee&quot;, &quot;luxury gold&quot;). The mathematical color harmony engine generates 5 balanced hex codes and applies them to your background or elements in 1 click.
              </p>
            </div>

            <div className="p-4.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold">
                <Type size={16} className="text-indigo-400" />
                <span>2. AI Font Pairing Engine</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Select your primary heading font. The algorithm calculates typographic contrast and pairs matching subtitle and body fonts (serif, sans-serif, display) with rationales.
              </p>
            </div>

            <div className="p-4.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-bold">
                <Layout size={16} className="text-pink-400" />
                <span>3. AI Geometric Layout Reflow</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Automatically calculates balanced geometric arrangements for your canvas elements: Split Hero, Centered Editorial, Card Container, and Diagonal Dynamic.
              </p>
            </div>

            <div className="p-4.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
                <Zap size={16} className="text-amber-400" />
                <span>4. Smart Text Enhancer</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Transform rough words into high-converting copy across 6 styles: Punchy Headline, High-Converting CTA, Sales Copy, Executive Formal, Friendly Casual, and Grammar Polish.
              </p>
            </div>

            <div className="p-4.5 bg-neutral-900/90 border border-violet-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
                <Sparkles size={16} className="text-emerald-400" />
                <span>5. Magic Background Remover</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Corner sampling and alpha edge matting runs directly on your device inside an offscreen HTML5 canvas to isolate subjects without third-party server uploads.
              </p>
            </div>

            <div className="p-4.5 bg-neutral-900/90 border border-neutral-800 rounded-2xl space-y-2 flex flex-col justify-center items-center text-center">
              <ShieldCheck size={28} className="text-emerald-400" />
              <h4 className="text-xs font-bold text-white">100% Client-Side Privacy</h4>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                All AI tools and exports run entirely inside your browser. No API keys required, zero latency, and your private data never leaves your computer or phone.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
