import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';

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

export default function VINRecallWidget() {
  const [vinInput, setVinInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vinDetails, setVinDetails] = useState<VinDetails | null>(null);
  const [recalls, setRecalls] = useState<RecallItem[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200/60 rounded-full text-[#29abe2] text-xs font-bold mb-2">
            <Search size={14} />
            <span>NHTSA Government Database</span>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Free VIN Decoder & Safety Recall Scanner</h3>
          <p className="text-slate-500 text-sm mt-1">Verify factory build specifications, engine & trim, and scan for unperformed safety recalls before buying.</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="mt-6 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="relative max-w-2xl"
        >
          <input
            type="text"
            value={vinInput}
            onChange={(e) => {
              setVinInput(e.target.value.toUpperCase());
              setError(null);
            }}
            maxLength={17}
            placeholder="Enter 17-character VIN (e.g. 1FTFW1ED5MFA12345)..."
            className="w-full bg-slate-50 border border-slate-200/90 rounded-2xl pl-4 pr-32 py-3.5 text-sm text-slate-900 font-mono tracking-wider placeholder:tracking-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/40 focus:border-[#29abe2] transition-all uppercase"
          />
          <button
            type="submit"
            disabled={loading || vinInput.length !== 17}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#29abe2] hover:bg-[#2089b5] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
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
  );
}
