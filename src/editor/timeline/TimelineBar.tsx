import React from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface TimelineBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  isPlaying,
  onTogglePlay,
  onReset,
}) => {
  return (
    <div className="h-10 w-full bg-[#0e0f16] border-t border-neutral-800/80 px-4 flex items-center justify-between z-30 select-none text-xs text-neutral-400">
      <div className="flex items-center gap-3">
        <button
          onClick={onTogglePlay}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors"
        >
          {isPlaying ? <Pause size={13} /> : <Play size={13} className="text-violet-400" />}
          <span className="text-[11px] font-medium">{isPlaying ? 'Pause' : 'Play Motion'}</span>
        </button>

        <button
          onClick={onReset}
          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-colors"
          title="Reset Animations"
        >
          <RotateCcw size={13} />
        </button>

        <div className="h-3.5 w-[1px] bg-neutral-800" />

        <div className="flex items-center gap-1 text-[11px] text-neutral-500">
          <Sparkles size={12} className="text-violet-400" />
          <span>Real-time CSS Motion Engine</span>
        </div>
      </div>

      <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500">
        <span>60 FPS</span>
        <span>•</span>
        <span>Hardware Accelerated</span>
      </div>
    </div>
  );
};
