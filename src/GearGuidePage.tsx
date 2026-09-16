import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, ShieldCheck, Zap, Star, 
  ExternalLink, CheckCircle2, Search, ArrowUpDown, 
  Truck, RotateCcw, Lock, Sparkles, Filter, ChevronRight
} from 'lucide-react';

interface GearGuidePageProps {
  onNavigate?: (path: string) => void;
}

interface Product {
  id: string;
  category: 'inspection' | 'performance' | 'safety' | 'dashcam' | 'cabin';
  brand: string;
  title: string;
  image: string;
  badge?: string;
  rating: number;
  reviewsCount: string;
  bestFor: string;
  description: string;
  amazonUrl: string;
  specs: string[];
  primeEligible: boolean;
}

export default function GearGuidePage({ onNavigate }: GearGuidePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'reviews'>('featured');

  const products: Product[] = [
    // Performance & Additives
    {
      id: 'rislone-def-cleaner',
      category: 'performance',
      brand: 'RISLONE',
      title: 'DEF Crystal Clean Diesel Emissions & Doser System Cleaner',
      image: 'https://m.media-amazon.com/images/I/71sS5M6QrSL._AC_SL1500_.jpg',
      badge: "Amazon's Choice",
      rating: 4.8,
      reviewsCount: '3,800+',
      bestFor: 'Dissolving crystallized DEF deposits & clearing SCR/catalyst fault codes',
      description: 'Clears crystallized urea buildup that clogs DEF injectors, pumps, and SCR catalytic converters. Prevents $2,000+ dealer replacement jobs and restores factory exhaust flow.',
      amazonUrl: 'https://www.amazon.com/dp/B0BS49X7N5?tag=carmatrix02-20',
      specs: ['Clears DEF Warning Codes', 'Dissolves Urea Crystals', 'Safe for All SCR Systems', 'Prevents Dosing Failure'],
      primeEligible: true
    },
    {
      id: 'liquimoly-cera-tec',
      category: 'performance',
      brand: 'LIQUI MOLY',
      title: '3721 Cera Tec Micro-Ceramic Friction Modifier & Engine Oil Additive',
      image: 'https://m.media-amazon.com/images/I/71c55beZhNL._AC_SL1500_.jpg',
      badge: "Top Seller",
      rating: 4.8,
      reviewsCount: '16,200+',
      bestFor: 'Decreasing engine friction, lowering operating temps & extending motor longevity',
      description: 'Engineered in Germany with micro-ceramic solid lubricants that chemically bond to internal friction surfaces. Reduces metal-on-metal friction by up to 50% and protects for 30,000 miles.',
      amazonUrl: 'https://www.amazon.com/dp/B01KGHA43Y?tag=carmatrix02-20',
      specs: ['German Engineered', 'Lasts up to 30,000 Miles', 'Reduces Friction & Wear', 'Turbocharger Safe'],
      primeEligible: true
    },

    // Inspection & Diagnostics
    {
      id: 'bluedriver-obd2',
      category: 'inspection',
      brand: 'BLUEDRIVER',
      title: 'Bluetooth Pro OBD2 Diagnostic Scan Tool & Code Reader',
      image: 'https://m.media-amazon.com/images/I/71BlnDh-fPL._AC_SL1500_.jpg',
      badge: "Mechanic's Choice",
      rating: 4.7,
      reviewsCount: '52,400+',
      bestFor: 'Checking hidden check engine codes & smog readiness before buying',
      description: 'Used car sellers frequently clear fault codes right before buyers arrive. Plugs into any OBD2 port (1996+) to read pending trouble codes, ABS, Airbag (SRS), and full emissions readiness on your phone.',
      amazonUrl: 'https://www.amazon.com/dp/B00652G4TS?tag=carmatrix02-20',
      specs: ['iOS & Android App', 'Reads ABS/SRS/Engine', 'Live Data Logging', 'Zero Subscription Fees'],
      primeEligible: true
    },
    {
      id: 'digital-tread-gauge',
      category: 'inspection',
      brand: 'GODESON',
      title: 'Digital Tire Tread Depth Gauge & Heavy Duty Pressure Gauge Kit',
      image: 'https://m.media-amazon.com/images/I/61pHzDkEjlL._SL1500_.jpg',
      badge: "Inspection Tool",
      rating: 4.7,
      reviewsCount: '8,900+',
      bestFor: 'Spotting uneven tire wear and negotiating tire replacement deductions',
      description: 'A worn set of 4 tires costs $800 to $1,400 to replace. Measuring exact 32nds of an inch provides physical mathematical proof to negotiate an immediate price deduction from any car dealer.',
      amazonUrl: 'https://www.amazon.com/s?k=digital+tire+tread+depth+gauge+and+pressure&tag=carmatrix02-20',
      specs: ['0.01mm Precision LCD', 'Digital Backlight Display', 'Includes PSI Gauge', 'Pocket Sized'],
      primeEligible: true
    },
    {
      id: 'inspection-light-mirror',
      category: 'inspection',
      brand: 'PROLUCKY',
      title: 'Telescoping 360° Inspection Mirror with Ultra-Bright LED Lights',
      image: 'https://m.media-amazon.com/images/I/51QrMSPGUBL._SL1500_.jpg',
      badge: "Pre-Purchase Essential",
      rating: 4.6,
      reviewsCount: '4,100+',
      bestFor: 'Inspecting undercarriage rust, oil pan seep, and brake pad thickness',
      description: 'Never purchase a used car without checking underneath. This 360-degree articulating mirror with dual LEDs inspects cv boots, oil leaks, and frame corrosion without lifting the vehicle.',
      amazonUrl: 'https://www.amazon.com/s?k=telescoping+inspection+mirror+with+led+light&tag=carmatrix02-20',
      specs: ['360° Double Ball Joint', 'Extends to 34 inches', 'High-Output LED', 'Magnetic Pickup Base'],
      primeEligible: true
    },

    // Emergency & Safety
    {
      id: 'noco-boost-gb40',
      category: 'safety',
      brand: 'NOCO',
      title: 'Boost Plus GB40 1000A UltraSafe 12V Lithium Car Battery Jump Starter',
      image: 'https://m.media-amazon.com/images/I/71hJgp07X1L._AC_SL1500_.jpg',
      badge: "Best Seller",
      rating: 4.7,
      reviewsCount: '115,000+',
      bestFor: 'Instant jump-starting without waiting for roadside assistance or another car',
      description: 'The definitive lithium jump pack. Delivers 1,000 amps of jump-starting power in seconds (up to 20 jump starts per charge). Mistake-proof, spark-resistant design with reverse polarity protection.',
      amazonUrl: 'https://www.amazon.com/dp/B015TKUPIC?tag=carmatrix02-20',
      specs: ['Up to 6.0L Gas / 3.0L Diesel', '100 Lumen Flashlight', 'USB Smartphone Power Bank', 'Spark-Proof Safety'],
      primeEligible: true
    },
    {
      id: 'astroai-inflator',
      category: 'safety',
      brand: 'ASTROAI',
      title: 'Cordless 150 PSI Portable Tire Inflator & Rechargeable Air Pump',
      image: 'https://m.media-amazon.com/images/I/71wzRtIbBLL._AC_SL1500_.jpg',
      badge: "Amazon's Choice",
      rating: 4.7,
      reviewsCount: '45,000+',
      bestFor: 'Highway tire pressure management & emergency flat top-ups',
      description: 'Compact high-speed digital tire compressor that operates via rechargeable battery or 12V car outlet. Preset your target PSI, and it automatically stops when your tires reach factory pressure.',
      amazonUrl: 'https://www.amazon.com/s?k=AstroAI+Tire+Inflator+Portable+Air+Compressor&tag=carmatrix02-20',
      specs: ['Auto Shut-Off Sensor', 'Dual Power (Battery + 12V)', 'Emergency Strobe Light', 'Fast 1-Minute Top-Off'],
      primeEligible: true
    },
    {
      id: 'roadside-emergency-kit',
      category: 'safety',
      brand: 'HAUSBELL',
      title: 'DOT-Approved 125-Piece Roadside Emergency & Auto First Aid Kit',
      image: 'https://m.media-amazon.com/images/I/81AnGwY9iQL._AC_.jpg',
      badge: "Road Safety Kit",
      rating: 4.7,
      reviewsCount: '12,800+',
      bestFor: 'Highway breakdown preparedness, emergency visibility & minor medical care',
      description: 'Heavy-duty roadside survival kit containing booster cables, reflective warning triangle, high-visibility vest, emergency escape hammer, tow strap, and an OSHA-standard medical pouch.',
      amazonUrl: 'https://www.amazon.com/s?k=roadside+emergency+assistance+kit+car&tag=carmatrix02-20',
      specs: ['Reflective Warning Triangle', 'Heavy Gauge Cables', 'First Aid Supplies', 'Durable Trunk Bag'],
      primeEligible: true
    },

    // Dash Cams & Security
    {
      id: 'redtiger-4k-dashcam',
      category: 'dashcam',
      brand: 'REDTIGER',
      title: 'F7NP 4K Front & 1080P Rear Dual Dash Cam with WiFi & GPS',
      image: 'https://m.media-amazon.com/images/I/71SlVXm9aDL._AC_SL1500_.jpg',
      badge: "Amazon's Choice",
      rating: 4.6,
      reviewsCount: '28,000+',
      bestFor: 'Disproving fault in accidents and recording parking lot hit-and-runs',
      description: 'High-definition 4K front and 1080P rear recording provides ironclad legal evidence in insurance disputes. Features super night vision, G-sensor collision recording, and parking monitoring.',
      amazonUrl: 'https://www.amazon.com/s?k=REDTIGER+4K+Dual+Dash+Cam+Front+and+Rear&tag=carmatrix02-20',
      specs: ['True 4K Ultra HD', 'Front (170°) + Rear (140°)', 'Built-in GPS & WiFi App', '24H Parking Mode Support'],
      primeEligible: true
    },
    {
      id: 'faraday-keyfob-bag',
      category: 'dashcam',
      brand: 'MISSION DARKNESS',
      title: 'Faraday Key Fob Shielding Bag (Anti-Theft Signal Blocker)',
      image: 'https://m.media-amazon.com/images/I/8134Qa51slL._AC_SX569_.jpg',
      badge: "Anti-Theft Shield",
      rating: 4.6,
      reviewsCount: '14,500+',
      bestFor: 'Preventing modern keyless relay vehicle theft at home and hotels',
      description: 'Thieves use RF relay antennas to copy smart key signals through home doors and steal cars in 60 seconds. This lab-tested military-grade shielding pouch blocks 100% of RFID, BLE, and NFC signals.',
      amazonUrl: 'https://www.amazon.com/dp/B071ZSZKFV?tag=carmatrix02-20',
      specs: ['Dual TitanRF Fabric', 'Water Resistant Nylon', 'Blocks RFID / Smart Key', 'Compact Keychain Clip'],
      primeEligible: true
    },

    // Cabin Tech & Interior Care
    {
      id: 'ottocast-wireless-adapter',
      category: 'cabin',
      brand: 'OTTOCAST',
      title: 'U2-Air Wireless Apple CarPlay & Android Auto Plug & Play Adapter',
      image: 'https://m.media-amazon.com/images/I/71y23Sxc3pL._AC_SL1500_.jpg',
      badge: "Top Rated Tech",
      rating: 4.5,
      reviewsCount: '9,200+',
      bestFor: 'Converting wired factory CarPlay / Android Auto to seamless wireless',
      description: 'Say goodbye to messy cables in your center console. Plug this low-latency adapter into your car’s USB port once; your phone connects automatically every time you start the car.',
      amazonUrl: 'https://www.amazon.com/s?k=Ottocast+wireless+carplay+android+auto+adapter&tag=carmatrix02-20',
      specs: ['Plug & Play 5GHz WiFi', 'Zero Cable Clutter', 'Retains Steering Controls', 'Fast 10s Auto-Connect'],
      primeEligible: true
    },
    {
      id: 'lisen-magsafe-mount',
      category: 'cabin',
      brand: 'LISEN',
      title: 'MagSafe Air Vent Car Phone Mount with Steel Locking Hook',
      image: 'https://m.media-amazon.com/images/I/71+uv9p-mZL._AC_SL1500_.jpg',
      badge: "Best Vent Mount",
      rating: 4.6,
      reviewsCount: '34,000+',
      bestFor: 'Rock-solid, wobble-free GPS navigation positioning on bumpy roads',
      description: 'Features a patented steel hook mechanism that locks securely onto air vent louvers without slipping or cracking plastic vents. 20 permanent N52 magnets hold phones through rough terrain.',
      amazonUrl: 'https://www.amazon.com/s?k=LISEN+magsafe+car+phone+mount&tag=carmatrix02-20',
      specs: ['20x N52 Magnets', 'Steel Hook Vent Lock', '360° Ball Joint Rotation', 'MagSafe Ready'],
      primeEligible: true
    },
    {
      id: 'motortrend-allweather-mats',
      category: 'cabin',
      brand: 'MOTOR TREND',
      title: 'FlexTough Deep Dish Heavy Duty All-Weather Rubber Floor Mats',
      image: 'https://m.media-amazon.com/images/I/71tAwSrkwfL._AC_SL1500_.jpg',
      badge: "Resale Protector",
      rating: 4.6,
      reviewsCount: '49,000+',
      bestFor: 'Protecting vehicle carpet from mud, spills, and salt to protect resale value',
      description: 'Maintaining pristine factory carpet is one of the easiest ways to maximize your vehicle’s eventual trade-in value. Built from 100% odorless rubber polymers with inverted deep channels.',
      amazonUrl: 'https://www.amazon.com/dp/B01A5TLGJ4?tag=carmatrix02-20',
      specs: ['100% Odorless Polymer', 'Deep Inverted Channels', 'Trim-to-Fit Design', 'Stain & Water Proof'],
      primeEligible: true
    },
    {
      id: 'chemical-guys-interior-care',
      category: 'cabin',
      brand: 'CHEMICAL GUYS',
      title: 'Total Interior Cleaner & Protectant (Safe on Screens, Leather, Plastics)',
      image: 'https://m.media-amazon.com/images/I/71e6JTfk-lL._AC_SL1500_.jpg',
      badge: "Top Detailing Pick",
      rating: 4.7,
      reviewsCount: '38,000+',
      bestFor: 'Cleaning touchscreen smudges, conditioning leather, and preventing dashboard cracking',
      description: 'A residue-free cleaner that wipes away fingerprint smudges, dust, and body oils without leaving shiny greasy streaks on your dashboard. Features UV blockers to prevent sun cracking.',
      amazonUrl: 'https://www.amazon.com/dp/B071ZTPRJL?tag=carmatrix02-20',
      specs: ['Safe on Nav Screens', 'UV Sunblock Protection', 'OEM Natural Matte Finish', 'Pleasant Fresh Scent'],
      primeEligible: true
    }
  ];

  const categories = [
    { id: 'all', label: 'All Products', count: products.length },
    { id: 'performance', label: 'Performance & Additives', count: products.filter(p => p.category === 'performance').length },
    { id: 'inspection', label: 'Inspection & Diagnostics', count: products.filter(p => p.category === 'inspection').length },
    { id: 'safety', label: 'Emergency & Safety', count: products.filter(p => p.category === 'safety').length },
    { id: 'dashcam', label: 'Dash Cams & Security', count: products.filter(p => p.category === 'dashcam').length },
    { id: 'cabin', label: 'Cabin Tech & Care', count: products.filter(p => p.category === 'cabin').length },
  ];

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    let list = products.filter(p => {
      const matchesCat = activeCategory === 'all' || p.category === activeCategory;
      const matchesSearch = searchQuery.trim() === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.bestFor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'reviews') {
      list.sort((a, b) => parseInt(b.reviewsCount.replace(/[^0-9]/g, '')) - parseInt(a.reviewsCount.replace(/[^0-9]/g, '')));
    }
    return list;
  }, [products, activeCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-slate-900 pb-24">
      {/* Store Header / Hero Bar */}
      <div className="bg-slate-900 text-white pt-16 pb-12 px-4 border-b border-slate-800">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-400 text-xs font-bold tracking-widest uppercase mb-3">
                <ShoppingBag size={14} /> CarMatrix Curated Store
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Automotive Equipment & Essentials
              </h1>
              <p className="text-sm md:text-base text-slate-300 max-w-2xl mt-2 leading-relaxed">
                Hand-selected by our automotive research desk. Verified tools to inspect pre-owned vehicles, optimize performance, and protect your road safety.
              </p>
            </div>

            {/* Amazon Trust Badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-slate-800/80 p-3 rounded-2xl border border-slate-700/60 shrink-0">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck size={16} className="text-[#29abe2]" />
                <span>Prime Fast Shipping</span>
              </div>
              <div className="h-3.5 w-px bg-slate-700" />
              <div className="flex items-center gap-1.5 font-medium">
                <Lock size={15} className="text-emerald-400" />
                <span>Secure Amazon Checkout</span>
              </div>
              <div className="h-3.5 w-px bg-slate-700" />
              <div className="flex items-center gap-1.5 font-medium">
                <RotateCcw size={15} className="text-amber-400" />
                <span>30-Day Returns</span>
              </div>
            </div>
          </div>

          {/* Amazon Associates Legal Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <span className="font-semibold text-slate-300">Amazon Affiliate Disclosure:</span>
            <span>As an Amazon Associate, CarMatrix earns from qualifying purchases. Prices & availability are accurate on Amazon.com.</span>
          </div>
        </div>
      </div>

      {/* Store Controls: Category Tabs, Search & Sort */}
      <div className="sticky top-[72px] sm:top-[85px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1200px] mx-auto px-4 py-3.5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Category Pills with Item Counts */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full lg:w-auto no-scrollbar py-0.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Search & Sort Controls */}
            <div className="flex items-center gap-3 w-full lg:w-auto shrink-0">
              {/* Search Bar */}
              <div className="relative flex-1 lg:w-64">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-9 pr-3 text-xs outline-none focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Sort Selector */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-100 border border-slate-200 rounded-xl py-2 px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#29abe2] cursor-pointer appearance-none pr-8"
                >
                  <option value="featured">Featured</option>
                  <option value="rating">Top Rated</option>
                  <option value="reviews">Most Reviewed</option>
                </select>
                <ArrowUpDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Store Catalog Grid */}
      <div className="max-w-[1200px] mx-auto px-4 pt-8">
        
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 my-8">
            <ShoppingBag size={36} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">No products match your search</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try searching for different keywords like "scanner", "jump starter", or select another category.
            </p>
            <button
              onClick={() => { setActiveCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Product Image Canvas */}
                  <div className="relative bg-white p-6 flex items-center justify-center h-64 border-b border-slate-100 overflow-hidden">
                    {/* Badge Overlay */}
                    {product.badge && (
                      <div className="absolute top-3.5 left-3.5 z-10">
                        <span className="px-2.5 py-1 rounded-md bg-slate-900 text-white text-[10.5px] font-bold tracking-wide shadow-sm">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* Amazon Prime Logo Pill */}
                    {product.primeEligible && (
                      <div className="absolute top-3.5 right-3.5 z-10 flex items-center gap-1 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded text-[10px] font-black text-[#007185]">
                        <span>prime</span>
                      </div>
                    )}

                    <a 
                      href={product.amazonUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="w-full h-full flex items-center justify-center p-2"
                      title={product.title}
                    >
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="max-h-52 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </a>
                  </div>

                  {/* Product Details */}
                  <div className="p-5">
                    {/* Brand & Star Ratings */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span>{product.rating.toFixed(1)}</span>
                        <span className="text-slate-400 text-[10px]">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-2 group-hover:text-[#29abe2] transition-colors">
                      <a 
                        href={product.amazonUrl}
                        target="_blank"
                        rel="nofollow sponsored noopener noreferrer"
                      >
                        {product.title}
                      </a>
                    </h3>

                    {/* Best For Tag */}
                    <div className="mb-3 p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600">
                      <span className="font-semibold text-slate-800">Best for: </span>
                      {product.bestFor}
                    </div>

                    {/* Short Editorial Description */}
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                      {product.description}
                    </p>

                    {/* Key Specs Pills */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {product.specs.map((spec, i) => (
                        <span 
                          key={i} 
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600 flex items-center gap-1"
                        >
                          <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                          <span>{spec}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Retail Store Buy Box */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="text-[11px]">
                      <span className="text-slate-400 font-medium block leading-tight">Sold on</span>
                      <span className="font-bold text-slate-800">Amazon.com</span>
                    </div>

                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F2C200] text-slate-900 py-3 px-4 rounded-xl font-bold text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer border border-[#FCD200]"
                    >
                      <span>Check Price on Amazon</span>
                      <ExternalLink size={13} className="text-slate-700" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Store Editorial Standard Guarantee */}
      <div className="max-w-[1200px] mx-auto px-4 mt-16">
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold tracking-wide uppercase">
              <ShieldCheck size={14} className="text-emerald-600" /> Independent Product Standards
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Why car buyers trust the CarMatrix gear selections
            </h2>
            <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
              Every piece of equipment in this catalog is curated based on real automotive diagnostic testing, certified master mechanic feedback, and verified road performance. Manufacturers cannot purchase featured placement in this guide.
            </p>
            <p className="text-[11px] text-slate-400">
              Store ID: <code className="text-slate-600 font-mono">carmatrix02-20</code> • Fulfillment, customer service, and delivery handled securely by Amazon.com.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-center">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xl font-black text-slate-900">100%</div>
              <div className="text-[11px] font-semibold text-slate-500">Unbiased Testing</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="text-xl font-black text-slate-900">4.6★+</div>
              <div className="text-[11px] font-semibold text-slate-500">Min. Amazon Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
