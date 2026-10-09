import React, { useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  FileCheck, 
  Wrench, 
  DollarSign, 
  Info, 
  CheckSquare2, 
  ExternalLink 
} from 'lucide-react';
import { VehicleRankingItem } from '@/lib/services/rankingsService';
import { buildCarMatrixInventoryUrl } from '@/lib/utils/inventoryLinks';

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
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
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
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
            aria-label="Close inspection drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title Baseline Warning Callout */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
              <AlertTriangle size={15} className="text-amber-600 shrink-0" />
              <span>Clean Title Baseline Notice</span>
            </div>
            <p className="text-xs leading-relaxed">
              <strong>Private listings priced &gt;25% below ${vehicle.private_party_mid.toLocaleString()}</strong> are almost always salvage, rebuilt, odometer-rolled, or curbstoned by unlicensed flippers without proper title assignment in their name.
            </p>
          </div>

          {/* Model-Specific Mechanical Failure Points */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800">
              <Wrench size={15} className="text-[#29abe2]" />
              <span>Model-Specific Mechanical Failure Points</span>
            </div>

            {vehicle.inspection_alerts && vehicle.inspection_alerts.length > 0 ? (
              <div className="space-y-2.5">
                {vehicle.inspection_alerts.map((alert, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-3 shadow-2xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
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
                Standard inspection protocol applies; no widespread class-action powertrain recalls noted.
              </p>
            )}
          </div>

          {/* Private Party Cash Safety Checklist */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#29abe2]">
              <ShieldCheck size={16} />
              <span>Private Party Cash Protocol</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckSquare2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">1. Verify Seller ID Against Title:</strong>
                  Ensure the name on the seller&apos;s driver&apos;s license exactly matches the registered owner on the physical title. Refuse "open titles" signed by third parties (title jumping).
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckSquare2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">2. Verify Cold Engine Before Starting:</strong>
                  Feel the hood and engine manifold with your bare hand before the test drive. Sellers frequently warm up engines to mask cold-start valve rattle, timing chain slap, or smoke.
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckSquare2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">3. Run Active Lien &amp; Stolen Check:</strong>
                  Verify the title does not list an outstanding lienholder (bank or finance company) without an accompanying signed original Lien Release letter.
                </div>
              </div>
            </div>
          </div>

          {/* Powertrain & Ownership Cost Summary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-600">
              <span>Powertrain Notes:</span>
              <strong className="text-slate-900">{vehicle.engine_notes}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>5-Year Estimated Maintenance:</span>
              <strong className="text-slate-900">${vehicle.five_year_maintenance_cost.toLocaleString()}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Reliability Rating:</span>
              <strong className="text-emerald-600">{vehicle.reliability_rating} / 5.0</strong>
            </div>
          </div>
        </div>

        {/* Bottom Drawer Actions */}
        <div className="p-5 bg-white border-t border-slate-200 space-y-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onSearchInventory) {
                onSearchInventory(vehicle.make, vehicle.model);
              } else if (typeof window !== 'undefined') {
                window.location.href = buildCarMatrixInventoryUrl(vehicle, 'private_party');
              }
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-[#29abe2] transition-colors cursor-pointer shadow-md"
          >
            <ExternalLink size={14} />
            <span>Search Active Inventory for {vehicle.make} {vehicle.model}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close Checklist
          </button>
        </div>
      </div>
    </div>
  );
};

export default StreetSmartInspectionDrawer;
