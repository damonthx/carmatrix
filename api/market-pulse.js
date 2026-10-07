// /api/market-pulse.js
// Vercel serverless function — pulls BLS CPI series and returns
// month-over-month + year-over-year changes with 12-month sparkline data.
//
// Setup:
//   1. Get a free key: https://data.bls.gov/registrationEngine/
//   2. In Vercel: Settings → Environment Variables → BLS_API_KEY
//
// Data source: U.S. Bureau of Labor Statistics (public domain).
// CPI releases monthly (~mid-month), so responses are edge-cached 12h.

const SERIES = [
  { id: 'CUSR0000SETA02', key: 'usedCars', label: 'Used cars & trucks' },
  { id: 'CUSR0000SETA01', key: 'newVehicles', label: 'New vehicles' },
  { id: 'CUUR0000SETD', key: 'repairs', label: 'Maintenance & repair' },
  { id: 'CUUR0000SETE', key: 'insurance', label: 'Vehicle insurance' },
];

const BLS_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

const FALLBACK_DATA = {
  source: 'U.S. Bureau of Labor Statistics (Archive Fallback)',
  fetchedAt: new Date().toISOString(),
  metrics: [
    {
      key: 'usedCars',
      label: 'Used cars & trucks',
      asOf: 'May 2026',
      index: 180.0,
      mom: 0.1,
      yoy: -2.0,
      sparkline: [182.8, 183.7, 185.3, 184.9, 186.1, 186.3, 184.7, 181.3, 180.6, 179.8, 179.8, 180.0]
    },
    {
      key: 'newVehicles',
      label: 'New vehicles',
      asOf: 'May 2026',
      index: 178.7,
      mom: -0.3,
      yoy: 0.2,
      sparkline: [177.8, 177.8, 178.2, 178.5, 178.6, 178.9, 178.9, 179.2, 179.3, 179.5, 179.2, 178.7]
    },
    {
      key: 'repairs',
      label: 'Maintenance & repair',
      asOf: 'May 2026',
      index: 452.4,
      mom: 0.8,
      yoy: 6.1,
      sparkline: [427.3, 431.6, 442.0, 442.8, 443.5, 445.3, 439.8, 440.2, 444.1, 449.7, 448.8, 452.4]
    },
    {
      key: 'insurance',
      label: 'Vehicle insurance',
      asOf: 'May 2026',
      index: 877.3,
      mom: -1.9,
      yoy: -2.0,
      sparkline: [895.3, 895.3, 896.0, 894.1, 890.5, 891.0, 892.9, 892.5, 897.4, 897.1, 894.3, 877.3]
    }
  ]
};

export default async function handler(req, res) {
  try {
    const now = new Date();
    const body = {
      seriesid: SERIES.map((s) => s.id),
      startyear: String(now.getFullYear() - 2),
      endyear: String(now.getFullYear()),
    };
    if (process.env.BLS_API_KEY && process.env.BLS_API_KEY !== 'your_actual_key_here') {
      body.registrationkey = process.env.BLS_API_KEY;
    }

    const blsRes = await fetch(BLS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!blsRes.ok) throw new Error(`BLS responded ${blsRes.status}`);

    const json = await blsRes.json();
    if (json.status !== 'REQUEST_SUCCEEDED') {
      throw new Error(`BLS error: ${(json.message || []).join('; ')}`);
    }

    const metrics = json.Results.series.map((series) => {
      const meta = SERIES.find((s) => s.id === series.seriesID);

      // Monthly observations only (period M01–M12; M13 = annual average),
      // sorted newest-first by BLS — normalize to oldest-first.
      const points = series.data
        .filter((d) => d.period !== 'M13' && d.value !== '-')
        .map((d) => ({
          year: Number(d.year),
          month: Number(d.period.slice(1)),
          value: Number(d.value),
          periodName: d.periodName,
        }))
        .filter((p) => !isNaN(p.value))
        .sort((a, b) => a.year - b.year || a.month - b.month);

      const latest = points[points.length - 1];
      const prev = points[points.length - 2];
      const yearAgo = points.find(
        (p) => p.year === latest.year - 1 && p.month === latest.month
      );

      const pct = (a, b) => (b ? ((a / b - 1) * 100) : null);

      return {
        key: meta.key,
        label: meta.label,
        asOf: `${latest.periodName} ${latest.year}`,
        index: latest.value,
        mom: round(pct(latest.value, prev?.value)),
        yoy: round(pct(latest.value, yearAgo?.value)),
        sparkline: points.slice(-12).map((p) => p.value),
      };
    });

    const isForce = req.query && (req.query.force === 'true' || req.query.refresh === 'true' || req.query.refresh === '1');

    if (isForce) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else {
      // Set a 12-hour edge refresh time (43200 seconds)
      res.setHeader(
        'Cache-Control',
        's-maxage=43200, stale-while-revalidate=3600'
      );
    }

    res.status(200).json({
      source: 'U.S. Bureau of Labor Statistics, Consumer Price Index',
      fetchedAt: new Date().toISOString(),
      nextRelease: 'October 14, 2026 (8:30 AM ET)',
      metrics,
    });
  } catch (err) {
    console.warn('BLS API fetch failed, serving fallback data:', err.message);
    res.setHeader(
      'Cache-Control',
      'public, max-age=60'
    );
    res.status(200).json(FALLBACK_DATA);
  }
}

function round(n) {
  return n == null ? null : Math.round(n * 10) / 10;
}
