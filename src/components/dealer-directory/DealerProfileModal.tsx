import React from 'react';
import { 
  X, MapPin, Phone, Globe, ShieldCheck, CheckCircle2, 
  AlertTriangle, ArrowUpRight, FileSearch, Car, Zap, 
  TrendingDown, Check, Scale, ShieldAlert, Award
} from 'lucide-react';
import { EnrichedDealer } from './dealerTypes';

interface DealerProfileModalProps {
  dealer: EnrichedDealer | null;
  onClose: () => void;
  onAuditQuote?: (dealerName: string) => void;
  onViewFullProfile?: (slug: string) => void;
}

export const DealerProfileModal: React.FC<DealerProfileModalProps> = ({
  dealer,
  onClose,
  onAuditQuote,
  onViewFullProfile
}) => {
  if (!dealer) return null;

  const score = dealer.price_transparency_score ?? 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white/95 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.25)] border border-white/80 backdrop-blur-2xl text-slate-900 scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top light rim */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#29abe2]/40 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400/20 via-[#29abe2]/20 to-transparent border border-sky-300/40 flex items-center justify-center text-[#29abe2] font-black text-2xl shrink-0 shadow-sm">
            {dealer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {dealer.name}
              </h2>
              {dealer.is_claimed ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  Verified Dealer
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  Public Listing
                </span>
              )}
            </div>
            
            <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-1.5 flex-wrap">
              <MapPin size={13} className="text-[#29abe2]" />
              <span>{dealer.street_address}, {dealer.city}, {dealer.state} {dealer.zip_code}</span>
              <span>·</span>
              <span className="text-[#0284c7] font-semibold">{dealer.distance_miles} miles away</span>
            </p>
          </div>
        </div>

        {/* Transparency Score Hero Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mb-6 relative overflow-hidden shadow-lg shadow-slate-900/10">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#29abe2]/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-300 mb-1">
                <ShieldCheck size={14} className="text-[#29abe2]" />
                <span>CarMatrix Dealer Intel™ Score</span>
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Price Transparency &amp; Negotiation Grade
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-sm">
                Calculated from genuine transaction data, reported doc fees, and customer contract reviews.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black text-white leading-none">
                  {score}<span className="text-sm font-bold text-sky-400">/100</span>
                </div>
                <div className="text-[11px] font-bold text-emerald-400 mt-0.5">
                  {score >= 88 ? 'A+ Transparent' : score >= 78 ? 'B Verified' : 'C Caution'}
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <Award size={26} />
              </div>
            </div>
          </div>
        </div>

        {/* 4-Pillar Scorecard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-center">
          
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Stocked Vehicles</span>
            <span className="text-lg font-black text-slate-900 block">{dealer.active_inventory_count}</span>
            <span className="text-[10px] font-semibold text-slate-500">Live Inventory</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Avg Doc Fee</span>
            <span className="text-lg font-black text-slate-900 block">${dealer.doc_fee_display}</span>
            <span className="text-[10px] font-semibold text-emerald-600">Standard TX Rate</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Price Delta</span>
            <span className="text-lg font-black text-emerald-600 block">{dealer.price_delta_label}</span>
            <span className="text-[10px] font-semibold text-slate-500">vs Market Avg</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Consumer Trust</span>
            <span className="text-lg font-black text-slate-900 block flex items-center justify-center gap-1.5">
              <span>{dealer.customer_rating_display.toFixed(1)}</span>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-100/90 px-1.5 py-0.5 rounded border border-amber-200/60 leading-none">TRUST</span>
            </span>
            <span className="text-[10px] font-semibold text-slate-500">{dealer.review_count_display} reviews</span>
          </div>

        </div>

        {/* Detailed Protection Findings */}
        <div className="space-y-3 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Dealership Intel Checklist
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                <CheckCircle2 size={13} strokeWidth={2.4} />
              </div>
              <span>Honors online advertised pricing</span>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                <CheckCircle2 size={13} strokeWidth={2.4} />
              </div>
              <span>No mandatory nitrogen or tint packages</span>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                <CheckCircle2 size={13} strokeWidth={2.4} />
              </div>
              <span>Complies with Texas doc fee statutes</span>
            </div>

            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-700">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md flex items-center justify-center text-emerald-600 shadow-2xs shrink-0">
                <CheckCircle2 size={13} strokeWidth={2.4} />
              </div>
              <span>Trade-in valuations backed by market data</span>
            </div>
          </div>
        </div>

        {/* Brands & Contact Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            {dealer.phone && (
              <a href={`tel:${dealer.phone}`} className="flex items-center gap-1.5 hover:text-[#29abe2] transition-colors">
                <Phone size={14} className="text-[#29abe2]" />
                <span>{dealer.phone}</span>
              </a>
            )}
            {dealer.website && (
              <a 
                href={dealer.website} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-1.5 hover:text-[#29abe2] transition-colors"
              >
                <Globe size={14} className="text-[#29abe2]" />
                <span>Official Website</span>
                <ArrowUpRight size={12} />
              </a>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {dealer.brands.map((b, i) => (
              <span key={i} className="text-[11px] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          
          {/* Audit Quote Action */}
          <button
            onClick={() => {
              onClose();
              if (onAuditQuote) onAuditQuote(dealer.name);
            }}
            className="w-full sm:flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-[#29abe2]/15 border border-[#29abe2]/30 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs shrink-0">
              <FileSearch size={13} strokeWidth={2.4} />
            </div>
            <span>Audit a Quote</span>
          </button>

          {/* View Full Profile Hub */}
          {onViewFullProfile && (
            <button
              onClick={() => {
                onClose();
                onViewFullProfile(dealer.slug);
              }}
              className="w-full sm:flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md cursor-pointer"
            >
              <div className="w-6 h-6 rounded-lg bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-white shadow-inner shrink-0">
                <ShieldCheck size={13} strokeWidth={2.4} />
              </div>
              <span>Full Dealer Hub &amp; Lot</span>
            </button>
          )}

          {/* View Official Inventory */}
          <a
            href={dealer.website || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-[#29abe2] hover:bg-[#2089b5] text-white py-3.5 px-5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#29abe2]/20 cursor-pointer text-center"
          >
            <span>Website</span>
            <ArrowUpRight size={16} />
          </a>
        </div>

      </div>
    </div>
  );
};
