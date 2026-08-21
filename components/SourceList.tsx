import React from 'react';
import { LinkIcon } from './icons';
import type { Reference, ReferenceCategory } from '../types';

interface SourceListProps {
  references?: Reference[];
}

const CATEGORY_LABELS: Record<ReferenceCategory, string> = {
  official_brand: 'Official Brand Sources',
  government: 'Government & Official Data',
  industry_databases: 'Industry Databases',
  news_media: 'Major News Media',
  academic_research: 'Academic Research',
  marketing_reports: 'Marketing & Trade Reports'
};

const CATEGORY_STYLES: Record<ReferenceCategory, string> = {
  official_brand: 'bg-surface-strong text-accent-strong border-line',
  government: 'bg-surface text-[#36527b] border-line',
  industry_databases: 'bg-surface-strong text-[#87612a] border-line',
  news_media: 'bg-surface text-[#7a4851] border-line',
  academic_research: 'bg-surface-strong text-[#4f5870] border-line',
  marketing_reports: 'bg-surface text-muted border-line'
};

const SourceList: React.FC<SourceListProps> = ({ references }) => {
  if (!references || !Array.isArray(references) || references.length === 0) {
      return (
        <section className="section-card rounded-[8px] p-6">
          <div className="mb-4 flex items-center gap-3">
          <div className="tool-card-icon h-11 w-11 border-line bg-surface-strong text-accent-strong">
            <LinkIcon className="h-5 w-5" />
          </div>
            <h3 className="font-display text-2xl font-semibold text-ink">Supporting Sources</h3>
          </div>
        <p className="text-sm leading-7 text-muted">
          No grounded sources were recovered into the final response for this run. This result should be treated as low-confidence until the source set is regenerated successfully.
        </p>
      </section>
    );
  }

  return (
    <section className="section-card rounded-[8px] p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="tool-card-icon h-11 w-11 border-line bg-surface-strong text-accent-strong">
          <LinkIcon className="h-5 w-5" />
        </div>
        <h3 className="font-display text-2xl font-semibold text-ink">Supporting Sources</h3>
      </div>
      <p className="mb-5 text-sm leading-7 text-muted">
        These are the sources used to support the positioning analysis. Each note explains how the source helps justify the brand's placement on the map.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {references.map((source, index) => {
          const category = source.category as ReferenceCategory;

          return (
            <article key={`${source.url}-${index}`} className="rounded-[8px] border border-line bg-paper p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words text-sm font-semibold text-ink transition-colors hover:text-accent-strong hover:underline"
                  >
                    {source.title || source.url}
                  </a>
                </div>
                <span className={`w-fit rounded border px-2 py-1 text-[11px] font-bold uppercase tracking-wider ${CATEGORY_STYLES[category]}`}>
                  {CATEGORY_LABELS[category]}
                </span>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted">{source.relevanceNote}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default SourceList;
