import React, { useState, useEffect } from 'react';
import { Cookie, Shield, X } from 'lucide-react';

interface CookieConsentBannerProps {
  onNavigate: (path: string) => void;
}

export default function CookieConsentBanner({ onNavigate }: CookieConsentBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('carmatrix_cookie_consent');
      if (!consent) {
        // Show after a brief delay for smoother UX
        const timer = setTimeout(() => setVisible(true), 800);
        return () => clearTimeout(timer);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('carmatrix_cookie_consent', 'all');
    } catch {}
    setVisible(false);
  };

  const handleEssentialOnly = () => {
    try {
      localStorage.setItem('carmatrix_cookie_consent', 'essential');
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-[460px] z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl text-white">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <Cookie size={18} />
            <span>Cookie & Privacy Notice</span>
          </div>
          <button 
            onClick={handleEssentialOnly}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss cookie notice"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          CarMatrix and our verified commercial partners (including affiliate networks like Impact.com) use cookies and anonymous identifiers to optimize research tools and attribute referral transactions. For details, view our{' '}
          <button 
            onClick={() => onNavigate('privacy')}
            className="text-sky-400 underline hover:text-sky-300 font-medium cursor-pointer"
          >
            Privacy Policy
          </button>{' '}
          and{' '}
          <button 
            onClick={() => onNavigate('affiliate_disclosure')}
            className="text-sky-400 underline hover:text-sky-300 font-medium cursor-pointer"
          >
            Affiliate Disclosure
          </button>.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
          <button 
            onClick={handleEssentialOnly}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button 
            onClick={handleAccept}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#29abe2] text-white hover:bg-[#2089b5] transition-colors shadow-md shadow-sky-500/20 cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
