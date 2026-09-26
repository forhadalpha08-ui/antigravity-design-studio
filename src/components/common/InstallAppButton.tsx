import React from 'react';
import { Download, Smartphone, Monitor } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { InstallAppModal } from '../modals/InstallAppModal';

interface InstallAppButtonProps {
  variant?: 'header' | 'mobile-header' | 'banner' | 'pill';
  className?: string;
}

export const InstallAppButton: React.FC<InstallAppButtonProps> = ({
  variant = 'header',
  className = '',
}) => {
  const {
    isInstallable,
    isInstalled,
    hasNativePrompt,
    promptInstall,
    isInstallModalOpen,
    setIsInstallModalOpen,
    markAsInstalled,
  } = usePWAInstall();

  // If already installed or not installable, do not render at all!
  if (isInstalled || !isInstallable) {
    return null;
  }

  return (
    <>
      {variant === 'header' && (
        <button
          onClick={promptInstall}
          title="Install AF-CANVAS app for Android & Desktop"
          className={`flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-violet-600/20 hover:from-emerald-600/30 hover:to-violet-600/30 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer animate-in fade-in duration-200 group ${className}`}
        >
          <Download size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Install App</span>
        </button>
      )}

      {variant === 'mobile-header' && (
        <button
          onClick={promptInstall}
          title="Install App"
          className={`flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 active:bg-emerald-600/30 rounded-xl text-xs font-bold transition-colors cursor-pointer ${className}`}
        >
          <Download size={13} className="text-emerald-400" />
          <span>Install</span>
        </button>
      )}

      {variant === 'pill' && (
        <button
          onClick={promptInstall}
          className={`flex items-center gap-2 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-semibold shadow-sm transition-all cursor-pointer ${className}`}
        >
          <Download size={13} className="text-emerald-400" />
          <span>Download / Install App</span>
        </button>
      )}

      {variant === 'banner' && (
        <div
          className={`bg-gradient-to-r from-violet-950/60 via-indigo-950/50 to-emerald-950/60 border border-emerald-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg ${className}`}
        >
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Download size={20} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <span>Download AF-CANVAS App</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded font-mono">
                  Android & Desktop
                </span>
              </h4>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Install as a native application with full-screen editing and offline design access.
              </p>
            </div>
          </div>

          <button
            onClick={promptInstall}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Download size={14} />
            <span>Install App</span>
          </button>
        </div>
      )}

      {/* Install App Guidance Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
        onInstall={promptInstall}
        onMarkInstalled={markAsInstalled}
        hasNativePrompt={hasNativePrompt}
      />
    </>
  );
};
