import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, Loader2, 
  ChevronDown, Search, Wrench, RefreshCw, Copy, Check, 
  ExternalLink, Sparkles, SlidersHorizontal, ArrowRight,
  HelpCircle, AlertOctagon, Scale, DollarSign, Calendar,
  FileText, Activity
} from 'lucide-react';
import { getMakes, getModelsForMakeYear } from '../../services/nhtsa';
import { VehicleProsConsAudit, auditVehicleProsCons } from '../../services/vehicleProsConsService';
import { supabase } from '../../supabaseClient';

export interface VehicleProsConsAuditorProps {
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onScrollToTool?: (toolId: string) => void;
  initialVehicleQuery?: string;
}

const LOCAL_STORAGE_CACHE_KEY = 'carmatrix_pros_cons_cache_v1';

// Benchmark quick-pick preset suggestions
const PRESET_VEHICLES = [
  '2017 Honda CR-V EX-L 1.5T',
  '2019 Toyota RAV4 Hybrid XLE',
  '2018 Ford F-150 3.5L EcoBoost',
  '2020 Subaru Outback Premium',
  '2018 BMW 330i xDrive',
  '2021 Tesla Model 3 Long Range',
  '2018 Toyota Camry SE',
  '2019 Mazda CX-5 Touring'
];

// Available model years (2026 down to 1995)
const MODEL_YEARS = Array.from({ length: 32 }, (_, i) => 2026 - i);

