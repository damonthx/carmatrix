import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Share, Heart, CheckCircle2, ShieldCheck, FileText, AlertTriangle, 
  ArrowRight, Gauge, MapPin, Search as SearchIcon, ChevronRight, ArrowUpRight
} from 'lucide-react';
import { MarketCheckCar } from './services/marketcheck';
import { getFavorites, toggleFavorite } from './services/favoritesService';

export default function VehicleDetailPage({ 
  vehicle, 
  onBack 
}: { 
  vehicle: MarketCheckCar; 
  onBack: () => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const favs = await getFavorites();
      setIsFavorited(favs.some((f: any) => f.vehicle_id === vehicle.id));
    }
    checkFavorite();
  }, [vehicle.id]);

  const handleToggleFav = async () => {
    try {
      const added = await toggleFavorite(vehicle);
      setIsFavorited(added);
    } catch (error: any) {
      alert(error.message);
    }
  };
  
  const images = vehicle.media?.photo_links && vehicle.media.photo_links.length > 0
    ? vehicle.media.photo_links 
    : ['https://images.unsplash.com/photo-1550262141-8631bc0cb67f?auto=format&fit=crop&w=1200&q=80'];

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isGreatDeal = true; // Placeholder for logic based on price
  const estimatedPayment = Math.round((vehicle.price || 20000) * 0.018); // Rough estimate

  return (
    <div className="bg-[#f9fafb] min-h-screen pb-20">
      {/* Top Banner / Breadcrumbs */}
      <div className="max-w-[1240px] mx-auto px-4 py-4">
        <button 
          onClick={onBack} 
          className="text-[#29abe2] text-[13px] font-bold flex items-center gap-1 hover:underline underline-offset-2 decoration-[1.5px]"
        >
          <ChevronLeft size={16} strokeWidth={2.5} /> All results
        </button>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column */}
        <div className="flex-1 w-full space-y-8">
          
          {/* Image Gallery */}
          <div className="relative rounded-[24px] overflow-hidden bg-slate-100 aspect-[4/3] md:aspect-[16/9] shadow-sm">
            {/* Badges & Actions */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-sm text-[11px] font-bold text-slate-800 tracking-wide uppercase">Sponsored</span>
            </div>
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:bg-white text-slate-700 shadow-sm transition-colors">
                <Share size={18} strokeWidth={1.5} />
              </button>
              <button 
                onClick={handleToggleFav}
                className={`w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm ${
                  isFavorited ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-white/90 text-slate-700 hover:bg-white'
                }`}
              >
                <Heart size={18} strokeWidth={2} fill={isFavorited ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <img 
              src={images[currentImageIndex]} 
              alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} 
              className="w-full h-full object-cover mix-blend-multiply" 
            />
            
            {images.length > 1 && (
              <>
                <button 
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-800 shadow-md backdrop-blur-sm transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-slate-800 shadow-md backdrop-blur-sm transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-medium tracking-wide">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/50 p-6 md:p-8">
            <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 gap-y-8">
               <FeatureItem icon={<Gauge size={24} strokeWidth={1}/>} label="Mileage" value={vehicle.miles !== undefined && vehicle.miles !== null ? `${vehicle.miles.toLocaleString()} mi` : 'Unlisted'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>} label="Drivetrain" value={(vehicle as any).build?.drivetrain || 'Front-Wheel Drive'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15V9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6"/><rect x="2" y="15" width="20" height="6" rx="1"/></svg>} label="Exterior color" value={(vehicle as any).exterior_color || 'Unknown'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>} label="Interior color" value={(vehicle as any).interior_color || 'Unknown'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>} label="MPG" value={(vehicle as any).build?.city_mpg ? `${(vehicle as any).build?.city_mpg} City / ${(vehicle as any).build?.highway_mpg} Hwy` : 'Unlisted'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="m14 7 3-3 3 3"/><path d="M17 4v16"/><path d="m10 17-3 3-3-3"/><path d="M7 20V4"/></svg>} label="Engine" value={(vehicle as any).build?.engine || 'Unlisted'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h18"/><path d="M3 14h18"/><path d="M5 6h14"/><path d="M5 18h14"/></svg>} label="Fuel type" value={(vehicle as any).build?.fuel_type || 'Gasoline'} />
               <FeatureItem icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.0...6a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>} label="Transmission" value={(vehicle as any).build?.transmission || 'Unlisted'} />
            </div>
          </div>
          
          {/* Pre-qualify Box */}
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-[#29abe2]/20 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
             <h3 className="text-[20px] font-extrabold text-slate-900 mb-6">Pre-qualify to <span className="text-[#29abe2]">know your monthly payment</span></h3>
             
             <div className="grid grid-cols-3 gap-8 w-full max-w-md mb-8">
               <div className="flex flex-col items-center">
                 <div className="text-[#29abe2] mb-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                 <span className="text-[12px] font-bold text-slate-600">No impact on credit score</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-[#29abe2] mb-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
                 <span className="text-[12px] font-bold text-slate-600">Unlock real rates</span>
               </div>
               <div className="flex flex-col items-center">
                 <div className="text-[#29abe2] mb-2"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg></div>
                 <span className="text-[12px] font-bold text-slate-600">Only takes minutes</span>
               </div>
             </div>
             
             <button className="border-2 border-slate-900 rounded-full px-8 py-3 text-[14px] font-bold text-slate-900 hover:bg-slate-50 transition-colors w-max">
               Get pre-qualified
             </button>
          </div>

          <div className="space-y-12">
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Overview</h2>
              <div className="grid grid-cols-2 gap-y-4 text-[14px]">
                 <OverviewRow label="Make:" value={vehicle.make} />
                 <OverviewRow label="Interior color:" value={(vehicle as any).interior_color || 'Unknown'} />
                 <OverviewRow label="Model:" value={vehicle.model} />
                 <OverviewRow label="Mileage:" value={vehicle.miles !== undefined && vehicle.miles !== null ? `${vehicle.miles.toLocaleString()} mi` : 'Unlisted'} />
                 <OverviewRow label="Year:" value={vehicle.year.toString()} />
                 <OverviewRow label="Condition:" value={vehicle.miles !== undefined && vehicle.miles !== null && vehicle.miles < 1000 ? 'New' : 'Used'} />
                 <OverviewRow label="Trim:" value={(vehicle as any).build?.trim || 'Unlisted'} />
                 <OverviewRow label="VIN:" value={vehicle.vin} />
                 <OverviewRow label="Body type:" value={(vehicle as any).build?.body_type || 'Unlisted'} />
                 <OverviewRow label="Stock number:" value={(vehicle as any).stock_no || 'Unlisted'} />
                 <OverviewRow label="Exterior color:" value={(vehicle as any).exterior_color || 'Unknown'} />
              </div>
            </div>
            
            <hr className="border-slate-200" />
            
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Fuel economy</h2>
              <div className="grid grid-cols-2 gap-y-4 text-[14px]">
                 <OverviewRow label="Fuel tank size:" value="14 gal" />
                 <OverviewRow label="Highway gas mileage:" value={`${(vehicle as any).build?.highway_mpg || '--'} MPG`} />
                 <OverviewRow label="Combined gas mileage:" value="-- MPG" />
                 <OverviewRow label="Fuel type:" value={(vehicle as any).build?.fuel_type || 'Gasoline'} />
                 <OverviewRow label="City gas mileage:" value={`${(vehicle as any).build?.city_mpg || '--'} MPG`} />
              </div>
            </div>
            
            <hr className="border-slate-200" />
            
            <div>
              <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Performance</h2>
              <div className="grid grid-cols-2 gap-y-4 text-[14px]">
                 <OverviewRow label="Transmission:" value={(vehicle as any).build?.transmission || 'Unlisted'} />
                 <OverviewRow label="Engine:" value={(vehicle as any).build?.engine || 'Unlisted'} />
                 <OverviewRow label="Drivetrain:" value={(vehicle as any).build?.drivetrain || 'Unlisted'} />
                 <OverviewRow label="Horsepower:" value="Unlisted" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/50 p-6 md:p-8">
            <h2 className="text-[20px] font-extrabold text-slate-900 mb-6 font-serif tracking-tight">Ready to buy? Here's how it works.</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#29abe2] font-bold text-[18px] shrink-0">1</div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-[15px] mb-1">Build your deal | <span className="text-[#29abe2] cursor-pointer hover:underline">Start now</span></h4>
                   <p className="text-slate-600 text-[14px] leading-relaxed">Find financing options, value your trade-in, and choose service and protection plans.</p>
                 </div>
              </div>
              <div className="w-0.5 h-6 bg-slate-200 ml-5 -my-4"></div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#29abe2] font-bold text-[18px] shrink-0">2</div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-[15px] mb-1">Choose pick up time</h4>
                   <p className="text-slate-600 text-[14px] leading-relaxed">Schedule a time to get your new car at the dealership.</p>
                 </div>
              </div>
              <div className="w-0.5 h-6 bg-slate-200 ml-5 -my-4"></div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[#29abe2] font-bold text-[18px] shrink-0">3</div>
                 <div>
                   <h4 className="font-bold text-slate-900 text-[15px] mb-1">Finalize your sale</h4>
                   <p className="text-slate-600 text-[14px] leading-relaxed">Head to the dealership to finish up your sale.</p>
                 </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 pt-4">
             <h2 className="text-[20px] font-extrabold text-slate-900 mb-2 mt-4">History</h2>
             <div className="space-y-5 relative pl-4">
               {/* Vertical line connector */}
               <div className="absolute left-[15px] top-[14px] bottom-6 w-0.5 bg-slate-200 -z-10"></div>
               
               {vehicle.carfax_clean_title !== false && (
                 <div className="flex gap-4 items-start relative bg-[#f9fafb]">
                    <div className="w-4 h-4 rounded-full bg-[#15b225] mt-0.5 shadow-[0_0_0_4px_#f9fafb] flex-shrink-0 flex items-center justify-center">
                       <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
                    </div>
                    <div className="-mt-0.5">
                      <h4 className="font-extrabold text-slate-900 text-[15px]">Clean title</h4>
                      <p className="text-slate-600 text-[14px]">No issues reported.</p>
                    </div>
                 </div>
               )}
               <div className="flex gap-4 items-start relative bg-[#f9fafb]">
                  <div className="w-4 h-4 rounded-full bg-[#15b225] mt-0.5 shadow-[0_0_0_4px_#f9fafb] flex-shrink-0 flex items-center justify-center">
                     <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
                  </div>
                  <div className="-mt-0.5">
                    <h4 className="font-extrabold text-slate-900 text-[15px]">0 accidents reported</h4>
                    <p className="text-slate-600 text-[14px]">No accidents or damage reported.</p>
                  </div>
               </div>
               <div className="flex gap-4 items-start relative bg-[#f9fafb]">
                  <div className="w-4 h-4 rounded-full bg-[#15b225] mt-0.5 shadow-[0_0_0_4px_#f9fafb] flex-shrink-0 flex items-center justify-center">
                     <CheckCircle2 size={12} strokeWidth={3} className="text-white" />
                  </div>
                  <div className="-mt-0.5">
                    <h4 className="font-extrabold text-slate-900 text-[15px]">{vehicle.carfax_1_owner ? '1 previous owner' : 'Prior owner(s)'}</h4>
                    <p className="text-slate-600 text-[14px]">{vehicle.carfax_1_owner ? 'Vehicle has one previous owner.' : 'Multiple owners.'}</p>
                  </div>
               </div>
             </div>
             
             <a href="#" className="inline-block mt-4 text-[13px] font-bold text-[#29abe2] hover:underline underline-offset-2 flex items-center gap-1 group">
               Save 20% on the full AutoCheck vehicle history report <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
             </a>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/50 p-6 md:p-8">
             <div className="flex justify-between items-center mb-8">
               <h2 className="text-[20px] font-extrabold text-slate-900">Pricing</h2>
                <img src="https://res.cloudinary.com/yrhldsmj/image/upload/v1789086556/Logo-CarMatrix_avzdkk.png" alt="CarMeta" className="h-8 object-contain" referrerPolicy="no-referrer" />
             </div>
             
             <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
               <div className="w-[200px] h-[100px] relative shrink-0">
                  <div className="w-full h-full border-[12px] border-slate-200 rounded-t-full border-b-0 absolute"></div>
                  {isGreatDeal ? (
                     <div className="w-full h-full border-[12px] border-[#15b225] rounded-t-full border-b-0 absolute" style={{ clipPath: 'polygon(0 0, 80% 0, 80% 100%, 0 100%)' }}></div>
                  ) : (
                     <div className="w-full h-full border-[12px] border-slate-400 rounded-t-full border-b-0 absolute" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}></div>
                  )}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-center w-full">
                     <div className="text-[32px] font-extrabold text-slate-900 leading-none mb-1">${vehicle.price?.toLocaleString() || '---'}</div>
                     <div className="flex items-center justify-center gap-1.5 text-[14px] font-bold text-[#15b225]">
                       <ArrowRight size={16} className="rotate-90"/> Good Deal
                     </div>
                  </div>
               </div>
               
               <div className="space-y-4 flex-1 w-full bg-[#f9fafb] p-4 rounded-xl border border-slate-100">
                 <div className="flex justify-between items-start">
                    <div>
                       <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">New arrival at the dealership</h4>
                       <p className="text-[12px] text-slate-500">New arrival - 0 saves. This car has been on the site for less than 48 hours.</p>
                    </div>
                 </div>
                 <hr className="border-slate-200"/>
                 <div>
                    <h4 className="text-[14px] font-bold text-slate-900 mb-0.5">Pricing</h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed">
                      Contact the dealer for pricing details. Due to Texas Department of Motor Vehicle regulations CarMeta is unable to show the exact IMV or price history for this car.
                    </p>
                 </div>
               </div>
             </div>
             
             <button className="bg-[#29abe2] text-white px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-[#2089b5] transition-colors">
               Contact dealer
             </button>
          </div>

          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/50 p-6 md:p-8">
             <h2 className="text-[20px] font-extrabold text-slate-900 mb-6">Dealer's description</h2>
             <p className="text-[14px] text-slate-700 leading-relaxed mb-4">
               Vehicle Name: {vehicle.year} {vehicle.make} {vehicle.model}<br/><br/>
               {vehicle.heading || 'A great vehicle for a great price.'}<br/><br/>
               Thank you for viewing this vehicle at {vehicle.dealer?.name || 'our dealership'}. We offer competitive pricing, comprehensive financing options, and top-tier customer service. This vehicle has been thoroughly inspected to ensure it meets our highest standards of quality and reliability. Come down for a test drive today!
             </p>
             <button className="text-[14px] font-bold text-[#29abe2] hover:underline">Read more</button>
          </div>
          
          <div className="bg-[#f0f5fa] rounded-[24px] p-6 md:p-8 flex items-center justify-between">
            <div>
               <h2 className="text-[16px] font-extrabold text-slate-900 mb-1">Notify me of new listings like this one</h2>
               <p className="text-[13px] text-slate-600">We'll alert you right away when vehicles matching {vehicle.make} {vehicle.model} are added.</p>
            </div>
            <button className="bg-white border border-slate-200 text-slate-900 px-6 py-2.5 rounded-full font-bold text-[14px] hover:bg-slate-50 transition-colors shadow-sm whitespace-nowrap ml-4 shrink-0">
               Notify me
            </button>
          </div>

          <div className="pt-4">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-[20px] font-extrabold text-slate-900">Recommended from this dealer</h2>
                <div className="flex gap-2">
                   <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ChevronLeft size={16} /></button>
                   <button className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:bg-slate-50"><ChevronRight size={16} /></button>
                </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-[16px] shadow-sm border border-slate-200/50 overflow-hidden cursor-pointer hover:-translate-y-1 transition-transform group">
                     <div className="h-32 bg-slate-100 overflow-hidden">
                        <img src={`https://images.unsplash.com/photo-1550262141-8631bc0cb67f?auto=format&fit=crop&w=400&q=80&sig=${i}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform mix-blend-multiply" alt="Car" />
                     </div>
                     <div className="p-4">
                        <div className="text-[15px] font-extrabold text-slate-900 mb-1 tracking-tight">2024 Similar Model</div>
                        <div className="text-[16px] font-bold text-slate-900 mb-2">$30,500</div>
                        <div className="text-[12px] font-bold text-[#15b225] flex items-center gap-1"><ArrowRight size={12} className="rotate-90"/> Good Deal</div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
          
        </div>

        {/* Right Column (Sticky Form) */}
        <div className="w-full lg:w-[350px] shrink-0 sticky top-[88px] space-y-6 pb-20">
          <div className="bg-white rounded-[24px] shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-slate-200/60 p-6 flex flex-col items-center">
            <h1 className="text-[20px] font-extrabold text-slate-900 mb-1 tracking-tight text-center leading-tight">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-[14px] text-slate-500 font-medium mb-4 text-center">{(vehicle as any).build?.trim || 'Base'} • {(vehicle.dealer?.city || 'City')}, {(vehicle.dealer?.state || 'ST')}</p>
            
            <div className="text-[32px] font-extrabold text-slate-900 mb-1 tracking-tighter">
              {vehicle.price !== undefined && vehicle.price !== null ? `$${vehicle.price.toLocaleString()}` : 'Contact Dealer'}
            </div>
            
            {isGreatDeal && (
              <div className="flex items-center gap-1.5 text-[14px] font-extrabold text-[#15b225] bg-[#15b225]/10 px-3 py-1 rounded-full mb-6">
                <ArrowRight size={16} strokeWidth={2.5} className="rotate-90"/> Good Deal
              </div>
            )}
            
            <button className="w-full bg-[#29abe2] text-white py-3.5 rounded-xl font-bold text-[16px] mb-3 hover:bg-[#2089b5] transition-colors shadow-sm">
              Check availability
            </button>
            <button className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-xl font-bold text-[15px] hover:bg-slate-50 transition-colors mb-4">
              See finance & trade-in options
            </button>
            
            <div className="flex items-center justify-center gap-4 text-[14px] font-bold text-slate-700 w-full pt-4 border-t border-slate-100">
               <button className="hover:text-[#29abe2] transition-colors">Call dealer</button>
               <span className="text-slate-300">•</span>
               <button className="hover:text-[#29abe2] transition-colors">Chat</button>
            </div>
          </div>
          
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200/50 overflow-hidden">
             <div className="p-5 border-b border-slate-100 flex items-center justify-center">
                <img src="https://www.image2url.com/r2/default/images/1777088231362-e5b0b2e3-aaeb-475f-b52b-3129323c21a1.png" alt="Dealer" className="h-8 object-contain" referrerPolicy="no-referrer" />
             </div>
             <div className="p-5 overflow-hidden">
                <h4 className="font-extrabold text-slate-900 text-[15px] mb-1">{vehicle.dealer?.name || 'Authorized Dealer'}</h4>
                <div className="flex items-center gap-1 mb-3">
                   <div className="text-[#29abe2] font-bold text-[14px]">Open</div>
                   <div className="text-slate-500 text-[13px] font-medium">• Closes at 8:30 PM</div>
                </div>
                <button className="text-[#29abe2] font-bold text-[14px] hover:underline mb-1 whitespace-nowrap overflow-hidden text-ellipsis block max-w-full">
                  (555) 123-4567
                </button>
                <button className="text-[#29abe2] font-bold text-[14px] flex items-start gap-1 hover:underline text-left">
                  <MapPin size={16} className="shrink-0 mt-0.5" /> 
                  <span className="leading-tight">{vehicle.dealer?.city || 'City'}, {vehicle.dealer?.state || 'ST'}</span>
                </button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const FeatureItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex flex-col gap-2 relative">
    <div className="text-slate-400 mb-1">{icon}</div>
    <div>
      <div className="text-[12px] font-bold text-slate-900">{label}</div>
      <div className="text-[14px] text-slate-600 font-medium">{value}</div>
    </div>
  </div>
);

const OverviewRow = ({ label, value }: { label: string, value: string }) => (
  <div className="flex">
    <span className="font-bold text-slate-900 w-[140px] shrink-0">{label}</span>
    <span className="text-slate-600 font-medium truncate pr-4">{value}</span>
  </div>
);
