import type { VercelRequest, VercelResponse } from '@vercel/node';

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
    const { make, model, year, query, rows, zip, radius } = req.query;
    let apiKey = process.env.VITE_MARKETCHECK_API_KEY || 'mc_live_bWXACzVN4ZhxDOYsbTHTvK060bcV2Zsx';
    const safeRadius = radius ? Math.min(100, Math.max(1, Number(radius))) : undefined;
    
    const buildUrl = (key: string) => {
      let url = `https://mc-api.marketcheck.com/v2/search/car/active?api_key=${key}`;
      if (rows) url += `&rows=${rows}`;
      if (make) url += `&make=${encodeURIComponent(make as string)}`;
      if (model) url += `&model=${encodeURIComponent(model as string)}`;
      if (year) url += `&year=${encodeURIComponent(year as string)}`;
      if (zip) url += `&zip=${encodeURIComponent(zip as string)}`;
      if (safeRadius) url += `&radius=${safeRadius}`;
      return url;
    };

    let response = await fetch(buildUrl(apiKey));
    
    // If unauthorized, fallback to the default key
    if (!response.ok && process.env.VITE_MARKETCHECK_API_KEY) {
      console.warn(`Configured API key returned ${response.status}, falling back to default key.`);
      response = await fetch(buildUrl('mc_live_bWXACzVN4ZhxDOYsbTHTvK060bcV2Zsx'));
    }

    if (!response.ok) {
      console.error(`MarketCheck API Error Details: status=${response.status}, text=${await response.text()}`);
      throw new Error(`MarketCheck API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch from MarketCheck', details: String(error) });
  }
}
