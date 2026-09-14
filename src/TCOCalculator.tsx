import React, { useState, useEffect, useMemo } from 'react';
import { Calculator, Info, TrendingDown, Shield, Wrench, Fuel, Receipt, Battery, Gauge, Loader2 } from 'lucide-react';
import { getVehicleTCO } from './services/marketcheck';
import { getMakes, getModelsForMake } from './services/nhtsa';

const BODY_TYPES = ['Sedan', 'SUV', 'Pickup Truck', 'Coupe', 'Hatchback'];
const FUEL_TYPES = ['Gas', 'Electric', 'Hybrid'];
const STATES = ['TX', 'CA', 'NY', 'FL', 'IL', 'OH', 'GA', 'NC', 'MI'];

export default function TCOCalculator() {
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('Camry');
  const [year, setYear] = useState(2022);
  const [stateCode, setStateCode] = useState('TX');
  
  const [price, setPrice] = useState(30000);
  const [bodyType, setBodyType] = useState('Sedan');
  const [fuelType, setFuelType] = useState('Gas');
  const [efficiency, setEfficiency] = useState(28);
  const [annualMileage, setAnnualMileage] = useState(12000);

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isModelsLoading, setIsModelsLoading] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [apiTco, setApiTco] = useState<any>(null);

  // Fetch makes on mount
  useEffect(() => {
    async function loadMakes() {
      const makes = await getMakes();
      setAvailableMakes(makes);
    }
    loadMakes();
  }, []);

  // Fetch models when make changes
  useEffect(() => {
    async function loadModels() {
      setIsModelsLoading(true);
      const models = await getModelsForMake(make);
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(model)) {
        setModel(models[0]);
      } else if (models.length === 0) {
        setModel('');
      }
      setIsModelsLoading(false);
    }
    if (make) {
      loadModels();
    }
  }, [make]);

  // Fetch live TCO data whenever key parameters change
  useEffect(() => {
    async function fetchLiveTco() {
      setIsLoading(true);
      const data = await getVehicleTCO({ make, model, year, state: stateCode });
      if (data && data.total_cost) {
        setApiTco(data);
      } else {
        // Fallback or no data found
        setApiTco(null);
      }
      setIsLoading(false);
    }
    
    // Debounce the fetch slightly if needed, but since we are changing via selects, it's fine
    fetchLiveTco();
  }, [make, model, year, stateCode]);

  // Fallback calculation if API fails or has no data
  const fallbackTcoData = useMemo(() => {
    const years = 5;
    
    // 1. Depreciation
    let depRate = 0.48; // avg sedan/generic
    const highRet = ['Toyota', 'Honda', 'Subaru'];
    const luxEv = ['Tesla', 'BMW'];
    
    if (highRet.includes(make)) depRate = 0.35;
    else if (luxEv.includes(make) || fuelType === 'Electric') depRate = 0.62;
    
    const depreciation = price * depRate;

    // 2. Insurance
    let baseIns = 2500; // Texas 2026 base
    if (bodyType === 'Sedan' && price < 30000) baseIns *= 0.85;
    else if (luxEv.includes(make) || fuelType === 'Electric') baseIns *= 1.40;
    else if (bodyType === 'Pickup Truck') baseIns *= 0.97;
    
    const insurance = baseIns * years;

    // 3. Maintenance
    const isLux = luxEv.includes(make);
    const maintYearly = isLux ? 1800 : 900;
    const maintenance = maintYearly * years;

    // 4. Fuel/Energy
    let fuelYearly = 0;
    if (fuelType === 'Electric') {
      const kwhPerMile = 33.7 / efficiency; 
      fuelYearly = annualMileage * kwhPerMile * 0.17; // $0.17/kWh
    } else {
      fuelYearly = (annualMileage / Math.max(1, efficiency)) * 3.15; // $3.15/gal
    }
    const fuel = fuelYearly * years;
    
    // 5. Fees & Taxes
    const fees = (price * 0.05) + (150 * years);

    const total = depreciation + insurance + maintenance + fuel + fees;
    const monthly_total = total / (years * 12);

    return {
      total,
      monthly_total,
      breakdown: {
        depreciation,
        insurance,
        maintenance,
        fuel,
        fees
      }
    };
  }, [make, price, bodyType, fuelType, efficiency, annualMileage]);

  // Merge API data or Fallback data
  const tcoData = useMemo(() => {
    let baseData = fallbackTcoData;
    let isLive = false;
    let insight_nugget = "";
    
    if (apiTco && apiTco.depreciation && apiTco.insurance) {
      // Use Live API Data
      isLive = true;
      const d = apiTco;
      const total = (d.depreciation || 0) + (d.insurance || 0) + (d.maintenance || 0) + (d.fuel || 0) + (d.state_fees || 0);
      baseData = {
        total,
        monthly_total: total / 60,
        breakdown: {
          depreciation: d.depreciation || 0,
          insurance: d.insurance || 0,
          maintenance: d.maintenance || 0,
          fuel: d.fuel || 0,
          fees: d.state_fees || 0
        }
      };
      insight_nugget = `Live Market Data: This vehicle is estimated to cost $${Math.round(baseData.monthly_total).toLocaleString()}/mo to own in ${stateCode}.`;
    } else {
      // Use Fallback heuristics
      const depRate = baseData.breakdown.depreciation / price;
      if (depRate <= 0.35) {
        insight_nugget = `Pro Tip: ${make} vehicles typically retain up to 13% more value than the segment average over 5 years.`;
      } else if (fuelType === 'Electric') {
        insight_nugget = `Pro Tip: While depreciation is higher, lower maintenance & energy costs save you significantly over the long haul.`;
      } else if (bodyType === 'Pickup Truck') {
        insight_nugget = `Pro Tip: Truck insurance rates hold steady, saving you roughly 3% annually compared to standard SUVs.`;
      } else {
        insight_nugget = `Estimated Base Cost: The real cost of owning this car is roughly $${Math.round(baseData.monthly_total).toLocaleString()}/mo when factoring in all hidden expenses.`;
      }
    }

    // Efficiency Score (always heuristic for fun UI)
    let efficiency_score = 50;
    if (fuelType === 'Electric') {
      efficiency_score = Math.min(100, 70 + (efficiency / 5));
    } else if (fuelType === 'Hybrid') {
      efficiency_score = Math.min(100, 60 + (efficiency / 3));
    } else {
      efficiency_score = Math.min(100, 30 + (efficiency * 1.5));
    }

    return {
      ...baseData,
      isLive,
      efficiency_score: Math.round(efficiency_score),
      insight_nugget
    };
  }, [apiTco, fallbackTcoData, fuelType, efficiency, make, bodyType, price, stateCode]);

  const formatCurrency = (val: number) => '$' + Math.round(val).toLocaleString();

  const MaxValue = Math.max(
    tcoData.breakdown.depreciation,
    tcoData.breakdown.insurance,
    tcoData.breakdown.maintenance,
    tcoData.breakdown.fuel,
    tcoData.breakdown.fees
  );

  return (
    <div className="bg-white border border-slate-300/80 rounded-3xl overflow-hidden shadow-[0_12px_32px_rgba(15,23,42,0.08)] my-16 relative">
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
           <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
           <span className="text-slate-800 font-bold text-sm">Fetching live market data...</span>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/10 rounded-xl"><Calculator size={20} className="text-blue-300" /></div>
              <h2 className="text-[24px] font-extrabold tracking-tight">5-Year Total Cost of Ownership</h2>
            </div>
            <p className="text-slate-300 font-medium">Discover the "Real Price" of owning your next car beyond the sticker price.</p>
          </div>
          {tcoData.isLive && (
             <div className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               Live API Data
             </div>
          )}
        </div>
      </div>

      <div className="p-8 grid md:grid-cols-2 gap-12">
        {/* Left side: Inputs */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Make</label>
              <select 
                value={make} onChange={e => setMake(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {availableMakes.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="block text-sm font-bold text-slate-700 mb-2">Model</label>
              <select 
                value={model} onChange={e => setModel(e.target.value)}
                disabled={isModelsLoading || availableModels.length === 0}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
              >
                {availableModels.length === 0 && <option value="">Select Make First</option>}
                {availableModels.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              {isModelsLoading && (
                <div className="absolute right-8 top-10">
                  <Loader2 className="animate-spin text-slate-400" size={16} />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Year</label>
              <select 
                value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {Array.from({ length: new Date().getFullYear() + 2 - 1900 }, (_, i) => new Date().getFullYear() + 1 - i).map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">State</label>
              <select 
                value={stateCode} onChange={e => setStateCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Fuel Type</label>
              <select 
                value={fuelType} onChange={e => {
                  setFuelType(e.target.value);
                  if (e.target.value === 'Electric' && efficiency < 70) setEfficiency(100);
                  if (e.target.value !== 'Electric' && efficiency > 60) setEfficiency(28);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {FUEL_TYPES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {fuelType === 'Electric' ? 'MPGe' : 'MPG'}
              </label>
              <input 
                type="number" value={efficiency} onChange={e => setEfficiency(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700">Listing Price</label>
              <span className="text-sm font-bold text-blue-600">{formatCurrency(price)}</span>
            </div>
            <input 
              type="range" min="15000" max="100000" step="1000"
              value={price} onChange={e => setPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-700">Annual Mileage</label>
              <span className="text-sm font-bold text-blue-600">{annualMileage.toLocaleString()} mi</span>
            </div>
            <input 
              type="range" min="5000" max="30000" step="1000"
              value={annualMileage} onChange={e => setAnnualMileage(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100/50 flex gap-3 items-start">
            <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 font-medium leading-relaxed">
              {tcoData.insight_nugget}
            </div>
          </div>
        </div>

        {/* Right side: Outputs */}
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60">
              <div className="text-sm font-bold text-slate-500 mb-1 tracking-wide uppercase">Est. Monthly Cost</div>
              <div className="text-3xl font-extrabold text-slate-900">{formatCurrency(tcoData.monthly_total)}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Total: {formatCurrency(tcoData.total)} over 5 yrs</div>
            </div>
            
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={16} className={tcoData.efficiency_score >= 80 ? 'text-green-500' : 'text-blue-500'} />
                <div className="text-sm font-bold text-slate-700">Efficiency Score</div>
              </div>
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-extrabold ${tcoData.efficiency_score >= 80 ? 'text-green-600' : 'text-slate-900'}`}>
                  {tcoData.efficiency_score}
                </span>
                <span className="text-sm font-bold text-slate-400 mb-1">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full ${tcoData.efficiency_score >= 80 ? 'bg-green-500' : 'bg-blue-500'}`} 
                  style={{ width: `${tcoData.efficiency_score}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <h3 className="text-[15px] font-bold text-slate-900 mb-4 tracking-tight">Cost Breakdown (5 Years)</h3>
            
            {[
              { label: 'Depreciation', value: tcoData.breakdown.depreciation, icon: TrendingDown, color: 'bg-red-500' },
              { label: 'Insurance', value: tcoData.breakdown.insurance, icon: Shield, color: 'bg-indigo-500' },
              { label: 'Fuel & Energy', value: tcoData.breakdown.fuel, icon: fuelType === 'Electric' ? Battery : Fuel, color: 'bg-green-500' },
              { label: 'Maintenance', value: tcoData.breakdown.maintenance, icon: Wrench, color: 'bg-amber-500' },
              { label: 'Taxes & Fees', value: tcoData.breakdown.fees, icon: Receipt, color: 'bg-blue-500' }
            ].map(item => (
               <div key={item.label} className="group flex items-center gap-4">
                 <div className={`p-2 rounded-lg bg-slate-100 ${item.color.replace('bg-', 'text-')}`}>
                   <item.icon size={16} strokeWidth={2} />
                 </div>
                 <div className="flex-1">
                   <div className="flex justify-between items-center mb-1.5">
                     <span className="text-[13px] font-semibold text-slate-700">{item.label}</span>
                     <span className="text-[14px] font-bold text-slate-900">{formatCurrency(item.value)}</span>
                   </div>
                   <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                     <div 
                       className={`h-full ${item.color} rounded-full transition-all duration-500`}
                       style={{ width: `${Math.max(2, (item.value / MaxValue) * 100)}%` }}
                     />
                   </div>
                 </div>
               </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
