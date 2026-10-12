import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, ArrowUpRight, 
  Calculator, Zap, DollarSign, ShieldCheck,
  TrendingUp, Bot, HelpCircle, Layers, SlidersHorizontal,
  FileSearch, Scale, ArrowLeftRight, Printer, TrendingDown,
  Menu, X, ChevronRight, Cpu, ShoppingBag, Terminal, Activity, AlertTriangle, BookOpen, Compass
} from 'lucide-react';
import TCOCalculator from './TCOCalculator';
import VisionPage from './VisionPage';
import TeamPage from './TeamPage';
import PressPage from './PressPage';
import PublicRelationsPage from './PublicRelationsPage';
import FAQPage from './FAQPage';
import ContactPage from './ContactPage';
import InfluencersPage from './InfluencersPage';
import GearGuidePage from './GearGuidePage';
import MarketPulse from './components/MarketPulse';
import MarketPulsePage from './MarketPulsePage';
import LatestArticles from './components/LatestArticles';
import ExpertAdviceFeeds from './components/ExpertAdviceFeeds';
import DealerTacticsExposed from './components/DealerTacticsExposed';
import FeaturedInfluencerFeeds from './components/FeaturedInfluencerFeeds';
import FinancePage from './FinancePage';
import LegalCompliancePage from './LegalCompliancePage';
import CookieConsentBanner from './components/CookieConsentBanner';

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
import CostOfOwnershipWidget from './components/toolkit/CostOfOwnershipWidget';
import AutoLoanCalculatorWidget from './components/toolkit/AutoLoanCalculatorWidget';
import DealerDirectoryPage from './DealerDirectoryPage';
import DealerProfilePage from './DealerProfilePage';
import RankingsPage from './RankingsPage';
import TerminalTour from './components/tour/TerminalTour';
import CarMatrixLanding from './CarMatrixLanding';
import GuidedEvaluator from './GuidedEvaluator';

