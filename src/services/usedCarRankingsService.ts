import { VEHICLE_RANKINGS_DATA } from '@/lib/data/vehicleRankingsData';
import {
  RankedVehicleView,
  CashPriceTier,
  VehicleBodyType,
  calculateCarMatrixScore,
  determineCashTier,
} from '../types/vehicleRankings';

export interface VehicleRankingFilterOptions {
  tier?: CashPriceTier;
  bodyType?: VehicleBodyType;
  make?: string;
  minScore?: number;
  maxPrivatePartyPrice?: number;
  searchQuery?: string;
}

/**
 * Service to fetch and query ranked used vehicles.
 * Pure in-memory filtering operating directly on static vetted datasets (Zero Database Dependency).
 */
export async function getTopRatedUsedCars(
  filters: VehicleRankingFilterOptions = {}
): Promise<RankedVehicleView[]> {
  let results: RankedVehicleView[] = VEHICLE_RANKINGS_DATA.map((vehicle) => {
    const scoreData = calculateCarMatrixScore(vehicle);
    const tier = determineCashTier(vehicle.private_party_mid);
    const spreadPct = Number(
      (((vehicle.dealer_retail_mid - vehicle.private_party_mid) / vehicle.dealer_retail_mid) * 100).toFixed(1)
    );
    const spreadSavings = Number((vehicle.dealer_retail_mid - vehicle.private_party_mid).toFixed(2));

    return {
      ...vehicle,
      carmatrix_score: scoreData.final_composite_score,
      composite_score: scoreData.final_composite_score,
      reliability_component: scoreData.reliability_score,
      ownership_cost_component: scoreData.ownership_cost_score,
      market_spread_component: scoreData.market_spread_score,
      cash_price_tier: tier,
      dealer_retail_tier: 'sub_7.5k',
      private_party_savings_pct: spreadPct,
      private_party_savings_dollars: spreadSavings,
      spread_pct: spreadPct,
      private_party_savings: spreadSavings,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  // Apply filters
  if (filters.tier) {
    results = results.filter((v) => v.cash_price_tier === filters.tier);
  }
  if (filters.bodyType) {
    results = results.filter((v) => v.body_type === filters.bodyType);
  }
  if (filters.make) {
    results = results.filter((v) => v.make.toLowerCase() === filters.make!.toLowerCase());
  }
  if (filters.minScore) {
    results = results.filter((v) => v.composite_score >= filters.minScore!);
  }
  if (filters.maxPrivatePartyPrice) {
    results = results.filter((v) => v.private_party_mid <= filters.maxPrivatePartyPrice!);
  }
  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    results = results.filter(
      (v) =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.engine_notes.toLowerCase().includes(q)
    );
  }

  return results.sort((a, b) => b.composite_score - a.composite_score);
}
