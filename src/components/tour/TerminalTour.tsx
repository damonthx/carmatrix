import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
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
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [popoverCoords, setPopoverCoords] = useState<{ top: number; left: number; position: 'top' | 'bottom' } | null>(null);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const currentStep: TourStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  const updatePosition = useCallback(() => {
    if (!isOpen) return;

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

    const popoverWidth = 380;
    const popoverHeight = 260;
    const gap = 14;

    let preferredPos = currentStep.position || 'bottom';
    let top = 0;

    if (preferredPos === 'bottom') {
      top = rect.bottom + gap;
      // If it overflows viewport bottom, flip to top if space permits
      if (top + popoverHeight > window.innerHeight && rect.top - popoverHeight - gap > 80) {
        top = rect.top - popoverHeight - gap;
        preferredPos = 'top';
      }
    } else {
      top = rect.top - popoverHeight - gap;
      // If it overflows viewport top, flip to bottom
      if (top < 80 && rect.bottom + popoverHeight + gap < window.innerHeight) {
        top = rect.bottom + gap;
        preferredPos = 'bottom';
      }
    }

    // Center horizontally on target, clamped within screen margins
    let left = rect.left + rect.width / 2 - popoverWidth / 2;
    left = Math.max(20, Math.min(window.innerWidth - popoverWidth - 20, left));
    top = Math.max(80, Math.min(window.innerHeight - popoverHeight - 20, top));

    setPopoverCoords({
      top,
      left,
      position: preferredPos as 'top' | 'bottom',
    });
  }, [isOpen, currentStep]);

  // Scroll target into view on step change
  useEffect(() => {
    if (!isOpen) return;

    const targetEl = 
      document.getElementById(currentStep.targetId) || 
      document.querySelector(`[data-tour-target="${currentStep.targetId}"]`);

    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer = setTimeout(() => {
      updatePosition();
    }, 350);

    return () => clearTimeout(timer);
  }, [isOpen, currentStepIndex, currentStep, updatePosition]);

  // Handle window scroll and resize
  useEffect(() => {
    if (!isOpen) return;

    const handleScrollResize = () => {
      updatePosition();
    };

    window.addEventListener('resize', handleScrollResize, { passive: true });
    window.addEventListener('scroll', handleScrollResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleScrollResize);
      window.removeEventListener('scroll', handleScrollResize);
    };
  }, [isOpen, updatePosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSkip();
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
  }, [isOpen, currentStepIndex]);

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
      {/* Semi-transparent Backdrop with spotlight glow */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={handleSkip}
        aria-hidden="true"
      />

      {/* Target Focus Ring / Spotlight bounding box */}
      {targetRect && (
        <div
          style={{
            position: 'fixed',
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
            pointerEvents: 'none',
          }}
          className="rounded-3xl border-2 border-[#29abe2]/70 shadow-[0_0_40px_rgba(41,171,226,0.35)] transition-all duration-300 ring-1 ring-sky-300/30"
        />
      )}

      {/* Popover Card */}
      <div
        ref={popoverRef}
        style={
          popoverCoords
            ? {
                position: 'fixed',
                top: popoverCoords.top,
                left: popoverCoords.left,
                width: 380,
              }
            : undefined
        }
        className={`z-[105] rounded-3xl bg-slate-950/95 border border-slate-800 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] p-5 backdrop-blur-2xl text-white transition-all duration-300 relative overflow-hidden ${
          !popoverCoords
            ? 'fixed bottom-4 inset-x-4 mx-auto max-w-[400px]'
            : ''
        }`}
        role="dialog"
        aria-labelledby="tour-step-title"
      >
        {/* Specular top rim light */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/50 to-transparent pointer-events-none" />

        {/* Ambient interior radial glow */}
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header: Step Badge, Title & Close Button */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3 relative z-10">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 border border-sky-400/30 text-sky-300">
              <Sparkles className="w-2.5 h-2.5 text-[#29abe2]" />
              Step {currentStepIndex + 1} of {TOUR_STEPS.length}
            </span>
          </div>

          <button
            onClick={handleSkip}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close tour"
          >
            <X size={15} />
          </button>
        </div>

        {/* Title */}
        <h3 id="tour-step-title" className="text-base font-bold text-white tracking-tight mb-2.5 relative z-10 flex items-center gap-2">
          {currentStep.title}
        </h3>

        {/* Bullet Points */}
        <ul className="space-y-2 mb-4 relative z-10">
          {currentStep.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300/90 leading-relaxed font-medium">
              <div className="w-4 h-4 rounded-full bg-[#29abe2]/15 border border-[#29abe2]/40 text-[#29abe2] flex items-center justify-center shrink-0 mt-0.5">
                <Check size={10} strokeWidth={2.5} />
              </div>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>

        {/* Step Indicator Dots & Navigation Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 relative z-10">
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
                className="w-7 h-7 rounded-xl border border-slate-700/80 hover:border-slate-500 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                aria-label="Previous step"
              >
                <ChevronLeft size={14} />
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-[#29abe2] hover:bg-[#29abe2]/90 text-white text-xs font-semibold shadow-[0_2px_12px_rgba(41,171,226,0.35)] flex items-center gap-1 transition-all cursor-pointer active:scale-95"
            >
              <span>{isLastStep ? 'Finish' : 'Next'}</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TerminalTour;
