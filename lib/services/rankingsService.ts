import { VEHICLE_RANKINGS_DATA, StaticRankedVehicle } from '../data/vehicleRankingsData';
import {
  RankedVehicleView,
  calculateCarMatrixScore,
  determineCashTier,
} from '@/src/types/vehicleRankings';
import { RankingsQueryParams } from '../validations/rankingsSchema';

export type ValuationChannel = 'private_party' | 'dealer_retail';

export interface TierDefinition {
  slug: string;
  label: string;
  minPrice: number;
  maxPrice: number | null; // null means open-ended upper bound (e.g. $26k+)
}

/**
 * Dynamic price brackets by channel.
 * Private party reflects street cash clearing brackets (e.g. Sub-$6k, $6k–$11k).
 * Dealer retail accounts for standard dealer markups (~15%-25% higher).
 */
export const TIER_DEFINITIONS: Record<ValuationChannel, Record<string, TierDefinition>> = {
  private_party: {
    'sub-6k': { slug: 'sub-6k', label: 'Sub-$6,000 Cash', minPrice: 0, maxPrice: 6000 },
    '6k-11k': { slug: '6k-11k', label: '$6,000 – $11,000', minPrice: 6000, maxPrice: 11000 },
    '11k-18k': { slug: '11k-18k', label: '$11,000 – $18,000', minPrice: 11000, maxPrice: 18000 },
    '18k-26k': { slug: '18k-26k', label: '$18,000 – $26,000', minPrice: 18000, maxPrice: 26000 },
    '26k-plus': { slug: '26k-plus', label: '$26,000+', minPrice: 26000, maxPrice: null },
  },
  dealer_retail: {
    'sub-6k': { slug: 'sub-6k', label: 'Under $7,500 Retail', minPrice: 0, maxPrice: 7500 },
    '6k-11k': { slug: '6k-11k', label: '$7,500 – $13,500', minPrice: 7500, maxPrice: 13500 },
    '11k-18k': { slug: '11k-18k', label: '$13,500 – $22,000', minPrice: 13500, maxPrice: 22000 },
    '18k-26k': { slug: '18k-26k', label: '$22,000 – $32,000', minPrice: 22000, maxPrice: 32000 },
    '26k-plus': { slug: '26k-plus', label: '$32,000+', minPrice: 32000, maxPrice: null },
  },
};

export interface VehicleRankingItem extends RankedVehicleView {
  savings_spread: number;
  savings_pct: number;
  target_price: number;
  composite_score: number;
  reliability_component?: number;
  ownership_cost_component?: number;
  market_spread_component?: number;
  spread_pct?: number;
  private_party_savings?: number;
}

export interface RankingsResponsePayload {
  active_channel: ValuationChannel;
  total_count: number;
  price_bracket_applied: {
    tier_slug?: string;
    min_price: number;
    max_price: number | null;
  };
  summary_stats: {
    average_savings_spread: number;
    average_savings_pct: number;
    average_composite_score: number;
  };
  items: VehicleRankingItem[];
  is_fallback?: boolean;
  fallback_message?: string;
}

export interface TierSummaryItem {
  tier_slug: string;
  label: string;
  min_price: number;
  max_price: number | null;
  vehicle_count: number;
  top_vehicle: {
    id: string;
    make: string;
    model: string;
    year_range: string;
    composite_score: number;
    private_party_mid: number;
    dealer_retail_mid: number;
  } | null;
  average_savings_spread: number;
  average_savings_pct: number;
}

export interface SingleVehicleDetailPayload {
  vehicle: RankedVehicleView;
  scoring_breakdown: {
    composite_score: number;
    reliability_score: number;
    ownership_cost_score: number;
    market_spread_score: number;
    reliability_rating: number;
    five_year_maintenance_cost: number;
    depreciation_rate_pct: number;
  };
  market_comparison: {
    dealer_retail_mid: number;
    private_party_mid: number;
    savings_spread: number;
    savings_pct: number;
    street_clearing_advantage: string;
  };
  inspection_alerts: string[];
  key_strengths: string[];
  inventory_search_query: {
    make: string;
    model: string;
    search_url: string;
  };
}

