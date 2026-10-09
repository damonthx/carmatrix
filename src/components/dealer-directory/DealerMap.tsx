import React, { useState, useMemo } from 'react';
import { 
  MapPin, Navigation, ZoomIn, ZoomOut, RotateCcw, 
  Layers, ExternalLink, ShieldCheck, Star, Car, ArrowRight, X
} from 'lucide-react';
import { EnrichedDealer } from './dealerTypes';

interface DealerMapProps {
  dealers: EnrichedDealer[];
  selectedDealerId: string | null;
  onSelectDealer: (dealer: EnrichedDealer) => void;
  onViewProfile: (dealer: EnrichedDealer) => void;
}

// Bounding box for DFW Metroplex coordinates with margins
const DFW_BOUNDS = {
  minLat: 32.50,
  maxLat: 33.35,
  minLng: -97.60,
  maxLng: -96.50
};

export const DealerMap: React.FC<DealerMapProps> = ({
  dealers,
  selectedDealerId,
  onSelectDealer,
  onViewProfile
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredDealerId, setHoveredDealerId] = useState<string | null>(null);
  const [mapStyle, setMapStyle] = useState<'light' | 'tech'>('light');

  // Currently focused dealer for popup
  const activeDealer = useMemo(() => {
    return dealers.find(d => d.id === selectedDealerId) || null;
  }, [dealers, selectedDealerId]);

  // Project GPS lat/long to SVG percentages (0% - 100%)
  const projectCoords = (lat?: number | null, lng?: number | null) => {
    if (!lat || !lng) return { x: 50, y: 50 };

    const x = ((lng - DFW_BOUNDS.minLng) / (DFW_BOUNDS.maxLng - DFW_BOUNDS.minLng)) * 100;
    // Invert latitude because SVG Y goes downward
    const y = ((DFW_BOUNDS.maxLat - lat) / (DFW_BOUNDS.maxLat - DFW_BOUNDS.minLat)) * 100;

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
  };

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.2, Math.max(0.8, prev + delta)));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-full min-h-[520px] lg:min-h-[720px] rounded-[28px] overflow-hidden border border-white/80 shadow-[0_16px_40px_rgba(15,23,42,0.08)] bg-gradient-to-b from-slate-100/90 via-sky-50/60 to-slate-100/90 backdrop-blur-xl flex flex-col font-poppins select-none">
      
      {/* Top Map Controls Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Metro badge */}
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/80 shadow-sm flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#29abe2] animate-pulse" />
          <span className="text-xs font-bold text-slate-800 tracking-tight">Dallas–Fort Worth Metroplex</span>
          <span className="text-[11px] font-semibold text-slate-400">({dealers.length} active pins)</span>
        </div>

        {/* Zoom & Style Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-2xl border border-white/80 shadow-sm">
          <button
            onClick={() => handleZoom(0.2)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#29abe2] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => handleZoom(-0.2)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#29abe2] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:text-[#29abe2] hover:bg-slate-50 transition-colors cursor-pointer"
            title="Reset View"
            aria-label="Reset map view"
          >
            <RotateCcw size={15} />
          </button>
          <div className="w-px h-4 bg-slate-200 mx-0.5" />
          <button
            onClick={() => setMapStyle(s => s === 'light' ? 'tech' : 'light')}
            className={`px-2.5 h-8 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer ${
              mapStyle === 'tech' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Map Canvas"
          >
            <Layers size={13} />
            <span>{mapStyle === 'light' ? 'Light' : 'Tech'}</span>
          </button>
        </div>
      </div>

      {/* SVG Vector Map Canvas */}
      <div className={`relative flex-1 w-full h-full overflow-hidden transition-colors duration-500 ${
        mapStyle === 'tech' ? 'bg-[#0f172a]' : 'bg-[#eef4f8]'
      }`}>
        <svg 
          viewBox="0 0 1000 800" 
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke={mapStyle === 'tech' ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.04)'} 
                strokeWidth="1" 
              />
            </pattern>
            {/* Ambient Radial Glow */}
            <radialGradient id="dfwGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#29abe2" stopOpacity={mapStyle === 'tech' ? "0.15" : "0.08"} />
              <stop offset="100%" stopColor="#29abe2" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid & Core Ambient Glow */}
          <rect width="1000" height="800" fill="url(#mapGrid)" />
          <circle cx="500" cy="400" r="380" fill="url(#dfwGlow)" />

          {/* Major Metro Highways & Thoroughfares (Stylized DFW Road Network) */}
          <g className={`transition-opacity duration-300 ${mapStyle === 'tech' ? 'opacity-30' : 'opacity-25'}`}>
            {/* I-35W / Fort Worth corridor */}
            <path d="M 280 40 Q 270 300 290 520 T 320 760" fill="none" stroke="#29abe2" strokeWidth="3" strokeDasharray="6,4" />
            {/* I-35E / Dallas corridor */}
            <path d="M 680 40 Q 640 280 650 500 T 630 760" fill="none" stroke="#29abe2" strokeWidth="3" strokeDasharray="6,4" />
            {/* I-30 East-West connector (Fort Worth to Arlington to Dallas) */}
            <path d="M 120 480 Q 300 480 480 490 T 880 470" fill="none" stroke="#38bdf8" strokeWidth="3.5" />
            {/* I-20 Southern Loop */}
            <path d="M 100 620 Q 350 630 550 630 T 920 620" fill="none" stroke="#60a5fa" strokeWidth="3" />
            {/* Loop 820 / Tarrant Loop */}
            <ellipse cx="280" cy="480" rx="140" ry="120" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
            {/* I-635 / LBJ Freeway (Dallas Northern Loop) */}
            <ellipse cx="650" cy="380" rx="190" ry="140" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4,4" />
            {/* Hwy 114 / Grapevine & Airport Expressway */}
            <path d="M 320 380 Q 460 300 580 320 T 650 420" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
            {/* Hwy 121 (Southwest Parkway to Frisco/McKinney) */}
            <path d="M 240 560 Q 420 380 620 220 T 820 120" fill="none" stroke="#0ea5e9" strokeWidth="2.5" />
            {/* George Bush Turnpike (PGBT) */}
            <path d="M 400 460 Q 520 250 780 260 T 840 460" fill="none" stroke="#94a3b8" strokeWidth="2" />
          </g>

          {/* Metro Sub-Market Labels */}
          <g className={`text-[13px] font-black tracking-wider uppercase select-none transition-colors duration-300 ${
            mapStyle === 'tech' ? 'fill-slate-500' : 'fill-slate-400'
          }`}>
            <text x="640" y="470" textAnchor="middle">Dallas</text>
            <text x="270" y="490" textAnchor="middle">Fort Worth</text>
            <text x="470" y="520" textAnchor="middle">Arlington</text>
            <text x="460" y="320" textAnchor="middle">Grapevine</text>
            <text x="710" y="270" textAnchor="middle">Plano</text>
            <text x="680" y="180" textAnchor="middle">Frisco</text>
            <text x="540" y="410" textAnchor="middle">Irving</text>
            <text x="820" y="160" textAnchor="middle">McKinney</text>
            <text x="360" y="120" textAnchor="middle">Denton</text>
          </g>

          {/* DFW International Airport Indicator */}
          <g transform="translate(470, 370)">
            <circle cx="0" cy="0" r="14" fill={mapStyle === 'tech' ? 'rgba(41,171,226,0.1)' : 'rgba(41,171,226,0.08)'} />
            <circle cx="0" cy="0" r="4" fill="#29abe2" />
            <text x="0" y="24" textAnchor="middle" className="text-[9px] font-bold fill-sky-500/80 uppercase tracking-widest">
              DFW Airport
            </text>
          </g>
        </svg>

        {/* Dealership Pins Layer (Absolute Projected Elements) */}
        <div className="absolute inset-0 pointer-events-none">
          {dealers.map(dealer => {
            const coords = projectCoords(dealer.latitude, dealer.longitude);
            const isSelected = dealer.id === selectedDealerId;
            const isHovered = dealer.id === hoveredDealerId;

            // Score-based pill gradient
            const score = dealer.price_transparency_score ?? 85;
            const scoreColor = score >= 88 
              ? 'bg-emerald-500 text-white shadow-emerald-500/30' 
              : score >= 75 
              ? 'bg-[#29abe2] text-white shadow-[#29abe2]/30' 
              : 'bg-amber-500 text-white shadow-amber-500/30';

            return (
              <div
                key={dealer.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto transition-transform duration-200 cursor-pointer"
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  zIndex: isSelected ? 40 : isHovered ? 35 : 10
                }}
                onMouseEnter={() => setHoveredDealerId(dealer.id)}
                onMouseLeave={() => setHoveredDealerId(null)}
                onClick={() => onSelectDealer(dealer)}
              >
                {/* Pulsing halo if selected or hovered */}
                {(isSelected || isHovered) && (
                  <span className="absolute -inset-2.5 rounded-full bg-[#29abe2]/30 animate-ping pointer-events-none" />
                )}

                {/* Marker Pill with Inventory Badge */}
                <div className={`group flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-lg border transition-all duration-200 ${
                  isSelected
                    ? 'bg-slate-900 text-white border-[#29abe2] ring-2 ring-[#29abe2]/50 scale-115'
                    : isHovered
                    ? 'bg-white text-slate-900 border-[#29abe2] scale-110 shadow-xl'
                    : 'bg-white/95 text-slate-800 border-white/90 hover:scale-105'
                }`}>
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${scoreColor}`}>
                    <Car size={10} className="stroke-[2.5]" />
                  </div>
                  
                  {/* Inventory count number badge */}
                  <span className="text-[11px] font-black tracking-tight leading-none">
                    {dealer.active_inventory_count || 120}
                  </span>

                  {/* Brand miniature or dot */}
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    score >= 88 ? 'bg-emerald-400' : 'bg-[#29abe2]'
                  }`} />
                </div>

                {/* Micro tooltip on hover showing dealer name */}
                {isHovered && !isSelected && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-slate-900 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xl border border-slate-700 pointer-events-none z-50">
                    {dealer.name}
                    <div className="text-[9px] text-[#29abe2] font-semibold">{dealer.city}, TX</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Dealer Pop-Over Card on Map */}
        {activeDealer && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[360px] z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-white/95 backdrop-blur-2xl rounded-2xl p-4.5 border border-white/80 shadow-[0_20px_50px_rgba(15,23,42,0.18)] text-slate-900 relative">
              
              {/* Close pin popup button */}
              <button 
                onClick={(e) => { e.stopPropagation(); onSelectDealer({} as any); }}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close dealer popup"
              >
                <X size={15} />
              </button>

              <div className="flex items-start gap-3 mb-2.5 pr-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 via-[#29abe2]/15 to-transparent border border-sky-300/40 flex items-center justify-center text-[#29abe2] shrink-0 font-black text-sm">
                  {activeDealer.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[14px] font-bold text-slate-900 truncate leading-snug">
                    {activeDealer.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate">
                    {activeDealer.street_address}, {activeDealer.city}, TX
                  </p>
                </div>
              </div>

              {/* Quick metrics in popup */}
              <div className="grid grid-cols-3 gap-2 py-2.5 my-2 border-y border-slate-100 text-center">
                <div className="bg-slate-50/80 rounded-xl p-1.5">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Inventory</span>
                  <span className="text-[13px] font-black text-slate-900">{activeDealer.active_inventory_count || 120}</span>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-1.5">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Integrity</span>
                  <span className="text-[13px] font-black text-emerald-600">
                    {activeDealer.price_transparency_score ?? 88}/100
                  </span>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-1.5">
                  <span className="text-[9.5px] uppercase font-bold text-slate-400 block">Market</span>
                  <span className="text-[13px] font-black text-[#29abe2]">
                    {activeDealer.price_delta_label || '-$650'}
                  </span>
                </div>
              </div>

              {/* Popup CTAs */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onViewProfile(activeDealer)}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 px-3 rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <ShieldCheck size={14} className="text-[#29abe2]" />
                  <span>Dealer Profile</span>
                </button>
                <a
                  href={activeDealer.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#29abe2] hover:bg-[#2295c5] text-white py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm shadow-[#29abe2]/20 cursor-pointer"
                >
                  <span>Inventory</span>
                  <ExternalLink size={12} />
                </a>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Bottom map legend */}
      <div className="px-5 py-2.5 bg-white/80 backdrop-blur-md border-t border-white/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>High Transparency (88+)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#29abe2]" />
            <span>Verified (75-87)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Moderate Caution (&lt;75)</span>
          </span>
        </div>
        <div className="text-[10.5px] text-slate-400 font-medium">
          Pin numbers indicate live vehicle stock count
        </div>
      </div>

    </div>
  );
};
