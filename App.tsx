import React, { useCallback, useState } from 'react';
import BrandInputForm from './components/BrandInputForm';
import DashboardDisplay from './components/DashboardDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import { ChartBarIcon, MarketLearnIcon, PositionMapIcon } from './components/icons';
import { fetchBrandMapData } from './services/geminiService';
import type { MapData, ScopeOption } from './types';

const App: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (brandName: string, scope: ScopeOption, regionalQuery: string) => {
    if (!brandName.trim()) {
      setError('Please enter a brand name.');
      return;
    }

    if (scope === 'Regional' && !regionalQuery.trim()) {
      setError('Please enter a specific country or region for regional analysis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setMapData(null);

    try {
      const analysisScope = scope === 'Regional' ? regionalQuery.trim() : 'Global';
      const data = await fetchBrandMapData(brandName.trim(), analysisScope);
      setMapData(data);
    } catch (requestError) {
      console.error(requestError);
      setError(requestError instanceof Error ? requestError.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg text-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
        <header className="topbar mb-6">
          <div className="shell topbar-inner px-0">
            <a className="brand" href="https://marketlearn.online">
              <span className="brand-icon" aria-hidden="true">
                <MarketLearnIcon className="h-6 w-6" />
              </span>
              <span className="brand-copy">
                <span className="brand-mark">MarketLearn</span>
              </span>
            </a>
          </div>
        </header>

        <header className="hero mb-10 rounded-[8px] p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow mb-4 inline-flex items-center gap-2 px-4 py-2 text-[0.72rem] font-semibold tracking-[0.18em] text-accent-strong">
                <ChartBarIcon className="h-4 w-4" />
                MarketLearn Tool
              </div>
              <h1 className="font-display text-5xl font-semibold tracking-[0.01em] text-ink sm:text-6xl md:text-[4.2rem]">
                <span className="inline-flex items-center gap-3 sm:gap-4">
                  <span className="tool-card-icon h-[52px] w-[52px] bg-surface-strong text-accent-strong sm:h-[60px] sm:w-[60px]">
                    <PositionMapIcon className="h-7 w-7 sm:h-8 sm:w-8" />
                  </span>
                  <span>Brand Position Mapper</span>
                </span>
              </h1>
              <p className="lead mt-5 max-w-3xl text-base text-muted sm:text-lg">
                Map how a brand is perceived against competitors, then support that positioning read with grounded sources. The linked industry reports, business news, and academic articles may be used to support reports and business plans.
              </p>
            </div>
            <div className="section-card w-full max-w-sm rounded-[8px] p-5">
              <div className="tool-card-icon mb-4 text-accent-strong">
                <PositionMapIcon className="h-6 w-6" />
              </div>
              <p className="eyebrow inline-flex px-3 py-1 text-[0.7rem] font-semibold tracking-[0.16em] text-accent-strong">How to use it</p>
              <p className="mt-4 font-display text-[1.8rem] font-semibold text-ink">Global or regional brand mapping</p>
              <p className="section-copy mt-3 text-sm text-muted">
                Start with one brand, compare its perceived position against competitors, then use the results to inform strategy.
              </p>
            </div>
          </div>
        </header>

        <main>
          <BrandInputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && <LoadingIndicator />}
          {error && <ErrorDisplay message={error} />}

          {mapData ? (
            <DashboardDisplay data={mapData} />
          ) : (
            !isLoading && !error && (
              <div className="section-card mt-12 rounded-[8px] p-8 text-center">
                <div className="tool-card-icon mx-auto mb-4 h-[54px] w-[54px] text-accent-strong">
                  <ChartBarIcon className="h-7 w-7" />
                </div>
                <h2 className="font-display text-3xl font-semibold text-ink">Ready to Map</h2>
                <p className="section-copy mt-3 text-muted">
                  Enter a brand above to generate a competitor-based customer perception map with global or regional scope and supporting references.
                </p>
              </div>
            )
          )}
        </main>

        <footer className="mt-auto pt-8 text-center text-sm text-muted">
          <p>
            © 2026{' '}
            <a href="https://marketlearn.online" className="text-accent-strong underline decoration-accent underline-offset-4 hover:text-accent">
              MarketLearn
            </a>
            . AI-assisted content — verify before implementation.
          </p>
          <p className="mt-2">
            Contact:{' '}
            <a href="mailto:marketlearn.online@gmail.com" className="text-accent-strong underline decoration-accent underline-offset-4 hover:text-accent">
              marketlearn.online@gmail.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
