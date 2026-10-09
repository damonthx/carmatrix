import { supabase } from './supabaseClient';
import { BENCHMARK_USED_VEHICLES_SEED } from './usedCarSeedData';
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
 * Connects to Supabase `v_top_rated_used_cars` view when available,
 * falling back gracefully to client-side ranked benchmark seed data.
 */
export async function getTopRatedUsedCars(
  filters: VehicleRankingFilterOptions = {}
): Promise<RankedVehicleView[]> {
  try {
    let query = supabase
      .from('v_top_rated_used_cars')
      .select('*')
      .order('composite_score', { ascending: false });

    if (filters.tier) {
      query = query.eq('cash_price_tier', filters.tier);
    }
    if (filters.bodyType) {
      query = query.eq('body_type', filters.bodyType);
    }
    if (filters.make) {
      query = query.ilike('make', filters.make);
    }
    if (filters.minScore) {
      query = query.gte('composite_score', filters.minScore);
    }
    if (filters.maxPrivatePartyPrice) {
      query = query.lte('private_party_mid', filters.maxPrivatePartyPrice);
    }

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data as RankedVehicleView[];
    }
  } catch (err) {
    console.warn('Supabase ranking view query failed, using benchmark seed fallback:', err);
  }

  // Fallback to in-memory vetted seed dataset
  let results: RankedVehicleView[] = BENCHMARK_USED_VEHICLES_SEED.map((vehicle) => {
    const scoreData = calculateCarMatrixScore(vehicle);
    const tier = determineCashTier(vehicle.private_party_mid);
    const spreadPct = Number(
      (((vehicle.dealer_retail_mid - vehicle.private_party_mid) / vehicle.dealer_retail_mid) * 100).toFixed(1)
    );
    const spreadSavings = Number((vehicle.dealer_retail_mid - vehicle.private_party_mid).toFixed(2));

    return {
      ...vehicle,
      composite_score: scoreData.final_composite_score,
      reliability_component: scoreData.reliability_score,
      ownership_cost_component: scoreData.ownership_cost_score,
      market_spread_component: scoreData.market_spread_score,
      cash_price_tier: tier,
      spread_pct: spreadPct,
      private_party_savings: spreadSavings,
    };
  });

  // Apply filters to seed data
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
