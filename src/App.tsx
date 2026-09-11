import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Heart, User, ChevronDown, 
  ArrowUpRight, CarFront, Sparkles, CheckCircle2, 
  AlertTriangle, AlertCircle, ArrowUpCircle, ArrowDownLeft,
  RefreshCw, Calculator, Zap, DollarSign, ShieldCheck,
  TrendingUp, Bot, Compass, HelpCircle, Layers, SlidersHorizontal,
  FileSearch, Scale, ArrowLeftRight, Printer, TrendingDown
} from 'lucide-react';
import SearchPage from './SearchPage';
import TCOCalculator from './TCOCalculator';
import SellMyCar from './pages/SellMyCar';
import VehicleDetailPage from './VehicleDetailPage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Dashboard from './Dashboard';
import VisionPage from './VisionPage';
import TeamPage from './TeamPage';
import PressPage from './PressPage';
import PublicRelationsPage from './PublicRelationsPage';
import FAQPage from './FAQPage';
import ContactPage from './ContactPage';
import DealersPage from './DealersPage';
import InfluencersPage from './InfluencersPage';
import { MarketCheckCar } from './services/marketcheck';
import { supabase } from './supabaseClient';
import MarketPulse from './components/MarketPulse';
import MarketPulsePage from './MarketPulsePage';
import OnboardingPage from '../app/admin/onboarding/page';
import LatestArticles from './components/LatestArticles';
import ExpertAdviceFeeds from './components/ExpertAdviceFeeds';
import FeaturedInfluencerFeeds from './components/FeaturedInfluencerFeeds';
import FinancePage from './FinancePage';

// Toolkit Widgets
import EVComparisonWidget from './components/toolkit/EVComparisonWidget';
import ValuationWidget from './components/toolkit/ValuationWidget';
import InspectionChecklistWidget from './components/toolkit/InspectionChecklistWidget';
import AIAdvisorWidget from './components/toolkit/AIAdvisorWidget';
import VINRecallWidget from './components/toolkit/VINRecallWidget';
import DealerQuoteAuditorWidget from './components/toolkit/DealerQuoteAuditorWidget';
import StateFeeGuideWidget from './components/toolkit/StateFeeGuideWidget';
import LeaseVsFinanceWidget from './components/toolkit/LeaseVsFinanceWidget';
import TestDriveDossierWidget from './components/toolkit/TestDriveDossierWidget';
import DepreciationPredictorWidget from './components/toolkit/DepreciationPredictorWidget';

const NavBar = ({ 
  onSearchClick, 
  onSellClick, 
  onHomeClick, 
  onSignInClick, 
  onDashboardClick, 
  onMarketPulseClick, 
  onFinanceClick, 
  onScrollToTool,
  session 
}: { 
  onSearchClick: () => void; 
  onSellClick: () => void; 
  onHomeClick: () => void; 
  onSignInClick: () => void; 
  onDashboardClick: () => void; 
  onMarketPulseClick: () => void; 
  onFinanceClick: () => void; 
  onScrollToTool?: (toolId: string) => void;
  session: any 
}) => (
  <header className="light-glass sticky top-0 z-50 border-b border-slate-200/60">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-[88px]">
        <div className="cursor-pointer flex items-center shrink-0" onClick={onHomeClick}>
          <img 
            src="https://res.cloudinary.com/yrhldsmj/image/upload/v1789086556/Logo-CarMatrix_avzdkk.png" 
            alt="CarMatrix Logo" 
            className="h-[65px] w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <nav className="flex items-center gap-6 sm:gap-8 text-[13.5px] font-semibold text-slate-600">
          <button 
            onClick={() => { onHomeClick(); onScrollToTool && onScrollToTool('ai-advisor'); }}
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            AI Advisor
          </button>

          <button 
            onClick={() => { onHomeClick(); onScrollToTool && onScrollToTool('tco-calculator'); }}
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            5-Year TCO
          </button>

          <button 
            onClick={() => { onHomeClick(); onScrollToTool && onScrollToTool('valuation-estimator'); }}
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            Valuation
          </button>

          <button 
            onClick={() => { onHomeClick(); onScrollToTool && onScrollToTool('ev-comparison'); }}
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            EV vs Gas
          </button>

          <button 
            onClick={() => { onHomeClick(); onScrollToTool && onScrollToTool('inspection-checklist'); }}
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            Fee & Inspection
          </button>

          <button 
            onClick={(e) => { e.preventDefault(); onMarketPulseClick(); }} 
            className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
          >
            Market Pulse
          </button>
        </nav>
      </div>
    </div>
  </header>
);

