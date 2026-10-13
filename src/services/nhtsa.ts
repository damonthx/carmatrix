export interface NHTSAMake {
  Make_ID: number;
  Make_Name: string;
}

export interface NHTSAModel {
  Model_ID: number;
  Model_Name: string;
}

const POPULAR_MAKES = [
  'Acura', 'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Buick', 
  'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ferrari', 'Fiat', 'Ford', 
  'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 
  'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lucid', 'Maserati', 'Mazda', 
  'McLaren', 'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Polestar', 
  'Porsche', 'Ram', 'Rivian', 'Rolls-Royce', 'Subaru', 'Tesla', 'Toyota', 
  'Volkswagen', 'Volvo'
];

export async function getMakes(): Promise<string[]> {
  // NHTSA's getAllMakes endpoint returns over 10,000 makes including obscure trailers.
  // We return a curated list of popular consumer vehicle makes for UX.
  return POPULAR_MAKES;
}

export async function getModelsForMake(make: string): Promise<string[]> {
  try {
    const response = await fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformake/${encodeURIComponent(make)}?format=json`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (data && data.Results) {
      return Array.from(new Set<string>(
        data.Results
          .map((m: NHTSAModel) => m.Model_Name.trim())
          .filter(Boolean)
      )).sort((a, b) => a.localeCompare(b));
    }
    return [];
  } catch (error) {
    console.error(`Failed to fetch NHTSA models for make ${make}:`, error);
    return [];
  }
}

export async function getModelsForMakeYear(make: string, year?: number): Promise<string[]> {
  if (!make) return [];
  if (!year) return getModelsForMake(make);

  try {
    const response = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/getmodelsformakeyear/make/${encodeURIComponent(make)}/modelyear/${year}?format=json`
    );
    if (!response.ok) return getModelsForMake(make);

    const data = await response.json();
    if (data && data.Results && data.Results.length > 0) {
      return Array.from(new Set<string>(
        data.Results
          .map((m: NHTSAModel) => m.Model_Name.trim())
          .filter(Boolean)
      )).sort((a, b) => a.localeCompare(b));
    }
    // Fall back to general models for make if year-specific query has no results
    return getModelsForMake(make);
  } catch (error) {
    console.error(`Failed to fetch NHTSA models for make ${make} and year ${year}:`, error);
    return getModelsForMake(make);
  }
}

// =========================================================================
// NHTSA OWNER COMPLAINTS & SAFETY RECALLS API TYPES & FUNCTIONS
// =========================================================================

export interface NHTSAComplaintItem {
  odiNumber: number | string;
  manufacturer?: string;
  crash?: boolean;
  fire?: boolean;
  numberOfInjuries?: number;
  numberOfDeaths?: number;
  dateOfIncident?: string;
  dateComplaintFiled?: string;
  vin?: string;
  components?: string;
  summary: string;
}

export interface NHTSARecallItem {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Consequence?: string;
  Remedy?: string;
  Notes?: string;
  ReportReceivedDate?: string;
  Manufacturer?: string;
}

export interface NHTSAVinDecodedVehicle {
  vin: string;
  make: string;
  model: string;
  year: string;
  trim?: string;
  bodyClass?: string;
  engineCylinders?: string;
  displacementL?: string;
  driveType?: string;
  fuelType?: string;
  plantCountry?: string;
  vehicleType?: string;
}

export interface ComplaintCategoryGroup {
  category: string;
  normalizedCategory: string;
  count: number;
  percentage: number;
  recentComplaints: NHTSAComplaintItem[];
  commonSymptoms: string[];
}

export interface InspectionRecommendation {
  id: string;
  category: string;
  component: string;
  severity: 'critical' | 'caution' | 'routine';
  reason: string;
  checklistAction: string;
}

export interface ReliabilityReport {
  year: number;
  make: string;
  model: string;
  retrievedAt: string;
  totalComplaints: number;
  totalRecalls: number;
  crashesReported: number;
  firesReported: number;
  injuriesReported: number;
  mostReportedCategory: string | null;
  categories: ComplaintCategoryGroup[];
  recalls: NHTSARecallItem[];
  inspectionRecommendations: InspectionRecommendation[];
  hasInsufficientData: boolean;
}

