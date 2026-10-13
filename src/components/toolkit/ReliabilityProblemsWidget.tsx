import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle2, Loader2, 
  ChevronDown, Car, Wrench, Search, 
  FileText, Check, Info, AlertOctagon
} from 'lucide-react';
import { 
  getMakes, 
  getModelsForMakeYear, 
  decodeVinVehicle, 
  getVehicleReliabilityReport,
  ReliabilityReport,
  NHTSAVinDecodedVehicle
} from '../../services/nhtsa';

interface ReliabilityProblemsWidgetProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  initialVin?: string;
  initialYear?: number;
  initialMake?: string;
  initialModel?: string;
}

const SAMPLE_VEHICLES = [
  { label: '2017 Toyota Corolla', year: 2017, make: 'Toyota', model: 'Corolla' },
  { label: '2019 Ford F-150', year: 2019, make: 'Ford', model: 'F-150' },
  { label: '2025 Honda Civic', year: 2025, make: 'Honda', model: 'Civic' },
  { label: '2020 Honda Civic (VIN)', vin: '19XFC2F59LE123456' }
];

// Available model years for dropdown (current year down to 1995)
const MODEL_YEARS = Array.from({ length: new Date().getFullYear() - 1994 }, (_, i) => new Date().getFullYear() + 1 - i);

