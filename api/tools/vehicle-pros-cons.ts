import type { VercelRequest, VercelResponse } from '@vercel/node';
import { auditVehicleProsCons } from '../../src/services/vehicleProsConsService';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { vehicleQuery } = req.body || {};

    if (!vehicleQuery || typeof vehicleQuery !== 'string' || vehicleQuery.trim().length < 3) {
      return res.status(400).json({ error: 'Valid vehicle year, make, and model required.' });
    }

    const auditData = await auditVehicleProsCons(vehicleQuery.trim());
    return res.status(200).json({ data: auditData });
  } catch (error) {
    console.error('CarMatrix Vehicle Pros & Cons API Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve vehicle audit. Please try again.' });
  }
}
