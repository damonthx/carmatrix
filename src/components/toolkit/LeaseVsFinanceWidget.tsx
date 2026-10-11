import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, 
  CheckCircle2, 
  DollarSign, 
  HelpCircle, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  Info 
} from 'lucide-react';

export interface LeaseVsFinanceWidgetProps {
  className?: string;
}

export const LeaseVsFinanceWidget: React.FC<LeaseVsFinanceWidgetProps> = ({ className = '' }) => {
  const [vehiclePrice, setVehiclePrice] = useState<number>(8500);
  const [termMonths, setTermMonths] = useState<number>(36);
  const [downPayment, setDownPayment] = useState<number>(1000);
  const [financeApr, setFinanceApr] = useState<number>(8.5); // Used car loan APR

  // Dynamic check: true retail leasing is practically non-existent sub-$15k
  const isLeaseEligible = vehiclePrice >= 15000;

  const comparison = useMemo(() => {
    // 1. Finance Calculation (Standard Amortization)
    const principal = Math.max(0, vehiclePrice - downPayment);
    const monthlyRate = financeApr / 100 / 12;
    const monthlyFinance =
      principal > 0
        ? (principal * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
          (Math.pow(1 + monthlyRate, termMonths) - 1)
        : 0;
    const totalFinancePaid = monthlyFinance * termMonths + downPayment;

    // 2. Lease Calculation (Simulated or Active)
    // Residual for sub-$15k cars drops faster or hits a flat baseline ($2,000)
    const residualPct = vehiclePrice >= 25000 ? 0.55 : 0.40;
    const residualValue = Math.max(1500, vehiclePrice * residualPct);
    const depreciationCharge = (vehiclePrice - downPayment - residualValue) / termMonths;
    const moneyFactor = 0.0028; // Equivalent to ~6.7% APR
    const rentCharge = (vehiclePrice - downPayment + residualValue) * moneyFactor;
    const monthlyLease = Math.max(0, depreciationCharge + rentCharge);
    const totalLeasePaid = monthlyLease * termMonths + downPayment;

    return {
      finance: {
        monthly: Math.round(monthlyFinance),
        totalCost: Math.round(totalFinancePaid),
        equityAtEnd: vehiclePrice >= 8000 ? Math.round(vehiclePrice * 0.5) : 2500,
      },
      lease: {
        monthly: Math.round(monthlyLease),
        totalCost: Math.round(totalLeasePaid),
        residualValue: Math.round(residualValue),
      },
    };
  }, [vehiclePrice, termMonths, downPayment, financeApr]);

  const handlePriceChange = (value: number) => {
    const clamped = Math.max(2000, Math.min(100000, value || 0));
    setVehiclePrice(clamped);
  };

  return (
    <div className={`relative overflow-hidden bg-slate-900/95 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-2xl backdrop-blur-2xl ${className}`}>
      {/* Specular top rim light */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-[#29abe2]/15 to-transparent border border-sky-400/35 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <ArrowLeftRight size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight font-poppins">
              Lease vs. Finance Terminal
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
              Compare monthly payments, loan amortization, and equity retention.
            </p>
          </div>
        </div>

        <span className="text-[10.5px] font-bold uppercase bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg border border-emerald-500/25 shrink-0 self-start sm:self-auto">
          Live Calculation
        </span>
      </div>

      {/* Price Slider & Direct Input Controls */}
      <div className="space-y-3 mb-6 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800/80">
        <div className="flex justify-between items-baseline text-xs sm:text-sm text-slate-400">
          <span className="font-semibold text-slate-300">Vehicle Price (Market Value)</span>
          <span className="text-2xl font-black text-[#29abe2] font-mono">
            ${vehiclePrice.toLocaleString()}
          </span>
        </div>

        <input
          type="range"
          min="2000"
          max="60000"
          step="250"
          value={vehiclePrice}
          onChange={(e) => handlePriceChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
        />

        {/* Quick select budget chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider mr-1">Presets:</span>
          {[4000, 7500, 12000, 18000, 28000, 45000].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => handlePriceChange(preset)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                vehiclePrice === preset
                  ? 'bg-gradient-to-r from-[#29abe2] to-[#1e88b8] text-white shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              ${preset / 1000}k
            </button>
          ))}
        </div>

        {/* Loan Term & Down Payment Mini Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Down Payment ($)</label>
            <input
              type="number"
              placeholder="1000"
              value={downPayment === 0 ? '' : downPayment}
              onChange={(e) => setDownPayment(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white outline-none focus:border-[#29abe2]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Term Length</label>
            <select
              value={termMonths}
              onChange={(e) => setTermMonths(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-1.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] cursor-pointer"
            >
              <option value={24}>24 Months (2 Yr)</option>
              <option value={36}>36 Months (3 Yr)</option>
              <option value={48}>48 Months (4 Yr)</option>
              <option value={60}>60 Months (5 Yr)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">Used Loan APR (%)</label>
            <input
              type="number"
              step="0.1"
              placeholder="8.5"
              value={financeApr === 0 ? '' : financeApr}
              onChange={(e) => setFinanceApr(e.target.value === '' ? 0 : Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-white outline-none focus:border-[#29abe2]"
            />
          </div>
        </div>
      </div>

      {/* Sub-$15k Market Reality Banner */}
      {!isLeaseEligible && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-200 flex items-start gap-3">
          <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle size={14} strokeWidth={2.4} />
          </div>
          <div>
            <p className="font-bold text-amber-300 mb-0.5">Market Reality Note (Sub-$15,000 Vehicle):</p>
            Lenders and captive finance institutions rarely write retail leases on vehicles under $15,000. In this range, private cash purchases or credit union financing deliver vastly superior equity retention and zero lease-turn-in penalties.
          </div>
        </div>
      )}

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Finance Column */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/5 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-3 right-3 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Builds Equity
          </div>

          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Financing ({termMonths} mo @ {financeApr}%)
            </p>
            <p className="text-3xl sm:text-4xl font-black font-mono text-emerald-400 my-1">
              ${comparison.finance.monthly}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Full asset ownership with no mileage restrictions.</p>
          </div>

          <div className="text-xs space-y-2 mt-5 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Total Outlay:</span>
              <span className="font-mono font-bold text-white">${comparison.finance.totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span className="font-semibold">End Asset Equity:</span>
              <span className="font-mono font-black">+${comparison.finance.equityAtEnd.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Lease Column */}
        <div className={`p-5 sm:p-6 rounded-2xl border flex flex-col justify-between transition-all ${
          isLeaseEligible
            ? 'bg-slate-950/70 border-slate-700/80 shadow-md'
            : 'bg-slate-950/40 border-slate-800/60 opacity-60'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Lease ({termMonths} mo)
              </p>
              {!isLeaseEligible && (
                <span className="text-[10px] text-amber-400 uppercase font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  Uncommon Sub-$15k
                </span>
              )}
            </div>
            <p className="text-3xl sm:text-4xl font-black font-mono text-white my-1">
              ${comparison.lease.monthly}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </p>
            <p className="text-xs text-slate-400 mt-1">Lower monthly payment, but vehicle must be returned.</p>
          </div>

          <div className="text-xs space-y-2 mt-5 pt-4 border-t border-slate-800">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-400">Total Outlay:</span>
              <span className="font-mono font-bold text-white">${comparison.lease.totalCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>End Asset Value:</span>
              <span className="font-mono">$0 (Return Car)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseVsFinanceWidget;
