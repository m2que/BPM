import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="section-card my-8 rounded-[8px] p-8 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-line bg-surface-strong">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[rgba(31,75,143,0.16)] border-t-accent-strong border-r-accent"></div>
      </div>
      <p className="mt-6 text-lg font-semibold text-ink">Analyzing brand position...</p>
      <p className="mt-2 text-muted">Mapping customer perceptions and competitor territory across the selected axes...</p>
    </div>
  );
};

export default LoadingIndicator;
