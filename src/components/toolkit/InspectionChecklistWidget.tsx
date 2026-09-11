import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertTriangle, ShieldCheck, Check, ChevronDown } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  detail: string;
  isCritical?: boolean;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'ext-paint', category: 'Exterior & Body', title: 'Paint & Panel Gap Uniformity', detail: 'Inspect for uneven gaps, overspray, or mismatched paint shading indicating prior collision repair.', isCritical: true },
  { id: 'ext-rust', category: 'Exterior & Body', title: 'Undercarriage & Frame Rust', detail: 'Check rocker panels, wheel wells, and subframe for structural rust or corrosion damage.', isCritical: true },
  { id: 'ext-tires', category: 'Exterior & Body', title: 'Tire Tread Depth & DOT Age Codes', detail: 'Ensure tread is >4/32" and DOT 4-digit date code is under 6 years old with even wear.' },
  { id: 'ext-glass', category: 'Exterior & Body', title: 'Windshield & Light Enclosures', detail: 'Check for cracks, rock chips, and moisture condensation inside headlight housings.' },

  { id: 'mech-oil', category: 'Under The Hood', title: 'Oil Cap & Dipstick Inspection', detail: 'Verify clean amber/dark oil with no milky white residue (sign of blown head gasket).', isCritical: true },
  { id: 'mech-fluids', category: 'Under The Hood', title: 'Coolant, Brake & Transmission Fluids', detail: 'Ensure coolant is bright (pink/green) and transmission fluid is red/pink without burnt odor.' },
  { id: 'mech-belts', category: 'Under The Hood', title: 'Serpentine Belt & Hoses', detail: 'Look for cracking, fraying, oil saturation, or dry rotting along rubber hoses.' },
  { id: 'mech-battery', category: 'Under The Hood', title: 'Battery Terminals & Date', detail: 'Inspect for heavy blue/white corrosion and verify battery age is under 4 years.' },

  { id: 'int-ac', category: 'Interior & Cabin', title: 'Air Conditioning & Heater Core', detail: 'Test cold AC within 60 seconds and hot heat; ensure no sweet smell indicating heater core leak.' },
  { id: 'int-warning', category: 'Interior & Cabin', title: 'Dashboard Warning Lights & OBD-II', detail: 'Confirm Check Engine, ABS, and Airbag lights illuminate on ignition and turn off after start.', isCritical: true },
  { id: 'int-windows', category: 'Interior & Cabin', title: 'Power Windows, Sunroof & Locks', detail: 'Test all power switches, seat adjusters, backup camera, and touchscreen functions.' },
  { id: 'int-water', category: 'Interior & Cabin', title: 'Water Damage & Musty Odors', detail: 'Lift carpets and inspect spare tire well for dampness, rust, or mold from clogged drains.' },

  { id: 'drv-trans', category: 'Test Drive', title: 'Transmission Shift Smoothness', detail: 'Verify clean upshifts and downshifts under gentle and hard acceleration without slipping or clunking.', isCritical: true },
  { id: 'drv-brakes', category: 'Test Drive', title: 'Brake Pulse & Alignment', detail: 'Brake firmly in a safe area; check that the steering wheel does not shudder (warped rotors) or pull left/right.', isCritical: true },
  { id: 'drv-suspension', category: 'Test Drive', title: 'Suspension Noise & Steering Play', detail: 'Listen for clunks over speed bumps and verify tight, responsive steering on center.' }
];

