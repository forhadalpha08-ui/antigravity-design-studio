import React from 'react';
import { Sparkles, Plus, Search, LayoutGrid, FolderKanban, Palette, Image as ImageIcon, User } from 'lucide-react';

export type DashboardTab = 'home' | 'templates' | 'projects' | 'brand-kit' | 'assets';

interface StudioHeaderProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenNewDesign: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewDesign,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="h-16 w-full bg-[#0a0b10]/95 border-b border-neutral-800/80 backdrop-blur-md px-6 flex items-center justify-between z-40 select-none sticky top-0">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-6">
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 p-[1.5px] shadow-lg shadow-violet-600/20 group-hover:shadow-violet-600/40 transition-shadow">
            <div className="w-full h-full bg-[#0d0e14] rounded-[10px] flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <span className="text-sm font-black tracking-widest text-white uppercase block">
              ANTIGRAVITY
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 block -mt-1">
              DESIGN STUDIO
            </span>
          </div>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex relative w-64 lg:w-80">
          <Search size={14} className="absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search templates, projects, tools..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Nav Links */}
      <nav className="hidden lg:flex items-center gap-1">
        <button
          onClick={() => onSelectTab('home')}
          className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            currentTab === 'home'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          Home
        </button>

        <button
          onClick={() => onSelectTab('templates')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            currentTab === 'templates'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <LayoutGrid size={14} />
          <span>Templates</span>
        </button>

        <button
          onClick={() => onSelectTab('projects')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            currentTab === 'projects'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <FolderKanban size={14} />
          <span>Projects</span>
        </button>

        <button
          onClick={() => onSelectTab('brand-kit')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            currentTab === 'brand-kit'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <Palette size={14} />
          <span>Brand Kit</span>
        </button>

        <button
          onClick={() => onSelectTab('assets')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
            currentTab === 'assets'
              ? 'bg-neutral-800 text-white'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <ImageIcon size={14} />
          <span>Assets</span>
        </button>
      </nav>

      {/* Right: Create Design Button + Profile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenNewDesign}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Create Design</span>
        </button>

        <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300">
          <User size={15} />
        </div>
      </div>
    </header>
  );
};
