import React, { useState } from 'react';
import { PositionMapIcon, SearchIcon } from './icons';
import type { ScopeOption } from '../types';

interface BrandInputFormProps {
  onSubmit: (brandName: string, scope: ScopeOption, regionalQuery: string) => void;
  isLoading: boolean;
}

const BrandInputForm: React.FC<BrandInputFormProps> = ({ onSubmit, isLoading }) => {
  const [brandName, setBrandName] = useState('');
  const [scope, setScope] = useState<ScopeOption>('Global');
  const [regionalQuery, setRegionalQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAnalyzeClick = () => {
    if (isLoading) return;

    if (brandName.trim().length > 200) {
      setErrorMessage('Brand name must be 200 characters or fewer.');
      return;
    }

    setErrorMessage('');
    onSubmit(brandName, scope, regionalQuery);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 mx-auto max-w-4xl">
      <div className="space-y-5 rounded-[6px] border border-[#35527e] bg-[#0d1c34] p-4 text-[#f7f0e4] transition-all duration-300 focus-within:ring-2 focus-within:ring-[rgba(31,75,143,0.16)] sm:p-5">
        <div className="mb-1 flex items-center gap-3 text-[#f7f0e4]">
          <div className="tool-card-icon h-11 w-11 border-[#4f6f9f] bg-[#17345d] text-current">
            <PositionMapIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d9e4f4]">Brand Position Mapper Input</p>
            <p className="text-sm text-[#d9e4f4]">Enter a brand, choose a scope, and generate the analysis.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d9e4f4]">Brand Name</span>
            <input
              type="text"
              value={brandName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              onChange={(event) => {
                setBrandName(event.target.value.slice(0, 200));
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              maxLength={200}
              placeholder="Enter a brand name (e.g., Tesla, Nike, Samsung)"
              className="w-full rounded-[6px] border border-[#4f6f9f] bg-[#17345d] px-4 py-3 text-lg text-[#fffaf2] placeholder:text-[#d9e4f4] focus:outline-none focus:ring-2 focus:ring-[rgba(31,75,143,0.18)]"
              disabled={isLoading}
            />
          </label>

          <button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={isLoading}
            className="flex items-center justify-center rounded-full border border-[#f7f0e4] bg-[#f7f0e4] px-6 py-3 font-semibold uppercase tracking-[0.08em] text-[#0d1c34] transition-all duration-300 hover:-translate-y-px hover:bg-[#fffaf2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <SearchIcon className="mr-2 h-5 w-5" />
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-stretch">
          <label className="flex h-full flex-col gap-2 rounded-[6px] border border-[#35527e] bg-[#0d1c34] px-4 py-3 text-[#f7f0e4]">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d9e4f4]">Scope</span>
            <select
              value={scope}
              onChange={(event) => setScope(event.target.value as ScopeOption)}
              disabled={isLoading}
              className="rounded-[6px] border border-[#4f6f9f] bg-[#17345d] px-3 py-3 text-sm text-[#fffaf2] focus:outline-none"
            >
              <option value="Global">Global</option>
              <option value="Regional">Regional</option>
            </select>
            {!errorMessage && (
              <span className="mt-auto text-sm leading-6 text-[#d9e4f4]">
                {scope === 'Global' ? 'Use a broad market view across major competitors.' : 'Focus the map on a specific country or regional market.'}
              </span>
            )}
          </label>

          <label className="flex h-full flex-col gap-2 rounded-[6px] border border-[#35527e] bg-[#0d1c34] px-4 py-3 text-[#f7f0e4]">
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-[#d9e4f4]">Region or Country</span>
            <input
              type="text"
              value={regionalQuery}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
              onChange={(event) => setRegionalQuery(event.target.value)}
              placeholder={scope === 'Regional' ? 'e.g., USA, GCC, Western Europe' : 'Used only for regional scope'}
              className="w-full rounded-[6px] border border-[#4f6f9f] bg-[#17345d] px-4 py-3 text-base text-[#fffaf2] placeholder:text-[#d9e4f4] focus:outline-none focus:ring-2 focus:ring-[rgba(31,75,143,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isLoading || scope !== 'Regional'}
            />
            <p className="mt-auto text-sm leading-6 text-[#d9e4f4]">
              Choose <strong>Global</strong> for an overall market view, or switch to <strong>Regional</strong> to focus the perception map on a specific geography.
            </p>
          </label>
        </div>
        {errorMessage ? <p className="px-1 text-sm font-medium text-[#9d4c16]">{errorMessage}</p> : null}
      </div>
    </form>
  );
};

export default BrandInputForm;
