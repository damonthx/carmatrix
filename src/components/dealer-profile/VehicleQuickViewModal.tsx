import React, { useState } from 'react';
import { 
  X, Check, ShieldCheck, ArrowRight, Gauge, Fuel, 
  Settings, Car, DollarSign, Calendar, Heart, Share2, Phone
} from 'lucide-react';
import { DealerVehicle } from '../../services/dealerInventoryService';

interface VehicleQuickViewModalProps {
  vehicle: DealerVehicle | null;
  onClose: () => void;
  onContactDealer: (vehicle: DealerVehicle) => void;
}

export const VehicleQuickViewModal: React.FC<VehicleQuickViewModalProps> = ({
  vehicle,
  onClose,
  onContactDealer
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  if (!vehicle) return null;

  const savings = Math.max(0, vehicle.retail_price - vehicle.internet_price);
  const estimatedMonthly = Math.round((vehicle.internet_price * 0.9) * 0.0185); // 10% down, 60 mo estimate

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      
      {/* Modal Card */}
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white/95 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.3)] border border-white/80 backdrop-blur-2xl text-slate-900 scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top rim */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#29abe2]/50 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close vehicle modal"
        >
          <X size={18} />
        </button>

        {/* Modal Layout: 2 Columns on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Media & Photos (5 Cols) */}
          <div className="lg:col-span-6 space-y-3">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 shadow-md border border-slate-100">
              <img
                src={vehicle.images[selectedImageIdx] || vehicle.images[0]}
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-white border border-white/20">
                <span>{vehicle.new_used}</span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {vehicle.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {vehicle.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`relative w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      selectedImageIdx === i ? 'border-[#29abe2] ring-2 ring-[#29abe2]/30 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Vehicle Trust Badges */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>CARFAX Clean Title</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                <Check size={16} className="text-emerald-500 shrink-0" />
                <span>1-Owner History</span>
              </div>
            </div>
          </div>

          {/* Right Column: Vehicle Specs, Pricing & Lead Action (6 Cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            
            <div>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  <span>Stock #{vehicle.stock_number}</span>
                  <span>·</span>
                  <span>VIN: {vehicle.vin.slice(0, 10)}...</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h3>
                <div className="text-sm font-semibold text-slate-600 mt-0.5">
                  {vehicle.trim} · {vehicle.drive_type}
                </div>
              </div>

              {/* Pricing Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upfront Internet Price</span>
                  {savings > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                      Save ${savings.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-black text-slate-900 tracking-tight">
                    ${vehicle.internet_price.toLocaleString()}
                  </span>
                  {savings > 0 && (
                    <span className="text-sm font-semibold text-slate-400 line-through">
                      ${vehicle.retail_price.toLocaleString()} MSRP
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-500 mt-1 flex items-center gap-1">
                  <span>Estimated payment:</span>
                  <strong className="text-slate-800">${estimatedMonthly}/mo</strong>
                  <span className="text-[10.5px] text-slate-400">($0 down, 60 mo @ 6.9% APR)</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                  <Gauge size={16} className="text-[#29abe2]" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Mileage</span>
                    <span className="font-bold text-slate-800">{vehicle.mileage.toLocaleString()} mi</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                  <Fuel size={16} className="text-[#29abe2]" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Efficiency</span>
                    <span className="font-bold text-slate-800">{vehicle.mpg_city}/{vehicle.mpg_highway} MPG</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                  <Settings size={16} className="text-[#29abe2]" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Transmission</span>
                    <span className="font-bold text-slate-800 truncate">{vehicle.transmission}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-100 flex items-center gap-2.5">
                  <Car size={16} className="text-[#29abe2]" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">Exterior Color</span>
                    <span className="font-bold text-slate-800 truncate">{vehicle.exterior_color}</span>
                  </div>
                </div>
              </div>

              {/* Key Features Pill Cloud */}
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Highlighted Features
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {vehicle.features.map((feat, idx) => (
                    <span key={idx} className="text-[11px] font-semibold text-slate-600 bg-slate-100/90 px-2.5 py-1 rounded-lg border border-slate-200/60">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  onClose();
                  onContactDealer(vehicle);
                }}
                className="w-full sm:flex-1 bg-[#29abe2] hover:bg-[#2089b5] text-white py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#29abe2]/20 cursor-pointer transition-all active:scale-[0.99]"
              >
                <span>Contact Dealer About This Car</span>
                <ArrowRight size={16} />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
