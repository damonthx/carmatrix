import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, Tag, CarFront, ShieldCheck, 
  User, CheckCircle2, AlertTriangle, ArrowUpRight, Check, X, ArrowUpCircle, Heart,
  Battery, LayoutGrid, History, Loader2, MapPin, Sparkles
} from 'lucide-react';
import { searchCars, MarketCheckCar } from './services/marketcheck';
import { getFavorites, toggleFavorite } from './services/favoritesService';
import { getMakes, getModelsForMake } from './services/nhtsa';
import { supabase } from './supabaseClient';

const bodyTypes = ['SUV', 'Sedan', 'Pickup Truck', 'Coupe', 'Hatchback'];
const fuelTypes = ['Gas', 'Electric', 'Hybrid'];

export default function SearchPage({ 
  onClose, 
  onSelectVehicle,
  initialFilters
}: { 
  onClose: () => void;
  onSelectVehicle?: (vehicle: MarketCheckCar) => void;
  initialFilters?: any;
}) {
  const [searchTerm, setSearchTerm] = useState(initialFilters?.searchTerm || '');
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState(50);
  const [apiSearchTrigger, setApiSearchTrigger] = useState(0);
  
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice || 100000);
  const [maxMileage, setMaxMileage] = useState(100000);
  const [selectedMake, setSelectedMake] = useState<string>(initialFilters?.make || '');
  const [selectedModel, setSelectedModel] = useState<string>(initialFilters?.model || '');
  const [selectedYear, setSelectedYear] = useState<string>(initialFilters?.year ? initialFilters.year.toString() : '');
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>(initialFilters?.bodyTypes || []);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(initialFilters?.fuelTypes || []);
  const [noAccidents, setNoAccidents] = useState(false);
  const [singleOwner, setSingleOwner] = useState(false);
  
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // MarketCheck Live Data
  const [liveCars, setLiveCars] = useState<MarketCheckCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    async function loadCars() {
      setIsLoading(true);
      try {
        const cars = await searchCars({
          zip: zipCode || undefined,
          radius: zipCode ? radius : undefined,
          make: selectedMake || undefined,
          model: selectedModel || undefined,
          year: selectedYear || undefined,
          query: searchTerm || undefined
        });
        setLiveCars(cars);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    loadCars();
  }, [apiSearchTrigger, selectedMake, selectedModel, selectedYear, searchTerm]);

  useEffect(() => {
    async function loadFavorites() {
      const favs = await getFavorites();
      setFavorites(favs.map((f: any) => f.vehicle_id));
    }
    loadFavorites();
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, car: MarketCheckCar) => {
    e.stopPropagation();
    try {
      const isAdded = await toggleFavorite(car);
      if (isAdded) {
        setFavorites(prev => [...prev, car.id]);
      } else {
        setFavorites(prev => prev.filter(id => id !== car.id));
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  useEffect(() => {
    setSelectedModel('');
  }, [selectedMake]);

  const [availableMakes, setAvailableMakes] = useState<string[]>([]);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    async function fetchMakes() {
      const makes = await getMakes();
      setAvailableMakes(makes);
    }
    fetchMakes();
  }, []);

  useEffect(() => {
    async function fetchModels() {
      if (!selectedMake) {
        setAvailableModels([]);
        return;
      }
      const models = await getModelsForMake(selectedMake);
      setAvailableModels(models);
    }
    fetchModels();
  }, [selectedMake]);

  const filteredVehicles = useMemo(() => {
    return liveCars.filter(vehicle => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase().trim();
        const vehicleName = `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.build?.trim || ''}`.toLowerCase();
        
        // Split query into tokens and ensure all tokens are present in the vehicle name
        const tokens = query.split(/\s+/);
        const matchesAllTokens = tokens.every(token => vehicleName.includes(token));
        
        if (!matchesAllTokens) {
          return false;
        }
      }
      
      // Make, Model, Year Selects
      if (selectedMake && vehicle.make !== selectedMake) return false;
      if (selectedModel && vehicle.model !== selectedModel) return false;
      if (selectedYear && vehicle.year && vehicle.year !== parseInt(selectedYear)) return false;
      
      // Price & Mileage
      if (vehicle.price && vehicle.price > maxPrice) return false;
      if (vehicle.miles && vehicle.miles > maxMileage) return false;
      
      // Multi-selects
      if (selectedBodyTypes.length > 0) {
        if (!vehicle.build?.body_type) return false;
        const normalizedBodyType = vehicle.build.body_type.toLowerCase();
        const matchesBody = selectedBodyTypes.some(selected => {
          if (selected === 'SUV') return normalizedBodyType.includes('suv');
          if (selected === 'Pickup Truck') return normalizedBodyType.includes('pickup') || normalizedBodyType.includes('truck');
          return normalizedBodyType.includes(selected.toLowerCase());
        });
        if (!matchesBody) return false;
      }
      
      if (selectedFuelTypes.length > 0) {
        if (!vehicle.build?.fuel_type) return false;
        const normalizedFuelType = vehicle.build.fuel_type.toLowerCase();
        const matchesFuel = selectedFuelTypes.some(selected => {
          if (selected === 'Gas') return normalizedFuelType.includes('unleaded') || normalizedFuelType.includes('gas');
          if (selected === 'Electric') return normalizedFuelType.includes('electric') || normalizedFuelType.includes('battery');
          if (selected === 'Hybrid') return normalizedFuelType.includes('hybrid');
          return normalizedFuelType.includes(selected.toLowerCase());
        });
        if (!matchesFuel) return false;
      }
      
      // Toggles
      // Note: MarketCheck uses carfax_clean_title (true/false) generally for accidents/salvage. We use that for 'No accidents'
      if (noAccidents && vehicle.carfax_clean_title === false) return false;
      if (singleOwner && !vehicle.carfax_1_owner) return false;
      
      return true;
    });
  }, [searchTerm, maxPrice, maxMileage, selectedBodyTypes, selectedFuelTypes, noAccidents, singleOwner, liveCars, selectedMake, selectedModel]);


  const toggleBodyType = (type: string) => {
    setSelectedBodyTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const toggleFuelType = (type: string) => {
    setSelectedFuelTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const executeApiSearch = () => {
    setApiSearchTrigger(prev => prev + 1);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setZipCode('');
    setRadius(50);
    setSelectedMake('');
    setSelectedModel('');
    setMaxPrice(100000);
    setMaxMileage(100000);
    setSelectedBodyTypes([]);
    setSelectedFuelTypes([]);
    setNoAccidents(false);
    setSingleOwner(false);
    // Trigger reset search if zip was previously searched
    setApiSearchTrigger(prev => prev + 1);
  };

  const SidebarContent = () => (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center hidden md:flex">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">Filters</h3>
        <button onClick={clearFilters} className="text-sm font-semibold text-[#29abe2] hover:underline decoration-[1.5px] decoration-[#29abe2]/40 underline-offset-2">Clear all</button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} strokeWidth={1} />
          <input 
            type="text" 
            placeholder="Search Keyword" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 outline-none shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="pt-2 border-t border-slate-200/50">
          <span className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2 mt-2"><MapPin size={16} strokeWidth={1} className="text-slate-600"/> Location</span>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              placeholder="Zip Code" 
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              maxLength={5}
              className="w-[100px] px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 outline-none shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={executeApiSearch}
              className="flex-1 bg-[#29abe2] text-white text-sm font-bold rounded-xl hover:bg-[#2089b5] transition-colors shadow-xs cursor-pointer"
            >
              Apply
            </button>
          </div>
          {zipCode.length === 5 && (
            <div className="pt-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-600">Search Radius</span>
                <span className="text-xs font-bold text-[#29abe2]">{radius} mi</span>
              </div>
              <input 
                type="range" min="10" max="250" step="10"
                value={radius} onChange={(e) => setRadius(Number(e.target.value))}
                onMouseUp={executeApiSearch}
                onTouchEnd={executeApiSearch}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <div className="grid grid-cols-2 gap-2">
            <select 
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 outline-none shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all cursor-pointer"
            >
              <option value="">All Makes</option>
              {availableMakes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
            <select 
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedMake}
              className="w-full px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-xl text-sm font-semibold text-slate-900 outline-none shadow-xs focus:ring-2 focus:ring-[#29abe2]/20 focus:border-[#29abe2] transition-all cursor-pointer disabled:opacity-50"
            >
              <option value="">All Models</option>
              {availableModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2"><Tag size={16} strokeWidth={1} className="text-slate-600"/> Max Price</span>
            <span className="text-sm font-bold text-[#29abe2]">${maxPrice.toLocaleString()}</span>
          </div>
          <input 
            type="range" min="10000" max="150000" step="500"
            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
          />
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-slate-900 flex items-center gap-2"><CarFront size={16} strokeWidth={1} className="text-slate-600"/> Max Mileage</span>
            <span className="text-sm font-bold text-[#29abe2]">{maxMileage.toLocaleString()} mi</span>
          </div>
          <input 
            type="range" min="0" max="150000" step="1000"
            value={maxMileage} onChange={(e) => setMaxMileage(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#29abe2]"
          />
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <span className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><LayoutGrid size={16} strokeWidth={1} className="text-slate-600"/> Body Style</span>
          <div className="flex flex-wrap gap-2">
            {bodyTypes.map(type => (
              <button 
                key={type}
                onClick={() => toggleBodyType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedBodyTypes.includes(type) 
                    ? 'bg-[#29abe2] text-white border-[#29abe2]' 
                    : 'bg-white/50 text-slate-700 border-slate-200 hover:bg-white/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50">
          <span className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2"><Battery size={16} strokeWidth={1} className="text-slate-600"/> Fuel Type</span>
          <div className="flex flex-wrap gap-2">
            {fuelTypes.map(type => (
              <button 
                key={type}
                onClick={() => toggleFuelType(type)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  selectedFuelTypes.includes(type) 
                    ? 'bg-slate-800 text-white border-slate-800' 
                    : 'bg-white/50 text-slate-700 border-slate-200 hover:bg-white/80'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200/50 space-y-3">
          <span className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2"><History size={16} strokeWidth={1} className="text-slate-600"/> Vehicle History</span>
          
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${noAccidents ? 'bg-[#15b225] border-[#15b225]' : 'bg-white/50 border-slate-300 group-hover:border-[#15b225]'}`}>
              {noAccidents && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1} className={noAccidents ? "text-[#15b225]" : "text-slate-500"}/>
              <span className="text-sm font-medium text-slate-800">No Accidents</span>
            </div>
            <input type="checkbox" checked={noAccidents} onChange={(e) => setNoAccidents(e.target.checked)} className="hidden" />
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${singleOwner ? 'bg-[#29abe2] border-[#29abe2]' : 'bg-white/50 border-slate-300 group-hover:border-[#29abe2]'}`}>
              {singleOwner && <Check size={14} className="text-white" strokeWidth={3} />}
            </div>
            <div className="flex items-center gap-2">
              <User size={16} strokeWidth={1} className={singleOwner ? "text-[#29abe2]" : "text-slate-500"}/>
              <span className="text-sm font-medium text-slate-800">Single Owner</span>
            </div>
            <input type="checkbox" checked={singleOwner} onChange={(e) => setSingleOwner(e.target.checked)} className="hidden" />
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-slate-50/50 min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 relative z-10">
      
      {/* Search Header Config */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <button onClick={onClose} className="p-1 hover:bg-slate-200/50 rounded-full transition-colors hidden md:block">
               <ArrowUpRight size={20} className="-rotate-135 text-slate-500"/>
            </button>
            Used Cars for Sale
          </h1>
          <p className="text-sm text-slate-600 font-medium mt-1 md:ml-9">Showing {filteredVehicles.length} matching vehicles</p>
        </div>
        
        <button 
          onClick={() => setIsMobileFiltersOpen(true)}
          className="md:hidden w-full light-glass rounded-xl py-3 px-4 flex items-center justify-center gap-2 text-sm font-bold text-slate-900"
        >
          <SlidersHorizontal size={16} strokeWidth={1} /> Filters
        </button>
      </div>

      {initialFilters?.aiReasoning && (
        <div className="mb-8 p-4 md:p-5 bg-indigo-50/80 border border-indigo-100 rounded-2xl flex items-start gap-4">
          <div className="mt-0.5 text-indigo-500 shrink-0">
            <Sparkles size={20} strokeWidth={2} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900 text-[15px] mb-1">AI Recommendation</h3>
            <p className="text-indigo-800 font-medium text-sm leading-relaxed">{initialFilters.aiReasoning}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-[280px] shrink-0 sticky top-24 light-glass-card rounded-[24px] p-6 max-h-[calc(100vh-120px)] overflow-y-auto no-scrollbar">
          <SidebarContent />
        </div>

        {/* Mobile Drawer Overlay */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-[60] flex md:hidden bg-black/20 backdrop-blur-sm">
            <div className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-[#f9fafb] shadow-2xl p-6 overflow-y-auto border-l border-white/40 slide-in-from-right-full animate-in duration-300">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Filters</h3>
                 <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 bg-white rounded-full shadow-sm">
                   <X size={20} />
                 </button>
               </div>
               <div className="bg-white/60 backdrop-blur-md border border-slate-200/50 p-5 rounded-2xl shadow-sm mb-6">
                 <SidebarContent />
               </div>
               <button onClick={() => setIsMobileFiltersOpen(false)} className="w-full bg-[#0055c8] text-white py-3 rounded-xl font-bold mt-4 shadow-sm hover:bg-[#003b8e] transition-colors">
                  Show {filteredVehicles.length} results
               </button>
            </div>
          </div>
        )}

        {/* Vehicle Grid */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center">
              <Loader2 className="animate-spin text-[#29abe2] mb-4" size={32} />
              <p className="text-sm font-medium text-slate-500">Loading live cars...</p>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="col-span-full py-20 text-center light-glass-card rounded-3xl">
              <CarFront size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1} />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No cars found</h3>
              <p className="text-sm text-slate-500 font-medium">Try adjusting your filters to find more matches.</p>
              <button onClick={clearFilters} className="mt-6 px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-bold text-[#29abe2] hover:bg-slate-50 transition-colors">
                Clear all filters
              </button>
            </div>
          ) : (
            filteredVehicles.map(car => {
              const image = car.media?.photo_links?.[0] || 'https://images.unsplash.com/photo-1550262141-8631bc0cb67f?auto=format&fit=crop&w=600&q=80';
              return (
              <div 
                key={car.id} 
                onClick={() => onSelectVehicle?.(car)}
                className="light-glass-card rounded-[20px] overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-[180px] bg-slate-100 overflow-hidden">
                  <img src={image} alt={`${car.year} ${car.make} ${car.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                  
                  <button 
                    onClick={(e) => handleToggleFavorite(e, car)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-sm ${
                      favorites.includes(car.id)
                        ? 'bg-rose-500 text-white'
                        : 'bg-white/30 text-slate-900 opacity-0 group-hover:opacity-100 hover:bg-white/80'
                    }`}
                  >
                    <Heart size={16} strokeWidth={2} fill={favorites.includes(car.id) ? 'currentColor' : 'none'}/>
                  </button>
                </div>
                
                <div className="p-4 flex-1 flex flex-col">
                  <div className="text-xs font-bold text-slate-500 mb-1 tracking-wide">{car.year} • {car.miles ? `${car.miles.toLocaleString()} mi` : 'Mileage unlisted'}</div>
                  <h4 className="text-[17px] font-extrabold text-slate-900 leading-tight mb-2 tracking-tight group-hover:text-[#29abe2] transition-colors">
                    {car.make} {car.model}
                  </h4>
                  <div className="text-[20px] font-bold text-slate-900 mb-4">{car.price ? `$${car.price.toLocaleString()}` : 'Contact for price'}</div>
                  
                  <div className="mt-auto space-y-2">
                    {car.carfax_clean_title !== false && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                        <CheckCircle2 size={13} className="text-[#15b225] fill-[#15b225]/20" /> Clean title reported
                      </div>
                    )}
                    {car.carfax_1_owner === true && (
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                         <User size={13} className="text-[#29abe2] fill-[#29abe2]/20" /> 1-owner vehicle
                      </div>
                    )}
                     <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis">
                        <Tag size={13} className="text-slate-400 shrink-0" /> {car.dealer?.name || 'Local Dealer'} - {car.dealer?.city || 'City'}, {car.dealer?.state || 'State'}
                      </div>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-1">
                   <button className="w-full bg-[#29abe2]/5 hover:bg-[#29abe2]/10 text-[#29abe2] py-2.5 rounded-xl text-[13px] font-bold transition-colors">
                     Check availability
                   </button>
                </div>
              </div>
            )})
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
