import React from 'react';
import BrandIcon from './BrandIcon';
import PerceptualMap from './PerceptualMap';
import SourceList from './SourceList';
import type { MapData } from '../types';

const renderFormattedText = (value: string) => {
  const parts = value.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    const lines = part.split('\n');
    return (
      <React.Fragment key={`${part}-${index}`}>
        {lines.map((line, lineIndex) => (
          <React.Fragment key={`${line}-${lineIndex}`}>
            {line}
            {lineIndex < lines.length - 1 ? <br /> : null}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  });
};

interface DashboardDisplayProps {
  data: MapData;
  onRunNewAnalysis: () => void;
}

const DashboardDisplay: React.FC<DashboardDisplayProps> = ({
  data,
  onRunNewAnalysis
}) => {
  const targetBrand = data.brands.find((brand) => brand.isTarget);
  const competitors = data.brands.filter((brand) => !brand.isTarget);
  const positioningSummary = data.positioningSummary?.trim() || 'The map places the target brand on two customer perception dimensions to show how it is being seen in relation to competitors in the selected scope.';
  const competitiveInterpretation = data.competitiveInterpretation?.trim() || 'Read the relative distance between the target brand and nearby competitors as an indicator of whether the brand is clustered with rivals or positioned more distinctly.';

  const xAxisDisplayLabel = data.xAxisLabel;
  const yAxisDisplayLabel = data.yAxisLabel;
  const xAxisExplanation = data.axisDefinitions?.x.explanation || '';
  const yAxisExplanation = data.axisDefinitions?.y.explanation || '';
  const quantitative = data.marketOverview?.quantitativeSizing;
  const qualitative = data.marketOverview?.qualitativeTrends;
  const competitiveLandscape = data.marketOverview?.competitiveLandscape;
  const hasMarketOverview = Boolean(data.marketOverview);
  const marketOverviewReferences = [
    ...(quantitative?.sources || []).map((source) => ({
      title: source.title,
      url: source.url,
      label: source.categoryLabel || source.sourceType,
      note: source.evidenceUsed
    })),
    ...(qualitative?.sources || []).map((source) => ({
      title: source.title,
      url: source.url,
      label: source.categoryLabel || source.sourceType,
      note: source.evidenceUsed
    }))
  ].filter((source, index, all) => all.findIndex((item) => item.url === source.url) === index);


  return (
    <div className="animate-fade-in space-y-6 sm:space-y-8">
      <section className="section-card rounded-[8px] p-4 sm:p-5">
        <div className="brand-section-title">
          <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
            <BrandIcon name="icon-bpm" style={{ width: '28px', height: '28px' }} />
          </div>
          <h2 className="brand-heading" style={{ fontSize: 'clamp(2rem, 3vw, 2.5rem)' }}>
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
        <div className="section-card section-card-stripe-teal rounded-[8px] p-4 sm:p-6">
          <div className="brand-section-title">
            <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
              <BrandIcon name="icon-bpm" style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="brand-heading">Positioning Interpretation</h3>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">{renderFormattedText(positioningSummary)}</p>
        </div>
        <div className="section-card section-card-stripe-emerald rounded-[8px] p-4 sm:p-6">
          <div className="brand-section-title">
            <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
              <BrandIcon name="icon-bpm" style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="brand-heading">Competitive Strategy</h3>
          </div>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted sm:text-base">{renderFormattedText(competitiveInterpretation)}</p>
        </div>
      </section>

      {hasMarketOverview && (
        <section className="section-card rounded-[8px] p-4 sm:p-6">
          <div className="brand-section-title">
            <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
              <BrandIcon name="icon-bpm" style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="brand-heading">Market Overview</h3>
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Market Category</p>
              <p className="mt-2 text-base leading-7 text-muted">{data.marketOverview?.marketCategory}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[8px] border border-line bg-surface-strong p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Market Size</p>
                <p className="mt-3 text-sm leading-7 text-muted">{quantitative?.sourceUnavailable ? 'No market-size source was found for this query.' : quantitative?.summary}</p>
                {quantitative?.marketSize && <p className="mt-3 text-sm text-ink"><strong>Market size:</strong> {quantitative.marketSize}</p>}
                {quantitative?.cagr && <p className="mt-2 text-sm text-ink"><strong>CAGR:</strong> {quantitative.cagr}</p>}
                {quantitative?.forecastPeriod && <p className="mt-2 text-sm text-ink"><strong>Forecast period:</strong> {quantitative.forecastPeriod}</p>}
                {quantitative?.keySegments?.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Market Segments</p>
                    <ul className="mt-2 space-y-2">
                      {quantitative.keySegments.map((segment) => (
                        <li key={segment} className="text-sm text-muted">{segment}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {quantitative?.regionalNotes?.length ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Regional Notes</p>
                    <ul className="mt-2 space-y-2">
                      {quantitative.regionalNotes.map((note) => (
                        <li key={note} className="text-sm text-muted">{note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="rounded-[8px] border border-line bg-surface-strong p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Trends</p>
                <p className="mt-3 text-sm leading-7 text-muted">{qualitative?.sourceUnavailable ? 'No Deloitte, PwC, EY, or KPMG trend source was found for this query.' : qualitative?.summary}</p>
                {([...(qualitative?.macroTrends || []), ...(qualitative?.consumerBehaviorInsights || []), ...(qualitative?.strategicImplications || [])].length > 0) ? (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Highlights</p>
                    <ul className="mt-2 space-y-2">
                      {[...(qualitative?.macroTrends || []), ...(qualitative?.consumerBehaviorInsights || []), ...(qualitative?.strategicImplications || [])].slice(0, 6).map((item) => (
                        <li key={item} className="text-sm text-muted">{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-[8px] border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Competitive Landscape</p>
              <p className="mt-3 text-sm leading-7 text-muted">{competitiveLandscape?.summary}</p>
              <div className="mt-4 grid gap-4 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Competitor Groups</p>
                  <ul className="mt-2 space-y-2">
                    {(competitiveLandscape?.keyCompetitorGroups || []).map((item) => (
                      <li key={item} className="text-sm text-muted">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Positioning Pressure</p>
                  <ul className="mt-2 space-y-2">
                    {(competitiveLandscape?.positioningPressure || []).map((item) => (
                      <li key={item} className="text-sm text-muted">{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Whitespace Opportunities</p>
                  <ul className="mt-2 space-y-2">
                    {(competitiveLandscape?.whitespaceOpportunities || []).map((item) => (
                      <li key={item} className="text-sm text-muted">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {data.marketOverview?.limitations.filter((item) => !/unavailable from the required source set/i.test(item)).length ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent-strong">Limitations</p>
                <ul className="mt-2 space-y-2">
                  {data.marketOverview.limitations.filter((item) => !/unavailable from the required source set/i.test(item)).map((item) => (
                    <li key={item} className="text-sm text-muted">{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}

          </div>
        </section>
      )}

      <SourceList references={data.references} marketOverviewReferences={marketOverviewReferences} />

      <div className="text-center">
        <button
          type="button"
          className="brand-button brand-button-light"
          onClick={onRunNewAnalysis}
        >
          <BrandIcon name="icon-marketlearn" className="brand-inline-icon h-5 w-5" />
          Run New Analysis
        </button>
      </div>
    </div>
  );
};

export default DashboardDisplay;
