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
    const { vin, make, model, year, state } = req.query;
    let apiKey = process.env.VITE_MARKETCHECK_API_KEY || 'mc_live_bWXACzVN4ZhxDOYsbTHTvK060bcV2Zsx';
    
    const buildUrl = (key: string) => {
      let url = `https://mc-api.marketcheck.com/v2/predict/car/costs?api_key=${key}`;
      if (vin) url += `&vin=${encodeURIComponent(vin as string)}`;
      if (make) url += `&make=${encodeURIComponent(make as string)}`;
      if (model) url += `&model=${encodeURIComponent(model as string)}`;
      if (year) url += `&year=${encodeURIComponent(year as string)}`;
      if (state) url += `&state=${encodeURIComponent(state as string)}`;
      return url;
    };

    let response = await fetch(buildUrl(apiKey));
    
    if (!response.ok && process.env.VITE_MARKETCHECK_API_KEY) {
      response = await fetch(buildUrl('mc_live_bWXACzVN4ZhxDOYsbTHTvK060bcV2Zsx'));
    }

    if (!response.ok) {
      throw new Error(`MarketCheck Predict API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Predict Proxy Error:', error);
    return res.status(500).json({ error: 'Failed to fetch TCO from MarketCheck', details: String(error) });
  }
}
