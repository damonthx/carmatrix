import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  DollarSign,
  AlertTriangle,
  HelpCircle,
  ArrowUpRight,
  ChevronDown,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  TrendingDown,
  Info,
  Layers,
  ArrowRightLeft
} from 'lucide-react';

export interface LoanCalculationInput {
  mode: 'targetPrice' | 'reverseBudget';
  vehiclePrice: number;
  downPayment: number;
  downPaymentType: 'dollar' | 'percent';
  tradeInValue: number;
  loanBalance: number;
  loanTerm: number;
  apr: number;
  salesTaxRate: number;
  fees: number;
  monthlyBudget: number;
  annualIncome: number;
}

export interface LoanCalculationResult {
  effectiveVehiclePrice: number;
  netTradeInEquity: number;
  actualDownPayment: number;
  totalTax: number;
  outTheDoorPrice: number;
  financedPrincipal: number;
  monthlyPayment: number;
  totalLoanRepayment: number;
  totalInterestPaid: number;
  recommendedGrossIncome: number;
  incomeRequiredRule20410: number;
  is20410Compliant: {
    downPaymentPass: boolean;
    termPass: boolean;
    overallPass: boolean;
  };
}

const AUTO_REFINANCE_AFFILIATE_URL = "https://www.myautoloan.com/?aff_id=YOUR_MYAUTOLOAN_ID";

const POPULAR_PRICE_PRESETS = [4500, 12000, 25000, 38000, 55000, 75000];
const POPULAR_BUDGET_PRESETS = [300, 450, 600, 800, 1000];
const LOAN_TERMS = [24, 36, 48, 60, 72, 84];

