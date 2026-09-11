import React, { useState } from 'react';
import { Printer, CheckSquare, Square, FileText, HelpCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const DOSSIER_QUESTIONS = [
  {
    q: 'Can I see the internal dealer reconditioning work order?',
    reason: 'Shows exactly what parts, brakes, or tires the dealer replaced before putting the car on the front lot.'
  },
  {
    q: 'What date did this car arrive on your lot?',
    reason: 'Inventory aged over 60 days incurs daily floorplan interest. Dealerships will discount significantly to move aged inventory.'
  },
  {
    q: 'Can I take this car to an independent shop for a Pre-Purchase Inspection (PPI)?',
    reason: 'A refusal is an immediate red flag. Reputable dealerships will always permit an off-site mechanic inspection.'
  },
  {
    q: 'Does this car come with two master key fobs?',
    reason: 'Modern fobs with transponder chips cost $350-$650 to program. Demand the second key before signing.'
  },
  {
    q: 'Are any dealer accessories or add-on packages included on this worksheet?',
    reason: 'Forces the salesperson to disclose non-factory markups (nitrogen, etching, protection packages) upfront.'
  }
];

const INSPECTION_POINTS = [
  'Check undercarriage & rocker panels for structural rust or corrosion',
  'Inspect tire tread depth (>4/32") and DOT date code (under 6 years old)',
  'Verify panel gap uniformity and look for paint overspray / tape lines',
  'Examine oil cap & dipstick (no milky coolant residue or dark sludge)',
  'Confirm transmission upshifts and downshifts smoothly without shudder',
  'Test brake pedal firmness; confirm no steering vibration during hard stop',
  'Verify all dashboard warning lights illuminate on ignition and turn off after crank',
  'Run AC cold test (under 60 sec) and heat core test (no sweet syrup smell)'
];

export default function TestDriveDossierWidget() {
  const [vehicleName, setVehicleName] = useState('2021 Toyota RAV4 XLE AWD');
  const [targetOtdBudget, setTargetOtdBudget] = useState(27500);
  const [sellerName, setSellerName] = useState('Metro Auto Mall');
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (idx: number) => {
    setCheckedItems(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 border border-teal-200/60 rounded-full text-teal-800 text-xs font-bold mb-2">
            <FileText size={14} className="text-teal-600" />
            <span>Field Buyer Worksheet</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Printable Test-Drive Dossier & Questions</h3>
          <p className="text-slate-500 text-sm mt-1">Take this checklist on your test drive. Print or save as PDF with your budget ceiling and questions dealers fear most.</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
        >
          <Printer size={16} />
          <span>Print / Save PDF Dossier</span>
        </button>
      </div>

      {/* Inputs Form */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Vehicle</label>
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Max Out-The-Door Budget ($)</label>
          <input
            type="number"
            value={targetOtdBudget}
            onChange={(e) => setTargetOtdBudget(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2]"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-slate-600 mb-1">Seller / Dealership</label>
          <input
            type="text"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#29abe2]"
          />
        </div>
      </div>

      {/* Printable Sheet Preview */}
      <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6">
        {/* Dossier Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-black text-[#29abe2] uppercase tracking-widest">CarMatrix Test-Drive Dossier</span>
            <h4 className="text-xl font-black text-slate-900">{vehicleName}</h4>
            <span className="text-xs text-slate-500 font-medium">{sellerName}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hard Budget Ceiling</span>
            <span className="text-2xl font-black text-slate-900">${targetOtdBudget.toLocaleString()} OTD</span>
          </div>
        </div>

        {/* 2-Column Section: Inspection Checklist & Dealer Questions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Test-Drive Inspection Checklist */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-emerald-600" />
              <span>8-Point Critical Test-Drive Checklist</span>
            </h5>
            <div className="space-y-2">
              {INSPECTION_POINTS.map((pt, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCheck(idx)}
                  className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-slate-200/80 cursor-pointer hover:bg-slate-100/60 transition-colors"
                >
                  <div className="mt-0.5 text-slate-400">
                    {checkedItems[idx] ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} />}
                  </div>
                  <span className={`text-xs ${checkedItems[idx] ? 'line-through text-slate-400' : 'text-slate-800 font-medium'}`}>
                    {pt}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Hard Questions to Ask the Dealer */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} className="text-amber-600" />
              <span>5 Questions Dealers Hope You Won't Ask</span>
            </h5>
            <div className="space-y-2">
              {DOSSIER_QUESTIONS.map((item, idx) => (
                <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                  <p className="text-xs font-bold text-slate-900">"{item.q}"</p>
                  <p className="text-[11px] text-slate-500 leading-snug">💡 {item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
