import React from 'react';
import { DollarSign, ShieldAlert, Sparkles, Building2, UserCheck } from 'lucide-react';
import { ValuationChannel } from '@/lib/services/rankingsService';

interface RankingsHeaderProps {
  channel: ValuationChannel;
  onChannelChange: (channel: ValuationChannel) => void;
  totalVehicles: number;
}

export const RankingsHeader: React.FC<RankingsHeaderProps> = ({
  channel,
  onChannelChange,
  totalVehicles,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white border border-slate-800 p-6 sm:p-10 shadow-2xl mb-8">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#29abe2]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        {/* Title and Copy */}
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#29abe2]/10 border border-[#29abe2]/30 text-[#29abe2]">
            <Sparkles size={13} />
            <span>CarMatrix Value &amp; Reliability Index</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-poppins">
            Top-Rated Used Cars by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] to-sky-300">True Street Value</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Dual-channel pricing engine cross-referencing NHTSA safety records, 5-year maintenance costs, and private party cash clearing prices vs. dealership lot markups.
          </p>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Updated with live Dallas–Fort Worth &amp; nationwide cash transactions ({totalVehicles} ranked models)</span>
          </div>
        </div>

        {/* Channel Segmented Control Switcher */}
        <div className="flex flex-col sm:items-end gap-2 shrink-0">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Market Valuation Mode
          </div>

          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner backdrop-blur-xl">
            {/* Private Party Cash Option */}
            <button
              type="button"
              onClick={() => onChannelChange('private_party')}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                channel === 'private_party'
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <UserCheck size={14} className={channel === 'private_party' ? 'text-white' : 'text-slate-400'} />
              <span>Private Party / Street Cash</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                channel === 'private_party' 
                  ? 'bg-emerald-900/60 text-emerald-100' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                Saves ~15–25%
              </span>
            </button>

            {/* Dealership Lots Option */}
            <button
              type="button"
              onClick={() => onChannelChange('dealer_retail')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                channel === 'dealer_retail'
                  ? 'bg-[#29abe2] text-white shadow-lg shadow-[#29abe2]/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Building2 size={14} className={channel === 'dealer_retail' ? 'text-white' : 'text-slate-400'} />
              <span>Dealership Lots</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 max-w-xs text-right">
            {channel === 'private_party'
              ? 'Private party reflects street cash clearing value without dealer doc fees or pack.'
              : 'Dealer retail incorporates median dealer listing prices before taxes and doc fees.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RankingsHeader;
