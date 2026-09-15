import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Car, CarFront, Wrench, ShieldCheck } from 'lucide-react';

const BRAND = '#29abe2';

const METRIC_STYLES = {
  usedCars: {
    icon: Car,
    label: 'Used cars & trucks',
    gradient: 'from-[#29abe2]/25 via-sky-500/15 to-transparent',
    border: 'border-[#29abe2]/40',
    color: 'text-[#29abe2]',
    glow: 'shadow-[0_4px_16px_rgba(41,171,226,0.25)]'
  },
  newVehicles: {
    icon: CarFront,
    label: 'New vehicles',
    gradient: 'from-amber-400/25 via-amber-500/15 to-transparent',
    border: 'border-amber-400/40',
    color: 'text-amber-400',
    glow: 'shadow-[0_4px_16px_rgba(251,191,36,0.25)]'
  },
  repairs: {
    icon: Wrench,
    label: 'Maintenance & repair',
    gradient: 'from-emerald-400/25 via-emerald-500/15 to-transparent',
    border: 'border-emerald-400/40',
    color: 'text-emerald-400',
    glow: 'shadow-[0_4px_16px_rgba(52,211,153,0.25)]'
  },
  insurance: {
    icon: ShieldCheck,
    label: 'Vehicle insurance',
    gradient: 'from-indigo-400/25 via-purple-500/15 to-transparent',
    border: 'border-indigo-400/40',
    color: 'text-indigo-400',
    glow: 'shadow-[0_4px_16px_rgba(129,140,248,0.25)]'
  }
};

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
      <div className="mb-5 flex items-baseline justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#29abe2] animate-pulse shadow-[0_0_10px_#29abe2]"></span>
          <h2 className="text-[14px] font-extrabold tracking-wider uppercase text-white">
            Consumer Market Pulse
          </h2>
        </div>
        <span className="text-[11.5px] font-medium text-slate-400">
          {data ? `${data.metrics[0]?.asOf} · BLS data` : 'Loading…'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
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
  const { label, mom, yoy, sparkline, key } = metric;
  const style = METRIC_STYLES[key] || METRIC_STYLES.usedCars;
  const IconComponent = style.icon;
  // Lead with MoM for vehicle prices; YoY reads better for slow movers
  const headline = mom ?? yoy;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 hover:border-[#29abe2]/50 bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-black/25 group before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent">
      {/* Top row: Glassmorphic Curved Square Icon Box + Label */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className={`w-9 h-9 rounded-[14px] flex items-center justify-center shrink-0 backdrop-blur-xl bg-gradient-to-br ${style.gradient} border ${style.border} ${style.color} ${style.glow} group-hover:scale-105 group-hover:border-white/50 transition-all duration-300 relative overflow-hidden before:absolute before:inset-x-0 before:top-0 before:h-[1px] before:bg-white/40`}>
          <IconComponent size={18} className="drop-shadow-sm" />
        </div>
        <div className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate">
          {label}
        </div>
      </div>

      <div className="my-2 flex items-baseline gap-2">
        <span className="text-2xl font-black text-white tracking-tight">
          {fmtPct(headline)}
        </span>
        <Direction value={headline} />
      </div>

      <Sparkline values={sparkline} />

      <div className="mt-2.5 flex justify-between text-[11px] font-medium text-slate-400">
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
    <div className="h-[124px] animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
  );
}

function fmtPct(n) {
  if (n == null) return '—';
  const sign = n > 0 ? '+' : n < 0 ? '−' : '';
  return `${sign}${Math.abs(n).toFixed(1)}%`;
}

