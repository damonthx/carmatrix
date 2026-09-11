// MarketPulse.jsx
// CarMatrix "Market Pulse" card strip — reads /api/market-pulse (BLS CPI data).
// Stack assumptions: React, Tailwind v4, lucide-react, Barlow loaded globally.
// Brand: CarMatrix Blue #29abe2 on dark surfaces.

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const BRAND = '#29abe2';

export default function MarketPulse() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/market-pulse')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error) return null; // fail silent — never block the page on a widget

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-950 via-[#0a0f1d] to-slate-950 border border-slate-800/80 backdrop-blur-2xl p-6 md:p-7 shadow-2xl before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-sky-400/30 before:to-transparent">
      <div className="mb-4 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse"></span>
          <h2 className="text-[14px] font-extrabold tracking-wider uppercase text-white">
            Consumer Market Pulse
          </h2>
        </div>
        <span className="text-[11.5px] font-medium text-slate-400">
          {data ? `${data.metrics[0]?.asOf} · BLS data` : 'Loading…'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(data?.metrics ?? Array.from({ length: 4 })).map((m, i) =>
          m ? <PulseCard key={m.key} metric={m} /> : <SkeletonCard key={i} />
        )}
      </div>

      {data && (
        <p className="mt-3.5 text-[11px] text-slate-500 font-medium">
          Source: U.S. Bureau of Labor Statistics, Consumer Price Index.
        </p>
      )}
    </section>
  );
}

function PulseCard({ metric }) {
  const { label, mom, yoy, sparkline } = metric;
  // Lead with MoM for vehicle prices; YoY reads better for slow movers
  // like insurance/repairs — show both, headline the MoM.
  const headline = mom ?? yoy;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#29abe2]/50 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl px-4 py-3.5 transition-all duration-200 hover:-translate-y-1 shadow-lg shadow-black/25 group before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent">
      <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">{label}</div>

      <div className="my-2 flex items-baseline gap-2">
        <span className="text-2xl font-black text-white tracking-tight">
          {fmtPct(headline)}
        </span>
        <Direction value={headline} />
      </div>

      <Sparkline values={sparkline} />

      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
        <span>vs. last month</span>
        <span className="font-bold text-slate-200">{fmtPct(yoy)} YoY</span>
      </div>
    </div>
  );
}

function Direction({ value }) {
  if (value == null) return null;
  if (Math.abs(value) < 0.05)
    return <Minus size={14} className="text-[#8b95a3]" aria-label="flat" />;
  // Rising prices = warm (costs more), falling = cool (buyer-friendly).
  return value > 0 ? (
    <TrendingUp size={14} className="text-[#f0997b]" aria-label="rising" />
  ) : (
    <TrendingDown size={14} className="text-[#5dcaa5]" aria-label="falling" />
  );
}

function Sparkline({ values = [] }) {
  if (values.length < 2) return <div className="h-[26px]" />;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const W = 110;
  const H = 26;
  const pad = 3;

  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * W;
      const y = H - pad - ((v - min) / range) * (H - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-[26px] w-full"
      role="img"
      aria-label="12-month trend"
    >
      <polyline
        points={pts}
        fill="none"
        stroke={BRAND}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SkeletonCard() {
  return (
    <div className="h-[108px] animate-pulse rounded-xl border-[0.5px] border-[#232c38] bg-[#161d26]" />
  );
}

function fmtPct(n) {
  if (n == null) return '—';
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(1)}%`;
}
