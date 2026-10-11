import { Dealership } from '../../types/dealerIntel';

export interface EnrichedDealer extends Dealership {
  distance_miles: number;
  active_inventory_count: number;
  market_price_delta: number; // e.g. -780 (below market) or +420 (above market)
  price_delta_label: string;  // e.g. "-$780 Below Market"
  customer_rating_display: number; // e.g. 4.8
  review_count_display: number; // e.g. 142
  is_ev_certified: boolean;
  doc_fee_display: number; // e.g. 150
  addon_risk_level?: 'low' | 'moderate' | 'high';
  finance_risk_level?: 'low' | 'moderate' | 'high';
  composite_grade?: string; // e.g. 'A+', 'A', 'B', 'C'
}

export type ViewMode = 'grid' | 'split';

export type DistanceRadius = 'all' | '10' | '25' | '50';
