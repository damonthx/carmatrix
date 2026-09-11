import React from 'react';
import { Users, Clock } from 'lucide-react';

export default function TeamPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <Users size={14} /> The Team
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
          Meet the minds behind CarMatrix
        </h1>
        <p className="text-xl text-slate-600 font-medium max-w-[600px] mx-auto leading-relaxed">
          We are a team of AI engineers, automotive enthusiasts, and data scientists dedicated to transforming how the world buys cars.
        </p>
      </div>

      <div className="max-w-[800px] mx-auto px-4">
        <div className="light-glass-card rounded-[32px] p-16 text-center shadow-xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
            <Clock size={32} className="text-slate-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Coming Soon</h2>
          <p className="text-lg text-slate-600 font-medium max-w-[400px] mx-auto">
            We're busy building the future of car buying. Our full team roster and bios will be published here shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
