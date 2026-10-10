import React, { useState } from 'react';
import { 
  X, CheckCircle2, Calendar, Clock, Car, Phone, Mail, 
  User, ShieldCheck, ArrowRight, Loader2
} from 'lucide-react';
import { Dealership } from '../../types/dealerIntel';
import { DealerVehicle, DealerInventoryService, LeadSubmission } from '../../services/dealerInventoryService';

interface LeadInquiryModalProps {
  dealer: Dealership;
  vehicle?: DealerVehicle | null;
  initialInquiryType?: 'test_drive' | 'pricing' | 'availability' | 'trade_in';
  onClose: () => void;
}

export const LeadInquiryModal: React.FC<LeadInquiryModalProps> = ({
  dealer,
  vehicle,
  initialInquiryType = 'test_drive',
  onClose
}) => {
  const [inquiryType, setInquiryType] = useState<LeadSubmission['inquiryType']>(initialInquiryType);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('Morning (9 AM - 12 PM)');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await DealerInventoryService.submitLead({
        dealerId: dealer.id,
        dealerName: dealer.name,
        vin: vehicle?.vin,
        vehicleHeading: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}` : undefined,
        firstName,
        lastName,
        email,
        phone,
        preferredTime: `${preferredDate} · ${preferredTime}`,
        message,
        inquiryType
      });
      setIsSuccess(true);
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      
      <div 
        className="relative w-full max-w-lg bg-white/95 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(15,23,42,0.3)] border border-white/80 backdrop-blur-2xl text-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.05)] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X size={15} strokeWidth={2.4} />
        </button>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400/20 via-emerald-500/15 to-transparent border border-emerald-300/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.9),0_4px_16px_rgba(16,185,129,0.2)] text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} strokeWidth={2.4} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Appointment Request Sent!
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto mb-6">
              Your inquiry has been routed directly to the verified VIP desk at <strong>{dealer.name}</strong>. A concierge representative will confirm your visit shortly.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#29abe2] text-white rounded-2xl text-xs font-bold hover:bg-[#2089b5] transition-all shadow-md shadow-[#29abe2]/20 cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-5 pr-8">
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#29abe2] block mb-1">
                Verified Direct Routing
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                {inquiryType === 'test_drive' ? 'Schedule VIP Test Drive' : 'Contact Dealership Desk'}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {dealer.name} · {dealer.city}, TX
              </p>
            </div>

            {/* Selected Vehicle Badge (if attached) */}
            {vehicle && (
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5">
                <img
                  src={vehicle.images[0]}
                  alt="thumbnail"
                  className="w-14 h-11 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-slate-900 truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </div>
                  <div className="text-[11px] text-[#29abe2] font-bold">
                    ${vehicle.internet_price.toLocaleString()} · Stock #{vehicle.stock_number}
                  </div>
                </div>
              </div>
            )}

            {/* Inquiry Type Pills */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setInquiryType('test_drive')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  inquiryType === 'test_drive'
                    ? 'bg-[#29abe2] text-white border-[#29abe2] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                Test Drive
              </button>
              <button
                type="button"
                onClick={() => setInquiryType('pricing')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  inquiryType === 'pricing'
                    ? 'bg-[#29abe2] text-white border-[#29abe2] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                Quote / Out-The-Door
              </button>
              <button
                type="button"
                onClick={() => setInquiryType('availability')}
                className={`py-2 px-1 text-center rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  inquiryType === 'availability'
                    ? 'bg-[#29abe2] text-white border-[#29abe2] shadow-sm'
                    : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                Availability
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Jane"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(214) 555-0199"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20 outline-none transition-all"
                  />
                </div>
              </div>

              {inquiryType === 'test_drive' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Preferred Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Time of Day</label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] outline-none cursor-pointer"
                    >
                      <option>Morning (9 AM - 12 PM)</option>
                      <option>Afternoon (12 PM - 4 PM)</option>
                      <option>Evening (4 PM - 7 PM)</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Notes / Questions (Optional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about doc fee verification, trade-in, or specific vehicle options..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:border-[#29abe2] outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#29abe2] hover:bg-[#2089b5] text-white py-3 px-6 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#29abe2]/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Sending to Dealer Desk...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Appointment Request</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
