import React from 'react';
import { Project } from '../types/canvas';
import { SaveStatus } from '../store/useProjectStore';
import {
  ChevronLeft,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Download,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface EditorHeaderProps {
  project: Project;
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  scale: number;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onBackToDashboard: () => void;
  onUpdateTitle: (title: string) => void;
  onOpenExportModal: () => void;
  onOpenPresentation: () => void;
  onPlayAnimation: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  project,
  saveStatus,
  canUndo,
  canRedo,
  scale,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onBackToDashboard,
  onUpdateTitle,
  onOpenExportModal,
  onOpenPresentation,
  onPlayAnimation,
}) => {
  return (
    <header className="h-14 w-full bg-[#0d0e14] border-b border-neutral-800 flex items-center justify-between px-3 z-40 select-none">
      {/* Left: Back + Logo + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg border border-neutral-800 text-xs font-medium transition-colors"
        >
          <ChevronLeft size={16} />
          <span>Dashboard</span>
        </button>

        <div className="h-5 w-[1px] bg-neutral-800" />

        {/* Antigravity Logo mark */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-600/30">
            <Sparkles size={15} className="text-white" />
          </div>

          <input
            type="text"
            value={project.title}
            onChange={(e) => onUpdateTitle(e.target.value)}
            className="bg-transparent hover:bg-neutral-900 focus:bg-neutral-900 border border-transparent focus:border-neutral-700 rounded px-2 py-1 text-sm font-semibold text-neutral-100 outline-none transition-all max-w-[220px] truncate"
          />
        </div>

        {/* Save Status Indicator */}
        <div className="flex items-center gap-1 text-[11px] text-neutral-400">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={13} /> Saved
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-violet-400">
              <Loader2 size={13} className="animate-spin" /> Saving...
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="flex items-center gap-1 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Unsaved changes
            </span>
          )}
        </div>
      </div>

      {/* Center: Undo / Redo + Zoom */}
      <div className="flex items-center gap-1 bg-neutral-900/90 border border-neutral-800 rounded-lg p-1">
        <button
          title="Undo (Ctrl+Z)"
          disabled={!canUndo}
          onClick={onUndo}
          className="p-1.5 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent rounded text-neutral-300 hover:text-white transition-colors"
        >
          <Undo2 size={15} />
        </button>
        <button
          title="Redo (Ctrl+Shift+Z)"
          disabled={!canRedo}
          onClick={onRedo}
          className="p-1.5 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent rounded text-neutral-300 hover:text-white transition-colors"
        >
          <Redo2 size={15} />
        </button>

        <div className="h-4 w-[1px] bg-neutral-800 mx-1" />

        <button
          title="Zoom Out"
          onClick={onZoomOut}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white transition-colors"
        >
          <ZoomOut size={15} />
        </button>

        <button
          title="Reset Zoom to Fit"
          onClick={onResetZoom}
          className="px-2 py-1 hover:bg-neutral-800 rounded text-xs font-mono text-neutral-300 hover:text-white transition-colors"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          title="Zoom In"
          onClick={onZoomIn}
          className="p-1.5 hover:bg-neutral-800 rounded text-neutral-300 hover:text-white transition-colors"
        >
          <ZoomIn size={15} />
        </button>
      </div>

      {/* Right: Motion Preview + Presentation + Export */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPlayAnimation}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-medium text-neutral-300 hover:text-white transition-colors"
          title="Play Canvas Motion"
        >
          <Play size={13} className="text-violet-400" />
          <span className="hidden sm:inline">Play Motion</span>
        </button>

        <button
          onClick={onOpenPresentation}
          className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
          title="Presentation Preview Mode"
        >
          <Maximize2 size={15} />
        </button>

        <button
          onClick={onOpenExportModal}
          className="flex items-center gap-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
