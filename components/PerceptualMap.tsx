import React from 'react';
import {
  CartesianGrid,
  Cell,
  Label,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import type { Brand } from '../types';

interface PerceptualMapProps {
  data: Brand[];
  xAxisLabel: string;
  yAxisLabel: string;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: Brand }> }) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const brand = payload[0].payload;

  return (
    <div className="rounded-[8px] border border-line bg-paper p-3 text-sm">
      <p className="font-semibold text-ink">{brand.name}</p>
      <p className="text-muted">X: {brand.x}</p>
      <p className="text-muted">Y: {brand.y}</p>
    </div>
  );
};

const PerceptualMap: React.FC<PerceptualMapProps> = ({ data, xAxisLabel, yAxisLabel }) => {
  const isCompact = typeof window !== 'undefined' && window.innerWidth < 640;
  const chartXAxisLabel = `Perception Dimension: ${xAxisLabel}`;
  const chartYAxisLabel = `Perception Dimension: ${yAxisLabel}`;

  return (
    <div className="h-[22rem] rounded-[8px] border border-line bg-paper p-3 sm:h-96 sm:p-4 md:h-[520px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: isCompact ? 10 : 24, bottom: isCompact ? 72 : 56, left: isCompact ? 18 : 42 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#d6d2cb" />
          <XAxis type="number" dataKey="x" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} stroke="#5f6b7a" tick={{ fontSize: isCompact ? 11 : 12, fill: '#5f6b7a' }}>
            <Label value={chartXAxisLabel} offset={isCompact ? -8 : -18} position="insideBottom" fill="#5f6b7a" style={{ fontSize: isCompact ? '11px' : '12px' }} />
          </XAxis>
          <YAxis type="number" dataKey="y" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} stroke="#5f6b7a" tick={{ fontSize: isCompact ? 11 : 12, fill: '#5f6b7a' }} width={isCompact ? 30 : 40}>
            <Label value={chartYAxisLabel} angle={-90} offset={isCompact ? -4 : -20} position="insideLeft" fill="#5f6b7a" style={{ textAnchor: 'middle', fontSize: isCompact ? '11px' : '12px' }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#c39a5b' }} />
          <ReferenceLine x={0} stroke="#c39a5b" strokeDasharray="4 4" />
          <ReferenceLine y={0} stroke="#c39a5b" strokeDasharray="4 4" />
          <Scatter data={data}>
            {data.map((brand, index) => (
              <Cell
                key={`${brand.name}-${index}`}
                fill={brand.isTarget ? '#c39a5b' : '#1f4b8f'}
                stroke={brand.isTarget ? '#1d2430' : '#fbf6ee'}
                strokeWidth={brand.isTarget ? 2.5 : 1.25}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerceptualMap;
