import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronDown, ArrowUpRight, 
  Calculator, Zap, DollarSign, ShieldCheck,
  TrendingUp, Bot, HelpCircle, Layers, SlidersHorizontal,
  FileSearch, Scale, ArrowLeftRight, Printer, TrendingDown,
  Menu, X, ChevronRight, Cpu, ShoppingBag, Terminal, Activity, AlertTriangle
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

const NavBar = ({ 
  onHomeClick, 
  onMarketPulseClick, 
  onGearClick,
  onScrollToTool,
}: { 
  onHomeClick: () => void; 
  onMarketPulseClick: () => void; 
  onGearClick?: () => void;
  onScrollToTool?: (toolId: string) => void;
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

  const handleNavClick = (toolId?: string) => {
    setMobileMenuOpen(false);
    onHomeClick();
    if (toolId && onScrollToTool) {
      setTimeout(() => {
        onScrollToTool(toolId);
      }, 50);
    }
  };

  const mobileTools = [
    {
      id: 'ai-advisor',
      name: 'Knowledge Engine',
      tag: 'ENGINE',
      desc: 'Vehicle & deal intelligence',
      icon: Cpu,
      gradient: 'from-[#29abe2]/30 via-sky-500/15 to-transparent',
      border: 'border-[#29abe2]/40',
      glow: 'rgba(41,171,226,0.35)',
      color: 'text-[#29abe2]'
    },
    {
      id: 'vin-checker',
      name: 'VIN & Recall',
      tag: 'NHTSA',
      desc: 'NHTSA factory records',
      icon: Search,
      gradient: 'from-blue-500/30 via-blue-600/15 to-transparent',
      border: 'border-blue-400/40',
      glow: 'rgba(59,130,246,0.35)',
      color: 'text-blue-400'
    },
    {
      id: 'quote-auditor',
      name: 'Quote Auditor',
      tag: 'AUDIT',
      desc: 'Junk fee detector & script',
      icon: FileSearch,
      gradient: 'from-indigo-500/30 via-indigo-600/15 to-transparent',
      border: 'border-indigo-400/40',
      glow: 'rgba(99,102,241,0.35)',
      color: 'text-indigo-400'
    },
    {
      id: 'state-fees',
      name: 'State Fee Guide',
      tag: '50-STATE',
      desc: 'Doc fee caps & tax rules',
      icon: Scale,
      gradient: 'from-emerald-500/30 via-emerald-600/15 to-transparent',
      border: 'border-emerald-400/40',
      glow: 'rgba(16,185,129,0.35)',
      color: 'text-emerald-400'
    },
    {
      id: 'lease-vs-finance',
      name: 'Lease vs. Buy',
      tag: 'COMPARE',
      desc: '3-yr cashflow vs equity',
      icon: ArrowLeftRight,
      gradient: 'from-violet-500/30 via-violet-600/15 to-transparent',
      border: 'border-violet-400/40',
      glow: 'rgba(139,92,246,0.35)',
      color: 'text-violet-400'
    },
    {
      id: 'tco-calculator',
      name: '5-Year TCO',
      tag: '5-YEAR',
      desc: 'Full ownership projection',
      icon: Calculator,
      gradient: 'from-teal-500/30 via-teal-600/15 to-transparent',
      border: 'border-teal-400/40',
      glow: 'rgba(20,184,166,0.35)',
      color: 'text-teal-400'
    },
    {
      id: 'loan-calculator',
      name: 'Loan & Budget',
      tag: 'FINANCE',
      desc: 'Payment & interest math',
      icon: SlidersHorizontal,
      gradient: 'from-amber-500/30 via-amber-600/15 to-transparent',
      border: 'border-amber-400/40',
      glow: 'rgba(245,158,11,0.35)',
      color: 'text-amber-400'
    },
    {
      id: 'test-drive-dossier',
      name: 'Test Dossier',
      tag: 'PRINT',
      desc: '1-click printable sheet',
      icon: Printer,
      gradient: 'from-rose-500/30 via-rose-600/15 to-transparent',
      border: 'border-rose-400/40',
      glow: 'rgba(244,63,94,0.35)',
      color: 'text-rose-400'
    },
    {
      id: 'depreciation-curve',
      name: 'Value Curve',
      tag: '7-YEAR',
      desc: '7-yr value sweet spot',
      icon: TrendingDown,
      gradient: 'from-cyan-500/30 via-cyan-600/15 to-transparent',
      border: 'border-cyan-400/40',
      glow: 'rgba(6,182,212,0.35)',
      color: 'text-cyan-400'
    },
    {
      id: 'valuation-estimator',
      name: 'Live Valuation',
      tag: 'LIVE',
      desc: 'Trade-in & market pricing',
      icon: DollarSign,
      gradient: 'from-yellow-500/30 via-amber-500/15 to-transparent',
      border: 'border-yellow-400/40',
      glow: 'rgba(234,179,8,0.35)',
      color: 'text-yellow-400'
    },
    {
      id: 'ev-comparison',
      name: 'EV vs Gas',
      tag: 'GREEN',
      desc: 'Fuel & charger savings',
      icon: Zap,
      gradient: 'from-green-500/30 via-emerald-600/15 to-transparent',
      border: 'border-green-400/40',
      glow: 'rgba(34,197,94,0.35)',
      color: 'text-green-400'
    },
    {
      id: 'inspection-checklist',
      name: 'Inspection List',
      tag: 'CHECK',
      desc: 'Pre-purchase detector',
      icon: ShieldCheck,
      gradient: 'from-orange-500/30 via-orange-600/15 to-transparent',
      border: 'border-orange-400/40',
      glow: 'rgba(249,115,22,0.35)',
      color: 'text-orange-400'
    }
  ];

  return (
    <header className="light-glass sticky top-0 z-50 border-b border-slate-200/60 font-poppins">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px] sm:h-[85px]">
          {/* Logo */}
          <div className="cursor-pointer flex items-center shrink-0" onClick={() => handleNavClick()}>
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1790959350/Logo-CarMatrix_i1t78a.png" 
              alt="CarMatrix Logo" 
              className="w-[195px] sm:w-[225px] h-auto object-contain transition-all"
              style={{ width: '225px' }}
              referrerPolicy="no-referrer"
            />
          </div>
          
          {/* Desktop Navigation Grouped by the 3 Distinct Categories */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-[14px] xl:text-[14.5px] font-medium font-poppins text-slate-600">
            <button 
              onClick={() => handleNavClick('vin-checker')}
              className="group hover:text-[#29abe2] transition-all py-1.5 px-2 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-slate-900/[0.03]"
            >
              <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-white/95 border border-sky-300/70 shadow-[0_2px_6px_rgba(41,171,226,0.18),inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center justify-center text-[#0284c7] font-mono text-[11px] font-black tracking-tight relative overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-[#29abe2] group-hover:text-[#29abe2] group-hover:shadow-[0_0_12px_rgba(41,171,226,0.35),inset_0_1px_1px_rgba(255,255,255,1)] shrink-0">
                <div className="absolute inset-x-0 top-0 h-px bg-white/90 pointer-events-none" />
                <span>01</span>
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-[#29abe2] transition-colors">Pre-Lot Recon</span>
            </button>

            <button 
              onClick={() => handleNavClick('loan-calculator')}
              className="group hover:text-amber-600 transition-all py-1.5 px-2 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-slate-900/[0.03]"
            >
              <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-white/95 border border-amber-300/70 shadow-[0_2px_6px_rgba(245,158,11,0.18),inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center justify-center text-amber-700 font-mono text-[11px] font-black tracking-tight relative overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-amber-500 group-hover:text-amber-600 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.35),inset_0_1px_1px_rgba(255,255,255,1)] shrink-0">
                <div className="absolute inset-x-0 top-0 h-px bg-white/90 pointer-events-none" />
                <span>02</span>
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">Finance Traps</span>
            </button>

            <button 
              onClick={() => handleNavClick('quote-auditor')}
              className="group hover:text-emerald-600 transition-all py-1.5 px-2 rounded-xl cursor-pointer flex items-center gap-2 hover:bg-slate-900/[0.03]"
            >
              <div className="w-[26px] h-[26px] rounded-[7px] bg-gradient-to-br from-emerald-400/20 via-emerald-500/10 to-white/95 border border-emerald-300/70 shadow-[0_2px_6px_rgba(16,185,129,0.18),inset_0_1px_1px_rgba(255,255,255,0.95)] flex items-center justify-center text-emerald-700 font-mono text-[11px] font-black tracking-tight relative overflow-hidden transition-all duration-200 group-hover:scale-105 group-hover:border-emerald-500 group-hover:text-emerald-600 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.35),inset_0_1px_1px_rgba(255,255,255,1)] shrink-0">
                <div className="absolute inset-x-0 top-0 h-px bg-white/90 pointer-events-none" />
                <span>03</span>
              </div>
              <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">The Closing Table</span>
            </button>

            <button 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onMarketPulseClick(); }} 
              className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer"
            >
              Market Pulse
            </button>

            <button 
              onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onGearClick?.(); }} 
              className="hover:text-[#29abe2] transition-colors py-2 cursor-pointer flex items-center gap-1.5 font-semibold text-sky-600"
            >
              <ShoppingBag size={15} className="text-[#29abe2]" />
              <span>Buyer's Gear</span>
            </button>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#29abe2] ${
                mobileMenuOpen 
                  ? "bg-slate-900 text-white border border-slate-700 shadow-lg shadow-black/20" 
                  : "bg-slate-100 hover:bg-slate-200/80 active:scale-95 border border-slate-200/80 text-slate-800"
              }`}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Frosted Dark Backdrop */}
          <div 
            className="fixed inset-0 top-[72px] sm:top-[85px] z-40 bg-black/75 backdrop-blur-md lg:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Luxury Glassmorphic Drawer Menu */}
          <div className="fixed top-[72px] sm:top-[85px] left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] p-4 sm:p-6 max-h-[calc(100vh-72px)] sm:max-h-[calc(100vh-85px)] overflow-y-auto lg:hidden text-white relative">
            {/* Ambient background glows */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-20 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Subtle grid texture */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] pointer-events-none opacity-40" />

            <div className="max-w-md mx-auto space-y-4 relative z-10">
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse" />
                  <span className="text-[11px] font-black uppercase tracking-widest text-slate-300">
                    Car Buyer Intelligence Suite
                  </span>
                </div>
                <span className="text-[10px] font-extrabold text-[#29abe2] bg-[#29abe2]/10 border border-[#29abe2]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  100% Free
                </span>
              </div>

              {/* Tool Links Grid (Hero Section Glassmorphism) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {mobileTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleNavClick(tool.id)}
                      className="group relative flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-xl border overflow-hidden bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent hover:from-white/[0.14] hover:via-white/[0.08] hover:to-white/[0.03] border-white/[0.12] hover:border-[#29abe2]/50 shadow-[0_4px_16px_0_rgba(0,0,0,0.35),inset_0_1px_0_0_rgba(255,255,255,0.12)] active:scale-[0.98] text-left"
                    >
                      {/* Specular top light ray */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

                      {/* Frosted jewel icon pedestal */}
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-inner border relative bg-gradient-to-br ${tool.gradient} ${tool.border} ${tool.color} group-hover:scale-105 group-hover:shadow-[0_0_16px_${tool.glow}] group-hover:border-white/40`}
                      >
                        <Icon size={20} strokeWidth={2.3} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
                      </div>

                      {/* Text info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[8.5px] font-black uppercase tracking-widest text-slate-400/90 group-hover:text-slate-300 transition-colors">
                            {tool.tag}
                          </span>
                        </div>
                        <div className="text-[12.5px] font-bold text-white tracking-tight leading-snug group-hover:text-[#29abe2] transition-colors truncate">
                          {tool.name}
                        </div>
                        <div className="text-[10.5px] text-slate-400 font-medium truncate leading-tight">
                          {tool.desc}
                        </div>
                      </div>

                      {/* Right indicator */}
                      <div className="opacity-30 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-slate-400 group-hover:text-[#29abe2] shrink-0 pr-0.5">
                        <ChevronRight size={16} />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Market Pulse Link - Elevated Luxury Glass Banner */}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onMarketPulseClick(); }}
                  className="group relative w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-xl border overflow-hidden bg-gradient-to-r from-white/[0.08] via-[#29abe2]/10 to-white/[0.04] hover:from-[#29abe2]/20 hover:via-sky-500/15 hover:to-white/[0.08] border-[#29abe2]/40 hover:border-[#29abe2]/70 shadow-[0_4px_20px_0_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.2)] active:scale-[0.99] text-left"
                >
                  {/* Specular top light ray */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

                  <div className="flex items-center gap-3.5">
                    {/* Jewel Icon Pedestal */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-sky-300/40 bg-gradient-to-br from-sky-400/30 via-blue-500/15 to-transparent text-sky-300 group-hover:scale-105 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.4)] transition-all">
                      <TrendingUp size={20} strokeWidth={2.3} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-[#29abe2]">
                          INDEX • LIVE FEED
                        </span>
                      </div>
                      <div className="text-[13px] font-bold text-white tracking-tight leading-snug group-hover:text-[#29abe2] transition-colors">
                        Consumer Market Pulse
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-medium">
                        Real-time inventory, pricing index & macro analysis
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#29abe2] shrink-0 pl-2">
                    <span>Open</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>

              {/* Buyer's Gear Guide Link - Mobile Glass Banner */}
              <div className="pt-2">
                <button
                  onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); onGearClick?.(); }}
                  className="group relative w-full flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 cursor-pointer backdrop-blur-xl border overflow-hidden bg-gradient-to-r from-white/[0.08] via-amber-500/10 to-white/[0.04] hover:from-amber-500/20 hover:to-white/[0.08] border-amber-400/40 shadow-[0_4px_20px_0_rgba(0,0,0,0.4)] active:scale-[0.99] text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-inner border border-amber-300/40 bg-gradient-to-br from-amber-400/30 via-orange-500/15 to-transparent text-amber-300 group-hover:scale-105 transition-all">
                      <ShoppingBag size={20} strokeWidth={2.3} className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[8.5px] font-black uppercase tracking-widest text-amber-400">
                          ESSENTIALS • BUYER GEAR
                        </span>
                      </div>
                      <div className="text-[13px] font-bold text-white tracking-tight leading-snug group-hover:text-amber-400 transition-colors">
                        Buyer's Gear Guide
                      </div>
                      <div className="text-[10.5px] text-slate-400 font-medium">
                        OBD2 scanners, jump starters & emergency tech
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 shrink-0 pl-2">
                    <span>View</span>
                    <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </>
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
      borderColor: 'border-slate-700/80 hover:border-sky-400/50',
      panelGradients: 'from-slate-900/90 via-slate-900/70 to-slate-950',
      glowBorder: 'shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
      badgeStyle: 'bg-sky-500/10 border-sky-400/30 text-sky-300',
      dotColor: 'bg-[#29abe2]',
      headingGradient: 'from-white via-slate-100 to-sky-200',
      description: 'Audit factory build history, true 5-year depreciation, and fair market valuation before stepping on the dealer lot.',
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
      borderColor: 'border-slate-700/80 hover:border-amber-400/50',
      panelGradients: 'from-slate-900/90 via-slate-900/70 to-slate-950',
      glowBorder: 'shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
      badgeStyle: 'bg-amber-500/10 border-amber-400/30 text-amber-300',
      dotColor: 'bg-amber-400',
      headingGradient: 'from-white via-slate-100 to-amber-200',
      description: 'Expose backend APR markup, deceptive lease money factors, and underwater trade-in rollovers.',
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
      borderColor: 'border-slate-700/80 hover:border-emerald-400/50',
      panelGradients: 'from-slate-900/90 via-slate-900/70 to-slate-950',
      glowBorder: 'shadow-[0_12px_32px_rgba(0,0,0,0.5)]',
      badgeStyle: 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300',
      dotColor: 'bg-emerald-400',
      headingGradient: 'from-white via-slate-100 to-emerald-200',
      description: 'Weaponize out-the-door fee audits and AI negotiation leverage to eliminate dealer add-on junk fees at signing.',
      tools: [
        { id: 'quote', name: 'Out-The-Door (OTD) Calculator', tag: 'JUNK FEE AUDIT', icon: FileSearch, target: 'quote-auditor', desc: 'Separate legitimate taxes/fees from bogus dealer add-ons' },
        { id: 'ai', name: 'AI Negotiation Research', tag: 'AI LEVERAGE', icon: Cpu, target: 'ai-advisor', desc: 'Tactical dealer counter-scripts & market intelligence' },
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
              className={`flex flex-col justify-between p-5 sm:p-6 rounded-3xl bg-gradient-to-b ${category.panelGradients} border ${category.borderColor} ${category.glowBorder} transition-all duration-300 relative overflow-hidden backdrop-blur-xl`}
            >
              {/* Top ambient highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <div>
                <h3 className={`text-xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${category.headingGradient} mb-2 font-poppins`}>
                  {category.name}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed mb-6 font-poppins">
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
                        className={`group w-full flex items-center justify-between p-3 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                          isSelected
                            ? 'bg-slate-800 border-sky-400/80 shadow-md ring-1 ring-sky-400/40 text-white'
                            : 'bg-white/[0.04] border-white/10 hover:border-white/20 hover:bg-white/[0.08] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Premium Jewel / Squircle Icon Pedestal */}
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-300 relative overflow-hidden shadow-inner ${
                            isSelected 
                              ? 'text-[#29abe2] border-sky-400/50 bg-gradient-to-br from-sky-400/25 via-sky-500/10 to-transparent shadow-[0_0_16px_rgba(41,171,226,0.3)]' 
                              : 'text-slate-200 bg-gradient-to-br from-white/10 via-white/5 to-transparent border-white/15 group-hover:border-sky-400/40 group-hover:text-[#29abe2] group-hover:shadow-[0_0_14px_rgba(41,171,226,0.2)]'
                          }`}>
                            <div className="absolute inset-x-0 top-0 h-px bg-white/30 pointer-events-none" />
                            <Icon size={18} strokeWidth={2.2} className="drop-shadow-xs" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white tracking-tight truncate group-hover:text-[#29abe2] transition-colors font-poppins">
                              {t.name}
                            </div>
                            <div className="text-[10.5px] text-slate-400 truncate leading-tight font-poppins mt-0.5">
                              {t.desc}
                            </div>
                          </div>
                        </div>

                        <div className="text-slate-500 group-hover:text-[#29abe2] group-hover:translate-x-1 transition-all shrink-0 ml-2">
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
                className="mt-5 w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-xs font-semibold font-poppins text-slate-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Explore {category.name}</span>
                <ArrowUpRight size={14} className="text-[#29abe2]" />
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

const EstimateBudgetSection = () => {
  const [downPayment, setDownPayment] = React.useState(2350);
  const [loanTerm, setLoanTerm] = React.useState(60);
  const [apr, setApr] = React.useState(0.0979); 
  const [isCustomApr, setIsCustomApr] = React.useState(false);
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
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-300/40 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center justify-center text-amber-500 shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <SlidersHorizontal size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Auto Loan &amp; Affordability Calculator</h3>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">Calculate purchasing power, down payment leverage, and total interest amortization.</p>
          </div>
        </div>

        <div className="bg-[#29abe2] text-white p-4 rounded-2xl shrink-0 min-w-[200px] shadow-sm">
          <span className="text-[11px] font-semibold text-sky-100 uppercase tracking-wider block">Estimated Max Vehicle Price</span>
          <span className="text-3xl font-black text-white leading-none block mt-1 font-poppins">
            {"$" + totalBudget.toLocaleString()}
          </span>
          <span className="text-[11px] text-sky-100 block mt-1 font-medium font-poppins">with {((apr || 0) * 100).toFixed(2)}% APR</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Target Monthly</label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <span className="text-slate-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={monthlyPayment} 
                  onChange={e => setMonthlyPayment(Number(e.target.value))}
                  className="w-full outline-none bg-transparent font-poppins"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Down Payment</label>
              <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                <span className="text-slate-400 mr-1">$</span>
                <input 
                  type="number" 
                  value={downPayment} 
                  onChange={e => setDownPayment(Number(e.target.value))}
                  className="w-full outline-none bg-transparent font-poppins"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">Loan Term</label>
              <div className="relative">
                <select 
                  value={loanTerm} 
                  onChange={e => setLoanTerm(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer font-poppins shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
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
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-slate-700">Credit Tier / APR</label>
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
                    onChange={e => setApr(Math.max(0, Number(e.target.value) / 100))}
                    className="w-full outline-none bg-transparent font-poppins"
                    placeholder="8.50"
                  />
                  <span className="text-slate-400 ml-1 font-poppins">%</span>
                </div>
              ) : (
                <div className="relative">
                  <select 
                    value={apr} 
                    onChange={e => setApr(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 appearance-none outline-none cursor-pointer font-poppins shadow-xs focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all"
                  >
                    <option value={0.065}>740+ Tier 1 (6.50%)</option>
                    <option value={0.0799}>700-739 Tier 2 (7.99%)</option>
                    <option value={0.0979}>680-699 Tier 3 (9.79%)</option>
                    <option value={0.1400}>630-679 Subprime (14.0%)</option>
                    <option value={0.2000}>Under 630 Deep Subprime (20.0%)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              )}
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
                <div className="flex items-center bg-white border border-slate-300 hover:border-slate-400 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 w-28 shadow-xs focus-within:border-[#29abe2] focus-within:ring-2 focus-within:ring-[#29abe2]/20 transition-all">
                  <span className="text-slate-400 mr-1">$</span>
                  <input 
                    type="number" 
                    value={tradeInAmount} 
                    onChange={e => setTradeInAmount(Number(e.target.value))}
                    className="w-full outline-none bg-transparent font-poppins"
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
            <span>Excludes state sales tax &amp; title fees. Prequalify with lenders for exact APR.</span>
          </div>
        </div>
      </div>

      {/* Conditional Affiliate Offer (Dynamically Triggers when APR > 8%) */}
      {apr > 0.08 && (
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#0a0f1d] border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.18)] text-white relative overflow-hidden transition-all duration-300">
          {/* Authentic terminal scanline & subtle grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-40" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                <AlertTriangle size={20} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                    SYS_NOTIFY // TELEMETRY: APR {(apr * 100).toFixed(2)}% &gt; 8.00% NATIONAL BENCHMARK
                  </span>
                </div>

                <p className="text-sm sm:text-base font-bold text-white font-poppins leading-snug">
                  Your rate is above the national average. Check if you qualify for a better rate here.
                </p>

                <p className="text-xs text-slate-300 font-poppins leading-relaxed">
                  Prime national auto rates average 6.50%–7.99%. Overpaying on dealer-marked APR adds an estimated <strong className="text-amber-300 font-bold">{"$" + Math.round(totalInterestPaid * 0.28).toLocaleString()}</strong> in excess finance charges over {loanTerm} months.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center pt-2 md:pt-0">
              <a 
                href={AUTO_REFINANCE_AFFILIATE_URL}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-poppins"
              >
                <span>Check Pre-Qualified Rates</span>
                <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      )}
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
    <div className="space-y-12 font-poppins">
      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight font-poppins">Latest Vehicle Deep Dives</h3>
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
              <h4 className="text-xs font-semibold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug font-poppins">{item.title}</h4>
            </a>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight font-poppins">Buyer Research Guides</h3>
            <p className="text-xs text-slate-500 mt-0.5 font-poppins">Practical strategies, financing tips, and inspection advice</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((item, idx) => (
            <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="block group bg-white/80 backdrop-blur-xl border border-white/70 rounded-2xl p-3 shadow-sm hover:shadow-md transition-all">
              <div className="rounded-xl overflow-hidden mb-3 h-32 relative bg-slate-100">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <h4 className="text-xs font-semibold text-slate-900 group-hover:text-[#29abe2] transition-colors line-clamp-2 leading-snug font-poppins">{item.title}</h4>
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
      {/* FTC Affiliate & Compensation Disclosure Banner */}
      <div className="mb-12 p-5 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-[11.5px] text-slate-400 leading-relaxed shadow-lg">
        <div className="flex items-center gap-2 mb-2 text-slate-200 font-bold uppercase tracking-wider text-[10.5px]">
          <ShieldCheck size={14} className="text-[#29abe2]" />
          <span>FTC Affiliate & Consumer Compensation Disclosure</span>
        </div>
        <p>
          CarMatrix is an independent consumer automotive intelligence platform operated by <strong className="text-slate-200">Defiant Digital Holdings LLC</strong>. We may receive referral compensation from partner links, pre-qualification requests, insurance quote inquiries, and vehicle history lookups at zero additional cost to you. This compensation does not influence our algorithmic valuation estimates, 5-year ownership cost calculations, dealer quote fee audits, or editorial integrity. All vehicles, trademarks, and brand names belong to their respective owners.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center">
            <img 
              src="https://res.cloudinary.com/yrhldsmj/image/upload/v1790959350/Logo-CarMatrix_i1t78a.png" 
              alt="CarMatrix Logo" 
              className="h-11 w-auto object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
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
          </div>

          <div className="pt-2 text-[11px] text-slate-500">
            A publication of <strong className="text-slate-400">Defiant Digital Holdings LLC</strong>
          </div>
        </div>

        <div>
          <h4 className="font-bold text-white mb-3 uppercase tracking-wider text-[11px]">Research Tools</h4>
          <ul className="space-y-2">
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
          <ul className="space-y-2">
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

      <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
        <span>© 2026 CarMatrix — Defiant Digital Holdings LLC. All rights reserved. Data powered by NHTSA & MarketCheck.</span>
        <div className="flex flex-wrap items-center gap-4">
          <button onClick={() => onNavigate('gear')} className="hover:text-slate-300 cursor-pointer text-[#29abe2]">Gear Guide</button>
          <button onClick={() => onNavigate('affiliate_disclosure')} className="hover:text-slate-300 cursor-pointer text-[#29abe2]">Affiliate Disclosure</button>
          <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 cursor-pointer">Privacy Policy</button>
          <button onClick={() => onNavigate('terms')} className="hover:text-slate-300 cursor-pointer">Terms</button>
          <button onClick={() => onNavigate('team')} className="hover:text-slate-300 cursor-pointer">Team</button>
          <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 cursor-pointer">Contact</button>
          <button onClick={() => onNavigate('faq')} className="hover:text-slate-300 cursor-pointer">FAQ</button>
          <button onClick={() => onNavigate('pr')} className="hover:text-slate-300 cursor-pointer">Press</button>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>('home');
  const [activeToolkitFilter, setActiveToolkitFilter] = useState<string>('all');

  const scrollToTool = (toolId: string) => {
    setTimeout(() => {
      const el = document.getElementById(toolId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-poppins text-slate-900 min-h-screen selection:bg-[#29abe2]/30 selection:text-slate-900 relative flex flex-col bg-[#DDE3EA]">
      <NavBar 
        onHomeClick={() => navigateTo('home')}
        onMarketPulseClick={() => navigateTo('market_pulse')}
        onGearClick={() => navigateTo('gear')}
        onScrollToTool={scrollToTool}
      />
      
      <div className="flex-1">
        {currentPath === 'market_pulse' ? (
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] relative overflow-hidden">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
                          <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                          <Search size={22} strokeWidth={2.2} className="drop-shadow-xs" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-poppins">
                            Pre-Lot Recon
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-poppins mt-0.5">
                            Audit vehicle build history, 5-year ownership depreciation, and fair market value before setting foot on the dealer lot.
                          </p>
                        </div>
                      </div>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'vin') && (
                      <section id="vin-checker" className="scroll-mt-24">
                        <VINRecallWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'tco') && (
                      <section id="tco-calculator" className="scroll-mt-24">
                        <TCOCalculator />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'valuation') && (
                      <section id="valuation-estimator" className="scroll-mt-24">
                        <ValuationWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'inspection') && (
                      <section id="inspection-checklist" className="scroll-mt-24">
                        <InspectionChecklistWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'recon' || activeToolkitFilter === 'dossier') && (
                      <section id="test-drive-dossier" className="scroll-mt-24">
                        <TestDriveDossierWidget />
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] relative overflow-hidden">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-300/40 shadow-[0_4px_16px_rgba(245,158,11,0.18)] flex items-center justify-center text-amber-500 shrink-0 relative overflow-hidden">
                          <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                          <SlidersHorizontal size={22} strokeWidth={2.2} className="drop-shadow-xs" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-poppins">
                            Finance Trap Detectors
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-poppins mt-0.5">
                            Expose backend APR markup, deceptive lease money factors, and underwater trade-in rollovers before signing.
                          </p>
                        </div>
                      </div>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'loan') && (
                      <section id="loan-calculator" className="scroll-mt-24">
                        <EstimateBudgetSection />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'lease') && (
                      <section id="lease-vs-finance" className="scroll-mt-24">
                        <LeaseVsFinanceWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'finance' || activeToolkitFilter === 'depreciation') && (
                      <section id="depreciation-curve" className="scroll-mt-24">
                        <DepreciationPredictorWidget />
                      </section>
                    )}
                  </section>
                )}

                {/* =========================================================================
                    SECTOR 03: THE CLOSING TABLE
                    (OTD Calculator, AI Negotiation Research, 50-State Doc Fee Guide)
                    ========================================================================= */}
                {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'quote' || activeToolkitFilter === 'ai' || activeToolkitFilter === 'state-fees' || activeToolkitFilter === 'ev' || activeToolkitFilter === 'market') && (
                  <section className="space-y-8 relative">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] relative overflow-hidden">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/10 to-transparent border border-emerald-300/40 shadow-[0_4px_16px_rgba(16,185,129,0.18)] flex items-center justify-center text-emerald-600 shrink-0 relative overflow-hidden">
                          <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                          <FileSearch size={22} strokeWidth={2.2} className="drop-shadow-xs" />
                        </div>
                        <div>
                          <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight font-poppins">
                            The Closing Table
                          </h2>
                          <p className="text-xs sm:text-sm text-slate-600 max-w-md font-poppins mt-0.5">
                            Dismantle dealer fee padding, eliminate unauthorized add-ons, and deploy AI counter-negotiation language.
                          </p>
                        </div>
                      </div>
                    </div>

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'quote') && (
                      <section id="quote-auditor" className="scroll-mt-24">
                        <DealerQuoteAuditorWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'ai') && (
                      <section id="ai-advisor" className="scroll-mt-24">
                        <AIAdvisorWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'closing' || activeToolkitFilter === 'state-fees') && (
                      <section id="state-fees" className="scroll-mt-24">
                        <StateFeeGuideWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'ev') && (
                      <section id="ev-comparison" className="scroll-mt-24">
                        <EVComparisonWidget />
                      </section>
                    )}

                    {(activeToolkitFilter === 'all' || activeToolkitFilter === 'market') && (
                      <section id="market-trends" className="scroll-mt-24 bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 font-poppins relative overflow-hidden">
                        <div className="flex items-center gap-3.5 mb-6">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
                            <TrendingUp size={22} strokeWidth={2.2} className="drop-shadow-xs" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">Market Trends &amp; Price Index</h3>
                            <p className="text-slate-600 text-sm mt-0.5 font-poppins">Track real-time inventory days-supply, wholesale price trajectory, and regional price adjustments.</p>
                          </div>
                        </div>
                        <MarketPulse />
                      </section>
                    )}
                  </section>
                )}

              </div>

              <section className="pt-8 border-t border-slate-300/80">
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
      <CookieConsentBanner onNavigate={navigateTo} />
    </div>
  );
}
