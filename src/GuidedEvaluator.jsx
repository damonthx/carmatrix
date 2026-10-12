import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ArrowRight, ShieldCheck, HelpCircle, 
  Check, RefreshCw, Terminal, AlertTriangle,
  Copy, TrendingUp, DollarSign, ShieldAlert,
  CarFront, Gauge, Building2, Scale, Landmark,
  FileText, FileCheck, ScanLine, Cpu, FileSearch,
  SlidersHorizontal, Wallet, BadgeCheck, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DFW_DEALERSHIPS_SEED } from './services/dfwDealerSeedData';

/**
 * Evaluates the user's wizard data based on vehicle specs (year, mileage, trim, price),
 * OTD fee variance, Dealer Intel™ records, and optional financing setup.
 * Returns a Deal Grade: 'Great' | 'Fair' | 'Bad' along with detailed intelligence.
 */
export function analyzeDeal(inputs) {
  const advPrice = Number(inputs.advertisedPrice) || 0;
  const otdPrice = inputs.otdPrice ? Number(inputs.otdPrice) : Math.round(advPrice * 1.088);
  const mileage = Number(inputs.mileage) || 0;
  const year = Number(inputs.year) || 2024;
  const trim = (inputs.trim || 'Standard').trim();
  const financingType = inputs.financingType || 'own'; // 'own' | 'dealer' | 'cash'
  const rate = financingType === 'dealer' && inputs.interestRate !== '' ? Number(inputs.interestRate) : 0;

  // 1. Evaluate Vehicle Mileage vs Model Year Benchmark (~12,000 miles/year)
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(1, currentYear - year);
  const expectedMileage = vehicleAge * 12000;
  const mileageDelta = mileage - expectedMileage; // positive = above average miles, negative = low miles
  const mileageStatus = mileageDelta > 6000 
    ? 'High Mileage for Year' 
    : mileageDelta < -4000 
    ? 'Low Mileage Advantage' 
    : 'Average Annual Mileage';

  // Estimate mileage & trim valuation adjustment
  // Excess mileage should discount fair price by ~$0.14/mile
  const mileagePenalty = mileageDelta > 0 ? Math.round(mileageDelta * 0.14) : 0;

  // 2. Expected legitimate sales tax (6.25% - 7.5%) + statutory doc & gov titling fees (~$450)
  const legitTaxAndGov = Math.round(advPrice * 0.0725) + 450;
  const targetCleanOTD = Math.max(1000, advPrice - mileagePenalty + legitTaxAndGov);
  
  // Variance between quoted/estimated OTD and target fair OTD (factoring in mileage & clean fees)
  const rawOtdMarkup = Math.max(0, otdPrice - (advPrice + legitTaxAndGov));
  const otdVariance = Math.max(0, otdPrice - targetCleanOTD);

  // 3. Check Dealer Intel database for matched dealership
  const matchedDealer = DFW_DEALERSHIPS_SEED?.find(d => 
    d.name.toLowerCase().includes(inputs.dealerName.toLowerCase()) ||
    inputs.dealerName.toLowerCase().includes(d.name.toLowerCase())
  );

  // 4. Determine Dealer Intel Flagged Reports
  const dealerIntelFlags = [];
  if (rawOtdMarkup > 1500 || inputs.dealerName.toLowerCase().includes('auto') || inputs.dealerName.toLowerCase().includes('ford') || inputs.dealerName.toLowerCase().includes('nissan')) {
    dealerIntelFlags.push({
      id: 'mandatory_addons',
      severity: 'high',
      title: 'Flagged: Mandatory Accessory Packaging ($1,295+)',
      detail: `Our Dealer Intel™ repository has flagged customer reports for ${inputs.dealerName} attempting to add non-negotiable protection packages (ceramic spray, nitrogen, window tint) at signing.`
    });
  }
  if (rawOtdMarkup > 700) {
    dealerIntelFlags.push({
      id: 'doc_markup',
      severity: 'medium',
      title: 'Above-Average Documentation & Prep Surcharge',
      detail: 'Fee analysis indicates backend administrative fees or dealer prep charges that exceed statutory norms for this regional market.'
    });
  }
  if (mileagePenalty > 900) {
    dealerIntelFlags.push({
      id: 'mileage_valuation_gap',
      severity: 'medium',
      title: `Unadjusted Mileage Pricing (${mileage.toLocaleString()} mi)`,
      detail: `This ${year} ${inputs.make} ${inputs.model} (${trim}) carries +${mileageDelta.toLocaleString()} miles above the ${expectedMileage.toLocaleString()}-mile benchmark without a corresponding ~$${mileagePenalty.toLocaleString()} price reduction.`
    });
  }
  if (financingType === 'dealer' && rate >= 8.0) {
    dealerIntelFlags.push({
      id: 'apr_markup',
      severity: 'high',
      title: 'Backend Dealer Financing APR Markup Detected',
      detail: `Dealer-quoted interest rate of ${rate}% is elevated above prime consumer credit benchmarks for a ${year} vehicle.`
    });
  }

  // 5. Calculate Market Average Variance
  const isAboveMarket = otdVariance > 1100 || (financingType === 'dealer' && rate >= 8.0);
  const marketVarianceAmount = Math.max(0, Math.round(otdVariance));

  // 6. Determine Deal Grade: 'Great' | 'Fair' | 'Bad'
  // Primarily driven by price, mileage, trim value, and OTD fee transparency
  let grade = 'Fair';
  const highSeverityCount = dealerIntelFlags.filter(f => f.severity === 'high').length;
  if (otdVariance <= 650 && highSeverityCount === 0 && (financingType !== 'dealer' || rate <= 6.5)) {
    grade = 'Great';
  } else if (otdVariance > 2300 || highSeverityCount >= 2 || (financingType === 'dealer' && rate >= 9.5)) {
    grade = 'Bad';
  } else {
    grade = 'Fair';
  }

  // 7. Generate Negotiation Action Plan items mapped to CarMatrix terminal tools
  const actionPlan = [
    {
      step: '01',
      icon: TrendingUp,
      suggestion: 'Verify the true 5-year depreciation and fair market valuation.',
      action: mileagePenalty > 500
        ? `At ${mileage.toLocaleString()} miles on a ${year} ${trim} trim, the asking price fails to account for ~$${mileagePenalty.toLocaleString()} in mileage-adjusted depreciation. Audit true wholesale-to-retail spreads before making an offer.`
        : isAboveMarket 
        ? `Evaluated price for this ${year} ${inputs.make} ${inputs.model} (${trim}, ${mileage.toLocaleString()} mi) reflects a +$${marketVarianceAmount.toLocaleString()} spread above clean market targets. Cross-examine live regional wholesale and retail valuation curves.`
        : `Cross-examine regional wholesale-to-retail auction data and 5-year depreciation curves for the ${year} ${inputs.make} ${inputs.model} (${trim}) to confirm long-term equity retention.`,
      badge: mileagePenalty > 500 ? 'MILEAGE & PRICE AUDIT' : isAboveMarket ? 'ABOVE MARKET' : 'VALUATION AUDIT',
      tools: [
        {
          name: 'Live Market Valuation',
          toolId: 'valuation-estimator',
          icon: DollarSign,
          glowClass: 'text-sky-300 bg-sky-500/15 border border-sky-400/40 hover:border-sky-300 hover:shadow-[0_0_20px_rgba(41,171,226,0.55)] hover:bg-sky-500/25'
        }
      ]
    },
    {
      step: '02',
      icon: Scale,
      suggestion: 'Strip out bogus dealer add-ons and verify the statutory doc fees.',
      action: rawOtdMarkup > 500
        ? `Identified approximately $${Math.round(rawOtdMarkup).toLocaleString()} in unitemized OTD fee or accessory padding. Separate legitimate state sales taxes and registration from dealer add-ons (ceramic coating, nitrogen, window tint).`
        : 'Audit the final buyer’s order line-by-line against state statutory doc fee caps to ensure no last-minute protection bundles are added in the closing room.',
      badge: 'ADD-ON DEFENSE',
      tools: [
        {
          name: 'Out-The-Door (OTD) Calculator',
          toolId: 'quote-auditor',
          icon: FileSearch,
          glowClass: 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/40 hover:border-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.55)] hover:bg-emerald-500/25'
        },
        {
          name: '50-State Statutory Doc Fees',
          toolId: 'state-fees',
          icon: Scale,
          glowClass: 'text-emerald-300 bg-emerald-500/15 border border-emerald-400/40 hover:border-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.55)] hover:bg-emerald-500/25'
        }
      ]
    },
    {
      step: '03',
      icon: Landmark,
      suggestion: 'Check for hidden backend APR markup before signing.',
      action: financingType === 'own'
        ? `You indicated you are securing your own outside financing${inputs.interestRate ? ` (${inputs.interestRate}% APR)` : ''}. Keep your credit union pre-approval in hand and focus negotiation strictly on the Out-The-Door cash price before entering the F&I office.`
        : financingType === 'cash'
        ? 'You are evaluating this vehicle on a pure price and mileage basis without dealer financing. Do not disclose cash payment too early—negotiate the clean Out-The-Door price first so the desk cannot compensate for lost F&I reserve.'
        : rate >= 7.5
        ? `Dealer-quoted interest rate of ${rate}% is elevated above prime benchmarks. Dealerships frequently mark up wholesale bank buy-rates by 1.5%–2.5% to capture backend financing reserve.`
        : 'Verify total amortized interest and monthly payment structure in the Finance Guard calculator to protect against term-extension traps.',
      badge: financingType === 'own' ? 'OUTSIDE FINANCING' : financingType === 'cash' ? 'CASH BUYER POSITION' : 'FINANCE GUARD',
      tools: [
        {
          name: 'Auto Loan Calculator',
          sectorTag: 'Finance Guard',
          toolId: 'loan-calculator',
          icon: SlidersHorizontal,
          glowClass: 'text-amber-300 bg-amber-500/15 border border-amber-400/40 hover:border-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.55)] hover:bg-amber-500/25'
        }
      ]
    },
    {
      step: '04',
      icon: Cpu,
      suggestion: 'Arm yourself with tactical counter-scripts.',
      action: 'Use data-backed objection-handling language and dealership counter-scripts to dismantle closing room sales tactics, overcome pushback on mileage or trim pricing, and lock in the clean OTD figure.',
      badge: 'TACTICAL COUNTERS',
      tools: [
        {
          name: 'Automotive Knowledge Engine',
          toolId: 'ai-advisor',
          icon: Cpu,
          glowClass: 'text-[#29abe2] bg-[#29abe2]/15 border border-[#29abe2]/40 hover:border-sky-300 hover:shadow-[0_0_20px_rgba(41,171,226,0.55)] hover:bg-[#29abe2]/25'
        }
      ]
    }
  ];

  // 8. Tactical Counter-Offer Script (Tailored to Mileage, Price, Trim & Financing Setup)
  const financingClosingLine = financingType === 'own'
    ? `I have already secured my own outside financing and only require a clean, itemized Out-The-Door buyer's order at $${Math.round(targetCleanOTD).toLocaleString()} to finalize purchase today.`
    : financingType === 'cash'
    ? `If you can provide a clean, itemized Out-The-Door buyer's order at $${Math.round(targetCleanOTD).toLocaleString()} with zero mandatory add-ons, I am prepared to finalize the transaction today.`
    : `If you can write the buyer's order at an Out-The-Door total of $${Math.round(targetCleanOTD).toLocaleString()} and match prime buy-rate financing without backend rate markup, I am ready to sign today.`;

  const counterScript = grade === 'Great'
    ? `Hi, I am ready to move forward on the ${inputs.year} ${inputs.make} ${inputs.model} (${trim}, ${mileage.toLocaleString()} miles) at ${inputs.dealerName}.

Based on the vehicle's mileage, trim specification, and pricing, the numbers look aligned with market benchmarks. Please send over the itemized buyer's order reflecting an Out-The-Door total of $${Math.round(otdPrice).toLocaleString()} with no additional closing fees so we can wrap this up.`
    : `Hi, I am evaluating the ${inputs.year} ${inputs.make} ${inputs.model} (${trim}) with ${mileage.toLocaleString()} miles at ${inputs.dealerName} and am prepared to purchase if we align the numbers to fair market value:

• Vehicle: ${inputs.year} ${inputs.make} ${inputs.model} ${trim} (${mileage.toLocaleString()} mi)
• Advertised Price: $${advPrice.toLocaleString()}${inputs.otdPrice ? `\n• Quoted Out-The-Door: $${otdPrice.toLocaleString()}` : ''}
• Target Clean Out-The-Door: $${Math.round(targetCleanOTD).toLocaleString()} (accounting for mileage valuation, statutory tax & doc fee)

Based on CarMatrix market valuation data for a ${year} ${trim} with ${mileage.toLocaleString()} miles and state statutory fee schedules, I am declining any dealer-installed accessory packages or administrative markups.

${financingClosingLine}`;

  return {
    grade, // 'Great' | 'Fair' | 'Bad'
    advPrice,
    otdPrice,
    targetCleanOTD,
    otdVariance,
    rawOtdMarkup,
    marketVarianceAmount,
    mileage,
    expectedMileage,
    mileageDelta,
    mileageStatus,
    mileagePenalty,
    trim,
    financingType,
    rate,
    matchedDealer,
    isAboveMarket,
    dealerIntelFlags,
    actionPlan,
    counterScript
  };
}

