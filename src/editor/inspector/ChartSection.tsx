import React from 'react';
import { ChartElement, ChartType, ChartDataPoint } from '../../types/canvas';
import { Plus, Trash2 } from 'lucide-react';

interface ChartSectionProps {
  element: ChartElement;
  onUpdate: (updates: Partial<ChartElement>) => void;
}

const CHART_TYPES: { id: ChartType; label: string }[] = [
  { id: 'column', label: 'Column' },
  { id: 'bar', label: 'Bar' },
  { id: 'donut', label: 'Donut' },
  { id: 'pie', label: 'Pie' },
  { id: 'line', label: 'Line' },
  { id: 'area', label: 'Area' },
  { id: 'progress', label: 'Progress' },
];

export const ChartSection: React.FC<ChartSectionProps> = ({ element, onUpdate }) => {
  const { chartType = 'column', title = '', data = [], showLegend = true, showValues = true } = element;

  const handleUpdateDataPoint = (index: number, updates: Partial<ChartDataPoint>) => {
    const nextData = data.map((d, i) => (i === index ? { ...d, ...updates } : d));
    onUpdate({ data: nextData });
  };

  const handleAddDataPoint = () => {
    const nextData: ChartDataPoint[] = [
      ...data,
      { label: `Item ${data.length + 1}`, value: 50, color: '#8b5cf6' },
    ];
    onUpdate({ data: nextData });
  };

  const handleRemoveDataPoint = (index: number) => {
    if (data.length <= 1) return;
    const nextData = data.filter((_, i) => i !== index);
    onUpdate({ data: nextData });
  };

  return (
    <div className="space-y-4 pt-3 border-t border-neutral-800">
      <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Chart Properties
      </div>

      {/* Chart Type Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-300">Type</label>
        <div className="grid grid-cols-3 gap-1">
          {CHART_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => onUpdate({ chartType: t.id })}
              className={`py-1.5 px-2 rounded text-[11px] font-medium capitalize transition-colors ${
                chartType === t.id
                  ? 'bg-violet-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Title */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-medium text-neutral-300">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Chart Title..."
          className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-violet-500"
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-4">
        <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showLegend}
            onChange={(e) => onUpdate({ showLegend: e.target.checked })}
            className="accent-violet-500 w-3.5 h-3.5 rounded"
          />
          <span>Legend</span>
        </label>
        <label className="flex items-center gap-1.5 text-xs text-neutral-300 cursor-pointer">
          <input
            type="checkbox"
            checked={showValues}
            onChange={(e) => onUpdate({ showValues: e.target.checked })}
            className="accent-violet-500 w-3.5 h-3.5 rounded"
          />
          <span>Values</span>
        </label>
      </div>

      {/* Data Points List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-medium text-neutral-300">Dataset Values</label>
          <button
            onClick={handleAddDataPoint}
            className="text-[10px] text-violet-400 hover:text-violet-300 flex items-center gap-0.5"
          >
            <Plus size={12} />
            <span>Add Row</span>
          </button>
        </div>

        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {data.map((point, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-neutral-900/90 p-1.5 rounded border border-neutral-800">
              <input
                type="color"
                value={point.color || '#8b5cf6'}
                onChange={(e) => handleUpdateDataPoint(i, { color: e.target.value })}
                className="w-5 h-5 rounded cursor-pointer border-none bg-transparent"
              />
              <input
                type="text"
                value={point.label}
                onChange={(e) => handleUpdateDataPoint(i, { label: e.target.value })}
                className="w-20 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-[11px] text-white outline-none"
              />
              <input
                type="number"
                value={point.value}
                onChange={(e) => handleUpdateDataPoint(i, { value: Number(e.target.value) || 0 })}
                className="flex-1 min-w-0 bg-neutral-950 border border-neutral-800 rounded px-1.5 py-0.5 text-[11px] text-white outline-none"
              />
              <button
                onClick={() => handleRemoveDataPoint(i)}
                className="text-neutral-500 hover:text-red-400 p-0.5 transition-colors"
                title="Remove row"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
