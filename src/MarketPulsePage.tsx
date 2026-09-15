import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowLeft, 
  HelpCircle, ShieldCheck, Wrench, Car, CarFront, BookOpen 
} from 'lucide-react';

interface Metric {
  key: string;
  label: string;
  asOf: string;
  index: number;
  mom: number | null;
  yoy: number | null;
  sparkline: (number | null)[];
}

interface MarketPulseData {
  source: string;
  fetchedAt: string;
  metrics: Metric[];
}

export default function MarketPulsePage({ onBack }: { onBack: () => void }) {
  const [data, setData] = useState<MarketPulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string>('usedCars');

  useEffect(() => {
    fetch('/api/market-pulse')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((json) => {
        setData(json);
        if (json.metrics && json.metrics.length > 0) {
          setSelectedKey(json.metrics[0].key);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const selectedMetric = data?.metrics.find((m) => m.key === selectedKey);

  const getMetricStyle = (key: string, isActive = false) => {
    switch (key) {
      case 'usedCars':
        return {
          icon: <Car size={isActive ? 22 : 20} className={isActive ? "text-white" : "text-[#29abe2]"} />,
          glassBox: isActive
            ? "bg-gradient-to-br from-[#29abe2] to-sky-600 text-white border-white/30 shadow-[0_4px_20px_rgba(41,171,226,0.45)]"
            : "bg-gradient-to-br from-[#29abe2]/25 via-sky-500/15 to-transparent border-[#29abe2]/40 text-[#29abe2] shadow-[0_4px_16px_rgba(41,171,226,0.2)]"
        };
      case 'newVehicles':
        return {
          icon: <CarFront size={isActive ? 22 : 20} className={isActive ? "text-white" : "text-amber-400"} />,
          glassBox: isActive
            ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white border-white/30 shadow-[0_4px_20px_rgba(251,191,36,0.45)]"
            : "bg-gradient-to-br from-amber-400/25 via-amber-500/15 to-transparent border-amber-400/40 text-amber-400 shadow-[0_4px_16px_rgba(251,191,36,0.2)]"
        };
      case 'repairs':
        return {
          icon: <Wrench size={isActive ? 22 : 20} className={isActive ? "text-white" : "text-emerald-400"} />,
          glassBox: isActive
            ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white border-white/30 shadow-[0_4px_20px_rgba(52,211,153,0.45)]"
            : "bg-gradient-to-br from-emerald-400/25 via-emerald-500/15 to-transparent border-emerald-400/40 text-emerald-400 shadow-[0_4px_16px_rgba(52,211,153,0.2)]"
        };
      case 'insurance':
        return {
          icon: <ShieldCheck size={isActive ? 22 : 20} className={isActive ? "text-white" : "text-indigo-400"} />,
          glassBox: isActive
            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-white/30 shadow-[0_4px_20px_rgba(129,140,248,0.45)]"
            : "bg-gradient-to-br from-indigo-400/25 via-purple-500/15 to-transparent border-indigo-400/40 text-indigo-400 shadow-[0_4px_16px_rgba(129,140,248,0.2)]"
        };
      default:
        return {
          icon: <Car size={20} className="text-[#29abe2]" />,
          glassBox: "bg-gradient-to-br from-[#29abe2]/20 to-transparent border-[#29abe2]/30 text-[#29abe2]"
        };
    }
  };

  const getInsightText = (key: string, value: number | null) => {
    if (value === null) return 'No trend data available.';
    const isRising = value > 0;
    const absVal = Math.abs(value).toFixed(1);
    
    switch (key) {
      case 'usedCars':
        return isRising 
          ? `Used car prices are up ${absVal}% vs. last year. Inventory replenishment remains moderate. Consider waiting or negotiating certified pre-owned options.` 
          : `Used car prices have decreased by ${absVal}% YoY. Excellent buying conditions exist. Dealerships are looking to move older stock quickly.`;
      case 'newVehicles':
        return isRising 
          ? `New vehicle pricing is up ${absVal}% YoY. Supply chains have stabilized but dealership markups persist. Look for financing promotions.` 
          : `New vehicles are down ${absVal}% YoY. Manufacturers are starting to reintroduce cash-back incentives and lower APR financing.`;
      case 'repairs':
        return isRising 
          ? `Maintenance and repair costs are up ${absVal}% YoY due to parts inflation and labor rates. Consider pre-paid service plans.` 
          : `Repair costs are stable (down ${absVal}% YoY). Shop around and request detailed estimates from both dealers and independent mechanics.`;
      case 'insurance':
        return isRising 
          ? `Vehicle insurance premiums have increased by ${absVal}% YoY. Rates continue to climb. We advise requesting quotes from multiple carriers.` 
          : `Insurance premiums have cooled down (${absVal}% YoY change). A great time to check if you can lower your monthly premium by switching carriers.`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 text-white font-sans selection:bg-[#29abe2]/20 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#29abe2]/20 via-sky-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Subtle grid texture */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none opacity-40" />

      {/* Top Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        <button 
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white px-4 py-2.5 rounded-xl backdrop-blur-xl bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 hover:border-[#29abe2]/50 transition-all duration-200 mb-6 cursor-pointer shadow-md shadow-black/20 hover:-translate-y-0.5"
        >
          <ArrowLeft size={15} /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-slate-800/80 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-extrabold text-[#29abe2] uppercase tracking-wider px-3 py-1 rounded-full bg-[#29abe2]/10 border border-[#29abe2]/30 mb-3 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse"></span>
              Live Market Indicators
            </div>
            <h1 className="text-[34px] md:text-[46px] font-black tracking-tight text-white leading-tight">
              Consumer Market Pulse
            </h1>
            <p className="text-slate-300 font-medium text-[15px] max-w-[650px] mt-2 leading-relaxed">
              Track real-time inflation trends, price indexes, and overhead costs in the automotive industry compiled directly from the U.S. Bureau of Labor Statistics (BLS).
            </p>
          </div>
          <div className="relative overflow-hidden backdrop-blur-xl bg-slate-900/70 border border-slate-700/70 rounded-2xl px-6 py-4.5 shrink-0 min-w-[210px] shadow-xl shadow-black/30 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Last Updated</div>
            <div className="text-[18px] font-black text-white">
              {data ? data.metrics[0]?.asOf : 'Loading...'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <HelpCircle size={12} className="text-[#29abe2]" /> Edge cached 12h
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-[300px] bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse" />
              <div className="h-[200px] bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse" />
            </div>
            <div className="h-[520px] bg-slate-900/60 border border-slate-800 rounded-3xl animate-pulse" />
          </div>
        ) : error || !data ? (
          <div className="backdrop-blur-xl bg-rose-950/30 border border-rose-500/30 rounded-3xl p-8 text-center max-w-[600px] mx-auto my-12 shadow-2xl">
            <h3 className="text-xl font-bold text-rose-300 mb-2">Failed to Load Market Pulse</h3>
            <p className="text-slate-300 text-[14px] mb-6">
              There was an issue retrieving the latest data from the Bureau of Labor Statistics. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#29abe2] text-white px-6 py-2.5 rounded-xl font-bold text-[14px] hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Detailed Interactive Chart & Insights */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Detailed Chart Card */}
              {selectedMetric && (
                <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-[#29abe2]/40 before:to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-13 h-13 rounded-[18px] flex items-center justify-center shrink-0 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/40 ${getMetricStyle(selectedMetric.key, false).glassBox}`}>
                        {getMetricStyle(selectedMetric.key, false).icon}
                      </div>
                      <div>
                        <h2 className="text-[22px] font-black text-white tracking-tight">{selectedMetric.label}</h2>
                        <p className="text-[12px] text-slate-400 font-medium">12-Month BLS Trend Trajectory</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Current Index</div>
                      <div className="text-[26px] font-black text-white mt-0.5 tracking-tight">
                        {selectedMetric.index.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* SVG Line/Area Chart */}
                  <div className="h-[240px] w-full mt-8 relative">
                    <MetricAreaChart sparkline={selectedMetric.sparkline} />
                  </div>

                  {/* Monthly Trend Indicators */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-800/80">
                    <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-4.5 flex justify-between items-center transition-all shadow-md shadow-black/20">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">MoM Change</div>
                        <div className="text-[20px] font-black text-white mt-1">
                          {selectedMetric.mom !== null ? `${selectedMetric.mom > 0 ? '+' : ''}${selectedMetric.mom}%` : '—'}
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl shadow-xs">
                        {selectedMetric.mom !== null ? (
                          selectedMetric.mom > 0 ? (
                            <TrendingUp className="text-[#f0997b]" size={20} />
                          ) : selectedMetric.mom < 0 ? (
                            <TrendingDown className="text-[#5dcaa5]" size={20} />
                          ) : (
                            <Minus className="text-[#8b95a3]" size={20} />
                          )
                        ) : '—'}
                      </div>
                    </div>

                    <div className="backdrop-blur-xl bg-white/[0.04] border border-white/10 hover:border-white/20 rounded-2xl p-4.5 flex justify-between items-center transition-all shadow-md shadow-black/20">
                      <div>
                        <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">YoY Change</div>
                        <div className="text-[20px] font-black text-white mt-1">
                          {selectedMetric.yoy !== null ? `${selectedMetric.yoy > 0 ? '+' : ''}${selectedMetric.yoy}%` : '—'}
                        </div>
                      </div>
                      <div className="p-2.5 bg-slate-900/80 border border-slate-700/60 rounded-xl shadow-xs">
                        {selectedMetric.yoy !== null ? (
                          selectedMetric.yoy > 0 ? (
                            <TrendingUp className="text-[#f0997b]" size={20} />
                          ) : selectedMetric.yoy < 0 ? (
                            <TrendingDown className="text-[#5dcaa5]" size={20} />
                          ) : (
                            <Minus className="text-[#8b95a3]" size={20} />
                          )
                        ) : '—'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Insights Card */}
              {selectedMetric && (
                <div className="relative overflow-hidden backdrop-blur-2xl bg-slate-900/80 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/40 group before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#29abe2]/10 rounded-full filter blur-2xl transition-all duration-300 group-hover:bg-[#29abe2]/15 pointer-events-none" />
                  <h3 className="text-[18px] font-black text-white mb-4 flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#29abe2]/15 border border-[#29abe2]/30 text-[#29abe2]">
                      <BookOpen size={16} />
                    </div>
                    <span>CarMatrix Market Analysis & Strategy</span>
                  </h3>
                  <div className="backdrop-blur-xl bg-white/[0.03] border border-white/10 rounded-2xl p-5 shadow-inner">
                    <p className="text-[14.5px] leading-relaxed text-slate-200 font-medium">
                      {getInsightText(selectedMetric.key, selectedMetric.yoy)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[12px] text-slate-400 font-semibold">
                    <HelpCircle size={14} className="text-[#29abe2]" /> 
                    <span>Shopper Tip: Check live inventory valuations in our tools to negotiate against these official CPI trends.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Metrics Cards & Summary */}
            <div className="space-y-6">
              <div className="text-[12px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#29abe2]"></span>
                Select Index Category
              </div>
              
              <div className="space-y-3.5">
                {data.metrics.map((m) => {
                  const isActive = m.key === selectedKey;
                  const pct = m.mom ?? m.yoy;
                  const isPositive = pct !== null && pct > 0;
                  const isNegative = pct !== null && pct < 0;

                  return (
                    <button 
                      key={m.key}
                      onClick={() => setSelectedKey(m.key)}
                      className={`w-full text-left relative overflow-hidden rounded-2xl p-4.5 cursor-pointer transition-all duration-200 flex justify-between items-center ${
                        isActive 
                          ? 'backdrop-blur-2xl bg-gradient-to-r from-[#29abe2]/20 via-sky-600/15 to-slate-900/90 border border-[#29abe2] text-white shadow-[0_0_25px_rgba(41,171,226,0.3)] ring-1 ring-[#29abe2]/50 -translate-y-1 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent' 
                          : 'backdrop-blur-xl bg-slate-900/60 hover:bg-slate-800/70 border border-slate-700/60 hover:border-sky-400/40 text-slate-300 hover:text-white shadow-lg shadow-black/25 hover:-translate-y-0.5 group before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-11 h-11 rounded-[16px] flex items-center justify-center shrink-0 backdrop-blur-xl border transition-all duration-300 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/40 group-hover:scale-105 ${getMetricStyle(m.key, isActive).glassBox}`}>
                          {getMetricStyle(m.key, isActive).icon}
                        </div>
                        <div>
                          <h4 className="text-[14.5px] font-bold text-white leading-snug">{m.label}</h4>
                          <span className="text-[11.5px] text-slate-400 font-medium">Index: {m.index.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-[14.5px] font-black flex items-center justify-end gap-1 ${
                          isPositive ? 'text-[#f0997b]' : isNegative ? 'text-[#5dcaa5]' : 'text-slate-400'
                        }`}>
                          {pct !== null ? `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%` : '—'}
                          {pct !== null ? (
                            pct > 0 ? <TrendingUp size={14} /> : pct < 0 ? <TrendingDown size={14} /> : <Minus size={14} />
                          ) : null}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">vs. last month</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Data Transparency Box */}
              <div className="relative overflow-hidden backdrop-blur-xl bg-slate-900/70 border border-slate-700/70 rounded-2xl p-5 text-[12px] leading-relaxed text-slate-400 shadow-xl shadow-black/20 before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent">
                <h4 className="font-extrabold text-white mb-2 uppercase tracking-wider text-[11px] flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>Data Transparency & Method</span>
                </h4>
                The indexes displayed are calculated monthly by the Bureau of Labor Statistics (BLS) using consumer transaction baskets. Sparklines represent index fluctuations over the last 12 reporting cycles. Year-over-Year (YoY) figures reflect long-term trends, while Month-over-Month (MoM) captures short-term market volatility.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricAreaChart({ sparkline }: { sparkline: (number | null)[] }) {
  // Filter out nulls to calculate bounds safely
  const cleanValues = sparkline.filter((v): v is number => v !== null);
  if (cleanValues.length < 2) return null;

  const min = Math.min(...cleanValues);
  const max = Math.max(...cleanValues);
  const range = max - min || 1;
  const width = 600;
  const height = 240;
  const paddingY = 20;
  const paddingX = 10;

  const points = sparkline.map((v, i) => {
    const x = paddingX + (i / (sparkline.length - 1)) * (width - paddingX * 2);
    // Fallback if v is null: use the average or let it fall to min
    const val = v !== null ? v : min;
    const y = height - paddingY - ((val - min) / range) * (height - paddingY * 2);
    return { x, y, val, index: i, isNull: v === null };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${height} L ${points[0].x.toFixed(1)} ${height} Z`;

  return (
    <svg 
      viewBox={`0 0 ${width} ${height}`} 
      className="w-full h-full" 
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#29abe2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#29abe2" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      <line x1="0" y1={paddingY} x2={width} y2={paddingY} stroke="#232c38" strokeWidth="0.5" strokeDasharray="4 4" />
      <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#232c38" strokeWidth="0.5" strokeDasharray="4 4" />
      <line x1="0" y1={height - paddingY} x2={width} y2={height - paddingY} stroke="#232c38" strokeWidth="0.5" strokeDasharray="4 4" />

      {/* Filled Area */}
      <path d={areaPath} fill="url(#chartGrad)" />

      {/* Stroke Line */}
      <path d={linePath} fill="none" stroke="#29abe2" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

      {/* Point Dots */}
      {points.map((p, idx) => (
        <g key={idx}>
          <circle 
            cx={p.x} 
            cy={p.y} 
            r="4" 
            className="fill-[#0d1117] stroke-[#29abe2] stroke-[2] hover:r-6 cursor-pointer transition-all" 
          />
          {/* Index labels on first/last points */}
          {(idx === 0 || idx === points.length - 1) && (
            <text 
              x={p.x + (idx === 0 ? 8 : -32)} 
              y={p.y - 10} 
              fill="#7d8896" 
              fontSize="10" 
              fontWeight="bold"
            >
              {p.val.toFixed(1)}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
