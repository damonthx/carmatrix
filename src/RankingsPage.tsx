import React, { useState, useEffect } from 'react';
import { 
  SlidersHorizontal, 
  ArrowUpDown, 
  Car, 
  ShieldCheck, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { RankingsHeader } from './components/rankings/RankingsHeader';
import { PriceBracketNav } from './components/rankings/PriceBracketNav';
import { VehicleRankingCard } from './components/rankings/VehicleRankingCard';
import { StreetSmartInspectionDrawer } from './components/rankings/StreetSmartInspectionDrawer';
import { 
  ValuationChannel, 
  TierSummaryItem, 
  VehicleRankingItem 
} from '@/lib/services/rankingsService';
import { vehicleBodyTypes } from '@/lib/validations/rankingsSchema';

interface RankingsPageProps {
  onBackToHome?: () => void;
  onSearchInventory?: (make: string, model: string) => void;
}

export const RankingsPage: React.FC<RankingsPageProps> = ({
  onBackToHome,
  onSearchInventory,
}) => {
  // Valuation Mode State: 'private_party' vs 'dealer_retail'
  const [channel, setChannel] = useState<ValuationChannel>('private_party');

  // Active Price Bracket Tier State (e.g. 'sub-6k', '6k-11k', etc., or null for all)
  const [activeTier, setActiveTier] = useState<string | null>(null);

  // Body Type Filter: 'all', 'sedan', 'suv', 'truck', 'hybrid_ev', etc.
  const [selectedBodyType, setSelectedBodyType] = useState<string>('all');

  // Sort State: 'score_desc', 'reliability_desc', 'ownership_cost_asc', 'spread_desc'
  const [sortBy, setSortBy] = useState<string>('score_desc');

  // Data States
  const [vehicles, setVehicles] = useState<VehicleRankingItem[]>([]);
  const [tiersSummary, setTiersSummary] = useState<TierSummaryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Selected vehicle for Inspection Drawer
  const [inspectingVehicle, setInspectingVehicle] = useState<VehicleRankingItem | null>(null);

  // Synchronize state with URL query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlChannel = params.get('channel');
      const urlTier = params.get('tier');
      const urlBody = params.get('body_type');
      const urlSort = params.get('sort_by');

      if (urlChannel === 'dealer_retail' || urlChannel === 'private_party') {
        setChannel(urlChannel as ValuationChannel);
      }
      if (urlTier) {
        setActiveTier(urlTier);
      }
      if (urlBody) {
        setSelectedBodyType(urlBody);
      }
      if (urlSort) {
        setSortBy(urlSort);
      }
    }
  }, []);

  // Update URL params when user changes filters
  const updateUrlParams = (newChannel: ValuationChannel, newTier: string | null, newBody: string, newSort: string) => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('channel', newChannel);
      if (newTier) params.set('tier', newTier); else params.delete('tier');
      if (newBody !== 'all') params.set('body_type', newBody); else params.delete('body_type');
      if (newSort !== 'score_desc') params.set('sort_by', newSort); else params.delete('sort_by');

      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  // Fetch Tier Summaries whenever channel changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchTiersSummary() {
      try {
        const res = await fetch(`/api/rankings/tiers-summary?channel=${channel}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        if (!isCancelled && data.tiers) {
          setTiersSummary(data.tiers);
        }
      } catch (err) {
        console.warn('Failed to load tiers summary:', err);
      }
    }

    fetchTiersSummary();
    return () => {
      isCancelled = true;
    };
  }, [channel]);

  // Fetch Vehicles whenever filters change
  useEffect(() => {
    let isCancelled = false;

    async function fetchVehicles() {
      setIsLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        query.set('channel', channel);
        if (activeTier) query.set('tier', activeTier);
        if (selectedBodyType !== 'all') query.set('body_type', selectedBodyType);
        query.set('sort_by', sortBy);

        const res = await fetch(`/api/rankings?${query.toString()}`);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();

        if (!isCancelled) {
          setVehicles(data.items || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('Failed to load rankings:', err);
          setError('Unable to load vehicle rankings. Please try again.');
          setIsLoading(false);
        }
      }
    }

    fetchVehicles();
    return () => {
      isCancelled = true;
    };
  }, [channel, activeTier, selectedBodyType, sortBy]);

  // Handlers
  const handleChannelChange = (newChannel: ValuationChannel) => {
    setChannel(newChannel);
    updateUrlParams(newChannel, activeTier, selectedBodyType, sortBy);
  };

  const handleSelectTier = (newTier: string | null) => {
    setActiveTier(newTier);
    updateUrlParams(channel, newTier, selectedBodyType, sortBy);
  };

  const handleBodyTypeChange = (newBody: string) => {
    setSelectedBodyType(newBody);
    updateUrlParams(channel, activeTier, newBody, sortBy);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateUrlParams(channel, activeTier, selectedBodyType, newSort);
  };

  const handleResetFilters = () => {
    setActiveTier(null);
    setSelectedBodyType('all');
    setSortBy('score_desc');
    updateUrlParams(channel, null, 'all', 'score_desc');
  };

  return (
    <div className="min-h-screen bg-[#DDE3EA] py-8 sm:py-12 font-poppins">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link if nested inside App */}
        {onBackToHome && (
          <div className="mb-4">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs font-bold text-slate-600 hover:text-[#29abe2] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>← Back to CarMatrix Home</span>
            </button>
          </div>
        )}

        {/* 1. Hero Header & Channel Toggle */}
        <RankingsHeader 
          channel={channel} 
          onChannelChange={handleChannelChange} 
          totalVehicles={vehicles.length}
        />

        {/* 2. Price Bracket Navigation Pills */}
        <PriceBracketNav
          channel={channel}
          activeTier={activeTier}
          onSelectTier={handleSelectTier}
          tiersSummary={tiersSummary}
        />

        {/* 3. Filter and Sort Toolbar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-white/70 shadow-sm mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Body Style Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mr-1 shrink-0 flex items-center gap-1">
              <Car size={13} />
              <span>Category:</span>
            </span>

            <button
              type="button"
              onClick={() => handleBodyTypeChange('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedBodyType === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              All Styles
            </button>

            {['sedan', 'suv', 'truck', 'hatchback', 'wagon', 'hybrid_ev'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleBodyTypeChange(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer shrink-0 ${
                  selectedBodyType === type
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {type === 'hybrid_ev' ? 'Hybrid / EV' : type}
              </button>
            ))}
          </div>

          {/* Sort Dropdown & Reset */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-500" />
              <label htmlFor="sort-select" className="text-xs font-bold text-slate-700">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none cursor-pointer focus:ring-2 focus:ring-[#29abe2]/20"
              >
                <option value="score_desc">CarMatrix Score (Highest)</option>
                <option value="reliability_desc">Reliability (Highest)</option>
                <option value="ownership_cost_asc">5-Yr Ownership Cost (Lowest)</option>
                <option value="spread_desc">Cash Savings Delta (Biggest Spread)</option>
              </select>
            </div>

            {(activeTier !== null || selectedBodyType !== 'all' || sortBy !== 'score_desc') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Reset filters"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 4. Vehicles Grid / Skeletons / Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="rounded-3xl p-6 bg-white/60 border border-white/60 h-96 animate-pulse space-y-4"
              >
                <div className="h-6 bg-slate-200 rounded-full w-24" />
                <div className="h-8 bg-slate-200 rounded-xl w-3/4" />
                <div className="h-24 bg-slate-100 rounded-2xl w-full" />
                <div className="h-16 bg-slate-200 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-10 rounded-3xl bg-white border border-rose-200 text-center max-w-lg mx-auto space-y-3">
            <AlertCircle size={36} className="text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">Failed to load rankings</h3>
            <p className="text-xs text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => handleResetFilters()}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 cursor-pointer"
            >
              Retry &amp; Reset Filters
            </button>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white/80 border border-white/80 text-center max-w-md mx-auto space-y-4 shadow-sm">
            <Car size={36} className="text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No vehicles match these filters</h3>
            <p className="text-xs text-slate-500">
              Try selecting a different body category or clearing the price bracket filter.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-[#29abe2] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => (
              <VehicleRankingCard
                key={vehicle.id || `${vehicle.make}-${vehicle.model}-${vehicle.year_start}`}
                vehicle={vehicle}
                rank={index + 1}
                channel={channel}
                onOpenInspection={(v) => setInspectingVehicle(v)}
                onSearchInventory={onSearchInventory}
              />
            ))}
          </div>
        )}

        {/* 5. Slide-Out Inspection Drawer */}
        <StreetSmartInspectionDrawer
          vehicle={inspectingVehicle}
          isOpen={inspectingVehicle !== null}
          onClose={() => setInspectingVehicle(null)}
          onSearchInventory={onSearchInventory}
        />
      </div>
    </div>
  );
};

export default RankingsPage;
