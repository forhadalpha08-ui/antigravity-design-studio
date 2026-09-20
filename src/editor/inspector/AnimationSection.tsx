import React from 'react';
import { CanvasElement, AnimationType } from '../../types/canvas';
import { Play } from 'lucide-react';

interface AnimationSectionProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  onPlayAnimation: () => void;
}

export const AnimationSection: React.FC<AnimationSectionProps> = ({
  element,
  onUpdate,
  onPlayAnimation,
}) => {
  const anim = element.animation || {
    type: 'none',
    duration: 0.8,
    delay: 0,
  };

  const setAnim = (updates: Partial<typeof anim>) => {
    onUpdate({
      animation: {
        ...anim,
        ...updates,
      },
    });
  };

  return (
    <div className="space-y-3 pb-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Motion & Animation
        </span>
        <button
          onClick={onPlayAnimation}
          className="flex items-center gap-1 text-[11px] text-violet-400 hover:text-violet-300 font-medium"
        >
          <Play size={12} /> Preview
        </button>
      </div>

      {/* Animation Type */}
      <div className="space-y-1">
        <label className="text-[11px] text-neutral-500">Entrance Animation</label>
        <select
          value={anim.type}
          onChange={(e) => setAnim({ type: e.target.value as AnimationType })}
          className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-neutral-200 outline-none"
        >
          <option value="none">None (Static)</option>
          <option value="fade">Fade In</option>
          <option value="slide-up">Slide Up</option>
          <option value="slide-down">Slide Down</option>
          <option value="slide-left">Slide Left</option>
          <option value="slide-right">Slide Right</option>
          <option value="scale">Pop Scale</option>
          <option value="zoom">Cinematic Zoom</option>
          <option value="rotate">Smooth Rotate</option>
          <option value="bounce">Spring Bounce</option>
          <option value="float">Continuous Float</option>
          <option value="pulse">Rhythmic Pulse</option>
        </select>
      </div>

      {anim.type !== 'none' && (
        <div className="space-y-2 pt-1">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Duration</span>
              <span>{anim.duration}s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={3}
              step={0.1}
              value={anim.duration}
              onChange={(e) => setAnim({ duration: Number(e.target.value) })}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>Delay</span>
              <span>{anim.delay}s</span>
            </div>
            <input
              type="range"
              min={0}
              max={2}
              step={0.1}
              value={anim.delay}
              onChange={(e) => setAnim({ delay: Number(e.target.value) })}
              className="w-full accent-violet-500 cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
