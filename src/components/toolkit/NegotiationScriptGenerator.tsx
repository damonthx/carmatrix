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
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-5 text-white">
          <div className="flex items-center gap-3.5 max-w-xl">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/10 to-transparent border border-emerald-300/40 shadow-[0_4px_16px_rgba(16,185,129,0.18)] flex items-center justify-center text-[#00ff88] shrink-0">
              <Terminal size={20} strokeWidth={2.2} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg sm:text-xl font-semibold text-white font-poppins tracking-tight">
                Negotiation Script Generator
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 font-poppins leading-relaxed">
                Inject your calculated <strong className="text-white">${cleanTargetPrice.toLocaleString()}</strong> clean OTD price, verified state sales tax (<strong className="text-white">${stateTax.toLocaleString()}</strong>), and vehicle parameters directly into a tactical email template for dealership sales managers.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={handleGenerate}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] via-sky-400 to-[#00ff88] text-slate-950 font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_28px_rgba(0,255,136,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer font-poppins"
            >
              <Terminal size={17} strokeWidth={2.2} />
              <span>Generate Dealer Email Script</span>
            </button>
          </div>
        </div>
      ) : (
        /* Secure Message Terminal Component */
        <div id="secure-script-terminal" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/10 to-transparent border border-emerald-300/40 shadow-[0_4px_16px_rgba(16,185,129,0.18)] flex items-center justify-center text-[#00ff88] shrink-0">
                <Terminal size={18} strokeWidth={2.2} />
              </div>
              <div>
                <h4 className="text-base font-semibold text-slate-900 font-poppins">
                  Negotiation Script Generator
                </h4>
                <p className="text-xs text-slate-500 font-poppins">
                  Official Out-The-Door counter-offer calibrated for dealership management.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleGenerate}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                title="Refresh with current calculator inputs"
              >
                <RefreshCw size={13} />
                <span>Sync Inputs</span>
              </button>

              <button
                onClick={handleCopy}
                className={`text-xs font-bold px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
                  copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-[#29abe2] hover:bg-[#2089b5] text-white shadow-[#29abe2]/20'
                }`}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>

          {/* Terminal Shell Window */}
          <div className="rounded-2xl overflow-hidden bg-[#040711] border border-slate-800 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
            {/* Terminal Window Header Bar */}
            <div className="px-4 py-3 bg-[#0a0f1d] border-b border-slate-800/80 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-slate-500 ml-2">|</span>
                <div className="flex items-center gap-1.5 text-[#00ff88] text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                  <span>SECURE_TERMINAL // DISPATCH PROTOCOL v2.4</span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck size={13} className="text-[#00f0ff]" />
                <span className="text-slate-400">ENCRYPTED COUNTER-OFFER BUFFER</span>
              </div>
            </div>

            {/* Injected Variables Status Bar */}
            <div className="px-4 py-2.5 bg-[#070c18] border-b border-slate-800/60 flex flex-wrap items-center gap-2 text-[10.5px] font-mono">
              <span className="px-2 py-0.5 rounded bg-sky-950/80 text-[#00f0ff] border border-sky-500/30">
                VEHICLE: {formattedVehicle}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-[#00ff88] border border-emerald-500/30">
                TARGET OTD: ${cleanTargetPrice.toLocaleString()}
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                STATE TAX: ${stateTax.toLocaleString()}
              </span>
              {junkTotal > 0 && (
                <span className="px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/30">
                  JUNK REMOVED: -${junkTotal.toLocaleString()}
                </span>
              )}
            </div>

            {/* Terminal Body Content */}
            <div className="p-4 sm:p-6 font-mono text-xs sm:text-[13px] text-slate-200 leading-relaxed overflow-x-auto selection:bg-[#00f0ff]/30 selection:text-white max-h-[460px] overflow-y-auto">
              <pre className="whitespace-pre-wrap font-mono font-medium">
                {scriptContent}
              </pre>
            </div>

            {/* Terminal Footer Bar */}
            <div className="px-4 py-3 bg-[#0a0f1d] border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-slate-400">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#00ff88]" />
                <span>Ready to paste directly into Gmail, Outlook, or dealer web inquiry forms.</span>
              </span>

              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-[#00ff88] font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
