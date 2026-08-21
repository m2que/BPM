import React from 'react';
import PerceptualMap from './PerceptualMap';
import SourceList from './SourceList';
import { ChartBarIcon } from './icons';
import type { MapData } from '../types';

interface DashboardDisplayProps {
  data: MapData;
}

const DashboardDisplay: React.FC<DashboardDisplayProps> = ({ data }) => {
  const targetBrand = data.brands.find((brand) => brand.isTarget);
  const competitors = data.brands.filter((brand) => !brand.isTarget);
  const positioningSummary = data.positioningSummary?.trim() || 'The map places the target brand on two customer perception dimensions to show how it is being seen in relation to competitors in the selected scope.';
  const competitiveInterpretation = data.competitiveInterpretation?.trim() || 'Read the relative distance between the target brand and nearby competitors as an indicator of whether the brand is clustered with rivals or positioned more distinctly.';

  const xAxisDisplayLabel = data.xAxisLabel;
  const yAxisDisplayLabel = data.yAxisLabel;
  const xAxisExplanation = data.axisDefinitions?.x.explanation || '';
  const yAxisExplanation = data.axisDefinitions?.y.explanation || '';


  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      <section className="section-card rounded-[8px] p-4 sm:p-5">
        <div className="mb-3 flex items-center gap-3">
          <div className="tool-card-icon h-11 w-11 w-[44px] border-line bg-surface-strong text-accent-strong">
            <ChartBarIcon className="h-5 w-5" />
          </div>
          <h2 className="font-display text-3xl font-semibold text-ink">
            Perception Map for <span className="text-accent-strong">{targetBrand?.name}</span>
          </h2>
        </div>
        <p className="section-copy mb-5 text-base text-muted">
          The map positions the target brand against its main competitors using the most decision-relevant perceptual dimensions identified for the selected scope.
        </p>

        <PerceptualMap data={data.brands} xAxisLabel={data.xAxisLabel} yAxisLabel={data.yAxisLabel} />
      </section>

      <section className="section-card rounded-[8px] p-4 sm:p-6">
        <div className="space-y-5">
          <div className="rounded-[8px] border border-line bg-surface-strong p-4">
            <h3 className="mb-3 font-display text-xl font-semibold text-ink">How To Read This Map</h3>
            <p className="text-sm leading-7 text-muted sm:text-base">
              Read the target brand's location against both axes first, then compare its distance from nearby competitors. The interpretation cards explain what that position says about perceived market territory, while the supporting sources show the evidence used to justify that reading.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.45fr)] lg:items-start">
            <div className="space-y-4">
              <div className="w-full rounded-[8px] border border-line bg-paper p-5">
                <h3 className="font-display text-xl font-semibold text-ink">Map Dimensions</h3>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="min-w-0 rounded-[8px] border border-line bg-surface-strong p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">X Axis</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{xAxisDisplayLabel}</p>
                  {xAxisExplanation && <p className="mt-3 text-sm leading-6 text-muted">{xAxisExplanation}</p>}
                </div>
                <div className="min-w-0 rounded-[8px] border border-line bg-surface-strong p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Y Axis</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{yAxisDisplayLabel}</p>
                  {yAxisExplanation && <p className="mt-3 text-sm leading-6 text-muted">{yAxisExplanation}</p>}
                </div>
                </div>
              </div>

              {(data.pointsOfParity || data.pointsOfDifference) && (
                <div className="w-full rounded-[8px] border border-line bg-surface-strong p-5">
                  <h3 className="mb-3 font-display text-xl font-semibold text-ink">POPs & PODs</h3>
                  {data.pointsOfParity && <p className="text-sm leading-7 text-muted sm:text-base"><strong>Points of parity:</strong> {data.pointsOfParity}</p>}
                  {data.pointsOfDifference && <p className="mt-4 text-sm leading-7 text-muted sm:text-base"><strong>Points of difference:</strong> {data.pointsOfDifference}</p>}
                </div>
              )}
            </div>

            <div className="rounded-[8px] border border-line bg-paper p-5">
              <h3 className="mb-3 font-display text-xl font-semibold text-ink">Scope & Competitors</h3>
              <div className="inline-flex min-w-[140px] rounded-[8px] border border-line bg-surface-strong px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Analysis Scope</p>
                  <p className="mt-1 text-base font-semibold text-ink">{data.scope}</p>
                </div>
              </div>

              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Compared Brands</p>
              <ul className="mt-3 space-y-2">
                {targetBrand && (
                  <li className="rounded-[8px] border border-line bg-surface-strong px-4 py-2.5 text-sm font-semibold text-ink">
                    {targetBrand.name} (target brand)
                  </li>
                )}
                {competitors.map((brand) => (
                  <li key={brand.name} className="rounded-[8px] border border-line bg-surface px-4 py-2.5 text-sm text-muted">
                    {brand.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="section-card rounded-[8px] p-4 sm:p-6">
          <h3 className="font-display text-2xl font-semibold text-ink">Positioning Interpretation</h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">{positioningSummary}</p>
        </div>
        <div className="section-card rounded-[8px] p-4 sm:p-6">
          <h3 className="font-display text-2xl font-semibold text-ink">Competitive Strategy</h3>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">{competitiveInterpretation}</p>
        </div>
      </section>

      <SourceList references={data.references} />
    </div>
  );
};

export default DashboardDisplay;
