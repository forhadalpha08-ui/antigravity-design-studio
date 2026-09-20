import React, { useState } from 'react';
import { Project, Template } from '../types/canvas';
import { CANVAS_PRESETS } from '../utils/presetSizes';
import { TEMPLATES } from '../templates/templatesData';
import { TEMPLATE_CATEGORIES } from '../templates/categories';
import { CanvasRenderer } from '../editor/canvas/CanvasRenderer';
import {
  Sparkles,
  Plus,
  Search,
  Home,
  LayoutGrid,
  FolderKanban,
  Palette,
  Image as ImageIcon,
  Flame,
  Clock,
  ArrowRight,
} from 'lucide-react';

interface MobileDashboardProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onOpenTemplate: (t: Template) => void;
  onPreviewTemplate: (t: Template) => void;
  onOpenNewDesignModal: () => void;
}

export const MobileDashboard: React.FC<MobileDashboardProps> = ({
  projects,
  onOpenProject,
  onOpenTemplate,
  onPreviewTemplate,
  onOpenNewDesignModal,
}) => {
  const [currentTab, setCurrentTab] = useState<'home' | 'templates' | 'projects'>('home');
  const [search, setSearch] = useState('');

  const trendingTemplates = TEMPLATES.filter((t) => t.isTrending).slice(0, 10);

  return (
    <div className="flex flex-col w-screen h-screen bg-[#090a0f] select-none overflow-hidden relative">
      {/* Mobile Header */}
      <header className="px-5 pt-4 pb-3 bg-[#0d0e14] border-b border-neutral-800 flex items-center justify-between z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-white block">
              ANTIGRAVITY
            </span>
            <span className="text-[8px] font-bold text-neutral-400 block -mt-1 tracking-wider">
              STUDIO MOBILE
            </span>
          </div>
        </div>

        <button
          onClick={onOpenNewDesignModal}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs font-bold shadow-md shadow-violet-600/30"
        >
          <Plus size={14} />
          <span>New</span>
        </button>
      </header>

      {/* Main Scroll Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-5 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search templates & projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-violet-500"
          />
        </div>

        {/* HOME VIEW */}
        {currentTab === 'home' && (
          <>
            {/* Quick Sizes Horizontal Strip */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                Quick Start Sizing
              </span>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {CANVAS_PRESETS.slice(0, 6).map((preset) => (
                  <button
                    key={preset.id}
                    onClick={onOpenNewDesignModal}
                    className="flex-shrink-0 w-28 p-3 bg-neutral-900 border border-neutral-800 rounded-xl text-left active:border-violet-500"
                  >
                    <div className="text-xs font-bold text-white truncate">
                      {preset.name}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-500 mt-0.5">
                      {preset.width} × {preset.height}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Projects */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock size={13} className="text-violet-400" />
                  <span>Recent Designs ({projects.length})</span>
                </span>
              </div>

              <div className="space-y-2">
                {projects.slice(0, 5).map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => onOpenProject(proj.id)}
                    className="p-3 bg-neutral-900/90 border border-neutral-800 rounded-xl flex items-center justify-between active:border-violet-500"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[200px]">
                        {proj.title}
                      </h4>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {proj.width} × {proj.height} px
                      </span>
                    </div>
                    <span className="text-xs text-violet-400 font-semibold">Open →</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Templates */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Flame size={13} className="text-amber-400" />
                  <span>Popular Templates</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {trendingTemplates.slice(0, 6).map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => onOpenTemplate(tpl)}
                    className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col active:border-violet-500 shadow-md group"
                  >
                    <div className="w-full h-28 bg-[#090a0f] flex items-center justify-center overflow-hidden relative checkerboard-pattern">
                      <div
                        className="origin-center pointer-events-none transform shadow-md"
                        style={{
                          transform: `scale(${Math.min(130 / (tpl.width || 1080), 95 / (tpl.height || 1080))})`,
                          width: `${tpl.width}px`,
                          height: `${tpl.height}px`,
                        }}
                      >
                        <CanvasRenderer
                          project={tpl as unknown as Project}
                          selectedId={null}
                          onSelectElement={() => {}}
                          onUpdateElement={() => {}}
                        />
                      </div>
                      {tpl.isPremium && (
                        <span className="absolute top-1.5 left-1.5 text-[8px] font-bold bg-neutral-900/90 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded shadow">
                          PRO
                        </span>
                      )}
                    </div>
                    <div className="p-2.5 flex flex-col justify-between flex-1 bg-neutral-900">
                      <div>
                        <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider block">
                          {tpl.category}
                        </span>
                        <h4 className="text-[11px] font-bold text-white mt-0.5 line-clamp-1">
                          {tpl.title}
                        </h4>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-neutral-500 mt-1.5 font-mono">
                        <span>{tpl.width}×{tpl.height}</span>
                        <span className="text-violet-400 font-semibold">Use →</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* TEMPLATES VIEW */}
        {currentTab === 'templates' && (
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              All 50 Studio Templates
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => onOpenTemplate(tpl)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden flex flex-col active:border-violet-500 shadow-md group"
                >
                  <div className="w-full h-28 bg-[#090a0f] flex items-center justify-center overflow-hidden relative checkerboard-pattern">
                    <div
                      className="origin-center pointer-events-none transform shadow-md"
                      style={{
                        transform: `scale(${Math.min(130 / (tpl.width || 1080), 95 / (tpl.height || 1080))})`,
                        width: `${tpl.width}px`,
                        height: `${tpl.height}px`,
                      }}
                    >
                      <CanvasRenderer
                        project={tpl as unknown as Project}
                        selectedId={null}
                        onSelectElement={() => {}}
                        onUpdateElement={() => {}}
                      />
                    </div>
                    {tpl.isPremium && (
                      <span className="absolute top-1.5 left-1.5 text-[8px] font-bold bg-neutral-900/90 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded shadow">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="p-2.5 flex flex-col justify-between flex-1 bg-neutral-900">
                    <div>
                      <span className="text-[9px] text-violet-400 font-bold uppercase tracking-wider block">
                        {tpl.category}
                      </span>
                      <h4 className="text-[11px] font-bold text-white mt-0.5 line-clamp-1">
                        {tpl.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-neutral-500 mt-1.5 font-mono">
                      <span>{tpl.width}×{tpl.height}</span>
                      <span className="text-violet-400 font-semibold">Use →</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS VIEW */}
        {currentTab === 'projects' && (
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
              All Saved Designs ({projects.length})
            </span>
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="p-3.5 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between active:border-violet-500"
              >
                <div>
                  <h4 className="text-xs font-bold text-white truncate max-w-[220px]">
                    {proj.title}
                  </h4>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    {new Date(proj.updatedAt).toLocaleDateString()} • {proj.width} × {proj.height}
                  </span>
                </div>
                <span className="text-xs text-violet-400 font-semibold">Open →</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0e0f16] border-t border-neutral-800 flex items-center justify-around px-4 z-40">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center justify-center p-1 ${
            currentTab === 'home' ? 'text-violet-400' : 'text-neutral-500'
          }`}
        >
          <Home size={18} />
          <span className="text-[10px] mt-1 font-semibold">Home</span>
        </button>

        <button
          onClick={() => setCurrentTab('templates')}
          className={`flex flex-col items-center justify-center p-1 ${
            currentTab === 'templates' ? 'text-violet-400' : 'text-neutral-500'
          }`}
        >
          <LayoutGrid size={18} />
          <span className="text-[10px] mt-1 font-semibold">Templates</span>
        </button>

        <button
          onClick={() => setCurrentTab('projects')}
          className={`flex flex-col items-center justify-center p-1 ${
            currentTab === 'projects' ? 'text-violet-400' : 'text-neutral-500'
          }`}
        >
          <FolderKanban size={18} />
          <span className="text-[10px] mt-1 font-semibold">Projects</span>
        </button>

        <button
          onClick={onOpenNewDesignModal}
          className="flex flex-col items-center justify-center p-1 text-neutral-500"
        >
          <Plus size={18} />
          <span className="text-[10px] mt-1 font-semibold">Create</span>
        </button>
      </nav>
    </div>
  );
};
