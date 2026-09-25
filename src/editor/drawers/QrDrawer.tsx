import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import { QrGrid, Palette, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { QrCodeElement } from '../../types/canvas';
import { generateId } from '../../utils/id';

interface QrDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddElement: (el: QrCodeElement) => void;
}

type QrSize = 'small' | 'medium' | 'large';

const SIZE_MAP: Record<QrSize, number> = {
  small: 128,
  medium: 256,
  large: 512,
};

const PREVIEW_SIZE = 200;

export default function QrDrawer({ canvasWidth, canvasHeight, onAddElement }: QrDrawerProps) {
  const [data, setData] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#000000');
  const [size, setSize] = useState<QrSize>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generatePreview = useCallback(async (text: string, fg: string, bg: string) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    if (!text.trim()) {
      // Clear canvas with bg color
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
      }
      setError(null);
      return;
    }

    try {
      setIsGenerating(true);
      setError(null);
      await QRCode.toCanvas(canvas, text, {
        color: { dark: fg, light: bg },
        width: PREVIEW_SIZE,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
    } catch (err) {
      setError('Invalid QR data. Please check your input.');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, PREVIEW_SIZE, PREVIEW_SIZE);
      }
    } finally {
      setIsGenerating(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      generatePreview(data, fgColor, bgColor);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [data, fgColor, bgColor, generatePreview]);

  const handleAdd = () => {
    if (!data.trim()) return;
    const qrSize = SIZE_MAP[size];
    const el: QrCodeElement = {
      id: generateId('qr'),
      name: 'QR Code',
      type: 'qr-code',
      x: Math.round((canvasWidth - qrSize) / 2),
      y: Math.round((canvasHeight - qrSize) / 2),
      width: qrSize,
      height: qrSize,
      rotation: 0,
      opacity: 1,
      zIndex: 0,
      locked: false,
      hidden: false,
      data: data.trim(),
      fgColor,
      bgColor,
      margin: 2,
    };
    onAddElement(el);
  };

  const sizes: { key: QrSize; label: string; px: number }[] = [
    { key: 'small', label: 'Small', px: 128 },
    { key: 'medium', label: 'Medium', px: 256 },
    { key: 'large', label: 'Large', px: 512 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#14151e] text-neutral-200 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-neutral-800 shrink-0">
        <QrGrid size={18} className="text-violet-400" />
        <h2 className="font-semibold text-sm tracking-wide">QR Code Generator</h2>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* URL / Text Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            URL or Text
          </label>
          <div className="relative">
            <textarea
              value={data}
              onChange={(e) => setData(e.target.value)}
              placeholder="https://example.com"
              rows={3}
              className="w-full bg-[#0d0e14] border border-neutral-700 rounded-lg px-3 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 resize-none focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>
        </div>

        {/* Live QR Preview */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Preview
          </label>
          <div className="relative flex items-center justify-center rounded-xl overflow-hidden border border-neutral-800"
            style={{ width: '100%', height: 220, background: bgColor }}>
            <canvas
              ref={canvasRef}
              width={PREVIEW_SIZE}
              height={PREVIEW_SIZE}
              className="rounded-lg"
              style={{ imageRendering: 'pixelated' }}
            />
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                <RefreshCw size={20} className="text-violet-400 animate-spin" />
              </div>
            )}
          </div>
          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              <AlertCircle size={13} />
              {error}
            </div>
          )}
        </div>

        {/* Color Pickers */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette size={13} />
            Colors
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Foreground */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Foreground</span>
              <label className="flex items-center gap-2 bg-[#0d0e14] border border-neutral-700 rounded-lg px-2.5 py-2 cursor-pointer hover:border-neutral-600 transition-colors">
                <span
                  className="w-5 h-5 rounded border border-neutral-600 shrink-0"
                  style={{ background: fgColor }}
                />
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="sr-only"
                />
                <span className="text-xs text-neutral-300 font-mono">{fgColor.toUpperCase()}</span>
              </label>
            </div>
            {/* Background */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Background</span>
              <label className="flex items-center gap-2 bg-[#0d0e14] border border-neutral-700 rounded-lg px-2.5 py-2 cursor-pointer hover:border-neutral-600 transition-colors">
                <span
                  className="w-5 h-5 rounded border border-neutral-600 shrink-0"
                  style={{ background: bgColor }}
                />
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="sr-only"
                />
                <span className="text-xs text-neutral-300 font-mono">{bgColor.toUpperCase()}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Color swap shortcut */}
        <button
          onClick={() => {
            const tmp = fgColor;
            setFgColor(bgColor);
            setBgColor(tmp);
          }}
          className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-300 transition-colors py-1"
        >
          <RefreshCw size={11} />
          Swap colors
        </button>

        {/* Size Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Output Size
          </label>
          <div className="grid grid-cols-3 gap-2">
            {sizes.map(({ key, label, px }) => (
              <button
                key={key}
                onClick={() => setSize(key)}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                  size === key
                    ? 'border-violet-500 bg-violet-500/10 text-violet-300'
                    : 'border-neutral-700 bg-[#0d0e14] text-neutral-400 hover:border-neutral-500 hover:text-neutral-300'
                }`}
              >
                <span>{label}</span>
                <span className={`text-[10px] font-normal ${size === key ? 'text-violet-400/70' : 'text-neutral-600'}`}>
                  {px}px
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Tips */}
        <div className="bg-[#0d0e14] border border-neutral-800 rounded-lg p-3 text-xs text-neutral-500 space-y-1">
          <p className="text-neutral-400 font-medium mb-1">Tips</p>
          <p>• Use HTTPS URLs for best compatibility</p>
          <p>• Keep text short for better scanability</p>
          <p>• Ensure contrast between FG and BG colors</p>
        </div>

        {/* Add to Canvas Button */}
        <button
          onClick={handleAdd}
          disabled={!data.trim() || !!error}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white font-semibold text-sm transition-colors"
        >
          <Plus size={16} />
          Add to Canvas
        </button>
      </div>
    </div>
  );
}
