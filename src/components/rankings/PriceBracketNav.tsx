import React from 'react';
import { Tag, Layers, TrendingDown } from 'lucide-react';
import { TierSummaryItem, ValuationChannel, TIER_DEFINITIONS, TierDefinition } from '@/lib/services/rankingsService';

interface PriceBracketNavProps {
  channel: ValuationChannel;
  activeTier: string | null;
  onSelectTier: (tier: string | null) => void;
  tiersSummary: TierSummaryItem[];
}

export const PriceBracketNav: React.FC<PriceBracketNavProps> = ({
  channel,
  activeTier,
  onSelectTier,
  tiersSummary,
}) => {
  const definitions = TIER_DEFINITIONS[channel];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-400/30 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs">
            <Tag size={13} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Select Price Bracket ({channel === 'private_party' ? 'Street Cash' : 'Dealer Retail'})
          </span>
        </div>

        {activeTier && (
          <button
            type="button"
            onClick={() => onSelectTier(null)}
            className="text-xs font-semibold text-[#29abe2] hover:underline cursor-pointer"
          >
            Show All Tiers
          </button>
        )}
      </div>

      {/* Horizontal pill navigation */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none snap-x">
        {/* All Tiers Pill */}
        <button
          type="button"
          onClick={() => onSelectTier(null)}
          className={`shrink-0 snap-start px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-2.5 ${
            activeTier === null
              ? 'bg-slate-900 text-white border-slate-800 shadow-md'
              : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div className={`w-5 h-5 rounded-md backdrop-blur-md flex items-center justify-center shrink-0 border ${
            activeTier === null
              ? 'bg-white/20 border-white/30 text-[#29abe2] shadow-inner'
              : 'bg-slate-100 border-slate-200/80 text-slate-500'
          }`}>
            <Layers size={12} strokeWidth={2.4} />
          </div>
          <span>All Price Tiers</span>
        </button>

        {(Object.entries(definitions) as [string, TierDefinition][]).map(([slug, def]) => {
          const isSelected = activeTier === slug;
          const summary = tiersSummary.find((t) => t.tier_slug === slug);
          const count = summary ? summary.vehicle_count : 0;
          const avgSavings = summary ? summary.average_savings_spread : 0;

          return (
            <button
              key={slug}
              type="button"
              onClick={() => onSelectTier(slug)}
              className={`shrink-0 snap-start px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border flex items-center gap-2.5 ${
                isSelected
                  ? 'bg-[#29abe2] text-white border-[#29abe2] shadow-md shadow-[#29abe2]/25'
                  : 'bg-white/80 hover:bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 shadow-xs'
              }`}
            >
              <span>{def.label}</span>

              {/* Vehicle Count Badge */}
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-tight ${
                  isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>

              {/* Savings Delta Pill for Private Party */}
              {channel === 'private_party' && avgSavings > 0 && (
                <span
                  className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    isSelected
                      ? 'bg-emerald-950/40 text-emerald-100'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                  }`}
                >
                  <TrendingDown size={10} />
                  <span>Avg ~${Math.round(avgSavings).toLocaleString()} off</span>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriceBracketNav;
