import React, { useState, useRef } from 'react';
import { STOCK_IMAGES } from '../../assets/stockImages';
import { loadUserAssets, saveUserAsset } from '../../utils/storage';
import { Upload, Image as ImageIcon } from 'lucide-react';

export const AssetLibrary: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stock' | 'uploads'>('stock');
  const [userAssets, setUserAssets] = useState<string[]>(loadUserAssets);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Fashion', 'Luxury Brand', 'Technology', 'Sports', 'Music', 'Restaurant', 'Travel', 'Business'];

  const filteredStock = STOCK_IMAGES.filter(
    (img) => selectedCategory === 'All' || img.category === selectedCategory
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      saveUserAsset(dataUrl);
      setUserAssets(loadUserAssets());
      setActiveTab('uploads');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 w-full overflow-y-auto px-6 py-8 space-y-8 max-w-7xl mx-auto select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
            <ImageIcon size={28} className="text-violet-400" />
            <span>Creative Assets Library</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Access curated high-resolution photography and your uploaded design materials
          </p>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/png, image/jpeg, image/webp, image/svg+xml"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Upload size={15} />
          <span>Upload Image</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'stock'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Curated Photography ({STOCK_IMAGES.length})
        </button>
        <button
          onClick={() => setActiveTab('uploads')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
            activeTab === 'uploads'
              ? 'bg-violet-600 text-white'
              : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          My Uploaded Assets ({userAssets.length})
        </button>
      </div>

      {/* Stock Category Pills */}
      {activeTab === 'stock' && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-200 text-neutral-900 font-bold'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Assets Grid */}
      {activeTab === 'stock' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredStock.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md"
            >
              <img
                src={img.url}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                crossOrigin="anonymous"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-xs font-bold text-white truncate">
                  {img.title}
                </span>
                <span className="text-[10px] text-violet-400 uppercase font-semibold mt-0.5">
                  {img.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          {userAssets.length === 0 ? (
            <div className="p-16 text-center bg-neutral-900/40 border border-neutral-800 rounded-3xl text-neutral-500 text-sm">
              <ImageIcon size={40} className="mx-auto mb-3 opacity-30 text-violet-400" />
              <p className="font-semibold text-neutral-400">No uploaded assets yet</p>
              <p className="text-xs text-neutral-500 mt-1">
                Upload your company logos, product pictures, or vector graphics to reuse them across any project.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {userAssets.map((url, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-md"
                >
                  <img
                    src={url}
                    alt={`Asset ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs text-white font-medium">Asset #{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
