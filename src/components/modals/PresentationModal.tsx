import React, { useState } from 'react';
import { Project } from '../../types/canvas';
import { CanvasRenderer } from '../../editor/canvas/CanvasRenderer';
import { X, Play, Pause, Maximize, Minimize } from 'lucide-react';

interface PresentationModalProps {
  project: Project;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({ project, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Compute scale to fill window nicely
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  const scale = Math.min(
    (windowWidth * 0.85) / project.width,
    (windowHeight * 0.8) / project.height
  );

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07080c] flex flex-col items-center justify-center select-none animate-in fade-in duration-200">
      {/* Top Floating Control Pill */}
      <div className="absolute top-6 flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl z-50">
        <span className="text-xs font-semibold text-neutral-300 mr-2 truncate max-w-xs">
          {project.title}
        </span>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-full text-white transition-colors"
          title={isPlaying ? 'Pause Motion' : 'Play Motion'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-1.5 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
        </button>

        <div className="w-[1px] h-4 bg-neutral-800 mx-1" />

        <button
          onClick={onClose}
          className="p-1.5 hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-white transition-colors"
          title="Exit Presentation"
        >
          <X size={14} />
        </button>
      </div>

      {/* Render Canvas in Presentation Scale */}
      <div
        className="shadow-2xl origin-center will-change-transform"
        style={{
          transform: `scale(${scale})`,
          width: `${project.width}px`,
          height: `${project.height}px`,
        }}
      >
        <CanvasRenderer
          project={project}
          selectedId={null}
          onSelectElement={() => {}}
          onUpdateElement={() => {}}
          isPlayingAnimation={isPlaying}
        />
      </div>
    </div>
  );
};
