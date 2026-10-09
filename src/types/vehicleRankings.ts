/**
 * CarMatrix "Top-Rated Used Cars" Module — TypeScript Definitions
 * Reflects database schema from `public.vehicle_rankings_master` and view `public.v_top_rated_used_cars`.
 */

export type VehicleBodyType = 
  | 'sedan' 
  | 'suv' 
  | 'truck' 
  | 'hatchback' 
  | 'wagon' 
  | 'coupe' 
  | 'minivan' 
  | 'hybrid_ev';

export type CashPriceTier = 
  | 'sub_6k'    // < $6,000 street cash
  | '6k_11k'    // $6,000 – $10,999 street cash
  | '11k_18k'   // $11,000 – $17,999 street cash
  | '18k_26k';  // $18,000 – $26,000 street cash

export type DealerRetailTier = 
  | 'sub_7.5k' 
  | '7.5k_13.5k' 
  | '13.5k_22k' 
  | '22k_32k';

export interface VehicleRankingMaster {
  id: string;
  make: string;
  model: string;
  year_start: number;
  year_end: number;
  body_type: VehicleBodyType;
  engine_notes: string;
  dealer_retail_mid: number;
  private_party_mid: number;
  reliability_rating: number; // 1.0 - 5.0
  five_year_maintenance_cost: number;
  depreciation_rate_pct: number; // 3-year residual depreciation %
  key_strengths: string[];
  inspection_alerts: string[];
  is_clean_title_only: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface RankedVehicleView extends VehicleRankingMaster {
  display_name: string;
  private_party_savings_pct: number;
  private_party_savings_dollars: number;
  carmatrix_score: number; // 0 - 100 composite score
  cash_price_tier: CashPriceTier;
  dealer_retail_tier: DealerRetailTier;
}

export interface ScoreComponentBreakdown {
  reliability_score: number; // Max 40
  ownership_cost_score: number; // Max 35
  market_spread_score: number; // Max 25
  final_composite_score: number; // Max 100
}

/**
 * Client-Side Scoring Engine Mirroring PostgreSQL Function
 * `calculate_carmatrix_composite_score`
 */
export function calculateCarMatrixScore(
  reliabilityRating: number,
  fiveYearMaintenanceCost: number,
  depreciationRatePct: number,
  dealerRetailMid: number,
  privatePartyMid: number
): ScoreComponentBreakdown {
  // 1. Reliability Score: 40% weight
  const boundedReliability = Math.min(5.0, Math.max(1.0, reliabilityRating));
  const reliability_score = Math.round(((boundedReliability / 5.0) * 40.0) * 10) / 10;

  // 2. 5-Year Ownership Cost Score: 35% weight
  const ownershipLossTotal = fiveYearMaintenanceCost + (privatePartyMid * (depreciationRatePct / 100.0));
  let ownership_cost_score: number;
  if (ownershipLossTotal <= 4500) {
    ownership_cost_score = 35.0;
  } else if (ownershipLossTotal >= 20000) {
    ownership_cost_score = 7.0;
  } else {
    ownership_cost_score = Math.round((35.0 - (((ownershipLossTotal - 4500) / 15500.0) * 28.0)) * 10) / 10;
  }

  // 3. Market Spread & Value Ratio: 25% weight
  const spreadPct = dealerRetailMid > 0 
    ? ((dealerRetailMid - privatePartyMid) / dealerRetailMid) * 100.0 
    : 0;
  
  let market_spread_score: number;
  if (spreadPct >= 25.0) {
    market_spread_score = 25.0;
  } else if (spreadPct <= 5.0) {
    market_spread_score = 5.0;
  } else {
    market_spread_score = Math.round((5.0 + (((spreadPct - 5.0) / 20.0) * 20.0)) * 10) / 10;
  }

  const final_composite_score = Math.min(
    100.0, 
    Math.max(10.0, Math.round((reliability_score + ownership_cost_score + market_spread_score) * 10) / 10)
  );

  return {
    reliability_score,
    ownership_cost_score,
    market_spread_score,
    final_composite_score
  };
}

/**
 * Filter Parameters for Top-Rated Used Cars API & UI
 */
export interface UsedCarRankingFilterParams {
  tier?: CashPriceTier;
  bodyType?: VehicleBodyType | 'all';
  make?: string;
  minReliability?: number;
  maxBudget?: number;
  sortBy?: 'score_desc' | 'price_asc' | 'reliability_desc' | 'spread_desc';
}
