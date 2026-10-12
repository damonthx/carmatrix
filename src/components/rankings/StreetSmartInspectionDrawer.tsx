import React, { useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Wrench, 
  DollarSign, 
  Info, 
  CheckSquare2
} from 'lucide-react';
import { VehicleRankingItem } from '@/lib/services/rankingsService';
import { CostOfOwnershipWidget } from '../toolkit/CostOfOwnershipWidget';

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
  onSearchInventory,
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
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 backdrop-blur-md">
                Street-Smart PPI Guide
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {vehicle.year_start}–{vehicle.year_end}
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              {vehicle.make} {vehicle.model}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Target Street Cash: <strong className="text-emerald-400">${vehicle.private_party_mid.toLocaleString()}</strong> (Dealer List: ${vehicle.dealer_retail_mid.toLocaleString()})
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
          {/* Title Baseline Warning Callout */}
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/40 backdrop-blur-md flex items-center justify-center text-amber-700 shadow-2xs shrink-0">
                <AlertTriangle size={13} strokeWidth={2.4} />
              </div>
              <span>Clean Title Baseline</span>
            </div>
            <p className="text-xs leading-relaxed text-amber-950">
              Listings &gt;25% below <strong>${vehicle.private_party_mid.toLocaleString()}</strong> typically indicate salvage history, rebuilt titles, or unlicensed curbstoning.
            </p>
          </div>

          {/* Model-Specific Mechanical Failure Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-slate-800">
              <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-400/40 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs shrink-0">
                <Wrench size={13} strokeWidth={2.4} />
              </div>
              <span>Key Inspection Points</span>
            </div>

            {vehicle.inspection_alerts && vehicle.inspection_alerts.length > 0 ? (
              <div className="space-y-2">
                {vehicle.inspection_alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-md bg-amber-100/90 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {index + 1}
                    </span>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {alert}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">
                Standard inspection protocol applies; no class-action powertrain recalls noted.
              </p>
            )}
          </div>

          {/* Private Party Cash Safety Checklist */}
          <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3 shadow-md border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#29abe2]">
              <div className="w-6 h-6 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-[#29abe2] shrink-0">
                <ShieldCheck size={13} strokeWidth={2.4} />
              </div>
              <span>Private Party Cash Protocol</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">Verify Seller ID: </strong>
                  Ensure driver&apos;s license matches the physical title owner. Refuse open/unsigned titles.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">Cold-Engine Check: </strong>
                  Feel the hood before starting to detect masked cold-start rattles, chain slap, or smoke.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-md bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-2xs">
                  <CheckSquare2 size={12} strokeWidth={2.4} />
                </div>
                <div>
                  <strong className="text-white">Lien Verification: </strong>
                  Confirm no active bank liens unless accompanied by an official lien release document.
                </div>
              </div>
            </div>
          </div>

          {/* Live 5-Year Cost of Ownership Projection */}
          <CostOfOwnershipWidget 
            initialPrice={vehicle.private_party_mid}
            vehicleName={`${vehicle.year_start}–${vehicle.year_end} ${vehicle.make} ${vehicle.model}`}
          />

          {/* Powertrain & Reliability Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Powertrain Notes:</span>
              <strong className="text-slate-900">{vehicle.engine_notes}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>5-Year Estimated Maintenance Baseline:</span>
              <strong className="text-slate-900">${vehicle.five_year_maintenance_cost.toLocaleString()}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Reliability Rating:</span>
              <strong className="text-emerald-600">{vehicle.reliability_rating} / 5.0</strong>
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
