import React from 'react';
import { TableElement, TableCell } from '../../types/canvas';

interface TableSectionProps {
  element: TableElement;
  onUpdate: (updates: Partial<TableElement>) => void;
}

export const TableSection: React.FC<TableSectionProps> = ({ element, onUpdate }) => {
  const {
    rows = 3,
    cols = 3,
    cells = [],
    hasHeaderRow = true,
    headerBg = '#1e1b4b',
    headerColor = '#ffffff',
    borderColor = '#374151',
    borderWidth = 1,
  } = element;

  const handleResizeGrid = (newRows: number, newCols: number) => {
    const nextCells: TableCell[][] = [];
    for (let r = 0; r < newRows; r++) {
      const row: TableCell[] = [];
      for (let c = 0; c < newCols; c++) {
        const existing = cells[r]?.[c];
        row.push(existing || { text: r === 0 && hasHeaderRow ? `Header ${c + 1}` : `Data` });
      }
      nextCells.push(row);
    }
    onUpdate({ rows: newRows, cols: newCols, cells: nextCells });
  };

  return (
    <div className="space-y-4 pt-3 border-t border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Table Configuration
      </div>

      {/* Grid Size */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-neutral-900 border border-neutral-800 rounded p-2">
          <span className="text-neutral-500 block text-[10px]">ROWS (1-8)</span>
          <input
            type="number"
            min="1"
            max="8"
            value={rows}
            onChange={(e) => handleResizeGrid(Math.max(1, Math.min(8, Number(e.target.value))), cols)}
            className="w-full bg-transparent outline-none text-neutral-200 font-mono mt-0.5"
          />
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded p-2">
          <span className="text-neutral-500 block text-[10px]">COLUMNS (1-8)</span>
          <input
            type="number"
            min="1"
            max="8"
            value={cols}
            onChange={(e) => handleResizeGrid(rows, Math.max(1, Math.min(8, Number(e.target.value))))}
            className="w-full bg-transparent outline-none text-neutral-200 font-mono mt-0.5"
          />
        </div>
      </div>

      {/* Header Row Toggle */}
      <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer p-2 bg-neutral-900 rounded border border-neutral-800">
        <span>Header Row</span>
        <input
          type="checkbox"
          checked={hasHeaderRow}
          onChange={(e) => onUpdate({ hasHeaderRow: e.target.checked })}
          className="accent-violet-500 w-4 h-4 rounded"
        />
      </label>

      {/* Colors */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Header Background</span>
          <input
            type="color"
            value={headerBg}
            onChange={(e) => onUpdate({ headerBg: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Border Color</span>
          <input
            type="color"
            value={borderColor}
            onChange={(e) => onUpdate({ borderColor: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border-none bg-transparent"
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-neutral-400">Border Width ({borderWidth}px)</span>
          <input
            type="range"
            min="1"
            max="5"
            value={borderWidth}
            onChange={(e) => onUpdate({ borderWidth: Number(e.target.value) })}
            className="w-24 accent-violet-500"
          />
        </div>
      </div>
    </div>
  );
};