// Simple in-memory cache to prevent duplicate external requests during a session
const complaintsCache = new Map<string, { data: NHTSAComplaintItem[]; timestamp: number }>();
const recallsCache = new Map<string, { data: NHTSARecallItem[]; timestamp: number }>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Fetch owner complaints for a vehicle make, model, and year from NHTSA.
 */
export async function getComplaintsByVehicle(
  make: string, 
  model: string, 
  year: number | string
): Promise<NHTSAComplaintItem[]> {
  const normMake = make.trim();
  const normModel = model.trim();
  const normYear = String(year).trim();
  const cacheKey = `${normMake.toLowerCase()}-${normModel.toLowerCase()}-${normYear}`;

  const cached = complaintsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.nhtsa.gov/complaints/complaintsByVehicle?make=${encodeURIComponent(normMake)}&model=${encodeURIComponent(normModel)}&modelYear=${encodeURIComponent(normYear)}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {
    // If not valid JSON and not ok
    if (!response.ok) {
      throw new Error(`NHTSA Complaints API returned status ${response.status}`);
    }
  }

  // NHTSA returns HTTP 400 with {"count":0,"message":"Results returned successfully","results":[]}
  // when zero complaint records exist for newer vehicles (e.g. 2025 models).
  if (!response.ok && (!data || data.count === undefined)) {
    throw new Error(`NHTSA Complaints API returned status ${response.status}`);
  }

  const rawResults: any[] = data && Array.isArray(data.results) ? data.results : [];

  const complaints: NHTSAComplaintItem[] = rawResults.map((item) => ({
    odiNumber: item.odiNumber || item.ODINumber || Math.random().toString(),
    manufacturer: item.manufacturer || '',
    crash: Boolean(item.crash),
    fire: Boolean(item.fire),
    numberOfInjuries: Number(item.numberOfInjuries || 0),
    numberOfDeaths: Number(item.numberOfDeaths || 0),
    dateOfIncident: item.dateOfIncident || '',
    dateComplaintFiled: item.dateComplaintFiled || '',
    vin: item.vin || '',
    components: item.components || item.component || 'UNKNOWN / UNLISTED',
    summary: item.summary || item.Summary || 'No incident summary provided by filer.'
  }));

  complaintsCache.set(cacheKey, { data: complaints, timestamp: Date.now() });
  return complaints;
}

/**
 * Fetch general recall campaigns for a vehicle make, model, and year from NHTSA.
 */