const NavBar = ({ 
  onHomeClick, 
  onTerminalClick,
  onEvaluatorClick,
  onRankingsClick,
  onMarketPulseClick, 
  onGearClick,
  onDealerDirectoryClick,
  onScrollToTool,
  onStartTour,
  currentPath = 'terminal',
}: { 
  onHomeClick: () => void; 
  onTerminalClick?: () => void;
  onEvaluatorClick?: () => void;
  onRankingsClick?: () => void;
  onMarketPulseClick: () => void; 
  onGearClick?: () => void;
  onDealerDirectoryClick?: () => void;
  onScrollToTool?: (toolId: string) => void;
  onStartTour?: () => void;
  currentPath?: string;
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    {
      id: 'terminal',
      label: 'Terminal',
      icon: Terminal,
      onClick: () => { setMobileMenuOpen(false); onTerminalClick?.(); },
      isActive: currentPath === 'terminal' || currentPath === 'home',
    },
    {
      id: 'guided_evaluator',
      label: 'Deal Evaluator',
      icon: Compass,
      onClick: () => { setMobileMenuOpen(false); onEvaluatorClick?.(); },
      isActive: currentPath === 'guided_evaluator',
    },
    {
      id: 'rankings',
      label: 'Used Cars',
      icon: TrendingUp,
      onClick: () => { setMobileMenuOpen(false); onRankingsClick?.(); },
      isActive: currentPath === 'rankings',
    },
    {
      id: 'market_pulse',
      label: 'Market Pulse',
      icon: Activity,
      onClick: () => { setMobileMenuOpen(false); onMarketPulseClick(); },
      isActive: currentPath === 'market_pulse',
    },
    {
      id: 'dealer_directory',
      label: 'Dealer Intel™',
      icon: ShieldCheck,
      onClick: () => { setMobileMenuOpen(false); onDealerDirectoryClick?.(); },
      isActive: currentPath === 'dealer_directory' || currentPath === 'dealers',
      badge: 'DFW',
    },
    {
      id: 'gear',
      label: "Buyer's Gear",
      icon: ShoppingBag,
      onClick: () => { setMobileMenuOpen(false); onGearClick?.(); },
      isActive: currentPath === 'gear',
    },
  ];

  return (
    <header className="sticky top-0 z-50 font-poppins text-white">
      {/* Top Navbar Bar with glassmorphism */}
      <div className="border-b border-white/[0.08] bg-[#070b14]/90 backdrop-blur-xl">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[72px]">
            {/* Logo */}
            <div 
              className="cursor-pointer flex items-center shrink-0 group" 
              onClick={() => { setMobileMenuOpen(false); onHomeClick(); }}
            >
              <img 
                src="https://res.cloudinary.com/yrhldsmj/image/upload/v1791661870/Logo-white-500_m3yxou.png" 
                alt="CarMatrix Logo" 
                className="w-[180px] sm:w-[210px] h-auto object-contain transition-opacity group-hover:opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-medium font-poppins">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={(e) => { e.preventDefault(); item.onClick(); }}
                    className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                      item.isActive
                        ? 'text-white bg-white/[0.12] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06] border border-transparent'
                    }`}
                  >
                    <Icon size={13} className={item.isActive ? 'text-[#29abe2]' : 'text-slate-400'} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action: Quick Tour & CTA */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button 
                onClick={(e) => { e.preventDefault(); onStartTour?.(); }} 
                className="text-xs px-3 py-1.5 rounded-full border border-white/10 text-slate-300 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all flex items-center gap-1.5 font-medium whitespace-nowrap cursor-pointer"
                title="Interactive Terminal Tour"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#29abe2]" />
                <span>Quick Tour</span>
              </button>

              {currentPath === 'guided_evaluator' ? (
                <button 
                  onClick={(e) => { e.preventDefault(); onTerminalClick?.(); }} 
                  className="text-xs px-4 py-1.5 rounded-full font-semibold bg-gradient-to-r from-[#29abe2] to-sky-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_16px_rgba(41,171,226,0.35)] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Open Terminal</span>
                </button>
              ) : (
                <button 
                  onClick={(e) => { e.preventDefault(); onEvaluatorClick?.(); }} 
                  className="text-xs px-4 py-1.5 rounded-full font-semibold bg-gradient-to-r from-[#29abe2] to-sky-400 text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_16px_rgba(41,171,226,0.35)] transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Evaluate Deal</span>
                </button>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs focus:outline-none ${
                  mobileMenuOpen 
                    ? "bg-[#29abe2]/20 text-[#29abe2] border border-[#29abe2]/40 shadow-[0_0_15px_rgba(41,171,226,0.25)]" 
                    : "bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/15 text-slate-200 hover:text-white"
                }`}
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay (Viewport Fixed) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-50 lg:hidden">
          {/* Frosted Dark Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div className="relative z-10 h-full bg-[#070b14]/98 border-t border-white/10 p-4 sm:p-6 overflow-y-auto text-white flex flex-col justify-between shadow-2xl">
            <div className="max-w-md mx-auto w-full space-y-3">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
                    CarMatrix Navigation
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#29abe2] bg-[#29abe2]/10 border border-[#29abe2]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live Tools
                </span>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2 pt-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => { e.preventDefault(); item.onClick(); }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer ${
                        item.isActive
                          ? 'bg-white/[0.12] border-[#29abe2]/50 text-white shadow-[0_0_20px_rgba(41,171,226,0.15)]'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                          item.isActive 
                            ? 'bg-[#29abe2]/20 border-[#29abe2]/40 text-[#29abe2]' 
                            : 'bg-white/[0.06] border-white/10 text-slate-300'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-white flex items-center gap-2">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={16} className={item.isActive ? 'text-[#29abe2]' : 'text-slate-500'} />
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onStartTour?.(); }}
                  className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <HelpCircle size={15} className="text-[#29abe2]" />
                  <span>Interactive Terminal Tour</span>
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onHomeClick(); }}
                  className="w-full py-2 px-4 text-center text-xs text-slate-400 hover:text-slate-200 cursor-pointer transition-colors"
                >
                  ← Return to Home Overview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const ToolkitHeroHeader = ({ 
  activeFilter, 
  setActiveFilter, 
  onScrollToTool 
}: { 
  activeFilter: string; 
  setActiveFilter: (f: string) => void; 
  onScrollToTool: (toolId: string) => void;
}) => {
  const TOOLKIT_CATEGORIES = [
    {
      id: 'recon',
      name: 'Pre-Lot Recon',
      sectorCode: 'SECTOR 01',
      badge: 'INTEL & VERIFICATION',
      borderColor: 'border-sky-500/30 hover:border-sky-400/70',
      panelGradients: 'from-sky-950/40 via-slate-900/65 to-[#080d19]/90',
      glowBorder: 'shadow-[0_16px_48px_rgba(0,0,0,0.65),0_0_30px_rgba(41,171,226,0.14)]',
      glowOrb: 'bg-gradient-to-br from-sky-400/20 via-sky-600/10 to-transparent group-hover:from-sky-400/30',
      topRim: 'from-transparent via-sky-300/60 to-transparent',
      badgeStyle: 'bg-sky-500/15 border-sky-400/30 text-sky-300 shadow-[0_0_12px_rgba(41,171,226,0.2)]',
      dotColor: 'bg-[#29abe2] shadow-[0_0_8px_#29abe2]',
      headingGradient: 'from-white via-sky-100 to-sky-300',
      description: 'Audit factory build history, true 5-year depreciation, and fair market valuation before stepping on the dealer lot.',
      hoverText: 'group-hover/btn:text-[#29abe2]',
      hoverBorder: 'group-hover/btn:border-sky-400/50',
      hoverShadow: 'group-hover/btn:shadow-[0_0_16px_rgba(41,171,226,0.22)]',
      selectedBtn: 'bg-slate-800/95 border-sky-400/80 shadow-[0_4px_20px_rgba(41,171,226,0.25)] ring-1 ring-sky-400/40 text-white',
      selectedIcon: 'text-[#29abe2] border-sky-400/50 bg-gradient-to-br from-sky-400/25 via-sky-500/10 to-transparent shadow-[0_0_16px_rgba(41,171,226,0.3)]',
      exploreBtnHover: 'hover:border-sky-400/40 hover:bg-sky-500/10 hover:text-sky-200',
      exploreIconColor: 'text-[#29abe2]',
      tools: [
        { id: 'vin', name: 'VIN & Recall Decoder', tag: 'NHTSA AUDIT', icon: Search, target: 'vin-checker', desc: 'Scan factory specs & open safety campaigns' },
        { id: 'tco', name: '5-Year Ownership TCO', tag: 'DEPRECIATION', icon: Calculator, target: 'tco-calculator', desc: 'True cost of fuel, insurance & maintenance' },
        { id: 'valuation', name: 'Live Market Valuation', tag: 'TRUE VALUE', icon: DollarSign, target: 'valuation-estimator', desc: 'Fair retail & wholesale trade equity' },
        { id: 'inspection', name: 'Pre-Purchase Inspection', tag: '40-PT CHECK', icon: ShieldCheck, target: 'inspection-checklist', desc: 'Physical mechanical inspection checklist' },
      ]
    },
    {
      id: 'finance',
      name: 'Finance Trap Detectors',
      sectorCode: 'SECTOR 02',
      badge: 'FINANCE GUARD',
      borderColor: 'border-amber-500/30 hover:border-amber-400/70',
      panelGradients: 'from-amber-950/35 via-slate-900/65 to-[#080d19]/90',
      glowBorder: 'shadow-[0_16px_48px_rgba(0,0,0,0.65),0_0_30px_rgba(245,158,11,0.14)]',
      glowOrb: 'bg-gradient-to-br from-amber-400/20 via-amber-600/10 to-transparent group-hover:from-amber-400/30',
      topRim: 'from-transparent via-amber-300/60 to-transparent',
      badgeStyle: 'bg-amber-500/15 border-amber-400/30 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      dotColor: 'bg-amber-400 shadow-[0_0_8px_#fbbf24]',
      headingGradient: 'from-white via-amber-100 to-amber-300',
      description: 'Expose backend APR markup, deceptive lease money factors, and underwater trade-in rollovers.',
      hoverText: 'group-hover/btn:text-amber-400',
      hoverBorder: 'group-hover/btn:border-amber-400/50',
      hoverShadow: 'group-hover/btn:shadow-[0_0_16px_rgba(245,158,11,0.22)]',
      selectedBtn: 'bg-slate-800/95 border-amber-400/80 shadow-[0_4px_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/40 text-white',
      selectedIcon: 'text-amber-400 border-amber-400/50 bg-gradient-to-br from-amber-400/25 via-amber-500/10 to-transparent shadow-[0_0_16px_rgba(245,158,11,0.3)]',
      exploreBtnHover: 'hover:border-amber-400/40 hover:bg-amber-500/10 hover:text-amber-200',
      exploreIconColor: 'text-amber-400',
      tools: [
        { id: 'loan', name: 'Auto Loan Calculator', tag: 'RATE SHIELD', icon: SlidersHorizontal, target: 'loan-calculator', desc: 'Purchasing power, amortized interest & terms' },
        { id: 'lease', name: 'Lease vs. Buy Simulator', tag: 'TERMS AUDIT', icon: ArrowLeftRight, target: 'lease-vs-finance', desc: 'Compare equity accumulation vs lease cashflow traps' },
        { id: 'depreciation', name: 'Negative Equity Check', tag: 'EQUITY TRAP', icon: TrendingDown, target: 'depreciation-curve', desc: 'Identify underwater loan risk & 7-yr depreciation curve' },
      ]
    },
    {
      id: 'closing',
      name: 'The Closing Table',
      sectorCode: 'SECTOR 03',
      badge: 'ADD-ON DEFENSE',
      borderColor: 'border-emerald-500/30 hover:border-emerald-400/70',
      panelGradients: 'from-emerald-950/35 via-slate-900/65 to-[#080d19]/90',
      glowBorder: 'shadow-[0_16px_48px_rgba(0,0,0,0.65),0_0_30px_rgba(16,185,129,0.14)]',
      glowOrb: 'bg-gradient-to-br from-emerald-400/20 via-emerald-600/10 to-transparent group-hover:from-emerald-400/30',
      topRim: 'from-transparent via-emerald-300/60 to-transparent',
      badgeStyle: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      headingGradient: 'from-white via-emerald-100 to-emerald-300',
      description: 'Weaponize out-the-door fee audits and AI negotiation leverage to eliminate dealer add-on junk fees at signing.',
      hoverText: 'group-hover/btn:text-emerald-400',
      hoverBorder: 'group-hover/btn:border-emerald-400/50',
      hoverShadow: 'group-hover/btn:shadow-[0_0_16px_rgba(16,185,129,0.22)]',
      selectedBtn: 'bg-slate-800/95 border-emerald-400/80 shadow-[0_4px_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-400/40 text-white',
      selectedIcon: 'text-emerald-400 border-emerald-400/50 bg-gradient-to-br from-emerald-400/25 via-emerald-500/10 to-transparent shadow-[0_0_16px_rgba(16,185,129,0.3)]',
      exploreBtnHover: 'hover:border-emerald-400/40 hover:bg-emerald-500/10 hover:text-emerald-200',
      exploreIconColor: 'text-emerald-400',
      tools: [
        { id: 'quote', name: 'Out-The-Door (OTD) Calculator', tag: 'JUNK FEE AUDIT', icon: FileSearch, target: 'quote-auditor', desc: 'Separate legitimate taxes/fees from bogus dealer add-ons' },
        { id: 'ai', name: 'Automotive Knowledge Engine', tag: 'AI LEVERAGE', icon: Cpu, target: 'ai-advisor', desc: 'Tactical dealer counter-scripts & market intelligence' },
        { id: 'state-fees', name: '50-State Statutory Doc Fees', tag: 'LEGAL CAPS', icon: Scale, target: 'state-fees', desc: '50-state statutory legal doc fee limits & averages' },
      ]
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 font-poppins">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#29abe2]/20 via-sky-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      <div className="max-w-[1240px] mx-auto relative z-10 space-y-10">
        
        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-tight font-poppins">
            Never Step onto a Dealership Lot <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#29abe2] via-sky-300 to-emerald-400">Unarmed</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed font-poppins">
            CarMatrix gives you the exact math, hidden-fee detectors, and negotiation scripts you need to beat the dealer.
          </p>
        </div>

        {/* The 3 Distinct Styled Categories (10 Widget Links) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {TOOLKIT_CATEGORIES.map((category) => (
            <div 
              key={category.id}
              id={`silo-${category.id}`}
              data-tour-target={`silo-${category.id}`}
              className={`group flex flex-col justify-between p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${category.panelGradients} border ${category.borderColor} ${category.glowBorder} hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden backdrop-blur-2xl scroll-mt-28`}
            >
              {/* Internal ambient radial glow orb */}
              <div className={`absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${category.glowOrb}`} />

              {/* Diagonal light refraction sheen */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent pointer-events-none" />

              {/* Specular Top Edge Light Rim */}
              <div className={`absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r ${category.topRim} pointer-events-none`} />

              {/* Bottom subtle edge illumination */}
              <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none" />

              <div className="relative z-10">
                {/* Sector & Badge Pill */}
                <div className="flex items-center justify-between mb-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md ${category.badgeStyle}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${category.dotColor}`} />
                    {category.sectorCode} · {category.badge}
                  </span>
                </div>

                <h3 className={`text-[22px] font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${category.headingGradient} mb-2 font-poppins`}>
                  {category.name}
                </h3>

                <p className="text-xs text-slate-300/80 leading-relaxed mb-6 font-poppins font-medium">
                  {category.description}
                </p>

                {/* Widget Links in this Category */}
                <div className="space-y-2.5">
                  {category.tools.map((t) => {
                    const Icon = t.icon;
                    const isSelected = activeFilter === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          setActiveFilter(t.id);
                          onScrollToTool(t.target);
                        }}
                        className={`group/btn w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left relative overflow-hidden backdrop-blur-xl ${
                          isSelected
                            ? category.selectedBtn
                            : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-slate-200 hover:-translate-y-0.5 shadow-sm shadow-black/30'
                        }`}
                      >
                        {/* Top sheen line on each inner button */}
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

                        <div className="flex items-center gap-3 min-w-0">
                          {/* Premium Jewel / Squircle Icon Pedestal */}
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 relative overflow-hidden shadow-inner ${
                            isSelected 
                              ? category.selectedIcon 
                              : `text-slate-200 bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/15 ${category.hoverBorder} ${category.hoverText} ${category.hoverShadow}`
                          }`}>
                            <div className="absolute inset-x-0 top-0 h-px bg-white/30 pointer-events-none" />
                            <Icon size={18} strokeWidth={2.2} className="drop-shadow-xs" />
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-semibold text-white tracking-tight truncate ${category.hoverText} transition-colors font-poppins`}>
                              {t.name}
                            </div>
                            <div className="text-[10.5px] text-slate-400 truncate leading-tight font-poppins mt-0.5 font-medium">
                              {t.desc}
                            </div>
                          </div>
                        </div>

                        <div className={`text-slate-500 ${category.hoverText} group-hover/btn:translate-x-1 transition-all shrink-0 ml-2`}>
                          <ChevronRight size={15} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Jump Category Trigger */}
              <button
                onClick={() => {
                  setActiveFilter(category.id);
                  onScrollToTool(category.tools[0].target);
                }}
                className={`relative z-10 mt-6 w-full py-2.5 px-3 rounded-xl backdrop-blur-xl bg-white/[0.05] border border-white/10 text-xs font-semibold font-poppins text-slate-200 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-black/20 hover:shadow-lg overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/20 ${category.exploreBtnHover}`}
              >
                <span>Explore {category.name}</span>
                <ArrowUpRight size={14} className={category.exploreIconColor} />
              </button>
            </div>
          ))}
        </div>

        {/* Global Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 font-poppins">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold mr-1">Filter Sector:</span>
          
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeFilter === 'all'
                ? 'bg-[#29abe2] text-white border-transparent shadow-md shadow-[#29abe2]/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-white hover:border-slate-600'
            }`}
          >
            All Tools (10)
          </button>

          <button
            onClick={() => setActiveFilter('recon')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeFilter === 'recon'
                ? 'bg-[#29abe2] text-white border-transparent shadow-md shadow-[#29abe2]/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-[#29abe2] hover:border-sky-500/40'
            }`}
          >
            01 Pre-Lot Recon
          </button>

          <button
            onClick={() => setActiveFilter('finance')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeFilter === 'finance'
                ? 'bg-amber-500 text-white border-transparent shadow-md shadow-amber-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-amber-400 hover:border-amber-500/40'
            }`}
          >
            02 Finance Traps
          </button>

          <button
            onClick={() => setActiveFilter('closing')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
              activeFilter === 'closing'
                ? 'bg-emerald-500 text-white border-transparent shadow-md shadow-emerald-500/30'
                : 'bg-slate-900/80 text-slate-300 border-slate-700/80 hover:text-emerald-400 hover:border-emerald-500/40'
            }`}
          >
            03 The Closing Table
          </button>
        </div>

      </div>
    </div>
  );
};

// =========================================================================
// AFFILIATE TRACKING LINK PLACEHOLDERS (Auto Loan Pre-Qualification & Refinance)
// Replace with your approved affiliate tracking URL from Impact, CJ, or direct network
// =========================================================================
const AUTO_REFINANCE_AFFILIATE_URL = "https://www.myautoloan.com/?aff_id=YOUR_MYAUTOLOAN_ID";
// Alternative Partner Placeholders:
// const LENDINGTREE_AFFILIATE_URL = "https://www.lendingtree.com/?aff_id=YOUR_LENDINGTREE_ID";
// const RATEGENIUS_AFFILIATE_URL = "https://www.rategenius.com/?aff_id=YOUR_RATEGENIUS_ID";

const EstimateBudgetSection = (props: any) => {
  return <AutoLoanCalculatorWidget {...props} />;
};

const ResearchAndReviews = ({
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle
}: {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
} = {}) => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isToolOpen = isControlled ? controlledOpen : internalOpen;

  const toggleToolOpen = () => {
    if (onToggle) onToggle(!isToolOpen);
    if (!isControlled) setInternalOpen(!isToolOpen);
  };

  const reviews = [
    { 
      title: "2026 Cadillac Escalade Review", 
      rating: "7.7/10", 
      img: "https://di-uploads-pod47.dealerinspire.com/jimelliscadillac/uploads/2025/10/2026-Cadillac-Escalade-IQ-exterior.jpg", 
      url: "https://www.caranddriver.com/cadillac/escalade" 
    },
    { 
      title: "2026 Dodge Durango Review", 
      rating: "6.5/10", 
      img: "https://hips.hearstapps.com/hmg-prod/images/b625962e-79c8-468e-98d6-2f4048c330c2.jpg?crop=0.656xw:0.492xh;0.123xw,0.294xh&resize=1200:*", 
      url: "https://www.caranddriver.com/dodge/durango" 
    },
    { 
      title: "2026 Lexus LX Hybrid Review", 
      rating: "6.8/10", 
      img: "https://hips.hearstapps.com/hmg-prod/images/2025-lexus-lx600-f-sport-exterior-pr-104-6864352bd13d7.jpg?crop=0.668xw:0.501xh;0.195xw,0.418xh&resize=1200:*", 
      url: "https://www.caranddriver.com/lexus/lx" 
    },
    { 
      title: "2026 Hyundai Venue Review", 
      rating: "5.2/10", 
      img: "https://hips.hearstapps.com/hmg-prod/images/5455c22d-0682-462c-bd26-1084b52e0c18.jpg?crop=0.65xw:0.488xh;0.203xw,0.303xh&resize=1200:*", 
      url: "https://www.caranddriver.com/hyundai/venue" 
    },
  ];
  
  const guides = [
    { title: "The Best Gas Mileage Trucks of 2026", img: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
    { title: "The Best Cars for Remote Work in 2026", img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
    { title: "Toyota RAV4 Long-Term Ownership Review", img: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/toyota/rav4/" },
    { title: "How to Avoid Dealer Junk Fees in 2026", img: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80", url: "https://www.edmunds.com/car-reviews/" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
      <div
        onClick={toggleToolOpen}
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-all ${
          isToolOpen ? 'pb-6 border-b border-slate-200/80 mb-8' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <BookOpen size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Vehicle Reviews &amp; Buyer Guides</h3>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">Independent road tests, reliability findings, and practical buyer advice.</p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleToolOpen();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 shrink-0 self-start sm:self-auto"
          aria-expanded={isToolOpen}
        >
          <span>{isToolOpen ? 'Collapse' : 'Expand Guides'}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isToolOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isToolOpen && (
        <div className="space-y-12 font-poppins">
          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight font-poppins">Latest Vehicle Deep Dives</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-poppins">Independent road tests, reliability findings, and safety scores</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reviews.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-xl overflow-hidden mb-3 h-32 relative bg-slate-100">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full font-poppins">
                      {item.rating}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug font-poppins">{item.title}</h5>
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h4 className="text-lg font-bold text-slate-900 tracking-tight font-poppins">Buyer Research Guides</h4>
                <p className="text-xs text-slate-500 mt-0.5 font-poppins">Practical strategies, financing tips, and inspection advice</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {guides.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-xl overflow-hidden mb-3 h-32 relative bg-slate-100">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h5 className="text-xs font-semibold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug font-poppins">{item.title}</h5>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Footer = ({ onNavigate }: { onNavigate: (path: any) => void }) => (
  <footer className="bg-slate-950 text-slate-200 text-xs py-14 border-t border-slate-800 mt-20">
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
      {/* FTC Affiliate & Compensation Disclosure Banner */}
      <div className="mb-12 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-[11.5px] text-slate-200 leading-relaxed shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-white font-bold uppercase tracking-wider text-[10.5px]">
          <ShieldCheck size={14} className="text-[#29abe2]" />
          <span>FTC Affiliate & Consumer Compensation Disclosure</span>
        </div>
        <p>
          CarMatrix is an independent consumer automotive intelligence platform operated by <strong className="text-white">Defiant Digital Holdings LLC</strong>. We may receive referral compensation from partner links, pre-qualification requests, insurance quote inquiries, and vehicle history lookups at zero additional cost to you. This compensation does not influence our algorithmic valuation estimates, 5-year ownership cost calculations, dealer quote fee audits, or editorial integrity. All vehicles, trademarks, and brand names belong to their respective owners.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-1 sm:col-span-2 space-y-3">
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1791661870/Logo-white-500_m3yxou.png" 
              alt="CarMatrix Logo" 
              className="w-[195px] sm:w-[215px] h-auto object-contain transition-all hover:opacity-90"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-200 text-xs max-w-sm leading-relaxed">
            Empowering smart vehicle buyers with unbiased research tools, transparent 5-year ownership projections, and real-time market data.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-2.5 pt-1">
            <a
              href="https://x.com/CarMatrixApp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#29abe2]"
              aria-label="CarMatrix on X"
              title="CarMatrix on X"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            <a
              href="https://www.facebook.com/CarMatrixApp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#29abe2]"
              aria-label="CarMatrix on Facebook"
              title="CarMatrix on Facebook"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>

            <a
              href="https://www.linkedin.com/company/thecarmatrix"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#29abe2]"
              aria-label="CarMatrix on LinkedIn"
              title="CarMatrix on LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>

            <a
              href="https://www.tiktok.com/@carmatrixapp"
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 hover:text-[#29abe2]"
              aria-label="CarMatrix on TikTok"
              title="CarMatrix on TikTok"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </a>
          </div>

          <div className="pt-2 text-[11px] text-slate-300 leading-relaxed">
            © 2026 CarMatrix — Defiant Digital Holdings LLC. All rights reserved. Data powered by NHTSA &amp; MarketCheck.
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Research Tools</h4>
          <ul className="space-y-2 text-slate-200">
            <li><button onClick={() => onNavigate('rankings')} className="hover:text-white cursor-pointer text-[#29abe2] font-semibold flex items-center gap-1.5"><TrendingUp size={13} /> Top-Rated Used Cars</button></li>
            <li><button onClick={() => onNavigate('dealer_directory')} className="hover:text-white cursor-pointer text-emerald-400 font-semibold flex items-center gap-1.5"><ShieldCheck size={13} /> Dealer Intel™ Directory</button></li>
            <li><button onClick={() => onNavigate('home')} className="hover:text-white cursor-pointer">AI Buying Advisor</button></li>
            <li><button onClick={() => onNavigate('gear')} className="hover:text-white cursor-pointer text-[#29abe2] font-semibold flex items-center gap-1.5"><ShoppingBag size={13} /> Buyer's Gear Guide</button></li>
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
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Trust & Compliance</h4>
          <ul className="space-y-2 text-slate-200">
            <li><button onClick={() => onNavigate('affiliate_disclosure')} className="hover:text-white cursor-pointer text-[#29abe2] font-semibold">Affiliate Disclosure</button></li>
            <li><button onClick={() => onNavigate('privacy')} className="hover:text-white cursor-pointer">Privacy Policy</button></li>
            <li><button onClick={() => onNavigate('terms')} className="hover:text-white cursor-pointer">Terms of Service</button></li>
            <li><button onClick={() => onNavigate('vision')} className="hover:text-white cursor-pointer">Company Vision</button></li>
            <li><button onClick={() => onNavigate('team')} className="hover:text-white cursor-pointer">Leadership & Editorial</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white cursor-pointer">Contact & Support Desk</button></li>
            <li><button onClick={() => onNavigate('faq')} className="hover:text-white cursor-pointer">FAQ & Knowledge Base</button></li>
            <li><button onClick={() => onNavigate('pr')} className="hover:text-white cursor-pointer">Press & Media Inquiries</button></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

const getInitialPath = (): string => {
  if (typeof window === 'undefined') return 'landing';
  const path = window.location.pathname.toLowerCase();
  if (path === '/terminal') return 'terminal';
  if (path === '/guided-evaluator' || path === '/guided_evaluator' || path === '/evaluator') return 'guided_evaluator';
  if (path === '/rankings') return 'rankings';
  if (path === '/dealers' || path === '/dealer_directory') return 'dealer_directory';
  if (path === '/dealer_profile') return 'dealer_profile';
  if (path === '/market-pulse' || path === '/market_pulse') return 'market_pulse';
  if (path === '/gear') return 'gear';
  if (path === '/finance') return 'finance';
  if (path === '/privacy') return 'privacy';
  if (path === '/terms') return 'terms';
  if (path === '/affiliate-disclosure' || path === '/affiliate_disclosure') return 'affiliate_disclosure';
  if (path === '/vision') return 'vision';
  if (path === '/team') return 'team';
  if (path === '/press') return 'press';
  if (path === '/pr') return 'pr';
  if (path === '/faq') return 'faq';
  if (path === '/contact') return 'contact';
  if (path === '/influencers') return 'influencers';
  // Root index '/' or unmapped route defaults to the new landing page
  return 'landing';
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [selectedDealerSlug, setSelectedDealerSlug] = useState<string>('sewell-lexus-dallas');
  const [activeToolkitFilter, setActiveToolkitFilter] = useState<string>('all');
  const [isTourOpen, setIsTourOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getInitialPath());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    // Only show for first-time visitors; do NOT show automatically on recurring visits
    const tourSeen = localStorage.getItem('carmatrix_tour_seen');
    if (!tourSeen && currentPath === 'terminal') {
      const timer = setTimeout(() => {
        setIsTourOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPath]);

  const handleStartTour = () => {
    if (currentPath !== 'terminal' && currentPath !== 'home') {
      navigateTo('terminal');
    }
    setActiveToolkitFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsTourOpen(true);
  };

  // Track open/collapsed state of each tool and section. Default is false (collapsed) so cards stack neatly.
  const [openTools, setOpenTools] = useState<Record<string, boolean>>({});

  const toggleTool = (toolId: string, forceState?: boolean) => {
    setOpenTools(prev => ({
      ...prev,
      [toolId]: forceState !== undefined ? forceState : !prev[toolId]
    }));
  };

  const sector1Tools = [
    'vin-checker',
    'tco-calculator',
    'valuation-estimator',
    'inspection-checklist',
    'test-drive-dossier'
  ];

  const sector2Tools = [
    'loan-calculator',
    'lease-vs-finance',
    'depreciation-curve'
  ];

  const sector3Tools = [
    'quote-auditor',
    'ai-advisor',
    'state-fees',
    'ev-comparison',
    'market-trends'
  ];

  const isSectorExpanded = (tools: string[]) => {
    return tools.every(id => Boolean(openTools[id]));
  };

  const toggleSector = (tools: string[]) => {
    const allExpanded = isSectorExpanded(tools);
    setOpenTools(prev => {
      const next = { ...prev };
      tools.forEach(id => {
        next[id] = !allExpanded;
      });
      return next;
    });
  };

  const mapTargetToToolId = (target: string): string => {
    if (target === 'cost-of-ownership') return 'tco-calculator';
    if (target === 'cash-market-intel') return 'valuation-estimator';
    if (target === 'loan-affordability') return 'loan-calculator';
    return target;
  };

  const scrollToTool = (toolId: string) => {
    const actualId = mapTargetToToolId(toolId);
    setOpenTools(prev => ({ ...prev, [actualId]: true }));
    if (currentPath !== 'terminal' && currentPath !== 'home') {
      setCurrentPath('terminal');
      try {
        if (window.location.pathname !== '/terminal') {
          window.history.pushState({ path: 'terminal' }, '', '/terminal');
        }
      } catch (e) {}
    }
    setTimeout(() => {
      const el = document.getElementById(actualId) || document.getElementById(toolId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-2', 'ring-[#29abe2]', 'ring-offset-4', 'ring-offset-slate-900', 'transition-all');
        setTimeout(() => {
          el.classList.remove('ring-2', 'ring-[#29abe2]', 'ring-offset-4', 'ring-offset-slate-900');
        }, 3000);
      }
    }, 150);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      let targetUrl = '/';
      if (path === 'terminal') targetUrl = '/terminal';
      else if (path === 'guided_evaluator') targetUrl = '/guided-evaluator';
      else if (path === 'rankings') targetUrl = '/rankings';
      else if (path === 'dealer_directory' || path === 'dealers') targetUrl = '/dealers';
      else if (path === 'market_pulse') targetUrl = '/market-pulse';
      else if (path === 'gear') targetUrl = '/gear';
      else if (path === 'landing') targetUrl = '/';
      else if (path === 'home') targetUrl = '/terminal';
      else targetUrl = `/${path}`;

      if (window.location.pathname !== targetUrl) {
        window.history.pushState({ path }, '', targetUrl);
      }
    } catch (e) {
      // Ignore if history state is restricted
    }
  };

  // Render Root Landing View
  if (currentPath === 'landing') {
    return (
      <div className="font-poppins text-slate-100 min-h-screen relative flex flex-col bg-[#070b14]">
        <CarMatrixLanding 
          onAccessTerminal={() => navigateTo('terminal')}
          onOpenGuidedEvaluator={() => navigateTo('guided_evaluator')}
          onNavigate={navigateTo}
        />
        <CookieConsentBanner onNavigate={navigateTo} />
      </div>
    );
  }

  // Render Guided Evaluator View
  if (currentPath === 'guided_evaluator') {
    return (
      <div className="font-poppins text-slate-100 min-h-screen relative flex flex-col bg-[#070b14]">
        <GuidedEvaluator 
          onBackToLanding={() => navigateTo('landing')}
          onOpenTerminalTool={(toolId) => {
            scrollToTool(toolId);
          }}
          onNavigate={navigateTo}
        />
        <CookieConsentBanner onNavigate={navigateTo} />
      </div>
    );
  }

  return (
    <div className="font-poppins text-slate-900 min-h-screen selection:bg-[#29abe2]/30 selection:text-slate-900 relative flex flex-col bg-[#DDE3EA]">
      <NavBar 
        currentPath={currentPath}
        onHomeClick={() => navigateTo('landing')}
        onTerminalClick={() => navigateTo('terminal')}
        onEvaluatorClick={() => navigateTo('guided_evaluator')}
        onRankingsClick={() => navigateTo('rankings')}
        onMarketPulseClick={() => navigateTo('market_pulse')}
        onGearClick={() => navigateTo('gear')}
        onDealerDirectoryClick={() => navigateTo('dealer_directory')}
        onScrollToTool={scrollToTool}
        onStartTour={handleStartTour}
      />
      
      <div className="flex-1">
        {currentPath === 'rankings' ? (
          <RankingsPage
            onBackToHome={() => navigateTo('home')}
            onSearchInventory={(make, model) => {
              navigateTo('home');
              scrollToTool('valuation-estimator');
            }}
          />
        ) : currentPath === 'dealer_profile' ? (
          <DealerProfilePage 
            slug={selectedDealerSlug}
            onBack={() => navigateTo('dealer_directory')}
            onAuditQuote={(dealerName) => {
              navigateTo('home');
              scrollToTool('quote-auditor');
            }}
          />
        ) : currentPath === 'dealer_directory' || currentPath === 'dealers' ? (
          <DealerDirectoryPage 
            onBackToHome={() => navigateTo('home')} 
            onNavigateToProfile={(slug) => {
              setSelectedDealerSlug(slug);
              navigateTo('dealer_profile');
            }}
            onAuditQuote={(dealerName) => {
              navigateTo('home');
              scrollToTool('quote-auditor');
            }}
          />
        ) : currentPath === 'market_pulse' ? (
          <MarketPulsePage onBack={() => navigateTo('home')} />
        ) : currentPath === 'gear' ? (
          <GearGuidePage onNavigate={navigateTo} />
        ) : currentPath === 'finance' ? (
          <FinancePage />
        ) : currentPath === 'affiliate_disclosure' || currentPath === 'legal' ? (
          <LegalCompliancePage initialTab="affiliate" onBack={() => navigateTo('home')} />
        ) : currentPath === 'privacy' ? (
          <LegalCompliancePage initialTab="privacy" onBack={() => navigateTo('home')} />
        ) : currentPath === 'terms' ? (
          <LegalCompliancePage initialTab="terms" onBack={() => navigateTo('home')} />
        ) : currentPath === 'vision' ? (
          <VisionPage />
        ) : currentPath === 'team' ? (
          <TeamPage />
        ) : currentPath === 'press' ? (
          <PressPage />
        ) : currentPath === 'pr' ? (
          <PublicRelationsPage />
        ) : currentPath === 'faq' ? (
          <FAQPage onNavigate={navigateTo} />
        ) : currentPath === 'contact' ? (
          <ContactPage />
        ) : currentPath === 'influencers' ? (
          <InfluencersPage />
        ) : (
          <>
            <ToolkitHeroHeader 
              activeFilter={activeToolkitFilter} 
              setActiveFilter={setActiveToolkitFilter}
              onScrollToTool={scrollToTool}
            />
          
            <main className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
              
              <div className="space-y-16">
                
                {/* =========================================================================
                    SECTOR 01: PRE-LOT RECON
                    (VIN Decoder, 5-Year Ownership, Live Market Valuation)
                    ========================================================================= */}
                {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'vin' || activeToolkitFilter === 'tco' || activeToolkitFilter === 'valuation' || activeToolkitFilter === 'inspection' || activeToolkitFilter === 'dossier') && (
                  <section className="space-y-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
                        Pre-Lot Recon
                      </h1>
                      <button
                        type="button"
                        onClick={() => toggleSector(sector1Tools)}
                        className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white/90 border border-slate-300/80 shadow-xs cursor-pointer transition-colors"
                      >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSectorExpanded(sector1Tools) ? 'rotate-180' : ''}`} />
                        <span>{isSectorExpanded(sector1Tools) ? 'Collapse Sector' : 'Expand Sector'}</span>
                      </button>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'vin') && (
                      <section id="vin-checker" className="scroll-mt-24">
                        <VINRecallWidget 
                          isOpen={Boolean(openTools['vin-checker'])} 
                          onToggle={(open) => toggleTool('vin-checker', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'tco') && (
                      <section id="tco-calculator" data-tour-target="cost-of-ownership" className="scroll-mt-24 space-y-8">
                        <div id="cost-of-ownership" />
                        <TCOCalculator 
                          isOpen={Boolean(openTools['tco-calculator'])} 
                          onToggle={(open) => toggleTool('tco-calculator', open)} 
                        />
                        {openTools['tco-calculator'] && (
                          <div className="max-w-xl mx-auto">
                            <CostOfOwnershipWidget />
                          </div>
                        )}
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'valuation') && (
                      <section id="valuation-estimator" data-tour-target="cash-market-intel" className="scroll-mt-24">
                        <div id="cash-market-intel" />
                        <ValuationWidget 
                          isOpen={Boolean(openTools['valuation-estimator'])} 
                          onToggle={(open) => toggleTool('valuation-estimator', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'inspection') && (
                      <section id="inspection-checklist" className="scroll-mt-24">
                        <InspectionChecklistWidget 
                          isOpen={Boolean(openTools['inspection-checklist'])} 
                          onToggle={(open) => toggleTool('inspection-checklist', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'dossier') && (
                      <section id="test-drive-dossier" className="scroll-mt-24">
                        <TestDriveDossierWidget 
                          isOpen={Boolean(openTools['test-drive-dossier'])} 
                          onToggle={(open) => toggleTool('test-drive-dossier', open)} 
                        />
                      </section>
                    )}
                  </section>
                )}

                {/* =========================================================================
                    SECTOR 02: FINANCE TRAP DETECTORS
                    (Auto Loan Calculator, Lease vs. Buy, Negative Equity Check)
                    ========================================================================= */}
                {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'loan' || activeToolkitFilter === 'lease' || activeToolkitFilter === 'depreciation') && (
                  <section className="space-y-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
                        Finance Trap Detectors
                      </h1>
                      <button
                        type="button"
                        onClick={() => toggleSector(sector2Tools)}
                        className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white/90 border border-slate-300/80 shadow-xs cursor-pointer transition-colors"
                      >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSectorExpanded(sector2Tools) ? 'rotate-180' : ''}`} />
                        <span>{isSectorExpanded(sector2Tools) ? 'Collapse Sector' : 'Expand Sector'}</span>
                      </button>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'loan') && (
                      <section id="loan-calculator" data-tour-target="loan-affordability" className="scroll-mt-24">
                        <div id="loan-affordability" />
                        <EstimateBudgetSection 
                          isOpen={Boolean(openTools['loan-calculator'])} 
                          onToggle={(open: boolean) => toggleTool('loan-calculator', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'lease') && (
                      <section id="lease-vs-finance" className="scroll-mt-24">
                        <LeaseVsFinanceWidget 
                          isOpen={Boolean(openTools['lease-vs-finance'])} 
                          onToggle={(open) => toggleTool('lease-vs-finance', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'depreciation') && (
                      <section id="depreciation-curve" className="scroll-mt-24">
                        <DepreciationPredictorWidget 
                          isOpen={Boolean(openTools['depreciation-curve'])} 
                          onToggle={(open) => toggleTool('depreciation-curve', open)} 
                        />
                      </section>
                    )}
                  </section>
                )}

                {/* =========================================================================
                    SECTOR 03: THE CLOSING TABLE
                    (OTD Calculator, Automotive Knowledge Engine, 50-State Doc Fee Guide)
                    ========================================================================= */}
                {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'quote' || activeToolkitFilter === 'ai' || activeToolkitFilter === 'state-fees' || activeToolkitFilter === 'ev' || activeToolkitFilter === 'market') && (
                  <section className="space-y-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-poppins">
                        The Closing Table
                      </h1>
                      <button
                        type="button"
                        onClick={() => toggleSector(sector3Tools)}
                        className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white/90 border border-slate-300/80 shadow-xs cursor-pointer transition-colors"
                      >
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isSectorExpanded(sector3Tools) ? 'rotate-180' : ''}`} />
                        <span>{isSectorExpanded(sector3Tools) ? 'Collapse Sector' : 'Expand Sector'}</span>
                      </button>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'quote') && (
                      <section id="quote-auditor" data-tour-target="quote-auditor" className="scroll-mt-24">
                        <DealerQuoteAuditorWidget 
                          isOpen={Boolean(openTools['quote-auditor'])} 
                          onToggle={(open) => toggleTool('quote-auditor', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'ai') && (
                      <section id="ai-advisor" className="scroll-mt-24">
                        <AIAdvisorWidget 
                          isOpen={Boolean(openTools['ai-advisor'])} 
                          onToggle={(open) => toggleTool('ai-advisor', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'state-fees') && (
                      <section id="state-fees" className="scroll-mt-24">
                        <StateFeeGuideWidget 
                          isOpen={Boolean(openTools['state-fees'])} 
                          onToggle={(open) => toggleTool('state-fees', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'ev') && (
                      <section id="ev-comparison" className="scroll-mt-24">
                        <EVComparisonWidget 
                          isOpen={Boolean(openTools['ev-comparison'])} 
                          onToggle={(open) => toggleTool('ev-comparison', open)} 
                        />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'market') && (
                      <section id="market-trends" className="scroll-mt-24 bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
                        <div 
                          onClick={() => toggleTool('market-trends')}
                          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none transition-all ${
                            openTools['market-trends'] ? 'pb-6 border-b border-slate-200/80 mb-6' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
                              <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                              <TrendingUp size={22} strokeWidth={2.2} className="drop-shadow-xs" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Market Trends &amp; Price Index</h3>
                              <p className="text-slate-600 text-sm mt-0.5 font-poppins">Track real-time inventory days-supply, wholesale price trajectory, and regional price adjustments.</p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTool('market-trends');
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 shrink-0 self-start sm:self-auto"
                            aria-expanded={Boolean(openTools['market-trends'])}
                          >
                            <span>{openTools['market-trends'] ? 'Collapse' : 'Expand Trends'}</span>
                            <ChevronDown size={16} className={`transition-transform duration-300 ${openTools['market-trends'] ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                        {openTools['market-trends'] && (
                          <MarketPulse />
                        )}
                      </section>
                    )}
                  </section>
                )}

              </div>

              <section className="pt-8 border-t border-slate-300/80">
                <ResearchAndReviews 
                  isOpen={Boolean(openTools['research-reviews'])} 
                  onToggle={(open) => toggleTool('research-reviews', open)} 
                />
              </section>
            </main>
          
            <LatestArticles 
              isOpen={Boolean(openTools['latest-articles'])} 
              onToggle={(open) => toggleTool('latest-articles', open)} 
            />
            <ExpertAdviceFeeds 
              isOpen={Boolean(openTools['expert-advice'])} 
              onToggle={(open) => toggleTool('expert-advice', open)} 
            />
            <DealerTacticsExposed 
              isOpen={Boolean(openTools['dealer-tactics'])} 
              onToggle={(open) => toggleTool('dealer-tactics', open)} 
            />
            <FeaturedInfluencerFeeds 
              isOpen={Boolean(openTools['influencer-feeds'])} 
              onToggle={(open) => toggleTool('influencer-feeds', open)} 
            />
          </>
        )}
      </div>
      
      <Footer onNavigate={navigateTo} />
      <CookieConsentBanner onNavigate={navigateTo} />
      <TerminalTour isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </div>
  );
}
