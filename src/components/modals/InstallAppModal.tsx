import React from 'react';
import {
  Download,
  Smartphone,
  Monitor,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  onMarkInstalled: () => void;
  hasNativePrompt: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  isOpen,
  onClose,
  onInstall,
  onMarkInstalled,
  hasNativePrompt,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[10005] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#10121a] border border-neutral-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-neutral-800/80 flex items-center justify-between bg-gradient-to-b from-neutral-900/60 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 p-[1.5px] shadow-lg shadow-violet-600/30">
              <div className="w-full h-full bg-[#0d0e14] rounded-[14px] flex items-center justify-center">
                <Download size={22} className="text-violet-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Install AF-CANVAS</span>
                <span className="text-[10px] font-mono font-bold bg-violet-600/30 text-violet-300 border border-violet-500/40 px-2 py-0.5 rounded-full">
                  App
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                For Android Phone & Desktop (Chrome, Edge, Samsung Browser)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[70vh] no-scrollbar">
          {/* Quick Perks */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-violet-600/20 text-violet-400 shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Full Screen</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  No browser bars or address bar distractions.
                </span>
              </div>
            </div>

            <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl flex items-start gap-2.5">
              <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Offline Ready</span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Instant launch from your home screen or desktop.
                </span>
              </div>
            </div>
          </div>

          {/* Installation Instructions for Platforms */}
          <div className="space-y-3">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              How to Install
            </span>

            {/* 1. Android Phone */}
            <div className="p-3.5 bg-neutral-900/90 border border-neutral-800/90 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Smartphone size={16} className="text-emerald-400" />
                <span>On Android Phone (Chrome / Samsung Internet)</span>
              </div>
              <ol className="text-xs text-neutral-300 space-y-1.5 pl-6 list-decimal">
                <li>
                  Tap the Chrome menu <strong className="text-white">⋮</strong> (three dots at top right)
                </li>
                <li>
                  Tap <strong className="text-emerald-400">&quot;Install app&quot;</strong> or <strong className="text-emerald-400">&quot;Add to Home screen&quot;</strong>
                </li>
                <li>Confirm to download AF-CANVAS directly to your app drawer!</li>
              </ol>
            </div>

            {/* 2. Desktop Computer */}
            <div className="p-3.5 bg-neutral-900/90 border border-neutral-800/90 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <Monitor size={16} className="text-blue-400" />
                <span>On Desktop (Windows / Mac / Chrome / Edge)</span>
              </div>
              <ol className="text-xs text-neutral-300 space-y-1.5 pl-6 list-decimal">
                <li>
                  Click the install icon <strong className="text-white">⊕</strong> or computer icon in the browser address bar
                </li>
                <li>
                  Click <strong className="text-blue-400">&quot;Install AF-CANVAS&quot;</strong>
                </li>
                <li>Launches instantly in a standalone window with desktop shortcut!</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 sm:p-5 border-t border-neutral-800/80 bg-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onMarkInstalled}
            className="text-xs text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer py-1"
          >
            Already installed? Hide this button
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onInstall}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
            >
              <Download size={15} />
              <span>Install App Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
