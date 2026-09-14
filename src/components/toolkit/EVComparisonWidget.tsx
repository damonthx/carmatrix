import React, { useState } from 'react';
import { Zap, Fuel, HelpCircle, Gauge, Leaf } from 'lucide-react';

export default function EVComparisonWidget() {
  const [annualMiles, setAnnualMiles] = useState(13500);
  const [gasPrice, setGasPrice] = useState(3.45);
  const [gasMpg, setGasMpg] = useState(26);
  const [electricRate, setElectricRate] = useState(0.16);
  const [evEfficiency, setEvEfficiency] = useState(3.4);
  const [hybridMpg, setHybridMpg] = useState(48);

  const gasGallonsPerYear = annualMiles / (gasMpg || 1);
  const gasAnnualCost = Math.round(gasGallonsPerYear * gasPrice);

  const hybridGallonsPerYear = annualMiles / (hybridMpg || 1);
  const hybridAnnualCost = Math.round(hybridGallonsPerYear * gasPrice);

  const evKwhPerYear = annualMiles / (evEfficiency || 1);
  const evAnnualCost = Math.round(evKwhPerYear * electricRate);

  const evAnnualSavingsVsGas = gasAnnualCost - evAnnualCost;
  const evFiveYearSavings = evAnnualSavingsVsGas * 5;
  const monthlySavings = Math.round(evAnnualSavingsVsGas / 12);

  const maintenanceAnnualSavings = 530;
  const totalAnnualSavings = evAnnualSavingsVsGas + maintenanceAnnualSavings;
  const totalFiveYearSavings = totalAnnualSavings * 5;

  const co2ReducedLbs = Math.round(gasGallonsPerYear * 19.6 * 0.65);

  return (
    <div className="bg-white rounded-3xl border border-slate-300/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)] p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-700 text-xs font-bold mb-2">
            <Zap size={14} className="text-emerald-500" />
            <span>Energy & Fuel Simulator</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">EV vs. Gas vs. Hybrid Cost Comparison</h3>
          <p className="text-slate-500 text-sm mt-1">Calculate how much you save on fuel, charging, and maintenance by switching powertrains.</p>
        </div>

        <div className="text-left md:text-right bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl shrink-0">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block">Estimated 5-Yr Total Savings</span>
          <span className="text-3xl font-black text-emerald-600 leading-none">
            {"$" + totalFiveYearSavings.toLocaleString()}
          </span>
          <span className="text-xs text-emerald-700 block mt-1 font-medium">{"~$" + Math.round(totalAnnualSavings / 12) + "/month in your pocket"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-6 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Gauge size={15} className="text-[#29abe2]" />
                Annual Driving Mileage
              </label>
              <span className="text-sm font-extrabold text-[#29abe2] bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                {annualMiles.toLocaleString() + " miles / yr"}
              </span>
            </div>
            <input
              type="range"
              min={5000}
              max={30000}
              step={500}
              value={annualMiles}
              onChange={(e) => setAnnualMiles(Number(e.target.value))}
              className="w-full accent-[#29abe2] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5 mt-1">
              <span>5,000 mi</span>
              <span>15,000 mi (US Avg)</span>
              <span>30,000 mi</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Fuel size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-slate-800">Gas Vehicle</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Local Gas Price ($/gal)</label>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      step="0.05"
                      value={gasPrice}
                      onChange={(e) => setGasPrice(Number(e.target.value))}
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gas Vehicle MPG</label>
                  <input
                    type="number"
                    value={gasMpg}
                    onChange={(e) => setGasMpg(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/60">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Electric Vehicle</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Electricity Rate ($/kWh)</label>
                  <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={electricRate}
                      onChange={(e) => setElectricRate(Number(e.target.value))}
                      className="w-full outline-none bg-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">EV Efficiency (mi/kWh)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={evEfficiency}
                    onChange={(e) => setEvEfficiency(Number(e.target.value))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between text-xs text-slate-700">
            <span className="font-medium">Compare with Hybrid (48 MPG):</span>
            <span className="font-bold text-slate-900">{"$" + hybridAnnualCost.toLocaleString() + "/yr fuel"}</span>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Annual Fuel & Energy Cost</h4>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  Gasoline (ICE)
                </span>
                <span className="text-slate-900">{"$" + gasAnnualCost.toLocaleString() + " / yr"}</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div className="h-full bg-gradient-to-r from-rose-400 to-rose-600 rounded-full w-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  Hybrid (HEV)
                </span>
                <span className="text-slate-900">{"$" + hybridAnnualCost.toLocaleString() + " / yr"}</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                  style={{ width: Math.min(100, (hybridAnnualCost / (gasAnnualCost || 1)) * 100) + "%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  All-Electric (EV)
                </span>
                <span className="text-emerald-700 font-extrabold">{"$" + evAnnualCost.toLocaleString() + " / yr"}</span>
              </div>
              <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: Math.min(100, (evAnnualCost / (gasAnnualCost || 1)) * 100) + "%" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <span className="text-[11px] font-semibold text-slate-500 block">Monthly Fuel Savings</span>
              <span className="text-xl font-bold text-slate-900">
                {"$" + monthlySavings} <span className="text-xs font-normal text-slate-500">/mo</span>
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200/60 rounded-2xl">
              <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <Leaf size={12} /> Net CO2 Reduced
              </span>
              <span className="text-xl font-bold text-emerald-800">
                {(co2ReducedLbs / 2000).toFixed(1)} <span className="text-xs font-normal text-emerald-600">tons / yr</span>
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <HelpCircle size={13} className="shrink-0 text-slate-400" />
            <span>Assumes 85% home charging & regular maintenance intervals (oil, fluids, regenerative brake wear).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
