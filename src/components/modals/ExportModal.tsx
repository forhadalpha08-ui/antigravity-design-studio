import React, { useState } from 'react';
import { Project } from '../../types/canvas';
import { exportProject, ExportFormat } from '../../utils/export';
import confetti from 'canvas-confetti';
import { X, Download } from 'lucide-react';

interface ExportModalProps {
  project: Project;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ project, onClose }) => {
  const [format, setFormat] = useState<ExportFormat>('png');
  const [scale, setScale] = useState<1 | 2 | 3 | 4>(2);
  const [quality, setQuality] = useState<number>(0.92);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const calculatedWidth = project.width * scale;
  const calculatedHeight = project.height * scale;

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportProject(project, {
        format,
        scale,
        quality,
        transparentBackground: transparentBg,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#ec4899', '#38bdf8', '#fbbf24'],
      });

      setTimeout(() => {
        setIsExporting(false);
        onClose();
      }, 700);
    } catch (e) {
      console.error('Export error', e);
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm select-none animate-in fade-in duration-150 p-0 sm:p-4">
      <div className="w-full sm:max-w-lg bg-[#12131a] border border-neutral-800 sm:rounded-2xl rounded-t-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Download size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Design</h3>
              <p className="text-xs text-neutral-400">
                High-fidelity rendering up to 4K / 300 DPI
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto overscroll-contain">
          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              File Format
            </label>
            {/* 3 cols on mobile, 5 on sm+ */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(
                [
                  { id: 'png', label: 'PNG', desc: 'Lossless' },
                  { id: 'jpg', label: 'JPG', desc: 'Compact' },
                  { id: 'webp', label: 'WEBP', desc: 'Modern' },
                  { id: 'svg', label: 'SVG', desc: 'Vector' },
                  { id: 'pdf', label: 'PDF', desc: 'Print' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all ${
                    format === f.id
                      ? 'bg-violet-600/20 border-violet-500 text-white shadow-lg shadow-violet-600/10'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span className="text-xs font-bold">{f.label}</span>
                  <span className="text-[9px] text-neutral-500 mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Resolution Multiplier */}
          {format !== 'svg' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                  Resolution Scale
                </label>
                <span className="text-xs font-mono text-violet-400">
                  {calculatedWidth} × {calculatedHeight} px
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([1, 2, 3, 4] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      scale === s
                        ? 'bg-violet-600 border-violet-500 text-white'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {s}x {s === 1 ? '(Standard)' : s === 2 ? '(HD 2x)' : s === 3 ? '(Crisp)' : '(Ultra 4x)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quality Slider for JPG / WEBP */}
          {(format === 'jpg' || format === 'webp') && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span>Compression Quality</span>
                <span>{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={1.0}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-violet-500 cursor-pointer"
              />
            </div>
          )}

          {/* Transparent Background Option */}
          {format === 'png' && (
            <div className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
              <div>
                <span className="text-xs font-medium text-white block">
                  Transparent Background
                </span>
                <span className="text-[11px] text-neutral-500">
                  Export elements without canvas background fill
                </span>
              </div>
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
                className="w-4 h-4 accent-violet-500 rounded cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="p-5 border-t border-neutral-800 bg-neutral-900/40 flex items-center justify-end gap-3 flex-shrink-0"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            disabled={isExporting}
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
          >
            <Download size={15} />
            <span>{isExporting ? 'Generating Download...' : `Download ${format.toUpperCase()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
