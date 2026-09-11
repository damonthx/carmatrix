import React, { useState, useEffect } from 'react';
import { ShieldCheck, CreditCard, Lock, DollarSign, ChevronRight, Coins, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CreditTier {
  label: string;
  range: string;
  apr: number;
}

const creditTiers: CreditTier[] = [
  { label: "Rebuilding", range: "<600", apr: 14.50 },
  { label: "Fair", range: "600-679", apr: 9.85 },
  { label: "Good", range: "680-739", apr: 7.20 },
  { label: "Excellent", range: "740-850", apr: 5.49 }
];

const loanTerms = [36, 48, 60, 72];

export default function FinancePage() {
  // Calculator States
  const [vehiclePrice, setVehiclePrice] = useState<number>(20000);
  const [downPayment, setDownPayment] = useState<number>(4000);
  const [selectedApr, setSelectedApr] = useState<number>(7.20);
  const [selectedTerm, setSelectedTerm] = useState<number>(72);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);

  // Recalculate monthly payment on state change
  useEffect(() => {
    const loanAmount = Math.max(0, vehiclePrice - downPayment);
    if (loanAmount <= 0) {
      setMonthlyPayment(0);
      return;
    }
    const monthlyRate = (selectedApr / 100) / 12;
    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, selectedTerm)) / (Math.pow(1 + monthlyRate, selectedTerm) - 1);
    setMonthlyPayment(Math.round(payment));
  }, [vehiclePrice, downPayment, selectedApr, selectedTerm]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setVehiclePrice(val);
    // Keep down payment below vehicle price
    if (downPayment > val) {
      setDownPayment(Math.floor(val * 0.2));
    }
  };

  const handleDownPaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setDownPayment(Math.min(val, vehiclePrice));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-8">
      {/* 1. Hero Section */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Hero Left */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles size={13} /> CarMatrix Finance
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
              Shop with <span className="text-[#29abe2]">real rates</span> in hand
            </h1>
            <p className="text-lg text-slate-600 font-medium mb-8 max-w-[500px] leading-relaxed">
              Get pre-qualified in minutes with no impact on your credit score. Know your buying power before visiting the dealership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <button className="px-8 py-4 bg-[#29abe2] text-white font-bold rounded-2xl shadow-lg shadow-[#29abe2]/20 hover:bg-[#2089b5] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer">
                Get pre-qualified
              </button>
              <a href="#" className="text-sm font-bold text-[#29abe2] hover:underline py-2">
                Already pre-qualified? Retrieve your offer
              </a>
            </div>
          </div>

          {/* Hero Right Graphic */}
          <div className="relative">
            {/* Visual Glassmorphic Wrapper */}
            <div className="rounded-[32px] overflow-hidden bg-gradient-to-br from-slate-200/50 via-slate-100/50 to-white/70 border border-white/60 p-4 shadow-xl">
              <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden relative bg-slate-200">
                <img 
                  src="https://images.unsplash.com/photo-1580828343064-fde4fc206bc6?auto=format&fit=crop&w=1200&q=80" 
                  alt="Shop with confidence"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating pill badge matching image layout */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white flex items-center gap-3 animate-bounce-slow">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Pre-Qualified</div>
                    <div className="text-lg font-extrabold text-slate-900">$400/mo</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Key Benefits Cards Section */}
      <section className="bg-white border-y border-slate-200/80 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 flex flex-col items-start hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#29abe2] mb-6">
                <CreditCard size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">No impact on your credit score</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Get personalized loan offers in minutes using a soft credit pull, with zero impact to your credit rating.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 flex flex-col items-start hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#29abe2] mb-6">
                <Lock size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Lock in competitive rates</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Our trusted national lender partners offer competitive rates, locked and valid for a full 30 days.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8 flex flex-col items-start hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-[#29abe2] mb-6">
                <Coins size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Shop within your budget</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">
                Browse our entire vehicle catalog filtered directly by your monthly payment, so you buy with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Monthly Payment Estimator Calculator */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 text-center tracking-tight mb-16">
          Estimate your monthly payment
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Calculator Inputs Panel */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 space-y-8 shadow-sm">
            {/* Vehicle Price Input & Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Vehicle Price</label>
                <div className="text-lg font-extrabold text-slate-900">${vehiclePrice.toLocaleString()}</div>
              </div>
              <input 
                type="range" 
                min={5000} 
                max={100000} 
                step={500} 
                value={vehiclePrice}
                onChange={handlePriceChange}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
                <span>$5,000</span>
                <span>$100,000+</span>
              </div>
            </div>

            {/* Down Payment Input & Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Down Payment</label>
                <div className="text-lg font-extrabold text-[#29abe2]">${downPayment.toLocaleString()}</div>
              </div>
              <input 
                type="range" 
                min={0} 
                max={vehiclePrice} 
                step={250} 
                value={downPayment}
                onChange={handleDownPaymentChange}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
              />
              <div className="flex justify-between text-[11px] font-bold text-slate-400 mt-2">
                <span>$0</span>
                <span>${vehiclePrice.toLocaleString()} (100%)</span>
              </div>
            </div>

            {/* Credit Score Button Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Credit Score</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {creditTiers.map((tier) => (
                  <button 
                    key={tier.label}
                    type="button"
                    onClick={() => setSelectedApr(tier.apr)}
                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border font-sans transition-all cursor-pointer ${
                      selectedApr === tier.apr
                        ? 'border-[#29abe2] bg-[#29abe2]/5 ring-2 ring-[#29abe2]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm font-extrabold text-slate-900">{tier.label}</span>
                    <span className="text-[11px] font-medium text-slate-400 mt-0.5">{tier.range}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term Options */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Loan Term</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {loanTerms.map((term) => (
                  <button 
                    key={term}
                    type="button"
                    onClick={() => setSelectedTerm(term)}
                    className={`py-4 rounded-2xl border font-bold text-sm text-slate-950 transition-all cursor-pointer ${
                      selectedTerm === term
                        ? 'border-[#29abe2] bg-[#29abe2]/5 ring-2 ring-[#29abe2]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    {term} mo
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Summary Card Panel */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-[32px] bg-gradient-to-tr from-[#29abe2]/10 via-[#29abe2]/5 to-sky-100/30 border border-[#29abe2]/15 p-8 flex flex-col justify-center items-center text-center shadow-lg relative overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-[radial-gradient(circle,_rgba(41,171,226,0.15)_0%,_transparent_70%)] blur-2xl pointer-events-none select-none"></div>
              
              <p className="text-sm font-bold text-slate-500 mb-2">Your estimated payment is</p>
              <div className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-3">
                ${monthlyPayment}<span className="text-lg font-bold text-slate-400">/mo*</span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mb-8">
                with <span className="font-bold text-[#29abe2]">{selectedApr.toFixed(2)}% APR</span>
              </p>
              
              <button className="w-full py-4 bg-[#29abe2] text-white font-bold rounded-2xl shadow-md shadow-[#29abe2]/15 hover:bg-[#2089b5] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer mb-4">
                Get pre-qualified
              </button>
              
              <p className="text-[11px] font-bold text-slate-400 max-w-[240px] leading-relaxed">
                See personalized rates with no credit impact
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How financing works section */}
      <section className="w-full bg-[#051124] py-20 px-4 sm:px-6 lg:px-8 text-white relative overflow-hidden">
        {/* Glow Overlay */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,_rgba(41,171,226,0.06)_0%,_transparent_70%)] blur-3xl pointer-events-none select-none"></div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          <div className="md:col-span-5">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-4">
              How financing with CarMatrix works
            </h2>
            <p className="text-slate-400 font-medium leading-relaxed max-w-[400px]">
              You're just three simple steps away from driving off the lot in your new car.
            </p>
          </div>
          
          <div className="md:col-span-7 space-y-8">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg border border-white/10 shrink-0">
                1
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Get pre-qualified</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Submit a few basic details to our lending network. Approvals occur in seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg border border-white/10 shrink-0">
                2
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Shop millions of cars</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Find the exact car you want. Enter your details to fine-tune your actual interest rate.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-lg border border-white/10 shrink-0">
                3
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">Make your purchase</h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Bring your pre-qualification certificate directly to the partner dealership. That's it!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Lender Logos */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-10">Meet Our Lenders</h4>
          
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16 opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-300">
            {/* Capital One mock logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-serif font-bold italic text-sm">C</div>
              <span className="font-sans font-black text-slate-800 text-lg tracking-tight">capitalOne</span>
            </div>

            {/* Chase mock logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rotate-45 border-4 border-sky-600 shrink-0"></div>
              <span className="font-serif font-bold text-slate-800 text-xl tracking-wide uppercase">CHASE</span>
            </div>

            {/* Westlake mock logo */}
            <div className="flex items-center gap-1">
              <span className="font-sans font-extrabold text-amber-700 text-lg">W</span>
              <span className="font-sans font-bold text-slate-800 text-sm uppercase tracking-wider">Westlake Financial</span>
            </div>

            {/* Global Lending Services mock logo */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-indigo-900 flex items-center justify-center text-white text-[10px] font-bold">GLS</div>
              <span className="font-sans font-black text-slate-800 text-sm tracking-widest uppercase">GLOBAL LENDING</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
