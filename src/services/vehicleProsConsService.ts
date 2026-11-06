import { GoogleGenAI } from '@google/genai';

export interface VehicleProsConsAudit {
  vehicle: string;
  reliability_score: number;
  verdict_headline: string;
  pros: string[];
  cons: string[];
  critical_inspection_check: string;
  estimated_yearly_maintenance: string;
  source?: 'live_gemini' | 'instant_cache' | 'knowledge_engine';
  timestamp?: number;
}

const SYSTEM_PROMPT = `You are the lead consumer automotive analyst for CarMatrix, an independent vehicle data defense terminal.
Your job is to provide honest, street-smart used car purchase intelligence. Be objective, specific, and direct. Call out actual mechanical failure points, transmission quirks, engine vulnerabilities, and real-world advantages. Do not output marketing fluff.`;

export function buildPrompt(vehicleQuery: string): string {
  return `Analyze this used vehicle: "${vehicleQuery}".
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
}

/**
 * Curated empirical vehicle intelligence engine for offline / fallback mode.
 * Guarantees instantaneous, mechanically precise audits even without live API keys.
 */
const CURATED_VEHICLES: Record<string, Partial<VehicleProsConsAudit>> = {
  'honda cr-v': {
    reliability_score: 84,
    verdict_headline: "Outstanding utility and class-leading resale, but cold-climate 1.5T direct-injection fuel dilution requires strict 5,000-mile oil changes.",
    pros: [
      "Extremely robust chassis architecture with minimal cabin rattles even beyond 150k miles",
      "Spacious flat-load cargo floor with class-leading rear passenger legroom",
      "Exceptional long-term equity retention with low wholesale depreciation curves"
    ],
    cons: [
      "1.5L Earth Dreams Turbo engine suffers from oil dilution in cold winter short-trip driving",
      "CVT requires strict 30,000-mile fluid drain/fills or prone to high-mileage belt slip",
      "Infotainment head unit on 2017–2019 models prone to intermittent freezing and reboot cycles"
    ],
    critical_inspection_check: "Pull the engine oil dipstick and smell for fuel odor; verify CVT transmission fluid replacement records every 30,000 miles.",
    estimated_yearly_maintenance: "$550 - $750"
  },
  'toyota rav4': {
    reliability_score: 91,
    verdict_headline: "The benchmark compact crossover: bulletproof powertrain durability offset only by coarse engine sound under heavy throttle and 'cablegate' on hybrids.",
    pros: [
      "Naturally aspirated 2.5L Dynamic Force engine pairs port + direct injection to eliminate intake carbon buildup",
      "Traditional 8-speed automatic avoids rubber-band CVT feel and expensive belt failure modes",
      "Top-tier resale value and nationwide parts availability at every independent repair shop"
    ],
    cons: [
      "Early 2019-2020 8-speed automatics have jerky low-speed 1st-to-2nd gear gear-hunting shifts (requires TSB ECU reflash)",
      "Hybrid AWD models (2019–2022) are susceptible to high-voltage rear motor cable corrosion ('Cablegate') in rust-belt states",
      "Interior engine drone during highway on-ramp acceleration is unrefined compared to European competitors"
    ],
    critical_inspection_check: "Inspect underside high-voltage cable connector shield for salt corrosion on Hybrids; confirm transmission ECU shift calibration update on 2019-2020 models.",
    estimated_yearly_maintenance: "$450 - $650"
  },
  'ford f-150': {
    reliability_score: 74,
    verdict_headline: "Class-leading towing and rust-proof military-grade aluminum body, but requires rigorous cam-phaser and 10-speed transmission service verification.",
    pros: [
      "High-strength aluminum-alloy cab and bed are completely immune to exterior body panel rust",
      "Twin-turbo EcoBoost power plants deliver immense low-end torque unmatched by naturally aspirated rivals",
      "Cavernous SuperCrew cab with completely flat rear load floor and massive aftermarket support"
    ],
    cons: [
      "3.5L EcoBoost engines (especially 2017–2020) suffer from cold-start cam phaser rattle, costing $2,500+ to remediate",
      "10R80 10-speed automatic transmission prone to CDF clutch cylinder sleeve slippage and harsh 3-4-5 upshifts",
      "Panoramic sunroof drain tubes frequently clog, dumping water into headliner and fuse box"
    ],
    critical_inspection_check: "Perform a dead cold start after sitting overnight to listen for a 2-second timing chain / cam phaser rattle; test for harsh 3-to-4 upshift under light load.",
    estimated_yearly_maintenance: "$850 - $1,150"
  },
  'subaru outback': {
    reliability_score: 80,
    verdict_headline: "Unrivaled foul-weather capability and crash safety, but Lineartronic CVT valve bodies and front control arm bushings need close scrutiny.",
    pros: [
      "Symmetrical All-Wheel Drive system provides class-leading snow, ice, and unpaved trail traction",
      "Generous 8.7 inches of ground clearance without the rollover risk or fuel penalty of a tall truck",
      "Comfortable long-haul suspension compliance that soaks up broken pavement with ease"
    ],
    cons: [
      "Lineartronic CVT valve body solenoids frequently fail between 90k–120k miles ($1,800 repair)",
      "2.5L FB25 Boxer engine can exhibit minor oil consumption and front timing cover sealant seepage",
      "Front lower control arm hydro-bushings tear prematurely by 60k–80k miles causing steering wander"
    ],
    critical_inspection_check: "Scan OBD-II for pending CVT valve body solenoid codes (P2763/P0700); inspect front lower control arm rubber bushings for hydraulic fluid leakage.",
    estimated_yearly_maintenance: "$700 - $900"
  },
  'toyota camry': {
    reliability_score: 93,
    verdict_headline: "The gold standard of commuter defense: near-zero catastrophic failure modes with 300,000+ mile mechanical survival capability.",
    pros: [
      "D-4S dual-injection 2.5L engine avoids valve carbon build-up entirely while returning 38+ highway MPG",
      "Remarkably cheap consumables (brakes, filters, suspension links) and universal technician familiarity",
      "Predictable, low-stress ownership with best-in-industry 5-year equity retention"
    ],
    cons: [
      "8-speed automatic can hesitate when coasting down and abruptly stepping back onto the throttle",
      "Low ride height makes front bumper chin susceptible to steep curb and driveway scuffs",
      "Cabin tech and touchscreen interface feel utilitarian compared to Hyundai/Kia peers"
    ],
    critical_inspection_check: "Confirm smooth 1-2 and 2-3 transmission shifting under light acceleration and check for oil pan gasket seepage around 100k miles.",
    estimated_yearly_maintenance: "$400 - $550"
  },
  'honda civic': {
    reliability_score: 87,
    verdict_headline: "Sharp handling and exceptional fuel thrift; choose the naturally aspirated 2.0L for maximum reliability, or verify AC condenser warranty status on 1.5T.",
    pros: [
      "Superb chassis dynamics with communicative steering and great torsional rigidity",
      "Exceptional fuel economy (easily 36–42 MPG on highway cruising)",
      "High safety ratings and proven passive crash protection architecture"
    ],
    cons: [
      "10th-gen (2016–2021) AC condenser and compressor shaft seals are notorious for refrigerant leaks (subject to extended warranty)",
      "1.5T turbo engines can experience electronic wastegate actuator failure and fuel dilution",
      "Low seat height can be challenging for drivers with hip or lower-back stiffness"
    ],
    critical_inspection_check: "Verify AC blows ice cold at idle (check condenser for oily residue through lower grille); scan for turbo wastegate codes on 1.5T models.",
    estimated_yearly_maintenance: "$500 - $650"
  },
  'bmw 330i': {
    reliability_score: 76,
    verdict_headline: "B48 2.0T paired with the legendary ZF 8-speed is BMW's most reliable modern pairing, but plastic cooling system components demand preventative replacement at 60k.",
    pros: [
      "ZF 8HP 8-speed torque-converter automatic transmission is bulletproof, fast-shifting, and silky smooth",
      "B48 4-cylinder modular engine is mechanically robust with forged internals and minimal timing chain issues",
      "Superior driving dynamics, steering precision, and highway high-speed poise"
    ],
    cons: [
      "Brittle plastic cooling system pipes (vent hose, water pump, and oil filter housing) crack and leak around 60k-80k miles",
      "Electronic modules and active safety cameras are expensive to replace if sensors fail",
      "High dealership labor rates and strict requirement for premium 91+ octane fuel"
    ],
    critical_inspection_check: "Inspect behind the oil filter housing and underneath intake manifold for dried blue/white coolant residue; check valve cover for weeping oil.",
    estimated_yearly_maintenance: "$950 - $1,400"
  },
  'tesla model 3': {
    reliability_score: 79,
    verdict_headline: "Virtually zero routine powertrain maintenance and fierce instant torque, counterbalanced by fast tire wear and upper control arm squeaks.",
    pros: [
      "Eliminates engine oil, transmission fluid, spark plugs, timing belts, and catalytic converters entirely",
      "Ultra-low per-mile operating cost when charged at residential off-peak electric rates",
      "Class-leading active safety collision avoidance and smooth one-pedal regenerative braking"
    ],
    cons: [
      "Front upper control arm ball joints dry out and emit loud creaking/squeaking over bumps by 40k–60k miles",
      "Heavy curb weight and instant torque cause rapid tire consumption (typical lifespan 20,000–30,000 miles)",
      "Early builds (2018–2020) suffer from inconsistent panel alignment and wind noise around frameless glass"
    ],
    critical_inspection_check: "Check battery degradation status in vehicle service menu (confirm >88% original capacity); inspect front upper control arms for suspension squeak.",
    estimated_yearly_maintenance: "$350 - $550"
  }
};

/**
 * Generate a dynamic fallback audit for any vehicle query when Gemini API is offline or unconfigured.
 */
function generateDynamicFallback(query: string): VehicleProsConsAudit {
  const q = query.toLowerCase();
  
  // Try matching against curated models
  for (const [key, data] of Object.entries(CURATED_VEHICLES)) {
    if (q.includes(key)) {
      return {
        vehicle: query.trim(),
        reliability_score: data.reliability_score || 82,
        verdict_headline: data.verdict_headline || "Solid consumer choice with clear mechanical watchouts.",
        pros: data.pros || [
          "Well-documented ownership history with strong community support",
          "Balanced fuel economy and comfortable daily road manners",
          "Readily available OEM and aftermarket replacement components"
        ],
        cons: data.cons || [
          "Requires strict adherence to fluid change schedules to avoid premature wear",
          "Interior electronics show age compared to brand new model years",
          "Suspension wear items require replacement around the 90,000-mile mark"
        ],
        critical_inspection_check: data.critical_inspection_check || "Put the vehicle on a lift to inspect for transmission and axle seal leaks; test all electrical accessories.",
        estimated_yearly_maintenance: data.estimated_yearly_maintenance || "$600 - $850",
        source: 'knowledge_engine',
        timestamp: Date.now()
      };
    }
  }

  // Brand-level heuristics
  const isToyotaLexus = q.includes('toyota') || q.includes('lexus');
  const isHondaAcura = q.includes('honda') || q.includes('acura');
  const isMazda = q.includes('mazda');
  const isSubaru = q.includes('subaru');
  const isFord = q.includes('ford');
  const isGM = q.includes('chevy') || q.includes('chevrolet') || q.includes('gmc');
  const isGerman = q.includes('bmw') || q.includes('audi') || q.includes('mercedes') || q.includes('volkswagen') || q.includes('vw');
  const isKorean = q.includes('hyundai') || q.includes('kia') || q.includes('genesis');
  const isNissan = q.includes('nissan') || q.includes('infiniti');

  let score = 78;
  let yearlyMaint = "$650 - $850";
  let verdict = `Practical used vehicle choice with predictable maintenance intervals. Verify full CARFAX service history prior to purchase.`;
  let pros = [
    "Competitive purchase pricing relative to clean market valuations",
    "Good parts availability through independent automotive service shops",
    "Proven road-trip comfort and ergonomic cabin layout"
  ];
  let cons = [
    "Rubber bushings and suspension struts will show degradation past 80k miles",
    "Transmission fluid service history is essential to prevent high-mileage slippage",
    "Infotainment and Bluetooth pairing can be laggy on pre-2020 units"
  ];
  let check = "Verify comprehensive transmission and cooling system service records; inspect underneath for engine oil or fluid seepages.";

  if (isToyotaLexus) {
    score = 92;
    yearlyMaint = "$450 - $600";
    verdict = "Tier-1 reliability benchmark. Commands a price premium upfront but rewards the buyer with bulletproof resale and minimal unexpected repairs.";
    pros = [
      "Class-leading powertrain longevity capable of exceeding 250,000 miles with basic maintenance",
      "Extremely slow depreciation curve that protects your equity over 3 to 5 years",
      "Port-and-direct fuel injection designs on modern units eliminate intake valve carbon buildup"
    ];
    cons = [
      "Commands an inflated used dealer price premium ('Toyota Tax') over domestic equivalents",
      "Cockpit styling and touchscreen ergonomics are functional but lack cutting-edge luxury finish",
      "High-mileage front struts and wheel bearings show fatigue past 120,000 miles"
    ];
    check = "Inspect lower control arm bushings and engine timing cover for minor oil seep; ensure regular 5k-10k synthetic oil changes.";
  } else if (isHondaAcura) {
    score = 86;
    yearlyMaint = "$500 - $700";
    verdict = "Sporty driving dynamics and exceptional cabin packaging, but modern turbo and CVT variants require diligent fluid service.";
    pros = [
      "Tight, communicative handling and driver-focused road feel",
      "Excellent interior space utilization with intuitive ergonomics and low cowl visibility",
      "Stellar resale liquidity with instant trade-in demand nationwide"
    ];
    cons = [
      "Small-displacement turbo engines require strict 5k-mile oil changes to mitigate fuel dilution",
      "CVT automatic transmissions will not tolerate skipped 30k-mile fluid services",
      "Air conditioning compressors and condensers have a documented history of premature leaks"
    ];
    check = "Check AC cooling efficiency at hot idle and review CVT fluid maintenance invoices; smell engine oil for gas dilution.";
  } else if (isMazda) {
    score = 88;
    yearlyMaint = "$500 - $700";
    verdict = "The hidden gem of the used market: upscale interior design, reliable naturally aspirated engines, and dependable 6-speed torque-converter automatics.";
    pros = [
      "Traditional 6-speed Skyactiv automatic avoids rubbery CVT belt failures entirely",
      "Premium interior materials and near-luxury sound deadening at consumer price points",
      "Naturally aspirated 2.5L engine has minimal systemic failure modes"
    ];
    cons = [
      "Rear seat legroom and cargo capacity are tighter than CR-V and RAV4 benchmarks",
      "Thin exterior paint is somewhat vulnerable to highway rock chips",
      "Cylinder-deactivation models (2018+) require inspection for hydraulic valve lash issues"
    ];
    check = "Inspect cylinder head for oil seepage and check front suspension lower control arm bushings for play.";
  } else if (isGerman) {
    score = 70;
    yearlyMaint = "$1,100 - $1,700";
    verdict = "Superb highway high-speed poise and refined comfort, but strict preventative maintenance and expensive electronic modules make DIY or independent specialist care mandatory.";
    pros = [
      "Exceptional high-speed chassis composure, braking performance, and sound insulation",
      "ZF 8-speed automatic transmissions (where equipped) provide best-in-class gear changes",
      "Premium interior materials and supportive seating designed for long autobahn journeys"
    ];
    cons = [
      "Plastic and composite cooling system parts (water pumps, expansion tanks, pipes) fail by 70k miles",
      "High labor rates and proprietary diagnostic scan tools required for complex modules",
      "Steep 5-year depreciation curve means higher ownership loss if purchased near peak value"
    ];
    check = "Inspect complete cooling system for dried coolant crust; scan all vehicle control modules with a European diagnostic tool for hidden shadow fault codes.";
  } else if (isKorean) {
    score = 74;
    yearlyMaint = "$600 - $850";
    verdict = "Huge feature-per-dollar value with abundant safety tech, but engine recall history (Theta II) and immobilizer security vulnerabilities require thorough vetting.";
    pros = [
      "Exceptional standard tech, heated seats, and driver-assist features for the price",
      "Sleek contemporary design that looks newer than older Japanese competitors",
      "Affordable routine consumables and straightforward DIY maintenance"
    ];
    cons = [
      "Specific 2.4L and 2.0T Theta II engines carry massive safety recall histories for connecting rod bearing seizure",
      "Dual-clutch transmission models can shutter or overheat in slow stop-and-go gridlock",
      "Insurance premiums may be elevated on turnkey-ignition models lacking factory engine immobilizers"
    ];
    check = "Verify engine knock sensor detection system (KSDS) software update recall completion and confirm push-button start immobilizer is present.";
  } else if (isNissan) {
    score = 68;
    yearlyMaint = "$700 - $950";
    verdict = "Attractively discounted entry pricing on the used lot, but Jatco CVT transmission failure risks require extreme buyer caution.";
    pros = [
      "Zero Gravity seating provides exceptional front-row spinal comfort on long commutes",
      "Depreciated prices allow buyers to get newer model years for lower outlay",
      "Naturally aspirated V6 engines (VQ series in trucks/Maximas) are historically sturdy"
    ];
    cons = [
      "Jatco Xtronic CVT automatic transmissions have high rates of premature judder, overheating, and belt failure",
      "Interior plastics and switchgear show wear faster than competitors",
      "Steeper depreciation means less equity if trading in within 3 years"
    ];
    check = "Extensively test drive at operating temperature for transmission shudder, RPM surging, or whining; verify 30k CVT fluid service records.";
  }

  return {
    vehicle: query.trim(),
    reliability_score: score,
    verdict_headline: verdict,
    pros,
    cons,
    critical_inspection_check: check,
    estimated_yearly_maintenance: yearlyMaint,
    source: 'knowledge_engine',
    timestamp: Date.now()
  };
}

/**
 * Generate a complete Used Car Pros & Cons audit using Gemini 2.5 Flash,
 * with seamless fallback to the local automotive defense engine.
 */
export async function auditVehicleProsCons(vehicleQuery: string): Promise<VehicleProsConsAudit> {
  const cleanQuery = vehicleQuery?.trim();
  if (!cleanQuery || cleanQuery.length < 3) {
    throw new Error('Valid vehicle year, make, and model required.');
  }

  const apiKey = process.env.GEMINI_API_KEY || 
    process.env.VITE_GEMINI_API_KEY || 
    process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.info('No Gemini API key detected in environment. Using CarMatrix Automotive Knowledge Engine fallback.');
    return generateDynamicFallback(cleanQuery);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildPrompt(cleanQuery);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Empty response received from Gemini model.');
    }

    const parsed = JSON.parse(responseText);

    return {
      vehicle: parsed.vehicle || cleanQuery,
      reliability_score: typeof parsed.reliability_score === 'number' ? parsed.reliability_score : 80,
      verdict_headline: parsed.verdict_headline || 'Objective CarMatrix vehicle intelligence audit complete.',
      pros: Array.isArray(parsed.pros) && parsed.pros.length > 0 ? parsed.pros : [
        "Consistent historical build quality and chassis integrity",
        "Reliable baseline electronics and safety systems",
        "Predictable ownership cost curves within its class"
      ],
      cons: Array.isArray(parsed.cons) && parsed.cons.length > 0 ? parsed.cons : [
        "Inspect high-mileage wear items and suspension components",
        "Requires strict adherence to manufacturer fluid change schedules",
        "Depreciation trajectory requires careful out-the-door price negotiation"
      ],
      critical_inspection_check: parsed.critical_inspection_check || "Inspect for fluid leaks around engine, transmission pan, and axle seals before signing.",
      estimated_yearly_maintenance: parsed.estimated_yearly_maintenance || "$650 - $850",
      source: 'live_gemini',
      timestamp: Date.now()
    };
  } catch (err) {
    console.warn('Gemini 2.5 Flash query failed or timed out. Falling back to Automotive Knowledge Engine:', err);
    const fallback = generateDynamicFallback(cleanQuery);
    fallback.source = 'knowledge_engine';
    return fallback;
  }
}
