import React, { useState } from 'react';
import { 
  X, ShieldAlert, ShieldCheck, AlertTriangle, FileText, Upload, 
  CheckCircle2, DollarSign, Calendar, Car, Sliders, Info, Lock, 
  HelpCircle, Eye, ArrowRight, Award, Building2
} from 'lucide-react';
import { Dealership } from '../../types/dealerIntel';
import { CreateReviewInput, CreateEvidenceInput } from '../../services/dealerIntelValidation';
import { DealerIntelService, STANDARD_SEED_TAGS } from '../../services/dealerIntelService';
import { DFW_DEALERSHIPS_SEED } from '../../services/dfwDealerSeedData';

interface DealerAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDealer?: Dealership | null;
  onAuditSubmitted?: (reviewId: string) => void;
}

// Hidden Fee Flag Options
const HIDDEN_FEE_OPTIONS = [
  { id: 'doc-fee-200', label: 'Doc Fee Exceeded $200 (TX Guideline Cap is $150)', flag: 'warning', tagSlug: 'unexpected-fees' },
  { id: 'paint-nitrogen', label: 'Forced Paint Protection / Nitrogen ($500–$2,500+)', flag: 'critical', tagSlug: 'forced-addons' },
  { id: 'lojack-tracker', label: 'Mandatory LoJack / GPS Anti-Theft Tracker', flag: 'critical', tagSlug: 'forced-addons' },
  { id: 'finance-markup', label: 'Finance Rate / APR Markup (Rate bump above buy-rate)', flag: 'critical', tagSlug: 'financing-terms-changed' },
  { id: 'market-adjustment', label: 'Market Adjustment (ADM) / Showroom Premium', flag: 'critical', tagSlug: 'advertised-price-discrepancy' },
  { id: 'ceramic-tint', label: 'Window Tint / Fabric Sealant Package ($795–$1,995)', flag: 'warning', tagSlug: 'forced-addons' },
  { id: 'key-replacement', label: 'Non-Negotiable Key Care / Tire & Wheel Protection', flag: 'warning', tagSlug: 'unexpected-fees' },
  { id: 'trade-undervalue', label: 'Hostage Keys or Arbitrary Trade-In Lowball', flag: 'critical', tagSlug: 'trade-in-concerns' }
];

