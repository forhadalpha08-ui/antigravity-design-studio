import React from 'react';
import { QrCodeElement } from '../../types/canvas';

interface QrCodeSectionProps {
  element: QrCodeElement;
  onUpdate: (updates: Partial<QrCodeElement>) => void;
}

export const QrCodeSection: React.FC<QrCodeSectionProps> = ({ element, onUpdate }) => {
  return (
    <div className="space-y-4 pt-3 border-t border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        QR Code Data
      </div>

      {/* URL or Data */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-300">Target Content</label>
        <textarea
          value={element.data || ''}
          onChange={(e) => onUpdate({ data: e.target.value })}
          rows={2}
          placeholder="https://..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none focus:border-violet-500 resize-none font-mono"
        />
      </div>

      {/* Colors */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Foreground Color</span>
          <input
            type="color"
            value={element.fgColor || '#ffffff'}
            onChange={(e) => onUpdate({ fgColor: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Background Color</span>
          <input
            type="color"
            value={element.bgColor || '#000000'}
            onChange={(e) => onUpdate({ bgColor: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
      </div>
    </div>
  );
};
