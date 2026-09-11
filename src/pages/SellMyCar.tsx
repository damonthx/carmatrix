import React, { useState, useEffect, useRef } from 'react';
import { Search, ExternalLink, ArrowUpDown, RefreshCw, ShieldCheck, AlertCircle } from 'lucide-react';
// @ts-ignore
import heroVehicle from '../assets/hero-vehicle.png';
// @ts-ignore
import logoMark from '../assets/logo-mark.png';

interface SellMyCarProps {}

interface BuyerInfo {
  id: string;
  name: string;
  description: string;
  pills: string[];
  baseUrl: string;
  vinSupport: boolean;
}

const BUYERS: BuyerInfo[] = [
  {
    id: 'carvana',
    name: 'Carvana',
    description: 'Get a real, guaranteed offer in 2 minutes.',
    pills: ['100% Online', 'Home Pickup', '7-Day Offer'],
    baseUrl: 'https://www.carvana.com/sell-my-car',
    vinSupport: true
  },
  {
    id: 'carmax',
    name: 'CarMax',
    description: 'Bring it in or get an offer online.',
    pills: ['In-Person Option', 'Guaranteed Offer', '7-Day Offer'],
    baseUrl: 'https://www.carmax.com/sell-my-car',
    vinSupport: false
  },
  {
    id: 'kbb',
    name: 'KBB Instant Cash Offer',
    description: 'Instant cash offer redeemable at local dealers.',
    pills: ['Local Dealers', 'Kelley Blue Book Valuation', 'Quick Check'],
    baseUrl: 'https://www.kbb.com/sell-my-car/',
    vinSupport: true
  },
  {
    id: 'cargurus',
    name: 'CarGurus',
    description: 'Compare offers from multiple dealer networks.',
    pills: ['Top Dealer Bids', 'Free Pickup', 'Fast Payment'],
    baseUrl: 'https://www.cargurus.com/Cars/instant-max-cash-offer.html',
    vinSupport: false
  },
  {
    id: 'peddle',
    name: 'Peddle',
    description: 'Instant offers for cars in any condition.',
    pills: ['Any Condition', 'Nationwide Pickup', 'Cash on Spot'],
    baseUrl: 'https://www.peddle.com/',
    vinSupport: false
  },
  {
    id: 'vroom',
    name: 'Vroom',
    description: 'Free pickup and direct payment.',
    pills: ['Free Home Pickup', '7-Day Offer', 'Secure Pay'],
    baseUrl: 'https://www.vroom.com/sell-my-car',
    vinSupport: true
  },
  {
    id: 'bidbus',
    name: 'BidBus',
    description: 'Live dealer auctions · Available in CA and TX',
    pills: ['Dealer competition', 'Live auction', 'CA & TX only'],
    baseUrl: 'https://www.bidbus.com/',
    vinSupport: false
  },
  {
    id: 'autonation',
    name: 'AutoNation',
    description: "America's largest dealer group · 300+ locations",
    pills: ['Instant offer', '300+ locations', 'Same-day payment'],
    baseUrl: 'https://www.autonation.com/sell-your-car',
    vinSupport: true
  }
];

const VEHICLE_MAKES = [
  'Toyota',
  'Honda',
  'Ford',
  'Chevrolet',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Lexus'
];

const VEHICLE_MODELS: Record<string, string[]> = {
  'Toyota': ['RAV4', 'Camry', 'Prius', 'Tacoma', 'Highlander', 'Tundra'],
  'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
  'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus'],
  'Chevrolet': ['Silverado', 'Equinox', 'Malibu', 'Tahoe', 'Suburban'],
  'Nissan': ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Frontier'],
  'BMW': ['3 Series', '5 Series', 'X3', 'X5'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'GLC', 'GLE'],
  'Lexus': ['RX', 'ES', 'NX', 'GX']
};

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => (currentYear - i).toString());

const VEHICLE_IMAGE_URL = 'https://www.image2url.com/r2/default/images/1777076688091-58e09a91-5b3b-4dd7-b654-601a5c63f23f.png';