export default function VehicleProsConsAuditor({
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  onScrollToTool,
  initialVehicleQuery = ''
}: VehicleProsConsAuditorProps) {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isToolOpen = isControlled ? controlledOpen : internalOpen;

  const toggleToolOpen = () => {
    if (onToggle) onToggle(!isToolOpen);
    if (!isControlled) setInternalOpen(!isToolOpen);
  };

  // Search Mode: 'cascade' (dropdowns) vs 'text' (free text input)
  const [searchMode, setSearchMode] = useState<'cascade' | 'text'>('cascade');

  // Cascade states
  const [selectedYear, setSelectedYear] = useState<number>(2017);
  const [selectedMake, setSelectedMake] = useState<string>('Honda');
  const [selectedModel, setSelectedModel] = useState<string>('CR-V');
  const [selectedTrim, setSelectedTrim] = useState<string>('EX-L 1.5T');
  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState<boolean>(false);

  // Free-text state
  const [freeTextQuery, setFreeTextQuery] = useState<string>(initialVehicleQuery || '2017 Honda CR-V EX-L 1.5T');

  // Auditing States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<VehicleProsConsAudit | null>(null);
  const [isCachedHit, setIsCachedHit] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load makes on mount
  useEffect(() => {
    let isMounted = true;
    getMakes().then(makes => {
      if (isMounted) setAvailableMakes(makes);
    }).catch(err => console.error('Failed to load makes:', err));
    return () => { isMounted = false; };
  }, []);

  // Fetch models whenever make or year updates in cascade mode
  useEffect(() => {
    if (!selectedMake) return;
    let isMounted = true;
    setIsLoadingModels(true);

    getModelsForMakeYear(selectedMake, selectedYear)
      .then(models => {
        if (!isMounted) return;
        setAvailableModels(models);
        if (models.length > 0 && !models.some(m => m.toLowerCase() === selectedModel.toLowerCase())) {
          setSelectedModel(models[0]);
        }
      })
      .catch(err => console.error('Failed to load models:', err))
      .finally(() => {
        if (isMounted) setIsLoadingModels(false);
      });

    return () => { isMounted = false; };
  }, [selectedMake, selectedYear]);

  // Read / write local cache
  const getCachedAudit = (queryKey: string): VehicleProsConsAudit | null => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      const normalizedKey = queryKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      const item = parsed[normalizedKey];
      if (item) {
        return item;
      }
    } catch (e) {
      console.warn('Failed to read from local pros & cons cache', e);
    }
    return null;
  };

  const saveToLocalCache = (queryKey: string, data: VehicleProsConsAudit) => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      const cache = raw ? JSON.parse(raw) : {};
      const normalizedKey = queryKey.toLowerCase().replace(/[^a-z0-9]/g, '');
      cache[normalizedKey] = {
        ...data,
        timestamp: Date.now()
      };
      localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(cache));

      // Optional non-blocking background write to Supabase if configured
      if (supabase && typeof supabase.from === 'function') {
        supabase.from('vehicle_pros_cons_audits').insert([
          {
            vehicle_query: queryKey,
            reliability_score: data.reliability_score,
            verdict_headline: data.verdict_headline,
            pros: data.pros,
            cons: data.cons,
            critical_inspection_check: data.critical_inspection_check,
            estimated_yearly_maintenance: data.estimated_yearly_maintenance,
            created_at: new Date().toISOString()
          }
        ]).then(() => {}).catch(() => {});
      }
    } catch (e) {
      console.warn('Failed to write to local pros & cons cache', e);
    }
  };

  // Perform audit query
  const runAudit = async (customQuery?: string, forceRefresh: boolean = false) => {
    const query = (customQuery !== undefined ? customQuery : (
      searchMode === 'cascade' 
        ? `${selectedYear} ${selectedMake} ${selectedModel} ${selectedTrim}`.trim()
        : freeTextQuery
    )).trim();

    if (!query || query.length < 3) {
      setErrorMessage('Please enter a valid vehicle year, make, and model.');
      return;
    }

    setErrorMessage(null);

    // 1. Check local cache if not forcing refresh
    if (!forceRefresh) {
      const cached = getCachedAudit(query);
      if (cached) {
        setAuditResult(cached);
        setIsCachedHit(true);
        return;
      }
    }

    setIsLoading(true);
    setIsCachedHit(false);

    try {
      // 2. Query serverless backend route
      const res = await fetch('/api/tools/vehicle-pros-cons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleQuery: query }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const result: VehicleProsConsAudit = json.data;
          setAuditResult(result);
          saveToLocalCache(query, result);
          setIsLoading(false);
          return;
        }
      }

      // If backend route returned an error, fallback to client-side automotive engine
      console.warn('Backend route returned non-OK. Calling client-side automotive defense engine fallback.');
      const clientFallback = await auditVehicleProsCons(query);
      setAuditResult(clientFallback);
      saveToLocalCache(query, clientFallback);
    } catch (err: any) {
      console.warn('Network call failed, executing direct automotive knowledge fallback:', err);
      try {
        const fallback = await auditVehicleProsCons(query);
        setAuditResult(fallback);
        saveToLocalCache(query, fallback);
      } catch (fallbackErr) {
        setErrorMessage('Failed to complete vehicle truth audit. Please check your query and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Execute initial search once mounted if not already audited
  useEffect(() => {
    if (!auditResult) {
      runAudit('2017 Honda CR-V EX-L 1.5T');
    }
  }, []);

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getReliabilityColor = (score: number) => {
    if (score >= 80) return {
      badge: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-400',
      label: 'HIGH RELIABILITY',
      ring: 'text-emerald-400'
    };
    if (score >= 65) return {
      badge: 'bg-amber-500/15 border-amber-400/40 text-amber-400',
      label: 'MODERATE / WATCHLIST',
      ring: 'text-amber-400'
    };
    return {
      badge: 'bg-rose-500/15 border-rose-400/40 text-rose-400',
      label: 'HIGH FAILURE RISK',
      ring: 'text-rose-400'
    };
  };

  const reliabilityStyle = auditResult ? getReliabilityColor(auditResult.reliability_score) : null;

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/70 shadow-[0_12px_36px_rgba(15,23,42,0.06)] rounded-3xl p-6 md:p-8 relative overflow-hidden font-poppins">
      
      {/* Header bar / Toggle */}
      <div 
        onClick={toggleToolOpen}
        className={`flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition-all ${
          isToolOpen ? 'pb-6 border-b border-slate-200/80 mb-6' : ''
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-400/20 via-sky-500/10 to-transparent border border-sky-300/40 shadow-[0_4px_16px_rgba(41,171,226,0.18)] flex items-center justify-center text-[#29abe2] shrink-0 relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-white/60 pointer-events-none" />
            <Scale size={22} strokeWidth={2.2} className="drop-shadow-xs" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-semibold text-slate-900 tracking-tight font-poppins">
                Used Car Pros &amp; Cons Auditor
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#29abe2]/10 text-[#0284c7] border border-[#29abe2]/20">
                <Sparkles size={11} className="text-[#29abe2]" />
                Vehicle Truth Matrix™
              </span>
              {isCachedHit && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  Instant Cache Hit (0 API Cost)
                </span>
              )}
            </div>
            <p className="text-slate-500 text-sm mt-0.5 font-poppins">
              Raw, unvarnished consumer breakdown: mechanical failure points, transmission quirks, mandatory shop checks, and reliability rating.
            </p>
          </div>
        </div>

        {/* Collapsible toggle button */}
        <div className="flex items-center gap-3 shrink-0 self-start md:self-auto" onClick={(e) => e.stopPropagation()}>
          {auditResult && !isToolOpen && (
            <div className="bg-slate-900 text-white px-3.5 py-2 rounded-xl flex items-center gap-2.5 text-xs font-bold">
              <span className="text-slate-400 font-normal truncate max-w-[140px] sm:max-w-[200px]">{auditResult.vehicle}</span>
              <span className="text-emerald-400 font-black">{auditResult.reliability_score}/100</span>
            </div>
          )}

          <button
            type="button"
            onClick={toggleToolOpen}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/80 shrink-0"
            aria-expanded={isToolOpen}
          >
            <span>{isToolOpen ? 'Collapse' : 'Expand Auditor'}</span>
            <ChevronDown size={16} className={`transition-transform duration-300 ${isToolOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Tool Body */}
      {isToolOpen && (
        <div className="space-y-6">
          
          {/* Query Selection Bar */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
            {/* Ambient specular highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Target Vehicle:</span>
                <span className="text-[11px] text-slate-400">Select cascade dropdowns or type freehand</span>
              </div>

              {/* Mode Toggle Switch */}
              <div className="inline-flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setSearchMode('cascade')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    searchMode === 'cascade'
                      ? 'bg-[#29abe2] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Cascade Selector
                </button>
                <button
                  type="button"
                  onClick={() => setSearchMode('text')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    searchMode === 'text'
                      ? 'bg-[#29abe2] text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Free-Text Input
                </button>
              </div>
            </div>

            {/* Input Form Depending on Mode */}
            {searchMode === 'cascade' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* Year */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Year</label>
                  <div className="relative">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-inner"
                    >
                      {MODEL_YEARS.map(y => (
                        <option key={y} value={y} className="bg-slate-900 text-white">{y}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Make */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Brand / Make</label>
                  <div className="relative">
                    <select
                      value={selectedMake}
                      onChange={(e) => setSelectedMake(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-inner"
                    >
                      {availableMakes.map(m => (
                        <option key={m} value={m} className="bg-slate-900 text-white">{m}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Model</span>
                    {isLoadingModels && <Loader2 size={11} className="animate-spin text-[#29abe2]" />}
                  </label>
                  <div className="relative">
                    {availableModels.length > 0 ? (
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 appearance-none pr-8 cursor-pointer shadow-inner"
                      >
                        {availableModels.map(mod => (
                          <option key={mod} value={mod} className="bg-slate-900 text-white">{mod}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        placeholder="e.g. CR-V"
                        className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] shadow-inner"
                      />
                    )}
                    {availableModels.length > 0 && (
                      <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    )}
                  </div>
                </div>

                {/* Trim / Engine */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Trim / Submodel</label>
                  <input
                    type="text"
                    value={selectedTrim}
                    onChange={(e) => setSelectedTrim(e.target.value)}
                    placeholder="e.g. EX-L 1.5T"
                    className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-[#29abe2] shadow-inner"
                  />
                </div>

                {/* Audit Button */}
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => runAudit()}
                    disabled={isLoading}
                    className="w-full min-h-[42px] px-4 py-2.5 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(41,171,226,0.5)] active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Auditing...</span>
                      </>
                    ) : (
                      <>
                        <Search size={14} strokeWidth={2.4} />
                        <span>Audit Truth</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={freeTextQuery}
                    onChange={(e) => setFreeTextQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') runAudit(freeTextQuery);
                    }}
                    placeholder="e.g. 2017 Honda CR-V EX-L 1.5T or 2018 BMW 330i xDrive"
                    className="w-full bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl pl-4 pr-10 py-3 text-sm font-semibold text-white outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 shadow-inner"
                  />
                  <Search size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                </div>
                <button
                  type="button"
                  onClick={() => runAudit(freeTextQuery)}
                  disabled={isLoading}
                  className="px-6 py-3 rounded-xl bg-[#29abe2] hover:bg-[#2089b5] text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-[0_0_20px_rgba(41,171,226,0.5)] active:scale-[0.98] disabled:opacity-50 shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      <span>Auditing...</span>
                    </>
                  ) : (
                    <>
                      <Search size={15} strokeWidth={2.4} />
                      <span>Run Diagnostic</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Benchmark Preset Quick-Picks */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Benchmark Picks:</span>
              {PRESET_VEHICLES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setFreeTextQuery(preset);
                    runAudit(preset);
                  }}
                  className="text-[11px] font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 hover:border-[#29abe2]/50 transition-all cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertOctagon size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Loading Animation state */}
          {isLoading && (
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md text-center space-y-4 animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-[#29abe2]/20 border border-[#29abe2]/40 text-[#29abe2] flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(41,171,226,0.4)]">
                <Activity size={24} className="animate-spin" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-200">Executing CarMatrix Vehicle Truth Audit...</h4>
                <p className="text-xs text-slate-400 mt-1">Cross-referencing NHTSA safety defects, powertrain failure frequencies, and transmission replacement history.</p>
              </div>
            </div>
          )}

          {/* Audit Result Display */}
          {auditResult && !isLoading && (
            <div className="space-y-6">
              
              {/* Top Summary Banner: Vehicle Title, Reliability Score, and Yearly Maintenance */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800/90 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#29abe2]/50 to-transparent pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-slate-300 border border-white/10">
                        AUDIT TARGET
                      </span>
                      {isCachedHit && (
                        <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                          <Check size={11} /> Cached Instant
                        </span>
                      )}
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {auditResult.vehicle}
                    </h2>
                    
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                      Independent consumer protection diagnostic compiled from empirical failure metrics, recall watchlists, and repair shop repair invoices.
                    </p>
                  </div>

                  {/* Badges / Metrics */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    {/* Reliability Score Card */}
                    <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl min-w-[170px] shrink-0 text-center shadow-lg">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Reliability Index
                      </span>
                      <div className="flex items-center justify-center gap-1">
                        <span className={`text-3xl font-black ${reliabilityStyle?.ring}`}>
                          {auditResult.reliability_score}
                        </span>
                        <span className="text-sm font-bold text-slate-500">/100</span>
                      </div>
                      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${reliabilityStyle?.badge}`}>
                        {reliabilityStyle?.label}
                      </span>
                    </div>

                    {/* Estimated Maintenance Card */}
                    <div className="bg-slate-950/90 border border-slate-800 p-4 rounded-2xl min-w-[170px] shrink-0 text-center shadow-lg">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Est. Annual Maintenance
                      </span>
                      <span className="text-2xl font-black text-white block mt-0.5">
                        {auditResult.estimated_yearly_maintenance}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium block mt-1">
                        Routine wear &amp; fluids
                      </span>
                    </div>
                  </div>
                </div>

                {/* Verdict Headline Callout */}
                <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-[#29abe2]/15 border border-[#29abe2]/30 text-[#29abe2] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <ShieldCheck size={18} strokeWidth={2.4} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#29abe2] block mb-0.5">
                      CarMatrix Bottom-Line Verdict
                    </span>
                    <p className="text-sm sm:text-base font-bold text-slate-100 leading-snug">
                      "{auditResult.verdict_headline}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Two-Column Grid: Pros vs Cons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* PROS COLUMN */}
                <div className="bg-emerald-950/20 border border-emerald-500/25 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-emerald-500/20">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 size={16} strokeWidth={2.4} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-emerald-900 uppercase tracking-wide">
                          Verified Mechanical Advantages
                        </h4>
                        <span className="text-[11px] text-emerald-700 font-medium">Why buyers seek this vehicle</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {auditResult.pros.map((pro, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed font-medium">
                          <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                            ✓
                          </span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                    <span>Engineered for longevity</span>
                    <span className="text-emerald-800">Advantage Score: High</span>
                  </div>
                </div>

                {/* CONS / MECHANICAL FLAWS COLUMN */}
                <div className="bg-rose-950/15 border border-rose-500/25 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2.5 pb-3 border-b border-rose-500/20">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-400/40 text-rose-500 flex items-center justify-center shrink-0">
                        <AlertTriangle size={16} strokeWidth={2.4} />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-rose-900 uppercase tracking-wide">
                          Known Failure Modes &amp; Pitfalls
                        </h4>
                        <span className="text-[11px] text-rose-700 font-medium">Documented owner complaints &amp; defects</span>
                      </div>
                    </div>

                    <ul className="space-y-3">
                      {auditResult.cons.map((con, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800 leading-relaxed font-medium">
                          <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                            !
                          </span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-5 pt-3 border-t border-rose-500/15 flex items-center justify-between text-[11px] text-rose-700 font-bold">
                    <span>Check service invoices</span>
                    <span className="text-rose-800">Negotiation Leverage: High</span>
                  </div>
                </div>
              </div>

              {/* Critical Pre-Purchase Inspection Checkpoint Card */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/40 rounded-2xl p-5 sm:p-6 shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-600 flex items-center justify-center shrink-0 shadow-xs">
                      <Wrench size={20} strokeWidth={2.4} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 border border-amber-500/30">
                          MANDATORY SHOP CHECK
                        </span>
                        <span className="text-xs font-bold text-slate-600">The #1 Thing to Inspect Before Buying</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {auditResult.critical_inspection_check}
                      </p>
                      <p className="text-xs text-slate-500">
                        Give this exact note to your independent mechanic during the pre-purchase inspection (PPI).
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopyText(auditResult.critical_inspection_check, 'check')}
                    className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    {copiedKey === 'check' ? (
                      <>
                        <Check size={14} className="text-emerald-600" />
                        <span>Copied for Mechanic!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="text-slate-400" />
                        <span>Copy Inspection Note</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Utility Action Bar: Re-Audit, Copy Full Report, Cross-Tool Shortcuts */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => runAudit(undefined, true)}
                    disabled={isLoading}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                  >
                    <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
                    <span>Re-Audit Live</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const summary = `CARMATRIX TRUTH MATRIX AUDIT: ${auditResult.vehicle}
Reliability Score: ${auditResult.reliability_score}/100
Verdict: ${auditResult.verdict_headline}
Est. Maintenance: ${auditResult.estimated_yearly_maintenance}/yr
#1 Inspection Check: ${auditResult.critical_inspection_check}

PROS:
${auditResult.pros.map(p => `• ${p}`).join('\n')}

CONS / FLAWS:
${auditResult.cons.map(c => `• ${c}`).join('\n')}`;
                      handleCopyText(summary, 'full');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                  >
                    {copiedKey === 'full' ? (
                      <>
                        <Check size={12} className="text-emerald-600" />
                        <span>Summary Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={12} />
                        <span>Copy Complete Truth Summary</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Related Tool Jump Links */}
                {onScrollToTool && (
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium">
                    <span>Audit with other tools:</span>
                    <button
                      type="button"
                      onClick={() => onScrollToTool('valuation-estimator')}
                      className="text-[#0284c7] hover:underline font-bold cursor-pointer"
                    >
                      Market Valuation →
                    </button>
                    <button
                      type="button"
                      onClick={() => onScrollToTool('tco-calculator')}
                      className="text-[#0284c7] hover:underline font-bold cursor-pointer"
                    >
                      5-Yr TCO →
                    </button>
                    <button
                      type="button"
                      onClick={() => onScrollToTool('quote-auditor')}
                      className="text-[#0284c7] hover:underline font-bold cursor-pointer"
                    >
                      OTD Dealer Quote →
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
