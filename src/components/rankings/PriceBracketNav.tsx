import React from 'react';
import { Tag } from 'lucide-react';
import { TierSummaryItem, ValuationChannel, TIER_DEFINITIONS, TierDefinition } from '@/lib/services/rankingsService';

interface PriceBracketNavProps {
  channel: ValuationChannel;
  activeTier: string | null;
  onSelectTier: (tier: string | null) => void;
  tiersSummary: TierSummaryItem[];
  className?: string;
}

export const PriceBracketNav: React.FC<PriceBracketNavProps> = ({
  channel,
  activeTier,
  onSelectTier,
  tiersSummary,
  className = '',
}) => {
  const definitions = TIER_DEFINITIONS[channel];
  const channelLabel = channel === 'private_party' ? 'Street Cash' : 'Dealer Retail';

  return (
    <div className={`flex flex-wrap sm:flex-nowrap items-center gap-2 ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-sky-500/10 border border-sky-400/30 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs shrink-0">
        <Tag size={13} strokeWidth={2.4} />
      </div>
      <label htmlFor="price-bracket-select" className="text-xs font-bold text-slate-700 shrink-0">
        Price Bracket <span className="text-[11px] font-medium text-slate-500">({channelLabel})</span>:
      </label>
      <select
        id="price-bracket-select"
        value={activeTier || ''}
        onChange={(e) => onSelectTier(e.target.value ? e.target.value : null)}
        className="bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-[#29abe2]/20 transition-colors shadow-2xs min-w-0 max-w-full"
      >
        <option value="">All Price Tiers</option>
        {(Object.entries(definitions) as [string, TierDefinition][]).map(([slug, def]) => {
          const summary = tiersSummary.find((t) => t.tier_slug === slug);
          const count = summary ? summary.vehicle_count : 0;
          return (
            <option key={slug} value={slug}>
              {def.label} ({count} models)
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default PriceBracketNav;