export default function ReliabilityProblemsWidget({
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  initialVin = '',
  initialYear,
  initialMake = '',
  initialModel = ''
}: ReliabilityProblemsWidgetProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isToolOpen = isControlled ? controlledOpen : internalOpen;

  const toggleToolOpen = () => {
    if (onToggle) onToggle(!isToolOpen);
    if (!isControlled) setInternalOpen(!isToolOpen);
  };

  // Mode: 'manual' or 'vin'
  const [lookupMode, setLookupMode] = useState<'manual' | 'vin'>('manual');

  // Manual Form States
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || 2017);
  const [selectedMake, setSelectedMake] = useState<string>(initialMake || 'Toyota');
  const [selectedModel, setSelectedModel] = useState<string>(initialModel || 'Corolla');
  const [makesList, setMakesList] = useState<string[]>([]);
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState<boolean>(false);

  // VIN Form States
  const [vinInput, setVinInput] = useState<string>(initialVin);
  const [decodedVehicle, setDecodedVehicle] = useState<NHTSAVinDecodedVehicle | null>(null);

  // Analysis & Results State
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<ReliabilityReport | null>(null);

  // Interactive UI states
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedRecalls, setExpandedRecalls] = useState<Record<string, boolean>>({});

  // 1. Fetch available makes on mount
  useEffect(() => {
    getMakes().then(makes => {
      setMakesList(makes);
    });
  }, []);

  // 2. Fetch models when make or year changes in manual mode
  useEffect(() => {
    if (!selectedMake) {
      setModelsList([]);
      return;
    }
    let isMounted = true;
    setLoadingModels(true);

    getModelsForMakeYear(selectedMake, selectedYear)
      .then(models => {
        if (!isMounted) return;
        setModelsList(models);
        // If current model not in new list, reset or keep first
        if (models.length > 0 && !models.some(m => m.toLowerCase() === selectedModel.toLowerCase())) {
          setSelectedModel(models[0]);
        }
      })
      .catch(err => {
        console.warn('Failed to load models for make:', err);
      })
      .finally(() => {
        if (isMounted) setLoadingModels(false);
      });

    return () => { isMounted = false; };
  }, [selectedMake, selectedYear]);

  // Toggle Category Details
  const toggleCategoryExpand = (catName: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Toggle Recall Details
  const toggleRecallExpand = (campaignNum: string) => {
    setExpandedRecalls(prev => ({
      ...prev,
      [campaignNum]: !prev[campaignNum]
    }));
  };

  // Trigger Analysis
  const handleAnalyze = async (overrideParams?: { make: string; model: string; year: number }) => {
    setError(null);
    setLoading(true);

    try {
      let targetMake = overrideParams?.make || selectedMake;
      let targetModel = overrideParams?.model || selectedModel;
      let targetYear = overrideParams?.year || selectedYear;

      // If in VIN mode, decode first
      if (lookupMode === 'vin' && !overrideParams) {
        const cleanVin = vinInput.trim().toUpperCase();
        if (cleanVin.length !== 17) {
          throw new Error('Please enter a valid 17-character Vehicle Identification Number (VIN).');
        }

        const decoded = await decodeVinVehicle(cleanVin);
        setDecodedVehicle(decoded);
        targetMake = decoded.make;
        targetModel = decoded.model;
        targetYear = Number(decoded.year);

        if (!targetMake || !targetModel || !targetYear) {
          throw new Error('NHTSA VIN decode could not identify the Make, Model, or Year for this VIN.');
        }
      }

      const generatedReport = await getVehicleReliabilityReport(targetMake, targetModel, targetYear);
      setReport(generatedReport);
    } catch (err: any) {
      console.error('Reliability analysis error:', err);
      setError(err?.message || 'Failed to retrieve vehicle reliability data from NHTSA. Please check your connection and try again.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle Quick Sample selection
  const handleSelectSample = (sample: typeof SAMPLE_VEHICLES[0]) => {
    if (sample.vin) {
      setLookupMode('vin');
      setVinInput(sample.vin);
      setError(null);
      handleAnalyze();
    } else if (sample.year && sample.make && sample.model) {
      setLookupMode('manual');
      setSelectedYear(sample.year);
      setSelectedMake(sample.make);
      setSelectedModel(sample.model);
      setError(null);
      handleAnalyze({ make: sample.make, model: sample.model, year: sample.year });
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 transition-all relative overflow-hidden font-poppins">
      {/* Widget Header Banner */}
      <div 
        className={"flex flex-col md:flex-row md:items-center justify-between gap-4 select-none cursor-pointer " + (isToolOpen ? "pb-6 border-b border-slate-200/80" : "")}
        onClick={toggleToolOpen}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#29abe2]/20 via-sky-500/10 to-transparent border border-[#29abe2]/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <Wrench size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Used Car Reliability &amp; Common Problems
              </h3>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-sky-500/10 border border-sky-400/30 text-[#29abe2]">
                NHTSA Records
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
              Research reported mechanical problems, safety complaints, and recalls before buying a used vehicle.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleToolOpen();
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 shrink-0 self-start md:self-auto"
          aria-expanded={isToolOpen}
        >
          <span>{isToolOpen ? 'Collapse' : 'Expand Tool'}</span>
          <ChevronDown size={16} className={`transition-transform duration-300 ${isToolOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isToolOpen && (
        <div className="mt-6 space-y-6">
          {/* Option A / Option B Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200/80 self-start">
              <button
                type="button"
                onClick={() => setLookupMode('manual')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lookupMode === 'manual'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Option B: Manual Selection
              </button>
              <button
                type="button"
                onClick={() => setLookupMode('vin')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lookupMode === 'vin'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Option A: VIN Lookup
              </button>
            </div>

            {/* Quick Sample Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
              <span className="font-semibold text-slate-600">Quick Test:</span>
              {SAMPLE_VEHICLES.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(s)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-medium transition-colors cursor-pointer border border-slate-200/60"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Input Section */}
          <div className="p-5 sm:p-6 bg-slate-50/80 border border-slate-200/80 rounded-2xl">
            {lookupMode === 'manual' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Model Year */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Model Year
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/40 focus:border-[#29abe2]"
                    >
                      {MODEL_YEARS.map(yr => (
                        <option key={yr} value={yr}>{yr}</option>
                      ))}
                    </select>
                  </div>

                  {/* Manufacturer / Make */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Manufacturer
                    </label>
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/40 focus:border-[#29abe2]"
                    >
                      {makesList.map(mk => (
                        <option key={mk} value={mk}>{mk}</option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Model */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                      Vehicle Model {loadingModels && <span className="text-slate-400 font-normal lowercase">(updating...)</span>}
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      disabled={loadingModels || modelsList.length === 0}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/40 focus:border-[#29abe2] disabled:opacity-50"
                    >
                      {modelsList.length > 0 ? (
                        modelsList.map(mdl => (
                          <option key={mdl} value={mdl}>{mdl}</option>
                        ))
                      ) : (
                        <option value="">{loadingModels ? 'Loading models...' : 'Enter model'}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => handleAnalyze()}
                    disabled={loading || !selectedMake || !selectedModel}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#29abe2] hover:bg-[#2089b5] text-white shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                    <span>Analyze Vehicle</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    17-Character Vehicle Identification Number (VIN)
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      maxLength={17}
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value.toUpperCase())}
                      placeholder="e.g. 19XFC2F59LE123456"
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider font-semibold text-slate-900 uppercase placeholder:text-slate-400 placeholder:font-sans placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-[#29abe2]/40 focus:border-[#29abe2]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAnalyze()}
                      disabled={loading || vinInput.trim().length !== 17}
                      className="px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#29abe2] hover:bg-[#2089b5] text-white shadow-md shadow-sky-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                      <span>Analyze Vehicle</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    CarMatrix queries the NHTSA VPIC database to extract the factory build year, make, model, and trim automatically.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium flex items-start gap-3">
              <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Analysis Request Failed</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-[#29abe2]">
                <Loader2 size={24} className="animate-spin" />
              </div>
              <p className="text-sm font-bold text-slate-700">Connecting to NHTSA Public Databases...</p>
              <p className="text-xs text-slate-500 max-w-sm text-center">
                Querying verified owner complaint archives, federal safety recall campaigns, and component incident records.
              </p>
            </div>
          )}

          {/* RESULTS DASHBOARD */}
          {!loading && report && (
            <div className="space-y-8 pt-2 animate-in fade-in duration-300">
              
              {/* 1. Vehicle Identification Bar */}
              <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg border border-slate-800">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#29abe2] shrink-0">
                    <Car size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold tracking-widest uppercase text-[#29abe2]">
                      Target Vehicle Profile
                    </span>
                    <h4 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      {report.year} {report.make} {report.model}
                      {decodedVehicle?.trim && <span className="text-slate-300 font-semibold text-lg ml-2">{decodedVehicle.trim}</span>}
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {decodedVehicle?.vin && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 font-mono text-slate-300">
                      VIN: <strong className="text-white">{decodedVehicle.vin}</strong>
                    </div>
                  )}
                  {decodedVehicle?.displacementL && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-slate-300">
                      Engine: <strong className="text-white">{decodedVehicle.displacementL}</strong>
                    </div>
                  )}
                  {decodedVehicle?.driveType && (
                    <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-slate-300">
                      Drivetrain: <strong className="text-white">{decodedVehicle.driveType}</strong>
                    </div>
                  )}
                  <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 text-[11px]">
                    Verified via NHTSA
                  </div>
                </div>
              </div>

              {/* 2. Four Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Owner Complaints */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Owner Complaints</span>
                    <FileText size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                      {report.totalComplaints.toLocaleString()}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {report.totalComplaints === 0 ? 'Zero records filed' : 'Public safety filings recorded'}
                    </p>
                  </div>
                </div>

                {/* Card 2: Recall Campaigns */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Safety Recalls</span>
                    <ShieldAlert size={18} className={report.totalRecalls > 0 ? "text-amber-500" : "text-emerald-500"} />
                  </div>
                  <div>
                    <div className={`text-3xl font-extrabold tracking-tight ${report.totalRecalls > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {report.totalRecalls}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {report.totalRecalls > 0 ? 'Federal safety campaigns' : 'Zero model recalls reported'}
                    </p>
                  </div>
                </div>

                {/* Card 3: Most Reported Issue */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Top Component Issue</span>
                    <AlertTriangle size={18} className="text-orange-500" />
                  </div>
                  <div>
                    <div className="text-base sm:text-lg font-bold text-slate-900 truncate tracking-tight" title={report.mostReportedCategory || 'None Reported'}>
                      {report.mostReportedCategory || 'None Reported'}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {report.categories.length > 0 ? `${report.categories[0].count} matching complaints (${report.categories[0].percentage}%)` : 'Insufficient issue volume'}
                    </p>
                  </div>
                </div>

                {/* Card 4: Data Coverage */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider">Data Coverage</span>
                    <CheckCircle2 size={18} className="text-[#29abe2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      NHTSA Office of Defects
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Updated: <span className="font-semibold text-slate-700">{report.retrievedAt}</span>
                    </p>
                    <span className="inline-block mt-1 text-[10px] text-slate-500 font-medium">
                      Excludes routine maintenance
                    </span>
                  </div>
                </div>
              </div>

              {/* High-Consequence Incident Callout (Crashes, Fires, Injuries) */}
              {(report.crashesReported > 0 || report.firesReported > 0 || report.injuriesReported > 0) && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
                  <div className="flex items-center gap-2.5">
                    <AlertOctagon size={18} className="text-amber-600 shrink-0" />
                    <span className="font-semibold">
                      Consumer incident filings for this model include:
                    </span>
                  </div>
                  <div className="flex items-center gap-4 font-bold">
                    {report.crashesReported > 0 && <span>{report.crashesReported} Crash Reports</span>}
                    {report.firesReported > 0 && <span>{report.firesReported} Fire Incident(s)</span>}
                    {report.injuriesReported > 0 && <span>{report.injuriesReported} Injury Claim(s)</span>}
                  </div>
                </div>
              )}

              {/* Insufficient Data State Callout */}
              {report.hasInsufficientData && (
                <div className="p-6 rounded-2xl bg-sky-50 border border-sky-200 text-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-sky-800 font-bold">
                    <Info size={18} className="text-[#29abe2]" />
                    <span>Insufficient Reporting Data</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600">
                    No official owner complaints or safety recalls were retrieved from NHTSA for the {report.year} {report.make} {report.model}. 
                    Under CarMatrix evidence standards, a lack of reported consumer complaints does not guarantee mechanical reliability or build quality—it frequently indicates a newer release model, lower total production volume, or delayed filing patterns. An independent pre-purchase inspection is still strongly recommended.
                  </p>
                </div>
              )}

              {/* 3. Common Reported Problems (Grouped by NHTSA Component) */}
              {report.categories.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                        Common Reported Problems by Component
                      </h4>
                      <p className="text-xs text-slate-500">
                        Grouped from {report.totalComplaints} verified NHTSA owner complaint submissions. Click any category to review filing summaries.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {report.categories.map((cat) => {
                      const isExpanded = Boolean(expandedCategories[cat.category]);
                      return (
                        <div 
                          key={cat.category}
                          className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs transition-all"
                        >
                          {/* Category Header Row */}
                          <button
                            type="button"
                            onClick={() => toggleCategoryExpand(cat.category)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3.5 pr-4">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                cat.count >= 15 ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                cat.count >= 5 ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                'bg-sky-50 text-[#29abe2] border border-sky-200'
                              }`}>
                                <Wrench size={18} />
                              </div>
                              <div>
                                <h5 className="text-sm sm:text-base font-bold text-slate-900">
                                  {cat.category}
                                </h5>
                                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-500">
                                  <span className="font-semibold text-slate-700">
                                    {cat.count} {cat.count === 1 ? 'Complaint' : 'Complaints'}
                                  </span>
                                  <span>•</span>
                                  <span>{cat.percentage}% of reported issues</span>
                                  {cat.commonSymptoms.length > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="hidden sm:inline text-slate-600 italic">
                                        Frequent symptoms: {cat.commonSymptoms.join(', ')}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs font-bold text-[#29abe2] hidden md:inline">
                                {isExpanded ? 'Hide Complaints' : 'View Complaints'}
                              </span>
                              <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-sky-100 text-[#29abe2]' : ''}`}>
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          </button>

                          {/* Expandable Complaint Details */}
                          {isExpanded && (
                            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 space-y-3 text-xs">
                              <div className="flex items-center justify-between text-slate-500 pb-1">
                                <span className="font-bold uppercase tracking-wider text-[11px]">
                                  Sample Public Submissions (ODI Records)
                                </span>
                                <span>Showing up to 5 verified records</span>
                              </div>

                              <div className="space-y-2.5">
                                {cat.recentComplaints.map((c) => (
                                  <div 
                                    key={String(c.odiNumber)}
                                    className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 space-y-1.5 shadow-2xs"
                                  >
                                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                                      <span className="font-mono font-bold text-slate-800">
                                        NHTSA ODI ID: #{c.odiNumber}
                                      </span>
                                      <div className="flex items-center gap-2">
                                        {c.dateComplaintFiled && <span>Filed: {c.dateComplaintFiled}</span>}
                                        {c.crash && <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">Crash Reported</span>}
                                        {c.fire && <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">Fire Reported</span>}
                                      </div>
                                    </div>
                                    <p className="leading-relaxed line-clamp-4 hover:line-clamp-none text-slate-800 font-sans">
                                      &quot;{c.summary}&quot;
                                    </p>
                                    <div className="pt-1 text-[10px] text-slate-400">
                                      Reported Component: <strong className="text-slate-600">{c.components}</strong>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. Recall Information Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                      Safety Recall Campaigns ({report.totalRecalls})
                    </h4>
                    <p className="text-xs text-slate-500">
                      Manufacturer safety recall campaigns documented with the federal government.
                    </p>
                  </div>
                </div>

                {/* Important Distinction Banner */}
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-2.5">
                  <Info size={16} className="text-amber-700 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Critical VIN Distinction:</strong> A model-year recall campaign establishes that safety defects were identified for this model year. However, it does not confirm whether a specific pre-owned car on a dealer lot has already received the repair or has an open unremedied recall. Always have the dealership run the specific 17-digit VIN before signing.
                  </p>
                </div>

                {report.recalls.length === 0 ? (
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                    <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                    <div>
                      <h5 className="font-bold text-sm">Zero Federal Safety Recall Campaigns</h5>
                      <p className="text-xs text-emerald-700 mt-0.5">
                        No active safety recalls are on record with NHTSA for the {report.year} {report.make} {report.model}.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.recalls.map((rec) => {
                      const isExpanded = Boolean(expandedRecalls[rec.NHTSACampaignNumber]);
                      return (
                        <div 
                          key={rec.NHTSACampaignNumber}
                          className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs"
                        >
                          <button
                            type="button"
                            onClick={() => toggleRecallExpand(rec.NHTSACampaignNumber)}
                            className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                          >
                            <div className="flex items-start gap-3.5 pr-4">
                              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
                                <ShieldAlert size={18} />
                              </div>
                              <div>
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                                    NHTSA Campaign #{rec.NHTSACampaignNumber}
                                  </span>
                                  {rec.ReportReceivedDate && (
                                    <span className="text-[11px] text-slate-500">
                                      Issued: {rec.ReportReceivedDate}
                                    </span>
                                  )}
                                </div>
                                <h5 className="text-sm sm:text-base font-bold text-slate-900">
                                  {rec.Component}
                                </h5>
                                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                                  {rec.Summary}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-bold text-[#29abe2] hidden sm:inline">
                                {isExpanded ? 'Hide Details' : 'View Remedy'}
                              </span>
                              <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-sky-100 text-[#29abe2]' : ''}`}>
                                <ChevronDown size={16} />
                              </div>
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 space-y-3 text-xs leading-relaxed">
                              {rec.Consequence && (
                                <div>
                                  <strong className="block text-slate-900 font-bold mb-0.5">Safety Consequence:</strong>
                                  <p className="text-rose-900 bg-rose-50/80 p-2.5 rounded-lg border border-rose-100">
                                    {rec.Consequence}
                                  </p>
                                </div>
                              )}

                              <div>
                                <strong className="block text-slate-900 font-bold mb-0.5">Manufacturer Remedy:</strong>
                                <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                                  {rec.Remedy}
                                </p>
                              </div>

                              <div className="text-[11px] text-slate-500 pt-1 flex items-center gap-1.5">
                                <Check size={14} className="text-emerald-500" />
                                <span>Federal Law requires authorized brand dealerships to execute safety recall remedies 100% free of charge.</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 5. Pre-Purchase Inspection Recommendations */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                      Evidence-Based Pre-Purchase Inspection Checklist
                    </h4>
                    <p className="text-xs text-slate-500">
                      Targeted mechanical checks dynamically formulated from reported complaints and recall records for this vehicle.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.inspectionRecommendations.map((rec) => (
                    <div 
                      key={rec.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            rec.severity === 'critical' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            rec.severity === 'caution' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {rec.severity === 'critical' ? 'Priority Check' : rec.severity === 'caution' ? 'Recommended Check' : 'Routine Standard'}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{rec.category}</span>
                        </div>

                        <h5 className="text-sm sm:text-base font-bold text-slate-900">
                          {rec.component}
                        </h5>

                        <p className="text-xs text-slate-500 italic">
                          Reason: {rec.reason}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 font-medium leading-relaxed">
                        <strong className="block text-slate-900 font-bold mb-1">Suggested Inspection Action:</strong>
                        {rec.checklistAction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Methodology & Consumer Protection Notice */}
              <div className="p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-slate-600 text-xs leading-relaxed space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  <ShieldCheck size={16} className="text-[#29abe2]" />
                  <span>NHTSA Evidence &amp; Methodology Disclosure</span>
                </div>
                <p>
                  CarMatrix data is retrieved in real-time from the National Highway Traffic Safety Administration (NHTSA) Office of Defects Investigation (ODI) public database. NHTSA complaint logs reflect consumer-submitted allegations and unverified field reports rather than controlled actuarial failure rates, calculated probability curves, or manufacturer reliability scores.
                </p>
                <p>
                  High complaint volumes on high-volume best-sellers (such as pickup trucks and compact sedans) frequently reflect extensive vehicle sales rather than disproportionate defect rates. CarMatrix never fabricates reliability rankings or probability numbers. Use these findings to arm your pre-purchase test-drive and pre-purchase vehicle inspection (PPI).
                </p>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
