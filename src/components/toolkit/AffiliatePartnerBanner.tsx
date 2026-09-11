import React from 'react';
import { ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { 
  AFFILIATE_CONFIG, 
  AffiliateCategory, 
  getActivePartnerByCategory, 
  getAffiliateUrl 
} from '../../config/affiliates';

interface AffiliatePartnerBannerProps {
  category?: AffiliateCategory;
  partnerId?: string;
  extraParams?: Record<string, string>;
  className?: string;
}

/**
 * Reusable affiliate callout card.
 * If no partner is active or enabled for the category/id, this returns null (renders nothing).
 */
export default function AffiliatePartnerBanner({
  category,
  partnerId,
  extraParams,
  className = ""
}: AffiliatePartnerBannerProps) {
  if (!AFFILIATE_CONFIG.enableAffiliatesSitewide) return null;

  const partner = partnerId 
    ? AFFILIATE_CONFIG.partners[partnerId]
    : category 
      ? getActivePartnerByCategory(category)
      : null;

  if (!partner || !partner.isEnabled) return null;

  const trackingUrl = getAffiliateUrl(partner.id, extraParams);
  if (!trackingUrl) return null;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border border-slate-700/80 shadow-lg ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            {partner.badgeText && (
              <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#29abe2]/20 border border-[#29abe2]/40 text-sky-300">
                <Sparkles size={10} />
                {partner.badgeText}
              </span>
            )}
            <span className="text-[11px] font-semibold text-slate-400">
              Verified Partner: {partner.name}
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
            {partner.headline}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {partner.description}
          </p>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#29abe2] to-sky-500 hover:from-sky-400 hover:to-[#29abe2] text-white text-xs font-bold transition-all shadow-md shadow-sky-500/25 cursor-pointer whitespace-nowrap"
          >
            <span>{partner.ctaText}</span>
            <ExternalLink size={13} />
          </a>
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <ShieldCheck size={11} className="text-emerald-400" />
            <span>Secure Partner Portal</span>
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-800 text-[10px] text-slate-500 leading-tight">
        {AFFILIATE_CONFIG.ftcDisclosureText}
      </div>
    </div>
  );
}
