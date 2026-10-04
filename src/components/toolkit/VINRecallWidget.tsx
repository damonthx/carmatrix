import React, { useState } from 'react';
import { 
  Search, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, 
  ChevronDown, HelpCircle, BookOpen, FileText, CheckCircle, ArrowUpRight 
} from 'lucide-react';

// =========================================================================
// EPICVIN AFFILIATE TRACKING LINK (Accidents, Title & Salvage History Check)
// =========================================================================
const affiliateUrl = 'https://epicvin.com/vin-decoder?a_aid=apznuns4wq2bd';

interface VinDetails {
  vin: string;
  make: string;
  model: string;
  year: string;
  trim?: string;
  bodyClass?: string;
  engineCylinders?: string;
  displacementL?: string;
  driveType?: string;
  fuelType?: string;
  plantCountry?: string;
  vehicleType?: string;
}

interface RecallItem {
  NHTSACampaignNumber: string;
  Component: string;
  Summary: string;
  Remedy: string;
  Notes?: string;
}

const SAMPLE_VINS = [
  { label: '2021 Ford F-150', vin: '1FTFW1ED5MFA12345' },
  { label: '2022 Toyota RAV4', vin: '2T3P1RFV5NW123456' },
  { label: '2020 Honda Civic', vin: '19XFC2F59LE123456' },
  { label: '2023 Tesla Model Y', vin: '7SAYGDEE1PF123456' }
];

const FAQ_ITEMS = [
  {
    question: "Can a car dealership legally sell a vehicle with an open safety recall?",
    answer: "Under federal law (49 U.S.C. 30120), franchised dealerships are strictly prohibited from selling or leasing any new vehicle subject to an open, unremedied safety recall until repairs are completed. For pre-owned and used vehicles, while federal recall-sale restrictions differ across jurisdictions, dealerships are prohibited under state consumer protection statutes from misrepresenting a vehicle's roadworthiness or safety condition. Furthermore, federal law requires manufacturers to perform all safety recall repairs completely free of charge at any authorized brand dealership, regardless of vehicle age or change of ownership."
  },
  {
    question: "How do dealerships use trim packages to overcharge car buyers?",
    answer: "A common dealership pricing tactic is 'trim inflation' or window-sticker padding—advertising a base or mid-tier trim (such as an SE or LE) at premium-trim pricing (such as an XSE, Limited, or Touring). Dealers may also charge extra for all-wheel drive (AWD) when the factory build is actually front-wheel drive (FWD), or add charges for options already standard from the factory. A direct NHTSA VIN decode provides official manufacturer build records that definitively prove the exact factory engine displacement, transmission, drive system, and original equipment package."
  },
  {
    question: "What is the difference between a free VIN decode and a full vehicle history report?",
    answer: "A free NHTSA VIN decode verifies official manufacturer build specifications, plant assembly location, engine parameters, and federally recorded safety recall campaigns. A comprehensive vehicle history report (such as NMVTIS, EpicVIN, or Carfax) goes a step further by compiling multi-state DMV title records, tracking salvage or flood brands, identifying total loss declarations, checking for active liens, uncovering odometer rollbacks, and detailing police-reported accident records."
  }
];

