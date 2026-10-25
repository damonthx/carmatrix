import React, { useState, useEffect, useRef } from 'react';
import { DollarSign, Award, ChevronDown, ArrowUpRight, Activity, MapPin, ExternalLink, ShieldCheck, RefreshCw, Car } from 'lucide-react';
import { getMakes, getModelsForMake } from '../../services/nhtsa';
import { getVehicleValuation, LiveValuationResult } from '../../services/marketcheck';

const CONDITIONS = [
  { id: 'excellent', name: 'Excellent', desc: 'Looks new, flawless paint & interior, full service history', mult: 1.05 },
  { id: 'good', name: 'Good', desc: 'Minor cosmetic wear, well maintained, clean title', mult: 1.0 },
  { id: 'fair', name: 'Fair', desc: 'Some mechanical or cosmetic defects, clean title', mult: 0.88 },
  { id: 'rough', name: 'Rough', desc: 'Needs work, high wear or minor accident history', mult: 0.74 }
];

// Fallback MSRP estimator by vehicle class when offline
function getEstimatedFallbackMSRP(make: string, model: string): number {
  const m = model.toLowerCase();
  const mk = make.toLowerCase();

  // Exotics & Supercars
  if (mk === 'porsche') {
    if (m.includes('911')) return 135000;
    if (m.includes('taycan')) return 110000;
    if (m.includes('cayenne')) return 88000;
    if (m.includes('panamera')) return 105000;
    if (m.includes('macan')) return 68000;
    return 95000;
  }

  // Luxury Full-Size / Performance
  if (['bmw', 'mercedes-benz', 'audi', 'lexus', 'land rover', 'cadillac'].includes(mk)) {
    if (m.includes('escalade') || m.includes('navigator') || m.includes('range rover') || m.includes('x7') || m.includes('gls') || m.includes('lx')) return 98000;
    if (m.includes('7 series') || m.includes('s-class') || m.includes('a8') || m.includes('ls')) return 92000;
    if (m.includes('5 series') || m.includes('e-class') || m.includes('a6') || m.includes('x5') || m.includes('gle') || m.includes('rx')) return 68000;
    if (m.includes('3 series') || m.includes('c-class') || m.includes('a4') || m.includes('x3') || m.includes('glc') || m.includes('nx')) return 51000;
    return 56000;
  }

  // Heavy Duty & Full Size Trucks / Full Size SUVs
  if (m.includes('f-250') || m.includes('f-350') || m.includes('2500') || m.includes('3500') || m.includes('super duty')) return 65000;
  if (m.includes('f-150') || m.includes('silverado') || m.includes('sierra') || m.includes('ram 1500') || m.includes('tundra')) return 52000;
  if (m.includes('tahoe') || m.includes('suburban') || m.includes('expedition') || m.includes('yukon') || m.includes('sequoia')) return 68000;

  // Mid-Size SUVs & Minivans
  if (m.includes('highlander') || m.includes('pilot') || m.includes('explorer') || m.includes('grand cherokee') || m.includes('traverse') || m.includes('telluride') || m.includes('palisade') || m.includes('sienna') || m.includes('odyssey')) return 44000;

  // Compact SUVs
  if (m.includes('rav4') || m.includes('cr-v') || m.includes('forester') || m.includes('cx-5') || m.includes('equinox') || m.includes('escape') || m.includes('rogue') || m.includes('tucson') || m.includes('sportage')) return 33000;

  // Midsize Sedans
  if (m.includes('camry') || m.includes('accord') || m.includes('altima') || m.includes('sonata') || m.includes('legacy') || m.includes('k5')) return 30000;

  // Compact / Economy Cars
  if (m.includes('corolla') || m.includes('civic') || m.includes('sentra') || m.includes('elantra') || m.includes('forte') || m.includes('mazda3') || m.includes('impreza')) return 24500;

  return 36000;
}

interface ValuationWidgetProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
}

