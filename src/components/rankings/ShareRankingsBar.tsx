import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Linkedin, 
  Facebook 
} from 'lucide-react';
import { useRankingsAnalytics } from '@/src/hooks/useRankingsAnalytics';

interface ShareRankingsBarProps {
  category: string;
  totalCount: number;
  className?: string;
}

export const ShareRankingsBar: React.FC<ShareRankingsBarProps> = ({
  category,
  totalCount,
  className = '',
}) => {
  const [copied, setCopied] = useState(false);
  const { logEvent } = useRankingsAnalytics();

  const categoryName = category === 'suv' ? 'SUVs & Crossovers'
    : category === 'sedan' ? 'Sedans'
    : category === 'truck' ? 'Trucks'
    : category === 'hybrid_ev' ? 'Hybrids & EVs'
    : category === 'wagon_hatchback' ? 'Wagons & Hatchbacks'
    : 'All Categories';

  const shareTitle = `Top 10 Most Reliable Vehicles (${categoryName}) — CarMatrix Reliability Scores`;
  const shareText = `Explore the top 10 most reliable vehicles in ${categoryName.toLowerCase()}, scored strictly using official free NHTSA safety defect data on CarMatrix:`;

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
      logEvent('share_link_copied', { category });
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Social Sharing Handlers
  const handleTwitterShare = () => {
    const url = encodeURIComponent(getShareUrl());
    const text = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank', 'noopener,noreferrer');
    logEvent('share_social_clicked', { platform: 'twitter', category });
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank', 'noopener,noreferrer');
    logEvent('share_social_clicked', { platform: 'facebook', category });
  };

  const handleLinkedInShare = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank', 'noopener,noreferrer');
    logEvent('share_social_clicked', { platform: 'linkedin', category });
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs ${className}`}>
      <div className="flex items-center gap-3 text-xs text-slate-700">
        <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200/80 flex items-center justify-center text-[#29abe2] shrink-0">
          <Share2 size={15} />
        </div>
        <div>
          <span className="font-bold text-slate-900 block">Share Vehicle Reliability Scores</span>
          <span className="text-[11px] text-slate-500">Official NHTSA safety defect scores &bull; {categoryName}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end flex-wrap">
        {/* Copy Link Button */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200/80 shadow-2xs"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-600 animate-in zoom-in-50 duration-200" />
              <span className="text-emerald-700">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} className="text-slate-500" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        {/* X / Twitter */}
        <button
          type="button"
          onClick={handleTwitterShare}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200/70 transition-colors cursor-pointer"
          aria-label="Share on X"
          title="Share on X"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          type="button"
          onClick={handleLinkedInShare}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-700 border border-slate-200/70 transition-colors cursor-pointer"
          aria-label="Share on LinkedIn"
          title="Share on LinkedIn"
        >
          <Linkedin size={14} />
        </button>

        {/* Facebook */}
        <button
          type="button"
          onClick={handleFacebookShare}
          className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 border border-slate-200/70 transition-colors cursor-pointer"
          aria-label="Share on Facebook"
          title="Share on Facebook"
        >
          <Facebook size={14} />
        </button>
      </div>
    </div>
  );
};

export default ShareRankingsBar;
