import React, { useState } from 'react';
import { MapPin, ShieldCheck, AlertCircle, Info, Search, DollarSign, Scale } from 'lucide-react';

interface StateData {
  code: string;
  name: string;
  salesTax: number;
  avgDocFee: number;
  docFeeCap: number | null;
  tradeInTaxCredit: boolean;
  notes: string;
}

const STATES_DATA: StateData[] = [
  { code: 'AL', name: 'Alabama', salesTax: 2.0, avgDocFee: 485, docFeeCap: null, tradeInTaxCredit: true, notes: 'State auto tax is 2%; city and county taxes can add up to an additional 3-4%.' },
  { code: 'AK', name: 'Alaska', salesTax: 0.0, avgDocFee: 200, docFeeCap: null, tradeInTaxCredit: false, notes: 'No state sales tax. Some municipalities levy a local sales tax between 2% and 7%.' },
  { code: 'AZ', name: 'Arizona', salesTax: 5.6, avgDocFee: 499, docFeeCap: null, tradeInTaxCredit: true, notes: 'Trade-in value is fully deductible from vehicle sales tax calculation.' },
  { code: 'AR', name: 'Arkansas', salesTax: 6.5, avgDocFee: 150, docFeeCap: 129, tradeInTaxCredit: true, notes: 'Doc fees are strictly capped by state law at $129.' },
  { code: 'CA', name: 'California', salesTax: 7.25, avgDocFee: 85, docFeeCap: 85, tradeInTaxCredit: false, notes: 'Doc fee legally capped at $85. CA does NOT offer trade-in tax credit—you pay tax on the gross vehicle price.' },
  { code: 'CO', name: 'Colorado', salesTax: 2.9, avgDocFee: 599, docFeeCap: null, tradeInTaxCredit: true, notes: 'Trade-in tax credit applies to state portion (2.9%) and most local jurisdictions.' },
  { code: 'CT', name: 'Connecticut', salesTax: 6.35, avgDocFee: 525, docFeeCap: null, tradeInTaxCredit: true, notes: 'Vehicles over $50,000 carry a luxury sales tax rate of 7.75%.' },
  { code: 'DE', name: 'Delaware', salesTax: 4.25, avgDocFee: 375, docFeeCap: null, tradeInTaxCredit: true, notes: 'No traditional sales tax; charges a 4.25% document fee on purchase value.' },
  { code: 'FL', name: 'Florida', salesTax: 6.0, avgDocFee: 995, docFeeCap: null, tradeInTaxCredit: true, notes: 'Highest doc fees in the US with no legal cap. Always negotiate vehicle price downward to offset high dealer doc fees.' },
  { code: 'GA', name: 'Georgia', salesTax: 6.6, avgDocFee: 590, docFeeCap: null, tradeInTaxCredit: true, notes: 'TAVT (Title Ad Valorem Tax) is 6.6% one-time tax replacing annual property tax.' },
  { code: 'HI', name: 'Hawaii', salesTax: 4.0, avgDocFee: 350, docFeeCap: null, tradeInTaxCredit: false, notes: 'General Excise Tax (GET) applies instead of conventional sales tax.' },
  { code: 'ID', name: 'Idaho', salesTax: 6.0, avgDocFee: 290, docFeeCap: null, tradeInTaxCredit: true, notes: 'Trade-in tax credit is allowed when purchasing from a licensed dealer.' },
  { code: 'IL', name: 'Illinois', salesTax: 6.25, avgDocFee: 347, docFeeCap: 358, tradeInTaxCredit: true, notes: 'Doc fee is capped by state formula adjusted annually for CPI (~$358).' },
  { code: 'IN', name: 'Indiana', salesTax: 7.0, avgDocFee: 200, docFeeCap: 200, tradeInTaxCredit: true, notes: 'State law caps doc fees at $200.' },
  { code: 'IA', name: 'Iowa', salesTax: 5.0, avgDocFee: 180, docFeeCap: null, tradeInTaxCredit: true, notes: 'One-time registration fee of 5% applies at titling.' },
  { code: 'KS', name: 'Kansas', salesTax: 6.5, avgDocFee: 395, docFeeCap: null, tradeInTaxCredit: true, notes: 'Local municipal rates can bring combined sales tax to 8-10%.' },
  { code: 'KY', name: 'Kentucky', salesTax: 6.0, avgDocFee: 495, docFeeCap: null, tradeInTaxCredit: true, notes: 'Motor vehicle usage tax of 6% is assessed on vehicle retail value.' },
  { code: 'LA', name: 'Louisiana', salesTax: 4.45, avgDocFee: 425, docFeeCap: 200, tradeInTaxCredit: true, notes: 'State regulates doc fees for consumer protection.' },
  { code: 'ME', name: 'Maine', salesTax: 5.5, avgDocFee: 450, docFeeCap: null, tradeInTaxCredit: true, notes: 'Trade-in credit available when purchasing from a licensed dealer.' },
  { code: 'MD', name: 'Maryland', salesTax: 6.0, avgDocFee: 500, docFeeCap: 500, tradeInTaxCredit: true, notes: 'Doc fee is capped by statute at $500.' },
  { code: 'MA', name: 'Massachusetts', salesTax: 6.25, avgDocFee: 450, docFeeCap: null, tradeInTaxCredit: true, notes: 'Sales tax is calculated on the net purchase price after dealer trade-in credit.' },
  { code: 'MI', name: 'Michigan', salesTax: 6.0, avgDocFee: 260, docFeeCap: 260, tradeInTaxCredit: true, notes: 'Doc fee is capped at 5% of vehicle price or state statutory limit (~$260).' },
  { code: 'MN', name: 'Minnesota', salesTax: 6.875, avgDocFee: 125, docFeeCap: 125, tradeInTaxCredit: true, notes: 'Doc fee capped by law at $125.' },
  { code: 'MS', name: 'Mississippi', salesTax: 5.0, avgDocFee: 425, docFeeCap: null, tradeInTaxCredit: true, notes: 'Standard state automotive tax is 5%.' },
  { code: 'MO', name: 'Missouri', salesTax: 4.225, avgDocFee: 499, docFeeCap: 565, tradeInTaxCredit: true, notes: 'Doc fee capped at $565 by state law. You have 180 days to claim trade-in tax credit.' },
  { code: 'MT', name: 'Montana', salesTax: 0.0, avgDocFee: 300, docFeeCap: null, tradeInTaxCredit: false, notes: '0% sales tax on vehicle purchases.' },
  { code: 'NE', name: 'Nebraska', salesTax: 5.5, avgDocFee: 295, docFeeCap: null, tradeInTaxCredit: true, notes: 'Full trade-in tax credit allowed on difference.' },
  { code: 'NV', name: 'Nevada', salesTax: 8.25, avgDocFee: 495, docFeeCap: null, tradeInTaxCredit: true, notes: 'High county-level combined sales tax averaging 8.25%.' },
  { code: 'NH', name: 'New Hampshire', salesTax: 0.0, avgDocFee: 350, docFeeCap: null, tradeInTaxCredit: false, notes: 'No sales tax on vehicle purchases.' },
  { code: 'NJ', name: 'New Jersey', salesTax: 6.625, avgDocFee: 495, docFeeCap: null, tradeInTaxCredit: true, notes: 'Zero emissions battery electric vehicles (EVs) are 100% exempt from NJ sales tax.' },
  { code: 'NM', name: 'New Mexico', salesTax: 4.0, avgDocFee: 375, docFeeCap: null, tradeInTaxCredit: true, notes: 'Motor Vehicle Excise Tax is 4% on net purchase price.' },
  { code: 'NY', name: 'New York', salesTax: 4.0, avgDocFee: 175, docFeeCap: 175, tradeInTaxCredit: true, notes: 'Doc fee strictly capped at $175. Total sales tax ranges 8-8.875% including county surcharges.' },
  { code: 'NC', name: 'North Carolina', salesTax: 3.0, avgDocFee: 699, docFeeCap: null, tradeInTaxCredit: true, notes: 'Highway Use Tax (HUT) is 3% capped at maximum $2,000 for passenger cars.' },
  { code: 'ND', name: 'North Dakota', salesTax: 5.0, avgDocFee: 299, docFeeCap: null, tradeInTaxCredit: true, notes: 'Motor vehicle excise tax is 5%.' },
  { code: 'OH', name: 'Ohio', salesTax: 5.75, avgDocFee: 250, docFeeCap: 250, tradeInTaxCredit: true, notes: 'Doc fee is capped by state law at the lesser of $250 or 10% of vehicle price.' },
  { code: 'OK', name: 'Oklahoma', salesTax: 4.5, avgDocFee: 395, docFeeCap: null, tradeInTaxCredit: true, notes: 'Motor vehicle excise tax is 3.25% for new, $20 + 3.25% on used.' },
  { code: 'OR', name: 'Oregon', salesTax: 0.5, avgDocFee: 115, docFeeCap: 150, tradeInTaxCredit: false, notes: 'Doc fee capped at $115 ($150 with electronic filing). 0.5% corporate vehicle privilege tax.' },
  { code: 'PA', name: 'Pennsylvania', salesTax: 6.0, avgDocFee: 449, docFeeCap: 449, tradeInTaxCredit: true, notes: 'Doc fee capped by state formula ($449 with online titling).' },
  { code: 'RI', name: 'Rhode Island', salesTax: 7.0, avgDocFee: 220, docFeeCap: null, tradeInTaxCredit: true, notes: 'Sales tax is 7% with full trade-in allowance deduction.' },
  { code: 'SC', name: 'South Carolina', salesTax: 5.0, avgDocFee: 495, docFeeCap: null, tradeInTaxCredit: true, notes: 'Infrastructure Maintenance Fee (IMF) is 5% capped at maximum $500.' },
  { code: 'SD', name: 'South Dakota', salesTax: 4.0, avgDocFee: 175, docFeeCap: null, tradeInTaxCredit: true, notes: '4% motor vehicle excise tax.' },
  { code: 'TN', name: 'Tennessee', salesTax: 7.0, avgDocFee: 595, docFeeCap: null, tradeInTaxCredit: true, notes: 'Local option tax applies to first $1,600 plus single article tax.' },
  { code: 'TX', name: 'Texas', salesTax: 6.25, avgDocFee: 150, docFeeCap: null, tradeInTaxCredit: true, notes: 'Standard auto sales tax is 6.25%. Standard Presumptive Value (SPV) applies on private party sales.' },
  { code: 'UT', name: 'Utah', salesTax: 6.85, avgDocFee: 299, docFeeCap: null, tradeInTaxCredit: true, notes: 'Full trade-in tax credit applies to state sales tax portion.' },
  { code: 'VT', name: 'Vermont', salesTax: 6.0, avgDocFee: 250, docFeeCap: null, tradeInTaxCredit: true, notes: '6% purchase and use tax.' },
  { code: 'VA', name: 'Virginia', salesTax: 4.15, avgDocFee: 699, docFeeCap: null, tradeInTaxCredit: false, notes: 'VA does NOT allow trade-in credit—tax of 4.15% is paid on gross purchase price.' },
  { code: 'WA', name: 'Washington', salesTax: 6.5, avgDocFee: 200, docFeeCap: 200, tradeInTaxCredit: true, notes: 'Doc fee capped at $200 by state statute.' },
  { code: 'WV', name: 'West Virginia', salesTax: 6.0, avgDocFee: 499, docFeeCap: null, tradeInTaxCredit: true, notes: '6% title privilege tax with trade-in deduction.' },
  { code: 'WI', name: 'Wisconsin', salesTax: 5.0, avgDocFee: 299, docFeeCap: null, tradeInTaxCredit: true, notes: 'Trade-in value is fully deductible from taxable base.' },
  { code: 'WY', name: 'Wyoming', salesTax: 4.0, avgDocFee: 300, docFeeCap: null, tradeInTaxCredit: true, notes: '4% base state tax plus local county option tax.' }
];

