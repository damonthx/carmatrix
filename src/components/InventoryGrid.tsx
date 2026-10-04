import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import VehicleCard, { Vehicle } from './VehicleCard';

// Realistic fallback dataset taken directly from ExportSampleFile.csv
const FALLBACK_INVENTORY: Vehicle[] = [
  {
    vin: '1GNEV18K3LF166492',
    dealer_id: '20897',
    make: 'Chevrolet',
    model: 'Blazer',
    trim: 'V10',
    year: 1990,
    body_type: 'SUV',
    engine: '5.7L',
    drive_type: '',
    transmission: 'Automatic',
    cylinders: '8',
    exterior_color: 'BLUE',
    interior_color: 'GREY',
    mileage: 178085,
    cost: 18592.23,
    retail_price: 24000,
    internet_price: 0,
    msrp: 0,
    options: ['Active (Manual) Belts'],
    images: ['https://imagescdn.dealercarsearch.com/Media/20897/19104148/637954108490437498.jpg'],
    comments: 'Classic, Rugged and Strong! This Chevy Blazer is a trail king boss.',
    certified_pre_owned: false,
    new_used: 'Used'
  },
  {
    vin: '4JGDF6EE0JB152353',
    dealer_id: '20897',
    make: 'Mercedes-Benz',
    model: 'GLS-Class',
    trim: '450 4MATIC',
    year: 2018,
    body_type: 'SUV',
    engine: '3.0L',
    drive_type: '',
    transmission: 'Automatic',
    cylinders: '6',
    exterior_color: 'BLACK',
    interior_color: '',
    mileage: 31160,
    cost: 2065.24,
    retail_price: 44995,
    internet_price: 44995,
    msrp: 0,
    options: ['Air Conditioning', 'Keyless Entry', 'Power Sun/Moon Roof'],
    images: ['https://imagescdn.dealercarsearch.com/Media/20897/19201967/637993757224324666.jpg'],
    comments: 'The 2018 GLS-Class is Mercedes-Benz\'s flagship SUV.',
    certified_pre_owned: true,
    new_used: 'Used'
  },
  {
    vin: 'SBM14DCAXJW000338',
    dealer_id: '20897',
    make: 'McLaren',
    model: '720s',
    trim: 'COUPE',
    year: 2018,
    body_type: 'Coupe',
    engine: '4.0L',
    drive_type: '',
    transmission: 'Automatic',
    cylinders: '8',
    exterior_color: 'BLUE',
    interior_color: 'GRAY',
    mileage: 871,
    cost: 0,
    retail_price: 277995,
    internet_price: 277995,
    msrp: 0,
    options: ['Air Conditioning', 'Keyless Entry', 'Power Locks'],
    images: ['https://imagescdn.dealercarsearch.com/Media/20897/19080654/637950512501607215.jpg'],
    comments: 'Poised for attack. And ferociously fast. The McLaren 720S is purposeful and outrageous.',
    certified_pre_owned: false,
    new_used: 'Used'
  },
  {
    vin: 'WP1AG2A59HLB54656',
    dealer_id: '20897',
    make: 'Porsche',
    model: 'Macan',
    trim: 'GTS',
    year: 2017,
    body_type: 'SUV',
    engine: '3.0L',
    drive_type: '',
    transmission: 'Automatic',
    cylinders: '6',
    exterior_color: 'GRAY',
    interior_color: '',
    mileage: 30550,
    cost: 60394.00,
    retail_price: 56995,
    internet_price: 56995,
    msrp: 0,
    options: ['Suede Seats', 'Steering Wheel Controls', 'Daytime Running Lights'],
    images: ['https://imagescdn.dealercarsearch.com/Media/20897/19001358/637928090224787228.jpg'],
    comments: 'Quite simply, no other compact luxury SUV is more engaging and fun to drive as the 2017 Porsche Macan.',
    certified_pre_owned: false,
    new_used: 'Used'
  },
  {
    vin: '3VW2B7AJ2HM375932',
    dealer_id: '20897',
    make: 'Volkswagen',
    model: 'Jetta',
    trim: 'S',
    year: 2017,
    body_type: 'Sedan',
    engine: '1.4L',
    drive_type: '',
    transmission: 'Automatic',
    cylinders: '4',
    exterior_color: 'BLACK',
    interior_color: '',
    mileage: 49285,
    cost: 16765.57,
    retail_price: 17995,
    internet_price: 17995,
    msrp: 0,
    options: ['Apple/Android Car Play', 'Touch Center Display'],
    images: ['https://imagescdn.dealercarsearch.com/Media/20897/18947072/637956586233021331.jpg'],
    comments: 'The Jetta has come a long way from its previous models.',
    certified_pre_owned: true,
    new_used: 'Used'
  }
];

