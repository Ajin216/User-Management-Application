import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ text = 'Loading data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide">{text}</p>
      <p className="text-xs text-slate-400 mt-1">Connecting to DummyJSON endpoint</p>
    </div>
  );
};

export const TableSkeleton = ({ rows = 6 }) => {
  return (
    <div className="w-full overflow-x-auto">
      <div className="w-full min-w-[600px] md:min-w-full bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden divide-y divide-slate-100 animate-pulse">
      <div className="bg-slate-50 px-6 py-4 flex gap-4">
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/6"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/12 ml-auto"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-200 rounded w-1/3"></div>
            <div className="h-3 bg-slate-100 rounded w-1/5"></div>
          </div>
          <div className="h-4 bg-slate-200 rounded w-16"></div>
          <div className="h-6 bg-slate-200 rounded-full w-20"></div>
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="flex gap-2 ml-auto">
            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
            <div className="w-8 h-8 rounded-lg bg-slate-200"></div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};
