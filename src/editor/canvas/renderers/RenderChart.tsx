import React from 'react';
import { ChartElement } from '../../../types/canvas';

interface RenderChartProps {
  element: ChartElement;
}

const DEFAULT_COLORS = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ec4899',
  '#06b6d4',
  '#a855f7',
  '#14b8a6',
];

export const RenderChart: React.FC<RenderChartProps> = ({ element }) => {
  const { chartType, data = [], title, showLegend = true, showValues = true, width, height } = element;

  const totalValue = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const maxValue = Math.max(...data.map((d) => Number(d.value) || 0), 1);

  const padding = {
    top: title ? 36 : 16,
    right: 20,
    bottom: showLegend ? 40 : 20,
    left: chartType === 'bar' ? 60 : 36,
  };

  const chartAreaW = Math.max(10, width - padding.left - padding.right);
  const chartAreaH = Math.max(10, height - padding.top - padding.bottom);

  return (
    <div
      className="w-full h-full flex flex-col pointer-events-none select-none rounded-lg p-3 bg-neutral-900/60 border border-neutral-800 backdrop-blur-sm overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Title */}
      {title && (
        <div className="text-xs font-semibold text-neutral-200 mb-1 truncate text-center">
          {title}
        </div>
      )}

      {/* SVG Chart Content */}
      <div className="flex-1 w-full relative">
        <svg viewBox={`0 0 ${width} ${height - (title ? 36 : 16) - (showLegend ? 32 : 10)}`} className="w-full h-full overflow-visible">
          {/* 1. COLUMN CHART */}
          {chartType === 'column' && (
            <g transform={`translate(${padding.left}, 10)`}>
              {/* Baseline */}
              <line x1={0} y1={chartAreaH} x2={chartAreaW} y2={chartAreaH} stroke="#374151" strokeWidth="1" />
              {data.map((d, i) => {
                const colW = (chartAreaW / data.length) * 0.65;
                const gap = (chartAreaW / data.length) * 0.35;
                const x = i * (colW + gap) + gap / 2;
                const h = (Number(d.value) / maxValue) * (chartAreaH - 20);
                const y = chartAreaH - h;
                const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={y}
                      width={colW}
                      height={Math.max(2, h)}
                      rx={3}
                      fill={color}
                    />
                    {showValues && (
                      <text
                        x={x + colW / 2}
                        y={y - 4}
                        textAnchor="middle"
                        fill="#9ca3af"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {d.value}
                      </text>
                    )}
                    <text
                      x={x + colW / 2}
                      y={chartAreaH + 12}
                      textAnchor="middle"
                      fill="#6b7280"
                      fontSize="8"
                    >
                      {d.label.slice(0, 6)}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* 2. BAR CHART (Horizontal) */}
          {chartType === 'bar' && (
            <g transform={`translate(${padding.left}, 10)`}>
              <line x1={0} y1={0} x2={0} y2={chartAreaH} stroke="#374151" strokeWidth="1" />
              {data.map((d, i) => {
                const rowH = (chartAreaH / data.length) * 0.65;
                const gap = (chartAreaH / data.length) * 0.35;
                const y = i * (rowH + gap) + gap / 2;
                const w = (Number(d.value) / maxValue) * (chartAreaW - 35);
                const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

                return (
                  <g key={i}>
                    <text
                      x={-6}
                      y={y + rowH / 2 + 3}
                      textAnchor="end"
                      fill="#9ca3af"
                      fontSize="9"
                    >
                      {d.label.slice(0, 8)}
                    </text>
                    <rect
                      x={0}
                      y={y}
                      width={Math.max(2, w)}
                      height={rowH}
                      rx={3}
                      fill={color}
                    />
                    {showValues && (
                      <text
                        x={w + 5}
                        y={y + rowH / 2 + 3}
                        fill="#d1d5db"
                        fontSize="9"
                        fontWeight="600"
                      >
                        {d.value}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* 3. PIE / DONUT CHART */}
          {(chartType === 'pie' || chartType === 'donut') && (
            <g transform={`translate(${width / 2}, ${(height - 60) / 2})`}>
              {(() => {
                const radius = Math.min(width, height - 70) / 2.3;
                const innerRadius = chartType === 'donut' ? radius * 0.55 : 0;
                let currentAngle = -Math.PI / 2;

                return data.map((d, i) => {
                  const sliceAngle = totalValue > 0 ? (Number(d.value) / totalValue) * 2 * Math.PI : 0;
                  const startAngle = currentAngle;
                  const endAngle = currentAngle + sliceAngle;
                  currentAngle += sliceAngle;

                  const x1 = Math.cos(startAngle) * radius;
                  const y1 = Math.sin(startAngle) * radius;
                  const x2 = Math.cos(endAngle) * radius;
                  const y2 = Math.sin(endAngle) * radius;

                  const ix1 = Math.cos(endAngle) * innerRadius;
                  const iy1 = Math.sin(endAngle) * innerRadius;
                  const ix2 = Math.cos(startAngle) * innerRadius;
                  const iy2 = Math.sin(startAngle) * innerRadius;

                  const largeArc = sliceAngle > Math.PI ? 1 : 0;
                  const color = d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];

                  let pathD = '';
                  if (innerRadius === 0) {
                    pathD = `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
                  } else {
                    pathD = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
                  }

                  return (
                    <path
                      key={i}
                      d={pathD}
                      fill={color}
                      stroke="#0f1117"
                      strokeWidth="1.5"
                    />
                  );
                });
              })()}
            </g>
          )}

          {/* 4. LINE & AREA CHART */}
          {(chartType === 'line' || chartType === 'area') && (
            <g transform={`translate(${padding.left}, 10)`}>
              {/* Grid Lines */}
              <line x1={0} y1={chartAreaH} x2={chartAreaW} y2={chartAreaH} stroke="#374151" strokeWidth="1" />
              <line x1={0} y1={chartAreaH / 2} x2={chartAreaW} y2={chartAreaH / 2} stroke="#1f2937" strokeDasharray="3 3" />

              {(() => {
                const points = data.map((d, i) => {
                  const x = (i / Math.max(1, data.length - 1)) * chartAreaW;
                  const y = chartAreaH - (Number(d.value) / maxValue) * (chartAreaH - 20) - 10;
                  return { x, y, val: d.value };
                });

                const linePath = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                const areaPath = `${linePath} L ${chartAreaW} ${chartAreaH} L 0 ${chartAreaH} Z`;

                return (
                  <>
                    {chartType === 'area' && (
                      <path
                        d={areaPath}
                        fill="url(#chartAreaGradient)"
                        opacity="0.35"
                      />
                    )}
                    <path
                      d={linePath}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {points.map((p, i) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill="#8b5cf6" stroke="#0f1117" strokeWidth="2" />
                        {showValues && (
                          <text
                            x={p.x}
                            y={p.y - 8}
                            textAnchor="middle"
                            fill="#d1d5db"
                            fontSize="8"
                            fontWeight="600"
                          >
                            {p.val}
                          </text>
                        )}
                      </g>
                    ))}
                    <defs>
                      <linearGradient id="chartAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                  </>
                );
              })()}
            </g>
          )}

          {/* 5. PROGRESS GAUGE */}
          {chartType === 'progress' && (
            <g transform={`translate(${width / 2}, ${(height - 60) / 2})`}>
              {(() => {
                const percentage = Math.min(100, Math.max(0, data[0]?.value || 75));
                const radius = Math.min(width, height - 70) / 2.6;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset = circumference - (percentage / 100) * circumference;

                return (
                  <>
                    <circle
                      r={radius}
                      fill="none"
                      stroke="#1f2937"
                      strokeWidth="12"
                    />
                    <circle
                      r={radius}
                      fill="none"
                      stroke="#8b5cf6"
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform="rotate(-90)"
                    />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fill="#ffffff"
                      fontSize="18"
                      fontWeight="bold"
                    >
                      {percentage}%
                    </text>
                  </>
                );
              })()}
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && chartType !== 'progress' && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1.5 border-t border-neutral-800/80">
          {data.map((d, i) => (
            <div key={i} className="flex items-center gap-1 text-[9px] text-neutral-400">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length] }}
              />
              <span className="truncate max-w-[50px]">{d.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
