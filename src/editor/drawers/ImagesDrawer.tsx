import React, { useState, useRef } from 'react';
import { ImageElement } from '../../types/canvas';
import { STOCK_IMAGES } from '../../assets/stockImages';
import { loadUserAssets, saveUserAsset } from '../../utils/storage';
import { generateId } from '../../utils/id';
import { Upload, Image as ImageIcon, Sparkles } from 'lucide-react';

interface ImagesDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddElement: (element: ImageElement) => void;
}

export const ImagesDrawer: React.FC<ImagesDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  onAddElement,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'uploads'>('stock');
  const [userAssets, setUserAssets] = useState<string[]>(loadUserAssets);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImageToCanvas = (src: string, title = 'Image Asset') => {
    const w = Math.min(canvasWidth - 100, 600);
    const h = Math.round(w * 0.75);

    const el: ImageElement = {
      id: generateId('img'),
      name: title,
      type: 'image',
      src,
      objectFit: 'cover',
      flipX: false,
      flipY: false,
      filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0,
        grayscale: 0,
        duotoneEnabled: false,
      },
      borderRadius: 16,
      x: Math.round((canvasWidth - w) / 2),
      y: Math.round((canvasHeight - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      locked: false,
      hidden: false,
    };
    onAddElement(el);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveUserAsset(dataUrl);
      setUserAssets(loadUserAssets());
      addImageToCanvas(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-80 h-full bg-[#14151e] border-r border-neutral-800 flex flex-col z-20 select-none overflow-y-auto">
      <div className="p-4 border-b border-neutral-800 space-y-3">
        <h2 className="text-xs font-semibold text-neutral-200 uppercase tracking-wider">
          Imagery & Media
        </h2>

        {/* Upload Trigger Button */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-violet-600/20 transition-all cursor-pointer"
        >
          <Upload size={15} /> Upload JPG / PNG / SVG
        </button>

        {/* Tab switch */}
        <div className="grid grid-cols-2 bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs">
          <button
            onClick={() => setActiveTab('stock')}
            className={`py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'stock'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Curated Stock
          </button>
          <button
            onClick={() => setActiveTab('uploads')}
            className={`py-1.5 rounded-md font-medium transition-colors ${
              activeTab === 'uploads'
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            My Uploads ({userAssets.length})
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="p-3 flex-1 overflow-y-auto">
        {activeTab === 'stock' ? (
          <div className="grid grid-cols-2 gap-2">
            {STOCK_IMAGES.map((img) => (
              <div
                key={img.id}
                onClick={() => addImageToCanvas(img.url, img.title)}
                className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-violet-500 transition-all cursor-pointer shadow"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  crossOrigin="anonymous"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                  <span className="text-[10px] text-white font-medium truncate">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {userAssets.length === 0 ? (
              <div className="text-center py-10 px-4 text-neutral-500 text-xs">
                <ImageIcon size={32} className="mx-auto mb-2 opacity-40" />
                No uploaded assets yet. Click &quot;Upload&quot; to add your own photos and brand graphics.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {userAssets.map((assetUrl, idx) => (
                  <div
                    key={idx}
                    onClick={() => addImageToCanvas(assetUrl, `Uploaded ${idx + 1}`)}
                    className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-violet-500 transition-all cursor-pointer"
                  >
                    <img
                      src={assetUrl}
                      alt="Uploaded Asset"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
