import type { VercelRequest, VercelResponse } from '@vercel/node';

interface ValuationCacheEntry {
  data: any;
  timestamp: number;
}

const valuationCache = new Map<string, ValuationCacheEntry>();
const CACHE_TTL_MS = 20 * 60 * 1000; // 20 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { year, make, model, mileage: rawMileage, zip, condition = 'good', radius } = req.query;

    if (!year || !make || !model) {
      return res.status(400).json({ error: 'Missing required parameters: year, make, and model are required.' });
    }

    const numericYear = Number(year);
    const numericMileage = rawMileage ? Number(rawMileage) : (2026 - numericYear) * 12500;
    const cleanZip = typeof zip === 'string' && /^\d{5}$/.test(zip.trim()) ? zip.trim() : '';
    const safeRadius = radius ? Math.min(100, Math.max(10, Number(radius))) : 75;
    const condKey = String(condition).toLowerCase();

    // Cache key incorporates quantized mileage (to 2,500 mile buckets)
    const mileageBucket = Math.round(numericMileage / 2500) * 2500;
    const cacheKey = `${numericYear}_${String(make).toLowerCase()}_${String(model).toLowerCase()}_${cleanZip}_${mileageBucket}_${condKey}`;

    const cached = valuationCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return res.status(200).json({ ...cached.data, cached: true });
    }

    const apiKey = process.env.VITE_MARKETCHECK_API_KEY || 'mc_live_bWXACzVN4ZhxDOYsbTHTvK060bcV2Zsx';

    // Helper to query MarketCheck
    async function queryMarketCheck(withZip: boolean) {
      let url = `https://mc-api.marketcheck.com/v2/search/car/active?api_key=${apiKey}&rows=4&stats=price,miles`;
      url += `&year=${numericYear}`;
      url += `&make=${encodeURIComponent(String(make))}`;
      url += `&model=${encodeURIComponent(String(model))}`;
      if (withZip && cleanZip) {
        url += `&zip=${cleanZip}&radius=${safeRadius}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`MarketCheck API responded with ${response.status}: ${errorText}`);
      }
      return await response.json();
    }

    let mcData: any = null;
    let isLocal = false;

    // Try local search first if zip is valid
    if (cleanZip) {
      try {
        const localData = await queryMarketCheck(true);
        if (localData && (localData.stats?.price?.count >= 2 || localData.num_found >= 2)) {
          mcData = localData;
          isLocal = true;
        }
      } catch (localErr) {
        console.warn('Local MarketCheck query failed or restricted, falling back to national:', localErr);
      }
    }

    // Fall back to nationwide if local had insufficient samples
    if (!mcData) {
      mcData = await queryMarketCheck(false);
      isLocal = false;
    }

    const priceStats = mcData?.stats?.price;
    const milesStats = mcData?.stats?.miles;
    const sampleCount = priceStats?.count || mcData?.num_found || 0;

    if (!priceStats || sampleCount === 0 || (!priceStats.median && !priceStats.mean)) {
      return res.status(404).json({
        error: 'No active market listings found for this vehicle configuration.',
        details: { year: numericYear, make, model }
      });
    }

    // Baseline Dealer Retail Price from active listings
    const retailBaseline = priceStats.median || priceStats.mean;

    // Benchmark cohort mileage
    const cohortBenchmarkMiles = milesStats?.median || milesStats?.mean || Math.max(1000, (2026 - numericYear) * 12500);

    // Mileage Adjustment ($0.10/mile variance from cohort average, capped at -25% to +20%)
    const milesDelta = cohortBenchmarkMiles - numericMileage;
    const rawMilesAdjustment = milesDelta * 0.10;
    const maxNegativeAdj = -retailBaseline * 0.25;
    const maxPositiveAdj = retailBaseline * 0.20;
    const milesAdjustment = Math.max(maxNegativeAdj, Math.min(maxPositiveAdj, rawMilesAdjustment));

    // Vehicle condition multipliers
    const conditionMultipliers: Record<string, number> = {
      excellent: 1.05,
      good: 1.00,
      fair: 0.88,
      rough: 0.74,
    };
    const condMult = conditionMultipliers[condKey] || 1.0;

    // Final multi-channel values
    const adjustedRetail = Math.round((retailBaseline + milesAdjustment) * condMult);
    const dealerRetailValue = Math.max(2000, adjustedRetail);
    const privatePartyValue = Math.round(dealerRetailValue * 0.91);
    const tradeInLow = Math.round(dealerRetailValue * 0.77);
    const tradeInHigh = Math.round(dealerRetailValue * 0.83);
    const estimatedMarketValue = privatePartyValue;

    // Dynamic market demand rating based on active DOM (Days On Market)
    const listings = mcData?.listings || [];
    const validDoms = listings.map((l: any) => l.dom).filter((d: any) => typeof d === 'number' && d > 0);
    const avgDom = validDoms.length > 0 
      ? Math.round(validDoms.reduce((acc: number, v: number) => acc + v, 0) / validDoms.length) 
      : 45;

    let demandRating = 'Moderate Demand';
    if (avgDom <= 32 || sampleCount > 500) {
      demandRating = 'High Demand (Fast Turn)';
    } else if (avgDom >= 65) {
      demandRating = 'High Inventory (Buyer Advantage)';
    }

    // Clean comparable listings for transparency
    const comps = listings.slice(0, 3).map((l: any) => ({
      id: l.id,
      vin: l.vin,
      heading: l.heading,
      price: l.price,
      miles: l.miles,
      dom: l.dom,
      dealerName: l.dealer?.name || 'Authorized Dealer',
      city: l.dealer?.city || '',
      state: l.dealer?.state || '',
      distance: typeof l.dist === 'number' ? Math.round(l.dist) : null,
      photo: l.media?.photo_links?.[0] || null,
      vdpUrl: l.vdp_url || null,
    }));

    const result = {
      success: true,
      source: 'marketcheck_live',
      isLocal,
      radiusMiles: isLocal ? safeRadius : null,
      sampleCount,
      cohortBenchmarkMiles: Math.round(cohortBenchmarkMiles),
      userMileage: numericMileage,
      mileageAdjustment: Math.round(milesAdjustment),
      condition: condKey,
      conditionMultiplier: condMult,
      estimatedMarketValue,
      tradeInLow,
      tradeInHigh,
      privatePartyValue,
      dealerRetailValue,
      spreadVsTradeIn: privatePartyValue - tradeInHigh,
      demandRating,
      avgDaysOnMarket: avgDom,
      marketStats: {
        retailMedian: Math.round(priceStats.median || priceStats.mean),
        minPrice: priceStats.min,
        maxPrice: priceStats.max,
        p25: Math.round(priceStats.percentiles?.['25.0'] || priceStats.median * 0.9),
        p75: Math.round(priceStats.percentiles?.['75.0'] || priceStats.median * 1.1),
      },
      comps,
      cached: false,
      timestamp: new Date().toISOString(),
    };

    valuationCache.set(cacheKey, { data: result, timestamp: Date.now() });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Valuation Handler Error:', error);
    return res.status(500).json({
      error: 'Failed to calculate live valuation from market data',
      message: error.message || String(error)
    });
  }
}
