import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="relative mx-auto my-4 max-w-3xl animate-fade-in rounded-[8px] border border-[#dfcfc1] bg-[#fbf6ee] px-4 py-3 text-[#7f3126]" role="alert">
      <div className="flex gap-3">
        <div className="py-1">
          <AlertTriangleIcon className="h-6 w-6 text-accent" />
        </div>
        <div>
          <p className="font-semibold uppercase tracking-[0.08em]">Unable to generate map</p>
          <p className="text-sm text-[#7f3126]">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
