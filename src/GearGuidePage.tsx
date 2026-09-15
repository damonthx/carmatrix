import React, { useState } from 'react';
import { 
  ShoppingBag, ShieldCheck, Zap, AlertTriangle, 
  ExternalLink, CheckCircle2, Sparkles, Filter, Info, Camera, Compass
} from 'lucide-react';

interface GearGuidePageProps {
  onNavigate?: (path: string) => void;
}

export default function GearGuidePage({ onNavigate }: GearGuidePageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Recommended Gear' },
    { id: 'inspection', label: 'Inspection & Diagnostics' },
    { id: 'performance', label: 'Performance & Additives' },
    { id: 'safety', label: 'Emergency & Safety' },
    { id: 'dashcam', label: 'Dash Cams & Security' },
    { id: 'cabin', label: 'Tech & Interior Protection' },
  ];

  const products = [
    // Inspection & Diagnostics
    {
      id: 'bluedriver-obd2',
      category: 'inspection',
      title: 'BlueDriver Bluetooth Pro OBD2 Diagnostic Scanner',
      badge: 'Essential for Used Car Inspection',
      bestFor: 'Checking hidden check engine codes & smog readiness before buying',
      description: 'Used car sellers frequently clear check engine codes before buyers arrive. Plug this professional-grade OBD2 scanner into any vehicle (1996+) to instantly read pending fault codes, ABS/Airbag diagnostics, and complete smog readiness on your smartphone.',
      amazonUrl: 'https://www.amazon.com/dp/B00652G4TS?tag=carmatrix02-20',
      specs: ['iOS & Android App', 'Reads ABS/SRS/Engine', 'Live Data Logging', 'Zero Subscription Fees']
    },
    {
      id: 'digital-tread-gauge',
      category: 'inspection',
      title: 'Digital Tire Tread Depth & Pressure Gauge Kit',
      badge: 'Negotiation Tool',
      bestFor: 'Spotting uneven tire wear and calculating tire replacement deductions',
      description: 'A set of 4 worn tires costs $800 to $1,400 to replace. Measuring exact 32nds of an inch on tire tread gives you mathematical proof to negotiate an immediate price deduction or dealer tire replacement.',
      amazonUrl: 'https://www.amazon.com/s?k=digital+tire+tread+depth+gauge+and+pressure&tag=carmatrix02-20',
      specs: ['0.01mm Precision', 'Digital LCD Backlight', 'Includes PSI Gauge', 'Pocket Sized']
    },
    {
      id: 'inspection-light-mirror',
      category: 'inspection',
      title: 'Telescoping 360° Inspection Mirror & Magnetic Work Light',
      badge: 'Mechanical Audit',
      bestFor: 'Inspecting undercarriage rust, oil pan seep, and brake pad thickness',
      description: 'Never sign a purchase order without inspecting underneath the vehicle. This 360-degree pivoting mirror with ultra-bright LED lighting lets you inspect cv boots, steering rack leaks, and frame corrosion without lifting the car.',
      amazonUrl: 'https://www.amazon.com/s?k=telescoping+inspection+mirror+with+led+light&tag=carmatrix02-20',
      specs: ['360° Swivel Joint', 'Extends to 34 inches', 'High-Output LED', 'Magnetic Pickup Base']
    },

    // Performance & Additives
    {
      id: 'rislone-def-cleaner',
      category: 'performance',
      title: 'Rislone DEF Crystal Clean Diesel Emissions System Cleaner',
      badge: 'DEF & Emissions Fix',
      bestFor: 'Dissolving crystallized DEF deposits & clearing SCR/catalyst warning lights',
      description: 'Modern diesel emissions systems suffer from crystallized urea buildup that clogs injectors, pumps, and SCR catalysts—often leading to $2,000+ dealer replacement quotes. This proprietary formula safely dissolves crystallized DEF deposits across the entire doser system and restores optimal spray patterns.',
      amazonUrl: 'https://www.amazon.com/dp/B0BS49X7N5?tag=carmatrix02-20',
      specs: ['Clears DEF Warning Codes', 'Dissolves Urea Crystals', 'Safe for All SCR Systems', 'Prevents Dosing Failure']
    },
    {
      id: 'liquimoly-cera-tec',
      category: 'performance',
      title: 'Liqui Moly 3721 Cera Tec Micro-Ceramic Engine Oil Additive',
      badge: 'Engine Protection & Friction Reduction',
      bestFor: 'Decreasing engine friction, lowering operating temps & extending motor longevity',
      description: 'Engineered in Germany with micro-ceramic solid lubricants that chemically bond to internal metal friction surfaces. Provides extreme high-load wear resistance, reduces internal friction by up to 50%, smooths rough engine idle, and protects motors for up to 30,000 miles.',
      amazonUrl: 'https://www.amazon.com/dp/B01KGHA43Y?tag=carmatrix02-20',
      specs: ['German Engineered', 'Lasts up to 30,000 Miles', 'Reduces Friction & Wear', 'Safe for Turbochargers']
    },

    // Emergency & Safety
    {
      id: 'noco-boost-gb40',
      category: 'safety',
      title: 'NOCO Boost Plus GB40 1000A UltraSafe Lithium Jump Starter',
      badge: 'Top Safety Pick',
      bestFor: 'Instant jump-starting without needing a second vehicle',
      description: 'The industry-standard compact lithium jump box. Delivers 1,000 amps of jump-starting power in seconds (up to 20 jump starts per charge). Mistake-proof spark-resistant design with reverse polarity protection so you can never wire it incorrectly.',
      amazonUrl: 'https://www.amazon.com/dp/B015TKUPIC?tag=carmatrix02-20',
      specs: ['Up to 6.0L Gas / 3.0L Diesel', 'Integrated 100lm Flashlight', 'USB Power Bank Output', 'Zero Spark Design']
    },
    {
      id: 'astroai-inflator',
      category: 'safety',
      title: 'AstroAI Cordless 150 PSI Portable Tire Inflator & Air Pump',
      badge: 'Roadside Essential',
      bestFor: 'Highway tire pressure management & emergency flat top-ups',
      description: 'Compact high-speed digital tire compressor that operates via rechargeable battery or 12V car cigarette outlet. Set your vehicle’s factory PSI rating, attach the chuck, and it automatically fills and shuts off at the exact target pressure.',
      amazonUrl: 'https://www.amazon.com/dp/B082BG73N3?tag=carmatrix02-20',
      specs: ['Auto Shut-Off Sensor', 'Dual Power (Battery + 12V)', 'Emergency Strobe Light', 'Fast 1-Minute Top-Off']
    },
    {
      id: 'roadside-emergency-kit',
      category: 'safety',
      title: 'DOT-Approved 125-Piece Premium Roadside Assistance & First Aid Kit',
      badge: 'Family Protection',
      bestFor: 'Breakdown preparedness, highway roadside visibility & basic medical triage',
      description: 'Comprehensive heavy-duty roadside kit packed with booster cables, reflective warning triangle, high-visibility safety vest, emergency glass breaker tool, tow strap, tire repair tools, and an OSHA-standard medical pouch.',
      amazonUrl: 'https://www.amazon.com/s?k=roadside+emergency+assistance+kit+car&tag=carmatrix02-20',
      specs: ['Reflective Warning Triangle', 'Heavy Gauge Cables', 'First Aid Supplies', 'Durable Trunk Bag']
    },

    // Dash Cams & Security
    {
      id: 'redtiger-4k-dashcam',
      category: 'dashcam',
      title: 'REDTIGER 4K Front & 1080P Rear Dual Dash Cam with WiFi & GPS',
      badge: 'Insurance Shield',
      bestFor: 'Disproving fault in accidents and recording parking lot hit-and-runs',
      description: 'High-definition 4K front and 1080P rear recording provides ironclad legal evidence in disputed insurance claims. Includes super night vision, G-sensor collision detection, parking monitoring, and free smartphone video downloading.',
      amazonUrl: 'https://www.amazon.com/dp/B08TT1VV53?tag=carmatrix02-20',
      specs: ['Real 4K Ultra HD', 'Front (170°) + Rear (140°)', 'Built-in GPS & WiFi App', '24H Parking Mode Support']
    },
    {
      id: 'faraday-keyfob-bag',
      category: 'dashcam',
      title: 'Mission Darkness Faraday Key Fob Anti-Theft Signal Blocker',
      badge: 'Anti-Relay Theft',
      bestFor: 'Preventing modern keyless relay vehicle theft at home & hotels',
      description: 'Car thieves increasingly use wireless relay boxes to copy smart key signals through front doors and drive cars away in 60 seconds. This lab-tested military-grade shielding bag blocks 100% of RFID, BLE, and NFC signals.',
      amazonUrl: 'https://www.amazon.com/dp/B071ZSZKFV?tag=carmatrix02-20',
      specs: ['Dual-Layer TitanRF Fabric', 'Water Resistant Ballistic Nylon', 'Blocks RFID / Keyless Fob Signals', 'Compact Keychain Clip']
    },

    // Cabin Tech & Interior Care
    {
      id: 'ottocast-wireless-adapter',
      category: 'cabin',
      title: 'Ottocast Wireless CarPlay & Android Auto 2-in-1 Smart Adapter',
      badge: 'Tech Upgrade',
      bestFor: 'Converting wired factory CarPlay / Android Auto to automatic wireless connection',
      description: 'Eliminate tangled phone cables in your center console. Plug this low-latency adapter into your car’s USB data port once; your phone connects automatically as soon as you turn the ignition.',
      amazonUrl: 'https://www.amazon.com/s?k=Ottocast+wireless+carplay+android+auto+adapter&tag=carmatrix02-20',
      specs: ['Plug & Play 5GHz WiFi', 'Zero Wire Clutter', 'Retains Steering Controls', 'Dual iOS & Android Support']
    },
    {
      id: 'lisen-magsafe-mount',
      category: 'cabin',
      title: 'LISEN MagSafe Heavy-Duty Magnetic Air Vent Car Phone Mount',
      badge: 'Driver Ergonomics',
      bestFor: 'Firm, wobble-free GPS navigation positioning on bumpy roads',
      description: 'Features an upgraded steel-hook mechanism that securely clamps to AC vent blades without breaking plastic vents. Equipped with 20 military-grade N52 permanent magnets that hold through potholes and sudden stops.',
      amazonUrl: 'https://www.amazon.com/s?k=LISEN+magsafe+car+phone+mount&tag=carmatrix02-20',
      specs: ['20x N52 Magnets', 'Steel Hook Vent Clamp', '360° Ball Joint Rotation', 'MagSafe Compatible']
    },
    {
      id: 'motortrend-allweather-mats',
      category: 'cabin',
      title: 'Motor Trend FlexTough Deep Dish All-Weather Heavy Duty Floor Mats',
      badge: 'Resale Value Shield',
      bestFor: 'Protecting carpet floorboards from mud, snow, spills, and permanent salt stains',
      description: 'Preserving factory carpet condition is one of the highest-leverage ways to protect your car’s resale and trade-in value. Built from 100% odorless rubber polymers with deep inverted channels to trap liquid and grime.',
      amazonUrl: 'https://www.amazon.com/dp/B01A5TLGJ4?tag=carmatrix02-20',
      specs: ['Odorless FlexTough Polymer', 'Deep Inverted Channels', 'Trim-to-Fit Custom Cut', 'Waterproof & Stain Resistant']
    },
    {
      id: 'chemical-guys-interior-care',
      category: 'cabin',
      title: 'Chemical Guys Total Interior Cleaner & Protectant Kit',
      badge: 'Showroom Detail',
      bestFor: 'Safe non-greasy cleaning and UV shielding across touchscreens, leather, and plastics',
      description: 'A gentle, versatile cleaner formulated to lift body oils, sunscreen, dust, and fingerprint smudges without leaving shiny greasy residues or blinding windshield reflections. Formulated with UV sunblock to stop dashboard cracking.',
      amazonUrl: 'https://www.amazon.com/dp/B071ZTPRJL?tag=carmatrix02-20',
      specs: ['Safe for All Interior Surfaces', 'UV Solar Blocking Formula', 'Residue-Free OEM Matte Finish', 'Includes Premium Microfibers']
    }
  ];

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 pt-16">
      {/* Header */}
      <div className="max-w-[1000px] mx-auto px-4 text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold tracking-widest uppercase mb-6">
          <ShoppingBag size={14} className="text-[#29abe2]" /> Buyer's Gear Guide
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
          Essential Vehicle Gear & Inspection Tools
        </h1>
        <p className="text-lg md:text-xl text-slate-600 font-medium max-w-[700px] mx-auto leading-relaxed">
          Curated by our automotive research desk. Tested tools to inspect used cars before buying, protect yourself on the road, and maintain your vehicle’s trade-in value.
        </p>

        {/* Amazon Associates Compliance Notice */}
        <div className="mt-6 max-w-[750px] mx-auto p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900/90 text-xs flex items-center justify-center gap-2">
          <Info size={16} className="shrink-0 text-amber-700" />
          <span>
            <strong>Amazon Associate Notice:</strong> As an Amazon Associate, CarMatrix earns from qualifying purchases. Prices and availability are subject to change on Amazon.com.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-[1140px] mx-auto px-4 mb-10">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer shadow-xs ${
                activeCategory === cat.id
                  ? 'bg-[#29abe2] text-white shadow-md shadow-sky-500/20'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-[28px] p-6 md:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Badge & Best For */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-[#29abe2] font-bold text-[11px] tracking-wide uppercase">
                    {product.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 leading-snug">
                  {product.title}
                </h3>

                <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1.5">
                  <Compass size={14} className="text-[#29abe2] shrink-0" />
                  <span>Best for: <strong className="text-slate-700">{product.bestFor}</strong></span>
                </p>

                <p className="text-xs text-slate-600 leading-relaxed font-normal mb-5">
                  {product.description}
                </p>

                {/* Specs Pill List */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {product.specs.map((spec, sIndex) => (
                    <span 
                      key={sIndex} 
                      className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1"
                    >
                      <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={product.amazonUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#29abe2] hover:bg-[#2089b5] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 shadow-md shadow-sky-500/20 hover:shadow-lg cursor-pointer group"
                >
                  <span>Check Price on Amazon</span>
                  <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Editorial Callout */}
      <div className="max-w-[1000px] mx-auto px-4 mt-16">
        <div className="bg-slate-900 text-white rounded-[32px] p-8 md:p-10 border border-slate-800 shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#29abe2] text-xs font-bold tracking-widest uppercase">
            <ShieldCheck size={14} /> Editorial Standards
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            How we select recommended automotive gear
          </h2>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Our selections are based on verified customer ratings, master mechanic feedback, build quality, and practical utility for everyday vehicle buyers and owners. Brands cannot pay for placement in this guide.
          </p>
          <div className="pt-2 text-[11px] text-slate-400">
            Participant in the Amazon Services LLC Associates Program • Store Tag: <code>carmatrix02-20</code>
          </div>
        </div>
      </div>
    </div>
  );
}
