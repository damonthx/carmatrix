import React from 'react';
import { ShieldCheck, ShieldAlert, FileText, CheckCircle2, Award, Zap } from 'lucide-react';

interface RankingsHeaderProps {
  totalRanked: number;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({
  totalRanked,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 px-6 py-5 sm:px-10 sm:py-7 shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#29abe2]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6">
        {/* Main Hero Row: Text on Left, Car Image on Right */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 py-1">
          {/* Title and Copy */}
          <div className="flex-1 max-w-2xl space-y-3.5">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gradient-to-r from-white/[0.08] via-white/[0.04] to-transparent border border-white/20 text-[#29abe2] backdrop-blur-xl shadow-[0_2px_12px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)]">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-400/30 via-emerald-500/20 to-emerald-600/10 border border-emerald-300/40 backdrop-blur-md flex items-center justify-center text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,0.6)] shrink-0">
                <ShieldCheck size={12} strokeWidth={2.4} className="drop-shadow-xs" />
              </div>
              <span className="text-slate-100 tracking-wider">Official NHTSA Defect &amp; Safety Analysis</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-poppins">
              Vehicle <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] to-sky-300">Reliability Scores</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Top 5 most reliable vehicles across every major category. Evaluated strictly on mechanical durability, crash/defect reports, and recall history using free public safety data from the National Highway Traffic Safety Administration (NHTSA).
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400 flex-wrap">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Independent government defect metrics • Zero dealer pricing • Zero commercial bias</span>
            </div>
          </div>

          {/* Car Graphic */}
          <div className="relative w-full lg:w-auto flex-1 flex items-center justify-center lg:justify-end min-w-[260px] max-w-[400px]">
            <div className="absolute w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[radial-gradient(circle,_rgba(41,171,226,0.22)_0%,_transparent_70%)] blur-2xl pointer-events-none" />
            
            <img
              src="https://res.cloudinary.com/yrhldsmj/image/upload/e_background_removal/v1791673725/lexus-is-car-luxury-vehicle-2018-lexus-es-300h-car-thumbnail_mrluwc.png"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://res.cloudinary.com/yrhldsmj/image/upload/v1791673725/lexus-is-car-luxury-vehicle-2018-lexus-es-300h-car-thumbnail_mrluwc.jpg";
              }}
              alt="Vehicle Reliability Leader"
              className="relative z-10 w-full max-w-[340px] sm:max-w-[380px] h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.65)] hover:scale-[1.03] transition-transform duration-300"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* NHTSA Pillars Bar */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">NHTSA Defect History</span>
              <span className="text-[10px] text-slate-400 block">Verified owner complaints per 10k units</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-[#29abe2] shrink-0">
              <FileText size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Safety Recall Audits</span>
              <span className="text-[10px] text-slate-400 block">Federal campaign tracking &amp; remedy status</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
              <Award size={16} />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Powertrain Durability</span>
              <span className="text-[10px] text-slate-400 block">Engine &amp; transmission failure resistance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingsHeader;
