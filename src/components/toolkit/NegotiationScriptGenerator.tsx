import React, { useState } from 'react';
import { Terminal, Copy, Check, ShieldCheck, Mail, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

export interface NegotiationScriptProps {
  vehicleName: string;
  vehiclePrice: number;
  outTheDoorTotal: number;
  cleanTargetPrice: number;
  stateTax: number;
  dmvFees: number;
  docFee: number;
  junkTotal: number;
  junkItemNames: string[];
  salespersonName?: string;
  dealershipName?: string;
  buyerName?: string;
}

export default function NegotiationScriptGenerator({
  vehicleName,
  vehiclePrice,
  outTheDoorTotal,
  cleanTargetPrice,
  stateTax,
  dmvFees,
  docFee,
  junkTotal,
  junkItemNames,
  salespersonName = '',
  dealershipName = '',
  buyerName = '',
}: NegotiationScriptProps) {
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedVehicle = vehicleName.trim() || 'Vehicle';
  const recipient = salespersonName.trim() 
    ? `${salespersonName.trim()} & Sales Management Team` 
    : 'Sales Management Team';
  const dealer = dealershipName.trim() ? dealershipName.trim() : 'your dealership';
  const buyer = buyerName.trim() ? buyerName.trim() : '[Your Full Name]';

  // Construct the professional dealership counter-offer email
  const scriptContent = `Subject: Formal Out-The-Door Purchase Offer: ${formattedVehicle}

Dear ${recipient},

Thank you for providing the quote worksheet for the ${formattedVehicle} at ${dealer}.

I have completed an independent forensic audit of this vehicle's pricing and mandatory statutory fees. Based on current local transaction comps and official state fee schedules, I am submitting a binding, ready-to-execute Out-The-Door (OTD) purchase offer.

============================================================
FORMAL OUT-THE-DOOR (OTD) COUNTER-OFFER: $${cleanTargetPrice.toLocaleString()}
============================================================
• Agreed Vehicle Selling Price: $${vehiclePrice.toLocaleString()}
• Mandatory State & Local Sales Tax: $${stateTax.toLocaleString()}
• Government DMV Title & License Registration: $${dmvFees.toLocaleString()}
• Discretionary Dealer Documentation (Doc) Fee: $${docFee.toLocaleString()}
------------------------------------------------------------
• Net Binding Out-The-Door Total: $${cleanTargetPrice.toLocaleString()}
============================================================

${junkTotal > 0 ? `ITEMIZED ADD-ON WAIVER REQUEST:
I respectfully request that the dealer-installed accessory and protection packages totaling $${junkTotal.toLocaleString()} be completely removed from the purchase agreement:
${junkItemNames.length > 0 ? junkItemNames.map(name => ` - ${name}`).join('\n') : ' - Dealer Protection / Accessory Packages'}

I will not be utilizing these auxiliary services and cannot accept vehicle delivery with these items billed.\n\n` : ''}FINANCING & CLOSING TIMELINE:
I am pre-approved for financing / prepared with verified funds and ready to submit a deposit and sign purchase contracts within 24 hours of receiving a clean, revised buyer's order reflecting $${cleanTargetPrice.toLocaleString()} Out-The-Door with zero added charges.

If this offer works for your management team, please reply directly with the updated purchase agreement or contact me directly to finalize delivery.

Thank you for your time and professional transparency.

Sincerely,
${buyer}`;

  const handleGenerate = () => {
    setIsGenerated(true);
    // Smooth scroll down to the terminal if needed
    setTimeout(() => {
      const el = document.getElementById('secure-script-terminal');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="mt-8 pt-8 border-t border-slate-200/80 font-poppins">
      {/* Trigger CTA Card when not generated */}
      {!isGenerated ? (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3.5 max-w-xl">
            <div className="w-10 h-10 rounded-xl bg-[#29abe2]/15 border border-[#29abe2]/30 flex items-center justify-center text-[#29abe2] shrink-0">
              <Mail size={18} strokeWidth={2.2} />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-base font-semibold text-white font-poppins tracking-tight">
                Counter-Offer Email Generator
              </h4>
              <p className="text-xs text-slate-400 font-poppins leading-relaxed">
                Generate a ready-to-send purchase offer with your target <strong className="text-white">${cleanTargetPrice.toLocaleString()}</strong> OTD price.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer font-poppins shadow-sm"
            >
              <Send size={14} />
              <span>Generate Email Offer</span>
            </button>
          </div>
        </div>
      ) : (
        /* Message Preview Component */
        <div id="secure-script-terminal" className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-[#29abe2] shrink-0">
                <Mail size={16} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 font-poppins">
                  Negotiation Counter-Offer
                </h4>
                <p className="text-xs text-slate-500 font-poppins">
                  Calibrated for dealership sales management.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh with current calculator inputs"
              >
                <RefreshCw size={12} />
                <span>Sync</span>
              </button>

              <button
                onClick={handleCopy}
                className={`text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#29abe2] hover:bg-[#2089b5] text-white'
                }`}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Script Display Window */}
          <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
            {/* Header Bar */}
            <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="text-xs font-bold text-slate-300">
                Formal Purchase Offer
              </span>

              <span className="text-[11px] text-slate-400 font-medium">
                Target OTD: ${cleanTargetPrice.toLocaleString()}
              </span>
            </div>

            {/* Injected Variables Status Bar */}
            <div className="px-4 py-2 bg-slate-900/40 border-b border-slate-800/60 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-md bg-sky-950/60 text-sky-300 border border-sky-800/40 font-medium">
                Vehicle: {formattedVehicle}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
                Taxes &amp; Fees: ${(stateTax + dmvFees + docFee).toLocaleString()}
              </span>
              {junkTotal > 0 && (
                <span className="px-2 py-0.5 rounded-md bg-rose-950/60 text-rose-300 border border-rose-800/40 font-medium">
                  Add-Ons Removed: -${junkTotal.toLocaleString()}
                </span>
              )}
            </div>

            {/* Script Body Content */}
            <div className="p-4 sm:p-5 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto max-h-[380px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono font-medium">
                {scriptContent}
              </pre>
            </div>

            {/* Footer Bar */}
            <div className="px-4 py-2.5 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Ready to paste into email or web inquiry forms.</span>
              </span>

              <button
                onClick={handleCopy}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
