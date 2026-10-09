'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Next.js App Router Error Boundary for /rankings
 */
export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('CarMatrix Rankings Route Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 font-poppins bg-[#DDE3EA]">
      <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-500 flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle size={28} />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Unable to Load Rankings
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We encountered a temporary issue querying the vehicle database. Street valuations and safety benchmarks remain safe in our fallback vault.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-[#29abe2] transition-colors cursor-pointer shadow-md"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>

          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
}
