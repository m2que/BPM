import React from 'react';
import BrandIcon from './BrandIcon';
import type { Reference, ReferenceCategory } from '../types';

interface SourceListProps {
  references?: Reference[];
  marketOverviewReferences?: Array<{
    title: string;
    url: string;
    label: string;
    note: string;
  }>;
}

const SourceList: React.FC<SourceListProps> = ({ references, marketOverviewReferences = [] }) => {
  const groupedReferences = (references || []).reduce((acc, ref) => {
    if (!acc[ref.category]) acc[ref.category] = [];
    acc[ref.category].push(ref);
    return acc;
  }, {} as Record<ReferenceCategory, Reference[]>);

  const evidenceReferences = [
    ...(groupedReferences.academic_research || []),
    ...(groupedReferences.industry_databases || []),
    ...(groupedReferences.news_media || []),
    ...(groupedReferences.marketing_reports || []),
    ...(groupedReferences.government || []),
    ...(groupedReferences.official_brand || [])
  ];

  const hasReferences = references && references.length > 0;

  if (!hasReferences && marketOverviewReferences.length === 0) {
      return (
        <section className="section-card rounded-[8px] p-6">
          <div className="brand-section-title">
            <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
              <BrandIcon name="icon-bpm" style={{ width: '24px', height: '24px' }} />
            </div>
            <h3 className="brand-heading">Data Sources & References</h3>
          </div>
        <p className="text-sm leading-7 text-muted">
          No grounded sources were recovered into the final response for this run. This result should be treated as low-confidence until the source set is regenerated successfully.
        </p>
      </section>
    );
  }

  return (
    <section className="section-card rounded-[8px] p-6">
      <div className="brand-section-title">
        <div className="brand-icon-circle" aria-hidden="true" style={{ flexShrink: 0 }}>
          <BrandIcon name="icon-bpm" style={{ width: '24px', height: '24px' }} />
        </div>
        <h3 className="brand-heading">Data Sources & References</h3>
      </div>
      <div className="brand-stack-16">
        {evidenceReferences.length > 0 && (
          <div className="brand-stack-12">
            <span className="brand-ref-tag" style={{ color: 'var(--accent-strong)' }}>
              Positioning Analysis
            </span>
            <ul className="brand-ref-list">
              {evidenceReferences.map((ref, idx) => (
                <li key={`${ref.url}-${idx}`} className="brand-ref-item">
                  <div className="brand-ref-dot"></div>
                  <div className="brand-stack-8">
                    <a href={ref.url} target="_blank" rel="noopener noreferrer" className="brand-ref-link">
                      {ref.title || ref.url}
                    </a>
                    {ref.relevanceNote && <p className="brand-copy-sm">{ref.relevanceNote}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {marketOverviewReferences.length > 0 && (
          <div className="brand-stack-12">
            <span className="brand-ref-tag" style={{ color: '#87612a' }}>
              Market Overview
            </span>
            <ul className="brand-ref-list">
              {marketOverviewReferences.map((ref) => (
                <li key={ref.url} className="brand-ref-item">
                  <div className="brand-ref-dot"></div>
                  <div className="brand-stack-8">
                    <p className="brand-copy-sm"><strong>{ref.label}:</strong> <a href={ref.url} target="_blank" rel="noopener noreferrer" className="brand-ref-link">{ref.title}</a></p>
                    <p className="brand-copy-sm">{ref.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};

export default SourceList;