export async function getRecallsByVehicle(
  make: string, 
  model: string, 
  year: number | string
): Promise<NHTSARecallItem[]> {
  const normMake = make.trim();
  const normModel = model.trim();
  const normYear = String(year).trim();
  const cacheKey = `${normMake.toLowerCase()}-${normModel.toLowerCase()}-${normYear}`;

  const cached = recallsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.nhtsa.gov/recalls/recallsByVehicle?make=${encodeURIComponent(normMake)}&model=${encodeURIComponent(normModel)}&modelYear=${encodeURIComponent(normYear)}`;

  const response = await fetch(url, {
    headers: { 'Accept': 'application/json' }
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) {
      throw new Error(`NHTSA Recalls API returned status ${response.status}`);
    }
  }

  // Handle NHTSA 400 empty records
  if (!response.ok && (!data || (data.Count === undefined && data.count === undefined))) {
    throw new Error(`NHTSA Recalls API returned status ${response.status}`);
  }

  const rawResults: any[] = data && Array.isArray(data.results) ? data.results : [];

  const recalls: NHTSARecallItem[] = rawResults.map((item) => ({
    NHTSACampaignNumber: item.NHTSACampaignNumber || item.nhtsaCampaignNumber || 'CAMPAIGN PENDING',
    Component: item.Component || item.component || 'GENERAL SAFETY DEFECT',
    Summary: item.Summary || item.summary || 'No recall summary reported.',
    Consequence: item.Consequence || item.consequence || '',
    Remedy: item.Remedy || item.remedy || 'Contact an authorized dealership for free factory remedy.',
    Notes: item.Notes || item.notes || '',
    ReportReceivedDate: item.ReportReceivedDate || item.reportReceivedDate || '',
    Manufacturer: item.Manufacturer || item.manufacturer || ''
  }));

  recallsCache.set(cacheKey, { data: recalls, timestamp: Date.now() });
  return recalls;
}

/**
 * Decode a 17-character VIN using the official NHTSA VPIC API.
 */
export async function decodeVinVehicle(vin: string): Promise<NHTSAVinDecodedVehicle> {
  const targetVin = vin.trim().toUpperCase();
  if (targetVin.length !== 17) {
    throw new Error('VIN must be exactly 17 characters');
  }

  const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${encodeURIComponent(targetVin)}?format=json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`NHTSA VIN Decoder API returned status ${response.status}`);
  }

  const data = await response.json();
  if (!data.Results || data.Results.length === 0) {
    throw new Error('NHTSA database returned empty decode records for this VIN.');
  }

  const item = data.Results[0];
  if (!item.Make || !item.Model) {
    throw new Error('NHTSA database could not verify the Make and Model for this VIN.');
  }

  return {
    vin: targetVin,
    make: item.Make.trim(),
    model: item.Model.trim(),
    year: item.ModelYear ? String(item.ModelYear).trim() : '',
    trim: item.Trim?.trim() || undefined,
    bodyClass: item.BodyClass?.trim() || undefined,
    engineCylinders: item.EngineCylinders?.trim() || undefined,
    displacementL: item.DisplacementL ? `${parseFloat(item.DisplacementL).toFixed(1)}L` : undefined,
    driveType: item.DriveType?.trim() || undefined,
    fuelType: item.FuelTypePrimary?.trim() || undefined,
    plantCountry: item.PlantCountry?.trim() || undefined,
    vehicleType: item.VehicleType?.trim() || undefined,
  };
}

/**
 * Standardize and normalize raw NHTSA component strings into consumer-friendly categories.
 */
export function normalizeNHTSAComponent(rawComponent?: string): string {
  if (!rawComponent) return 'Other Systems';
  const c = rawComponent.toUpperCase();

  if (c.includes('ENGINE') || c.includes('POWER TRAIN') || c.includes('POWERTRAIN')) {
    if (c.includes('TRANSMISSION') || c.includes('CLUTCH') || c.includes('TORQUE CONVERTER')) {
      return 'Transmission & Drivetrain';
    }
    if (c.includes('ENGINE') || c.includes('EXHAUST') || c.includes('COOLING')) {
      return 'Engine & Cooling';
    }
    return 'Engine & Powertrain';
  }
  if (c.includes('ELECTRICAL') || c.includes('BATTERY') || c.includes('WIRING') || c.includes('ALTERNATOR')) {
    return 'Electrical System';
  }
  if (c.includes('BRAKE') || c.includes('HYDRAULIC') || c.includes('ABS')) {
    return 'Braking System';
  }
  if (c.includes('STEERING') || c.includes('SUSPENSION') || c.includes('WHEEL') || c.includes('ALIGNMENT')) {
    return 'Steering & Suspension';
  }
  if (c.includes('AIR BAG') || c.includes('AIRBAG') || c.includes('SEAT BELT') || c.includes('RESTRAINT')) {
    return 'Airbags & Seatbelts';
  }
  if (c.includes('FUEL') || c.includes('GASOLINE') || c.includes('TANK')) {
    return 'Fuel System';
  }
  if (c.includes('VISIBILITY') || c.includes('WIPER') || c.includes('WINDSHIELD') || c.includes('DEFROSTER') || c.includes('MIRROR')) {
    return 'Visibility & Glass';
  }
  if (c.includes('FORWARD COLLISION') || c.includes('LANE') || c.includes('BACKOVER') || c.includes('DRIVER ASSIST') || c.includes('CAMERA')) {
    return 'ADAS & Driver Assistance';
  }
  if (c.includes('STRUCTURE') || c.includes('BODY') || c.includes('LATCH') || c.includes('DOOR') || c.includes('HOOD')) {
    return 'Structure & Body Hardware';
  }
  if (c.includes('AIR CONDITION') || c.includes('HEATER') || c.includes('CLIMATE') || c.includes('HVAC')) {
    return 'Climate Control & HVAC';
  }

  return 'General Equipment & Accessories';
}

/**
 * Build aggregated Reliability Report and inspection recommendations based on genuine records.
 */
export async function getVehicleReliabilityReport(
  make: string, 
  model: string, 
  year: number | string
): Promise<ReliabilityReport> {
  const parsedYear = Number(year);
  const [complaints, recalls] = await Promise.all([
    getComplaintsByVehicle(make, model, parsedYear),
    getRecallsByVehicle(make, model, parsedYear)
  ]);

  let crashesReported = 0;
  let firesReported = 0;
  let injuriesReported = 0;

  // Group complaints by normalized category without duplicate counting per record
  const categoryMap = new Map<string, { category: string; complaints: NHTSAComplaintItem[] }>();

  complaints.forEach((c) => {
    if (c.crash) crashesReported += 1;
    if (c.fire) firesReported += 1;
    injuriesReported += (c.numberOfInjuries || 0);

    // Some NHTSA items list "ENGINE, ELECTRICAL SYSTEM", split by comma if multiple
    const subComponents = (c.components || 'UNKNOWN')
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    // Assign to unique normalized categories for this complaint
    const seenCategories = new Set<string>();
    for (const sub of subComponents) {
      const normalized = normalizeNHTSAComponent(sub);
      if (!seenCategories.has(normalized)) {
        seenCategories.add(normalized);
        if (!categoryMap.has(normalized)) {
          categoryMap.set(normalized, { category: normalized, complaints: [] });
        }
        categoryMap.get(normalized)!.complaints.push(c);
      }
    }
  });

  const categories: ComplaintCategoryGroup[] = Array.from(categoryMap.entries())
    .map(([categoryName, group]) => {
      // Find top keywords / symptoms from summaries
      const textSample = group.complaints.slice(0, 5).map(c => c.summary).join(' ').toLowerCase();
      const symptoms: string[] = [];
      if (textSample.includes('stall') || textSample.includes('shut down') || textSample.includes('died')) symptoms.push('Unexpected Engine Stall');
      if (textSample.includes('hesitat') || textSample.includes('jerk') || textSample.includes('slip')) symptoms.push('Transmission Shudder / Slip');
      if (textSample.includes('vibrat') || textSample.includes('noise') || textSample.includes('clunk')) symptoms.push('Unusual Vibration or Clunking');
      if (textSample.includes('warn') || textSample.includes('check engine') || textSample.includes('light')) symptoms.push('Dashboard Warning Indicators');
      if (textSample.includes('fluid') || textSample.includes('leak') || textSample.includes('smoke')) symptoms.push('Fluid Leakage or Burning Odor');
      if (textSample.includes('pull') || textSample.includes('stiff') || textSample.includes('lock')) symptoms.push('Steering Resistance or Pulling');

      return {
        category: categoryName,
        normalizedCategory: categoryName,
        count: group.complaints.length,
        percentage: complaints.length > 0 ? Math.round((group.complaints.length / complaints.length) * 100) : 0,
        recentComplaints: group.complaints.slice(0, 5),
        commonSymptoms: symptoms.slice(0, 3)
      };
    })
    .sort((a, b) => b.count - a.count);

  const mostReportedCategory = categories.length > 0 ? categories[0].category : null;

  // Practical Pre-Purchase Inspection Recommendations derived from actual data
  const inspectionRecommendations: InspectionRecommendation[] = [];

  // Check recalls first
  if (recalls.length > 0) {
    inspectionRecommendations.push({
      id: 'rec-recalls',
      category: 'Safety Recalls',
      component: 'Manufacturer Safety Campaigns',
      severity: 'critical',
      reason: `${recalls.length} federal safety recall campaign(s) are recorded for the ${parsedYear} ${make} ${model}.`,
      checklistAction: 'Demand written franchise dealer documentation proving all safety recalls were completed before delivery.'
    });
  }

  // Derive component specific checks if supported by actual complaints
  for (const cat of categories) {
    if (cat.category.includes('Transmission') && cat.count >= 3) {
      inspectionRecommendations.push({
        id: 'rec-trans',
        category: 'Transmission & Drivetrain',
        component: 'Automatic / CVT Transmission',
        severity: cat.count >= 15 ? 'critical' : 'caution',
        reason: `${cat.count} owner complaints report transmission or drivetrain irregularities.`,
        checklistAction: 'Perform multiple cold and warm test-drive accelerations. Watch for hesitation, delayed engagement from Reverse to Drive, and shuddering.'
      });
    } else if (cat.category.includes('Engine') && cat.count >= 3) {
      inspectionRecommendations.push({
        id: 'rec-engine',
        category: 'Engine & Powertrain',
        component: 'Engine Assembly & Cooling',
        severity: cat.count >= 15 ? 'critical' : 'caution',
        reason: `${cat.count} complaints cite engine performance or cooling issues.`,
        checklistAction: 'Inspect engine bay for oil seepage around valve covers and timing chain covers. Check coolant reservoir clarity and test for idle roughness.'
      });
    } else if (cat.category.includes('Electrical') && cat.count >= 3) {
      inspectionRecommendations.push({
        id: 'rec-elec',
        category: 'Electrical System',
        component: 'Wiring, Alternator & Sensors',
        severity: 'caution',
        reason: `${cat.count} complaints cite electrical malfunctions or sensor warnings.`,
        checklistAction: 'Connect an OBD-II scanner during pre-purchase inspection to scan for pending diagnostic trouble codes (DTCs), and test all infotainment and power accessories.'
      });
    } else if (cat.category.includes('Braking') && cat.count >= 3) {
      inspectionRecommendations.push({
        id: 'rec-brakes',
        category: 'Braking System',
        component: 'Brake Boosters & ABS Modulators',
        severity: 'critical',
        reason: `${cat.count} complaints involve braking or ABS behavior.`,
        checklistAction: 'Perform firm controlled emergency braking at 45 mph in a safe clearing. Check for pedal fade, excessive travel, or ABS shuttering.'
      });
    } else if (cat.category.includes('Steering') && cat.count >= 3) {
      inspectionRecommendations.push({
        id: 'rec-steer',
        category: 'Steering & Suspension',
        component: 'Power Steering Rack & Bushings',
        severity: 'caution',
        reason: `${cat.count} complaints report steering stiffness, wander, or suspension clunks.`,
        checklistAction: 'Turn steering wheel lock-to-lock at a dead stop listening for binding or groaning noises. Drive over speed bumps to check for loose strut mounts.'
      });
    }
  }

  // Fallback baseline inspection recommendation if minimal complaints exist
  if (inspectionRecommendations.length === 0) {
    inspectionRecommendations.push({
      id: 'rec-standard',
      category: 'General Mechanical Inspection',
      component: 'Pre-Purchase Vehicle Inspection (PPI)',
      severity: 'routine',
      reason: 'Low volume of NHTSA complaints detected, but physical wear varies by previous owner care.',
      checklistAction: 'Commission an independent mobile mechanic or trusted ASE-certified shop for a 150-point pre-purchase vehicle inspection before signing.'
    });
  }

  const hasInsufficientData = complaints.length === 0 && recalls.length === 0;

  return {
    year: parsedYear,
    make,
    model,
    retrievedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    totalComplaints: complaints.length,
    totalRecalls: recalls.length,
    crashesReported,
    firesReported,
    injuriesReported,
    mostReportedCategory,
    categories,
    recalls,
    inspectionRecommendations,
    hasInsufficientData
  };
}

