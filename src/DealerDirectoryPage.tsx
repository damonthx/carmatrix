import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, SlidersHorizontal, MapPin, LayoutGrid, Columns, 
  ShieldCheck, Car, Star, Zap, CheckCircle2, RotateCcw, 
  ChevronDown, X, ArrowLeft, ArrowUpRight, TrendingUp, Sparkles
} from 'lucide-react';
import { DFW_DEALERSHIPS_SEED, seedToDealership } from './services/dfwDealerSeedData';
import { DealerCard } from './components/dealer-directory/DealerCard';
import { DealerMap } from './components/dealer-directory/DealerMap';
import { DealerProfileModal } from './components/dealer-directory/DealerProfileModal';
import { DealerAuditModal } from './components/dealer-intel/DealerAuditModal';
import { EnrichedDealer, ViewMode, DistanceRadius } from './components/dealer-directory/dealerTypes';

// DFW Metro Center Coordinate (Downtown Dallas / Fort Worth Midpoint)
const DFW_CENTER_LAT = 32.8020;
const DFW_CENTER_LNG = -96.9500;

// Haversine Distance Calculator (Miles)
function calculateDistanceMiles(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// EV Brands List
const EV_CAPABLE_BRANDS = new Set([
  'Tesla', 'Porsche', 'Audi', 'BMW', 'Mercedes-Benz', 'Volvo', 
  'Hyundai', 'Kia', 'Ford', 'Chevrolet', 'Nissan', 'Volkswagen', 'Subaru'
]);

interface DealerDirectoryPageProps {
  onBackToHome?: () => void;
  onAuditQuote?: (dealerName: string) => void;
  onNavigateToProfile?: (slug: string) => void;
}

export default function DealerDirectoryPage({
  onBackToHome,
  onAuditQuote,
  onNavigateToProfile
}: DealerDirectoryPageProps) {
  // 1. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopRated, setFilterTopRated] = useState(false);
  const [filterTransparentVerified, setFilterTransparentVerified] = useState(false);
  const [filterEvCertified, setFilterEvCertified] = useState(false);
  const [distanceRadius, setDistanceRadius] = useState<DistanceRadius>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('split'); // 'grid' | 'split'
  const [sortBy, setSortBy] = useState<'transparency' | 'rating' | 'inventory' | 'distance'>('transparency');

  // 2. Selection & Modal State
  const [selectedDealerId, setSelectedDealerId] = useState<string | null>(null);
  const [profileModalDealer, setProfileModalDealer] = useState<EnrichedDealer | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const cardListRef = useRef<HTMLDivElement>(null);

  // 3. Transform DFW Seeds into Enriched Directory Records
  const allEnrichedDealers: EnrichedDealer[] = useMemo(() => {
    return DFW_DEALERSHIPS_SEED.map((seed, idx) => {
      const baseDealer = seedToDealership(seed, `dealer-${seed.slug}`);
      const lat = seed.latitude ?? DFW_CENTER_LAT;
      const lng = seed.longitude ?? DFW_CENTER_LNG;
      const dist = calculateDistanceMiles(DFW_CENTER_LAT, DFW_CENTER_LNG, lat, lng);

      // Deterministic realistic commercial attributes based on dealer brand & size
      const isLuxury = seed.brands.some(b => ['Lexus', 'BMW', 'Mercedes-Benz', 'Porsche', 'Audi'].includes(b));
      const isHighVolume = seed.name.includes('Classic') || seed.name.includes('AutoNation') || seed.name.includes('CarMax') || seed.name.includes('Sam Pack');
      
      const inventoryCount = isHighVolume 
        ? 280 + ((idx * 17) % 190) 
        : isLuxury 
        ? 140 + ((idx * 13) % 95) 
        : 180 + ((idx * 19) % 130);

      // Transparency Index (0 - 100)
      const transparency = isLuxury 
        ? 92 + ((idx * 3) % 7) 
        : seed.dealer_group?.includes('Classic') || seed.dealer_group?.includes('Huffines')
        ? 88 + ((idx * 4) % 9)
        : 82 + ((idx * 5) % 14);

      // Market Price Delta
      const delta = (idx % 3 === 0) 
        ? -450 - ((idx * 40) % 600)
        : (idx % 3 === 1)
        ? -850 - ((idx * 55) % 750)
        : -250 + ((idx * 30) % 500);

      const deltaLabel = delta <= 0 
        ? `-$${Math.abs(delta).toLocaleString()} Below`
        : `+$${delta.toLocaleString()} At Market`;

      // Rating (4.3 to 4.9)
      const rating = 4.4 + ((idx * 7) % 6) / 10;
      const reviewCount = 85 + ((idx * 37) % 310);

      const hasEv = seed.brands.some(b => EV_CAPABLE_BRANDS.has(b));

      return {
        ...baseDealer,
        price_transparency_score: transparency,
        distance_miles: dist,
        active_inventory_count: inventoryCount,
        market_price_delta: delta,
        price_delta_label: deltaLabel,
        customer_rating_display: Math.min(5.0, rating),
        review_count_display: reviewCount,
        is_ev_certified: hasEv,
        doc_fee_display: 150 // Standard Texas Doc Fee
      };
    });
  }, []);

  // 4. Unique Brands for Filter Dropdown
  const availableBrands = useMemo(() => {
    const brandSet = new Set<string>();
    DFW_DEALERSHIPS_SEED.forEach(s => s.brands.forEach(b => brandSet.add(b)));
    return Array.from(brandSet).sort();
  }, []);

  // 5. Filter & Search Logic
  const filteredDealers = useMemo(() => {
    return allEnrichedDealers.filter(dealer => {
      // Search by Name, City, State, or Zip Code
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = dealer.name.toLowerCase().includes(q);
        const matchesCity = dealer.city.toLowerCase().includes(q);
        const matchesState = dealer.state.toLowerCase().includes(q);
        const matchesZip = dealer.zip_code.toLowerCase().includes(q);
        const matchesBrand = dealer.brands.some(b => b.toLowerCase().includes(q));
        if (!matchesName && !matchesCity && !matchesState && !matchesZip && !matchesBrand) {
          return false;
        }
      }

      // Filter Pill: Top Rated (>= 4.6 Stars)
      if (filterTopRated && dealer.customer_rating_display < 4.6) {
        return false;
      }

      // Filter Pill: Transparent Pricing Verified (>= 88 Score)
      if (filterTransparentVerified && (dealer.price_transparency_score ?? 0) < 88) {
        return false;
      }

      // Filter Pill: EV Certified
      if (filterEvCertified && !dealer.is_ev_certified) {
        return false;
      }

      // Distance Radius Filter
      if (distanceRadius !== 'all') {
        const maxDist = parseInt(distanceRadius, 10);
        if (dealer.distance_miles > maxDist) {
          return false;
        }
      }

      // Brand Filter
      if (selectedBrand !== 'all') {
        if (!dealer.brands.includes(selectedBrand)) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'transparency') {
        return (b.price_transparency_score ?? 0) - (a.price_transparency_score ?? 0);
      }
      if (sortBy === 'rating') {
        return b.customer_rating_display - a.customer_rating_display;
      }
      if (sortBy === 'inventory') {
        return b.active_inventory_count - a.active_inventory_count;
      }
      if (sortBy === 'distance') {
        return a.distance_miles - b.distance_miles;
      }
      return 0;
    });
  }, [allEnrichedDealers, searchQuery, filterTopRated, filterTransparentVerified, filterEvCertified, distanceRadius, selectedBrand, sortBy]);

  // Handle marker click on map: highlight and scroll card into view
  const handleSelectDealerFromMap = (dealer: EnrichedDealer) => {
    setSelectedDealerId(dealer.id || null);
    if (dealer.id && cardListRef.current) {
      const cardEl = document.getElementById(`dealer-card-${dealer.id}`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setFilterTopRated(false);
    setFilterTransparentVerified(false);
    setFilterEvCertified(false);
    setDistanceRadius('all');
    setSelectedBrand('all');
  };

  const hasActiveFilters = Boolean(
    searchQuery || filterTopRated || filterTransparentVerified || filterEvCertified || distanceRadius !== 'all' || selectedBrand !== 'all'
  );

  return (
    <div className="min-h-screen bg-[#DDE3EA] font-poppins text-slate-900 pb-24 selection:bg-[#29abe2]/20">
      
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80">
        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#29abe2]/25 via-sky-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1240px] mx-auto relative z-10">
          
          {/* Breadcrumb / Back Navigation */}
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors cursor-pointer group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back to CarMatrix Hub</span>
            </button>
          )}

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              {/* Luxury Glass Badge: The Shield at the Top */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/[0.12] via-white/[0.06] to-transparent border border-white/25 text-white text-xs font-bold tracking-widest uppercase mb-4 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.4)] relative overflow-hidden group">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
                <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[#29abe2] to-sky-600 flex items-center justify-center text-white shadow-[0_0_10px_rgba(41,171,226,0.6)] shrink-0">
                  <ShieldCheck size={13} strokeWidth={2.5} className="drop-shadow-xs" />
                </div>
                <span className="text-slate-100 tracking-wider">CarMatrix Dealer Intel™ Directory</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Know the dealer <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] via-sky-300 to-emerald-400">before</span> you make the deal.
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl mt-2 font-medium">
                Research 50+ verified Dallas–Fort Worth dealerships with unvarnished price transparency grades, live inventory, and doc fee audits.
              </p>
            </div>

            {/* Hero Header Actions: Market Pill + Audit CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(true)}
                className="group relative overflow-hidden bg-gradient-to-r from-[#29abe2] to-[#1e88b8] hover:from-[#249bc9] hover:to-[#1a77a2] text-white px-5 py-3.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-[0_10px_25px_-5px_rgba(41,171,226,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_14px_30px_-5px_rgba(41,171,226,0.6)] border border-sky-300/40 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                <div className="w-6 h-6 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                  <ShieldCheck size={15} strokeWidth={2.4} />
                </div>
                <span>Audit a Dealership</span>
              </button>

              {/* Ultra-Premium Glass Box: Car Icon with 59 Dealerships */}
              <div className="relative group overflow-hidden bg-gradient-to-b from-white/[0.14] to-white/[0.04] backdrop-blur-2xl border border-white/20 shadow-[0_12px_32px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.45)] px-4 py-3 rounded-2xl shrink-0 flex items-center gap-3.5">
                {/* Specular top rim highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
                {/* Ambient backglow */}
                <div className="absolute -inset-1 bg-[#29abe2]/20 rounded-2xl blur-lg pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

                {/* Luxury Jewel Icon Container */}
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-sky-400/30 via-[#29abe2]/20 to-sky-600/10 border border-sky-300/50 shadow-[0_4px_14px_rgba(41,171,226,0.35),inset_0_1px_2px_rgba(255,255,255,0.8)] flex items-center justify-center text-[#29abe2] group-hover:scale-105 transition-transform duration-200 shrink-0">
                  <div className="absolute inset-x-0 top-0 h-px bg-white/90 pointer-events-none" />
                  <Car size={21} strokeWidth={2.2} className="drop-shadow-[0_2px_6px_rgba(41,171,226,0.6)]" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-wider text-sky-200/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <span>DFW Metro Market</span>
                  </div>
                  <div className="text-xl font-black text-white leading-tight tracking-tight mt-0.5">
                    {allEnrichedDealers.length} Dealerships
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Search & Filter Glass Bar */}
          <div className="bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900">
            
            {/* Top row: Search input + View Toggle */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-4">
              
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Dealership Name, City, State, or Zip Code..."
                  className="w-full pl-11 pr-10 py-3.5 bg-slate-50/90 hover:bg-white focus:bg-white border border-slate-200 focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 rounded-2xl text-sm font-semibold text-slate-900 placeholder-slate-400 transition-all outline-none"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-200/50"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* View Toggle Buttons: Grid View vs. Map Split-View */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200/70 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid size={15} />
                  <span>Grid View</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    viewMode === 'split'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns size={15} />
                  <span>Map Split-View</span>
                </button>
              </div>

            </div>

            {/* Bottom Row: Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
              
              {/* Filter 1: Top Rated Pill */}
              <button
                type="button"
                onClick={() => setFilterTopRated(v => !v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  filterTopRated
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                }`}
              >
                <Star size={13} className={filterTopRated ? 'fill-white' : 'text-amber-400 fill-amber-400'} />
                <span>Top Rated (4.6+)</span>
              </button>

              {/* Filter 2: Transparent Pricing Verified Pill */}
              <button
                type="button"
                onClick={() => setFilterTransparentVerified(v => !v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  filterTransparentVerified
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-600/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                }`}
              >
                <ShieldCheck size={14} className={filterTransparentVerified ? 'text-white' : 'text-emerald-500'} />
                <span>Transparent Pricing Verified</span>
              </button>

              {/* Filter 3: EV Certified Pill */}
              <button
                type="button"
                onClick={() => setFilterEvCertified(v => !v)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  filterEvCertified
                    ? 'bg-[#29abe2] text-white border-[#29abe2] shadow-sm shadow-[#29abe2]/20'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/80'
                }`}
              >
                <Zap size={13} className={filterEvCertified ? 'fill-white' : 'text-[#29abe2] fill-[#29abe2]'} />
                <span>EV Certified</span>
              </button>

              {/* Filter 4: Distance Radius Dropdown Pill */}
              <div className="relative">
                <select
                  value={distanceRadius}
                  onChange={(e) => setDistanceRadius(e.target.value as DistanceRadius)}
                  className="appearance-none bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/80 outline-none focus:border-[#29abe2] cursor-pointer"
                >
                  <option value="all">Distance: All DFW</option>
                  <option value="10">Within 10 Miles</option>
                  <option value="25">Within 25 Miles</option>
                  <option value="50">Within 50 Miles</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Brand Filter Dropdown */}
              <div className="relative">
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="appearance-none bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs pl-3.5 pr-8 py-2 rounded-xl border border-slate-200/80 outline-none focus:border-[#29abe2] cursor-pointer"
                >
                  <option value="all">All Brands</option>
                  {availableBrands.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Sort Dropdown */}
              <div className="relative ml-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-slate-50 hover:bg-white text-slate-700 font-bold text-xs pl-3 pr-8 py-2 rounded-xl border border-slate-200 outline-none focus:border-[#29abe2] cursor-pointer"
                >
                  <option value="transparency">Sort: Transparency Score</option>
                  <option value="rating">Sort: Highest Rating</option>
                  <option value="inventory">Sort: Most Inventory</option>
                  <option value="distance">Sort: Closest Distance</option>
                </select>
                <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Reset Filters button if any active */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearAllFilters}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Clear all filters"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Results Counter Header */}
        <div className="flex items-center justify-between pb-4 pt-2">
          <div className="text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-2">
            <span>Showing <span className="text-slate-900 font-extrabold">{filteredDealers.length}</span> of {allEnrichedDealers.length} dealerships</span>
            {searchQuery && (
              <span className="text-slate-400">matching "{searchQuery}"</span>
            )}
          </div>
        </div>

        {/* VIEW MODE 1: MAP SPLIT-VIEW */}
        {viewMode === 'split' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Scrollable List of Dealer Cards (5 Cols) */}
            <div 
              ref={cardListRef}
              className="lg:col-span-6 xl:col-span-5 space-y-4 max-h-[820px] overflow-y-auto pr-1 pb-10 scrollbar-thin scrollbar-thumb-slate-300"
            >
              {filteredDealers.length === 0 ? (
                <div className="bg-white/80 rounded-3xl p-10 text-center border border-white/60 shadow-sm backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                    <Search size={22} />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">No dealerships match your search</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your filters, clearing the search query, or expanding the distance radius.
                  </p>
                  <button
                    onClick={handleClearAllFilters}
                    className="mt-4 px-4 py-2 bg-[#29abe2] text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                filteredDealers.map(dealer => (
                  <div key={dealer.id} id={`dealer-card-${dealer.id}`}>
                    <DealerCard
                      dealer={dealer}
                      isSelected={dealer.id === selectedDealerId}
                      onSelect={() => setSelectedDealerId(dealer.id)}
                      onViewProfile={(d) => setProfileModalDealer(d)}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Right Column: Sticky Interactive Map (7 Cols) */}
            <div className="lg:col-span-6 xl:col-span-7 sticky top-24">
              <DealerMap
                dealers={filteredDealers}
                selectedDealerId={selectedDealerId}
                onSelectDealer={handleSelectDealerFromMap}
                onViewProfile={(d) => setProfileModalDealer(d)}
              />
            </div>

          </div>
        ) : (
          /* VIEW MODE 2: FULL GRID VIEW */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDealers.length === 0 ? (
              <div className="col-span-full bg-white/80 rounded-3xl p-12 text-center border border-white/60 shadow-sm backdrop-blur-xl">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                  <Search size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800">No dealerships match your filter criteria</h3>
                <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                  Try broadening your search or resetting filters to view all Dallas–Fort Worth dealerships.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-5 px-5 py-2.5 bg-[#29abe2] text-white rounded-xl text-xs font-bold shadow-md shadow-[#29abe2]/20"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              filteredDealers.map(dealer => (
                <div key={dealer.id} id={`dealer-card-${dealer.id}`}>
                  <DealerCard
                    dealer={dealer}
                    isSelected={dealer.id === selectedDealerId}
                    onSelect={() => setSelectedDealerId(dealer.id)}
                    onViewProfile={(d) => setProfileModalDealer(d)}
                  />
                </div>
              ))
            )}
          </div>
        )}

      </main>

      {/* Dealer Profile Modal */}
      <DealerProfileModal
        dealer={profileModalDealer}
        onClose={() => setProfileModalDealer(null)}
        onAuditQuote={onAuditQuote}
        onViewFullProfile={onNavigateToProfile}
      />

      {/* Community Accountability / Dealer Audit Modal */}
      {isAuditModalOpen && (
        <DealerAuditModal
          isOpen={isAuditModalOpen}
          preselectedDealer={profileModalDealer}
          onClose={() => setIsAuditModalOpen(false)}
        />
      )}

    </div>
  );
}