export default function ValuationWidget({
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle
}: ValuationWidgetProps = {}) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isToolOpen = isControlled ? controlledOpen : internalOpen;

  const toggleToolOpen = () => {
    if (onToggle) onToggle(!isToolOpen);
    if (!isControlled) setInternalOpen(!isToolOpen);
  };

  const [year, setYear] = useState(2021);
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('RAV4');
  const [mileage, setMileage] = useState(38000);
  const [condition, setCondition] = useState('good');
  const [zip, setZip] = useState('75013');

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Live API State
  const [liveData, setLiveData] = useState<LiveValuationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveSuccess, setIsLiveSuccess] = useState(false);
  const [showComps, setShowComps] = useState(false);

  // Debounce ref to avoid hammering API during typing
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function load() {
      const makes = await getMakes();
      setAvailableMakes(makes);
    }
    load();
  }, []);

  useEffect(() => {
    async function loadModels() {
      const models = await getModelsForMake(make);
      setAvailableModels(models);
      if (models.length > 0 && !models.includes(model)) {
        setModel(models[0]);
      }
    }
    if (make) loadModels();
  }, [make]);

  // Fetch Live Valuation from MarketCheck API
  useEffect(() => {
    if (!year || !make || !model) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const result = await getVehicleValuation({
          year,
          make,
          model,
          mileage: Number(mileage) || 0,
          zip: zip.trim(),
          condition,
          radius: 100
        });

        if (result && result.success) {
          setLiveData(result);
          setIsLiveSuccess(true);
        } else {
          setIsLiveSuccess(false);
        }
      } catch (err) {
        console.error('Error fetching live market valuation:', err);
        setIsLiveSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }, 450);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [year, make, model, mileage, condition, zip]);

  // Fallback calculation in case API is offline or returns empty
  const currentYear = 2026;
  const age = Math.max(0, currentYear - year);
  const baseMsrp = getEstimatedFallbackMSRP(make, model);
  const depFactor = Math.pow(0.88, age);
  const expectedMiles = Math.max(1000, age * 12500);
  const excessMiles = (mileage || 0) - expectedMiles;
  const mileageFactor = 1 - (excessMiles * 0.000008);
  const condMult = CONDITIONS.find(c => c.id === condition)?.mult || 1.0;

  const fallbackEstimatedMarketValue = Math.round(Math.max(2500, baseMsrp * depFactor * Math.max(0.65, mileageFactor) * condMult));
  const fallbackTradeInLow = Math.round(fallbackEstimatedMarketValue * 0.82);
  const fallbackTradeInHigh = Math.round(fallbackEstimatedMarketValue * 0.88);
  const fallbackPrivateParty = fallbackEstimatedMarketValue;
  const fallbackDealerRetail = Math.round(fallbackEstimatedMarketValue * 1.12);

  // Active Display Numbers: Prioritize verified live MarketCheck data
  const estimatedMarketValue = liveData ? liveData.estimatedMarketValue : fallbackEstimatedMarketValue;
  const tradeInLow = liveData ? liveData.tradeInLow : fallbackTradeInLow;
  const tradeInHigh = liveData ? liveData.tradeInHigh : fallbackTradeInHigh;
  const privatePartyValue = liveData ? liveData.privatePartyValue : fallbackPrivateParty;
  const dealerRetailValue = liveData ? liveData.dealerRetailValue : fallbackDealerRetail;
  const demandRating = liveData ? liveData.demandRating : (['Toyota', 'Honda', 'Porsche', 'Subaru'].includes(make) ? 'High Demand (Fast Turn)' : 'Moderate Demand');

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
      <div 
        className={"flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer " + (isToolOpen ? "pb-6 border-b border-slate-200/80" : "")}
        onClick={toggleToolOpen}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400/20 via-amber-500/10 to-transparent border border-amber-300/40 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center justify-center text-amber-500 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <DollarSign size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Instant Trade-In &amp; Market Value Estimator</h3>
              {isLiveSuccess && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live MarketCheck Verified
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">Real dealer listings, trade-in wholesale ranges, and private sale comps.</p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 self-start md:self-auto" onClick={(e) => e.stopPropagation()}>
          <div className="bg-slate-900 text-white p-3 sm:p-4 rounded-2xl shrink-0 w-full sm:w-auto min-w-[210px] relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Estimated Fair Market Value</span>
              {isLoading && <RefreshCw size={12} className="text-slate-400 animate-spin" />}
            </div>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 leading-none block mt-0.5">
              {"$" + estimatedMarketValue.toLocaleString()}
            </span>
            <div className="flex items-center justify-between mt-1 text-[10.5px]">
              <span className="text-slate-300 font-medium">{demandRating}</span>
              {liveData && (
                <span className="text-slate-400 font-normal">({liveData.sampleCount} active comps)</span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={toggleToolOpen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 shrink-0"
            aria-expanded={isToolOpen}
          >
            <span>{isToolOpen ? 'Collapse' : 'Expand Tool'}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isToolOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isToolOpen && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Make</label>
              <div className="relative">
                <select
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                >
                  {availableMakes.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Model</label>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                >
                  {availableModels.length > 0 ? (
                    availableModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))
                  ) : (
                    <option value={model}>{model || 'Select Model'}</option>
                  )}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Current Mileage</label>
              <input
                type="number"
                step="1000"
                placeholder="e.g. 38000"
                value={mileage === 0 ? '' : mileage}
                onChange={(e) => {
                  const val = e.target.value;
                  setMileage(val === '' ? 0 : Number(val));
                }}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ZIP Code</label>
              <input
                type="text"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Vehicle Condition</label>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={
                    "p-2.5 rounded-xl border text-left transition-all cursor-pointer " +
                    (condition === c.id
                      ? "border-[#29abe2] bg-sky-50/80 text-slate-900 ring-2 ring-sky-200/50"
                      : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600")
                  }
                >
                  <span className="text-xs font-bold block text-slate-900">{c.name}</span>
                  <span className="text-[10px] text-slate-500 leading-tight block mt-0.5 line-clamp-1">{c.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Live Data Source Notice */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity size={16} className={isLiveSuccess ? "text-emerald-500" : "text-amber-500"} />
              <div>
                <span className="font-bold text-slate-800 block">
                  {isLiveSuccess ? "MarketCheck Active Dealer Feed" : "Calibrated Automotive Baseline"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {liveData 
                    ? `${liveData.sampleCount} real-time active listings analyzed ${liveData.isLocal ? `within ${liveData.radiusMiles || 100} miles of ${zip}` : 'nationwide'}`
                    : "Connecting to live dealer network..."}
                </span>
              </div>
            </div>
            {liveData?.comps && liveData.comps.length > 0 && (
              <button
                type="button"
                onClick={() => setShowComps(!showComps)}
                className="text-xs font-bold text-[#29abe2] hover:underline cursor-pointer"
              >
                {showComps ? 'Hide Comps' : 'View Comps'}
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {"Valuation Spectrum (" + year + " " + make + " " + model + ")"}
            </h4>
            {isLoading && (
              <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin text-[#29abe2]" />
                Updating live market data...
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Instant Dealer Trade-In</span>
                <span className="text-[11px] text-slate-500">Wholesale dealer cash offer baseline</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block">
                  {"$" + tradeInLow.toLocaleString() + " - $" + tradeInHigh.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Wholesale Auction Floor</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award size={14} className="text-emerald-600" />
                  Private Party Sale (Consumer Fair Market)
                </span>
                <span className="text-[11px] text-emerald-700">Maximum return selling directly to an individual</span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-emerald-700 block">
                  {"$" + privatePartyValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">{"+$" + (privatePartyValue - tradeInHigh).toLocaleString() + " vs trade-in"}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Dealer Retail Asking Price</span>
                <span className="text-[11px] text-slate-500">Average dealer showroom price before taxes & fees</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block">
                  {"$" + dealerRetailValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Active Dealer Lot Average</span>
              </div>
            </div>
          </div>

          {/* Mileage Adjustment Details */}
          {liveData && (
            <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 flex items-center justify-between">
              <span>
                Benchmark Cohort Miles: <strong className="text-slate-900">{liveData.cohortBenchmarkMiles.toLocaleString()} mi</strong>
              </span>
              <span>
                Mileage Adj:{' '}
                <strong className={liveData.mileageAdjustment >= 0 ? "text-emerald-600" : "text-amber-600"}>
                  {liveData.mileageAdjustment >= 0 ? `+$${liveData.mileageAdjustment.toLocaleString()}` : `-$${Math.abs(liveData.mileageAdjustment).toLocaleString()}`}
                </strong>
              </span>
            </div>
          )}

          {/* Live Comparable Listings Drawer */}
          {showComps && liveData?.comps && liveData.comps.length > 0 && (
            <div className="p-4 bg-sky-50/50 rounded-2xl border border-sky-200/70 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-950 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#29abe2]" />
                  Active Market Listings Supporting This Valuation
                </span>
                <span className="text-[10px] text-sky-700 font-medium">MarketCheck Verified</span>
              </div>

              <div className="space-y-2">
                {liveData.comps.map((comp) => (
                  <div key={comp.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 block truncate">{comp.heading}</span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin size={11} className="text-slate-400 shrink-0" />
                        {comp.dealerName} {comp.city && `• ${comp.city}, ${comp.state}`}
                        {comp.distance !== null && ` (${comp.distance} mi)`}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-slate-900 block">${comp.price?.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-500">{comp.miles?.toLocaleString()} mi</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/60 flex items-center justify-between text-xs text-sky-900 font-medium">
            <span>Looking to trade or purchase? Check dealer fees before signing:</span>
            <span className="font-bold text-[#29abe2] flex items-center gap-1 cursor-pointer hover:underline">
              Audit Dealer Quote <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
