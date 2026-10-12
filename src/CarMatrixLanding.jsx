import React from 'react';
import { motion } from 'motion/react';
import { 
  Terminal, Compass, ShieldCheck, ArrowRight, 
  Search, SlidersHorizontal, FileSearch, Zap,
  TrendingUp, Award, ExternalLink, HelpCircle
} from 'lucide-react';

/**
 * CarMatrixLanding component serves as the root index route.
 * Features a dark, high-tech automotive-tech aesthetic matching CarMatrix,
 * centered logo at top, "Never Step onto a Dealership Lot Unarmed." headline,
 * and two large "liquid glass" buttons side-by-side with smooth fade-in transitions.
 */
export default function CarMatrixLanding({ 
  onAccessTerminal, 
  onOpenGuidedEvaluator,
  onNavigate 
}) {
  const handleTerminalClick = () => {
    if (onAccessTerminal) {
      onAccessTerminal();
    } else if (onNavigate) {
      onNavigate('terminal');
    }
  };

  const handleEvaluatorClick = () => {
    if (onOpenGuidedEvaluator) {
      onOpenGuidedEvaluator();
    } else if (onNavigate) {
      onNavigate('guided_evaluator');
    }
  };

  // Animation variants for smooth stagger fade-in
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 22 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.65, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  const buttonFadeIn = {
    hidden: { opacity: 0, y: 28, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.75, 
        ease: [0.16, 1, 0.3, 1] 
      } 
    },
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 font-poppins overflow-x-hidden max-w-full flex flex-col justify-between selection:bg-[#29abe2]/30 selection:text-white">
      {/* Background High-Tech Atmospheric Elements */}
      {/* 1. Subtle High-Tech HUD Grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* 2. Top Centered Radial Lighting Glow (Brand Blue #29abe2) */}
      <div 
        className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] max-w-[100vw] h-[360px] bg-[#29abe2]/15 rounded-full blur-[130px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* 3. Deep Secondary Ambient Orbs */}
      <div 
        className="absolute top-1/3 -left-48 w-[450px] max-w-[100vw] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-20 -right-48 w-[500px] max-w-[100vw] h-[500px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none" 
        aria-hidden="true" 
      />

      {/* Top Utility Bar (Logo & Quick Nav links) */}
      <header className="relative z-20 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 flex items-center justify-between text-xs text-slate-400">
        {/* Main Logo in Upper-Left Corner */}
        <div className="flex items-center">
          <img 
            src="https://res.cloudinary.com/yrhldsmj/image/upload/v1791661870/Logo-white-500_m3yxou.png" 
            alt="CarMatrix Logo" 
            className="w-[185px] sm:w-[225px] md:w-[245px] h-auto object-contain transition-opacity hover:opacity-90"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="flex items-center gap-3 sm:gap-5">
          {onNavigate && (
            <>
              <button 
                type="button"
                onClick={() => onNavigate('rankings')} 
                className="hover:text-white transition-colors cursor-pointer hidden sm:inline-block"
              >
                Used Cars
              </button>
              <button 
                type="button"
                onClick={() => onNavigate('market_pulse')} 
                className="hover:text-white transition-colors cursor-pointer hidden sm:inline-block"
              >
                Market Pulse
              </button>
              <button 
                type="button"
                onClick={() => onNavigate('dealer_directory')} 
                className="text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
              >
                Dealer Intel™
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Hero & Center Stage */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 flex-1 flex flex-col items-center justify-center text-center">
        <motion.div 
          className="w-full max-w-4xl flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Main Headline */}
          <motion.h1 
            variants={itemFadeIn}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.12] sm:leading-[1.1] mb-6 sm:mb-8 font-poppins max-w-4xl"
          >
            Never Step onto a Dealership Lot{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-sky-100 to-[#29abe2] drop-shadow-[0_2px_16px_rgba(41,171,226,0.35)]">
              Unarmed.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.div 
            variants={itemFadeIn}
            className="max-w-2xl text-center space-y-3 mb-12 sm:mb-14"
          >
            <p className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight leading-snug">
              The dealership knows the numbers. Now you do, too.
            </p>
            <p className="text-xs sm:text-sm md:text-base text-slate-300/85 leading-relaxed font-normal">
              CarMatrix gives you the intelligence to uncover inflated prices, expose hidden fees, break down financing costs, and spot expensive dealer add-ons before you sign. Know what you're really paying, negotiate with confidence, and take control of the deal.
            </p>
          </motion.div>

          {/* Two Large Enhanced Liquid Glass Style Cards: Stacks Vertically on Mobile (grid-cols-1 md:grid-cols-2) */}
          <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 items-stretch box-border">
            {/* Card 1: Access the Full Toolkit */}
            <motion.div variants={buttonFadeIn} className="h-full w-full">
              <button
                type="button"
                onClick={handleTerminalClick}
                className="group relative w-full h-full p-6 sm:p-8 md:p-9 rounded-3xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-3xl bg-gradient-to-b from-white/[0.12] via-slate-900/75 to-slate-950/90 border border-white/20 hover:border-[#29abe2] shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(41,171,226,0.45),inset_0_0_28px_rgba(41,171,226,0.2),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99] touch-manipulation"
              >
                {/* Specular Top Light Rim (signature glassmorphic edge) */}
                <div 
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none group-hover:via-[#29abe2] transition-all duration-300" 
                  aria-hidden="true" 
                />

                {/* Internal Ambient Radial Glow Orb */}
                <div 
                  className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-[#29abe2]/20 blur-3xl pointer-events-none group-hover:bg-[#29abe2]/35 transition-all duration-500" 
                  aria-hidden="true" 
                />

                {/* Upper-Left Solid Colored Icon (Blue background, White icon) */}
                <div className="relative z-10 flex items-start justify-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-[#29abe2] border border-sky-300/60 shadow-[0_0_25px_rgba(41,171,226,0.55),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(41,171,226,0.8)] transition-all duration-300">
                    <Terminal size={28} strokeWidth={2.4} className="text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Title (H2 size) and Description */}
                <div className="relative z-10 space-y-3 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-[#29abe2] transition-colors duration-200 leading-tight">
                    Access the Full Toolkit
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                    Enter the full dashboard featuring Pre-Lot Recon, Finance Guard, and Add-on Defense tools.
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="relative z-10 pt-5 border-t border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-between text-xs sm:text-sm font-bold text-white group-hover:text-[#29abe2]">
                  <span className="tracking-wide">Launch Terminal Suite</span>
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:bg-[#29abe2] group-hover:text-slate-950 group-hover:border-[#29abe2] transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Card 2: Guide Me: Interactive Deal Evaluator */}
            <motion.div variants={buttonFadeIn} className="h-full w-full">
              <button
                type="button"
                onClick={handleEvaluatorClick}
                className="group relative w-full h-full p-6 sm:p-8 md:p-9 rounded-3xl text-left cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden backdrop-blur-3xl bg-gradient-to-b from-white/[0.12] via-slate-900/75 to-slate-950/90 border border-white/20 hover:border-emerald-400 shadow-[0_20px_50px_rgba(0,0,0,0.7),inset_0_1px_2px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(52,211,153,0.45),inset_0_0_28px_rgba(52,211,153,0.2),inset_0_1px_2px_rgba(255,255,255,0.35)] hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99] touch-manipulation"
              >
                {/* Specular Top Light Rim */}
                <div 
                  className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none group-hover:via-emerald-400 transition-all duration-300" 
                  aria-hidden="true" 
                />

                {/* Internal Ambient Radial Glow Orb */}
                <div 
                  className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none group-hover:bg-emerald-400/35 transition-all duration-500" 
                  aria-hidden="true" 
                />

                {/* Upper-Left Solid Colored Icon (Green background, White icon) */}
                <div className="relative z-10 flex items-start justify-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 border border-emerald-300/60 shadow-[0_0_25px_rgba(16,185,129,0.55),inset_0_1px_2px_rgba(255,255,255,0.4)] flex items-center justify-center text-white group-hover:scale-105 group-hover:shadow-[0_0_35px_rgba(16,185,129,0.8)] transition-all duration-300">
                    <Compass size={28} strokeWidth={2.4} className="text-white drop-shadow-md" />
                  </div>
                </div>

                {/* Title (H2 size) and Description */}
                <div className="relative z-10 space-y-3 mb-8">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight group-hover:text-emerald-400 transition-colors duration-200 leading-tight">
                    Guide Me: Interactive Deal Evaluator
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
                    Step-by-step audit to inspect price, detect junk fee add-ons, and calculate true out-the-door costs.
                  </p>
                </div>

                {/* Bottom Action CTA */}
                <div className="relative z-10 pt-5 border-t border-white/10 group-hover:border-white/20 transition-colors flex items-center justify-between text-xs sm:text-sm font-bold text-white group-hover:text-emerald-400">
                  <span className="tracking-wide">Start Deal Evaluation</span>
                  <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white group-hover:bg-emerald-400 group-hover:text-slate-950 group-hover:border-emerald-400 transition-all duration-300 group-hover:translate-x-1 shadow-sm">
                    <ArrowRight size={17} strokeWidth={2.4} />
                  </div>
                </div>
              </button>
            </motion.div>
          </div>

          {/* Institutional Trust Highlights */}
          <motion.div 
            variants={itemFadeIn}
            className="mt-14 sm:mt-16 w-full pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs text-slate-400 font-medium"
          >
            <div className="flex flex-col items-center gap-1.5 p-2">
              <ShieldCheck size={18} className="text-[#29abe2]" />
              <span className="text-slate-200 font-bold">100% Free &amp; Unbiased</span>
              <span className="text-[11px] text-slate-400">Zero dealership sponsorship</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Search size={18} className="text-sky-400" />
              <span className="text-slate-200 font-bold">NHTSA VPIC Records</span>
              <span className="text-[11px] text-slate-400">Live federal defect recalls</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <FileSearch size={18} className="text-emerald-400" />
              <span className="text-slate-200 font-bold">50-State Doc Fee Caps</span>
              <span className="text-[11px] text-slate-400">Statutory consumer legal limits</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 p-2">
              <Zap size={18} className="text-amber-400" />
              <span className="text-slate-200 font-bold">AI Counter-Scripts</span>
              <span className="text-[11px] text-slate-400">Tactical closing table scripts</span>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer Branding Bar */}
      <footer className="relative z-20 w-full py-6 border-t border-white/5 text-center text-xs text-slate-400">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">CarMatrix</span>
            <span>—</span>
            <span className="text-slate-400">Defiant Digital Holdings LLC</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            {onNavigate && (
              <>
                <button type="button" onClick={() => onNavigate('privacy')} className="hover:text-slate-300">Privacy Policy</button>
                <button type="button" onClick={() => onNavigate('terms')} className="hover:text-slate-300">Terms of Service</button>
                <button type="button" onClick={() => onNavigate('affiliate_disclosure')} className="hover:text-slate-300">Affiliate Disclosure</button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