// Custom high-fidelity premium SVG icons to replace basic stock icons
const BestOffersIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="group-hover:scale-110 transition-transform duration-300 relative z-10"
  >
    <defs>
      <linearGradient id="gem-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#80f3ff" />
        <stop offset="50%" stopColor="#29abe2" />
        <stop offset="100%" stopColor="#0a2a4a" />
      </linearGradient>
      <linearGradient id="gem-grad-accent" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#29abe2" stopOpacity="0" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2L21 9L12 22L3 9L12 2Z" 
      fill="url(#gem-grad-primary)" 
      fillOpacity="0.1" 
      stroke="url(#gem-grad-primary)" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 2L17.5 9L12 16L6.5 9L12 2Z" 
      fill="url(#gem-grad-primary)" 
      fillOpacity="0.25" 
      stroke="url(#gem-grad-accent)" 
      strokeWidth="1" 
      strokeLinejoin="round" 
    />
    <path d="M12 2V16" stroke="url(#gem-grad-accent)" strokeWidth="1" />
    <path d="M3 9H21" stroke="url(#gem-grad-accent)" strokeWidth="0.75" strokeDasharray="2 2" />
    <path d="M18 5.5L19 6.5M19 5.5L18 6.5" stroke="#fff" strokeWidth="1.25" strokeLinecap="round" />
  </svg>
);

const FastEasyIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="group-hover:scale-110 transition-transform duration-300 relative z-10"
  >
    <defs>
      <linearGradient id="zap-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f0ff" />
        <stop offset="60%" stopColor="#29abe2" />
        <stop offset="100%" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="zap-grad-glow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#29abe2" stopOpacity="0.1" />
      </linearGradient>
    </defs>
    <path d="M5 16H9M3 12H7M6 8H10" stroke="#29abe2" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    <path 
      d="M14 2L6 13H12L10 22L18 11H12L14 2Z" 
      fill="url(#zap-grad-primary)" 
      fillOpacity="0.15" 
      transform="translate(-1, 1)" 
    />
    <path 
      d="M15 2L7 13H13L11 22L19 11H13L15 2Z" 
      fill="url(#zap-grad-primary)" 
      stroke="url(#zap-grad-glow)" 
      strokeWidth="1.25" 
      strokeLinejoin="round" 
    />
  </svg>
);

const SecureReliableIcon = () => (
  <svg 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="group-hover:scale-110 transition-transform duration-300 relative z-10"
  >
    <defs>
      <linearGradient id="lock-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00f0ff" />
        <stop offset="50%" stopColor="#29abe2" />
        <stop offset="100%" stopColor="#0A1929" />
      </linearGradient>
      <linearGradient id="lock-grad-shield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#29abe2" stopOpacity="0.05" />
      </linearGradient>
    </defs>
    <path 
      d="M12 2C16 3 20 4.5 20 8.5C20 14.5 15.5 19.5 12 21.5C8.5 19.5 4 14.5 4 8.5C4 4.5 8 3 12 2Z" 
      fill="url(#lock-grad-primary)" 
      fillOpacity="0.1" 
      stroke="url(#lock-grad-primary)" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    <path 
      d="M12 4.5C14.8 5.3 17.5 6.3 17.5 9.2C17.5 13.5 14.2 17.5 12 19.1C9.8 17.5 6.5 13.5 6.5 9.2C6.5 6.3 9.2 5.3 12 4.5Z" 
      fill="url(#lock-grad-shield)" 
      fillOpacity="0.1" 
      stroke="url(#lock-grad-shield)" 
      strokeWidth="1" 
      strokeLinejoin="round" 
    />
    <rect 
      x="10" 
      y="11" 
      width="4" 
      height="4" 
      rx="1" 
      stroke="#ffffff" 
      strokeWidth="1.25" 
      fill="#29abe2" 
      fillOpacity="0.3" 
    />
    <path 
      d="M10.75 11V9.5C10.75 8.7 11.3 8 12 8C12.7 8 13.25 8.7 13.25 9.5V11" 
      stroke="#ffffff" 
      strokeWidth="1.25" 
      strokeLinecap="round" 
    />
  </svg>
);