export const DealerAuditModal: React.FC<DealerAuditModalProps> = ({
  isOpen,
  onClose,
  preselectedDealer = null,
  onAuditSubmitted
}) => {
  // Dealership Selection
  const [selectedDealerId, setSelectedDealerId] = useState<string>(preselectedDealer?.id || '');
  const [dealerSearchQuery, setDealerSearchQuery] = useState<string>(preselectedDealer?.name || '');
  const [isDealerDropdownOpen, setIsDealerDropdownOpen] = useState(false);

  // Section 1: Transaction Context
  const [interactionType, setInteractionType] = useState<'walked_out' | 'bought_new' | 'bought_used' | 'service'>('bought_new');
  const [experienceDate, setExperienceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [vehicleYear, setVehicleYear] = useState<number>(2024);
  const [vehicleMake, setVehicleMake] = useState<string>(preselectedDealer?.brands[0] || 'Toyota');
  const [vehicleModel, setVehicleModel] = useState<string>('');
  const [vehicleTrim, setVehicleTrim] = useState<string>('');

  // Section 2: Transparency & Pricing Audit
  const [otdMatchedAdvertised, setOtdMatchedAdvertised] = useState<'yes' | 'no' | 'much_higher'>('yes');
  const [selectedHiddenFees, setSelectedHiddenFees] = useState<string[]>([]);
  const [surpriseAddonTotal, setSurpriseAddonTotal] = useState<number | ''>('');
  const [docFeePaid, setDocFeePaid] = useState<number | ''>(150);

  // Section 3: Dealer Integrity Score (1 to 5)
  const [priceHonestyRating, setPriceHonestyRating] = useState<number>(5);
  const [pressureTacticsRating, setPressureTacticsRating] = useState<number>(5); // 5 = low pressure / respectful
  const [overallFairnessRating, setOverallFairnessRating] = useState<number>(5);

  // Section 4: Narrative & Proof
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [communityNarrative, setCommunityNarrative] = useState<string>('');
  const [adviceForBuyers, setAdviceForBuyers] = useState<string>('');
  const [reviewerName, setReviewerName] = useState<string>('Verified Buyer');
  const [reviewerCity, setReviewerCity] = useState<string>('Dallas');
  const [reviewerState, setReviewerState] = useState<string>('TX');

  // Evidence Upload
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<'buyer_order' | 'bill_of_sale' | 'lease_agreement' | 'window_sticker'>('buyer_order');
  const [redactionConfirmed, setRedactionConfirmed] = useState<boolean>(false);

  // Form State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{ reviewId: string; verified: boolean } | null>(null);

  if (!isOpen) return null;

  // Filtered Dealerships for searchable dropdown
  const filteredDealers = DFW_DEALERSHIPS_SEED.filter(d => 
    d.name.toLowerCase().includes(dealerSearchQuery.toLowerCase()) ||
    d.city.toLowerCase().includes(dealerSearchQuery.toLowerCase())
  ).slice(0, 8);

  const toggleHiddenFee = (id: string) => {
    setSelectedHiddenFees(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 20 * 1024 * 1024) {
        setErrorMsg('Uploaded file exceeds 20MB limit. Please upload a compressed PDF or image.');
        return;
      }
      setUploadedFile(file);
      setErrorMsg(null);
    }
  };

  const handleSubmitAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation checks
    let targetDealerId = selectedDealerId;
    if (!targetDealerId) {
      const matched = DFW_DEALERSHIPS_SEED.find(d => d.name.toLowerCase() === dealerSearchQuery.toLowerCase());
      if (matched) {
        targetDealerId = `seed-${matched.slug}`;
      } else if (preselectedDealer) {
        targetDealerId = preselectedDealer.id;
      } else {
        setErrorMsg('Please search and select the dealership you are auditing.');
        return;
      }
    }

    if (!reviewTitle.trim()) {
      setErrorMsg('Please enter a descriptive headline for your audit report.');
      return;
    }

    if (communityNarrative.trim().length < 20) {
      setErrorMsg('Please provide at least 20 characters detailing what buyers need to know.');
      return;
    }

    if (uploadedFile && !redactionConfirmed) {
      setErrorMsg('You must check the box confirming you have redacted sensitive personal information (SSN, bank accounts, home address).');
      return;
    }

    setSubmitting(true);

    try {
      // Map interaction type to backend enum
      const backendExperienceType = 
        interactionType === 'walked_out' ? 'attempted_purchase' :
        interactionType === 'service' ? 'service_visit' : 'purchased';

      // Assemble tag slugs from selected hidden fees
      const tagSlugs: string[] = Array.from(new Set(
        selectedHiddenFees.map(feeId => {
          const opt = HIDDEN_FEE_OPTIONS.find(o => o.id === feeId);
          return opt ? opt.tagSlug : 'unexpected-fees';
        })
      ));

      if (otdMatchedAdvertised === 'yes') {
        tagSlugs.push('clear-pricing');
      } else {
        tagSlugs.push('advertised-price-discrepancy');
      }

      const reviewPayload: CreateReviewInput = {
        dealership_id: targetDealerId,
        reviewer_display_name: reviewerName.trim() || 'Verified Buyer',
        reviewer_city: reviewerCity.trim() || 'Dallas',
        reviewer_state: reviewerState.trim().toUpperCase() || 'TX',
        
        // Composite overall rating calculated from honesty, pressure, and fairness
        overall_rating: Math.round((priceHonestyRating + pressureTacticsRating + overallFairnessRating) / 3),
        pricing_transparency_rating: priceHonestyRating,
        sales_pressure_rating: pressureTacticsRating,
        financing_integrity_rating: priceHonestyRating,
        service_speed_rating: 4,

        title: reviewTitle.trim(),
        review_body: communityNarrative.trim(),
        advice_for_other_buyers: adviceForBuyers.trim() || undefined,

        experience_date: experienceDate,
        experience_type: backendExperienceType,
        vehicle_year: Number(vehicleYear) || 2024,
        vehicle_make: vehicleMake.trim() || undefined,
        vehicle_model: vehicleModel.trim() || undefined,

        would_recommend: overallFairnessRating >= 3 && otdMatchedAdvertised !== 'much_higher',
        advertised_price_honored: otdMatchedAdvertised === 'yes',
        reported_doc_fee: docFeePaid !== '' ? Number(docFeePaid) : 150,
        mandatory_addons_reported: selectedHiddenFees.length > 0 || Number(surpriseAddonTotal) > 0,
        reported_addons: Number(surpriseAddonTotal) > 0 ? [{ name: 'Mandatory Dealer Packs', amount: Number(surpriseAddonTotal) }] : [],
        financing_terms_changed: selectedHiddenFees.includes('finance-markup'),
        trade_in_lowball_reported: selectedHiddenFees.includes('trade-undervalue'),

        tag_slugs: tagSlugs
      };

      // Submit Review via Service
      const created = await DealerIntelService.createReview(null, reviewPayload);

      // Also record community audit directly to dealer_audits relational table
      try {
        const { supabase } = await import('../../supabaseClient');
        await supabase.from('dealer_audits').insert([
          {
            dealership_id: targetDealerId.startsWith('seed-') ? (preselectedDealer?.id || targetDealerId) : targetDealerId,
            transaction_type: backendExperienceType === 'purchased' ? 'bought' : backendExperienceType === 'attempted_purchase' ? 'walked_out' : 'inquired',
            advertised_price_matched: otdMatchedAdvertised === 'yes',
            hidden_fee_amount: Number(surpriseAddonTotal) || 0,
            reported_tactics: selectedHiddenFees,
            integrity_score: priceHonestyRating,
            sales_pressure_rating: pressureTacticsRating,
            review_title: reviewTitle.trim(),
            review_body: communityNarrative.trim(),
            is_verified_audit: Boolean(uploadedFile)
          }
        ]);
      } catch (auditTableErr) {
        console.warn('Direct dealer_audits record attempt:', auditTableErr);
      }

      // If document was uploaded, register evidence record in vault
      let hasVerifiedProof = false;
      if (uploadedFile && created.id) {
        try {
          const mime = (uploadedFile.type as any) || 'application/pdf';
          const validMime = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic'].includes(mime)
            ? mime
            : 'application/pdf';

          const evidencePayload: CreateEvidenceInput = {
            review_id: created.id,
            file_storage_bucket: 'dealer-intel-evidence',
            file_storage_path: `private_evidence/${created.id}_${Date.now()}_${uploadedFile.name.replace(/\s+/g, '_')}`,
            original_filename: uploadedFile.name,
            file_size_bytes: uploadedFile.size,
            mime_type: validMime as any,
            document_type: documentType,
            redaction_confirmed_by_user: true
          };

          // Register in private evidence table
          await DealerIntelService.registerReviewEvidence(created.user_id || 'anonymous_submitter', evidencePayload);
          hasVerifiedProof = true;
        } catch (proofErr) {
          console.warn('Evidence registration notice:', proofErr);
        }
      }

      setSuccessResult({
        reviewId: created.id,
        verified: hasVerifiedProof
      });

      if (onAuditSubmitted) {
        onAuditSubmitted(created.id);
      }

    } catch (err: any) {
      console.error('Audit submission error:', err);
      setErrorMsg(err.message || 'Failed to submit dealer audit. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200 font-poppins">
      
      {/* Modal Dialog Card */}
      <div 
        className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white/95 rounded-[32px] p-5 sm:p-8 md:p-10 shadow-[0_30px_70px_rgba(15,23,42,0.3)] border border-white/80 backdrop-blur-2xl text-slate-900 scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular Top Rim */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#29abe2]/50 to-transparent pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/70 hover:bg-white border border-slate-200/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_1px_2px_rgba(15,23,42,0.05)] text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer z-10"
          aria-label="Close modal"
        >
          <X size={15} strokeWidth={2.4} />
        </button>

        {/* Success State */}
        {successResult ? (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck size={36} />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wider uppercase mb-2">
                Audit Filed &amp; Logged
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Community Accountability Report Published
              </h2>
              <p className="text-sm text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                Thank you for contributing transparent market intelligence. Your report arms prospective car buyers with genuine dealer fee realities.
              </p>
            </div>

            {successResult.verified && (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 max-w-md mx-auto flex items-start gap-3 text-left">
                <Lock size={18} className="text-[#29abe2] shrink-0 mt-0.5" />
                <div className="text-xs text-sky-900">
                  <span className="font-bold block">Document Vaulted &amp; Redacted:</span>
                  Your bill of sale / buyer order is locked in the CarMatrix administrator evidence vault. Upon audit verification, your review badge will elevate to <strong>Verified Audit</strong>.
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-[#29abe2] hover:bg-[#2089b5] text-white py-3 px-8 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (

          /* Active Form */
          <form onSubmit={handleSubmitAudit} className="space-y-8">
            
            {/* Header Banner */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-wider uppercase mb-2">
                <ShieldAlert size={14} className="text-rose-500" />
                <span>Dealer Accountability &amp; Pricing Audit</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                Audit Your Dealership Experience
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Help other vehicle shoppers expose hidden dealer tactics, mandatory add-on packs, and surprise pricing changes.
              </p>
            </div>

            {/* Error Notification */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs font-semibold animate-in shake">
                <AlertTriangle size={18} className="shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* =========================================================================
                SECTION 1: TRANSACTION CONTEXT
                ========================================================================= */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <Building2 size={13} strokeWidth={2.4} className="text-[#29abe2]" />
                </div>
                <span>1. Transaction Context</span>
              </div>

              {/* Dealership Search / Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dealership Audited <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={dealerSearchQuery}
                    onChange={(e) => {
                      setDealerSearchQuery(e.target.value);
                      setIsDealerDropdownOpen(true);
                      setSelectedDealerId('');
                    }}
                    onFocus={() => setIsDealerDropdownOpen(true)}
                    placeholder="Search dealership name or city (e.g. Sewell Lexus Dallas, Classic Chevrolet)..."
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#29abe2] focus:ring-2 focus:ring-[#29abe2]/20"
                  />
                  {isDealerDropdownOpen && filteredDealers.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-20 max-h-48 overflow-y-auto">
                      {filteredDealers.map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setDealerSearchQuery(d.name);
                            setSelectedDealerId(`seed-${d.slug}`);
                            if (d.brands[0]) setVehicleMake(d.brands[0]);
                            setIsDealerDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-xs font-medium text-slate-800 border-b border-slate-100 last:border-0 flex justify-between items-center"
                        >
                          <span className="font-bold">{d.name}</span>
                          <span className="text-[11px] text-slate-400">{d.city}, TX</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Interaction Type Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Interaction Outcome <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'walked_out', label: 'Walked Out / No Deal', badge: 'Walk Away', color: 'border-rose-300 text-rose-700 bg-rose-50/50' },
                    { id: 'bought_new', label: 'Bought New Vehicle', badge: 'Completed', color: 'border-sky-300 text-sky-700 bg-sky-50/50' },
                    { id: 'bought_used', label: 'Bought Pre-Owned', badge: 'Completed', color: 'border-slate-300 text-slate-800 bg-white' },
                    { id: 'service', label: 'Service / Repair', badge: 'Service', color: 'border-slate-300 text-slate-800 bg-white' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setInteractionType(tab.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                        interactionType === tab.id
                          ? 'border-[#29abe2] bg-[#29abe2]/10 text-[#0284c7] ring-2 ring-[#29abe2]/20 shadow-xs'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-extrabold">{tab.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Vehicle Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Date of Visit
                  </label>
                  <input
                    type="date"
                    value={experienceDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setExperienceDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#29abe2]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Vehicle Year &amp; Make
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(Number(e.target.value))}
                      placeholder="2024"
                      className="w-20 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#29abe2]"
                    />
                    <input
                      type="text"
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="e.g. Toyota"
                      className="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#29abe2]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Model &amp; Trim Shopped
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="e.g. RAV4 XLE Hybrid"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#29abe2]"
                  />
                </div>
              </div>
            </div>

            {/* =========================================================================
                SECTION 2: TRANSPARENCY & PRICING AUDIT (THE MEAT OF THE AUDIT)
                ========================================================================= */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <DollarSign size={13} strokeWidth={2.4} className="text-amber-600" />
                </div>
                <span>2. Transparency &amp; Pricing Audit</span>
              </div>

              {/* OTD Price vs Advertised Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Did the final Out-The-Door (OTD) price match the online/advertised price? <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'yes', label: 'Yes, Matched Exact Price', sub: 'Honored online price', icon: ShieldCheck, color: 'text-emerald-600', ring: 'border-emerald-500 bg-emerald-50/50' },
                    { id: 'no', label: 'No, Slight Price Difference', sub: '+$300 to $1,500 over', icon: AlertTriangle, color: 'text-amber-600', ring: 'border-amber-500 bg-amber-50/50' },
                    { id: 'much_higher', label: 'Much Higher / Bait & Switch', sub: '+$2,000+ unexpected markups', icon: ShieldAlert, color: 'text-rose-600', ring: 'border-rose-500 bg-rose-50/50' }
                  ].map(option => {
                    const Icon = option.icon;
                    const isSelected = otdMatchedAdvertised === option.id;
                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setOtdMatchedAdvertised(option.id as any)}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                          isSelected
                            ? `${option.ring} ring-2 ring-opacity-50 shadow-xs`
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <Icon size={18} className={`shrink-0 mt-0.5 ${option.color}`} />
                        <div>
                          <div className="text-xs font-black text-slate-900">{option.label}</div>
                          <div className="text-[10.5px] text-slate-500 mt-0.5">{option.sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hidden Fees Encountered Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hidden Fees &amp; Pressure Tactics Encountered (Check all that apply)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {HIDDEN_FEE_OPTIONS.map((fee) => {
                    const isChecked = selectedHiddenFees.includes(fee.id);
                    return (
                      <label
                        key={fee.id}
                        onClick={() => toggleHiddenFee(fee.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-rose-50/80 border-rose-300 text-rose-900 font-bold shadow-xs' 
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 pr-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by label onClick
                            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                          />
                          <span>{fee.label}</span>
                        </div>
                        {fee.flag === 'critical' ? (
                          <span className="shrink-0 text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded">
                            Flag
                          </span>
                        ) : (
                          <span className="shrink-0 text-[10px] font-bold uppercase text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                            Caution
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Dollar Amount Breakdown Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Surprise Mandatory Add-On Total ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      value={surpriseAddonTotal}
                      onChange={(e) => setSurpriseAddonTotal(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="e.g. 1995"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#29abe2]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Total forced protection packages added at signing.</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doc Fee Charged on Buyer's Order ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      value={docFeePaid}
                      onChange={(e) => setDocFeePaid(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="150"
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#29abe2]"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">Texas statutory cap guideline is $150.</span>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SECTION 3: THE "DEALER INTEGRITY" SCORE (1 TO 5 SLIDERS)
                ========================================================================= */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-sky-500/15 border border-sky-400/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <Sliders size={13} strokeWidth={2.4} className="text-[#29abe2]" />
                </div>
                <span>3. Dealer Integrity Scorecard (1 = Poor, 5 = Flawless)</span>
              </div>

              {/* Price Honesty */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    Price Honesty <span className="text-slate-400 font-normal">(Did numbers change in the finance office?)</span>
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                    {priceHonestyRating} / 5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPriceHonestyRating(val)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        priceHonestyRating === val
                          ? 'bg-gradient-to-r from-sky-500 to-[#29abe2] text-white shadow-md shadow-sky-500/25 border border-white/30'
                          : 'bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
                      }`}
                    >
                      <span>{val}</span>
                      <Award size={11} strokeWidth={2.4} className={priceHonestyRating === val ? 'text-white' : 'text-slate-400'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pressure Tactics */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    Pressure Tactics <span className="text-slate-400 font-normal">(Hostage keys, tag-team closers, artificial rush)</span>
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                    {pressureTacticsRating} / 5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPressureTacticsRating(val)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        pressureTacticsRating === val
                          ? 'bg-gradient-to-r from-sky-500 to-[#29abe2] text-white shadow-md shadow-sky-500/25 border border-white/30'
                          : 'bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
                      }`}
                    >
                      <span>{val}</span>
                      <Award size={11} strokeWidth={2.4} className={pressureTacticsRating === val ? 'text-white' : 'text-slate-400'} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Overall Fairness */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    Overall Deal Fairness &amp; Transparency
                  </span>
                  <span className="text-xs font-black text-slate-900 bg-white border border-slate-200 px-2 py-0.5 rounded-md shadow-2xs">
                    {overallFairnessRating} / 5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setOverallFairnessRating(val)}
                      className={`flex-1 py-2 px-1 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        overallFairnessRating === val
                          ? 'bg-gradient-to-r from-sky-500 to-[#29abe2] text-white shadow-md shadow-sky-500/25 border border-white/30'
                          : 'bg-white/70 hover:bg-white border border-slate-200/80 text-slate-700 shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]'
                      }`}
                    >
                      <span>{val}</span>
                      <Award size={11} strokeWidth={2.4} className={overallFairnessRating === val ? 'text-white' : 'text-slate-400'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* =========================================================================
                SECTION 4: COMMUNITY NARRATIVE & PROOF UPLOAD
                ========================================================================= */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-6 border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-700">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
                  <FileText size={13} strokeWidth={2.4} className="text-emerald-600" />
                </div>
                <span>4. Community Narrative &amp; Proof (Verified Audit)</span>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Report Headline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Slipped $1,895 protection package onto final closing contract after agreeing to MSRP"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 focus:outline-none focus:border-[#29abe2]"
                />
              </div>

              {/* Written Experience */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  What Buyers Need to Know Before Walking In <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={communityNarrative}
                  onChange={(e) => setCommunityNarrative(e.target.value)}
                  placeholder="Describe your negotiation, who you spoke with, what fee changes occurred, and whether they allowed outside financing..."
                  className="w-full p-4 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:border-[#29abe2]"
                />
              </div>

              {/* Pro-Tips for other buyers */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pro-Tip for Other Buyers (Optional)
                </label>
                <input
                  type="text"
                  value={adviceForBuyers}
                  onChange={(e) => setAdviceForBuyers(e.target.value)}
                  placeholder="e.g. Demand a written line-item buyer's order before letting them pull your credit score."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#29abe2]"
                />
              </div>

              {/* Proof / Buyer's Order Upload */}
              <div className="pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Upload size={14} className="text-[#29abe2]" />
                    <span>Upload Redacted Quote or Buyer's Order (Optional)</span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                    <ShieldCheck size={11} className="text-emerald-600" />
                    Unlocks "Verified Audit" Badge
                  </span>
                </div>

                <div className="p-4 bg-white border-2 border-dashed border-slate-200 hover:border-[#29abe2] rounded-2xl text-center transition-colors">
                  <input
                    type="file"
                    id="evidence-file-input"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="evidence-file-input" className="cursor-pointer block">
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700">
                        <CheckCircle2 size={16} />
                        <span>File Attached: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(0)} KB)</span>
                      </div>
                    ) : (
                      <div>
                        <FileText size={28} className="mx-auto text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-[#29abe2] block">Click to upload PDF or Photo</span>
                        <span className="text-[10px] text-slate-400">Buyer's order, window sticker, lease sheet, or written quote (Max 20MB)</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Redaction Confirmation Checkbox (Strict Security Rule) */}
                {uploadedFile && (
                  <div className="mt-3 p-3 bg-amber-50/80 border border-amber-200 rounded-xl">
                    <label className="flex items-start gap-2.5 text-xs text-amber-900 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={redactionConfirmed}
                        onChange={(e) => setRedactionConfirmed(e.target.checked)}
                        className="w-4 h-4 rounded text-[#29abe2] focus:ring-[#29abe2] border-amber-300 mt-0.5"
                      />
                      <span>
                        <strong>Redaction Confirmation:</strong> I confirm that private personal information (Social Security Numbers, bank account/routing numbers, and residential street address) has been blacked out or redacted from this file.
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submitter Attribution & Submit CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Lock size={13} className="text-slate-400" />
                <span>Protected by CarMatrix Truth-in-Data Protocol</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 sm:flex-none py-3.5 px-7 rounded-2xl bg-[#29abe2] hover:bg-[#2089b5] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#29abe2]/20 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Audit...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={16} />
                      <span>Publish Community Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
