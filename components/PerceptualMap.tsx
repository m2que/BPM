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

const CHART_COLORS = {
  grid: '#e2e8f0',
  axis: '#475569',
  cursor: '#4f46e5',
  reference: '#4f46e5',
  targetFill: '#f59e0b',
  targetInner: '#eef2ff',
  targetStroke: '#0f172a',
  competitorFills: ['#0d9488', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'],
  competitorStroke: '#ffffff'
} as const;

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

const renderTargetShape = (isCompact: boolean) => (props: any) => {
  const { cx, cy, fill, stroke } = props;

  return (
      <g>
        <circle cx={cx} cy={cy} r={isCompact ? 18 : 24} fill={fill} stroke={stroke} strokeWidth={2.5} />
        <circle cx={cx} cy={cy} r={isCompact ? 8 : 10} fill={CHART_COLORS.targetInner} opacity={0.92} />
      </g>
    );
};

const renderCompetitorShape = (isCompact: boolean) => (props: any) => {
  const { cx, cy, fill, stroke } = props;

  return <circle cx={cx} cy={cy} r={isCompact ? 14 : 18} fill={fill} stroke={stroke} strokeWidth={2} />;
};

const PerceptualMap: React.FC<PerceptualMapProps> = ({ data, xAxisLabel, yAxisLabel }) => {
  const isCompact = typeof window !== 'undefined' && window.innerWidth < 640;
  const chartXAxisLabel = `Perception Dimension: ${xAxisLabel}`;
  const chartYAxisLabel = `Perception Dimension: ${yAxisLabel}`;
  const targetBrands = data.filter((brand) => brand.isTarget);
  const competitorBrands = data.filter((brand) => !brand.isTarget);

  return (
    <div className="h-[22rem] rounded-[8px] border border-line bg-paper p-3 sm:h-96 sm:p-4 md:h-[520px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: isCompact ? 10 : 24, bottom: isCompact ? 72 : 56, left: isCompact ? 18 : 42 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
          <XAxis type="number" dataKey="x" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} stroke={CHART_COLORS.axis} tick={{ fontSize: isCompact ? 11 : 12, fill: CHART_COLORS.axis }}>
            <Label value={chartXAxisLabel} offset={isCompact ? -8 : -18} position="insideBottom" fill={CHART_COLORS.axis} style={{ fontSize: isCompact ? '11px' : '12px' }} />
          </XAxis>
          <YAxis type="number" dataKey="y" domain={[-10, 10]} ticks={[-10, -5, 0, 5, 10]} stroke={CHART_COLORS.axis} tick={{ fontSize: isCompact ? 11 : 12, fill: CHART_COLORS.axis }} width={isCompact ? 30 : 40}>
            <Label value={chartYAxisLabel} angle={-90} offset={isCompact ? -4 : -20} position="insideLeft" fill={CHART_COLORS.axis} style={{ textAnchor: 'middle', fontSize: isCompact ? '11px' : '12px' }} />
          </YAxis>
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: CHART_COLORS.cursor }} />
          <ReferenceLine x={0} stroke={CHART_COLORS.reference} strokeWidth={2.5} strokeDasharray="4 4" />
          <ReferenceLine y={0} stroke={CHART_COLORS.reference} strokeWidth={2.5} strokeDasharray="4 4" />
          <Scatter name="Target Brand" data={targetBrands} shape={renderTargetShape(isCompact)}>
            {targetBrands.map((brand, index) => (
              <Cell
                key={`${brand.name}-${index}`}
                fill={CHART_COLORS.targetFill}
                stroke={CHART_COLORS.targetStroke}
              />
            ))}
          </Scatter>
          <Scatter name="Competitors" data={competitorBrands} shape={renderCompetitorShape(isCompact)}>
            {competitorBrands.map((brand, index) => (
              <Cell
                key={`${brand.name}-${index}`}
                fill={CHART_COLORS.competitorFills[index % CHART_COLORS.competitorFills.length]}
                stroke={CHART_COLORS.competitorStroke}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerceptualMap;
