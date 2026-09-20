import React from 'react';
import { ChartElement, ChartType } from '../../types/canvas';
import { BarChart3, PieChart, LineChart, Activity, Gauge } from 'lucide-react';
import { generateId } from '../../utils/id';

interface ChartsDrawerProps {
  canvasWidth: number;
  canvasHeight: number;
  elementsCount: number;
  onAddElement: (element: ChartElement) => void;
}

interface ChartTemplate {
  type: ChartType;
  title: string;
  name: string;
  icon: React.ElementType;
  description: string;
  data: { label: string; value: number; color?: string }[];
}

const CHART_PRESETS: ChartTemplate[] = [
  {
    type: 'column',
    title: 'Monthly Revenue Growth',
    name: 'Column Chart',
    icon: BarChart3,
    description: 'Vertical comparison across distinct periods',
    data: [
      { label: 'Jan', value: 34, color: '#8b5cf6' },
      { label: 'Feb', value: 45, color: '#8b5cf6' },
      { label: 'Mar', value: 68, color: '#8b5cf6' },
      { label: 'Apr', value: 85, color: '#3b82f6' },
      { label: 'May', value: 110, color: '#3b82f6' },
    ],
  },
  {
    type: 'bar',
    title: 'Acquisition Channels',
    name: 'Horizontal Bar Chart',
    icon: BarChart3,
    description: 'Horizontal ranking & volume breakdown',
    data: [
      { label: 'Organic', value: 85, color: '#10b981' },
      { label: 'Social', value: 62, color: '#8b5cf6' },
      { label: 'Direct', value: 45, color: '#3b82f6' },
      { label: 'Referral', value: 28, color: '#f59e0b' },
    ],
  },
  {
    type: 'donut',
    title: 'Market Share Allocation',
    name: 'Donut Chart',
    icon: PieChart,
    description: 'Proportional distribution with center stat space',
    data: [
      { label: 'Product A', value: 42, color: '#8b5cf6' },
      { label: 'Product B', value: 28, color: '#3b82f6' },
      { label: 'Product C', value: 18, color: '#10b981' },
      { label: 'Others', value: 12, color: '#f59e0b' },
    ],
  },
  {
    type: 'pie',
    title: 'Budget Division',
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Classic slice breakdown of budget segments',
    data: [
      { label: 'Dev', value: 45, color: '#8b5cf6' },
      { label: 'Design', value: 25, color: '#ec4899' },
      { label: 'Marketing', value: 20, color: '#3b82f6' },
      { label: 'Ops', value: 10, color: '#10b981' },
    ],
  },
  {
    type: 'line',
    title: 'User Retention Curve',
    name: 'Line Chart',
    icon: LineChart,
    description: 'Continuous trend line with plotted nodes',
    data: [
      { label: 'W1', value: 100, color: '#8b5cf6' },
      { label: 'W2', value: 78, color: '#8b5cf6' },
      { label: 'W3', value: 64, color: '#8b5cf6' },
      { label: 'W4', value: 58, color: '#8b5cf6' },
      { label: 'W5', value: 55, color: '#8b5cf6' },
    ],
  },
  {
    type: 'area',
    title: 'Platform Engagement',
    name: 'Area Trend Chart',
    icon: Activity,
    description: 'Filled volumetric curve indicating volume',
    data: [
      { label: 'Q1', value: 20, color: '#8b5cf6' },
      { label: 'Q2', value: 45, color: '#8b5cf6' },
      { label: 'Q3', value: 60, color: '#8b5cf6' },
      { label: 'Q4', value: 92, color: '#8b5cf6' },
    ],
  },
  {
    type: 'progress',
    title: 'Quarterly Target Completed',
    name: 'Progress Gauge',
    icon: Gauge,
    description: 'Radial meter showing key metric percentage',
    data: [{ label: 'Completed', value: 84, color: '#8b5cf6' }],
  },
];

export const ChartsDrawer: React.FC<ChartsDrawerProps> = ({
  canvasWidth,
  canvasHeight,
  elementsCount,
  onAddElement,
}) => {
  const handleAddChart = (preset: ChartTemplate) => {
    const width = 360;
    const height = 240;
    const newChart: ChartElement = {
      id: generateId('chart'),
      name: preset.name,
      type: 'chart',
      x: Math.round(canvasWidth / 2 - width / 2),
      y: Math.round(canvasHeight / 2 - height / 2),
      width,
      height,
      chartType: preset.type,
      title: preset.title,
      data: preset.data,
      showLegend: true,
      showValues: true,
      opacity: 1,
      zIndex: elementsCount + 1,
      rotation: 0,
      locked: false,
      hidden: false,
    };
    onAddElement(newChart);
  };

  return (
    <div className="w-80 h-full bg-[#0f1118] border-r border-neutral-800 flex flex-col z-20 select-none">
      <div className="p-4 border-b border-neutral-800">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 size={18} className="text-violet-400" />
          <span>Interactive Charts</span>
        </h3>
        <p className="text-[11px] text-neutral-400 mt-0.5">
          Vector data visualizations with editable values and colors
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {CHART_PRESETS.map((preset) => {
          const Icon = preset.icon;

          return (
            <div
              key={preset.type}
              onClick={() => handleAddChart(preset)}
              className="p-3.5 bg-neutral-900/90 border border-neutral-800 hover:border-violet-500 rounded-xl cursor-pointer transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-950/60 border border-violet-800/60 flex items-center justify-center text-violet-400 group-hover:text-violet-300 group-hover:bg-violet-900/80 transition-colors shrink-0">
                  <Icon size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-white group-hover:text-violet-300 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                    {preset.title}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-neutral-500 mt-2 leading-tight">
                {preset.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