const SellMyCar: React.FC<SellMyCarProps> = () => {
  // Form State
  const [vin, setVin] = useState('');
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('');
  
  // Ref for scrolling to the buyer lineup section
  const buyerGridRef = useRef<HTMLDivElement>(null);

  const handleMakeChange = (selectedMake: string) => {
    setMake(selectedMake);
    setModel(''); // Reset model when make changes
  };

  // Offers State
  const [offers, setOffers] = useState<Record<string, number>>({});

  // Load offers on mount and when VIN changes
  useEffect(() => {
    const key = vin ? `carmeta_sell_offers_${vin.trim()}` : 'carmeta_sell_offers';
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        setOffers(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved offers', e);
        setOffers({});
      }
    } else {
      setOffers({});
    }
  }, [vin]);

  // Persist offers to localStorage on change
  const saveOffers = (newOffers: Record<string, number>) => {
    setOffers(newOffers);
    const key = vin ? `carmeta_sell_offers_${vin.trim()}` : 'carmeta_sell_offers';
    localStorage.setItem(key, JSON.stringify(newOffers));
  };

  const handleOfferChange = (buyerId: string, value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
    const updated = { ...offers, [buyerId]: numericValue };
    saveOffers(updated);
  };

  // Pre-populate if there is a vehicle already stored in local context (e.g. from favorites or last viewed)
  useEffect(() => {
    const lastViewed = localStorage.getItem('carmeta_last_viewed_vehicle');
    if (lastViewed) {
      try {
        const vehicle = JSON.parse(lastViewed);
        if (vehicle.vin) setVin(vehicle.vin);
        if (vehicle.year) setYear(vehicle.year.toString());
        if (vehicle.make) setMake(vehicle.make);
        if (vehicle.model) setModel(vehicle.model);
        if (vehicle.mileage) setMileage(vehicle.mileage.toString());
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleReset = () => {
    setVin('');
    setYear('');
    setMake('');
    setModel('');
    setMileage('');
    setCondition('');
    setOffers({});
    localStorage.removeItem(vin ? `carmeta_sell_offers_${vin.trim()}` : 'carmeta_sell_offers');
  };

  // Helper to build deep links
  const getBuyerUrl = (buyer: BuyerInfo): string => {
    if (buyer.vinSupport && vin.trim()) {
      const separator = buyer.baseUrl.includes('?') ? '&' : '?';
      return `${buyer.baseUrl}${separator}vin=${encodeURIComponent(vin.trim().toUpperCase())}`;
    }
    return buyer.baseUrl;
  };

  const handleGetOffer = (buyer: BuyerInfo) => {
    window.open(getBuyerUrl(buyer), '_blank');
  };

  const handleOpenAll = () => {
    let blocked = false;
    BUYERS.forEach((buyer) => {
      try {
        const newWin = window.open(getBuyerUrl(buyer), '_blank');
        if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
          blocked = true;
        }
      } catch (e) {
        blocked = true;
      }
    });
    if (blocked) {
      alert(`⚠️ Popups Blocked: Please click the popup blocker icon in your browser's address bar and select 'Always allow popups' to open all ${BUYERS.length} buyer sites simultaneously.`);
    }
  };

  // Ranked offers calculation
  const rankedOffers = (Object.entries(offers) as [string, number][])
    .filter(([_, value]) => value > 0)
    .map(([buyerId, val]) => {
      const buyer = BUYERS.find((b) => b.id === buyerId);
      return {
        id: buyerId,
        name: buyer ? buyer.name : buyerId,
        value: val
      };
    })
    .sort((a, b) => b.value - a.value);

  const highestOffer = rankedOffers.length > 0 ? rankedOffers[0].value : 0;

  return (
    <div className="w-full font-sans animate-in fade-in duration-300">
      {/* Full-width dark hero banner */}
      <div className="bg-[#0A1929] w-full text-white py-12 md:py-20 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Column: Headline, Trust Badges, Form */}
          <div>
            <h1 className="text-white font-bold text-5xl tracking-tight leading-tight flex flex-col">
              <span>Sell your car for</span>
              <span className="text-[#29abe2]">the best price</span>
            </h1>
            <p className="text-white/70 text-lg mt-3 font-medium">
              Compare multiple offers in under 2 minutes.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-col sm:flex-row gap-6 mt-8">
              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#29abe2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <BestOffersIcon />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Best Offers</h4>
                  <p className="text-white/60 text-xs mt-0.5">Compare top offers from trusted buyers</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#29abe2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <FastEasyIcon />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Fast & Easy</h4>
                  <p className="text-white/60 text-xs mt-0.5">Get offers in under 2 minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center shrink-0 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-md relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#29abe2]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <SecureReliableIcon />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Secure & Reliable</h4>
                  <p className="text-white/60 text-xs mt-0.5">Safe, private, and hassle-free</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Logo Mark & Lexus Image */}
          <div className="relative w-full h-full min-h-[350px] md:min-h-[450px] flex items-center justify-center overflow-visible">
            {/* Background Logo Mark Image */}
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none scale-[1.45] -translate-y-16 z-0">
              <img
                src={logoMark}
                alt="CarMatrix Speed-Stripes Logo"
                className="w-full max-w-[420px] h-auto object-contain"
              />
            </div>

            {/* Radial Gradient behind the car */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,_rgba(41,171,226,0.22)_0%,_transparent_70%)] blur-3xl pointer-events-none z-0" />

            {/* White Vehicle Image Overlay */}
            <div className="relative w-full z-10 flex justify-center">
              <img
                src={heroVehicle}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = VEHICLE_IMAGE_URL;
                }}
                alt="Vehicle image"
                className="w-full max-w-[520px] md:max-w-none h-auto object-contain drop-shadow-[0_20px_45px_rgba(0,0,0,0.55)] transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content (constrained) */}
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
        
        {/* 1. Page Header */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[32px] p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#29abe2] tracking-tight">
            Sell My Car
          </h1>
          <p className="text-slate-650 font-semibold text-sm md:text-base mt-2 max-w-[800px] leading-relaxed">
            Enter your details once. Open every buyer in a new tab. Come back and log your offers to find the best deal.
          </p>
        </div>

      {/* 2. Vehicle Input Form */}
      <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[28px] p-6 md:p-8 mb-10">
        <h2 className="text-lg font-bold text-[#29abe2] mb-6 flex items-center gap-2">
          <Search size={18} className="text-[#29abe2]" /> Vehicle Specifications
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              VIN (Vehicle Identification Number)
            </label>
            <input
              type="text"
              placeholder="17-digit VIN"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-inner uppercase placeholder:normal-case transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Year
            </label>
            <input
              type="number"
              min="1990"
              max={new Date().getFullYear() + 1}
              placeholder="e.g. 2020"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-inner transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Make
            </label>
            <input
              type="text"
              placeholder="e.g. Toyota"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-inner transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Model
            </label>
            <input
              type="text"
              placeholder="e.g. RAV4"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-inner transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mileage
            </label>
            <input
              type="number"
              placeholder="Current odometer"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-inner transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Overall Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-[#29abe2]/50 shadow-sm transition-all"
            >
              <option value="">Select Condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Poor">Poor</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold px-5 py-2.5 text-sm transition-all"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>
      </div>

      {/* 4. Open All Buyers Button */}
      <div ref={buyerGridRef} className="mb-6 flex flex-col items-end gap-2">
        <button
          onClick={handleOpenAll}
          className="flex items-center gap-2 rounded-2xl bg-[#29abe2] hover:bg-[#2089b5] text-white font-black px-6 py-3.5 text-sm transition-all shadow-md shadow-[#29abe2]/20 hover:scale-[1.01] active:scale-[0.99]"
        >
          <ExternalLink size={16} /> Open all buyers in new tabs
        </button>
        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
          <AlertCircle size={12} className="text-amber-500" />
          Note: If only one site opens, click the address bar icon to "Always allow popups".
        </span>
      </div>

      {/* 3. Buyer Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {BUYERS.map((buyer) => {
          const currentOfferVal = offers[buyer.id] || '';
          return (
            <div key={buyer.id} className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[24px] p-6 flex flex-col justify-between group transition-all duration-300 hover:shadow-lg">
              <div>
                <h3 className="text-lg font-extrabold text-[#29abe2] mb-1 group-hover:text-[#2089b5] transition-colors">
                  {buyer.name}
                </h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
                  {buyer.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {buyer.pills.map((pill, i) => (
                    <span key={i} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 uppercase tracking-wider">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-50">
                <button
                  onClick={() => handleGetOffer(buyer)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 text-xs transition-colors"
                >
                  Get Offer <ExternalLink size={12} />
                </button>

                {/* Offer Logger input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Your Offer ($)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 24500"
                    value={currentOfferVal}
                    onChange={(e) => handleOfferChange(buyer.id, e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-bold focus:outline-none focus:ring-1 focus:ring-[#29abe2] shadow-sm transition-all"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Ranked Offers Table */}
      {rankedOffers.length > 0 && (
        <div className="bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] rounded-[28px] p-6 md:p-8 border border-slate-100 shadow-sm mb-8 overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-[#29abe2] flex items-center gap-2">
              <ArrowUpDown size={18} className="text-[#29abe2]" /> Ranked Offers
            </h2>
            <button
              onClick={() => saveOffers({})}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold px-3 py-1.5 text-[11px] transition-colors"
            >
              <RefreshCw size={11} /> Clear all offers
            </button>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-800 border-collapse">
              <thead>
                <tr className="border-b border-slate-200/60 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Your Offer</th>
                  <th className="py-3 px-4 text-right">vs. Highest (delta)</th>
                </tr>
              </thead>
              <tbody>
                {rankedOffers.map((item, idx) => {
                  const isTop = idx === 0;
                  const delta = item.value - highestOffer;

                  return (
                    <tr 
                      key={item.id} 
                      className={`border-b border-slate-100 transition-colors hover:bg-slate-50/50 ${
                        isTop ? 'border-l-4 border-l-[#29abe2] bg-[#29abe2]/5 font-bold' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-extrabold text-slate-900">
                        {item.name}
                        {isTop && (
                          <span className="ml-2 rounded-full bg-[#29abe2]/20 px-2 py-0.5 text-[9px] font-extrabold text-[#2089b5] uppercase tracking-wider">
                            Best Deal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-900 font-bold">
                        ${item.value.toLocaleString()}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-semibold ${
                        isTop ? 'text-slate-400' : 'text-rose-500'
                      }`}>
                        {isTop ? '—' : `-$${Math.abs(delta).toLocaleString()}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Pro Tip Callout */}
      <div className="bg-white/40 backdrop-blur-xl border border-[#29abe2]/30 shadow-[0_8px_32px_0_rgba(41,171,226,0.05)] rounded-[24px] p-5 flex items-start gap-4">
        <ShieldCheck className="text-[#2089b5] shrink-0 mt-0.5" size={24} strokeWidth={1.5} />
        <div>
          <h4 className="text-sm font-extrabold text-[#29abe2]">Pro tip: compare multiple quotes</h4>
          <p className="text-xs font-medium text-slate-650 mt-1 leading-relaxed">
            Offers can vary by $1,000–$3,000+ for the exact same vehicle depending on market conditions and dealer stock. Always compare at least 3 buyers before accepting an offer.
          </p>
        </div>
      </div>

    </div>
    </div>
  );
};

export default SellMyCar;
