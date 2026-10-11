import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  ShieldCheck, 
  Wrench, 
  Fuel, 
  Receipt, 
  TrendingDown,
  Info,
  Calendar,
  Gauge
} from 'lucide-react';

export interface OwnershipParams {
  purchasePrice: number;
  annualMileage: number;
  isFinanced: boolean;
  insuranceType: 'full' | 'liability';
}

interface CostOfOwnershipWidgetProps {
  initialPrice?: number;
  vehicleName?: string;
  onPriceChange?: (price: number) => void;
  className?: string;
}

export const CostOfOwnershipWidget: React.FC<CostOfOwnershipWidgetProps> = ({
  initialPrice = 6500,
  vehicleName,
  onPriceChange,
  className = '',
}) => {
  const [params, setParams] = useState<OwnershipParams>({
    purchasePrice: initialPrice, // Realistic FB Marketplace / cash default
    annualMileage: 12000,
    isFinanced: false,
    insuranceType: 'liability',
  });

  // Keep internal price updated if initialPrice changes externally
  React.useEffect(() => {
    if (initialPrice && initialPrice > 0) {
      setParams((prev) => ({ ...prev, purchasePrice: initialPrice }));
    }
  }, [initialPrice]);

  // Calculate 5-year projection live without requiring an "Apply" button
  const projection = useMemo(() => {
    const { purchasePrice, isFinanced, insuranceType } = params;

    // 1. Depreciation: Cash beaters hit a residual value floor
    // Sub-$10k cars rarely lose more than 40-50% total over 5 years if kept running
    const residualFloor = Math.min(2500, purchasePrice * 0.5);
    const totalDepreciation = Math.max(0, purchasePrice - residualFloor);

    // 2. Maintenance & Repairs (Inverted risk: cheaper cars need more maintenance)
    // Older cars have an upfront baseline fix + ongoing annual reserve
    const upfrontReconditioning = purchasePrice < 12000 ? 1000 : 300;
    const annualRepair = purchasePrice < 10000 ? 1400 : 900;
    const totalMaintenance = upfrontReconditioning + annualRepair * 5;

    // 3. Insurance (Liability vs Full Coverage)
    const annualInsurance = insuranceType === 'liability' ? 850 : 1800;
    const totalInsurance = annualInsurance * 5;

    // 4. Fuel (assume ~25 MPG average @ $3.40/gal for annualMileage)
    const annualFuel = (params.annualMileage / 25) * 3.4;
    const totalFuel = annualFuel * 5;

    // 5. Taxes / Registration (scales with purchase price)
    const totalTaxFees = purchasePrice * 0.0625 + 75 * 5;

    const fiveYearTotal =
      totalDepreciation +
      totalMaintenance +
      totalInsurance +
      totalFuel +
      totalTaxFees;

    return {
      fiveYearTotal: Math.round(fiveYearTotal),
      monthlyAverage: Math.round(fiveYearTotal / 60),
      breakdown: {
        depreciation: Math.round(totalDepreciation),
        maintenance: Math.round(totalMaintenance),
        insurance: Math.round(totalInsurance),
        fuel: Math.round(totalFuel),
        taxFees: Math.round(totalTaxFees),
      },
    };
  }, [params]);

  const handlePriceChange = (value: number) => {
    // Clamp to minimum $1,500 and maximum $100,000
    const clamped = Math.max(1500, Math.min(100000, value || 0));
    setParams((prev) => ({ ...prev, purchasePrice: clamped }));
    if (onPriceChange) {
      onPriceChange(clamped);
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/95 border border-slate-800 rounded-2xl p-5 sm:p-6 text-white shadow-xl backdrop-blur-xl ${className}`}>
      {/* Specular top rim highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-2xs shrink-0">
              <Calculator size={13} strokeWidth={2.4} />
            </div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white font-poppins">
              5-Year Real Cost of Ownership
            </h3>
          </div>
          {vehicleName && (
            <p className="text-xs text-slate-400 mt-1 pl-8">
              Projected for <span className="text-slate-200 font-semibold">{vehicleName}</span>
            </p>
          )}
        </div>

        <div className="inline-flex items-center gap-1.5 text-[10.5px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-500/25 shrink-0 self-start sm:self-auto">
          <span>Live Calculation</span>
        </div>
      </div>

      {/* Price Controls & Range Slider */}
      <div className="space-y-3 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
        <div className="flex justify-between items-baseline text-xs sm:text-sm text-slate-400">
          <label htmlFor="price-range" className="font-semibold text-slate-300">
            Purchase Price (Cash / Listed)
          </label>
          <span className="text-xl sm:text-2xl text-emerald-400 font-black font-mono">
            ${params.purchasePrice.toLocaleString()}
          </span>
        </div>

        <input
          id="price-range"
          type="range"
          min="1500"
          max="35000"
          step="250"
          value={params.purchasePrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
        />

        {/* Quick select chips for common cash budgets */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Presets:</span>
          {[3500, 5000, 7500, 10000, 15000, 25000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePriceChange(preset)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                params.purchasePrice === preset
                  ? 'bg-gradient-to-r from-[#29abe2] to-[#1e88b8] text-white shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              ${preset >= 1000 ? `${preset / 1000}k` : preset}
            </button>
          ))}
        </div>

        {/* Insurance Coverage Toggle */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
          <span className="text-slate-400 font-medium">Insurance Coverage:</span>
          <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setParams((p) => ({ ...p, insuranceType: 'liability' }))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                params.insuranceType === 'liability'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Liability Only ($850/yr)
            </button>
            <button
              type="button"
              onClick={() => setParams((p) => ({ ...p, insuranceType: 'full' }))}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                params.insuranceType === 'full'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Coverage ($1,800/yr)
            </button>
          </div>
        </div>
      </div>

      {/* Summary Outlay Cards */}
      <div className="grid grid-cols-2 gap-3.5 p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 mb-5">
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total 5-Year Outlay</p>
          <p className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 mt-0.5">
            ${projection.fiveYearTotal.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400">All-in operating costs</span>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Effective Cost / Month</p>
          <p className="text-2xl sm:text-3xl font-black font-mono text-white mt-0.5">
            ${projection.monthlyAverage}<span className="text-sm font-normal text-slate-400">/mo</span>
          </p>
          <span className="text-[10px] text-slate-400">Over 60 months</span>
        </div>
      </div>

      {/* Cost Distribution Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="text-[10.5px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
          <span>5-Year Operating Expense Distribution</span>
          <span className="text-slate-500 font-mono">12,000 mi/yr</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-2.5">
          {/* Depreciation */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <TrendingDown size={13} className="text-amber-400" />
              <span>Depreciation:</span>
            </span>
            <span className="font-mono font-semibold text-white">
              ${projection.breakdown.depreciation.toLocaleString()}
            </span>
          </div>

          {/* Maintenance & Repairs */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Wrench size={13} className="text-[#29abe2]" />
              <span>Maintenance &amp; Repairs:</span>
            </span>
            <span className="font-mono font-semibold text-white">
              ${projection.breakdown.maintenance.toLocaleString()}
            </span>
          </div>

          {/* Insurance */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Insurance ({params.insuranceType === 'liability' ? 'Liability' : 'Full'}):</span>
            </span>
            <span className="font-mono font-semibold text-white">
              ${projection.breakdown.insurance.toLocaleString()}
            </span>
          </div>

          {/* Fuel */}
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-2">
              <Fuel size={13} className="text-sky-400" />
              <span>Fuel (25 MPG @ $3.40/gal):</span>
            </span>
            <span className="font-mono font-semibold text-white">
              ${projection.breakdown.fuel.toLocaleString()}
            </span>
          </div>

          {/* Taxes & Registration */}
          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800/80">
            <span className="flex items-center gap-2 text-slate-400">
              <Receipt size={13} className="text-slate-400" />
              <span>State Tax (6.25%) &amp; Reg:</span>
            </span>
            <span className="font-mono font-semibold text-slate-300">
              ${projection.breakdown.taxFees.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostOfOwnershipWidget;