/**
 * Converts a static vehicle item into an enriched runtime VehicleRankingItem
 * with calculated score metrics and channel savings.
 */
export function enrichVehicleRecord(
  raw: StaticRankedVehicle,
  channel: ValuationChannel = 'private_party'
): VehicleRankingItem {
  const dealerRetail = Number(raw.dealer_retail_mid) || 0;
  const privateParty = Number(raw.private_party_mid) || 0;
  const targetPrice = channel === 'dealer_retail' ? dealerRetail : privateParty;

  const savings_spread = Math.max(0, Number((dealerRetail - privateParty).toFixed(2)));
  const savings_pct = dealerRetail > 0
    ? Number(((savings_spread / dealerRetail) * 100).toFixed(1))
    : 0;

  const id = raw.id || `${raw.make}-${raw.model}-${raw.year_start}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Compute composite score via client scoring engine
  const scoreData = calculateCarMatrixScore(raw);
  const composite_score = scoreData.final_composite_score;
  const reliability_component = scoreData.reliability_score;
  const ownership_cost_component = scoreData.ownership_cost_score;
  const market_spread_component = scoreData.market_spread_score;
  const cash_price_tier = determineCashTier(privateParty);

  return {
    ...raw,
    id,
    carmatrix_score: composite_score,
    composite_score,
    reliability_component,
    ownership_cost_component,
    market_spread_component,
    cash_price_tier,
    dealer_retail_tier: 'sub_7.5k', // default fallback
    private_party_savings_pct: savings_pct,
    private_party_savings_dollars: savings_spread,
    spread_pct: savings_pct,
    private_party_savings: savings_spread,
    savings_spread,
    savings_pct,
    target_price: targetPrice,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Pure in-memory Rankings Service (Zero Database Reliance)
 * Operates entirely on VEHICLE_RANKINGS_DATA.
 */
export class RankingsService {
  /**
   * Resolve active price bounds based on channel and parameters
   */
  static resolvePriceBounds(
    channel: ValuationChannel,
    tierSlug?: string,
    minPriceParam?: number,
    maxPriceParam?: number
  ): { min: number; max: number | null } {
    let min = minPriceParam ?? 0;
    let max = maxPriceParam ?? null;

    if (tierSlug && TIER_DEFINITIONS[channel][tierSlug]) {
      const def = TIER_DEFINITIONS[channel][tierSlug];
      min = minPriceParam !== undefined ? Math.max(minPriceParam, def.minPrice) : def.minPrice;
      max = maxPriceParam !== undefined 
        ? (def.maxPrice !== null ? Math.min(maxPriceParam, def.maxPrice) : maxPriceParam)
        : def.maxPrice;
    }

    return { min, max };
  }

  /**
   * Pure in-memory filtering, sorting, and pagination
   */
  static async getRankings(params: RankingsQueryParams): Promise<RankingsResponsePayload> {
    const channel = params.channel;
    const bounds = this.resolvePriceBounds(channel, params.tier, params.min_price, params.max_price);

    // 1. Enrich static array
    const allItems: VehicleRankingItem[] = VEHICLE_RANKINGS_DATA.map((v) => enrichVehicleRecord(v, channel));

    // 2. Filter by price bounds (using target price for active channel)
    let filteredItems = allItems.filter((v) => {
      const p = v.target_price;
      if (p < bounds.min) return false;
      if (bounds.max !== null && p > bounds.max) return false;
      return true;
    });

    // 3. Filter by body type
    if (params.body_type && params.body_type.length > 0) {
      filteredItems = filteredItems.filter((v) => params.body_type!.includes(v.body_type as any));
    }

    let is_fallback = false;
    let fallback_message: string | undefined = undefined;

    // 4. SMART FALLBACK LAYER: Prevent empty views
    if (filteredItems.length === 0) {
      // Strategy 1: If user filtered by body_type, find that body_type across adjacent tiers/overall
      if (params.body_type && params.body_type.length > 0) {
        const sameBodyVehicles = allItems.filter((v) => params.body_type!.includes(v.body_type as any));
        if (sameBodyVehicles.length > 0) {
          const tierMid = bounds.max !== null ? (bounds.min + bounds.max) / 2 : bounds.min;
          sameBodyVehicles.sort((a, b) => {
            const distA = Math.abs(a.target_price - tierMid);
            const distB = Math.abs(b.target_price - tierMid);
            if (Math.abs(distA - distB) > 3000) {
              return distA - distB;
            }
            return b.composite_score - a.composite_score;
          });
          filteredItems = sameBodyVehicles;
          is_fallback = true;
          const bodyLabel = params.body_type.map((b) => b === 'hybrid_ev' ? 'Hybrid/EV' : b.toUpperCase()).join(', ');
          fallback_message = `Showing closest matches and top ${bodyLabel} alternatives nearby`;
        }
      }

      // Strategy 2: If still empty, fall back to top-scoring vehicles in that price tier overall
      if (filteredItems.length === 0) {
        const tierVehicles = allItems.filter((v) => {
          const p = v.target_price;
          if (p < bounds.min) return false;
          if (bounds.max !== null && p > bounds.max) return false;
          return true;
        });
        if (tierVehicles.length > 0) {
          filteredItems = tierVehicles;
          is_fallback = true;
          fallback_message = `Showing top-scoring vehicles in this price bracket`;
        }
      }

      // Strategy 3: Ultimate fallback across the whole catalog
      if (filteredItems.length === 0) {
        filteredItems = [...allItems];
        is_fallback = true;
        fallback_message = `Showing closest matches and top alternatives nearby`;
      }
    }

    // 5. Sort by criteria
    filteredItems.sort((a, b) => {
      switch (params.sort_by) {
        case 'reliability_desc':
          return b.reliability_rating - a.reliability_rating;
        case 'ownership_cost_asc':
          return a.five_year_maintenance_cost - b.five_year_maintenance_cost;
        case 'spread_desc':
          return b.savings_pct - a.savings_pct;
        case 'score_desc':
        default:
          return b.composite_score - a.composite_score;
      }
    });

    const total_count = filteredItems.length;

    // 6. Calculate summary statistics
    const avgSpread = total_count > 0
      ? Number((filteredItems.reduce((acc, curr) => acc + curr.savings_spread, 0) / total_count).toFixed(2))
      : 0;
    const avgPct = total_count > 0
      ? Number((filteredItems.reduce((acc, curr) => acc + curr.savings_pct, 0) / total_count).toFixed(1))
      : 0;
    const avgScore = total_count > 0
      ? Number((filteredItems.reduce((acc, curr) => acc + curr.composite_score, 0) / total_count).toFixed(1))
      : 0;

    // 7. Paginate
    const offset = params.offset !== undefined && !isNaN(params.offset) ? params.offset : 0;
    const limit = params.limit !== undefined && !isNaN(params.limit) ? params.limit : 50;
    const paginatedItems = filteredItems.slice(offset, offset + limit);

    return {
      active_channel: channel,
      total_count,
      price_bracket_applied: {
        tier_slug: params.tier,
        min_price: bounds.min,
        max_price: bounds.max,
      },
      summary_stats: {
        average_savings_spread: avgSpread,
        average_savings_pct: avgPct,
        average_composite_score: avgScore,
      },
      items: paginatedItems,
      is_fallback,
      fallback_message,
    };
  }

  /**
   * Pure in-memory pre-computed summary of price tiers
   */
  static async getTiersSummary(channel: ValuationChannel = 'private_party'): Promise<TierSummaryItem[]> {
    const channelTiers = TIER_DEFINITIONS[channel];
    const results: TierSummaryItem[] = [];

    const allVehicles = VEHICLE_RANKINGS_DATA.map((v) => enrichVehicleRecord(v, channel));

    for (const [slug, def] of Object.entries(channelTiers)) {
      const tierVehicles = allVehicles.filter((v) => {
        const p = v.target_price;
        if (p < def.minPrice) return false;
        if (def.maxPrice !== null && p > def.maxPrice) return false;
        return true;
      });

      // Find top ranked vehicle in tier
      tierVehicles.sort((a, b) => b.composite_score - a.composite_score);
      const top = tierVehicles[0] || null;

      const count = tierVehicles.length;
      const avgSpread = count > 0
        ? Number((tierVehicles.reduce((acc, curr) => acc + curr.savings_spread, 0) / count).toFixed(2))
        : 0;
      const avgPct = count > 0
        ? Number((tierVehicles.reduce((acc, curr) => acc + curr.savings_pct, 0) / count).toFixed(1))
        : 0;

      results.push({
        tier_slug: slug,
        label: def.label,
        min_price: def.minPrice,
        max_price: def.maxPrice,
        vehicle_count: count,
        top_vehicle: top
          ? {
              id: top.id,
              make: top.make,
              model: top.model,
              year_range: `${top.year_start}–${top.year_end}`,
              composite_score: top.composite_score,
              private_party_mid: top.private_party_mid,
              dealer_retail_mid: top.dealer_retail_mid,
            }
          : null,
        average_savings_spread: avgSpread,
        average_savings_pct: avgPct,
      });
    }

    return results;
  }

  /**
   * Pure in-memory lookup for single vehicle detail by ID or slug
   */
  static async getVehicleById(id: string): Promise<SingleVehicleDetailPayload | null> {
    const targetSlug = id.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const raw = VEHICLE_RANKINGS_DATA.find((v) => {
      if (v.id === id) return true;
      const generatedSlug = `${v.make}-${v.model}-${v.year_start}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      return generatedSlug === targetSlug || generatedSlug.includes(targetSlug) || targetSlug.includes(generatedSlug);
    });

    if (!raw) {
      return null;
    }

    const enriched = enrichVehicleRecord(raw, 'private_party');
    const scoreData = calculateCarMatrixScore(enriched);

    const dealerRetail = enriched.dealer_retail_mid;
    const privateParty = enriched.private_party_mid;
    const spread = Math.max(0, Number((dealerRetail - privateParty).toFixed(2)));
    const spreadPct = dealerRetail > 0 ? Number(((spread / dealerRetail) * 100).toFixed(1)) : 0;

    return {
      vehicle: enriched,
      scoring_breakdown: {
        composite_score: enriched.composite_score,
        reliability_score: scoreData.reliability_score,
        ownership_cost_score: scoreData.ownership_cost_score,
        market_spread_score: scoreData.market_spread_score,
        reliability_rating: enriched.reliability_rating,
        five_year_maintenance_cost: enriched.five_year_maintenance_cost,
        depreciation_rate_pct: enriched.depreciation_rate_pct,
      },
      market_comparison: {
        dealer_retail_mid: dealerRetail,
        private_party_mid: privateParty,
        savings_spread: spread,
        savings_pct: spreadPct,
        street_clearing_advantage: `Buying private party saves approximately $${spread.toLocaleString()} (${spreadPct}%) compared to typical dealer retail markups and doc fees.`,
      },
      inspection_alerts: enriched.inspection_alerts || [],
      key_strengths: enriched.key_strengths || [],
      inventory_search_query: {
        make: enriched.make,
        model: enriched.model,
        search_url: `/?tool=valuation-estimator&make=${encodeURIComponent(enriched.make)}&model=${encodeURIComponent(enriched.model)}`,
      },
    };
  }
}
