import React, { useState } from 'react';
import { ArrowLeftRight, CheckCircle2, DollarSign, HelpCircle, Sparkles, TrendingUp } from 'lucide-react';

export default function LeaseVsFinanceWidget() {
  const [vehiclePrice, setVehiclePrice] = useState(38000);
  const [downPayment, setDownPayment] = useState(4000);
  const [loanApr, setLoanApr] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(60);
  
  // Lease assumptions
  const leaseTerm = 36;
  const [residualPercent, setResidualPercent] = useState(58); // 58% after 36mo
  const [leaseMoneyFactor, setLeaseMoneyFactor] = useState(0.0027); // ~6.5% APR equivalent

  // Finance calculation
  const financePrincipal = Math.max(0, vehiclePrice - downPayment);
  const monthlyInterestRate = loanApr / 100 / 12;
  const financeMonthly = monthlyInterestRate === 0
    ? financePrincipal / loanTerm
    : (financePrincipal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, loanTerm)) /
      (Math.pow(1 + monthlyInterestRate, loanTerm) - 1);
  const financeTotalInterest = (financeMonthly * loanTerm) - financePrincipal;
  const finance3YearSpend = downPayment + (financeMonthly * 36);
  // Estimated equity at Year 3 (assuming vehicle depreciates to 58% of original MSRP)
  const vehicleValueYear3 = vehiclePrice * (residualPercent / 100);
  // Approximate loan balance remaining at 36 months of 60 month loan
  const approxRemainingBalance = financePrincipal * 0.44; 
  const financeEstimatedEquityYear3 = Math.max(0, vehicleValueYear3 - approxRemainingBalance);
  const financeNetCost3Years = finance3YearSpend - financeEstimatedEquityYear3;

  // Lease calculation
  const leaseGrossCap = vehiclePrice;
  const leaseNetCap = Math.max(0, leaseGrossCap - downPayment);
  const leaseResidualValue = vehiclePrice * (residualPercent / 100);
  const monthlyDepreciation = (leaseNetCap - leaseResidualValue) / leaseTerm;
  const monthlyRentCharge = (leaseNetCap + leaseResidualValue) * leaseMoneyFactor;
  const leaseMonthly = Math.max(0, monthlyDepreciation + monthlyRentCharge);
  const leaseTotalSpend3Years = downPayment + (leaseMonthly * leaseTerm);

  return (
    <div className="bg-white rounded-3xl border border-slate-300/80 shadow-[0_12px_32px_rgba(15,23,42,0.08)] p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 border border-violet-200/60 rounded-full text-violet-800 text-xs font-bold mb-2">
            <ArrowLeftRight size={14} className="text-violet-600" />
            <span>Financing Decision Engine</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lease vs. Finance Decision Simulator</h3>
          <p className="text-slate-500 text-sm mt-1">Compare 3-year cash outflow, monthly payments, and long-term equity to make the best financial choice.</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Purchase Assumptions</h4>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Vehicle Negotiated Price</span>
              <span className="text-[#29abe2]">${vehiclePrice.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="15000"
              max="90000"
              step="1000"
              value={vehiclePrice}
              onChange={(e) => setVehiclePrice(Number(e.target.value))}
              className="w-full accent-[#29abe2]"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
              <span>Down Payment / Trade-In</span>
              <span className="text-slate-900">${downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full accent-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Loan APR (%)</label>
              <input
                type="number"
                step="0.1"
                value={loanApr}
                onChange={(e) => setLoanApr(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Loan Term</label>
              <select
                value={loanTerm}
                onChange={(e) => setLoanTerm(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
              >
                <option value={36}>36 Months</option>
                <option value={48}>48 Months</option>
                <option value={60}>60 Months</option>
                <option value={72}>72 Months</option>
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            Lease assumes 36-month term, {residualPercent}% residual value, and 12,000 miles/yr.
          </div>
        </div>

        {/* Right: Side-by-Side Comparison Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Option A: 36-Month Lease */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-violet-700 bg-violet-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Option A: 36-Month Lease
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                ${Math.round(leaseMonthly)}
                <span className="text-xs font-semibold text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Lower monthly payment, but zero equity ownership.</p>
            </div>

            <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>3-Year Out-Of-Pocket:</span>
                <span className="font-bold text-slate-900">${Math.round(leaseTotalSpend3Years).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Vehicle Equity at Year 3:</span>
                <span className="font-bold text-slate-400">$0 (Car returned)</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Mileage Allowance:</span>
                <span className="font-bold text-slate-900">12,000 mi / year</span>
              </div>
            </div>

            <div className="p-3 bg-violet-50/70 border border-violet-200/60 rounded-xl text-[11px] text-violet-950 space-y-1">
              <strong className="block text-violet-900">Best for you if:</strong>
              You want a new car every 3 years, prefer driving under factory warranty, and have predictable annual mileage.
            </div>
          </div>

          {/* Option B: Purchase / Finance */}
          <div className="p-6 rounded-2xl bg-white border-2 border-[#29abe2] shadow-md shadow-sky-500/10 flex flex-col justify-between space-y-4 relative">
            <div className="absolute -top-3 right-4 bg-[#29abe2] text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm uppercase tracking-wider">
              Builds Wealth
            </div>

            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block mb-2">
                Option B: {loanTerm}-Mo Loan
              </span>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                ${Math.round(financeMonthly)}
                <span className="text-xs font-semibold text-slate-500"> / month</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Higher monthly payment, but you build real equity asset.</p>
            </div>

            <div className="space-y-2.5 text-xs border-t border-slate-200 pt-4">
              <div className="flex justify-between text-slate-600">
                <span>3-Year Out-Of-Pocket:</span>
                <span className="font-bold text-slate-900">${Math.round(finance3YearSpend).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>Estimated Equity at Year 3:</span>
                <span>+${Math.round(financeEstimatedEquityYear3).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Net 3-Year True Cost:</span>
                <span className="font-bold text-slate-900">${Math.round(financeNetCost3Years).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-3 bg-sky-50/70 border border-sky-200/60 rounded-xl text-[11px] text-sky-950 space-y-1">
              <strong className="block text-sky-900">Best for you if:</strong>
              You plan to keep the car 5+ years, want no mileage penalties, and prefer owning an asset after pay-off.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