const ToolkitHeroHeader = ({ 
  activeFilter, 
  setActiveFilter, 
  onScrollToTool 
}: { 
  activeFilter: string; 
  setActiveFilter: (f: string) => void; 
  onScrollToTool: (toolId: string) => void;
}) => {
  const tools = [
    { id: 'all', name: 'All Tools', icon: Layers, color: 'text-sky-400', bg: 'bg-sky-400/10' },
    { id: 'ai', name: 'AI Advisor', icon: Bot, target: 'ai-advisor', color: 'text-[#29abe2]', bg: 'bg-sky-500/10' },
    { id: 'vin', name: 'VIN & Recall', icon: Search, target: 'vin-checker', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'quote', name: 'Quote Auditor', icon: FileSearch, target: 'quote-auditor', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
    { id: 'state-fees', name: 'State Fees', icon: Scale, target: 'state-fees', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'lease', name: 'Lease vs Buy', icon: ArrowLeftRight, target: 'lease-vs-finance', color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { id: 'tco', name: '5-Yr TCO', icon: Calculator, target: 'tco-calculator', color: 'text-teal-400', bg: 'bg-teal-400/10' },
    { id: 'loan', name: 'Loan & Budget', icon: SlidersHorizontal, target: 'loan-calculator', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'dossier', name: 'Test Dossier', icon: Printer, target: 'test-drive-dossier', color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'depreciation', name: 'Value Curve', icon: TrendingDown, target: 'depreciation-curve', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'valuation', name: 'Valuation', icon: DollarSign, target: 'valuation-estimator', color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'ev', name: 'EV vs Gas', icon: Zap, target: 'ev-comparison', color: 'text-green-400', bg: 'bg-green-400/10' },
    { id: 'inspection', name: 'Inspection', icon: ShieldCheck, target: 'inspection-checklist', color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { id: 'market', name: 'Market Trends', icon: TrendingUp, target: 'market-trends', color: 'text-sky-300', bg: 'bg-sky-300/10' },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1180px] mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4">
          Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] to-emerald-400">buy smarter</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
          Unbiased calculators, 5-year ownership cost projections, live market valuations, and AI negotiation research designed to save you thousands.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3 sm:gap-3.5 max-w-6xl mx-auto">
          {tools.map((t) => {
            const Icon = t.icon;
            const isSelected = activeFilter === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setActiveFilter(t.id);
                  if (t.target) {
                    onScrollToTool(t.target);
                  }
                }}
                className={
                  "group relative aspect-square flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-xl border " +
                  (isSelected
                    ? "bg-gradient-to-b from-[#29abe2]/25 to-sky-600/15 border-[#29abe2] text-white shadow-[0_0_24px_rgba(41,171,226,0.35)] scale-[1.02] ring-1 ring-[#29abe2]/50"
                    : "bg-white/[0.04] hover:bg-white/[0.09] border-white/10 hover:border-white/20 text-slate-300 hover:text-white shadow-lg shadow-black/20 hover:-translate-y-1")
                }
              >
                <div
                  className={
                    "w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-all duration-200 " +
                    (isSelected
                      ? "bg-[#29abe2] text-white shadow-md shadow-sky-500/40"
                      : `${t.bg} ${t.color} group-hover:scale-110 group-hover:bg-white/15`)
                  }
                >
                  <Icon size={20} strokeWidth={2} />
                </div>
                <span className="text-[11.5px] font-bold tracking-tight text-center leading-tight">
                  {t.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const EstimateBudgetSection = () => {
  const [downPayment, setDownPayment] = React.useState(2350);
  const [loanTerm, setLoanTerm] = React.useState(60);
  const [apr, setApr] = React.useState(0.0979); 
  const [monthlyPayment, setMonthlyPayment] = React.useState(418);
  const [includeTradeIn, setIncludeTradeIn] = React.useState(false);
  const [tradeInAmount, setTradeInAmount] = React.useState(0);

  const monthlyRate = apr / 12;
  const maxLoanAmount = monthlyRate > 0 
    ? monthlyPayment * (1 - Math.pow(1 + monthlyRate, -loanTerm)) / monthlyRate 
    : monthlyPayment * loanTerm;
    
  const totalBudget = Math.round(maxLoanAmount + downPayment + (includeTradeIn ? tradeInAmount : 0));
  const totalLoanRepayment = Math.round(monthlyPayment * loanTerm);
  const totalInterestPaid = Math.max(0, totalLoanRepayment - Math.round(maxLoanAmount));

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-[#29abe2] text-xs font-bold mb-2">
            <SlidersHorizontal size={14} className="text-[#29abe2]" />
            <span>Financing & Budget Engine</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Auto Loan & Affordability Calculator</h3>
          <p className="text-slate-500 text-sm mt-1">Calculate purchasing power, down payment leverage, and total interest amortization.</p>
        </div>

        <div className="bg-[#29abe2] text-white p-4 rounded-2xl shrink-0 min-w-[200px]">
          <span className="text-[11px] font-semibold text-sky-100 uppercase tracking-wider block">Estimated Max Vehicle Price</span>
          <span className="text-3xl font-black text-white leading-none block mt-1">
            {"$" + totalBudget.toLocaleString()}
          </span>
          <span className="text-[11px] text-sky-100 block mt-1 font-medium">with {((apr || 0) * 100).toFixed(2)}% APR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Monthly</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900">
                <span className="text-slate-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={monthlyPayment} 
                  onChange={e => setMonthlyPayment(Number(e.target.value))}
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Down Payment</label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900">
                <span className="text-slate-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={downPayment} 
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Loan Term</label>
              <div className="relative">
                <select 
                  value={loanTerm} 
                  onChange={e => setLoanTerm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer"
                >
                  <option value={36}>36 months</option>
                  <option value={48}>48 months</option>
                  <option value={60}>60 months</option>
                  <option value={72}>72 months</option>
                  <option value={84}>84 months</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Credit Tier / APR</label>
              <div className="relative">
                <select 
                  value={apr} 
                  onChange={e => setApr(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer"
                >
                  <option value={0.065}>740+ (6.50%)</option>
                  <option value={0.0979}>680-739 (9.79%)</option>
                  <option value={0.1400}>630-679 (14.0%)</option>
                  <option value={0.2000}>Under 630 (20%)</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-1">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setIncludeTradeIn(!includeTradeIn)}>
              <div className={"w-10 h-5 rounded-full relative transition-colors " + (includeTradeIn ? "bg-[#29abe2]" : "bg-slate-300")}>
                <div className={"w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all " + (includeTradeIn ? "left-5" : "left-0.5")}></div>
              </div>
              <span className="text-xs text-slate-800 font-bold">Include Trade-In Equity</span>
            </div>

            {includeTradeIn && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-semibold">Trade-in Value:</span>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 w-28">
                  <span className="text-slate-400 mr-1">$</span>
                  <input 
                    type="number" 
                    value={tradeInAmount} 
                    onChange={e => setTradeInAmount(Number(e.target.value))}
                    className="w-full outline-none bg-transparent"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Estimated Financed Principal:</span>
              <span className="font-bold text-slate-900">{"$" + Math.round(maxLoanAmount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Estimated Interest:</span>
              <span className="font-bold text-amber-700">{"$" + totalInterestPaid.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Loan Payments Over {loanTerm} Mo:</span>
              <span className="font-bold text-slate-900">{"$" + totalLoanRepayment.toLocaleString()}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-200">
            <HelpCircle size={13} className="shrink-0" />
            <span>Excludes state sales tax & title fees. Prequalify with lenders for exact APR.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResearchAndReviews = () => {
  const reviews = [
    { title: "2026 Cadillac Escalade Review", rating: "7.7/10", img: "https://images.unsplash.com/photo-1606841362432-841f3918a6e9?auto=format&fit=crop&w=600&q=80", url: "https://www.caranddriver.com/cadillac/escalade" },
    { title: "2026 Dodge Durango Review", rating: "6.5/10", img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80", url: "https://www.caranddriver.com/dodge/durango" },
    { title: "2026 Lexus LX Hybrid Review", rating: "6.8/10", img: "https://images.unsplash.com/photo-1614026480209-cd9934144671?auto=format&fit=crop&w=600&q=80", url: "https://www.caranddriver.com/lexus/lx" },
    { title: "2026 Hyundai Venue Review", rating: "5.2/10", img: "https://images.unsplash.com/photo-1550262141-8631bc0cb67f?auto=format&fit=crop&w=600&q=80", url: "https://www.caranddriver.com/hyundai/venue" },
  ];
  
  const guides = [
    { title: "The Best Gas Mileage Trucks of 2026", img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
    { title: "The Best Cars for Remote Work in 2026", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
    { title: "Toyota RAV4 Long-Term Ownership Review", img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/toyota/rav4/" },
    { title: "How to Avoid Dealer Junk Fees in 2026", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Latest Vehicle Deep Dives</h3>
            <p className="text-xs text-slate-500 mt-0.5">Independent road tests, reliability findings, and safety scores</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group bg-white border border-slate-200/80 rounded-2xl p-3 hover:shadow-lg transition-all">
              <div className="rounded-xl overflow-hidden mb-3 h-32 relative bg-slate-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.rating}
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug">{item.title}</h4>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Buyer Research Guides</h3>
            <p className="text-xs text-slate-500 mt-0.5">Practical strategies, financing tips, and inspection advice</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group bg-white border border-slate-200/80 rounded-2xl p-3 hover:shadow-lg transition-all">
              <div className="rounded-xl overflow-hidden mb-3 h-32 relative bg-slate-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug">{item.title}</h4>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (path: any) => void }) => (
  <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-800 mt-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1789086556/Logo-CarMatrix_avzdkk.png" 
              alt="CarMatrix Logo" 
              className="h-11 w-auto object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
            Empowering smart vehicle buyers with unbiased research tools, transparent 5-year ownership projections, and real-time market data.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Research Tools</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">AI Buying Advisor</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">VIN & Recall Scanner</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Dealer Quote Auditor</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">State Doc Fee Guide</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Lease vs. Finance</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">5-Year TCO Calculator</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Test-Drive Dossier</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">Depreciation Predictor</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Company</h4>
          <ul className="space-y-2">
            <li><button onClick={() => onNavigate('vision')} className="hover:text-white cursor-pointer">Vision</button></li>
            <li><button onClick={() => onNavigate('team')} className="hover:text-white cursor-pointer">Team</button></li>
            <li><button onClick={() => onNavigate('dealers')} className="hover:text-white cursor-pointer">Dealer Network</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">Contact</button></li>
          </ul>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
        <span>© 2026 CarMatrix Inc. All rights reserved. Data powered by NHTSA & MarketCheck.</span>
        <div className="flex gap-4">
          <button onClick={() => onNavigate('faq')} className="hover:text-slate-400 cursor-pointer">FAQ</button>
          <button onClick={() => onNavigate('pr')} className="hover:text-slate-400 cursor-pointer">Press & PR</button>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [session, setSession] = useState<any>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<MarketCheckCar | null>(null);
  const [signupEmail, setSignupEmail] = useState('');
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);
  const [searchFilters, setSearchFilters] = useState<any>(null);
  const [activeToolkitFilter, setActiveToolkitFilter] = useState<string>('all');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSelectVehicle = (vehicle: MarketCheckCar) => {
    setSelectedVehicle(vehicle);
    setCurrentPath('vehicle_detail');
  };

  const scrollToTool = (toolId: string) => {
    setTimeout(() => {
      const el = document.getElementById(toolId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navigateTo = (path: string) => {
    const protectedPaths = ['dashboard'];
    if (protectedPaths.includes(path) && !session) {
      setCurrentPath('signin');
    } else {
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="font-sans text-slate-900 min-h-screen selection:bg-[#29abe2]/20 relative flex flex-col bg-slate-50/50">
      <NavBar 
        onSearchClick={() => navigateTo('search')}
        onSellClick={() => navigateTo('sell')}
        onHomeClick={() => navigateTo('home')}
        onSignInClick={() => navigateTo('signin')}
        onDashboardClick={() => navigateTo('dashboard')}
        onMarketPulseClick={() => navigateTo('market_pulse')}
        onFinanceClick={() => navigateTo('finance')}
        onScrollToTool={scrollToTool}
        session={session}
      />
      
      <div className="flex-1">
        {currentPath === 'search' ? (
          <SearchPage 
            onClose={() => navigateTo('home')} 
            onSelectVehicle={handleSelectVehicle}
            initialFilters={searchFilters}
          />
        ) : currentPath === 'sell' ? (
          <SellMyCar />
        ) : currentPath === 'dashboard' ? (
          <Dashboard onBack={() => navigateTo('home')} />
        ) : currentPath === 'signin' ? (
          <SignIn 
            onBack={() => navigateTo('home')} 
            onSignUp={() => {
              setShowSignupSuccess(false);
              navigateTo('signup');
            }}
            onSuccess={() => {
              setShowSignupSuccess(false);
              navigateTo('home');
            }}
            initialEmail={signupEmail}
            signupSuccess={showSignupSuccess}
          />
        ) : currentPath === 'signup' ? (
          <SignUp 
            onBack={() => navigateTo('home')} 
            onSignIn={() => navigateTo('signin')}
            onSuccess={(email) => {
              setSignupEmail(email);
              setShowSignupSuccess(true);
              navigateTo('signin');
            }}
          />
        ) : currentPath === 'vehicle_detail' && selectedVehicle ? (
          <VehicleDetailPage 
            vehicle={selectedVehicle} 
            onBack={() => navigateTo('search')} 
          />
        ) : currentPath === 'vision' ? (
          <VisionPage />
        ) : currentPath === 'team' ? (
          <TeamPage />
        ) : currentPath === 'press' ? (
          <PressPage />
        ) : currentPath === 'pr' ? (
          <PublicRelationsPage />
        ) : currentPath === 'faq' ? (
          <FAQPage />
        ) : currentPath === 'contact' ? (
          <ContactPage />
        ) : currentPath === 'dealers' ? (
          <DealersPage />
        ) : currentPath === 'influencers' ? (
          <InfluencersPage />
        ) : currentPath === 'market_pulse' ? (
          <MarketPulsePage onBack={() => navigateTo('home')} />
        ) : currentPath === 'admin_onboarding' ? (
          <OnboardingPage />
        ) : currentPath === 'finance' ? (
          <FinancePage />
        ) : (
          <>
            <ToolkitHeroHeader 
              activeFilter={activeToolkitFilter} 
              setActiveFilter={setActiveToolkitFilter}
              onScrollToTool={scrollToTool}
            />
          
            <main className="max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
              
              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'ai') && (
                <section id="ai-advisor" className="scroll-mt-24">
                  <AIAdvisorWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'vin') && (
                <section id="vin-checker" className="scroll-mt-24">
                  <VINRecallWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'quote') && (
                <section id="quote-auditor" className="scroll-mt-24">
                  <DealerQuoteAuditorWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'state-fees') && (
                <section id="state-fees" className="scroll-mt-24">
                  <StateFeeGuideWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'lease') && (
                <section id="lease-vs-finance" className="scroll-mt-24">
                  <LeaseVsFinanceWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'tco') && (
                <section id="tco-calculator" className="scroll-mt-24">
                  <TCOCalculator />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'loan') && (
                <section id="loan-calculator" className="scroll-mt-24">
                  <EstimateBudgetSection />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'dossier') && (
                <section id="test-drive-dossier" className="scroll-mt-24">
                  <TestDriveDossierWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'depreciation') && (
                <section id="depreciation-curve" className="scroll-mt-24">
                  <DepreciationPredictorWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'ev') && (
                <section id="ev-comparison" className="scroll-mt-24">
                  <EVComparisonWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'valuation') && (
                <section id="valuation-estimator" className="scroll-mt-24">
                  <ValuationWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'inspection') && (
                <section id="inspection-checklist" className="scroll-mt-24">
                  <InspectionChecklistWidget />
                </section>
              )}

              {(activeToolkitFilter === 'all' || activeToolkitFilter === 'market') && (
                <section id="market-trends" className="scroll-mt-24 bg-white rounded-3xl border border-slate-200/80 shadow-xl p-6 md:p-8">
                  <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-[#29abe2] text-xs font-bold mb-2">
                      <TrendingUp size={14} className="text-[#29abe2]" />
                      <span>Live Market Feed</span>
                    </div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Market Trends & Price Index</h3>
                    <p className="text-slate-500 text-sm mt-1">Track real-time inventory days-supply, wholesale price trajectory, and regional price adjustments.</p>
                  </div>
                  <MarketPulse onSearchClick={() => navigateTo('search')} />
                </section>
              )}

              <section className="pt-6 border-t border-slate-200">
                <ResearchAndReviews />
              </section>
            </main>
          
            <LatestArticles />
            <ExpertAdviceFeeds />
            <FeaturedInfluencerFeeds />
          </>
        )}
      </div>
      
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
