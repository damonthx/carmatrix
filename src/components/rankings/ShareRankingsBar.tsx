import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Linkedin, 
  Facebook 
} from 'lucide-react';
import { ValuationChannel, TIER_DEFINITIONS } from '@/lib/services/rankingsService';
import { useRankingsAnalytics } from '@/src/hooks/useRankingsAnalytics';

interface ShareRankingsBarProps {
  channel: ValuationChannel;
  tierSlug: string | null;
  bodyType: string;
  totalCount: number;
  className?: string;
}

export const ShareRankingsBar: React.FC<ShareRankingsBarProps> = ({
  channel,
  tierSlug,
  bodyType,
  totalCount,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const { logEvent } = useRankingsAnalytics();

  // Compute descriptive metadata for sharing
  const tierDef = tierSlug && TIER_DEFINITIONS[channel][tierSlug] 
    ? TIER_DEFINITIONS[channel][tierSlug].label 
    : 'All Price Tiers';

  const channelLabel = channel === 'private_party' ? 'Street Cash / Private Party' : 'Dealer Retail';
  const categoryLabel = bodyType !== 'all' ? `${bodyType}s` : 'Used Cars';

  const shareTitle = `Top-Rated ${categoryLabel} (${tierDef}) — ${channelLabel}`;
  const shareText = `Found the top-rated ${categoryLabel.toLowerCase()} (${tierDef}) based on true ${channelLabel.toLowerCase()} value—before dealer markups. Check the CarMatrix rankings:`;

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'https://www.carmatrix.online/rankings';
  };

  // 1-Click Copy Link
  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      logEvent('share_rankings_triggered', { sharePlatform: 'clipboard', channel, tier: tierSlug });
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.warn('Failed to copy link:', e);
    }
  };

  // Native Web Share API (mobile Safari / Chrome)
  const handleNativeShare = async () => {
    const url = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: url,
        });
        logEvent('share_rankings_triggered', { sharePlatform: 'native_share', channel, tier: tierSlug });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  // Social direct triggers
  const handleSocialClick = (platform: 'x' | 'linkedin' | 'facebook') => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(shareText);
    let target = '';

    if (platform === 'x') {
      target = `https://twitter.com/intent/tweet?text=${text}&url=${url}&via=CarMatrixApp`;
    } else if (platform === 'linkedin') {
      target = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    } else if (platform === 'facebook') {
      target = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    }

    if (target && typeof window !== 'undefined') {
      window.open(target, '_blank', 'width=600,height=500,noopener,noreferrer');
      logEvent('share_rankings_triggered', { sharePlatform: platform, channel, tier: tierSlug });
    }
  };

  return (
    <div className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-2xs flex items-center justify-between sm:justify-start gap-2 text-xs shrink-0 ${className}`}>
      <div className="flex items-center gap-1.5 text-slate-700 pl-1">
        <div className="w-5 h-5 rounded-md bg-sky-500/10 border border-sky-400/30 backdrop-blur-md flex items-center justify-center text-[#29abe2] shadow-2xs shrink-0">
          <Share2 size={12} strokeWidth={2.4} />
        </div>
        <span className="font-bold text-slate-800 text-xs whitespace-nowrap">
          Share these rankings
        </span>
      </div>

      <div className="h-3.5 w-px bg-slate-200 shrink-0 hidden sm:block mx-0.5" />

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer border ${
            copied
              ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs'
              : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 shadow-2xs'
          }`}
          title="Copy link to clipboard"
        >
          <div className={`w-3.5 h-3.5 flex items-center justify-center shrink-0 ${copied ? 'text-white' : 'text-slate-500'}`}>
            {copied ? <Check size={11} strokeWidth={2.6} /> : <Copy size={11} strokeWidth={2.4} />}
          </div>
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Native Web Share button (visible on mobile / supported devices) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            type="button"
            onClick={handleNativeShare}
            className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold bg-[#29abe2]/10 hover:bg-[#29abe2]/20 text-[#29abe2] border border-[#29abe2]/30 cursor-pointer transition-colors shadow-2xs"
            title="Share"
          >
            <Share2 size={11} strokeWidth={2.4} />
          </button>
        )}

        {/* X (formerly Twitter) */}
        <button
          type="button"
          onClick={() => handleSocialClick('x')}
          className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-black text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs border border-white/10"
          title="Share on X"
          aria-label="Share on X"
        >
          <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={() => handleSocialClick('linkedin')}
          className="w-6 h-6 rounded-lg bg-[#0077b5] hover:bg-[#006097] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs border border-white/15"
          title="Share on LinkedIn"
          aria-label="Share on LinkedIn"
        >
          <Linkedin size={11} />
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={() => handleSocialClick('facebook')}
          className="w-6 h-6 rounded-lg bg-[#1877f2] hover:bg-[#0f66d8] text-white flex items-center justify-center transition-all duration-200 hover:scale-105 cursor-pointer shadow-xs border border-white/15"
          title="Share on Facebook"
          aria-label="Share on Facebook"
        >
          <Facebook size={11} />
        </button>
      </div>
    </div>
  );
};

export default ShareRankingsBar;