export default function InventoryGrid() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedBodyType, setSelectedBodyType] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [maxPrice, setMaxPrice] = useState(300000);
  const [sortBy, setSortBy] = useState('price_asc');

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        setVehicles(data);
        setUsingFallback(false);
      } else {
        // Fallback if database returns empty
        setVehicles(FALLBACK_INVENTORY);
        setUsingFallback(true);
      }
    } catch (error: any) {
      console.warn("⚠️ Database query failed, falling back to static CSV data map.", error.message);
      setVehicles(FALLBACK_INVENTORY);
      setUsingFallback(true);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Derived filter options based on current loaded dataset
  const uniqueMakes = Array.from(new Set(vehicles.map((v) => v.make))).sort();
  const uniqueBodyTypes = Array.from(new Set(vehicles.map((v) => v.body_type).filter(Boolean))).sort();

  // Filter and Sort Logic
  const filteredVehicles = vehicles
    .filter((v) => {
      // Search check (Make, Model, Year, VIN)
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        v.make.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.year.toString().includes(query) ||
        v.vin.toLowerCase().includes(query);

      // Make check
      const matchesMake = selectedMake === '' || v.make === selectedMake;

      // Body Type check
      const matchesBody = selectedBodyType === '' || v.body_type === selectedBodyType;

      // Condition check (CPO or standard)
      const matchesCondition =
        selectedCondition === '' ||
        (selectedCondition === 'cpo' && v.certified_pre_owned) ||
        (selectedCondition === 'new' && v.new_used?.toLowerCase() === 'new') ||
        (selectedCondition === 'used' && v.new_used?.toLowerCase() === 'used');

      // Price check
      const price =
        v.internet_price && v.internet_price > 0
          ? v.internet_price
          : v.retail_price && v.retail_price > 0
          ? v.retail_price
          : v.msrp && v.msrp > 0
          ? v.msrp
          : 0;
      const matchesPrice = price <= maxPrice;

      return matchesSearch && matchesMake && matchesBody && matchesCondition && matchesPrice;
    })
    .sort((a, b) => {
      const getPrice = (v: Vehicle) =>
        v.internet_price && v.internet_price > 0
          ? v.internet_price
          : v.retail_price && v.retail_price > 0
          ? v.retail_price
          : v.msrp && v.msrp > 0
          ? v.msrp
          : 0;

      if (sortBy === 'price_asc') return getPrice(a) - getPrice(b);
      if (sortBy === 'price_desc') return getPrice(b) - getPrice(a);
      if (sortBy === 'year_desc') return b.year - a.year;
      if (sortBy === 'mileage_asc') return (a.mileage || 0) - (b.mileage || 0);
      return 0;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 font-sans">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore Premium Inventory
          </h2>
          <p className="text-slate-500 font-semibold text-sm mt-1">
            Browse our verified inventory matching the exact CSV data model.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchInventory}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2.5 text-sm transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Grid containing Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6 bg-slate-50 border border-slate-100 p-6 rounded-3xl h-fit">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-200/60">
            <SlidersHorizontal size={18} className="text-slate-800" />
            <h3 className="font-extrabold text-slate-850 text-base">Search Filters</h3>
          </div>

          {/* Text Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search Make, Model, Year..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] shadow-xs transition-all placeholder:text-slate-400"
              />
              <Search className="absolute left-3.5 top-3.5 text-slate-400" size={15} />
            </div>
          </div>

          {/* Make Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Make
            </label>
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl px-4 py-2.5 text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] shadow-xs transition-all cursor-pointer"
            >
              <option value="">All Makes</option>
              {uniqueMakes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Body Type Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Body Type
            </label>
            <select
              value={selectedBodyType}
              onChange={(e) => setSelectedBodyType(e.target.value)}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl px-4 py-2.5 text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] shadow-xs transition-all cursor-pointer"
            >
              <option value="">All Body Styles</option>
              {uniqueBodyTypes.map((bt) => (
                <option key={bt} value={bt}>
                  {bt}
                </option>
              ))}
            </select>
          </div>

          {/* Condition / CPO */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Condition
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => setSelectedCondition(e.target.value)}
              className="w-full bg-white border border-slate-300 hover:border-slate-400 rounded-2xl px-4 py-2.5 text-sm text-slate-950 font-medium focus:outline-none focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] shadow-xs transition-all cursor-pointer"
            >
              <option value="">All Conditions</option>
              <option value="new">New Vehicles</option>
              <option value="used">Used Vehicles</option>
              <option value="cpo">Certified Pre-Owned</option>
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Max Price
              </label>
              <span className="text-xs font-extrabold text-[#29abe2]">
                ${maxPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="300000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting / Results bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white border border-slate-100 px-5 py-3 rounded-2xl gap-3 shadow-sm">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Showing {filteredVehicles.length} of {vehicles.length} Vehicles
            </span>
            
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-0 text-xs font-bold text-slate-700 outline-none cursor-pointer focus:ring-0 focus:text-slate-900"
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="year_desc">Newest Year first</option>
                <option value="mileage_asc">Lowest Mileage first</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 bg-white border border-slate-50 rounded-3xl shadow-sm">
              <RefreshCw size={24} className="animate-spin text-[#29abe2]" />
              <span className="text-sm font-semibold text-slate-500">Loading live inventory...</span>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-20 bg-white border border-slate-100 rounded-3xl shadow-sm">
              <h4 className="text-lg font-bold text-slate-800 mb-1">No vehicles found</h4>
              <p className="text-sm text-slate-500 font-semibold mb-4">
                Try widening your search keywords or resetting the filters.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedMake('');
                  setSelectedBodyType('');
                  setSelectedCondition('');
                  setMaxPrice(300000);
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-5 py-2.5 rounded-2xl text-xs transition-colors shadow-sm"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.vin} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
