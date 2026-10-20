import React from 'react';
import { Database, Zap, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-[11px]">DummyJSON Mock API Live</span>
          </div>
          <span className="text-slate-400">|</span>
          <span>Local State Persistence Active</span>
        </div>

        <div className="flex items-center gap-1 text-slate-500">
          <span>Built with React 19, Tailwind CSS &amp; React Router</span>
        </div>
      </div>
    </footer>
  );
};
