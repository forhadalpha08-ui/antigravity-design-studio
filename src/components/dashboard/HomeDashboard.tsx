import React from 'react';
import { Project, Template } from '../../types/canvas';
import { CANVAS_PRESETS } from '../../utils/presetSizes';
import { TEMPLATES } from '../../templates/templatesData';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { TemplateCard } from './TemplateCard';
import {
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  Star,
  Copy,
  Trash2,
  Edit3,
  Flame,
  Layout,
  Smartphone,
  Presentation,
  Image,
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface HomeDashboardProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onCreateBlank: (title: string, width: number, height: number, category: string) => void;
  onOpenTemplate: (template: Template) => void;
  onPreviewTemplate: (template: Template) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onExploreTemplates: () => void;
  onOpenNewDesignModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  projects,
  onOpenProject,
  onCreateBlank,
  onOpenTemplate,
  onPreviewTemplate,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onExploreTemplates,
  onOpenNewDesignModal,
}) => {
  const trendingTemplates = TEMPLATES.filter((t) => t.isTrending).slice(0, 8);

  return (
    <div className="flex-1 w-full overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-10 sm:space-y-12 max-w-7xl mx-auto select-none">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 via-[#13141f] to-[#0c0d16] border border-neutral-800 p-6 sm:p-8 lg:p-12 shadow-2xl">
        <div className="absolute -right-16 -top-16 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />
        <div className="absolute right-32 bottom-0 w-80 h-80 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-300 text-xs font-semibold">
            <Sparkles size={13} />
            <span>AF-CANVAS • Next-Generation Creative Studio</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Create something extraordinary.
          </h1>

          <p className="text-sm text-neutral-400 font-normal leading-relaxed">
            Design posters, social content, presentations, invitations, brand materials and more. 
            Powered by 50 exclusive templates, fluid typography, and professional export.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenNewDesignModal}
              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-xl shadow-violet-600/25 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Create a Design</span>
            </button>

            <button
              onClick={onExploreTemplates}
              className="flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white rounded-xl text-sm font-semibold transition-all cursor-pointer"
            >
              <span>Explore 50 Templates</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. Quick Create / Recommended Sizes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layout size={18} className="text-violet-400" />
            <span>Recommended Sizes</span>
          </h2>
          <span className="text-xs text-neutral-500">Pick a preset to start blank</span>
        </div>

        {/* On mobile/tablet: horizontally scrollable. On lg+: fixed 7-column grid */}
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none lg:grid lg:grid-cols-7">
          {CANVAS_PRESETS.slice(0, 7).map((preset) => {
            const IconComp = (LucideIcons as any)[preset.iconName] || LucideIcons.Layout;
            return (
              <button
                key={preset.id}
                onClick={() =>
                  onCreateBlank(preset.name, preset.width, preset.height, preset.category)
                }
                className="group flex flex-col p-4 bg-neutral-900/70 hover:bg-neutral-850 border border-neutral-800 hover:border-violet-500/50 rounded-2xl text-left transition-all hover:scale-[1.02] shadow-md flex-shrink-0 w-32 sm:w-36 lg:w-auto"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors mb-3">
                  <IconComp size={18} />
                </div>
                <div className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                  {preset.width} × {preset.height}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Recent Projects */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-violet-400" />
            <h2 className="text-base font-bold text-white">Recent Designs</h2>
            <span className="text-xs text-neutral-500 bg-neutral-800/80 px-2 py-0.5 rounded-full">
              {projects.length}
            </span>
          </div>
          <span className="text-xs text-neutral-400">Auto-saved to browser</span>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-500 text-xs">
            No recent designs found. Click &quot;Create Design&quot; or select a template below.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.slice(0, 8).map((proj) => {
              // Mini thumbnail scale
              const previewMax = 260;
              const scale = Math.min(
                previewMax / proj.width,
                160 / proj.height
              );

              return (
                <div
                  key={proj.id}
                  onClick={() => onOpenProject(proj.id)}
                  className="group relative bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-violet-500/60 transition-all cursor-pointer shadow-lg hover:shadow-violet-600/10 flex flex-col"
                >
                  {/* Thumbnail viewport */}
                  <div className="w-full h-40 bg-[#090a0f] flex items-center justify-center overflow-hidden relative">
                    <div
                      className="origin-center pointer-events-none transform"
                      style={{
                        transform: `scale(${scale * 0.85})`,
                        width: `${proj.width}px`,
                        height: `${proj.height}px`,
                      }}
                    >
                      <CanvasRenderer
                        project={proj}
                        selectedId={null}
                        onSelectElement={() => {}}
                        onUpdateElement={() => {}}
                      />
                    </div>

                    {/* Hover overlay actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                      <button
                        title="Edit Design"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenProject(proj.id);
                        }}
                        className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow transition-transform hover:scale-110"
                      >
                        <Edit3 size={15} />
                      </button>

                      <button
                        title="Duplicate"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicateProject(proj.id);
                        }}
                        className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl shadow transition-transform hover:scale-110"
                      >
                        <Copy size={15} />
                      </button>

                      <button
                        title="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(proj.id);
                        }}
                        className="p-2 bg-neutral-800 hover:bg-red-600 text-neutral-200 rounded-xl shadow transition-transform hover:scale-110"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    {/* Favorite star */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(proj.id);
                      }}
                      className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/50 hover:bg-black/80 text-neutral-400 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        size={14}
                        className={proj.isFavorite ? 'fill-amber-400 text-amber-400' : ''}
                      />
                    </button>
                  </div>

                  {/* Card Metadata */}
                  <div className="p-3.5 flex flex-col justify-between flex-1 bg-neutral-900/60 border-t border-neutral-800/80">
                    <h3 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors truncate">
                      {proj.title}
                    </h3>
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 mt-1">
                      <span>{new Date(proj.updatedAt).toLocaleDateString()}</span>
                      <span className="font-mono">{proj.width} × {proj.height}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Trending Templates */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-amber-400" />
            <h2 className="text-base font-bold text-white">Trending Templates</h2>
          </div>
          <button
            onClick={onExploreTemplates}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
          >
            <span>View all 50</span>
            <ArrowRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {trendingTemplates.map((tpl) => (
            <TemplateCard
              key={tpl.id}
              template={tpl}
              onOpen={onOpenTemplate}
              onPreview={onPreviewTemplate}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
