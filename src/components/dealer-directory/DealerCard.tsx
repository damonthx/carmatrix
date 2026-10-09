import React from 'react';
import { 
  MapPin, Star, ArrowUpRight, ShieldCheck, 
  Car, TrendingDown, TrendingUp, Zap, ChevronRight, CheckCircle2, Phone, Globe
} from 'lucide-react';
import { EnrichedDealer } from './dealerTypes';

interface DealerCardProps {
  dealer: EnrichedDealer;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewProfile: (dealer: EnrichedDealer) => void;
  onViewInventory?: (dealer: EnrichedDealer) => void;
}

export const DealerCard: React.FC<DealerCardProps> = ({
  dealer,
  isSelected = false,
  onSelect,
  onViewProfile,
  onViewInventory
}) => {
  const score = dealer.price_transparency_score ?? 85;

  // Determine glow and color based on 0-100 score
  const getScoreTheme = (val: number) => {
    if (val >= 88) {
      return {
        bg: 'bg-emerald-500/10 border-emerald-400/40 text-emerald-700',
        glow: 'shadow-[0_0_16px_rgba(16,185,129,0.22)]',
        indicator: 'bg-emerald-500',
        label: 'Elite Integrity'
      };
    }
    if (val >= 78) {
      return {
        bg: 'bg-sky-500/10 border-sky-400/40 text-sky-700',
        glow: 'shadow-[0_0_16px_rgba(41,171,226,0.22)]',
        indicator: 'bg-[#29abe2]',
        label: 'Verified Transparent'
      };
    }
    if (val >= 68) {
      return {
        bg: 'bg-amber-500/10 border-amber-400/40 text-amber-700',
        glow: 'shadow-[0_0_16px_rgba(245,158,11,0.2)]',
        indicator: 'bg-amber-500',
        label: 'Fair / Moderate'
      };
    }
    return {
      bg: 'bg-rose-500/10 border-rose-400/40 text-rose-700',
      glow: 'shadow-[0_0_16px_rgba(244,63,94,0.2)]',
      indicator: 'bg-rose-500',
      label: 'Caution / Add-on Risk'
    };
  };

  const scoreTheme = getScoreTheme(score);
  const isBelowMarket = dealer.market_price_delta <= 0;

  return (
    <div 
      onClick={onSelect}
      className={`group relative flex flex-col justify-between p-6 sm:p-7 rounded-[28px] transition-all duration-300 backdrop-blur-xl border font-poppins cursor-pointer overflow-hidden ${
        isSelected 
          ? 'bg-white/95 border-[#29abe2] ring-2 ring-[#29abe2]/40 shadow-[0_16px_40px_rgba(41,171,226,0.18)] -translate-y-1'
          : 'bg-white/80 hover:bg-white/95 border-white/70 hover:border-white shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)] hover:-translate-y-1'
      }`}
    >
      {/* Specular top light rim */}
      <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none" />

      {/* Internal subtle brand glow on hover */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-[#29abe2]/10 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />

      {/* Card Header: Brand Pills & Transparency Score Pill */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3.5">
          
          {/* Location & Distance Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/80 text-slate-700 text-xs font-semibold">
            <MapPin size={12} className="text-[#29abe2] shrink-0" />
            <span className="truncate max-w-[170px]">{dealer.city}, {dealer.state}</span>
            <span className="text-slate-300">·</span>
            <span className="text-[#0284c7] font-bold whitespace-nowrap">{dealer.distance_miles} mi</span>
          </div>

          {/* Transparency / Integrity Score Pill (0–100 with subtle glow) */}
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-black tracking-tight shrink-0 transition-all ${scoreTheme.bg} ${scoreTheme.glow}`}>
            <span className={`w-2 h-2 rounded-full ${scoreTheme.indicator} animate-pulse`} />
            <span>{score}/100</span>
            <span className="hidden sm:inline font-bold text-[10.5px] opacity-80 uppercase tracking-wider">{scoreTheme.label}</span>
          </div>
        </div>

        {/* Dealership Name & Verification Badges */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg sm:text-[19px] font-bold text-slate-900 tracking-tight group-hover:text-[#29abe2] transition-colors leading-snug">
              {dealer.name}
            </h3>
            {dealer.is_claimed && (
              <span title="Verified Official Dealership" className="inline-flex text-[#29abe2]">
                <CheckCircle2 size={17} className="stroke-[2.5]" />
              </span>
            )}
          </div>
          
          <p className="text-xs text-slate-500 font-medium truncate">
            {dealer.street_address} · {dealer.zip_code}
          </p>
        </div>

        {/* Brands & EV Certified Pill */}
        <div className="flex flex-wrap items-center gap-1.5 mb-5">
          {dealer.brands.slice(0, 3).map((brand, i) => (
            <span 
              key={i}
              className="text-[11px] font-semibold text-slate-600 bg-slate-100/80 px-2.5 py-0.5 rounded-lg border border-slate-200/60"
            >
              {brand}
            </span>
          ))}
          {dealer.brands.length > 3 && (
            <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-lg">
              +{dealer.brands.length - 3} more
            </span>
          )}

          {dealer.is_ev_certified && (
            <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-lg shadow-xs">
              <Zap size={11} className="text-emerald-500 fill-emerald-500" />
              <span>EV Certified</span>
            </span>
          )}
        </div>

        {/* Key Stats Bar (3 Metric Boxes) */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-slate-50/90 border border-slate-100 mb-6 text-center">
          
          {/* 1. Active Vehicles in Stock */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              <Car size={11} className="text-slate-400" />
              <span>In Stock</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
              {dealer.active_inventory_count}
            </div>
            <div className="text-[10px] font-medium text-slate-400">Available</div>
          </div>

          {/* 2. Average Market Price Delta */}
          <div className="flex flex-col justify-center px-1 border-x border-slate-200/70">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              {isBelowMarket ? <TrendingDown size={11} className="text-emerald-500" /> : <TrendingUp size={11} className="text-amber-500" />}
              <span>Market</span>
            </div>
            <div className={`text-sm sm:text-base font-black tracking-tight ${
              isBelowMarket ? 'text-emerald-600' : 'text-slate-800'
            }`}>
              {dealer.price_delta_label}
            </div>
            <div className="text-[10px] font-medium text-slate-400">vs Regional Avg</div>
          </div>

          {/* 3. Customer Rating */}
          <div className="flex flex-col justify-center px-1">
            <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span>Rating</span>
            </div>
            <div className="text-sm sm:text-base font-black text-slate-900 tracking-tight flex items-center justify-center gap-1">
              <span>{dealer.customer_rating_display.toFixed(1)}</span>
              <span className="text-xs text-amber-500">★</span>
            </div>
            <div className="text-[10px] font-medium text-slate-400">
              ({dealer.review_count_display} reviews)
            </div>
          </div>

        </div>
      </div>

      {/* CTA Buttons: Primary Accent & Secondary Glass */}
      <div className="flex items-center gap-2.5 pt-1">
        
        {/* Primary Accent Button: "View Inventory" */}
        <a
          href={dealer.website || '#'}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (onViewInventory) {
              e.preventDefault();
              onViewInventory(dealer);
            }
          }}
          className="flex-1 bg-[#29abe2] hover:bg-[#2089b5] text-white py-3 px-4 rounded-2xl text-xs sm:text-[13px] font-bold transition-all duration-200 shadow-md shadow-[#29abe2]/20 hover:shadow-lg hover:shadow-[#29abe2]/30 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer text-center"
        >
          <span>View Inventory</span>
          <ArrowUpRight size={15} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>

        {/* Secondary Glass Button: "Dealer Profile" */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(dealer);
          }}
          className="bg-white/80 hover:bg-white text-slate-700 hover:text-slate-900 py-3 px-4 rounded-2xl text-xs sm:text-[13px] font-bold border border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <ShieldCheck size={15} className="text-[#29abe2]" />
          <span>Dealer Profile</span>
        </button>

      </div>
    </div>
  );
};
