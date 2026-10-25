import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShieldCheck, 
  Car, 
  Truck, 
  Zap, 
  Compass, 
  Award, 
  Info,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { RankingsHeader } from './components/rankings/RankingsHeader';
import { CategoryNav, RELIABILITY_CATEGORIES } from './components/rankings/CategoryNav';
import { VehicleRankingCard } from './components/rankings/VehicleRankingCard';
import { StreetSmartInspectionDrawer } from './components/rankings/StreetSmartInspectionDrawer';
import { ShareRankingsBar } from './components/rankings/ShareRankingsBar';
import { VEHICLE_RANKINGS_DATA, StaticRankedVehicle } from '@/lib/data/vehicleRankingsData';
import { VehicleRankingItem, enrichVehicleRecord } from '@/lib/services/rankingsService';

interface RankingsPageProps {
  onBackToHome?: () => void;
  onSearchInventory?: (make: string, model: string) => void;
}

interface CategoryGroup {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  vehicles: VehicleRankingItem[];
}

export const RankingsPage: React.FC<RankingsPageProps> = ({
  onBackToHome,
  onSearchInventory,
}) => {
  // Active Category State: 'all', 'suv', 'sedan', 'truck', 'hybrid_ev', 'wagon_hatchback'
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Selected vehicle for NHTSA Inspection Drawer
  const [inspectingVehicle, setInspectingVehicle] = useState<VehicleRankingItem | null>(null);

  // Set document title
  useEffect(() => {
    document.title = 'Vehicle Reliability Scores | CarMatrix';
  }, []);

  // Synchronize state with URL query parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlCategory = params.get('category');
      if (urlCategory && ['all', 'suv', 'sedan', 'truck', 'hybrid_ev', 'wagon_hatchback'].includes(urlCategory)) {
        setSelectedCategory(urlCategory);
      }
    }
  }, []);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (catId !== 'all') {
        params.set('category', catId);
      } else {
        params.delete('category');
      }
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
      window.history.replaceState({}, '', newUrl);
    }
  };

  // Compute Top 5 most reliable vehicles per category
  const categoryGroups = useMemo<CategoryGroup[]>(() => {
    // Enrich all static vehicles
    const allEnriched = VEHICLE_RANKINGS_DATA.map((v) => enrichVehicleRecord(v, 'private_party'));

    const defs = [
      {
        id: 'suv',
        name: 'SUVs & Crossovers',
        description: 'All-weather capability, robust all-wheel-drive systems, and proven high-mileage chassis endurance.',
        icon: Compass,
        filter: (v: VehicleRankingItem) => v.body_type === 'suv' && !v.model.toLowerCase().includes('outback'),
      },
      {
        id: 'sedan',
        name: 'Sedans',
        description: 'Executive highway cruisers and daily commuters with legendary powertrain longevity and minimal defect records.',
        icon: Car,
        filter: (v: VehicleRankingItem) => v.body_type === 'sedan',
      },
      {
        id: 'truck',
        name: 'Trucks',
        description: 'Heavy towing capacity, durable body-on-frame platforms, and industrial-grade V8 and V6 powertrains.',
        icon: Truck,
        filter: (v: VehicleRankingItem) => v.body_type === 'truck',
      },
      {
        id: 'hybrid_ev',
        name: 'Hybrids & Electrified Vehicles',
        description: 'Exceptional thermal efficiency, regenerative brake longevity, and million-mile taxi/fleet proven battery architectures.',
        icon: Zap,
        filter: (v: VehicleRankingItem) => v.body_type === 'hybrid_ev',
      },
      {
        id: 'wagon_hatchback',
        name: 'Wagons & Hatchbacks',
        description: 'Maximum cargo utility per footprint with simple, highly durable mechanical drivetrains and low failure rates.',
        icon: ShieldCheck,
        filter: (v: VehicleRankingItem) => v.body_type === 'wagon' || v.body_type === 'hatchback' || v.model.toLowerCase().includes('outback'),
      },
    ];

    return defs.map((def) => {
      const top10 = allEnriched
        .filter(def.filter)
        .sort((a, b) => b.reliability_rating - a.reliability_rating)
        .slice(0, 10);

      return {
        id: def.id,
        name: def.name,
        description: def.description,
        icon: def.icon,
        vehicles: top10,
      };
    });
  }, []);

  const totalRankedVehicles = useMemo(() => {
    const ids = new Set<string>();
    categoryGroups.forEach((g) => g.vehicles.forEach((v) => ids.add(v.id)));
    return ids.size;
  }, [categoryGroups]);

  // Active displayed groups
  const displayedGroups = useMemo(() => {
    if (selectedCategory === 'all') {
      return categoryGroups;
    }
    return categoryGroups.filter((g) => g.id === selectedCategory);
  }, [categoryGroups, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-poppins pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              CarMatrix
            </button>
            <span>/</span>
            <span className="text-white font-semibold">Vehicle Reliability Scores</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NHTSA Federal Safety Data</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* 1. Header Section */}
        <RankingsHeader totalRanked={totalRankedVehicles} />

        {/* 2. Category Navigation */}
        <CategoryNav
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* 3. Reliability Categories Sections */}
        <div className="space-y-12">
          {displayedGroups.map((group) => {
            const IconComp = group.icon;

            return (
              <section key={group.id} id={group.id} className="space-y-5 scroll-mt-20">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-md">
                      <IconComp size={20} className="text-[#29abe2]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {group.name}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Top 10 Most Reliable
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  {selectedCategory === 'all' && (
                    <button
                      type="button"
                      onClick={() => handleSelectCategory(group.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#29abe2] hover:text-sky-700 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <span>Focus Category</span>
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>

                {/* Top 5 Vehicle Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.vehicles.map((vehicle, idx) => (
                    <VehicleRankingCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      rank={idx + 1}
                      onOpenInspection={(v) => setInspectingVehicle(v)}
                      onSearchInventory={onSearchInventory}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* 4. Methodology Notice */}
        <div className="mt-14 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-700">
            <div className="w-6 h-6 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-[#29abe2] shadow-2xs">
              <Info size={13} strokeWidth={2.4} />
            </div>
            <span>NHTSA Scoring Methodology &amp; Trust Transparency</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vehicle Reliability Scores are computed strictly on empirical safety defect frequencies from the National Highway Traffic Safety Administration (NHTSA) database. Scores prioritize lack of catastrophic powertrain (engine &amp; transmission) failures, absence of uncontained fires or sudden steering lockups, minimal safety recall frequency, and verified long-term mechanical survival past 250,000 miles. CarMatrix does not accept dealer fees or sponsor placements on this leaderboard.
          </p>
        </div>

        {/* 5. Share Rankings Bar */}
        <div className="mt-8">
          <ShareRankingsBar
            category={selectedCategory}
            totalCount={totalRankedVehicles}
          />
        </div>
      </div>

      {/* 6. Slide-Out Inspection Drawer */}
      <StreetSmartInspectionDrawer
        vehicle={inspectingVehicle}
        isOpen={inspectingVehicle !== null}
        onClose={() => setInspectingVehicle(null)}
        onSearchInventory={onSearchInventory}
      />
    </div>
  );
};

export default RankingsPage;
