import React, { useState, useEffect } from 'react';
import { DollarSign, Award, ChevronDown, ArrowUpRight } from 'lucide-react';
import { getMakes, getModelsForMake } from '../../services/nhtsa';

const CONDITIONS = [
  { id: 'excellent', name: 'Excellent', desc: 'Looks new, flawless paint & interior, full service history', mult: 1.08 },
  { id: 'good', name: 'Good', desc: 'Minor cosmetic wear, well maintained, clean title', mult: 1.0 },
  { id: 'fair', name: 'Fair', desc: 'Some mechanical or cosmetic defects, clean title', mult: 0.88 },
  { id: 'rough', name: 'Rough', desc: 'Needs work, high wear or minor accident history', mult: 0.72 }
];

export default function ValuationWidget() {
  const [year, setYear] = useState(2021);
  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('RAV4');
  const [mileage, setMileage] = useState(38000);
  const [condition, setCondition] = useState('good');
  const [zip, setZip] = useState('75013');

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

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

  const currentYear = 2026;
  const age = Math.max(0, currentYear - year);
  
  let baseMsrp = 34000;
  if (['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Lexus', 'Land Rover'].includes(make)) baseMsrp = 54000;
  else if (['Toyota', 'Honda', 'Subaru', 'Mazda'].includes(make)) baseMsrp = 32000;
  else if (['Chevrolet', 'Ford', 'Ram', 'GMC'].includes(make)) baseMsrp = 42000;

  const depFactor = Math.pow(0.85, age);
  const expectedMiles = age * 12500;
  const excessMiles = mileage - expectedMiles;
  const mileageFactor = 1 - (excessMiles * 0.000008);
  const condMult = CONDITIONS.find(c => c.id === condition)?.mult || 1.0;

  const estimatedMarketValue = Math.round(Math.max(2500, baseMsrp * depFactor * Math.max(0.65, mileageFactor) * condMult));
  const tradeInLow = Math.round(estimatedMarketValue * 0.88);
  const tradeInHigh = Math.round(estimatedMarketValue * 0.94);
  const privatePartyValue = Math.round(estimatedMarketValue * 1.04);
  const dealerRetailValue = Math.round(estimatedMarketValue * 1.14);

  const demandRating = ['Toyota', 'Honda', 'Porsche', 'Subaru'].includes(make) ? 'High Demand (Fast Turn)' : 'Moderate Demand';

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-[#29abe2] text-xs font-bold mb-2">
            <DollarSign size={14} className="text-[#29abe2]" />
            <span>Market Valuation Engine</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Instant Trade-In & Market Value Estimator</h3>
          <p className="text-slate-500 text-sm mt-1">Get transparent private party, trade-in, and dealer retail valuations based on real market data.</p>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-2xl shrink-0 min-w-[200px]">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Estimated Fair Market Value</span>
          <span className="text-3xl font-black text-emerald-400 leading-none block mt-1">
            {"$" + estimatedMarketValue.toLocaleString()}
          </span>
          <span className="text-[11px] text-slate-300 block mt-1 font-medium">{demandRating}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Year</label>
              <div className="relative">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer"
                >
                  {[2026, 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014].map(y => (
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer"
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer"
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
                value={mileage}
                onChange={(e) => setMileage(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">ZIP Code</label>
              <input
                type="text"
                maxLength={5}
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
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
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{"Valuation Spectrum (" + year + " " + make + " " + model + ")"}</h4>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Instant Dealer Trade-In</span>
                <span className="text-[11px] text-slate-500">Fastest payout, wholesale baseline</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block">
                  {"$" + tradeInLow.toLocaleString() + " - $" + tradeInHigh.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Wholesale Range</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Award size={14} className="text-emerald-600" />
                  Private Party Sale (Recommended)
                </span>
                <span className="text-[11px] text-emerald-700">Maximum value to individual buyer</span>
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
                <span className="text-[11px] text-slate-500">Typical dealer lot price before fees</span>
              </div>
              <div className="text-right">
                <span className="text-base font-extrabold text-slate-900 block">
                  {"$" + dealerRetailValue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Retail Baseline</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-sky-50 rounded-xl border border-sky-200/60 flex items-center justify-between text-xs text-sky-900 font-medium">
            <span>Planning to buy or trade?</span>
            <span className="font-bold text-[#29abe2] flex items-center gap-1 cursor-pointer">
              Compare Options <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
