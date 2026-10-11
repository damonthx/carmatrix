import React, { useState } from 'react';
import { TrendingDown, Target, CheckCircle2, DollarSign, Calendar, Car, ShieldCheck, AlertCircle, Info } from 'lucide-react';

export interface VehicleSegment {
  id: string;
  name: string;
  shortLabel: string;
  examples: string;
  yearRetentions: number[]; // % retained value at Year 1, 2, 3, 4, 5, 6, 7
  sweetSpotYears: number[]; // e.g. [3, 4, 5]
  defaultMsrp: number;
  optimalBuyWindow: string;
  avoidWindow: string;
  insight: string;
  intelRationale: string;
}

export const SEGMENTS: VehicleSegment[] = [
  {
    id: 'japanese_asian_luxury',
    name: 'Asian / Japanese Luxury Sedans',
    shortLabel: 'Asian / Japanese Luxury',
    examples: 'Lexus ES / IS / LS, Acura TLX, Genesis G70 / G80, Infiniti Q50',
    yearRetentions: [82, 73, 65, 58, 51, 45, 40],
    sweetSpotYears: [3, 4, 5],
    defaultMsrp: 46000,
    optimalBuyWindow: 'Year 3.5 to Year 5 (36,000–55,000 miles)',
    avoidWindow: 'Years 0–2 (Steepest dollar depreciation per mile hit)',
    insight: 'Significantly outperforms European luxury in long-term value retention. At Year 3–4, you save 35–42% off MSRP while inheriting Toyota/Honda-derived reliability engineering.',
    intelRationale: 'Initial corporate lease depreciation is completely absorbed, yet major mechanical components and powertrains have 150k+ miles of dependable, low-maintenance lifespan remaining.'
  },
  {
    id: 'economy_compact',
    name: 'Economy Sedans & Hatchbacks',
    shortLabel: 'Economy Compact',
    examples: 'Toyota Corolla, Honda Civic, Hyundai Elantra, Mazda 3',
    yearRetentions: [85, 76, 68, 61, 54, 47, 41],
    sweetSpotYears: [3, 4],
    defaultMsrp: 25000,
    optimalBuyWindow: 'Year 3 to Year 4 (30,000–48,000 miles)',
    avoidWindow: 'Years 0–1 (Minimal savings vs. buying new with full warranty)',
    insight: 'Flattened, high-retention curve. High consumer demand in the sub-$20k bracket protects resale value indefinitely.',
    intelRationale: 'Low initial entry price, stellar fuel economy, and minimal insurance costs produce the lowest total cost of ownership in the industry.'
  },
  {
    id: 'midsize_non_luxury',
    name: 'Midsize Non-Luxury & Crossovers',
    shortLabel: 'Midsize & Crossovers',
    examples: 'Toyota Camry, Honda Accord, Toyota RAV4, Honda CR-V, Subaru Outback',
    yearRetentions: [86, 77, 69, 62, 54, 46, 40],
    sweetSpotYears: [3, 4],
    defaultMsrp: 34000,
    optimalBuyWindow: 'Year 3 to Year 4 (36,000–50,000 miles)',
    avoidWindow: 'Years 0–2 (High initial dealer markups and fast early drop)',
    insight: 'The benchmark of automotive liquidity. At Year 3, you save 31% off sticker with 8–10 years of reliable family service remaining.',
    intelRationale: 'Huge private-party liquidity makes these cars easy to trade or resell at any point in their lifecycle without underwater risk.'
  },
  {
    id: 'european_luxury',
    name: 'European Luxury Vehicles',
    shortLabel: 'European Luxury',
    examples: 'BMW 3 / 5 Series, Mercedes C / E-Class, Audi A4 / A6, Porsche Macan',
    yearRetentions: [78, 62, 51, 42, 34, 27, 21],
    sweetSpotYears: [4, 5],
    defaultMsrp: 58000,
    optimalBuyWindow: 'Year 4 to Year 5 at ~34–42% of MSRP (Only with detailed service records)',
    avoidWindow: 'Years 1–3 (Crushing 50% depreciation cliff) & Year 7+ (Out-of-warranty repair spikes)',
    insight: 'Steepest depreciation cliff in the automotive market. Cars shed nearly 60% of value by Year 4, creating bargain luxury buy-ins if maintenance is verified.',
    intelRationale: 'Heavy lease returns flood the market at Year 3. Out-of-warranty maintenance fears suppress values, creating deep discount opportunities for savvy buyers with trusted mechanics.'
  },
  {
    id: 'domestic_truck_suv',
    name: 'Full-Size Trucks & Body-On-Frame SUVs',
    shortLabel: 'Trucks & Large SUVs',
    examples: 'Ford F-150, Chevy Silverado / Tahoe, Toyota Tacoma / Tundra, GMC Sierra',
    yearRetentions: [88, 79, 71, 64, 57, 50, 44],
    sweetSpotYears: [3, 4],
    defaultMsrp: 52000,
    optimalBuyWindow: 'Year 3 to Year 4 (36,000–52,000 miles)',
    avoidWindow: 'Years 0–1 (Paying full dealer truck pack add-ons)',
    insight: 'Body-on-frame utility vehicles hold equity better than almost any passenger platform. Long utilitarian lifespans keep private resale buoyant indefinitely.',
    intelRationale: 'High utility demand from commercial contractors and recreational towers insulates trucks from steep passenger car residual drops.'
  },
  {
    id: 'ev_luxury_standard',
    name: 'Electric Vehicles (EVs)',
    shortLabel: 'Electric Vehicles (EVs)',
    examples: 'Tesla Model 3 / Y, Hyundai Ioniq 5 / 6, Ford Mustang Mach-E',
    yearRetentions: [73, 56, 45, 37, 30, 24, 19],
    sweetSpotYears: [3, 4],
    defaultMsrp: 44000,
    optimalBuyWindow: 'Year 3 to Year 4 (Targeting used federal clean vehicle tax credit <$25k)',
    avoidWindow: 'Years 0–2 (Aggressive OEM MSRP price cuts and rapid battery tech obsolescence)',
    insight: 'Accelerated early depreciation driven by federal incentives and rapid charging upgrades. Excellent buy on the secondary market under $25,000.',
    intelRationale: 'OEM price wars and battery tech leaps heavily discount 3-year-old models, creating ultra-low commuter operating costs on the secondary market.'
  }
];

