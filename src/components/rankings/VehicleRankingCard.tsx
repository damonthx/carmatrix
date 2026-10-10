import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Info,
  DollarSign,
  TrendingDown,
  Gauge
} from 'lucide-react';
import { VehicleRankingItem, ValuationChannel } from '@/lib/services/rankingsService';
import { buildCarMatrixInventoryUrl } from '@/lib/utils/inventoryLinks';

interface VehicleRankingCardProps {
  vehicle: VehicleRankingItem;
  rank: number;
  channel: ValuationChannel;
  onOpenInspection: (vehicle: VehicleRankingItem) => void;
  onSearchInventory?: (make: string, model: string) => void;
}

export const VehicleRankingCard: React.FC<VehicleRankingCardProps> = ({
  vehicle,
  rank,
  channel,
  onOpenInspection,
  onSearchInventory,
}) => {
  // Score color helper
  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-50/90 text-emerald-700 border-emerald-300/80 shadow-emerald-500/10';
    if (score >= 80) return 'bg-sky-50/90 text-sky-700 border-sky-300/80 shadow-sky-500/10';
    if (score >= 70) return 'bg-amber-50/90 text-amber-700 border-amber-300/80 shadow-amber-500/10';
    return 'bg-rose-50/90 text-rose-700 border-rose-300/80 shadow-rose-500/10';
  };

  // Rank badge styling with glassmorphic depth
  const getRankBadge = (r: number) => {
    if (r === 1) return { 
      bg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white border border-amber-300/60 shadow-[0_2px_8px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,0.7)]', 
      label: '#1' 
    };
    if (r === 2) return { 
      bg: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 text-slate-800 border border-white/80 shadow-[0_2px_8px_rgba(15,23,42,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)]', 
      label: '#2' 
    };
    if (r === 3) return { 
      bg: 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-amber-100 border border-amber-400/40 shadow-[0_2px_8px_rgba(180,83,9,0.25),inset_0_1px_1px_rgba(255,255,255,0.5)]', 
      label: '#3' 
    };
    return { 
      bg: 'bg-slate-900 text-slate-200 border border-slate-700/80 shadow-xs', 
      label: `#${r}` 
    };
  };

  const rankBadge = getRankBadge(rank);
  const activePrice = channel === 'dealer_retail' ? vehicle.dealer_retail_mid : vehicle.private_party_mid;
  const spreadSavings = vehicle.savings_spread;
  const spreadPct = vehicle.savings_pct;

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/80 relative overflow-hidden group">
      {/* Top accent rim */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent" />

      {/* Header section: Rank, Title, Body Badge, Score */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            {/* Glassmorphic Rank badge */}
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black backdrop-blur-md shrink-0 ${rankBadge.bg}`}>
              {rankBadge.label}
            </div>

            {/* Body Type Pill */}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100/90 text-slate-600 border border-slate-200/80">
              {vehicle.body_type.replace('_', ' ')}
            </span>
          </div>

          {/* CarMatrix Score Pill with Glass Icon Container */}
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-2 shadow-xs backdrop-blur-md ${getScoreBadgeColor(vehicle.composite_score)}`}>
            <div className="w-5 h-5 rounded-md bg-white/70 backdrop-blur-md border border-white/90 flex items-center justify-center shadow-2xs shrink-0">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
            <span className="text-xs font-black tracking-tight">{vehicle.composite_score}/100</span>
          </div>
        </div>

        {/* Vehicle Name and Engine notes */}
        <div className="mb-4">
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-[#29abe2] transition-colors font-poppins">
            {vehicle.year_start}–{vehicle.year_end} {vehicle.make} {vehicle.model}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {vehicle.engine_notes}
          </p>
        </div>

        {/* Pricing Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/70 mb-5 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {channel === 'dealer_retail' ? 'Dealer Retail Est.' : 'Street Cash Est.'}
            </span>
            <span className="text-2xl font-black text-slate-900 font-poppins">
              ${activePrice.toLocaleString()}
            </span>
          </div>

          {/* Secondary price comp & savings pill */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60 text-xs">
            <span className="text-[11px] text-slate-500">
              {channel === 'dealer_retail'
                ? `Private Party: $${vehicle.private_party_mid.toLocaleString()}`
                : `Dealer List: $${vehicle.dealer_retail_mid.toLocaleString()}`}
            </span>

            {spreadSavings > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80 shadow-2xs">
                <span>Save ~${Math.round(spreadSavings).toLocaleString()}</span>
                <span className="font-semibold text-emerald-700">({spreadPct}%)</span>
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics Grid: Reliability, 5-Yr Maint, Depreciation (with Glassmorphic Icon Containers) */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          {/* Reliability */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-white/95 to-slate-50/80 border border-slate-200/70 shadow-2xs flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] mb-1">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
            <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">Reliability</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">{vehicle.reliability_rating} / 5.0</span>
          </div>

          {/* 5-Yr Maintenance */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-white/95 to-slate-50/80 border border-slate-200/70 shadow-2xs flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-400/30 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] mb-1">
              <Wrench size={12} strokeWidth={2.4} />
            </div>
            <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">5-Yr Maint</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">${vehicle.five_year_maintenance_cost.toLocaleString()}</span>
          </div>

          {/* 3-Yr Depreciation */}
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-white/95 to-slate-50/80 border border-slate-200/70 shadow-2xs flex flex-col items-center justify-center">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-400/30 backdrop-blur-md flex items-center justify-center text-amber-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] mb-1">
              <TrendingDown size={12} strokeWidth={2.4} />
            </div>
            <span className="block text-[9.5px] font-bold text-slate-400 uppercase tracking-tight">3-Yr Deprec.</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">{vehicle.depreciation_rate_pct}%</span>
          </div>
        </div>

        {/* Key Strengths */}
        {vehicle.key_strengths && vehicle.key_strengths.length > 0 && (
          <div className="mb-6 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/40 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                <CheckCircle2 size={11} strokeWidth={2.5} />
              </div>
              <span>Proven Strengths</span>
            </div>
            <ul className="space-y-1 text-xs text-slate-600 pl-1">
              {vehicle.key_strengths.slice(0, 3).map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-400 mt-1 text-[8px]">•</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Card Action Buttons */}
      <div className="space-y-2.5 pt-4 border-t border-slate-200/70">
        {/* Inspection Alerts Button with Glassmorphic Icon */}
        <button
          type="button"
          onClick={() => onOpenInspection(vehicle)}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all cursor-pointer group/alert"
        >
          <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-400/40 backdrop-blur-md flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
            <AlertTriangle size={12} strokeWidth={2.4} />
          </div>
          <span>Street-Smart Inspection Alerts ({vehicle.inspection_alerts?.length || 0})</span>
        </button>

        {/* Inventory Search CTA with Glassmorphic Icon */}
        <button
          type="button"
          onClick={() => {
            if (onSearchInventory) {
              onSearchInventory(vehicle.make, vehicle.model);
            } else if (typeof window !== 'undefined') {
              window.location.href = buildCarMatrixInventoryUrl(vehicle, channel);
            }
          }}
          className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-[#29abe2] shadow-md hover:shadow-[#29abe2]/25 transition-all cursor-pointer group/cta"
        >
          <div className="w-5 h-5 rounded-md bg-white/15 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
            <Search size={12} strokeWidth={2.4} />
          </div>
          <span>Search Local Inventory on CarMatrix</span>
          <ExternalLink size={12} className="opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default VehicleRankingCard;
