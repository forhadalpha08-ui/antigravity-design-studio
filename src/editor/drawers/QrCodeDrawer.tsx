import React, { useState, useMemo } from 'react';
import { QrCodeElement } from '../../types/canvas';
import { QrCode, Plus } from 'lucide-react';
import { generateQrCode } from '../../utils/qr';
import { generateId } from '../../utils/id';

interface QrCodeDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  elementsCount: number;
  onAddElement: (element: QrCodeElement) => void;
}

export const QrCodeDrawer: React.FC<QrCodeDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  elementsCount,
  onAddElement,
}) => {
  const [data, setData] = useState('https://forhadalpha08-ui.github.io/antigravity-design-studio/');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#0a0b10');

  const qr = useMemo(() => {
    return generateQrCode(data, 160, fgColor, bgColor);
  }, [data, fgColor, bgColor]);

  const handleAddQr = () => {
    const size = 180;
    const newQr: QrCodeElement = {
      id: generateId('qr'),
      name: 'QR Code',
      type: 'qr-code',
      x: Math.round(canvasWidth / 2 - size / 2),
      y: Math.round(canvasHeight / 2 - size / 2),
      width: size,
      height: size,
      data,
      fgColor,
      bgColor,
      opacity: 1,
      zIndex: elementsCount + 1,
      rotation: 0,
      locked: false,
      hidden: false,
    };
    onAddElement(newQr);
  };

  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <QrCode size={18} className="text-violet-400" />
          <span>QR Code Generator</span>
        </h3>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Generate clean, scannable vector QR codes for URLs and text
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Live Preview Box */}
        <div className="flex flex-col items-center justify-center p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
          <div
            className="w-40 h-40 rounded-lg p-2.5 flex items-center justify-center shadow-lg transition-all"
            style={{ backgroundColor: bgColor }}
          >
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: qr.svgString }}
            />
          </div>
          <span className="text-[10px] text-neutral-400 mt-2 font-mono">
            {qr.matrixSize}×{qr.matrixSize} Matrix
          </span>
        </div>

        {/* URL / Text Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-neutral-300">URL or Plain Text</label>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="https://example.com"
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-violet-500 outline-none"
          />
        </div>

        {/* Color Controls */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5 bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <label className="text-[11px] font-semibold text-neutral-300 block">Foreground</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-[11px] font-mono text-neutral-400 uppercase">{fgColor}</span>
            </div>
          </div>

          <div className="space-y-1.5 bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
            <label className="text-[11px] font-semibold text-neutral-300 block">Background</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
              />
              <span className="text-[11px] font-mono text-neutral-400 uppercase">{bgColor}</span>
            </div>
          </div>
        </div>

        {/* Quick URL Presets */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-medium text-neutral-400">Quick URL Templates</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: 'AF-CANVAS Home', url: 'https://forhadalpha08-ui.github.io/antigravity-design-studio/' },
              { label: 'Instagram', url: 'https://instagram.com/' },
              { label: 'Portfolio', url: 'https://github.com/' },
              { label: 'WhatsApp', url: 'https://wa.me/' },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setData(preset.url)}
                className="text-[10px] px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAddQr}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Add QR Code to Canvas</span>
        </button>
      </div>
    </div>
  );
};
