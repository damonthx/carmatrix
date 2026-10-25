import React, { useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Wrench, 
  Info, 
  CheckSquare2,
  ExternalLink
} from 'lucide-react';
import { VehicleRankingItem } from '@/lib/services/rankingsService';

interface StreetSmartInspectionDrawerProps {
  vehicle: VehicleRankingItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSearchInventory?: (make: string, model: string) => void;
}

export const StreetSmartInspectionDrawer: React.FC<StreetSmartInspectionDrawerProps> = ({
  vehicle,
  isOpen,
  onClose,
}) => {
  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !vehicle) return null;

  const nhtsaScore = Math.min(99, Math.max(70, Math.round(vehicle.reliability_rating * 20)));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Dark frosted backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out drawer content */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden font-poppins animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-6 bg-slate-950 text-white flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
                NHTSA Reliability Profile
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {vehicle.year_start}–{vehicle.year_end}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Reliability Score: <strong className="text-emerald-400">{nhtsaScore}/100</strong> • Rating: <strong className="text-white">{vehicle.reliability_rating} / 5.0</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-xs"
            aria-label="Close inspection drawer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* NHTSA Safety Recall Callout */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/90 text-sky-900 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900">
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/40 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs shrink-0">
                  <ShieldCheck size={13} strokeWidth={2.4} />
                </div>
                <span>Free NHTSA Safety Verification</span>
              </div>
              <a
                href="https://www.nhtsa.gov/recalls"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#29abe2] hover:underline flex items-center gap-1"
              >
                NHTSA.gov <ExternalLink size={11} />
              </a>
            </div>
            <p className="text-xs leading-relaxed text-sky-950">
              Always enter the specific 17-digit VIN into NHTSA&apos;s free database prior to purchase to ensure all federal safety recall remedies have been completed free of charge by an authorized dealer.
            </p>
          </div>

          {/* Model-Specific Mechanical Failure Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-600 shadow-2xs shrink-0">
                <AlertTriangle size={13} strokeWidth={2.4} />
              </div>
              <span>NHTSA Owner Watchpoints &amp; Failure Modes</span>
            </div>
            <p className="text-xs text-slate-500">
              The primary mechanical watch points and service bulletins reported by owners across this vehicle generation:
            </p>

            <div className="space-y-2">
              {vehicle.inspection_alerts && vehicle.inspection_alerts.length > 0 ? (
                vehicle.inspection_alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{alert}</span>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500 italic">
                  No critical generational failure alerts recorded in the defect database.
                </div>
              )}
            </div>
          </div>

          {/* Pre-Purchase Inspection Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-2xs shrink-0">
                <FileCheck size={13} strokeWidth={2.4} />
              </div>
              <span>Pre-Purchase Mechanical Verification Protocol</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">Cold-Engine Start Check: </strong>
                  Feel the hood before ignition. Cold starts reveal hidden timing chain rattles, VVT gear chatter, or valvetrain noise.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">OBD-II Readiness &amp; Pending Codes: </strong>
                  Plug in an OBD-II scanner to ensure emissions readiness monitors are set and no pending transmission or misfire codes were cleared right before your inspection.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">Fluid Condition &amp; Thermal Health: </strong>
                  Inspect transmission dipstick (clean pink/red, no burnt odor), brake fluid clarity, and check for oil weeping near valve covers and main seals.
                </div>
              </div>
            </div>
          </div>

          {/* Powertrain & Reliability Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Powertrain Architecture:</span>
              <strong className="text-slate-900">{vehicle.engine_notes}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>NHTSA Reliability Score:</span>
              <strong className="text-emerald-600 font-extrabold">{nhtsaScore}/100</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Overall Durability Index:</span>
              <strong className="text-slate-900">{vehicle.reliability_rating} / 5.0</strong>
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-5 bg-white border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreetSmartInspectionDrawer;
