import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface MobileBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm select-none animate-in fade-in duration-150">
      {/* Tap backdrop to dismiss */}
      <div className="flex-1 w-full" onClick={onClose} />

      {/* Sheet Content Container */}
      <div
        className="w-full bg-[#12131a] border-t border-neutral-800 rounded-t-3xl shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200 overscroll-contain"
        style={{ maxHeight: '82vh' }}
      >
        {/* Grab Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
          <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors flex-shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sheet Scrollable Body — safe-area bottom padding so content clears the home bar */}
        <div
          className="p-5 overflow-y-auto flex-1 space-y-4 overscroll-contain"
          style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 20px)' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
