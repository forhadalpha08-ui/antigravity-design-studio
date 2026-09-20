import React, { useState } from 'react';
import { Project } from '../../types/canvas';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import {
  FolderKanban,
  Search,
  Star,
  Copy,
  Trash2,
  Edit3,
  Clock,
  Plus,
} from 'lucide-react';

interface ProjectsManagerProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onOpenNewDesign: () => void;
}

export const ProjectsManager: React.FC<ProjectsManagerProps> = ({
  projects,
  onOpenProject,
  onDuplicateProject,
  onDeleteProject,
  onToggleFavorite,
  onOpenNewDesign,
}) => {
  const [search, setSearch] = useState('');
  const [filterFav, setFilterFav] = useState(false);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      search === '' || p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFav = filterFav ? p.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="flex-1 w-full overflow-y-auto px-6 py-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <FolderKanban size={28} className="text-violet-400" />
            <span>My Projects</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage, duplicate, and organize all your saved graphic design projects
          </p>
        </div>

        <button
          onClick={onOpenNewDesign}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
        <div className="relative w-full sm:w-80">
          <Search size={14} className="absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white outline-none focus:border-violet-500"
          />
        </div>

        <button
          onClick={() => setFilterFav(!filterFav)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors self-end sm:self-auto ${
            filterFav
              ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
              : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
          }`}
        >
          <Star size={14} className={filterFav ? 'fill-amber-400' : ''} />
          <span>Favorites Only</span>
        </button>
      </div>

      {/* Projects Grid */}
      {filtered.length === 0 ? (
        <div className="p-16 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl text-neutral-500 text-sm">
          No projects found. Create a new design or clear your search filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((proj) => {
            const previewMax = 260;
            const scale = Math.min(previewMax / proj.width, 160 / proj.height);

            return (
              <div
                key={proj.id}
                onClick={() => onOpenProject(proj.id)}
                className="group relative bg-neutral-900/90 rounded-2xl overflow-hidden border border-neutral-800 hover:border-violet-500/60 transition-all cursor-pointer shadow-xl hover:shadow-violet-600/10 flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="w-full h-44 bg-[#090a0f] flex items-center justify-center overflow-hidden relative">
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

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                    <button
                      title="Edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenProject(proj.id);
                      }}
                      className="p-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl shadow"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      title="Duplicate"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicateProject(proj.id);
                      }}
                      className="p-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl shadow"
                    >
                      <Copy size={15} />
                    </button>

                    <button
                      title="Delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteProject(proj.id);
                      }}
                      className="p-2 bg-neutral-800 hover:bg-red-600 text-neutral-200 rounded-xl shadow"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Star */}
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

                <div className="p-4 flex flex-col justify-between flex-1 bg-neutral-900/60 border-t border-neutral-800/80">
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
    </div>
  );
};
