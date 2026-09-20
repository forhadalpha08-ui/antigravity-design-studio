import React, { useState } from 'react';
import { TableElement, TableCell } from '../../../types/canvas';

interface RenderTableProps {
  element: TableElement;
  onUpdateElement?: (id: string, updates: Partial<TableElement>) => void;
}

export const RenderTable: React.FC<RenderTableProps> = ({ element, onUpdateElement }) => {
  const {
    rows = 3,
    cols = 3,
    cells = [],
    hasHeaderRow = true,
    headerBg = '#1e1b4b',
    headerColor = '#c4b5fd',
    borderColor = '#374151',
    borderWidth = 1,
  } = element;

  const [editingCell, setEditingCell] = useState<{ r: number; c: number } | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleCellDoubleClick = (r: number, c: number, currentText: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCell({ r, c });
    setEditValue(currentText);
  };

  const saveCellEdit = () => {
    if (!editingCell || !onUpdateElement) {
      setEditingCell(null);
      return;
    }

    const { r, c } = editingCell;
    const newCells: TableCell[][] = cells.map((row) => [...row]);

    // Ensure row exists
    while (newCells.length <= r) {
      newCells.push([]);
    }
    // Ensure cell exists
    while (newCells[r].length <= c) {
      newCells[r].push({ text: '' });
    }

    newCells[r][c] = {
      ...newCells[r][c],
      text: editValue,
    };

    onUpdateElement(element.id, { cells: newCells });
    setEditingCell(null);
  };

  return (
    <div
      className="w-full h-full overflow-hidden select-none"
      style={{
        width: `${element.width}px`,
        height: `${element.height}px`,
      }}
    >
      <table
        className="w-full h-full border-collapse table-fixed text-xs"
        style={{
          border: `${borderWidth}px solid ${borderColor}`,
        }}
      >
        <tbody>
          {Array.from({ length: rows }).map((_, r) => {
            const isHeader = hasHeaderRow && r === 0;

            return (
              <tr key={r} className="border-b" style={{ borderColor }}>
                {Array.from({ length: cols }).map((_, c) => {
                  const cellData = cells[r]?.[c] || { text: '' };
                  const isEditing = editingCell?.r === r && editingCell?.c === c;

                  const cellBg = isHeader
                    ? headerBg
                    : cellData.bg || (r % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)');

                  const cellColor = isHeader
                    ? headerColor
                    : cellData.color || '#e5e7eb';

                  return (
                    <td
                      key={c}
                      className={`relative p-2 overflow-hidden text-ellipsis whitespace-nowrap transition-colors ${
                        isHeader ? 'font-bold' : ''
                      } ${cellData.bold ? 'font-bold' : ''}`}
                      style={{
                        backgroundColor: cellBg,
                        color: cellColor,
                        borderRight: c < cols - 1 ? `${borderWidth}px solid ${borderColor}` : undefined,
                        textAlign: cellData.align || (isHeader ? 'center' : 'left'),
                        cursor: 'cell',
                      }}
                      onDoubleClick={(e) => handleCellDoubleClick(r, c, cellData.text, e)}
                    >
                      {isEditing ? (
                        <input
                          autoFocus
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={saveCellEdit}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveCellEdit();
                            if (e.key === 'Escape') setEditingCell(null);
                          }}
                          className="absolute inset-0 w-full h-full px-2 bg-neutral-900 text-white font-medium border border-violet-500 outline-none"
                        />
                      ) : (
                        <span>{cellData.text || (isHeader ? `Header ${c + 1}` : `Data`)}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
