import { VehicleRankingItem, ValuationChannel } from '../services/rankingsService';

/**
 * Parameters for building CarMatrix inventory search query
 */
export interface InventorySearchOptions {
  make?: string;
  model?: string;
  year_start?: number;
  year_end?: number;
  max_price?: number;
  channel?: ValuationChannel;
  zip?: string;
  radius?: number;
}

/**
 * Builds standard CarMatrix internal URL bridging a ranked vehicle directly
 * into inventory searches and valuation audits.
 *
 * Example output:
 * `/?tool=valuation-estimator&make=Toyota&model=RAV4&min_year=2014&max_year=2017&max_price=15200&channel=private_party`
 */
export function buildCarMatrixInventoryUrl(
  vehicle: Pick<VehicleRankingItem, 'make' | 'model' | 'year_start' | 'year_end' | 'dealer_retail_mid' | 'private_party_mid'>,
  channel: ValuationChannel = 'private_party',
  options: Partial<InventorySearchOptions> = {}
): string {
  const params = new URLSearchParams();

  const activePrice = channel === 'dealer_retail' 
    ? vehicle.dealer_retail_mid 
    : vehicle.private_party_mid;

  params.set('tool', 'valuation-estimator');
  params.set('make', vehicle.make);
  params.set('model', vehicle.model);
  params.set('min_year', String(options.year_start ?? vehicle.year_start));
  params.set('max_year', String(options.year_end ?? vehicle.year_end));
  params.set('max_price', String(options.max_price ?? activePrice));
  params.set('channel', channel);

  if (options.zip) {
    params.set('zip', options.zip);
  }
  if (options.radius) {
    params.set('radius', String(options.radius));
  }

  return `/?${params.toString()}`;
}

/**
 * Formats a clean public search query for external MarketCheck or dealer inventory proxy
 */
export function buildMarketCheckProxyUrl(
  vehicle: Pick<VehicleRankingItem, 'make' | 'model' | 'year_start' | 'year_end'>,
  zip: string = '75013',
  radius: number = 50
): string {
  const params = new URLSearchParams();
  params.set('make', vehicle.make);
  params.set('model', vehicle.model);
  params.set('year', `${vehicle.year_start}-${vehicle.year_end}`);
  params.set('zip', zip);
  params.set('radius', String(radius));
  params.set('rows', '20');

  return `/api/marketcheck/search?${params.toString()}`;
}
