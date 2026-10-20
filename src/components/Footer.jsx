import React from 'react';
import { Database, Zap, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">

        </div>

        <div className="flex items-center justify-center gap-1 text-slate-500 text-center">
          <span>Built with React 19, Tailwind CSS &amp; React Router</span>
        </div>
      </div>
    </footer>
  );
};
