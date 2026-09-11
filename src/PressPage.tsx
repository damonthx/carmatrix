import React from 'react';
import { Newspaper, ArrowUpRight, Download } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    { date: 'May 18, 2026', title: 'CarMatrix Launches Next-Gen AI Matchmaker for Car Buyers' },
    { date: 'March 12, 2026', title: 'CarMatrix Secures Series A Funding to Expand Automotive Database' },
    { date: 'January 05, 2026', title: 'CarMatrix Partners with NHTSA for Enhanced Vehicle Taxonomy' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <Newspaper size={14} /> Press
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Latest News & Announcements
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          Stay up to date with the latest product releases, company milestones, and industry news from CarMatrix.
        </p>
      </div>

      <div className="max-w-[1000px] mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Recent Press Releases</h2>
          {pressReleases.map((release, i) => (
            <div key={i} className="light-glass-card rounded-[24px] p-8 shadow-sm hover:shadow-md transition-all group cursor-pointer border border-white/60 bg-white/60 backdrop-blur-md">
              <p className="text-sm font-bold text-[#29abe2] mb-2">{release.date}</p>
              <h3 className="text-xl font-bold text-slate-900 leading-snug pr-8 relative">
                {release.title}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#29abe2] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight size={16} />
                </div>
              </h3>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 tracking-tight">Media Kit</h2>
          <div className="light-glass-card rounded-[24px] p-8 text-center border border-white/60 bg-gradient-to-b from-white/80 to-white/40 backdrop-blur-md">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download size={24} className="text-[#29abe2]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Download Assets</h3>
            <p className="text-sm text-slate-600 font-medium mb-6">
              Get official CarMatrix logos, brand guidelines, and high-resolution product screenshots.
            </p>
            <button className="w-full bg-[#29abe2] text-white py-3 rounded-full font-bold hover:bg-[#2089b5] transition-colors">
              Download Kit (.ZIP)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
