import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  LayoutGrid,
  FolderKanban,
  Palette,
  Image as ImageIcon,
  User,
  Home,
  Menu,
  X,
} from 'lucide-react';

export type DashboardTab = 'home' | 'templates' | 'projects' | 'brand-kit' | 'assets';

interface StudioHeaderProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onOpenNewDesign: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'templates', label: 'Templates', icon: LayoutGrid },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'brand-kit', label: 'Brand Kit', icon: Palette },
  { id: 'assets', label: 'Assets', icon: ImageIcon },
];

export const StudioHeader: React.FC<StudioHeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenNewDesign,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabSelect = (tab: DashboardTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="h-16 w-full bg-[#0a0b10]/95 border-b border-neutral-800/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-40 select-none sticky top-0">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-4 min-w-0">
        <div
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-fuchsia-500 p-[1.5px] shadow-lg shadow-violet-600/20 group-hover:shadow-violet-600/40 transition-shadow">
            <div className="w-full h-full bg-[#0d0e14] rounded-[10px] flex items-center justify-center">
              <Sparkles size={18} className="text-violet-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-black tracking-widest text-white uppercase block">
              AF-CANVAS
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 block -mt-1">
              DESIGN STUDIO
            </span>
          </div>
        </div>

        {/* Global Search — visible on md+ */}
        <div className="hidden md:flex relative w-52 lg:w-80">
          <Search size={14} className="absolute left-3.5 top-3 text-neutral-500" />
          <input
            type="text"
            placeholder="Search templates, projects..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-neutral-900/90 border border-neutral-800 hover:border-neutral-700 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-200 outline-none focus:border-violet-500 transition-colors"
          />
        </div>
      </div>

      {/* Desktop Nav — full labels on lg+, icon-only on md */}
      <nav className="hidden md:flex items-center gap-0.5">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={`flex items-center gap-1.5 px-2.5 lg:px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${
              currentTab === id
                ? 'bg-neutral-800 text-white'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
            title={label}
          >
            <Icon size={14} />
            <span className="hidden lg:inline">{label}</span>
          </button>
        ))}
      </nav>

      {/* Right: Create Design + Profile + Mobile Hamburger */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Mobile search icon (shown on sm, hidden on md+) */}
        <div className="md:hidden">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-neutral-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-28 sm:w-44 bg-neutral-900/90 border border-neutral-800 rounded-xl pl-8 pr-2 py-2 text-xs text-neutral-200 outline-none focus:border-violet-500 focus:w-40 sm:focus:w-52 transition-all"
            />
          </div>
        </div>

        <button
          onClick={onOpenNewDesign}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-600/30 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">Create Design</span>
        </button>

        <div className="w-8 h-8 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 flex-shrink-0">
          <User size={15} />
        </div>

        {/* Hamburger for mobile — only shown when below md */}
        <button
          onClick={() => setMobileMenuOpen((v) => !v)}
          className="md:hidden p-2 text-neutral-400 hover:text-white active:bg-neutral-800 rounded-lg"
          title="Menu"
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile dropdown nav — slide down below header on sm screens (md shows real nav) */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-[#0a0b10]/98 border-b border-neutral-800 backdrop-blur-md z-50 flex flex-col p-2 gap-1 md:hidden">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleTabSelect(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors w-full text-left ${
                currentTab === id
                  ? 'bg-neutral-800 text-white'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
