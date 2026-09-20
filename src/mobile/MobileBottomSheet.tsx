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
      <div className="w-full bg-[#12131a] border-t border-neutral-800 rounded-t-3xl shadow-2xl max-h-[78vh] flex flex-col animate-in slide-in-from-bottom duration-200">
        {/* Grab Handle */}
        <div className="w-full flex items-center justify-center pt-3 pb-1">
          <div className="w-12 h-1.5 bg-neutral-700 rounded-full" />
        </div>

        {/* Sheet Header */}
        <div className="px-5 py-3 border-b border-neutral-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white truncate">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sheet Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};
