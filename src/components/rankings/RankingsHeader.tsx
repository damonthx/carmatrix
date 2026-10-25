import React from 'react';
import { ShieldCheck, FileText, Award } from 'lucide-react';

interface RankingsHeaderProps {
  totalRanked: number;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({
  totalRanked,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl text-white border border-slate-700/80 px-6 py-6 sm:px-10 sm:py-9 shadow-2xl mb-8 bg-slate-950">
      {/* 1. Base Studio Scene Image placed behind background color at 50% opacity */}
      <img
        src="https://res.cloudinary.com/yrhldsmj/image/upload/v1792902387/neomorpheus_Minimalist_luxury_car_studio_scene_on_a_clean_lig_40783abf-4f36-436d-9171-1d99f07e27f8_3_icc6w6.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-center opacity-50 pointer-events-none z-0"
      />

      {/* 2. Softened Dark Tint Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/70 to-slate-950/50 pointer-events-none z-[1]" />

      {/* 3. Blue Ambient Layer with reduced opacity */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#29abe2]/10 blur-3xl pointer-events-none z-[1]" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none z-[1]" />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col gap-7">
        {/* Main Content Row without hero image */}
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent border border-white/20 text-[#29abe2] backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-emerald-600/10 border border-emerald-300/40 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] shrink-0">
              <ShieldCheck size={12} strokeWidth={2.4} className="drop-shadow-xs" />
            </div>
            <span className="text-slate-100 tracking-wider">Official NHTSA Defect &amp; Safety Analysis</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-poppins drop-shadow-md">
            Vehicle <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] to-sky-300">Reliability Scores</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-200 leading-relaxed font-normal max-w-2xl drop-shadow-xs">
            Top 10 most reliable vehicles across every major category. Evaluated strictly on mechanical durability, crash/defect reports, and recall history using free public safety data from the National Highway Traffic Safety Administration (NHTSA).
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300 flex-wrap font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Independent government defect metrics • Zero dealer pricing • Zero commercial bias</span>
          </div>
        </div>

        {/* NHTSA Pillars Bar */}
        <div className="pt-5 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">NHTSA Defect History</span>
              <span className="text-[10px] text-slate-300 block">Verified owner complaints per 10k units</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-400/20 flex items-center justify-center text-[#29abe2] shrink-0">
              <FileText size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Safety Recall Audits</span>
              <span className="text-[10px] text-slate-300 block">Federal campaign tracking &amp; remedy status</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-md shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Powertrain Durability</span>
              <span className="text-[10px] text-slate-300 block">Engine &amp; transmission failure resistance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsHeader;
