import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Check, Compass, Layers, ShieldCheck } from 'lucide-react';
import { TOUR_STEPS, TourStep } from '../../config/terminalTourSteps';

interface TerminalTourProps {
  isOpen: boolean;
  onClose: () => void;
  onStepChange?: (stepIndex: number) => void;
}

export const TerminalTour: React.FC<TerminalTourProps> = ({
  isOpen,
  onClose,
  onStepChange,
}) => {
  const [isPrompting, setIsPrompting] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number; position: 'top' | 'bottom' } | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  // Whenever tour opens, reset to prompt at the top of the site
  useEffect(() => {
    if (isOpen) {
      setIsPrompting(true);
      setCurrentStepIndex(0);
      setTargetRect(null);
      setPopoverCoords(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isOpen]);

  const updatePosition = useCallback(() => {
    if (!isOpen || isPrompting) return;

    const targetEl = 
      document.getElementById(currentStep.targetId) || 
      document.querySelector(`[data-tour-target="${currentStep.targetId}"]`);

    if (!targetEl) {
      setPopoverCoords(null);
      setTargetRect(null);
      return;
    }

    const rect = targetEl.getBoundingClientRect();
    setTargetRect(rect);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      // On mobile, dock cleanly at bottom viewport
      setPopoverCoords(null);
      return;
    }

    const popoverWidth = Math.min(380, window.innerWidth - 32);
    // Measure actual rendered height or use safe upper bound (320px)
    const actualHeight = popoverRef.current ? popoverRef.current.offsetHeight : 320;
    const bottomSafeMargin = 28;
    const gap = 12;

    // Prefer placing below the target card
    let top = rect.bottom + gap;

    // If placing below would push the bottom off-screen, pin it safely above the bottom of the viewport
    if (top + actualHeight > window.innerHeight - bottomSafeMargin) {
      top = window.innerHeight - actualHeight - bottomSafeMargin;
    }

    // Ensure it never clips into top navbar (height ~72px)
    top = Math.max(84, top);

    // Center horizontally on target, clamped within screen margins
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(20, Math.min(window.innerWidth - popoverWidth - 20, left));

    setPopoverCoords({
      top,
      left,
      position: 'bottom',
    });
  }, [isOpen, isPrompting, currentStep]);

  // Keep target in view without violent jumping around
  useEffect(() => {
    if (!isOpen || isPrompting) return;

    const targetEl = 
      document.getElementById(currentStep.targetId) || 
      document.querySelector(`[data-tour-target="${currentStep.targetId}"]`);

    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const inView = rect.top >= 70 && rect.bottom <= window.innerHeight - 20;
      if (!inView) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    const timer = setTimeout(() => {
      updatePosition();
    }, 200);

    return () => clearTimeout(timer);
  }, [isOpen, isPrompting, currentStepIndex, currentStep, updatePosition]);

  // Handle window scroll and resize
  useEffect(() => {
    if (!isOpen || isPrompting) return;

    const handleScrollResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollResize, { passive: true });
    window.addEventListener('scroll', handleScrollResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleScrollResize);
      window.removeEventListener('scroll', handleScrollResize);
    };
  }, [isOpen, isPrompting, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
      } else if (isPrompting) {
        if (e.key === 'Enter' || e.key.toLowerCase() === 'y') {
          e.preventDefault();
          handleStartTour();
        } else if (e.key.toLowerCase() === 'n') {
          e.preventDefault();
          handleSkip();
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isPrompting, currentStepIndex]);

  const handleStartTour = () => {
    setIsPrompting(false);
    setCurrentStepIndex(0);
    onStepChange?.(0);
  };

  const handleSkip = () => {
    localStorage.setItem('carmatrix_tour_seen', 'true');
    onClose();
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      onStepChange?.(nextIdx);
    } else {
      localStorage.setItem('carmatrix_tour_seen', 'true');
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      onStepChange?.(prevIdx);
    }
  };

  if (!isOpen) return null;

  const isLastStep = currentStepIndex === TOUR_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  return createPortal(
    <div className="fixed inset-0 z-[100] pointer-events-auto font-poppins selection:bg-[#29abe2]/30 selection:text-white">
      {/* 
        Semi-transparent Backdrop - ZERO BLUR so the website remains 100% sharp and visible!
      */}
      <div 
        className="fixed inset-0 bg-slate-950/45 transition-opacity duration-300"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* =========================================================================
          STATE 1: WELCOME PROMPT AT THE TOP OF THE SITE (YES / NO QUESTION)
          ========================================================================= */}
      {isPrompting ? (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-[105]"
          role="dialog"
          aria-labelledby="tour-prompt-title"
          aria-describedby="tour-prompt-desc"
        >
          <div 
            ref={popoverRef}
            className="w-full max-w-[440px] max-h-[calc(100vh-60px)] overflow-y-auto rounded-3xl bg-slate-950 border border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.95)] p-5 sm:p-6 text-white relative animate-fadeIn my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Specular top rim light */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/70 to-transparent pointer-events-none" />

            {/* Ambient interior radial glow */}
            <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Badge & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3.5 relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10.5px] font-bold uppercase tracking-wider bg-sky-500/15 border border-sky-400/30 text-sky-300 shadow-[0_0_12px_rgba(41,171,226,0.2)]">
                <Compass className="w-3.5 h-3.5 text-[#29abe2]" />
                Guided Walkthrough
              </span>

              <button
                onClick={handleSkip}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Dismiss tour prompt"
              >
                <X size={16} />
              </button>
            </div>

            {/* Prompt Question */}
            <div className="space-y-1.5 mb-4 relative z-10">
              <h3 id="tour-prompt-title" className="text-xl font-bold text-white tracking-tight leading-snug">
                Tour the 3 Modules?
              </h3>
              <p id="tour-prompt-desc" className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                Take a quick 45-second overview of our 3 anti-dealer sectors right here at the top of the site — without jumping around.
              </p>
            </div>

            {/* Preview of the 3 Modules */}
            <div className="space-y-2 mb-5 relative z-10 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-sky-500/20 text-[#29abe2] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold border border-sky-400/30">
                  01
                </div>
                <div>
                  <span className="font-semibold text-white">Pre-Lot Recon:</span>{' '}
                  <span className="text-slate-400">VIN specs, recalls &amp; true 5-yr TCO</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold border border-amber-400/30">
                  02
                </div>
                <div>
                  <span className="font-semibold text-white">Finance Trap Detectors:</span>{' '}
                  <span className="text-slate-400">APR math, lease traps &amp; depreciation</span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-mono text-[10px] font-bold border border-emerald-400/30">
                  03
                </div>
                <div>
                  <span className="font-semibold text-white">The Closing Table:</span>{' '}
                  <span className="text-slate-400">OTD junk fee auditor &amp; AI scripts</span>
                </div>
              </div>
            </div>

            {/* Yes / No Actions */}
            <div className="flex items-center justify-end gap-3 pt-1 relative z-10">
              <button
                onClick={handleSkip}
                className="px-4 py-2 rounded-xl border border-slate-700 hover:border-slate-500 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                No, thanks
              </button>

              <button
                onClick={handleStartTour}
                className="px-5 py-2 rounded-xl bg-[#29abe2] hover:bg-[#29abe2]/90 text-white text-xs font-semibold shadow-[0_2px_16px_rgba(41,171,226,0.4)] flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <span>Yes, start tour</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            STATE 2: STEP-BY-STEP POINTING OUT THE 3 MODULES AT THE TOP (NO JUMPING)
            ========================================================================= */
        <>
          {/* Ambient radial glow under the active module card */}
          {targetRect && (
            <div
              style={{
                position: 'fixed',
                top: targetRect.top - 12,
                left: targetRect.left - 12,
                width: targetRect.width + 24,
                height: targetRect.height + 24,
                pointerEvents: 'none',
              }}
              className="rounded-3xl bg-[#29abe2]/20 blur-xl transition-all duration-300"
            />
          )}

          {/* Elevated Specular Spotlight Frame around active module */}
          {targetRect && (
            <div
              style={{
                position: 'fixed',
                top: targetRect.top - 6,
                left: targetRect.left - 6,
                width: targetRect.width + 12,
                height: targetRect.height + 12,
                pointerEvents: 'none',
              }}
              className="rounded-3xl border-2 border-[#29abe2] shadow-[0_0_50px_rgba(41,171,226,0.55),inset_0_0_24px_rgba(41,171,226,0.18),0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 ring-2 ring-sky-300/40 relative overflow-hidden"
            >
              {/* Top edge light rim on the spotlight frame */}
              <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />
            </div>
          )}

          {/* Step Popover Card */}
          <div
            ref={popoverRef}
            style={
              popoverCoords
                ? {
                    position: 'fixed',
                    top: popoverCoords.top,
                    left: popoverCoords.left,
                    width: 380,
                    maxHeight: 'calc(100vh - 100px)',
                  }
                : undefined
            }
            className={`z-[105] rounded-3xl bg-slate-950/98 border border-sky-500/35 shadow-[0_25px_70px_rgba(0,0,0,0.95),0_0_30px_rgba(41,171,226,0.2)] p-4 sm:p-5 text-white transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
              !popoverCoords
                ? 'fixed bottom-5 inset-x-4 mx-auto max-w-[400px] max-h-[calc(100vh-100px)]'
                : ''
            }`}
            role="dialog"
            aria-labelledby="tour-step-title"
          >
            {/* Specular top rim light */}
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/70 to-transparent pointer-events-none" />

            {/* Ambient interior radial glow */}
            <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header: Step Badge, Sector Tag & Close Button */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2.5 relative z-10 shrink-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 border border-sky-400/30 text-sky-300">
                  <Layers className="w-3 h-3 text-[#29abe2]" />
                  Sector {currentStepIndex + 1} of {TOUR_STEPS.length}
                </span>

                {currentStep.badge && (
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
                    {currentStep.badge}
                  </span>
                )}
              </div>

              <button
                onClick={handleSkip}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close tour"
              >
                <X size={15} />
              </button>
            </div>

            {/* Scrollable / Flexible Middle Area */}
            <div className="relative z-10 overflow-y-auto pr-0.5">
              {/* Title */}
              <h3 id="tour-step-title" className="text-base font-bold text-white tracking-tight mb-2 flex items-center gap-2">
                {currentStep.title}
              </h3>

              {/* Bullet Points */}
              <ul className="space-y-1.5 mb-3">
                {currentStep.bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed font-medium">
                    <div className="w-4 h-4 rounded-full bg-[#29abe2]/15 border border-[#29abe2]/40 text-[#29abe2] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={10} strokeWidth={2.5} />
                    </div>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Step Indicator Dots & Navigation Actions - ALWAYS PINNED AT BOTTOM */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-800 relative z-10 shrink-0 mt-auto">
              {/* Skip link */}
              <button
                onClick={handleSkip}
                className="text-[11px] font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Skip Tour
              </button>

              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentStepIndex
                        ? 'w-5 bg-[#29abe2] shadow-[0_0_8px_#29abe2]'
                        : 'w-1.5 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Next / Back Controls */}
              <div className="flex items-center gap-1.5">
                {!isFirstStep && (
                  <button
                    onClick={handlePrev}
                    className="w-7 h-7 rounded-xl border border-slate-700 hover:border-slate-500 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Previous step"
                  >
                    <ChevronLeft size={14} />
                  </button>
                )}

                <button
                  onClick={handleNext}
                  className="px-3.5 py-1.5 rounded-xl bg-[#29abe2] hover:bg-[#29abe2]/90 text-white text-xs font-semibold shadow-[0_2px_12px_rgba(41,171,226,0.35)] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
                >
                  <span>{isLastStep ? 'Finish' : 'Next'}</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>,
    document.body
  );
};

export default TerminalTour;