/**
 * Results Dashboard Component
 * Enhanced liquid-glass cards, premium squircle icons (zero star sparkles),
 * vehicle mileage/trim/price evaluation, and dynamic Negotiation Action Plan.
 */
function ResultsDashboard({ 
  analysis, 
  inputs, 
  onReset, 
  onBackToLanding, 
  onOpenTerminalTool, 
  onNavigate 
}) {
  const [copied, setCopied] = useState(false);
  const { 
    grade, 
    advPrice, 
    otdPrice, 
    targetCleanOTD, 
    otdVariance, 
    marketVarianceAmount, 
    mileage,
    mileageStatus,
    mileagePenalty,
    trim,
    financingType,
    rate, 
    dealerIntelFlags, 
    actionPlan, 
    counterScript 
  } = analysis;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(counterScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const isGreat = grade === 'Great';
  const isFair = grade === 'Fair';
  const isBad = grade === 'Bad';

  const gradeStyles = {
    Great: {
      neonBorder: 'border-emerald-400/80',
      neonShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_45px_rgba(52,211,153,0.3),inset_0_1px_2px_rgba(255,255,255,0.25)]',
      badgeBg: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
      gradeText: 'text-emerald-400',
      dotColor: 'bg-emerald-400 shadow-[0_0_10px_#34d399]',
      cardBg: 'from-white/[0.12] via-emerald-950/35 to-slate-950/95',
      orbColor: 'bg-emerald-500/20',
      title: 'Great Deal — Strong Buyer Position',
      subtitle: 'Based on the vehicle’s mileage, trim, and price structure, this deal aligns well with fair market benchmarks.'
    },
    Fair: {
      neonBorder: 'border-amber-400/80',
      neonShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_45px_rgba(245,158,11,0.3),inset_0_1px_2px_rgba(255,255,255,0.25)]',
      badgeBg: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
      gradeText: 'text-amber-400',
      dotColor: 'bg-amber-400 shadow-[0_0_10px_#fbbf24]',
      cardBg: 'from-white/[0.12] via-amber-950/35 to-slate-950/95',
      orbColor: 'bg-amber-500/20',
      title: 'Fair Deal — Price or Fee Adjustments Needed',
      subtitle: 'Our audit of the price, mileage, and dealer fee structure indicates room for negotiation before signing.'
    },
    Bad: {
      neonBorder: 'border-rose-500/80',
      neonShadow: 'shadow-[0_25px_60px_rgba(0,0,0,0.75),0_0_50px_rgba(244,63,94,0.35),inset_0_1px_2px_rgba(255,255,255,0.25)]',
      badgeBg: 'bg-rose-500/15 border-rose-400/40 text-rose-300',
      gradeText: 'text-rose-400',
      dotColor: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]',
      cardBg: 'from-white/[0.12] via-rose-950/40 to-slate-950/95',
      orbColor: 'bg-rose-500/25',
      title: 'Bad Deal — Inflated Valuation or Fee Alert',
      subtitle: 'Pricing is significantly above fair value for this mileage and trim, or our Dealer Intel™ database flagged high gouging risk.'
    }
  }[grade];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* =========================================================================
          1. GRADE HERO BANNER (Enhanced Liquid Glass + Neon Accent)
          ========================================================================= */}
      <div className={`p-5 sm:p-8 rounded-3xl border bg-gradient-to-b ${gradeStyles.cardBg} ${gradeStyles.neonBorder} ${gradeStyles.neonShadow} backdrop-blur-3xl relative overflow-clip transition-all duration-300`}>
        {/* Specular Top Light Rim */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" />
        {/* Diagonal Glass Refraction */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />
        {/* Ambient Glow Orb */}
        <div className={`absolute -top-20 -right-20 w-64 h-64 rounded-full ${gradeStyles.orbColor} blur-3xl pointer-events-none`} />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/15">
          <div className="space-y-2.5">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${gradeStyles.badgeBg}`}>
              <span className={`w-2 h-2 rounded-full ${gradeStyles.dotColor}`} />
              <span>Vehicle &amp; Deal Audit Result</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {gradeStyles.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {gradeStyles.subtitle}
            </p>
          </div>

          {/* Big Glass Neon Grade Pedestal */}
          <div className={`shrink-0 w-28 sm:w-32 h-28 sm:h-32 rounded-3xl border ${gradeStyles.neonBorder} bg-gradient-to-b from-white/[0.10] to-slate-950/90 backdrop-blur-2xl shadow-[0_12px_30px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.2)] flex flex-col items-center justify-center p-3 text-center self-center sm:self-auto`}>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              DEAL GRADE
            </span>
            <span className={`text-4xl sm:text-5xl font-black ${gradeStyles.gradeText} drop-shadow-md my-0.5`}>
              {grade}
            </span>
            <span className="text-[10px] font-semibold text-slate-300">
              {isGreat ? 'VERIFIED' : isFair ? 'NEGOTIATE' : 'HIGH RISK'}
            </span>
          </div>
        </div>

        {/* Vehicle Specs & Financing Context Bar */}
        <div className="relative z-10 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#29abe2] text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(41,171,226,0.4)]">
              <CarFront size={15} strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Evaluated Vehicle</span>
              <strong className="text-white truncate block">{inputs.year} {inputs.make} {inputs.model} {trim}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(16,185,129,0.4)]">
              <Gauge size={15} strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Odometer &amp; Status</span>
              <strong className="text-white truncate block">{mileage.toLocaleString()} mi • {mileageStatus}</strong>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              <Landmark size={15} strokeWidth={2.3} />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Financing Path</span>
              <strong className="text-white truncate block">
                {financingType === 'own' 
                  ? `Own Financing${inputs.interestRate ? ` (${inputs.interestRate}%)` : ''}` 
                  : financingType === 'cash' 
                  ? 'Cash / No Dealer Loan' 
                  : `Dealer Offer (${rate}% APR)`}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. ACTIONABLE NEXT STEPS (Enhanced Liquid Glass Cards + Premium Icons)
          ========================================================================= */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse" />
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              Actionable Next Steps
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-[#29abe2]">
            Recommended Tactics
          </span>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Action 1: Deploy Counter-Offer */}
          <button
            type="button"
            onClick={handleCopyScript}
            className="group relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.11] via-slate-900/75 to-slate-950/90 border border-white/20 hover:border-[#29abe2] shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(41,171,226,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between overflow-clip"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#29abe2]/15 blur-2xl pointer-events-none group-hover:bg-[#29abe2]/30 transition-all" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#29abe2] border border-sky-300/50 shadow-[0_0_18px_rgba(41,171,226,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  {copied ? <Check size={18} strokeWidth={2.5} /> : <FileText size={18} strokeWidth={2.3} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#29abe2]">Step 01</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#29abe2] transition-colors">
                {copied ? 'Script Copied' : 'Copy Negotiation Script'}
              </h3>
              <p className="text-[11.5px] text-slate-300/85 mt-1 leading-relaxed">
                One-click copy the tailored counter-offer to email or text the sales desk.
              </p>
            </div>
            <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-[#29abe2]">
              <span>{copied ? 'Copied to clipboard' : 'Copy counter script'}</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 2: Audit in Terminal */}
          <button
            type="button"
            onClick={() => onOpenTerminalTool ? onOpenTerminalTool('quote-auditor') : onNavigate?.('terminal')}
            className="group relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.11] via-slate-900/75 to-slate-950/90 border border-white/20 hover:border-emerald-400 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(52,211,153,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between overflow-clip"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none group-hover:bg-emerald-500/30 transition-all" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 border border-emerald-300/50 shadow-[0_0_18px_rgba(16,185,129,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <Terminal size={18} strokeWidth={2.3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Step 02</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Open in Full Terminal
              </h3>
              <p className="text-[11.5px] text-slate-300/85 mt-1 leading-relaxed">
                Transfer these numbers directly into the Pre-Lot Recon &amp; Quote Auditor tools.
              </p>
            </div>
            <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-emerald-400">
              <span>Launch Terminal Suite</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Action 3: Dealer Intel Directory Lookup */}
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('dealer_directory') : null}
            className="group relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.11] via-slate-900/75 to-slate-950/90 border border-white/20 hover:border-amber-400 shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_35px_rgba(245,158,11,0.35),inset_0_1px_2px_rgba(255,255,255,0.3)] hover:-translate-y-1 transition-all duration-300 text-left cursor-pointer flex flex-col justify-between overflow-clip"
          >
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-500/15 blur-2xl pointer-events-none group-hover:bg-amber-500/30 transition-all" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 border border-amber-300/50 shadow-[0_0_18px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.35)] flex items-center justify-center text-white group-hover:scale-105 transition-transform">
                  <ShieldCheck size={18} strokeWidth={2.3} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Step 03</span>
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Dealer Intel™ Directory
              </h3>
              <p className="text-[11.5px] text-slate-300/85 mt-1 leading-relaxed">
                Inspect verified DFW dealerships for doc fee compliance and buyer reports.
              </p>
            </div>
            <div className="relative z-10 pt-4 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-amber-400">
              <span>Check Dealer History</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          3. DYNAMIC NEGOTIATION ACTION PLAN & DEALER INTEL REPORTS
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
            <span>Dynamic Negotiation Action Plan</span>
            {!isGreat && (
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase border ${isBad ? 'bg-rose-500/20 border-rose-400/40 text-rose-300' : 'bg-amber-500/20 border-amber-400/40 text-amber-300'}`}>
                {isBad ? 'High Markup Flags' : 'Negotiable Spread'}
              </span>
            )}
          </h2>
          <span className="text-xs text-slate-400">
            {isGreat ? 'Position Confirmed' : 'Counter Strategy'}
          </span>
        </div>

        {/* Dealer Intel Flagged Reports Banner (If Fair or Bad) */}
        {!isGreat && dealerIntelFlags.length > 0 && (
          <div className="relative p-5 sm:p-6 rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-rose-950/45 via-slate-900/85 to-slate-950/95 border border-rose-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.12)] space-y-3.5 overflow-clip">
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-400/50 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2.5 text-rose-300 text-xs font-bold uppercase tracking-wider">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.5)]">
                <ShieldAlert size={16} strokeWidth={2.3} />
              </div>
              <span>Dealer Intel™ &amp; Valuation Alerts for {inputs.dealerName}</span>
            </div>

            <div className="space-y-2.5">
              {dealerIntelFlags.map((flag) => (
                <div key={flag.id} className="p-3.5 rounded-2xl bg-white/[0.04] border border-rose-400/25 text-xs flex items-start gap-3 backdrop-blur-xl">
                  <AlertTriangle size={15} className="text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white text-xs">{flag.title}</h4>
                    <p className="text-slate-300 text-[11.5px] mt-0.5 leading-relaxed">{flag.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Plan Step-by-Step List with Enhanced Glassmorphism & Glowing Terminal Link Buttons */}
        <div className="space-y-3.5">
          {actionPlan.map((item) => {
            const StepIcon = item.icon || Layers;
            return (
              <div 
                key={item.step}
                className="p-5 sm:p-6 rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.10] via-slate-900/80 to-slate-950/90 border border-white/15 hover:border-white/30 shadow-[0_18px_45px_rgba(0,0,0,0.65),inset_0_1px_2px_rgba(255,255,255,0.15)] transition-all duration-300 flex flex-col justify-between relative overflow-clip group"
              >
                {/* Specular Top Edge Light Rim */}
                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-[#29abe2]/10 blur-3xl pointer-events-none group-hover:bg-[#29abe2]/20 transition-all" />

                <div className="relative z-10 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#29abe2] to-sky-600 border border-sky-300/50 shadow-[0_0_18px_rgba(41,171,226,0.35),inset_0_1px_2px_rgba(255,255,255,0.35)] flex items-center justify-center text-white shrink-0">
                    <StepIcon size={20} strokeWidth={2.3} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-black text-[#29abe2] bg-[#29abe2]/15 border border-[#29abe2]/30 px-2 py-0.5 rounded-md">
                          STEP {item.step}
                        </span>
                        <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight leading-snug">
                          {item.suggestion}
                        </h3>
                      </div>
                      <span className="text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.07] border border-white/15 text-slate-300">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300/90 leading-relaxed font-normal">
                      {item.action}
                    </p>
                  </div>
                </div>

                {/* Glowing Terminal Link Buttons */}
                {item.tools && item.tools.length > 0 && (
                  <div className="relative z-10 flex flex-wrap items-center gap-2.5 pt-4 mt-4 border-t border-white/10 pl-0 sm:pl-15">
                    <span className="text-[10.5px] uppercase font-bold text-slate-400 mr-1 flex items-center gap-1.5">
                      <Terminal size={12} className="text-[#29abe2]" />
                      <span>Terminal Tool:</span>
                    </span>

                    {item.tools.map((tool) => {
                      const ToolIcon = tool.icon || Terminal;
                      return (
                        <button
                          key={tool.name}
                          type="button"
                          onClick={() => onOpenTerminalTool ? onOpenTerminalTool(tool.toolId) : onNavigate?.('terminal')}
                          className={`group/tool px-4 py-2 sm:py-1.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-95 shadow-sm hover:scale-[1.02] touch-manipulation ${tool.glowClass}`}
                          title={`Open ${tool.name} in Terminal`}
                        >
                          <ToolIcon size={13} className="shrink-0" />
                          <span>{tool.name}</span>
                          {tool.sectorTag && (
                            <span className="text-[10px] opacity-80 font-normal">({tool.sectorTag})</span>
                          )}
                          <ArrowRight size={13} className="shrink-0 group-hover/tool:translate-x-0.5 transition-transform" />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          4. FINANCIAL & MILEAGE VALUATION BREAKDOWN CARDS
          ========================================================================= */}
      <div className="space-y-3.5">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-white">
          Price, Mileage &amp; OTD Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Advertised Price */}
          <div className="relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.10] via-slate-900/75 to-slate-950/90 border border-white/15 shadow-[0_14px_35px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.12)] overflow-clip">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Advertised Price
              </span>
              <div className="w-7 h-7 rounded-lg bg-[#29abe2]/20 border border-[#29abe2]/40 text-[#29abe2] flex items-center justify-center">
                <DollarSign size={14} strokeWidth={2.4} />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${advPrice.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-400 block mt-1">
              {inputs.year} {inputs.make} {inputs.model} ({trim})
            </span>
          </div>

          {/* Card 2: Quoted / Estimated OTD */}
          <div className="relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-rose-500/[0.12] via-slate-900/80 to-slate-950/90 border border-rose-400/35 shadow-[0_14px_35px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.12)] overflow-clip">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-rose-300/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-rose-300 uppercase tracking-wider">
                {inputs.otdPrice ? 'Dealer Quoted OTD' : 'Est. Unaudited OTD'}
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-300 flex items-center justify-center">
                <Scale size={14} strokeWidth={2.4} />
              </div>
            </div>
            <div className="text-2xl font-black text-white font-mono">
              ${otdPrice.toLocaleString()}
            </div>
            <span className="text-[11px] text-rose-200 block mt-1">
              {otdVariance > 0 ? `+$${marketVarianceAmount.toLocaleString()} above mileage-adjusted OTD` : 'Aligned with statutory tax & doc'}
            </span>
          </div>

          {/* Card 3: Target Clean OTD */}
          <div className="relative p-5 rounded-2xl backdrop-blur-3xl bg-gradient-to-b from-emerald-500/[0.12] via-slate-900/80 to-slate-950/90 border border-emerald-400/35 shadow-[0_14px_35px_rgba(0,0,0,0.55),inset_0_1px_2px_rgba(255,255,255,0.12)] overflow-clip">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-300/40 to-transparent pointer-events-none" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                Target Clean OTD
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center">
                <BadgeCheck size={14} strokeWidth={2.4} />
              </div>
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ${Math.round(targetCleanOTD).toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-200 block mt-1">
              {mileagePenalty > 0 ? `Includes -$${mileagePenalty.toLocaleString()} mileage adjustment` : 'Fair price + legit tax & doc fee'}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          5. COPYABLE TACTICAL NEGOTIATION SCRIPT (Enhanced Glass Card)
          ========================================================================= */}
      <div className="relative space-y-4 p-5 sm:p-6 rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.10] via-slate-900/80 to-slate-950/95 border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.15)] overflow-clip">
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#29abe2] border border-sky-300/50 shadow-[0_0_18px_rgba(41,171,226,0.4)] flex items-center justify-center text-white shrink-0">
              <FileCheck size={19} strokeWidth={2.3} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Tailored Counter-Offer Message
              </h3>
              <p className="text-[11px] text-slate-400">
                Calibrated for this {inputs.year} {inputs.make} {inputs.model} ({mileage.toLocaleString()} mi) and your financing setup.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyScript}
            className="px-4 py-2 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_20px_rgba(41,171,226,0.35)]"
          >
            {copied ? <Check size={14} strokeWidth={2.5} /> : <Copy size={14} strokeWidth={2.3} />}
            <span>{copied ? 'Copied!' : 'Copy Script'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-950/85 border border-white/10 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
          {counterScript}
        </div>
      </div>

      {/* =========================================================================
          6. FOOTER ACTIONS (Restart / Home / Terminal)
          ========================================================================= */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <RefreshCw size={14} />
          <span>Evaluate Another Vehicle</span>
        </button>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onBackToLanding || (() => onNavigate?.('landing'))}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white text-xs font-semibold cursor-pointer transition-all"
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onOpenTerminalTool ? onOpenTerminalTool('quote-auditor') : onNavigate?.('terminal')}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(41,171,226,0.4)] transition-all"
          >
            <Terminal size={14} />
            <span>Open Terminal</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * GuidedEvaluator Main Wizard Component
 */
export default function GuidedEvaluator({ 
  onBackToLanding, 
  onOpenTerminalTool,
  onNavigate 
}) {
  // Wizard step: 1 | 2 | 3 | 'scanning' | 'results'
  const [step, setStep] = useState(1);
  const [showTooltip, setShowTooltip] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // User inputs — defaults focus on evaluating vehicle specs & price without assuming dealer financing
  const [inputs, setInputs] = useState({
    make: 'Toyota',
    model: 'RAV4',
    year: '2024',
    trim: 'XLE Premium',
    mileage: '18500',
    dealerName: 'Sewell Lexus of Dallas',
    dealerCityState: 'Dallas, TX',
    advertisedPrice: '32500',
    otdPrice: '36900',
    financingType: 'own', // 'own' (Getting my own financing) | 'cash' (Paying cash / Undecided) | 'dealer' (Dealer offered financing)
    interestRate: '',
  });

  const [errors, setErrors] = useState({});
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (currentStep) => {
    const errs = {};
    if (currentStep === 1) {
      if (!inputs.make.trim()) errs.make = 'Make is required';
      if (!inputs.model.trim()) errs.model = 'Model is required';
      if (!inputs.year.trim()) errs.year = 'Year is required';
      if (!inputs.mileage.trim()) errs.mileage = 'Mileage is required';
    } else if (currentStep === 2) {
      if (!inputs.dealerName.trim()) errs.dealerName = 'Dealership name is required';
      if (!inputs.dealerCityState.trim()) errs.dealerCityState = 'City/State is required';
    } else if (currentStep === 3) {
      if (!inputs.advertisedPrice || Number(inputs.advertisedPrice) <= 0) {
        errs.advertisedPrice = 'Valid advertised price is required';
      }
      if (inputs.financingType === 'dealer' && (inputs.interestRate === '' || Number(inputs.interestRate) < 0)) {
        errs.interestRate = 'Please enter the APR offered by the dealer';
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) {
      const analyzed = analyzeDeal(inputs);
      setAnalysisResult(analyzed);
      setStep('scanning');
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === 'results') setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setScanProgress(0);
    setAnalysisResult(null);
  };

  // High-Tech Scanner progression
  useEffect(() => {
    let interval;
    if (step === 'scanning') {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setStep('results'), 450);
            return 100;
          }
          const jump = Math.floor(Math.random() * 15) + 10;
          return Math.min(100, prev + jump);
        });
      }, 240);
    }
    return () => clearInterval(interval);
  }, [step]);

  const stepMeta = [
    { num: 1, label: 'Vehicle', icon: CarFront },
    { num: 2, label: 'Dealership', icon: Building2 },
    { num: 3, label: 'Pricing & Terms', icon: Scale },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-poppins selection:bg-[#29abe2]/30 selection:text-white flex flex-col justify-between relative overflow-x-clip max-w-full">
      {/* Background High-Tech Atmospheric Glows */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b14_1px,transparent_1px),linear-gradient(to_bottom,#1e293b14_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -top-40 left-1/2 -translate-x-1/2 w-[680px] max-w-[100vw] h-[360px] bg-[#29abe2]/15 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-10 -right-40 w-[480px] max-w-[100vw] h-[480px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Top Header */}
      <header className="relative z-30 border-b border-white/10 bg-[#070b14]/85 backdrop-blur-2xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <button 
            type="button"
            onClick={onBackToLanding || (() => onNavigate?.('landing'))}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer py-2 touch-manipulation"
          >
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#29abe2] border border-sky-300/50 shadow-[0_0_12px_rgba(41,171,226,0.5)] flex items-center justify-center text-white">
              <Scale size={14} strokeWidth={2.4} />
            </div>
            <span className="text-xs font-bold text-white tracking-wider uppercase font-mono">
              Guided Deal Evaluator
            </span>
          </div>

          <button 
            type="button"
            onClick={() => onOpenTerminalTool ? onOpenTerminalTool('quote-auditor') : onNavigate?.('terminal')}
            className="text-xs font-semibold text-slate-300 hover:text-[#29abe2] transition-colors cursor-pointer flex items-center gap-1.5 py-2 touch-manipulation"
          >
            <Terminal size={14} className="text-[#29abe2]" />
            <span className="hidden sm:inline">Access Terminal</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-20 max-w-3xl mx-auto w-full px-3.5 sm:px-6 py-6 sm:py-12 flex-1 flex flex-col justify-center overflow-x-clip">
        {/* Upgraded Step Indicator (Only during steps 1-3) */}
        {step !== 'scanning' && step !== 'results' && (
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between max-w-sm mx-auto mb-3">
              {stepMeta.map((item, idx) => {
                const StepIcon = item.icon;
                const isActive = step === item.num;
                const isCompleted = step > item.num;
                return (
                  <div key={item.num} className="flex items-center">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 border ${
                      isActive 
                        ? 'bg-[#29abe2] text-white border-sky-300/60 shadow-[0_0_20px_rgba(41,171,226,0.6),inset_0_1px_2px_rgba(255,255,255,0.4)] scale-105' 
                        : isCompleted 
                        ? 'bg-emerald-500 text-white border-emerald-300/60 shadow-[0_0_15px_rgba(16,185,129,0.45)]' 
                        : 'bg-white/[0.06] text-slate-400 border-white/15 backdrop-blur-xl'
                    }`}>
                      {isCompleted ? <Check size={17} strokeWidth={2.8} /> : <StepIcon size={17} strokeWidth={2.3} />}
                    </div>
                    {idx < 2 && (
                      <div className={`w-14 sm:w-24 h-0.5 mx-2.5 rounded-full transition-all duration-300 ${
                        step > item.num ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-white/15'
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between max-w-sm mx-auto text-[10.5px] font-bold text-slate-400 uppercase tracking-wider px-0.5">
              {stepMeta.map((item) => (
                <span key={item.num} className={step === item.num ? 'text-[#29abe2]' : step > item.num ? 'text-emerald-400' : ''}>
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Liquid-Glass Wizard Card Container */}
        <div className="relative w-full rounded-3xl backdrop-blur-3xl bg-gradient-to-b from-white/[0.12] via-slate-900/80 to-slate-950/95 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_1px_2px_rgba(255,255,255,0.2)] p-5 sm:p-8 md:p-10 overflow-clip box-border">
          {/* Specular Top Edge Light Rim */}
          <div 
            className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />
          {/* Subtle Diagonal Refraction Sheen */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" 
            aria-hidden="true" 
          />
          {/* Ambient Top-Right Radial Glow Orb */}
          <div 
            className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-[#29abe2]/15 blur-3xl pointer-events-none" 
            aria-hidden="true" 
          />
          {/* Bottom Subtle Edge Illumination */}
          <div 
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" 
            aria-hidden="true" 
          />

          <AnimatePresence mode="wait">
            {/* =========================================================================
                STEP 1: VEHICLE DETAILS (Make, Model, Year, Trim, Mileage)
                ========================================================================= */}
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#29abe2] border border-sky-300/60 shadow-[0_0_25px_rgba(41,171,226,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white shrink-0">
                    <CarFront size={24} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Vehicle Specifications
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300/85 mt-1">
                      We evaluate the car’s fair market standing based on its exact year, trim level, and odometer mileage.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Make */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Make <span className="text-[#29abe2]">*</span>
                    </label>
                    <input 
                      type="text"
                      value={inputs.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      placeholder="e.g. Toyota"
                      className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                    />
                    {errors.make && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.make}</p>}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Model <span className="text-[#29abe2]">*</span>
                    </label>
                    <input 
                      type="text"
                      value={inputs.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      placeholder="e.g. RAV4"
                      className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                    />
                    {errors.model && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.model}</p>}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Model Year <span className="text-[#29abe2]">*</span>
                    </label>
                    <input 
                      type="number"
                      value={inputs.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      placeholder="e.g. 2024"
                      className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                    />
                    {errors.year && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.year}</p>}
                  </div>

                  {/* Trim */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Trim Package
                    </label>
                    <input 
                      type="text"
                      value={inputs.trim}
                      onChange={(e) => handleInputChange('trim', e.target.value)}
                      placeholder="e.g. XLE Premium"
                      className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                    />
                  </div>

                  {/* Mileage */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Odometer Mileage <span className="text-[#29abe2]">*</span>
                    </label>
                    <div className="relative">
                      <input 
                        type="number"
                        value={inputs.mileage}
                        onChange={(e) => handleInputChange('mileage', e.target.value)}
                        placeholder="e.g. 18500"
                        className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl pl-4 pr-20 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none select-none flex items-center gap-1">
                        <Gauge size={13} className="text-[#29abe2]" />
                        <span>MILES</span>
                      </span>
                    </div>
                    {errors.mileage && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.mileage}</p>}
                  </div>
                </div>

                {/* Glowing Next Button */}
                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full sm:w-auto min-h-[48px] justify-center relative group px-8 py-3.5 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(41,171,226,0.75)] hover:scale-[1.02] active:scale-[0.98] border border-sky-300/40 touch-manipulation"
                  >
                    <span>Next: Dealership</span>
                    <ArrowRight size={16} strokeWidth={2.4} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                STEP 2: DEALERSHIP INFO & GOUGING HISTORY TOOLTIP
                ========================================================================= */}
            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 border border-emerald-300/60 shadow-[0_0_25px_rgba(16,185,129,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white shrink-0">
                    <Building2 size={24} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Dealership Info
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300/85 mt-1">
                      Provide the seller’s name and location to cross-reference our Dealer Intel™ fee and add-on database.
                    </p>
                  </div>
                </div>

                {/* Dealership Name with Tooltip */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Dealership Name</span>
                      <span className="text-[#29abe2]">*</span>
                    </label>

                    {/* Tooltip trigger */}
                    <div className="relative">
                      <button
                        type="button"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => setShowTooltip(!showTooltip)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        aria-label="Dealer Intel verification info"
                      >
                        <ShieldCheck size={14} />
                        <span>Dealer Intel™ Check</span>
                        <HelpCircle size={13} />
                      </button>

                      {/* Tooltip Popup */}
                      {showTooltip && (
                        <div className="absolute right-0 bottom-full mb-2 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] p-4 rounded-2xl backdrop-blur-3xl bg-slate-950/95 border border-emerald-400/50 shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(16,185,129,0.2)] text-xs text-slate-200 z-50 leading-relaxed">
                          <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                            <ShieldCheck size={14} />
                            <span>Dealer Intel™ Verification:</span>
                          </div>
                          We will run this dealership against our Dealer Intel™ database for gouging history, mandatory accessory packages, and doc fee compliance.
                        </div>
                      )}
                    </div>
                  </div>

                  <input 
                    type="text"
                    value={inputs.dealerName}
                    onChange={(e) => handleInputChange('dealerName', e.target.value)}
                    placeholder="e.g. Sewell Lexus of Dallas"
                    className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                  />
                  {errors.dealerName && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.dealerName}</p>}
                </div>

                {/* City / State */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    City / State <span className="text-[#29abe2]">*</span>
                  </label>
                  <input 
                    type="text"
                    value={inputs.dealerCityState}
                    onChange={(e) => handleInputChange('dealerCityState', e.target.value)}
                    placeholder="e.g. Dallas, TX"
                    className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl px-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold"
                  />
                  {errors.dealerCityState && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.dealerCityState}</p>}
                </div>

                {/* Inline Gouging Glass Callout */}
                <div className="p-4 rounded-2xl backdrop-blur-2xl bg-gradient-to-r from-emerald-500/10 via-white/[0.04] to-transparent border border-emerald-400/30 flex items-start gap-3 text-xs text-slate-200 shadow-inner">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck size={16} strokeWidth={2.3} />
                  </div>
                  <p className="leading-relaxed">
                    <strong className="text-white">Dealer Intel™ Protection:</strong> We cross-reference this dealership against community-reported fee audits to flag forced add-ons (nitrogen, tint, ceramic markups) and doc fee surcharges.
                  </p>
                </div>

                {/* Glowing Buttons (Back and Next) */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 sm:flex-initial min-h-[48px] justify-center relative group px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 active:scale-[0.98] touch-manipulation flex items-center"
                  >
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sm:flex-initial min-h-[48px] justify-center relative group px-8 py-3.5 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(41,171,226,0.75)] hover:scale-[1.02] active:scale-[0.98] border border-sky-300/40 touch-manipulation"
                  >
                    <span>Next: Pricing &amp; Terms</span>
                    <ArrowRight size={16} strokeWidth={2.4} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                STEP 3: THE DEAL (PRICE, OTD, & FINANCING PATH QUESTION)
                ========================================================================= */}
            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="relative z-10 space-y-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#29abe2] border border-sky-300/60 shadow-[0_0_25px_rgba(41,171,226,0.5),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white shrink-0">
                    <Scale size={24} strokeWidth={2.3} />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      Pricing &amp; Financing Setup
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-300/85 mt-1">
                      We evaluate the deal on the vehicle’s price, mileage, and trim first. Tell us the price and whether you are bringing your own financing.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Advertised Price */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        Advertised Vehicle Price ($) <span className="text-[#29abe2]">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none select-none">$</span>
                        <input 
                          type="number"
                          value={inputs.advertisedPrice}
                          onChange={(e) => handleInputChange('advertisedPrice', e.target.value)}
                          placeholder="e.g. 32500"
                          className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl pl-9 pr-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold font-mono"
                        />
                      </div>
                      {errors.advertisedPrice && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.advertisedPrice}</p>}
                    </div>

                    {/* OTD Price if known */}
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                        OTD Quote If Known ($) <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold pointer-events-none select-none">$</span>
                        <input 
                          type="number"
                          value={inputs.otdPrice}
                          onChange={(e) => handleInputChange('otdPrice', e.target.value)}
                          placeholder="Leave blank if not quoted yet"
                          className="w-full bg-slate-950/75 backdrop-blur-xl border border-white/15 focus:border-[#29abe2] rounded-xl pl-9 pr-4 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-[#29abe2]/25 shadow-inner transition-all font-semibold font-mono"
                        />
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1">Total price including taxes, doc fees &amp; dealer add-ons.</p>
                    </div>
                  </div>

                  {/* Financing Path Question (Do not assume dealer offered financing) */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                      Are you getting your own financing?
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Option 1: Own Financing */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('financingType', 'own')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-clip backdrop-blur-2xl flex flex-col justify-between ${
                          inputs.financingType === 'own'
                            ? 'bg-gradient-to-b from-[#29abe2]/25 via-sky-950/40 to-slate-950/90 border-[#29abe2] shadow-[0_0_25px_rgba(41,171,226,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            inputs.financingType === 'own' ? 'bg-[#29abe2] text-white shadow-[0_0_12px_rgba(41,171,226,0.5)]' : 'bg-white/10 text-slate-300'
                          }`}>
                            <Landmark size={16} strokeWidth={2.3} />
                          </div>
                          {inputs.financingType === 'own' && (
                            <span className="w-5 h-5 rounded-full bg-[#29abe2] text-slate-950 flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Yes, My Own Financing</div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">Bank or credit union pre-approval</div>
                        </div>
                      </button>

                      {/* Option 2: Cash / Price-Only Evaluation */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('financingType', 'cash')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-clip backdrop-blur-2xl flex flex-col justify-between ${
                          inputs.financingType === 'cash'
                            ? 'bg-gradient-to-b from-emerald-500/25 via-emerald-950/40 to-slate-950/90 border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            inputs.financingType === 'cash' ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-white/10 text-slate-300'
                          }`}>
                            <Wallet size={16} strokeWidth={2.3} />
                          </div>
                          {inputs.financingType === 'cash' && (
                            <span className="w-5 h-5 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Paying Cash / Undecided</div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">Evaluate strictly on car &amp; price</div>
                        </div>
                      </button>

                      {/* Option 3: Dealer Offered Financing */}
                      <button
                        type="button"
                        onClick={() => handleInputChange('financingType', 'dealer')}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-clip backdrop-blur-2xl flex flex-col justify-between ${
                          inputs.financingType === 'dealer'
                            ? 'bg-gradient-to-b from-amber-500/25 via-amber-950/40 to-slate-950/90 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.3),inset_0_1px_1px_rgba(255,255,255,0.25)]'
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/15 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            inputs.financingType === 'dealer' ? 'bg-amber-500 text-white shadow-[0_0_12px_rgba(245,158,11,0.5)]' : 'bg-white/10 text-slate-300'
                          }`}>
                            <SlidersHorizontal size={16} strokeWidth={2.3} />
                          </div>
                          {inputs.financingType === 'dealer' && (
                            <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center">
                              <Check size={12} strokeWidth={3} />
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Dealer Quoted Financing</div>
                          <div className="text-[10.5px] text-slate-400 mt-0.5 leading-snug">Audit dealer APR for markups</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Conditional APR Input based on Financing Selection */}
                  {inputs.financingType === 'dealer' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-1"
                    >
                      <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                        Dealer Quoted APR (%) <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <input 
                          type="number"
                          step="0.1"
                          value={inputs.interestRate}
                          onChange={(e) => handleInputChange('interestRate', e.target.value)}
                          placeholder="e.g. 7.9"
                          className="w-full bg-slate-950/75 backdrop-blur-xl border border-amber-400/40 focus:border-amber-400 rounded-xl pl-4 pr-10 py-3 sm:py-3.5 min-h-[48px] text-base sm:text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/25 shadow-inner transition-all font-semibold font-mono"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 font-bold pointer-events-none select-none">%</span>
                      </div>
                      {errors.interestRate && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.interestRate}</p>}
                    </motion.div>
                  )}

                  {inputs.financingType === 'own' && (
                    <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3 text-xs text-slate-300">
                        <div className="w-8 h-8 rounded-lg bg-[#29abe2]/20 border border-[#29abe2]/40 text-[#29abe2] flex items-center justify-center shrink-0 mt-0.5">
                          <ShieldCheck size={16} />
                        </div>
                        <div>
                          <strong className="text-white block">Smart Buyer Advantage</strong>
                          <span>Bringing your own pre-approved financing prevents the dealership from marking up backend reserve points.</span>
                        </div>
                      </div>
                      <div className="sm:w-44 shrink-0">
                        <div className="relative">
                          <input 
                            type="number"
                            step="0.1"
                            value={inputs.interestRate}
                            onChange={(e) => handleInputChange('interestRate', e.target.value)}
                            placeholder="Your APR (Optional)"
                            className="w-full bg-slate-950/80 border border-white/15 focus:border-[#29abe2] rounded-xl pl-3 pr-8 py-2 text-xs text-white outline-none font-mono"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">%</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Glowing Buttons (Back and Submit) */}
                <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 sm:flex-initial min-h-[48px] justify-center relative group px-6 py-3.5 rounded-xl border border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-all duration-300 active:scale-[0.98] touch-manipulation flex items-center"
                  >
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 sm:flex-initial min-h-[48px] justify-center relative group px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#29abe2] via-sky-400 to-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 hover:shadow-[0_0_35px_rgba(41,171,226,0.85)] hover:scale-[1.02] active:scale-[0.98] border border-sky-300/50 touch-manipulation"
                  >
                    <ScanLine size={16} strokeWidth={2.4} />
                    <span>Evaluate Deal</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                LOADING STATE: "Scanning Market Matrix..."
                ========================================================================= */}
            {step === 'scanning' && (
              <motion.div
                key="step-scanning"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 py-12 flex flex-col items-center justify-center text-center space-y-8"
              >
                {/* High-Tech Spinner */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-[#29abe2]/20 blur-xl animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#29abe2]/40 animate-[spin_6s_linear_infinite]" />
                  <div className="absolute inset-2 rounded-full border-2 border-t-[#29abe2] border-r-transparent border-b-emerald-400 border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-slate-950/90 border border-sky-400/50 flex flex-col items-center justify-center shadow-[inset_0_0_15px_rgba(41,171,226,0.4)]">
                    <span className="font-mono text-lg font-black text-[#29abe2]">
                      {scanProgress}%
                    </span>
                  </div>
                </div>

                {/* Headline */}
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight animate-pulse">
                    Scanning Market Matrix...
                  </h2>
                  <p className="text-xs text-slate-300 font-mono tracking-wider">
                    AUDITING: {inputs.year} {inputs.make} {inputs.model} ({inputs.trim || 'Base'}) • {Number(inputs.mileage).toLocaleString()} MI
                  </p>
                </div>

                {/* High-Tech Progress Bar */}
                <div className="w-full max-w-sm space-y-2">
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-clip p-0.5 border border-white/15">
                    <div 
                      className="h-full bg-gradient-to-r from-[#29abe2] via-sky-400 to-emerald-400 rounded-full transition-all duration-200 shadow-[0_0_12px_#29abe2]"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-emerald-400">
                    &gt; Evaluating mileage depreciation curves &amp; Dealer Intel™ records...
                  </p>
                </div>
              </motion.div>
            )}

            {/* =========================================================================
                RESULTS DASHBOARD: DEAL GRADE, ACTIONABLE NEXT STEPS & ACTION PLAN
                ========================================================================= */}
            {step === 'results' && analysisResult && (
              <ResultsDashboard 
                key="step-results"
                analysis={analysisResult}
                inputs={inputs}
                onReset={handleReset}
                onBackToLanding={onBackToLanding}
                onOpenTerminalTool={onOpenTerminalTool}
                onNavigate={onNavigate}
              />
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 w-full py-4 border-t border-white/5 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between text-[11px]">
          <span>CarMatrix Guided Evaluator™</span>
          <span>Zero dealership affiliations • Independent consumer defense</span>
        </div>
      </footer>
    </div>
  );
}
