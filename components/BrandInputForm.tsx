import React, { useRef, useState } from 'react';
import BrandIcon from './BrandIcon';
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
  const brandInputRef = useRef<HTMLTextAreaElement | null>(null);

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
    <form onSubmit={handleSubmit} className="brand-panel brand-panel-strong brand-input-shell brand-stack-16">
      <div className="brand-stack-16">
        <div className="brand-section-title">
          <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
            <BrandIcon name="icon-bpm" style={{ width: '32px', height: '32px', display: 'block' }} />
          </div>
          <div>
            <p className="brand-microcopy">BPM Input</p>
            <p className="brand-copy-sm">Select a brand and generate a perceptual map with competitive interpretation.</p>
            <p className="brand-copy-sm">The output includes competitor territory, positioning signals, grounded references, and an added market overview.</p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <label className="brand-field">
            <span className="brand-field-label">Brand Name</span>
            <textarea
              id="brand-name-input"
              ref={brandInputRef}
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
              className="brand-input brand-input-strong brand-input-textarea"
              disabled={isLoading}
            />
          </label>

          <button
            type="button"
            onClick={handleAnalyzeClick}
            disabled={isLoading}
            className="brand-button brand-button-light"
            style={{ alignSelf: 'end' }}
          >
            <BrandIcon name="icon-marketlearn" className="brand-inline-icon h-5 w-5" />
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-[220px_minmax(0,1fr)] md:items-stretch">
          <label className="brand-select-field">
            <span className="brand-field-label">Scope</span>
            <div className="brand-select-wrap">
              <select
                value={scope}
                onChange={(event) => setScope(event.target.value as ScopeOption)}
                disabled={isLoading}
                className="brand-select brand-input-strong"
              >
                <option value="Global">Global</option>
                <option value="Regional">Regional</option>
              </select>
            </div>
            {!errorMessage && (
              <span className="brand-help">
                {scope === 'Global' ? 'Use a broad market view across major competitors.' : 'Focus the map on a specific country or regional market.'}
              </span>
            )}
          </label>

          <label className="brand-field">
            <span className="brand-field-label">Region or Country</span>
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
              className="brand-input brand-input-strong"
              disabled={isLoading || scope !== 'Regional'}
            />
            <p className="brand-help">
              Choose <strong>Global</strong> for an overall market view, or switch to <strong>Regional</strong> to focus the perception map on a specific geography.
            </p>
          </label>
        </div>
        {errorMessage ? <p className="brand-error-text">{errorMessage}</p> : null}
      </div>
    </form>
  );
};

export default BrandInputForm;
