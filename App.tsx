import React, { useCallback, useEffect, useState } from 'react';
import BrandInputForm from './components/BrandInputForm';
import BrandIcon from './components/BrandIcon';
import DashboardDisplay from './components/DashboardDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import LoadingIndicator from './components/LoadingIndicator';
import { fetchBrandMapData, fetchMarketOverview } from './services/geminiService';
import type { MapData, ScopeOption } from './types';
import { track } from './lib/analytics';

const App: React.FC = () => {
  const [mapData, setMapData] = useState<MapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      return;
    }

    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isLoading]);

  const handleRunNewAnalysis = useCallback(() => {
    setMapData(null);
    setError(null);
    setIsLoading(false);

    window.requestAnimationFrame(() => {
      const inputCard = document.getElementById('analyze');
      inputCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      window.setTimeout(() => {
        const brandInput = document.getElementById('brand-name-input') as HTMLTextAreaElement | null;
        brandInput?.focus();
      }, 250);
    });
  }, []);

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
    track('analyze_click', { app_name: 'bpm' });

    try {
      const analysisScope = scope === 'Regional' ? regionalQuery.trim() : 'Global';
      const normalizedBrandName = brandName.trim();
      const [data, marketOverview] = await Promise.all([
        fetchBrandMapData(normalizedBrandName, analysisScope),
        fetchMarketOverview(normalizedBrandName).catch(() => null)
      ]);
      setMapData({
        ...data,
        marketOverview: marketOverview || data.marketOverview
      });
      track('analyze_success', { app_name: 'bpm' });
    } catch (requestError) {
      console.error(requestError);
      setError(requestError instanceof Error ? requestError.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="brand-app">
      <div dangerouslySetInnerHTML={{ __html: `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true"><symbol id="icon-marketlearn" viewBox="0 0 24 24"><path d="M12 20V10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M18 20V4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 20v-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol id="icon-cbbe" viewBox="0 0 24 24"><path d="M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 2v20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol id="icon-bpm" viewBox="0 0 24 24"><path d="M12 23V1" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path><path d="M1 12h22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></symbol><symbol id="icon-bea" viewBox="0 0 24 24"><path d="M12 0.6c1.18 2.92 2.92 5.05 4.7 7.22 1.82 2.22 3.68 4.5 3.68 7.34A8 8 0 0 1 12 23a8 8 0 0 1-8-7.84c0-2.84 1.86-5.12 3.68-7.34C9.08 5.65 10.82 3.52 12 0.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path></symbol></svg>` }} />
      <div className="brand-page">
        <header className="topbar mb-6">
          <div className="shell topbar-inner">
            <a className="brand" href="https://marketlearn.online">
              <span className="brand-icon" aria-hidden="true">
                <BrandIcon name="icon-marketlearn" />
              </span>
              <span className="brand-copy">
                <span className="brand-mark">MarketLearn</span>
              </span>
            </a>
          </div>
        </header>

        <section className="brand-hero">
          <div className="brand-hero-copy">
            <h1 className="brand-title">Brand Position Mapper</h1>
            <p className="brand-copy">
                Map how a brand is perceived against competitors to examine its positioning strategy. Use linked industry reports, business news, and academic articles as evidence in reports and business plans.
            </p>
          </div>
          <div className="brand-panel-stack">
            <div className="brand-panel brand-panel-tight">
              <div className="brand-icon-circle" aria-hidden="true">
                <BrandIcon name="icon-bpm" style={{ width: '32px', height: '32px', display: 'block' }} />
              </div>
              <p className="brand-microcopy" style={{ color: 'var(--muted)' }}>How to use it</p>
              <h2 className="brand-heading">Enter a brand to map its position in global or regional markets.</h2>
              <p className="brand-copy-sm">
                <strong>Positioning read:</strong> use points of parity and points of difference to interpret why the brand overlaps with or separates from rivals.
              </p>
              <p className="brand-copy-sm">
                <strong>Market context:</strong> adds insight from market size, industry trends, and competitive whitespace.
              </p>
            </div>
          </div>
        </section>

        <main className="brand-shell-stack" id="analyze">
          <BrandInputForm onSubmit={handleSubmit} isLoading={isLoading} />

          {isLoading && <LoadingIndicator elapsedSeconds={elapsedSeconds} />}
          {error && <ErrorDisplay message={error} />}

          {mapData ? (
            <DashboardDisplay
              data={mapData}
              onRunNewAnalysis={handleRunNewAnalysis}
            />
          ) : (
            !isLoading && !error && (
              <div className="brand-card brand-state">
                <div className="brand-icon-circle" aria-hidden="true" style={{ margin: '0 auto 16px' }}>
                  <BrandIcon name="icon-marketlearn" className="brand-inline-icon h-7 w-7" />
                </div>
                <h2 className="brand-heading brand-heading-lg">Ready to Map</h2>
                <p className="brand-copy" style={{ marginTop: '12px' }}>
                  Enter a brand above to generate a competitor-based customer perception map with global or regional scope, grounded references, and market context.
                </p>
              </div>
            )
          )}
        </main>

        <footer className="brand-footer">
          <a
            className="brand-footer-button"
            href="https://forms.cloud.microsoft/r/BdSpx03G9i"
            target="_blank"
            rel="noreferrer"
          >
            Share feedback
          </a>
          <p className="brand-footer-copy">
            © 2026 <a href="https://marketlearn.online" className="brand-inline-link">MarketLearn</a>. AI-assisted content — verify before implementation.
          </p>
          <p className="brand-footer-copy">
            <a href="mailto:marketlearn.online@gmail.com" className="brand-inline-link">Email us</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