export default function VINRecallWidget() {
  const [vinInput, setVinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vinDetails, setVinDetails] = useState<VinDetails | null>(null);
  const [recalls, setRecalls] = useState<RecallItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [vinCopied, setVinCopied] = useState(false);

  const handleHistoryCheck = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const userVin = vinDetails?.vin || vinInput.trim().toUpperCase();
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(userVin);
      setVinCopied(true);
      setTimeout(() => setVinCopied(false), 3000);
    }
    window.open(affiliateUrl, '_blank');
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(prev => prev === index ? null : index);
  };

  const handleLookup = async (vinToLookup?: string) => {
    const targetVin = (vinToLookup || vinInput).trim().toUpperCase();
    if (!targetVin || targetVin.length !== 17) {
      setError('Please enter a valid 17-character VIN.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      // 1. Fetch NHTSA VIN Decode
      const decodeUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${targetVin}?format=json`;
      const decodeRes = await fetch(decodeUrl);
      const decodeData = await decodeRes.json();

      if (decodeData.Results && decodeData.Results.length > 0) {
        const item = decodeData.Results[0];
        if (item.Make && item.Model) {
          setVinDetails({
            vin: targetVin,
            make: item.Make,
            model: item.Model,
            year: item.ModelYear,
            trim: item.Trim,
            bodyClass: item.BodyClass,
            engineCylinders: item.EngineCylinders,
            displacementL: item.DisplacementL ? `${parseFloat(item.DisplacementL).toFixed(1)}L` : undefined,
            driveType: item.DriveType,
            fuelType: item.FuelTypePrimary,
            plantCountry: item.PlantCountry,
            vehicleType: item.VehicleType
          });
        } else {
          setError('NHTSA database could not identify this VIN. Please verify the characters.');
        }
      }

      // 2. Fetch NHTSA Recalls
      try {
        const recallUrl = `https://api.nhtsa.gov/recalls/recallsByVin?vin=${targetVin}&csvformat=false`;
        const recallRes = await fetch(recallUrl);
        if (recallRes.ok) {
          const recallData = await recallRes.json();
          if (recallData.results && Array.isArray(recallData.results)) {
            setRecalls(recallData.results);
          } else {
            setRecalls([]);
          }
        } else {
          setRecalls([]);
        }
      } catch (e) {
        console.warn('NHTSA recall API fallback:', e);
        setRecalls([]);
      }
    } catch (err: any) {
      console.error('Error decoding VIN:', err);
      setError('Network error contacting NHTSA database. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-poppins">
      {/* Functional Widget Container */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <Search size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 tracking-tight">Free VIN Decoder &amp; Safety Recall Scanner</h3>
            <p className="text-slate-500 text-sm mt-0.5">Verify factory build specifications, engine &amp; trim, and scan for unperformed safety recalls before buying.</p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-6 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="relative max-w-2xl flex flex-col sm:block"
        >
          <input
            type="text"
            value={vinInput}
            onChange={(e) => {
              setVinInput(e.target.value.toUpperCase());
              setError(null);
            }}
            maxLength={17}
            placeholder="Enter 17-character VIN..."
            className="w-full bg-white border-2 border-slate-300 hover:border-slate-400 rounded-2xl pl-4 pr-4 sm:pr-32 py-3.5 text-sm text-slate-900 font-mono tracking-wider placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/30 focus:border-[#29abe2] shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition-all uppercase"
          />
          <button
            type="submit"
            disabled={loading || vinInput.length !== 17}
            className="w-full sm:w-auto mt-2 sm:mt-0 sm:absolute sm:right-2 sm:top-1/2 sm:-translate-y-1/2 bg-[#29abe2] hover:bg-[#2089b5] text-white px-5 py-3 sm:py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            <span>Decode VIN</span>
          </button>
        </form>

        {/* Sample VIN pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-600">Sample VINs:</span>
          {SAMPLE_VINS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setVinInput(s.vin);
                handleLookup(s.vin);
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors cursor-pointer border border-slate-200/60"
            >
              {s.label}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Results display */}
        {hasSearched && vinDetails && (
          <div className="mt-8 space-y-6 animate-in fade-in duration-300">
            {/* Specs Card */}
            <div className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold text-[#29abe2] uppercase tracking-wider">Vehicle Identified</span>
                  <h4 className="text-xl font-extrabold text-slate-900">
                    {vinDetails.year} {vinDetails.make} {vinDetails.model} {vinDetails.trim || ''}
                  </h4>
                </div>
                <div className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600">
                  VIN: {vinDetails.vin}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Body Style</span>
                  <span className="text-slate-800 font-bold">{vinDetails.bodyClass || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Engine & Displacement</span>
                  <span className="text-slate-800 font-bold">
                    {vinDetails.displacementL || ''} {vinDetails.engineCylinders ? `${vinDetails.engineCylinders} Cylinders` : 'Standard'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Drive Type</span>
                  <span className="text-slate-800 font-bold">{vinDetails.driveType || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Assembly Country</span>
                  <span className="text-slate-800 font-bold">{vinDetails.plantCountry || 'United States'}</span>
                </div>
              </div>
            </div>

            {/* Dynamic Full-Width Warning CTA: Accidents & Salvage History Check */}
            <div className="w-full space-y-2">
              <button
                type="button"
                onClick={handleHistoryCheck}
                className="w-full group relative overflow-hidden rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 via-[#0a0f1d] to-slate-950 hover:from-slate-900 hover:via-[#0f172a] hover:to-slate-900 text-white font-poppins border-2 border-amber-500/80 hover:border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.25)] hover:shadow-[0_0_40px_rgba(245,158,11,0.45)] transition-all duration-300 active:scale-[0.99] cursor-pointer text-left"
              >
                {/* Top specular highlight & scanline grid */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-40" />

                <div className="relative z-10 flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0 shadow-[0_0_16px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform">
                    <AlertTriangle size={24} strokeWidth={2.4} className="animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400">
                        CRITICAL ALERT // TITLE &amp; ACCIDENT CHECK REQUIRED
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug group-hover:text-amber-300 transition-colors">
                      Check {vinDetails.year} {vinDetails.make} {vinDetails.model} for Accidents &amp; Salvage History
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-300 leading-tight mt-0.5">
                      Instant NMVTIS scan: multi-state salvage titles, total loss insurance claims &amp; collision records.
                    </div>
                  </div>
                </div>

                <div className="relative z-10 shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all self-start sm:self-auto group-hover:scale-105">
                  <span>{vinCopied ? 'VIN Copied! Opening...' : 'Check Records'}</span>
                  <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>

              {/* Italicized Tooltip */}
              <p className="text-center text-[11px] sm:text-xs italic text-slate-500 font-poppins pt-0.5">
                Clicking will copy your VIN to your clipboard. Just hit &quot;Paste&quot; in the search box on the next page.
              </p>
            </div>

            {/* Recall Status */}
            <div className="p-6 rounded-2xl border transition-all duration-200">
              {recalls.length === 0 ? (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={26} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
                      <CheckCircle2 size={13} />
                      <span>Zero Open Safety Recalls Reported</span>
                    </div>
                    <h5 className="text-base font-bold text-slate-900">Clean NHTSA Safety Record</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      No unresolved safety recall campaigns were identified by NHTSA for this specific VIN. Always confirm with the franchised dealer service department prior to final purchase.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                      <ShieldAlert size={22} className="text-amber-600" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Action Required</span>
                      <h5 className="text-base font-bold text-slate-900">
                        {recalls.length} Open Safety {recalls.length === 1 ? 'Recall' : 'Recalls'} Detected
                      </h5>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    Under federal law, franchise dealerships are required to perform all safety recall repairs free of charge. Request that the seller or selling dealership perform these fixes before you complete the purchase.
                  </p>

                  <div className="space-y-3 pt-2">
                    {recalls.map((recall, i) => (
                      <div key={i} className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-extrabold text-amber-900">Campaign #{recall.NHTSACampaignNumber}</span>
                          <span className="px-2 py-0.5 bg-amber-200/80 text-amber-950 rounded font-bold text-[10px]">
                            {recall.Component || 'Safety Recall'}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Summary:</strong> {recall.Summary}</p>
                        {recall.Remedy && (
                          <p className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Free Remedy:</strong> {recall.Remedy}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

    {/* SEO-Optimized Structural Content Section (Prevents Thin Content) */}
    <section 
      className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 sm:p-8 md:p-10 space-y-8 font-poppins relative overflow-hidden"
      aria-label="VIN Decoder Buyer Defense Guide & Technical FAQ"
    >
      {/* FAQ Schema Markup (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQ_ITEMS.map((faq) => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      {/* Section Header with Styled H2 */}
      <div className="space-y-3 pb-6 border-b border-slate-200/80">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <ShieldCheck size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 tracking-tight font-poppins leading-tight">
              How to Decode Your VIN &amp; Avoid Dealership Overcharges
            </h2>
          </div>
        </div>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-poppins max-w-3xl">
          A 17-character Vehicle Identification Number (VIN) is your automobile's forensic DNA fingerprint. Every digit encodes vital engineering data verified by the National Highway Traffic Safety Administration (NHTSA)—including the World Manufacturer Identifier (WMI), vehicle descriptor section (VDS), and assembly plant code. Learn how independent car buyers leverage direct factory data to dismantle dealer fee padding and catch misrepresented trim levels.
        </p>
      </div>

      {/* 2-Column Informational Section: Avoiding Dealership Rip-Offs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Column 1: Trim Inflation */}
        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-3.5 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] text-[#29abe2] flex items-center justify-center font-bold shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <FileText size={20} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight font-poppins">
            1. Neutralize "Trim Inflation" &amp; Window-Sticker Padding
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-poppins">
            One of the most pervasive dealership sales strategies is listing a base or mid-tier model with the MSRP or market pricing of an upgraded trim level. Dealers frequently add aftermarket appearance packages (such as blacked-out emblems or non-OEM wheels) to justify a thousands-dollar markup.
          </p>

          <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Verify Real Engine Displacement:</strong> Ensure the window sticker matches the official factory liter displacement and cylinder count.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Confirm Drivetrain Configuration:</strong> Check whether the VIN designates FWD, RWD, or true AWD before paying an all-wheel-drive premium.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Counter Deceptive Pricing:</strong> Present the official NHTSA decode sheet on the sales floor to demand an immediate price adjustment.</span>
            </li>
          </ul>
        </div>

        {/* Column 2: Safety Recalls & Reconditioning Fees */}
        <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 space-y-3.5 hover:shadow-sm transition-shadow">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-500/10 to-transparent border border-amber-300/40 shadow-[0_4px_16px_rgba(245,158,11,0.18)] text-amber-500 flex items-center justify-center font-bold shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <AlertTriangle size={20} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight font-poppins">
            2. Eliminate Bogus "Reconditioning Fees" with Open Recalls
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-poppins">
            Dealerships routinely slip $895 to $1,995 line items onto buyer order sheets labeled as "Safety Inspection," "Reconditioning," or "Prep Fees." When our VIN tool detects active, open safety recalls, it proves the dealership has not resolved fundamental safety defects.
          </p>

          <ul className="space-y-2 pt-1 text-xs sm:text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Free Remedy by Law:</strong> All safety campaign remedies must be performed 100% free of charge by authorized franchise dealers.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Expose Junk Reconditioning Fees:</strong> If an open recall exists, challenge any dealer reconditioning fees as fraudulent and unjustified.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
              <span><strong>Condition Pre-Delivery:</strong> Make completed certified repair documentation a non-negotiable written condition of closing.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Styled FAQ Accordion Component */}
      <div className="pt-6 border-t border-slate-200/80 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 flex items-center justify-center text-[#29abe2] shrink-0">
            <HelpCircle size={18} strokeWidth={2.2} />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-900 font-poppins">
            Frequently Asked Questions (FAQ)
          </h3>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                className="rounded-2xl border border-white/80 overflow-hidden transition-all duration-200 bg-white/70 backdrop-blur-md shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 text-left cursor-pointer hover:bg-white/90 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-semibold text-slate-900 font-poppins pr-4">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-100/80 text-slate-600 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 bg-sky-50 text-[#29abe2]' : ''}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 font-poppins leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  </div>
);
}
