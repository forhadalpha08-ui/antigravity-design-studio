import React, { useState } from 'react';
import { TableElement, TableCell } from '../../types/canvas';
import { Table, Plus } from 'lucide-react';
import { generateId } from '../../utils/id';

interface TablesDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  elementsCount: number;
  onAddElement: (element: TableElement) => void;
}

const TABLE_THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian Dark',
    headerBg: '#18181b',
    headerColor: '#ffffff',
    cellBg1: '#09090b',
    cellBg2: '#121215',
    cellColor: '#e4e4e7',
    borderColor: '#27272a',
  },
  {
    id: 'royal-violet',
    name: 'Royal Violet',
    headerBg: '#4c1d95',
    headerColor: '#ffffff',
    cellBg1: '#1e1b4b',
    cellBg2: '#2e1065',
    cellColor: '#ede9fe',
    borderColor: '#5b21b6',
  },
  {
    id: 'emerald',
    name: 'Emerald Slate',
    headerBg: '#064e3b',
    headerColor: '#ffffff',
    cellBg1: '#022c22',
    cellBg2: '#064e3b',
    cellColor: '#d1fae5',
    borderColor: '#047857',
  },
  {
    id: 'glass',
    name: 'Frosted Glass',
    headerBg: 'rgba(255, 255, 255, 0.15)',
    headerColor: '#ffffff',
    cellBg1: 'rgba(255, 255, 255, 0.03)',
    cellBg2: 'rgba(255, 255, 255, 0.07)',
    cellColor: '#ffffff',
    borderColor: 'rgba(255, 255, 255, 0.18)',
  },
];

export const TablesDrawer: React.FC<TablesDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  elementsCount,
  onAddElement,
}) => {
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(3);
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(TABLE_THEMES[0]);
  const [hasHeader, setHasHeader] = useState(true);

  const handleInsertTable = () => {
    const tableW = Math.min(canvasWidth - 80, Math.max(300, cols * 110));
    const tableH = Math.min(canvasHeight - 80, Math.max(160, rows * 42));

    const sampleHeaders = ['Feature', 'Plan Standard', 'Plan Pro', 'Enterprise', 'Notes', 'Region', 'Status', 'Score'];
    const sampleRows = [
      ['Analytics Dashboard', 'Included', 'Advanced', 'Full API'],
      ['Cloud Storage', '5 GB', '50 GB', 'Unlimited'],
      ['Team Seats', '1 User', '5 Users', 'Custom'],
      ['Support SLA', 'Standard', 'Priority 24/7', 'Dedicated'],
      ['Custom Domains', '1', '5', 'Unlimited'],
    ];

    const cells: TableCell[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowCells: TableCell[] = [];
      for (let c = 0; c < cols; c++) {
        let text = '';
        if (r === 0 && hasHeader) {
          text = sampleHeaders[c % sampleHeaders.length];
        } else {
          text = sampleRows[(r - 1) % sampleRows.length]?.[c] || `Item ${r},${c + 1}`;
        }

        rowCells.push({
          text,
          bg: r === 0 && hasHeader ? selectedTheme.headerBg : (r % 2 === 0 ? selectedTheme.cellBg1 : selectedTheme.cellBg2),
          color: r === 0 && hasHeader ? selectedTheme.headerColor : selectedTheme.cellColor,
          bold: r === 0 && hasHeader,
          align: r === 0 || c > 0 ? 'center' : 'left',
        });
      }
      cells.push(rowCells);
    }

    const newTable: TableElement = {
      id: generateId('table'),
      name: `Table (${rows}x${cols})`,
      type: 'table',
      x: Math.round(canvasWidth / 2 - tableW / 2),
      y: Math.round(canvasHeight / 2 - tableH / 2),
      width: tableW,
      height: tableH,
      rows,
      cols,
      cells,
      hasHeaderRow: hasHeader,
      headerBg: selectedTheme.headerBg,
      headerColor: selectedTheme.headerColor,
      borderColor: selectedTheme.borderColor,
      borderWidth: 1,
      opacity: 1,
      zIndex: elementsCount + 1,
      rotation: 0,
      locked: false,
      hidden: false,
    };

    onAddElement(newTable);
  };

  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Table size={18} className="text-violet-400" />
          <span>Table Generator</span>
        </h3>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Insert structured, style-customizable data tables
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Interactive Grid Size Picker (Up to 6x6) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-300">Quick Grid Picker</span>
            <span className="text-violet-400 font-bold font-mono">
              {hoverRow || rows} x {hoverCol || cols}
            </span>
          </div>

          <div
            className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex flex-col gap-1 items-center"
            onMouseLeave={() => {
              setHoverRow(0);
              setHoverCol(0);
            }}
          >
            {Array.from({ length: 6 }).map((_, rIdx) => (
              <div key={rIdx} className="flex gap-1">
                {Array.from({ length: 6 }).map((_, cIdx) => {
                  const r = rIdx + 1;
                  const c = cIdx + 1;
                  const isHovered = r <= (hoverRow || rows) && c <= (hoverCol || cols);

                  return (
                    <button
                      key={cIdx}
                      className={`w-6 h-6 rounded border transition-colors ${
                        isHovered
                          ? 'bg-violet-600 border-violet-400'
                          : 'bg-neutral-800/80 border-neutral-700 hover:border-neutral-500'
                      }`}
                      onMouseEnter={() => {
                        setHoverRow(r);
                        setHoverCol(c);
                      }}
                      onClick={() => {
                        setRows(r);
                        setCols(c);
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Header Toggle */}
        <label className="flex items-center justify-between p-3 bg-neutral-900 border border-neutral-800 rounded-xl cursor-pointer">
          <span className="text-xs font-semibold text-neutral-300">Header Row</span>
          <input
            type="checkbox"
            checked={hasHeader}
            onChange={(e) => setHasHeader(e.target.checked)}
            className="accent-violet-500 w-4 h-4 rounded cursor-pointer"
          />
        </label>

        {/* Theme Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-neutral-300">Styling Preset</label>
          <div className="grid grid-cols-2 gap-2">
            {TABLE_THEMES.map((theme) => {
              const isSelected = selectedTheme.id === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-violet-500 bg-violet-600/10 text-white shadow-sm'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="flex gap-1 mb-1.5">
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.headerBg }} />
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.cellBg1 }} />
                    <div className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: theme.cellBg2 }} />
                  </div>
                  <span className="text-xs font-medium">{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Insert Button */}
        <button
          onClick={handleInsertTable}
          className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          <span>Insert Table ({rows}×{cols})</span>
        </button>

        <p className="text-[11px] text-neutral-500 text-center">
          Double-click any cell on canvas to edit text directly.
        </p>
      </div>
    </div>
  );
};