export default function StateFeeGuideWidget() {
  const [selectedStateCode, setSelectedStateCode] = useState('CA');
  const [searchQuery, setSearchQuery] = useState('');

  const selectedState = STATES_DATA.find(s => s.code === selectedStateCode) || STATES_DATA[4];

  const filteredStates = STATES_DATA.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-emerald-800 text-xs font-bold mb-2">
            <Scale size={14} className="text-emerald-600" />
            <span>50-State Buyer Rights Directory</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">State Doc Fee & Trade-In Tax Credit Guide</h3>
          <p className="text-slate-500 text-sm mt-1">Look up statutory documentation fee limits, tax credit rules, and buyer protection policies in your state.</p>
        </div>

        {/* State Quick Selector */}
        <div className="flex items-center gap-2">
          <select
            value={selectedStateCode}
            onChange={(e) => setSelectedStateCode(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-[#29abe2] cursor-pointer"
          >
            {STATES_DATA.map(s => (
              <option key={s.code} value={s.code}>{s.name} ({s.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected State Overview Cards */}
      <div className="mt-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Doc Fee Metric */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Dealer Doc Fee</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                ${selectedState.avgDocFee}
              </span>
              <span className="text-xs text-slate-500 font-medium">avg</span>
            </div>
            <div className="text-xs font-semibold">
              {selectedState.docFeeCap !== null ? (
                <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full inline-block border border-emerald-200">
                  Capped by law at ${selectedState.docFeeCap}
                </span>
              ) : (
                <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full inline-block border border-amber-200">
                  Uncapped (Negotiate strongly)
                </span>
              )}
            </div>
          </div>

          {/* Trade-In Tax Credit Metric */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Trade-In Tax Credit</span>
            <div className="text-2xl font-black text-slate-900">
              {selectedState.tradeInTaxCredit ? (
                <span className="text-emerald-600 flex items-center gap-1.5">
                  <ShieldCheck size={24} /> Allowed
                </span>
              ) : (
                <span className="text-rose-600 flex items-center gap-1.5">
                  <AlertCircle size={24} /> Not Allowed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              {selectedState.tradeInTaxCredit 
                ? 'Only pay sales tax on difference between new vehicle & trade-in value.'
                : 'You pay sales tax on the full gross purchase price of the new vehicle.'}
            </p>
          </div>

          {/* Base Sales Tax Metric */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Base Auto Sales Tax</span>
            <div className="text-3xl font-black text-slate-900">
              {selectedState.salesTax.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-500 leading-snug">
              Baseline state rate. Local counties and cities may add 1%–4% surcharges.
            </p>
          </div>
        </div>

        {/* State-specific Advisory Box */}
        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3.5 text-xs text-sky-950">
          <Info size={20} className="text-[#29abe2] shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-extrabold text-sm block text-slate-900">{selectedState.name} Automotive Buyer Guidance</span>
            <p className="text-slate-700">{selectedState.notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
