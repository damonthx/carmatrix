import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Search, 
  CheckCircle2, 
  ExternalLink,
  Info,
  DollarSign
} from 'lucide-react';
import { VehicleRankingItem, ValuationChannel } from '@/lib/services/rankingsService';

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
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-300';
    if (score >= 80) return 'bg-sky-50 text-sky-700 border-sky-300';
    if (score >= 70) return 'bg-amber-50 text-amber-700 border-amber-300';
    return 'bg-rose-50 text-rose-700 border-rose-300';
  };

  // Rank badge styling
  const getRankBadge = (r: number) => {
    if (r === 1) return { bg: 'bg-amber-400 text-amber-950 font-black', label: '#1' };
    if (r === 2) return { bg: 'bg-slate-300 text-slate-800 font-bold', label: '#2' };
    if (r === 3) return { bg: 'bg-amber-700 text-amber-100 font-bold', label: '#3' };
    return { bg: 'bg-slate-800 text-slate-200 font-bold', label: `#${r}` };
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
            {/* Rank badge */}
            <span className={`px-2.5 py-1 rounded-xl text-xs shadow-xs ${rankBadge.bg}`}>
              {rankBadge.label}
            </span>

            {/* Body Type Pill */}
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/80">
              {vehicle.body_type.replace('_', ' ')}
            </span>
          </div>

          {/* CarMatrix Score Pill */}
          <div className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 shadow-xs ${getScoreBadgeColor(vehicle.composite_score)}`}>
            <ShieldCheck size={14} className="shrink-0" />
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
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 border border-emerald-300/80">
                <span>Save ~${Math.round(spreadSavings).toLocaleString()}</span>
                <span className="font-semibold text-emerald-700">({spreadPct}%)</span>
              </span>
            )}
          </div>
        </div>

        {/* Key Metrics Grid: Reliability, 5-Yr Maint, Depreciation */}
        <div className="grid grid-cols-3 gap-2 mb-5 text-center">
          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Reliability</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">{vehicle.reliability_rating} / 5.0</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">5-Yr Maint</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">${vehicle.five_year_maintenance_cost.toLocaleString()}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/70 border border-slate-200/60 shadow-2xs">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">3-Yr Deprec.</span>
            <span className="text-xs font-black text-slate-800 mt-0.5 block">{vehicle.depreciation_rate_pct}%</span>
          </div>
        </div>

        {/* Key Strengths */}
        {vehicle.key_strengths && vehicle.key_strengths.length > 0 && (
          <div className="mb-6 space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
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
        {/* Inspection Alerts Button */}
        <button
          type="button"
          onClick={() => onOpenInspection(vehicle)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 hover:border-slate-400 shadow-2xs transition-all cursor-pointer"
        >
          <AlertTriangle size={14} className="text-amber-500" />
          <span>Street-Smart Inspection Alerts ({vehicle.inspection_alerts?.length || 0})</span>
        </button>

        {/* Inventory Search CTA */}
        <button
          type="button"
          onClick={() => {
            if (onSearchInventory) {
              onSearchInventory(vehicle.make, vehicle.model);
            } else if (typeof window !== 'undefined') {
              window.location.href = `/?tab=inventory&make=${encodeURIComponent(vehicle.make)}&model=${encodeURIComponent(vehicle.model)}`;
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-[#29abe2] shadow-md hover:shadow-[#29abe2]/25 transition-all cursor-pointer"
        >
          <Search size={14} />
          <span>Search Local Inventory on CarMatrix</span>
          <ExternalLink size={12} className="opacity-70" />
        </button>
      </div>
    </div>
  );
};

export default VehicleRankingCard;