export const AutoLoanCalculatorWidget: React.FC = () => {
  // Mode selection: 'targetPrice' ("Can I afford this specific car?") or 'reverseBudget' ("What can I afford?")
  const [mode, setMode] = useState<'targetPrice' | 'reverseBudget'>('targetPrice');

  // Core Variables
  const [vehiclePrice, setVehiclePrice] = useState<number>(34850);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(550);
  const [annualIncome, setAnnualIncome] = useState<number>(75000);

  // Down Payment ($ or %)
  const [downPaymentType, setDownPaymentType] = useState<'dollar' | 'percent'>('dollar');
  const [downPaymentValue, setDownPaymentValue] = useState<number>(3500); // represents $ or % based on downPaymentType

  // Trade-In & Loan Balance (Net Equity)
  const [includeTradeIn, setIncludeTradeIn] = useState<boolean>(false);
  const [tradeInValue, setTradeInValue] = useState<number>(0);
  const [existingLoanBalance, setExistingLoanBalance] = useState<number>(0);

  // Loan Terms & Rates
  const [loanTerm, setLoanTerm] = useState<number>(60);
  const [apr, setApr] = useState<number>(0.0799); // 7.99%
  const [isCustomApr, setIsCustomApr] = useState<boolean>(false);

  // Taxes & Government / Doc Fees
  const [salesTaxRate, setSalesTaxRate] = useState<number>(6.25); // 6.25%
  const [estimatedFees, setEstimatedFees] = useState<number>(450); // DMV & Doc fees

  // Live Calculations Memo
  const calculation = useMemo<LoanCalculationResult>(() => {
    const monthlyRate = (apr || 0) / 12;
    const netTradeInEquity = includeTradeIn ? Math.max(-10000, tradeInValue - existingLoanBalance) : 0;
    const taxDecimal = Math.max(0, salesTaxRate) / 100;
    const fees = Math.max(0, estimatedFees);

    if (mode === 'targetPrice') {
      const price = Math.max(0, vehiclePrice);
      const actualDown = downPaymentType === 'percent'
        ? Math.round(price * (Math.max(0, downPaymentValue) / 100))
        : Math.min(price, Math.max(0, downPaymentValue));

      // In most states, trade-in reduces taxable amount if positive
      const taxableBase = Math.max(0, price - Math.max(0, netTradeInEquity));
      const totalTax = Math.round(taxableBase * taxDecimal);
      const outTheDoorPrice = price + totalTax + fees;

      // Financed Principal = Out-The-Door minus Down Payment minus Net Trade-In Equity
      // If negative equity exists on trade-in, it rolls into the loan
      const financedPrincipal = Math.max(0, outTheDoorPrice - actualDown - netTradeInEquity);

      // Standard Amortization Formula
      const monthlyPayment = financedPrincipal > 0
        ? monthlyRate > 0
          ? Math.round((financedPrincipal * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm))) / (Math.pow(1 + monthlyRate, loanTerm) - 1))
          : Math.round(financedPrincipal / loanTerm)
        : 0;

      const totalLoanRepayment = monthlyPayment * loanTerm;
      const totalInterestPaid = Math.max(0, totalLoanRepayment - financedPrincipal);

      // Affordability Rules:
      // 10% gross monthly income rule: Payment <= 10% Gross Income => Gross Monthly = Payment * 10
      const recommendedGrossMonthly = monthlyPayment * 10;
      const recommendedGrossIncome = recommendedGrossMonthly * 12;

      // 20/4/10 Rule Compliance:
      // - 20% down payment
      // - 48 months or fewer
      // - monthly payment <= 10% gross income
      const downPaymentPct = price > 0 ? (actualDown / price) * 100 : 0;
      const downPaymentPass = downPaymentPct >= 19.9;
      const termPass = loanTerm <= 48;
      const overallPass = downPaymentPass && termPass;

      return {
        effectiveVehiclePrice: price,
        netTradeInEquity,
        actualDownPayment: actualDown,
        totalTax,
        outTheDoorPrice,
        financedPrincipal,
        monthlyPayment,
        totalLoanRepayment,
        totalInterestPaid,
        recommendedGrossIncome,
        incomeRequiredRule20410: recommendedGrossIncome,
        is20410Compliant: {
          downPaymentPass,
          termPass,
          overallPass
        }
      };
    } else {
      // REVERSE BUDGET MODE: "What can I afford?"
      // User specifies monthlyBudget -> back-calculate maximum loan principal
      const targetMonthly = Math.max(0, monthlyBudget);
      const maxLoanPrincipal = monthlyRate > 0
        ? Math.round((targetMonthly * (1 - Math.pow(1 + monthlyRate, -loanTerm))) / monthlyRate)
        : Math.round(targetMonthly * loanTerm);

      // actualDown from value
      const rawDown = downPaymentType === 'dollar' ? downPaymentValue : (maxLoanPrincipal * 0.15);
      const actualDown = Math.max(0, rawDown);

      // Max purchasing power = Max loan principal + Down payment + Net Trade equity - Taxes & fees approximation
      // Principal = (Price + Tax + Fees) - Down - Trade
      // Price * (1 + Tax) = Principal + Down + Trade - Fees
      const netPurchasingCapacity = Math.max(0, maxLoanPrincipal + actualDown + netTradeInEquity - fees);
      const estimatedMaxPrice = Math.round(netPurchasingCapacity / (1 + taxDecimal));

      const taxableBase = Math.max(0, estimatedMaxPrice - Math.max(0, netTradeInEquity));
      const totalTax = Math.round(taxableBase * taxDecimal);
      const outTheDoorPrice = estimatedMaxPrice + totalTax + fees;
      const financedPrincipal = Math.max(0, maxLoanPrincipal);

      const totalLoanRepayment = targetMonthly * loanTerm;
      const totalInterestPaid = Math.max(0, totalLoanRepayment - financedPrincipal);

      const recommendedGrossIncome = targetMonthly * 10 * 12;

      return {
        effectiveVehiclePrice: estimatedMaxPrice,
        netTradeInEquity,
        actualDownPayment: actualDown,
        totalTax,
        outTheDoorPrice,
        financedPrincipal,
        monthlyPayment: targetMonthly,
        totalLoanRepayment,
        totalInterestPaid,
        recommendedGrossIncome,
        incomeRequiredRule20410: recommendedGrossIncome,
        is20410Compliant: {
          downPaymentPass: true,
          termPass: loanTerm <= 48,
          overallPass: loanTerm <= 48
        }
      };
    }
  }, [
    mode,
    vehiclePrice,
    monthlyBudget,
    downPaymentType,
    downPaymentValue,
    includeTradeIn,
    tradeInValue,
    existingLoanBalance,
    loanTerm,
    apr,
    salesTaxRate,
    estimatedFees
  ]);

  // Handle price slider and input
  const handlePriceChange = (val: number) => {
    const clamped = Math.max(0, Math.min(250000, val || 0));
    setVehiclePrice(clamped);
  };

  const handleDownPaymentChange = (val: number) => {
    const maxVal = downPaymentType === 'percent' ? 100 : 150000;
    setDownPaymentValue(Math.max(0, Math.min(maxVal, val || 0)));
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-300/40 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center justify-center text-amber-500 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <SlidersHorizontal size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Auto Loan &amp; Affordability Terminal</h3>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">Calculate exact payments by vehicle price or estimate maximum purchasing power.</p>
          </div>
        </div>

        {/* Primary Hero Calculation Badge */}
        <div className="bg-[#29abe2] text-white p-4 rounded-2xl shrink-0 w-full md:w-auto min-w-[220px] shadow-sm">
          <span className="text-[11px] font-semibold text-sky-100 uppercase tracking-wider block">
            {mode === 'targetPrice' ? 'Est. Monthly Payment' : 'Estimated Max Vehicle Price'}
          </span>
          <span className="text-3xl font-black text-white leading-none block mt-1 font-poppins">
            {mode === 'targetPrice' 
              ? `$${calculation.monthlyPayment.toLocaleString()}/mo`
              : `$${calculation.effectiveVehiclePrice.toLocaleString()}`}
          </span>
          <span className="text-[11px] text-sky-100 block mt-1 font-medium font-poppins">
            at {((apr || 0) * 100).toFixed(2)}% APR ({loanTerm} mo)
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/70">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setMode('targetPrice')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'targetPrice'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <DollarSign size={14} className={mode === 'targetPrice' ? 'text-[#29abe2]' : 'text-slate-400'} />
            <span>Target Price ("Can I afford this car?")</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('reverseBudget')}
            className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
              mode === 'reverseBudget'
                ? 'bg-slate-900 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Calculator size={14} className={mode === 'reverseBudget' ? 'text-[#29abe2]' : 'text-slate-400'} />
            <span>Reverse Budget ("What can I afford?")</span>
          </button>
        </div>

        <span className="text-[10.5px] uppercase bg-emerald-500/10 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-bold hidden md:inline">
          Live Calculation
        </span>
      </div>

      {/* Primary Input Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-7 space-y-5">
          {/* Target Price Mode: Primary Vehicle Price Input & Synchronized Slider */}
          {mode === 'targetPrice' ? (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign size={14} className="text-[#29abe2]" />
                  <span>Vehicle Asking / Sticker Price</span>
                </label>
                <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 font-mono text-sm font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all self-start sm:self-auto">
                  <span className="text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min="1000"
                    max="250000"
                    step="250"
                    value={vehiclePrice === 0 ? '' : vehiclePrice}
                    onChange={(e) => handlePriceChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-28 outline-none bg-transparent font-bold"
                  />
                </div>
              </div>

              {/* Synchronized Range Slider */}
              <input
                type="range"
                min="1500"
                max="120000"
                step="500"
                value={vehiclePrice}
                onChange={(e) => handlePriceChange(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
              />

              {/* Quick Preset Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
                {POPULAR_PRICE_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePriceChange(p)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      vehiclePrice === p
                        ? 'bg-[#29abe2] text-white border-[#29abe2] font-bold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    ${p.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Reverse Budget Mode: Target Monthly Input */
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <label className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calculator size={14} className="text-[#29abe2]" />
                  <span>Target Monthly Payment Budget</span>
                </label>
                <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 font-mono text-sm font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all self-start sm:self-auto">
                  <span className="text-slate-400 mr-1">$</span>
                  <input
                    type="number"
                    min="100"
                    max="3000"
                    step="25"
                    value={monthlyBudget === 0 ? '' : monthlyBudget}
                    onChange={(e) => setMonthlyBudget(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-24 outline-none bg-transparent font-bold"
                  />
                  <span className="text-slate-400 ml-1 text-xs">/mo</span>
                </div>
              </div>

              <input
                type="range"
                min="150"
                max="1800"
                step="25"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
              />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-semibold mr-1">Presets:</span>
                {POPULAR_BUDGET_PRESETS.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setMonthlyBudget(b)}
                    className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      monthlyBudget === b
                        ? 'bg-[#29abe2] text-white border-[#29abe2] font-bold shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:text-slate-900'
                    }`}
                  >
                    ${b}/mo
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Financing Variables Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Down Payment with $ or % Toggle */}
            <div className="col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700">Down Payment</label>
                <div className="flex items-center text-[10px] font-bold bg-slate-200/80 rounded-md p-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (downPaymentType !== 'dollar') {
                        setDownPaymentType('dollar');
                        setDownPaymentValue(calculation.actualDownPayment);
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded ${downPaymentType === 'dollar' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    $
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (downPaymentType !== 'percent') {
                        setDownPaymentType('percent');
                        const pct = vehiclePrice > 0 ? Math.round((downPaymentValue / vehiclePrice) * 100) : 10;
                        setDownPaymentValue(Math.min(100, Math.max(0, pct)));
                      }
                    }}
                    className={`px-1.5 py-0.5 rounded ${downPaymentType === 'percent' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
                  >
                    %
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                {downPaymentType === 'dollar' && <span className="text-slate-400 mr-1">$</span>}
                <input
                  type="number"
                  value={downPaymentValue === 0 ? '' : downPaymentValue}
                  onChange={(e) => handleDownPaymentChange(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder={downPaymentType === 'dollar' ? '3000' : '15'}
                  className="w-full outline-none bg-transparent font-poppins"
                />
                {downPaymentType === 'percent' && <span className="text-slate-400 ml-1">%</span>}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                = ${calculation.actualDownPayment.toLocaleString()} cash
              </span>
            </div>

            {/* Loan Term */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Loan Term</label>
              <div className="relative">
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer font-poppins shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                >
                  {LOAN_TERMS.map((t) => (
                    <option key={t} value={t}>
                      {t} mo {t <= 48 ? '★ Recommended' : t >= 72 ? '⚠ Extended' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                {(loanTerm / 12).toFixed(1)} years duration
              </span>
            </div>

            {/* Credit Tier / APR */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700">APR Rate</label>
                <button
                  type="button"
                  onClick={() => setIsCustomApr(!isCustomApr)}
                  className="text-[10px] text-[#29abe2] font-semibold hover:underline cursor-pointer font-poppins"
                >
                  {isCustomApr ? 'Presets' : 'Custom'}
                </button>
              </div>

              {isCustomApr ? (
                <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                  <input
                    type="number"
                    step="0.05"
                    value={Number(((apr || 0) * 100).toFixed(2))}
                    onChange={(e) => setApr(Math.max(0, Number(e.target.value) / 100))}
                    className="w-full outline-none bg-transparent font-poppins"
                    placeholder="7.99"
                  />
                  <span className="text-slate-400 ml-1 font-poppins">%</span>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={apr}
                    onChange={(e) => setApr(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer font-poppins shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                  >
                    <option value={0.065}>740+ Tier 1 (6.50%)</option>
                    <option value={0.0799}>700-739 Tier 2 (7.99%)</option>
                    <option value={0.0979}>680-699 Tier 3 (9.79%)</option>
                    <option value={0.14}>630-679 Subprime (14.0%)</option>
                    <option value={0.2}>&lt;630 Deep Subprime (20.0%)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}
              <span className="text-[10px] text-slate-400 block mt-1">
                {((apr || 0) * 100).toFixed(2)}% APR applied
              </span>
            </div>

            {/* Sales Tax Rate */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Sales Tax %</label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <input
                  type="number"
                  step="0.05"
                  value={salesTaxRate === 0 ? '' : salesTaxRate}
                  onChange={(e) => setSalesTaxRate(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="6.25"
                  className="w-full outline-none bg-transparent font-poppins"
                />
                <span className="text-slate-400 ml-1 font-poppins">%</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                = ${calculation.totalTax.toLocaleString()} tax
              </span>
            </div>
          </div>

          {/* Trade-in Value & Existing Loan (Net Equity Row) */}
          <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div
                className="flex items-center gap-2 cursor-pointer select-none"
                onClick={() => setIncludeTradeIn(!includeTradeIn)}
              >
                <div className={"w-9 h-5 rounded-full relative transition-colors " + (includeTradeIn ? "bg-[#29abe2]" : "bg-slate-300")}>
                  <div className={"w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all " + (includeTradeIn ? "left-4.5" : "left-0.5")}></div>
                </div>
                <span className="text-xs text-slate-800 font-bold">Incorporate Trade-In Net Equity</span>
              </div>

              {includeTradeIn && (
                <span className={`text-xs font-mono font-bold ${calculation.netTradeInEquity >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Net Equity: {calculation.netTradeInEquity >= 0 ? `+$${calculation.netTradeInEquity.toLocaleString()}` : `-$${Math.abs(calculation.netTradeInEquity).toLocaleString()}`}
                </span>
              )}
            </div>

            {includeTradeIn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Trade-in Fair Market Value</label>
                  <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      value={tradeInValue === 0 ? '' : tradeInValue}
                      onChange={(e) => setTradeInValue(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="e.g. 14000"
                      className="w-full outline-none bg-transparent font-poppins"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">Existing Loan Payoff Balance</label>
                  <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                    <span className="text-slate-400 mr-1">$</span>
                    <input
                      type="number"
                      value={existingLoanBalance === 0 ? '' : existingLoanBalance}
                      onChange={(e) => setExistingLoanBalance(e.target.value === '' ? 0 : Number(e.target.value))}
                      placeholder="e.g. 10000"
                      className="w-full outline-none bg-transparent font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Intelligence & Amortization Breakdown */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="p-5 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-[#29abe2] uppercase tracking-wider flex items-center gap-1.5">
                <Layers size={14} />
                <span>Financial Debt Architecture</span>
              </h4>
              <span className="text-xs font-mono text-slate-400 font-bold">
                {loanTerm} Months Amortized
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Vehicle Out-The-Door (OTD):</span>
                <span className="font-bold text-white">${calculation.outTheDoorPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>- Cash Down Payment:</span>
                <span className="font-bold text-emerald-400">-${calculation.actualDownPayment.toLocaleString()}</span>
              </div>
              {calculation.netTradeInEquity !== 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>- Net Trade-In Equity:</span>
                  <span className={`font-bold ${calculation.netTradeInEquity > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {calculation.netTradeInEquity > 0 ? `-$${calculation.netTradeInEquity.toLocaleString()}` : `+$${Math.abs(calculation.netTradeInEquity).toLocaleString()} (Underwater)`}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-slate-200 pt-2 border-t border-slate-800 font-semibold">
                <span>Financed Loan Principal:</span>
                <span className="font-bold text-white text-sm">${calculation.financedPrincipal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>Total Interest Paid ({((apr || 0) * 100).toFixed(2)}% APR):</span>
                <span className="font-bold">+${calculation.totalInterestPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/80">
                <span>Total Debt Obligation:</span>
                <span className="font-black text-white text-base">${calculation.totalLoanRepayment.toLocaleString()}</span>
              </div>
            </div>

            {/* Interest-to-Principal Warning Badge if interest is high */}
            {calculation.totalInterestPaid > calculation.financedPrincipal * 0.25 && (
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-400" />
                <span className="leading-snug">
                  High interest trap: You are paying <strong className="text-white">${calculation.totalInterestPaid.toLocaleString()}</strong> in interest ({Math.round((calculation.totalInterestPaid / Math.max(1, calculation.financedPrincipal)) * 100)}% of financed vehicle cost).
                </span>
              </div>
            )}
          </div>

          {/* CarMatrix Underwriting Benchmark / 20/4/10 Rule */}
          <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-[#29abe2]" />
                <span>CarMatrix Affordability Benchmark</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                calculation.is20410Compliant.overallPass
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {calculation.is20410Compliant.overallPass ? 'Conservative (20/4/10 Safe)' : 'Extended Debt Warning'}
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600 space-y-1.5">
              <div className="flex justify-between items-center">
                <span>Recommended Gross Annual Income:</span>
                <strong className="text-slate-900 font-mono text-sm">
                  ${Math.round(calculation.recommendedGrossIncome).toLocaleString()}/yr
                </strong>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                10% Underwriting Rule: Monthly payment ideally remains &le;10% of gross monthly income (${Math.round(calculation.recommendedGrossIncome / 12).toLocaleString()}/mo).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Minimal Rate Intel Bar */}
      {apr > 0.08 && (
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 transition-all duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 shrink-0">
                <AlertTriangle size={16} />
              </div>
              <p className="text-xs text-slate-700 leading-snug font-poppins">
                Your <strong className="text-slate-900 font-bold">{((apr || 0) * 100).toFixed(2)}% APR</strong> exceeds prime benchmarks (6.5%–8.0%). Refinancing or shopping local credit unions could save <strong className="text-emerald-700 font-bold">~${Math.round(calculation.totalInterestPaid * 0.28).toLocaleString()}</strong>.
              </p>
            </div>

            <div className="shrink-0 flex items-center self-end sm:self-auto pl-10 sm:pl-0">
              <a
                href={AUTO_REFINANCE_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/40 hover:bg-amber-500/20 text-amber-900 text-xs font-bold transition-all cursor-pointer font-poppins"
              >
                <span>Compare Rates</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoLoanCalculatorWidget;
