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
    <section className="rounded-2xl bg-[#0d1117] p-6 font-[Barlow]">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-[15px] font-medium tracking-wide text-[#e8edf2]">
          Market pulse
        </h2>
        <span className="text-[11.5px] text-[#7d8896]">
          {data ? `${data.metrics[0]?.asOf} · BLS data` : 'Loading…'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {(data?.metrics ?? Array.from({ length: 4 })).map((m, i) =>
          m ? <PulseCard key={m.key} metric={m} /> : <SkeletonCard key={i} />
        )}
      </div>

      {data && (
        <p className="mt-3 text-[11px] text-[#7d8896]">
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
    <div className="rounded-xl border-[0.5px] border-[#232c38] bg-[#161d26] px-3.5 py-3">
      <div className="text-xs text-[#8b95a3]">{label}</div>

      <div className="my-1.5 flex items-baseline gap-1.5">
        <span className="text-xl font-medium text-[#e8edf2]">
          {fmtPct(headline)}
        </span>
        <Direction value={headline} />
      </div>

      <Sparkline values={sparkline} />

      <div className="mt-1.5 flex justify-between text-[11px] text-[#7d8896]">
        <span>vs. last month</span>
        <span>{fmtPct(yoy)} YoY</span>
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