export default function DepreciationPredictorWidget() {
  const [selectedSegmentId, setSelectedSegmentId] = useState('japanese_asian_luxury');
  const [originalMsrp, setOriginalMsrp] = useState<number>(46000);

  const activeSegment = SEGMENTS.find(s => s.id === selectedSegmentId) || SEGMENTS[0];

  const handleSelectSegment = (segmentId: string) => {
    setSelectedSegmentId(segmentId);
    const seg = SEGMENTS.find(s => s.id === segmentId);
    if (seg) {
      setOriginalMsrp(seg.defaultMsrp);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 via-cyan-500/10 to-transparent border border-cyan-300/40 shadow-[0_4px_16px_rgba(6,182,212,0.18)] flex items-center justify-center text-cyan-600 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <TrendingDown size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Depreciation Curve &amp; "Sweet Spot" Predictor</h3>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">7-year residual value trajectories and optimal buying windows by segment.</p>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-4 rounded-2xl shrink-0 min-w-[210px] shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Optimal Buy Window</span>
          <span className="text-xl font-black text-emerald-400 leading-tight block mt-1 font-poppins">
            {activeSegment.sweetSpotYears.length > 1
              ? `Years ${activeSegment.sweetSpotYears[0]}–${activeSegment.sweetSpotYears[activeSegment.sweetSpotYears.length - 1]}`
              : `Year ${activeSegment.sweetSpotYears[0]}`}
          </span>
          <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
            {Math.round(100 - activeSegment.yearRetentions[activeSegment.sweetSpotYears[0] - 1])}%–
            {Math.round(100 - activeSegment.yearRetentions[activeSegment.sweetSpotYears[activeSegment.sweetSpotYears.length - 1] - 1])}% Off MSRP
          </span>
        </div>
      </div>

      {/* Segment Selector Pills */}
      <div className="mt-6 flex flex-wrap gap-2">
        {SEGMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => handleSelectSegment(s.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              selectedSegmentId === s.id
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input, Intelligence & Rationale */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-slate-800">Original Vehicle MSRP ($)</label>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">Baseline Benchmark</span>
            </div>
            <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
              <span className="text-slate-400 font-bold mr-1">$</span>
              <input
                type="number"
                step="1000"
                value={originalMsrp === 0 ? '' : originalMsrp}
                onChange={(e) => setOriginalMsrp(e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full text-sm font-bold text-slate-900 outline-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              <strong className="text-slate-700">Comps:</strong> {activeSegment.examples}
            </p>
          </div>

          {/* Value Sweet Spot Analysis Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-50 border border-cyan-200/80 text-xs text-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 font-bold text-[#29abe2]">
              <Target size={16} className="text-[#29abe2]" />
              <span className="uppercase tracking-wider font-extrabold">Value Sweet Spot Analysis</span>
            </div>
            <p className="leading-relaxed text-slate-700">{activeSegment.insight}</p>

            <div className="pt-3 border-t border-cyan-200/60 space-y-2">
              <div className="flex items-start gap-1.5 text-[11px]">
                <CheckCircle2 size={13} className="text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-emerald-900">Optimal Buy Window: </span>
                  <span className="text-slate-700">{activeSegment.optimalBuyWindow}</span>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-[11px]">
                <AlertCircle size={13} className="text-rose-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-rose-900">Avoid Window / Cliff: </span>
                  <span className="text-slate-700">{activeSegment.avoidWindow}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-cyan-200/60 text-[11px] text-slate-600 leading-relaxed">
              <strong className="text-slate-800 font-semibold">Intel Rationale: </strong>
              {activeSegment.intelRationale}
            </div>
          </div>
        </div>

        {/* Right Column: Year-By-Year Value Retention Trajectory */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>7-Year Residual Trajectory</span>
              <span className="text-slate-400 font-normal">({activeSegment.name})</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Optimal Window Highlighted
            </span>
          </div>

          <div className="space-y-2.5">
            {activeSegment.yearRetentions.map((percent, idx) => {
              const yearNum = idx + 1;
              const isSweetSpot = activeSegment.sweetSpotYears.includes(yearNum);
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
                  <div className="flex items-center gap-3 sm:w-48">
                    <div
                      className={
                        "w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 " +
                        (isSweetSpot ? "bg-[#29abe2] text-white" : "bg-slate-200 text-slate-700")
                      }
                    >
                      Y{yearNum}
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-900 block leading-tight">Year {yearNum}</span>
                      {isSweetSpot ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black text-[#29abe2] uppercase tracking-wider">
                          <Target size={11} className="stroke-[2.5]" /> Sweet Spot Window
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {yearNum <= 2 ? 'Initial Cliff' : 'Extended Age'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="flex-1 mx-2">
                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={
                          "h-full rounded-full transition-all duration-300 " +
                          (isSweetSpot ? "bg-[#29abe2]" : "bg-slate-600")
                        }
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 text-right">
                    <div>
                      <span className="font-extrabold text-slate-900 text-sm">
                        ${projectedValue.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        ({percent}% retained)
                      </span>
                    </div>
                    <span className="text-rose-600 font-bold text-[11px] w-24">
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
