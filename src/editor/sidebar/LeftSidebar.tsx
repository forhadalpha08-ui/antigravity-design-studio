import React from 'react';
import { DrawerType, ToolType } from '../../store/useEditorStore';
import {
  LayoutTemplate,
  Shapes,
  Type,
  Image,
  Sparkles,
  Palette,
  Layers,
  Hand,
  MousePointer,
} from 'lucide-react';

interface LeftSidebarProps {
  activeDrawer: DrawerType;
  activeTool: ToolType;
  onSelectDrawer: (drawer: DrawerType) => void;
  onSelectTool: (tool: ToolType) => void;
}

interface NavItem {
  id: DrawerType;
  label: string;
  icon: React.ElementType;
  shortcut?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, shortcut: 'T' },
  { id: 'elements', label: 'Elements', icon: Shapes, shortcut: 'E' },
  { id: 'text', label: 'Text', icon: Type, shortcut: 'X' },
  { id: 'images', label: 'Uploads & Stock', icon: Image, shortcut: 'I' },
  { id: 'background', label: 'Backgrounds', icon: Sparkles, shortcut: 'B' },
  { id: 'brand-kit', label: 'Brand Kit', icon: Palette, shortcut: 'K' },
  { id: 'layers', label: 'Layers', icon: Layers, shortcut: 'L' },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeDrawer,
  activeTool,
  onSelectDrawer,
  onSelectTool,
}) => {
  return (
    <aside className="w-16 h-full bg-[#0d0e14] border-r border-neutral-800 flex flex-col items-center py-3 z-30 select-none">
      {/* Pointer / Hand Tools */}
      <div className="flex flex-col gap-1 pb-3 mb-3 border-b border-neutral-800 w-full px-2">
        <button
          title="Select Tool (V)"
          onClick={() => {
            onSelectTool('select');
          }}
          className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${
            activeTool === 'select'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
          }`}
        >
          <MousePointer size={18} />
          <span className="text-[9px] mt-1 font-medium">Select</span>
        </button>

        <button
          title="Hand Pan Tool (H / Spacebar)"
          onClick={() => {
            onSelectTool(activeTool === 'hand' ? 'select' : 'hand');
          }}
          className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${
            activeTool === 'hand'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
          }`}
        >
          <Hand size={18} />
          <span className="text-[9px] mt-1 font-medium">Hand</span>
        </button>
      </div>

      {/* Main Feature Drawers */}
      <div className="flex-1 flex flex-col gap-1.5 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeDrawer === item.id;

          return (
            <button
              key={item.id}
              title={`${item.label} (${item.shortcut})`}
              onClick={() => {
                onSelectDrawer(isActive ? null : item.id);
                onSelectTool('select');
              }}
              className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative ${
                isActive
                  ? 'bg-neutral-800 text-violet-400 border border-violet-500/40 shadow-inner'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] mt-1 font-medium truncate max-w-[50px]">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-violet-500 rounded-r" />
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
};
