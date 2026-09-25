import { useState, useMemo } from 'react';
import { TableProperties, Plus, Palette, Grid3x3 } from 'lucide-react';
import { TableElement, TableCell } from '../../types/canvas';
import { generateId } from '../../utils/id';

interface TableDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  onAddElement: (el: TableElement) => void;
}

const MIN_DIM = 2;
const MAX_DIM = 8;
const ROW_HEIGHT = 40;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

export default function TableDrawer({ canvasWidth, canvasHeight, onAddElement }: TableDrawerProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [hasHeaderRow, setHasHeaderRow] = useState(true);
  const [headerBg, setHeaderBg] = useState('#7c3aed');
  const [headerColor, setHeaderColor] = useState('#ffffff');
  const [borderColor, setBorderColor] = useState('#374151');
  const [borderWidth, setBorderWidth] = useState(1);

  const handleRowsChange = (val: string) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) setRows(clamp(n, MIN_DIM, MAX_DIM));
  };

  const handleColsChange = (val: string) => {
    const n = parseInt(val, 10);
    if (!isNaN(n)) setCols(clamp(n, MIN_DIM, MAX_DIM));
  };

  // Build preview cell matrix
  const previewCells = useMemo(() => {
    return Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, (_, c) => {
        const isHeader = hasHeaderRow && r === 0;
        return { isHeader, col: c };
      })
    );
  }, [rows, cols, hasHeaderRow]);

  const handleAdd = () => {
    // Build full cell matrix
    const cells: TableCell[][] = Array.from({ length: rows }, (_, r) =>
      Array.from({ length: cols }, () => {
        const isHeader = hasHeaderRow && r === 0;
        return {
          text: '',
          bg: isHeader ? headerBg : undefined,
          color: isHeader ? headerColor : undefined,
          bold: isHeader ? true : undefined,
          align: 'left' as const,
        };
      })
    );

    const tableWidth = Math.min(canvasWidth - 100, 700);
    const tableHeight = rows * ROW_HEIGHT;

    const el: TableElement = {
      id: generateId('tbl'),
      name: 'Table',
      type: 'table',
      x: Math.round((canvasWidth - tableWidth) / 2),
      y: Math.round((canvasHeight - tableHeight) / 2),
      width: tableWidth,
      height: tableHeight,
      rotation: 0,
      opacity: 1,
      zIndex: 0,
      locked: false,
      hidden: false,
      rows,
      cols,
      cells,
      hasHeaderRow,
      headerBg,
      headerColor,
      borderColor,
      borderWidth,
    };

    onAddElement(el);
  };

  // Preview cell size
  const previewContainerWidth = 272; // drawer inner width
  const cellW = Math.floor(previewContainerWidth / cols);
  const cellH = 28;

  return (
    <div className="flex flex-col h-full bg-[#14151e] text-neutral-200 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-neutral-800 shrink-0">
        <TableProperties size={18} className="text-emerald-400" />
        <h2 className="font-semibold text-sm tracking-wide">Table Builder</h2>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Rows / Cols Picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Grid3x3 size={13} />
            Dimensions
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Rows</span>
              <div className="flex items-center gap-1 bg-[#0d0e14] border border-neutral-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setRows((r) => clamp(r - 1, MIN_DIM, MAX_DIM))}
                  className="px-2.5 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  −
                </button>
                <input
                  type="number"
                  min={MIN_DIM}
                  max={MAX_DIM}
                  value={rows}
                  onChange={(e) => handleRowsChange(e.target.value)}
                  className="w-full text-center bg-transparent text-sm text-neutral-200 focus:outline-none py-2"
                />
                <button
                  onClick={() => setRows((r) => clamp(r + 1, MIN_DIM, MAX_DIM))}
                  className="px-2.5 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Columns</span>
              <div className="flex items-center gap-1 bg-[#0d0e14] border border-neutral-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setCols((c) => clamp(c - 1, MIN_DIM, MAX_DIM))}
                  className="px-2.5 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  −
                </button>
                <input
                  type="number"
                  min={MIN_DIM}
                  max={MAX_DIM}
                  value={cols}
                  onChange={(e) => handleColsChange(e.target.value)}
                  className="w-full text-center bg-transparent text-sm text-neutral-200 focus:outline-none py-2"
                />
                <button
                  onClick={() => setCols((c) => clamp(c + 1, MIN_DIM, MAX_DIM))}
                  className="px-2.5 py-2 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors text-sm font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-neutral-600 text-center">
            {rows} rows × {cols} columns
          </p>
        </div>

        {/* Live Mini Preview */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
            Preview
          </label>
          <div
            className="rounded-lg overflow-hidden border border-neutral-800 bg-[#0d0e14]"
            style={{
              display: 'inline-grid',
              gridTemplateRows: `repeat(${rows}, ${cellH}px)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              width: '100%',
              borderColor: borderWidth > 0 ? borderColor : 'transparent',
              borderWidth: borderWidth > 0 ? 1 : 0,
              borderStyle: 'solid',
            }}
          >
            {previewCells.flat().map((cell, idx) => (
              <div
                key={idx}
                style={{
                  background: cell.isHeader ? headerBg : idx % 2 === 0 ? '#1a1b26' : '#16172088',
                  borderColor: borderWidth > 0 ? borderColor : 'transparent',
                  borderWidth: borderWidth > 0 ? 1 : 0,
                  borderStyle: 'solid',
                  minWidth: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {cell.isHeader && (
                  <div
                    className="w-3/4 h-1.5 rounded-full opacity-60"
                    style={{ background: headerColor }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Header Row Toggle */}
        <div className="flex flex-col gap-3">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
            <Palette size={13} />
            Style Options
          </label>

          {/* Header Row */}
          <div className="flex items-center justify-between bg-[#0d0e14] border border-neutral-700 rounded-lg px-3 py-2.5">
            <div>
              <p className="text-sm text-neutral-200 font-medium">Header Row</p>
              <p className="text-[11px] text-neutral-500">Bold first row with accent color</p>
            </div>
            <button
              onClick={() => setHasHeaderRow((v) => !v)}
              className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${
                hasHeaderRow ? 'bg-emerald-500' : 'bg-neutral-700'
              }`}
              style={{ height: 22 }}
              aria-checked={hasHeaderRow}
              role="switch"
            >
              <span
                className="absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform"
                style={{
                  width: 18,
                  height: 18,
                  transform: hasHeaderRow ? 'translateX(18px)' : 'translateX(0)',
                }}
              />
            </button>
          </div>

          {/* Header Colors */}
          {hasHeaderRow && (
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-neutral-500">Header BG</span>
                <label className="flex items-center gap-2 bg-[#0d0e14] border border-neutral-700 rounded-lg px-2.5 py-2 cursor-pointer hover:border-neutral-600 transition-colors">
                  <span
                    className="w-5 h-5 rounded border border-neutral-600 shrink-0"
                    style={{ background: headerBg }}
                  />
                  <input
                    type="color"
                    value={headerBg}
                    onChange={(e) => setHeaderBg(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-xs text-neutral-300 font-mono truncate">{headerBg.toUpperCase()}</span>
                </label>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-neutral-500">Header Text</span>
                <label className="flex items-center gap-2 bg-[#0d0e14] border border-neutral-700 rounded-lg px-2.5 py-2 cursor-pointer hover:border-neutral-600 transition-colors">
                  <span
                    className="w-5 h-5 rounded border border-neutral-600 shrink-0"
                    style={{ background: headerColor }}
                  />
                  <input
                    type="color"
                    value={headerColor}
                    onChange={(e) => setHeaderColor(e.target.value)}
                    className="sr-only"
                  />
                  <span className="text-xs text-neutral-300 font-mono truncate">{headerColor.toUpperCase()}</span>
                </label>
              </div>
            </div>
          )}

          {/* Border Color */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Border Color</span>
              <label className="flex items-center gap-2 bg-[#0d0e14] border border-neutral-700 rounded-lg px-2.5 py-2 cursor-pointer hover:border-neutral-600 transition-colors">
                <span
                  className="w-5 h-5 rounded border border-neutral-600 shrink-0"
                  style={{ background: borderColor }}
                />
                <input
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                  className="sr-only"
                />
                <span className="text-xs text-neutral-300 font-mono truncate">{borderColor.toUpperCase()}</span>
              </label>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs text-neutral-500">Border Width</span>
              <div className="flex gap-1.5">
                {[0, 1, 2, 4].map((w) => (
                  <button
                    key={w}
                    onClick={() => setBorderWidth(w)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                      borderWidth === w
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                        : 'border-neutral-700 bg-[#0d0e14] text-neutral-400 hover:border-neutral-500'
                    }`}
                  >
                    {w}px
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table Dimensions Info */}
        <div className="bg-[#0d0e14] border border-neutral-800 rounded-lg p-3 text-xs text-neutral-500 space-y-1">
          <p className="text-neutral-400 font-medium mb-1">Output Dimensions</p>
          <div className="flex justify-between">
            <span>Width</span>
            <span className="font-mono text-neutral-300">{Math.min(canvasWidth - 100, 700)}px</span>
          </div>
          <div className="flex justify-between">
            <span>Height</span>
            <span className="font-mono text-neutral-300">{rows * ROW_HEIGHT}px</span>
          </div>
          <div className="flex justify-between">
            <span>Total Cells</span>
            <span className="font-mono text-neutral-300">{rows * cols}</span>
          </div>
        </div>

        {/* Add to Canvas Button */}
        <button
          onClick={handleAdd}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-colors"
        >
          <Plus size={16} />
          Add Table to Canvas
        </button>
      </div>
    </div>
  );
}
