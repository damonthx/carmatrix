import React, { useState } from 'react';
import { TrendingDown, Sparkles, CheckCircle2, DollarSign, Calendar, Car } from 'lucide-react';

interface VehicleSegment {
  id: string;
  name: string;
  examples: string;
  yearRetentions: number[]; // % retained value at Year 1, 2, 3, 4, 5, 6, 7
  sweetSpotYear: number;
  insight: string;
}

const SEGMENTS: VehicleSegment[] = [
  {
    id: 'jp-suv',
    name: 'Japanese Compact SUVs',
    examples: 'Toyota RAV4, Honda CR-V, Mazda CX-5, Subaru Forester',
    yearRetentions: [86, 76, 68, 60, 52, 45, 39],
    sweetSpotYear: 3,
    insight: 'Exceptional value retention. At Year 3 (36k miles), you save 32% off MSRP while retaining 8-10 years of reliable lifespan.'
  },
  {
    id: 'trucks',
    name: 'Full-Size Trucks & Off-Road',
    examples: 'Ford F-150, Toyota Tacoma / Tundra, Chevy Silverado, 4Runner',
    yearRetentions: [88, 79, 71, 64, 57, 50, 44],
    sweetSpotYear: 3,
    insight: 'Body-on-frame trucks hold value better than almost any passenger vehicle. Private resale demand remains elevated indefinitely.'
  },
  {
    id: 'euro-lux',
    name: 'European Luxury Vehicles',
    examples: 'BMW 3/5 Series, Mercedes C/E-Class, Audi A4/A6',
    yearRetentions: [78, 62, 51, 42, 34, 27, 21],
    sweetSpotYear: 4,
    insight: 'Steepest initial depreciation curve. By Year 4, cars have lost ~58% of original MSRP, offering massive luxury discounts if vetted with maintenance records.'
  },
  {
    id: 'ev',
    name: 'Electric Vehicles (EVs)',
    examples: 'Tesla Model 3/Y, Hyundai Ioniq 5, Ford Mustang Mach-E',
    yearRetentions: [74, 58, 47, 39, 32, 26, 20],
    sweetSpotYear: 3,
    insight: 'Fast technological changes and federal tax credits cause accelerated early depreciation. Excellent value buy on the secondary market under $25,000.'
  },
  {
    id: 'economy',
    name: 'Economy Sedans & Hatchbacks',
    examples: 'Toyota Corolla, Honda Civic, Hyundai Elantra, Mazda 3',
    yearRetentions: [84, 74, 65, 57, 49, 42, 36],
    sweetSpotYear: 3,
    insight: 'Steady, predictable depreciation. Extremely low insurance and maintenance costs make these ideal low-TCO commuters.'
  }
];

export default function DepreciationPredictorWidget() {
  const [selectedSegmentId, setSelectedSegmentId] = useState('jp-suv');
  const [originalMsrp, setOriginalMsrp] = useState(36000);

  const activeSegment = SEGMENTS.find(s => s.id === selectedSegmentId) || SEGMENTS[0];

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 border border-cyan-200/60 rounded-full text-cyan-800 text-xs font-bold mb-2">
            <TrendingDown size={14} className="text-cyan-600" />
            <span>Resale Value Predictor</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Depreciation Curve & "Sweet Spot" Predictor</h3>
          <p className="text-slate-500 text-sm mt-1">See how vehicles lose value over 7 years and identify the optimal age to buy for maximum financial savings.</p>
        </div>
      </div>

      {/* Segment Selector Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSegmentId(s.id)}
            className={
              "px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border " +
              (selectedSegmentId === s.id
                ? "bg-slate-900 text-white border-slate-900 shadow-md"
                : "bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200")
            }
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input & Key Insight */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <label className="block text-xs font-bold text-slate-800">Original Vehicle MSRP ($)</label>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
              <span className="text-slate-400 font-bold mr-1">$</span>
              <input
                type="number"
                step="1000"
                value={originalMsrp}
                onChange={(e) => setOriginalMsrp(Number(e.target.value))}
                className="w-full text-sm font-bold text-slate-900 outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500">Representative examples: {activeSegment.examples}</p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200/80 text-xs text-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[#29abe2]">
              <Sparkles size={16} />
              <span className="uppercase tracking-wider">Value Sweet Spot Analysis</span>
            </div>
            <p className="leading-relaxed text-slate-700">{activeSegment.insight}</p>
          </div>
        </div>

        {/* Right: Year-By-Year Value Retention Curve */}
        <div className="lg:col-span-8 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            7-Year Value Retention Trajectory
          </h4>

          <div className="space-y-2.5">
            {activeSegment.yearRetentions.map((percent, idx) => {
              const yearNum = idx + 1;
              const isSweetSpot = yearNum === activeSegment.sweetSpotYear;
              const projectedValue = Math.round(originalMsrp * (percent / 100));
              const valueLost = originalMsrp - projectedValue;

              return (
                <div
                  key={yearNum}
                  className={
                    "p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs " +
                    (isSweetSpot
                      ? "bg-sky-50/70 border-[#29abe2] shadow-sm ring-1 ring-[#29abe2]/30"
                      : "bg-slate-50 border-slate-200/70")
                  }
                >
                  <div className="flex items-center gap-3 sm:w-44">
                    <div className={"w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs " + (isSweetSpot ? "bg-[#29abe2] text-white" : "bg-slate-200 text-slate-700")}>
                      Y{yearNum}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block">Year {yearNum}</span>
                      {isSweetSpot && (
                        <span className="text-[10px] font-black text-[#29abe2] uppercase tracking-wider">
                          ★ Sweet Spot
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="flex-1 mx-2">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={"h-full rounded-full transition-all duration-300 " + (isSweetSpot ? "bg-[#29abe2]" : "bg-slate-600")}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">${projectedValue.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">({percent}% retained)</span>
                    </div>
                    <span className="text-rose-600 font-bold text-[11px] w-20">
                      -${valueLost.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
