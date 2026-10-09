import React from 'react';

/**
 * Next.js App Router Loading Skeleton for /rankings
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-[#DDE3EA] py-8 sm:py-12 font-poppins">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        {/* Hero Header Skeleton */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-8 sm:p-10 h-72 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="h-5 bg-slate-800 rounded-full w-48" />
            <div className="h-10 bg-slate-800 rounded-2xl w-3/4 max-w-lg" />
            <div className="h-4 bg-slate-800/60 rounded-lg w-1/2" />
          </div>
          <div className="h-12 bg-slate-800 rounded-2xl w-72 self-end" />
        </div>

        {/* Price Bracket Pills Skeleton */}
        <div className="flex gap-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-11 bg-white/70 rounded-2xl w-36 shrink-0" />
          ))}
        </div>

        {/* Toolbar Skeleton */}
        <div className="h-14 bg-white/80 rounded-2xl w-full" />

        {/* 3-Column Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-3xl p-6 bg-white/70 border border-white/80 h-[420px] flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="h-6 bg-slate-200 rounded-lg w-16" />
                  <div className="h-6 bg-slate-200 rounded-lg w-20" />
                </div>
                <div className="h-7 bg-slate-200 rounded-xl w-3/4" />
                <div className="h-20 bg-slate-100 rounded-2xl w-full" />
                <div className="grid grid-cols-3 gap-2">
                  <div className="h-12 bg-slate-100 rounded-xl" />
                  <div className="h-12 bg-slate-100 rounded-xl" />
                  <div className="h-12 bg-slate-100 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <div className="h-9 bg-slate-200 rounded-xl w-full" />
                <div className="h-9 bg-slate-300 rounded-xl w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
