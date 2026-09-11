import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, Minus, ArrowLeft, 
  HelpCircle, ShieldCheck, Wrench, Car, Sparkles, BookOpen 
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

  const getMetricIcon = (key: string) => {
    switch (key) {
      case 'usedCars': return <Car className="text-[#29abe2]" size={20} />;
      case 'newVehicles': return <Sparkles className="text-amber-400" size={20} />;
      case 'repairs': return <Wrench className="text-emerald-400" size={20} />;
      case 'insurance': return <ShieldCheck className="text-indigo-400" size={20} />;
      default: return <Car className="text-[#29abe2]" size={20} />;
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
    <div className="min-h-screen bg-[#07090e] text-[#e8edf2] font-sans selection:bg-[#29abe2]/20 pb-20">
      {/* Top Header */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[13px] font-semibold text-[#7d8896] hover:text-[#29abe2] transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#161d26] pb-8">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-bold text-[#29abe2] uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse"></span>
              Live Market Indicators
            </div>
            <h1 className="text-[36px] md:text-[44px] font-extrabold tracking-tight text-white leading-tight">
              Consumer Market Pulse
            </h1>
            <p className="text-[#8b95a3] font-medium text-[15px] max-w-[650px] mt-2 leading-relaxed">
              Track real-time inflation trends, price indexes, and overhead costs in the automotive industry compiled directly from the U.S. Bureau of Labor Statistics (BLS).
            </p>
          </div>
          <div className="bg-[#0d1117] border border-[#232c38] rounded-xl px-5 py-4 shrink-0 min-w-[200px]">
            <div className="text-[11px] font-semibold text-[#7d8896] uppercase tracking-wider mb-1">Last Updated</div>
            <div className="text-[16px] font-bold text-white">
              {data ? data.metrics[0]?.asOf : 'Loading...'}
            </div>
            <div className="text-[11px] text-[#7d8896] mt-1.5 flex items-center gap-1.5">
              <HelpCircle size={12} /> Edge cached 12h
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-[300px] bg-[#0d1117] rounded-2xl animate-pulse" />
              <div className="h-[200px] bg-[#0d1117] rounded-2xl animate-pulse" />
            </div>
            <div className="h-[520px] bg-[#0d1117] rounded-2xl animate-pulse" />
          </div>
        ) : error || !data ? (
          <div className="bg-[#1c1214] border border-[#ff5555]/30 rounded-2xl p-8 text-center max-w-[600px] mx-auto my-12">
            <h3 className="text-xl font-bold text-[#f0997b] mb-2">Failed to Load Market Pulse</h3>
            <p className="text-[#8b95a3] text-[14px] mb-6">
              There was an issue retrieving the latest data from the Bureau of Labor Statistics. Please try again later.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[#29abe2] text-white px-6 py-2 rounded-full font-bold text-[14px] hover:bg-[#2089b5] transition-colors"
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
                <div className="bg-[#0d1117] border border-[#232c38] rounded-2xl p-6 shadow-xl">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#161d26] p-2.5 rounded-lg border border-[#232c38]">
                        {getMetricIcon(selectedMetric.key)}
                      </div>
                      <div>
                        <h2 className="text-[20px] font-bold text-white">{selectedMetric.label}</h2>
                        <p className="text-[12px] text-[#7d8896] font-medium">12-Month Index Trend</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-[12px] text-[#7d8896] font-medium">Current Index</div>
                      <div className="text-[24px] font-bold text-white mt-0.5">
                        {selectedMetric.index.toFixed(1)}
                      </div>
                    </div>
                  </div>

                  {/* SVG Line/Area Chart */}
                  <div className="h-[240px] w-full mt-8 relative">
                    <MetricAreaChart sparkline={selectedMetric.sparkline} />
                  </div>

                  {/* Monthly Trend Indicators */}
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-[#161d26]">
                    <div className="bg-[#161d26] border border-[#232c38] rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-[11px] text-[#7d8896] uppercase tracking-wider">MoM Change</div>
                        <div className="text-[18px] font-bold text-white mt-1">
                          {selectedMetric.mom !== null ? `${selectedMetric.mom > 0 ? '+' : ''}${selectedMetric.mom}%` : '—'}
                        </div>
                      </div>
                      <div className="p-2 bg-[#0d1117] rounded-lg">
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

                    <div className="bg-[#161d26] border border-[#232c38] rounded-xl p-4 flex justify-between items-center">
                      <div>
                        <div className="text-[11px] text-[#7d8896] uppercase tracking-wider">YoY Change</div>
                        <div className="text-[18px] font-bold text-white mt-1">
                          {selectedMetric.yoy !== null ? `${selectedMetric.yoy > 0 ? '+' : ''}${selectedMetric.yoy}%` : '—'}
                        </div>
                      </div>
                      <div className="p-2 bg-[#0d1117] rounded-lg">
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
                <div className="bg-[#0d1117] border border-[#232c38] rounded-2xl p-6 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#29abe2]/5 rounded-full filter blur-xl transition-all group-hover:bg-[#29abe2]/10" />
                  <h3 className="text-[18px] font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen size={18} className="text-[#29abe2]" />
                    CarMatrix Market Analysis & Advice
                  </h3>
                  <div className="bg-[#161d26] border border-[#232c38] rounded-xl p-5">
                    <p className="text-[14px] leading-relaxed text-[#c9c9c9] font-medium">
                      {getInsightText(selectedMetric.key, selectedMetric.yoy)}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-[12px] text-[#7d8896] font-semibold">
                    <HelpCircle size={14} /> 
                    Tip: Compare prices in our Shop page to find local deals matching these index indicators.
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Metrics Cards & Summary */}
            <div className="space-y-6">
              <div className="text-[14px] font-bold text-[#7d8896] uppercase tracking-wider">Select Index</div>
              
              <div className="space-y-3">
                {data.metrics.map((m) => {
                  const isActive = m.key === selectedKey;
                  const pct = m.mom ?? m.yoy;
                  const isPositive = pct !== null && pct > 0;
                  const isNegative = pct !== null && pct < 0;

                  return (
                    <div 
                      key={m.key}
                      onClick={() => setSelectedKey(m.key)}
                      className={`cursor-pointer border rounded-2xl p-5 transition-all flex justify-between items-center ${
                        isActive 
                          ? 'bg-[#0d1117] border-[#29abe2] shadow-[0_0_15px_rgba(41,171,226,0.15)]' 
                          : 'bg-[#0d1117]/60 border-[#232c38] hover:border-[#7d8896]/30 hover:bg-[#0d1117]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-lg border ${
                          isActive 
                            ? 'bg-[#161d26] border-[#29abe2]/30' 
                            : 'bg-[#161d26]/40 border-[#232c38]'
                        }`}>
                          {getMetricIcon(m.key)}
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-white">{m.label}</h4>
                          <span className="text-[11.5px] text-[#7d8896]">Index: {m.index.toFixed(1)}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`text-[14px] font-bold flex items-center justify-end gap-1 ${
                          isPositive ? 'text-[#f0997b]' : isNegative ? 'text-[#5dcaa5]' : 'text-[#8b95a3]'
                        }`}>
                          {pct !== null ? `${pct > 0 ? '+' : ''}${pct.toFixed(1)}%` : '—'}
                          {pct !== null ? (
                            pct > 0 ? <TrendingUp size={14} /> : pct < 0 ? <TrendingDown size={14} /> : <Minus size={14} />
                          ) : null}
                        </div>
                        <div className="text-[10px] text-[#7d8896] font-semibold uppercase mt-0.5">vs. last month</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Transparency Box */}
              <div className="bg-[#0d1117] border border-[#232c38] rounded-2xl p-5 text-[12px] leading-relaxed text-[#7d8896]">
                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-[10px]">Data transparency & method</h4>
                The indexes displayed are calculated monthly by the Bureau of Labor Statistics (BLS) using sample baskets of consumer transactions. Sparklines represent index fluctuations over the last 12 reporting cycles. Year-over-Year (YoY) figures represent long-term trends, while Month-over-Month (MoM) tracks short-term market volatility.
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
