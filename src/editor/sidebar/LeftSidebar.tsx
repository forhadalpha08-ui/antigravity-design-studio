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
  Pen,
  BarChart3,
  Table,
  QrCode,
  Wand2,
  MessageSquare,
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
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'ai-tools', label: 'AI Studio', icon: Wand2, shortcut: 'A', highlight: true },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, shortcut: 'T' },
  { id: 'elements', label: 'Elements', icon: Shapes, shortcut: 'E' },
  { id: 'text', label: 'Text', icon: Type, shortcut: 'X' },
  { id: 'draw', label: 'Draw', icon: Pen, shortcut: 'D' },
  { id: 'charts', label: 'Charts', icon: BarChart3, shortcut: 'C' },
  { id: 'tables', label: 'Tables', icon: Table },
  { id: 'qr', label: 'QR Code', icon: QrCode },
  { id: 'images', label: 'Uploads', icon: Image, shortcut: 'I' },
  { id: 'background', label: 'Background', icon: Sparkles, shortcut: 'B' },
  { id: 'brand-kit', label: 'Brand Kit', icon: Palette, shortcut: 'K' },
  { id: 'layers', label: 'Layers', icon: Layers, shortcut: 'L' },
  { id: 'comments', label: 'Comments', icon: MessageSquare },
];

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeDrawer,
  activeTool,
  onSelectDrawer,
  onSelectTool,
}) => {
  return (
    <aside className="w-16 h-full bg-[#0d0e14] border-r border-neutral-800 flex flex-col items-center py-2 z-30 select-none overflow-y-auto no-scrollbar">
      {/* Pointer / Hand / Draw / Comment Quick Tools */}
      <div className="flex flex-col gap-1 pb-2 mb-2 border-b border-neutral-800 w-full px-2 shrink-0">
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
          <MousePointer size={16} />
          <span className="text-[8px] mt-0.5 font-medium">Select</span>
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
          <Hand size={16} />
          <span className="text-[8px] mt-0.5 font-medium">Hand</span>
        </button>

        <button
          title="Draw / Pen Tool (P)"
          onClick={() => {
            onSelectTool(activeTool === 'draw' ? 'select' : 'draw');
            onSelectDrawer('draw');
          }}
          className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${
            activeTool === 'draw'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
          }`}
        >
          <Pen size={16} />
          <span className="text-[8px] mt-0.5 font-medium">Draw</span>
        </button>

        <button
          title="Comments / Pin Note (C)"
          onClick={() => {
            onSelectTool(activeTool === 'comment' ? 'select' : 'comment');
            onSelectDrawer('comments');
          }}
          className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${
            activeTool === 'comment'
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/30'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
          }`}
        >
          <MessageSquare size={16} />
          <span className="text-[8px] mt-0.5 font-medium">Feedback</span>
        </button>
      </div>

      {/* Main Feature Drawers */}
      <div className="flex-1 flex flex-col gap-1 w-full px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeDrawer === item.id;

          return (
            <button
              key={item.id}
              title={`${item.label} ${item.shortcut ? `(${item.shortcut})` : ''}`}
              onClick={() => {
                onSelectDrawer(isActive ? null : item.id);
                if (item.id === 'draw') {
                  onSelectTool('draw');
                } else if (item.id === 'comments') {
                  // Keep current tool or select
                } else if (activeTool === 'draw' || activeTool === 'comment') {
                  onSelectTool('select');
                }
              }}
              className={`w-full aspect-square flex flex-col items-center justify-center rounded-xl transition-all relative ${
                isActive
                  ? 'bg-neutral-800 text-violet-400 border border-violet-500/40 shadow-inner'
                  : item.highlight
                  ? 'text-violet-300 hover:text-white hover:bg-violet-950/40 border border-violet-900/40'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Icon size={17} className={item.highlight && !isActive ? 'text-violet-400' : undefined} />
              <span className="text-[8px] mt-0.5 font-medium truncate max-w-[52px]">
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
