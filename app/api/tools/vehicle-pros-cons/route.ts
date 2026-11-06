import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { auditVehicleProsCons } from '@/services/vehicleProsConsService';

const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const vehicleQuery = body?.vehicleQuery;

    if (!vehicleQuery || typeof vehicleQuery !== 'string' || vehicleQuery.trim().length < 3) {
      return NextResponse.json({ error: 'Valid vehicle year, make, and model required.' }, { status: 400 });
    }

    if (!apiKey) {
      const fallback = await auditVehicleProsCons(vehicleQuery);
      return NextResponse.json({ data: fallback });
    }

    const systemPrompt = `You are the lead consumer automotive analyst for CarMatrix, an independent vehicle data defense terminal.
Your job is to provide honest, street-smart used car purchase intelligence. Be objective, specific, and direct. Call out actual mechanical failure points, transmission quirks, engine vulnerabilities, and real-world advantages. Do not output marketing fluff.`;

    const prompt = `Analyze this used vehicle: "${vehicleQuery}".
Return strict JSON with this exact schema:
{
  "vehicle": "Full Year Make Model Trim",
  "reliability_score": 82, // integer out of 100 based on consumer history
  "verdict_headline": "Punchy 1-sentence bottom line",
  "pros": [
    "Concrete, specific mechanical or practical advantage 1",
    "Concrete, specific advantage 2",
    "Concrete, specific advantage 3"
  ],
  "cons": [
    "Specific known mechanical flaw, recall trend, or cost pitfall 1",
    "Specific flaw or quirk 2",
    "Specific flaw or quirk 3"
  ],
  "critical_inspection_check": "The #1 specific mechanical item the buyer MUST inspect before buying (e.g. CVT fluid service records, timing chain rattle, turbo coolant lines).",
  "estimated_yearly_maintenance": "$650 - $850"
}`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    return NextResponse.json({ data: parsedData });
  } catch (error) {
    console.error('CarMatrix AI Auditor Error:', error);
    try {
      const fallback = await auditVehicleProsCons(vehicleQuery);
      return NextResponse.json({ data: fallback });
    } catch {
      return NextResponse.json({ error: 'Failed to retrieve vehicle audit. Please try again.' }, { status: 500 });
    }
  }
}