export default function InspectionChecklistWidget({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'checklist' | 'fee-detector'>('checklist');

  const [vehiclePrice, setVehiclePrice] = useState(25000);
  const [docFee, setDocFee] = useState(495);
  const [govTaxes, setGovTaxes] = useState(1560);
  const [registration, setRegistration] = useState(240);
  
  const [paintProtection, setPaintProtection] = useState(895);
  const [vinEtching, setVinEtching] = useState(395);
  const [nitrogenTires, setNitrogenTires] = useState(199);
  const [marketAdjustment, setMarketAdjustment] = useState(0);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  const legitTotal = vehiclePrice + docFee + govTaxes + registration;
  const junkTotal = paintProtection + vinEtching + nitrogenTires + marketAdjustment;
  const outTheDoorTotal = legitTotal + junkTotal;

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8 transition-all">
      <div 
        className={"flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer " + (isOpen ? "pb-6 border-b border-slate-100" : "")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-200/60 rounded-full text-amber-800 text-xs font-bold mb-2">
            <ShieldCheck size={14} className="text-amber-600" />
            <span>Buyer Protection Guide</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <span>Pre-Purchase Inspection & Fee Detector</span>
          </h3>
          <p className="text-slate-500 text-sm mt-1">Interactive inspection tool for used cars and dealer fee analyzer to prevent thousands in junk add-ons.</p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto" onClick={(e) => e.stopPropagation()}>
          {isOpen && (
            <div className="flex bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setActiveTab('checklist')}
                className={
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer " +
                  (activeTab === 'checklist' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')
                }
              >
                {"Inspection Checklist (" + progressPercent + "%)"}
              </button>
              <button
                onClick={() => setActiveTab('fee-detector')}
                className={
                  "px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer " +
                  (activeTab === 'fee-detector' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900')
                }
              >
                Hidden Fee Detector
              </button>
            </div>
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80"
          >
            <span>{isOpen ? 'Collapse' : 'Expand Tool'}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <>
          {activeTab === 'checklist' ? (
        <div className="mt-6 space-y-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-slate-800 mb-1.5">
                <span>Inspection Readiness Progress</span>
                <span className="text-[#29abe2]">{completedCount + " of " + totalItems + " Checks Complete"}</span>
              </div>
              <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#29abe2] to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: progressPercent + "%" }}
                ></div>
              </div>
            </div>
            {progressPercent === 100 && (
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full shrink-0 flex items-center gap-1">
                <Check size={14} /> Ready for Purchase
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHECKLIST_ITEMS.map((item) => {
              const isChecked = Boolean(checkedItems[item.id]);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={
                    "p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 " +
                    (isChecked
                      ? "bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-200"
                      : "bg-white border-slate-200 hover:border-slate-300")
                  }
                >
                  <div className="mt-0.5 shrink-0">
                    {isChecked ? (
                      <CheckCircle2 size={20} className="text-emerald-600" />
                    ) : (
                      <Circle size={20} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900">{item.title}</span>
                      {item.isCritical && (
                        <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded">Critical</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{item.detail}</p>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mt-1.5">{item.category}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Baseline Vehicle & Legitimate Fees</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Agreed Vehicle Price ($)</label>
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={e => setVehiclePrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Doc Fee ($)</label>
                  <input
                    type="number"
                    value={docFee}
                    onChange={e => setDocFee(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Sales Tax ($)</label>
                  <input
                    type="number"
                    value={govTaxes}
                    onChange={e => setGovTaxes(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Title/Reg ($)</label>
                  <input
                    type="number"
                    value={registration}
                    onChange={e => setRegistration(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider pt-2 flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-rose-600" />
              2. Dealer Add-ons & Junk Fees (Negotiable / Decline)
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <label className="block text-[10px] font-bold text-rose-900 mb-1">Paint / Fabric Protection ($)</label>
                <input
                  type="number"
                  value={paintProtection}
                  onChange={e => setPaintProtection(Number(e.target.value))}
                  className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <label className="block text-[10px] font-bold text-rose-900 mb-1">VIN Etching ($)</label>
                <input
                  type="number"
                  value={vinEtching}
                  onChange={e => setVinEtching(Number(e.target.value))}
                  className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <label className="block text-[10px] font-bold text-rose-900 mb-1">Nitrogen Filled Tires ($)</label>
                <input
                  type="number"
                  value={nitrogenTires}
                  onChange={e => setNitrogenTires(Number(e.target.value))}
                  className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-200">
                <label className="block text-[10px] font-bold text-rose-900 mb-1">Market Adjustment ($)</label>
                <input
                  type="number"
                  value={marketAdjustment}
                  onChange={e => setMarketAdjustment(Number(e.target.value))}
                  className="w-full bg-white border border-rose-200 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Out-The-Door (OTD) Summary</h4>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Vehicle + Legitimate Government Fees:</span>
                  <span className="font-bold text-slate-900">{"$" + legitTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-rose-600">
                  <span>Total Dealer Junk Fees Added:</span>
                  <span className="font-bold text-rose-600">{"+$" + junkTotal.toLocaleString()}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-slate-900">True Out-The-Door Price:</span>
                  <span className="text-2xl font-black text-slate-900">{"$" + outTheDoorTotal.toLocaleString()}</span>
                </div>
              </div>

              {junkTotal > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertTriangle size={15} className="text-amber-600" />
                    <span>Negotiation Opportunity: Save {"$" + junkTotal.toLocaleString()}</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Dealers frequently pre-load VIN etching, paint protection, and nitrogen packages. You have the right to request these optional line items be removed from your final purchase order before signing.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
